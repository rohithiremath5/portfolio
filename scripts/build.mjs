import { build } from 'vite';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { generatePublic } from './generate-public.mjs';

// Both bundles share the same clock snapshot, even across a year boundary.
const define = { __BUILD_YEAR__: JSON.stringify(new Date().getUTCFullYear()) };
await build({ define });
// Keep the renderer outside dist: Vercel only needs the static client output.
const rendererDir = await mkdtemp(resolve('.prerender-'));
try {
  await build({
    define,
    build: { ssr: 'src/entry-server.jsx', outDir: rendererDir },
  });
  const { render, portfolioContent } = await import(pathToFileURL(resolve(rendererDir, 'entry-server.js')));
  const template = await readFile('dist/index.html', 'utf8');
  const marker = '<div id="root"></div>';
  if (!template.includes(marker)) throw new Error('Missing prerender root in index.html');
  let html = template.replace(marker, () => `<div id="root">${render()}</div>`);
  const canonical = template.match(/rel="canonical" href="([^"]+)"/)[1];
  const { structuredData } = await generatePublic(portfolioContent, canonical);
  const json = JSON.stringify(structuredData).replaceAll('<', '\\u003c');
  html = html.replace('</head>', `<script type="application/ld+json">${json}</script></head>`);
  // This single-page site's small stylesheet is inlined. Inlining it
  // removes a render-blocking round trip without changing any styles.
  const stylesheet = html.match(/<link\b[^>]*rel="stylesheet"[^>]*href="(\/assets\/[^\"]+\.css)"[^>]*>/);
  if (!stylesheet) throw new Error('Missing production stylesheet');
  const css = await readFile(resolve('dist', stylesheet[1].slice(1)), 'utf8');
  html = html.replace(stylesheet[0], () => `<style data-prerender-css>${css.replace(/<\/style/gi, '<\\/style')}</style>`);
  await writeFile('dist/index.html', html);
  console.log('Prerendered portfolio content into dist/index.html');
  console.log('Generated profile.json, profile.md, llms.txt, sitemap.xml and resume.pdf');
} finally {
  await rm(rendererDir, { recursive: true, force: true });
}
