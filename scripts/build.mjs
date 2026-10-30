import { build } from 'vite';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

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
  const { render } = await import(pathToFileURL(resolve(rendererDir, 'entry-server.js')));
  const template = await readFile('dist/index.html', 'utf8');
  const marker = '<div id="root"></div>';
  if (!template.includes(marker)) throw new Error('Missing prerender root in index.html');
  let html = template.replace(marker, () => `<div id="root">${render()}</div>`);
  // This single-page site's stylesheet is only ~7 kB compressed. Inlining it
  // removes a render-blocking round trip without changing any styles.
  const stylesheet = html.match(/<link\b[^>]*rel="stylesheet"[^>]*href="(\/assets\/[^\"]+\.css)"[^>]*>/);
  if (!stylesheet) throw new Error('Missing production stylesheet');
  const css = await readFile(resolve('dist', stylesheet[1].slice(1)), 'utf8');
  html = html.replace(stylesheet[0], () => `<style data-prerender-css>${css.replace(/<\/style/gi, '<\\/style')}</style>`);
  await writeFile('dist/index.html', html);
  console.log('Prerendered portfolio content into dist/index.html');
} finally {
  await rm(rendererDir, { recursive: true, force: true });
}
