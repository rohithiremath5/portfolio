import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const html = await readFile('dist/index.html', 'utf8');
test('all essential sections and resume content are in static HTML', () => {
  for (const id of ['home', 'about', 'projects', 'experience', 'skills', 'education', 'contact']) {
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
  assert.equal(new Set(fontUrls).size, 2);
  for (const url of fontUrls) await access(`dist${url}`);
});

const baseline = JSON.parse(await readFile('tests/content-baseline.json', 'utf8'));
const profile = JSON.parse(await readFile('dist/profile.json', 'utf8'));
const markdown = await readFile('dist/profile.md', 'utf8');
const normalize = value => value.replace(/\s+/g, ' ').replace(/\s+([.,])/g, '$1').trim();
const text = normalize(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, '')
  .replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
const collectStrings = (value, skip = []) => typeof value === 'string' ? [value] : Array.isArray(value) ? value.flatMap(item => collectStrings(item, skip)) : value && typeof value === 'object' ? Object.entries(value).filter(([key]) => !skip.includes(key)).flatMap(([, item]) => collectStrings(item, skip)) : [];

test('original content module and resume PDF are byte-for-byte unchanged', async () => {
  for (const [file, expected] of Object.entries(baseline.sha256)) {
    assert.equal(createHash('sha256').update(await readFile(file)).digest('hex'), expected, file);
  }
  assert.deepEqual(await readFile('dist/resume.pdf'), await readFile('src/data/Rohit_N_Hiremath_Frontend_developer.pdf'));
});

test('every original visible statement and link survives in production HTML', () => {
  for (let statement of baseline.visibleStatements) {
    statement = statement.replace(/^(?:\d{2}|\+) /, ''); // Section numbering is presentation.
    statement = statement.replace(/© \d{4}/, `© ${new Date().getUTCFullYear()}`);
    assert.ok(text.includes(normalize(statement)), statement);
  }
  for (const href of baseline.links) assert.ok(html.includes(`href="${href}"`), href);
  const data = baseline.content;
  for (const value of collectStrings(data, ['resume', 'linkedin', 'github', 'visual', 'icon'])) {
    assert.ok(text.includes(normalize(value)), value);
  }
});

test('all professional data in JSON and Markdown matches the frozen baseline', () => {
  const data = baseline.content;
  for (const [key, expected] of Object.entries({
    name: data.personalInfo.name, title: data.personalInfo.designation, location: data.personalInfo.location,
    tagline: data.personalInfo.tagline, summary: data.personalInfo.bio, currentFocus: data.personalInfo.currentFocus,
    experience: data.experiences, projects: data.projects, additionalProjects: data.extensions,
    education: data.education, stats: data.stats,
  })) assert.deepEqual(profile[key], expected, key);
  assert.deepEqual(profile.contact, { email: data.personalInfo.email, phone: data.personalInfo.phone });
  assert.equal(profile.professionalLinks.linkedin, data.personalInfo.linkedin);
  assert.equal(profile.professionalLinks.github, data.personalInfo.github);
  assert.deepEqual(profile.skills.map(group => group.technologies), Object.values(data.skills));
  for (const value of collectStrings(data, ['resume', 'visual', 'icon'])) {
    assert.ok(normalize(markdown).includes(normalize(value)), value);
  }
  for (const heading of ['Professional Summary', 'Technical Skills', 'Professional Experience', 'Projects', 'Additional Projects', 'Education', 'Contact']) {
    assert.ok(markdown.includes(`## ${heading}\n`), heading);
  }
  for (const note of profile.notes) assert.ok(text.includes(note) && markdown.includes(note));
});

test('semantic profile, open project details, structured data and social metadata', async () => {
  const json = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(json['@type'], 'Person');
  assert.equal(json.name, profile.name);
  assert.equal(json.jobTitle, profile.title);
  assert.equal(json.description, profile.summary);
  assert.deepEqual(json.sameAs, [profile.professionalLinks.linkedin, profile.professionalLinks.github]);
  assert.ok(!('image' in json));
  assert.equal((html.match(/<details[^>]*open=""/g) || []).length, 4);
  for (const property of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt']) assert.ok(html.includes(`property="${property}"`), property);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  const png = await readFile('dist/og.png');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.match(await readFile('dist/llms.txt', 'utf8'), /profile\.md/);
});

test('Vercel configuration serves files directly and has no SPA catch-all', async () => {
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  assert.equal(config.buildCommand, 'npm run build');
  assert.equal(config.outputDirectory, 'dist');
  assert.deepEqual(config.rewrites, [{ source: '/resume', destination: '/resume.pdf' }]);
  assert.equal(config.headers.find(rule => rule.source === '/profile.md').headers[0].value, 'text/markdown; charset=utf-8');
  assert.equal(config.headers.find(rule => rule.source === '/profile.json').headers[0].value, 'application/json; charset=utf-8');
});
