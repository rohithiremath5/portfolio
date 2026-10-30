import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';

const html = await readFile('dist/index.html', 'utf8');
test('all essential sections and resume content are in static HTML', () => {
  for (const id of ['home', 'about', 'projects', 'experience', 'skills', 'contact']) {
    assert.match(html, new RegExp(`<section[^>]*id="${id}"`));
  }
  for (const text of ['Thoughtful code.', 'Enterprisebot', 'Omni-Channel Analytics Dashboard',
    'React.js', 'rohithiremath05@gmail.com', 'Rohit N Hiremath']) assert.ok(html.includes(text), text);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.doesNotMatch(html, /<div id="root"><\/div>|opacity:\s*0/);
});
test('rendered asset URLs resolve inside the static output', async () => {
  const urls = [...html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)].map(match => match[1]);
  assert.ok(urls.some(url => url.endsWith('.pdf')));
  for (const url of urls) await access(`dist${url}`);
});
test('robots permit crawlers and output contains no server bundle', async () => {
  assert.match(await readFile('dist/robots.txt', 'utf8'), /User-agent: \*\s+Allow: \//);
  assert.match(html, /name="robots" content="index, follow"/);
  assert.ok(!(await readdir('dist')).some(name => /server|prerender/.test(name)));
});
test('canonical, sitemap and local font assets are shipped together', async () => {
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
  assert.ok((await readFile('dist/sitemap.xml', 'utf8')).includes(`<loc>${canonical}</loc>`));
  assert.ok((await readFile('dist/robots.txt', 'utf8')).includes(`Sitemap: ${canonical}sitemap.xml`));
  const css = html.match(/<style data-prerender-css>([\s\S]*?)<\/style>/)[1];
  assert.doesNotMatch(html, /<link[^>]*rel="stylesheet"/);
  assert.doesNotMatch(css, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  const fontUrls = [...css.matchAll(/url\(["']?(\/fonts\/[^)"']+)/g)].map(match => match[1]);
  assert.equal(new Set(fontUrls).size, 4);
  for (const url of fontUrls) await access(`dist${url}`);
});
