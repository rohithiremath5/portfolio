# Rohit N Hiremath — Portfolio

A statically rendered React 18 / Vite portfolio, designed around engineering work,
professional experience, Chrome extensions, skills, education, and direct contact.
Deploy the generated `dist/` directory to Vercel. No runtime server or API keys are required.

## Development

```sh
npm ci
npm run dev
```

On Windows, use `npm.cmd` if PowerShell's execution policy blocks `npm.ps1`.

## Production validation

```sh
npm run build
npm test
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

With preview running, optional browser checks use Python, Playwright, and installed
Chrome. They use existing ignored tooling under `.codex-tmp/browser-python` when
available; otherwise install Playwright in your development environment.

```sh
python scripts/browser-check.py
```

Set `CHROME_PATH` to use Edge or another installed Chromium browser. Set
`BROWSER_NAME=edge` to keep its artifacts separately. Set `AXE_PATH` to a local
`axe.min.js` to enable automated WCAG checks; the script also discovers the existing
ignored Lighthouse/axe tooling. Screenshots and reports go into `.codex-tmp/redesign/`.
Browser tooling is optional and is not needed by Vercel or the build.

## Content and rendering

- `src/data/resumeData.js` is the authoritative professional content source.
- `src/data/siteCopy.js` contains the original page copy and skill category labels.
- The original resume is `src/data/Rohit_N_Hiremath_Frontend_developer.pdf`.
- `src/App.jsx` composes Hero → credibility → projects/extensions → experience →
  About → skills → education → contact. Existing anchors remain available.
- `src/index.css` holds the active design tokens, themes, layouts and motion rules.
- `scripts/build.mjs` first builds the client, then renders the same React tree at
  build time using `src/entry-server.jsx`. It inserts HTML and structured data into
  `dist/index.html` and removes the temporary renderer.
- `src/main.jsx` hydrates production HTML and mounts the empty Vite development root.
- `scripts/generate-public.mjs` creates synchronized profile files from the same
  module exports used by the website. Do not manually edit generated `dist/` files.

All professional content is present in the initial HTML response. JavaScript adds
theme preferences, active navigation, the mobile menu, and clipboard feedback.
With JavaScript disabled, navigation and native disclosures still work, and contact
and resume links remain accessible.

## Public files

| Path | Content |
| --- | --- |
| `/` | Complete prerendered portfolio |
| `/profile.json` | Structured profile with complete projects and experience |
| `/profile.md` | Complete professional profile in Markdown |
| `/llms.txt` | Supplemental links for compatible tools |
| `/robots.txt` | Existing public crawl policy, unchanged |
| `/sitemap.xml` | Canonical public HTML URL |
| `/resume.pdf` | Original, unmodified resume |
| `/resume` | Vercel rewrite to the PDF |
| `/og.png` | Typographic 1200 × 630 social preview |

The original hashed resume asset URL is also retained. `vercel.json` specifies MIME
types and the `/resume` rewrite; there is no SPA catch-all for missing documents.
Vite production preview mirrors these file types and returns 404 for missing
JSON, Markdown, XML, TXT, and PDF files.

## Content preservation

`tests/content-baseline.json` freezes the pre-redesign professional data, 74 visible
statements, 12 unique functional links, and SHA-256 fingerprints of the original
content module and PDF. Tests compare those against static HTML, JSON, and Markdown.
If you intentionally update your profile later, review and update the baseline in
the same change. Replacing the PDF does not automatically parse or rewrite content.

Project visuals are illustrative studies, not production screenshots. Resume-sourced
experience and user figures are labeled as such. The source has no project demos
or Chrome Web Store URLs; the design does not fabricate those links.

## Social preview

The checked-in `public/og.png` uses your name, title, location, and existing tagline.
After intentional identity changes, rebuild and regenerate it using:

```sh
python scripts/render-og.py
npm run build
```

This optional authoring script uses Playwright and the existing local DM Sans font.
The production build uses the checked-in PNG and requires no browser. No portrait
or stock imagery is used. Update canonical/social URLs in `index.html` and the
sitemap declaration in `public/robots.txt` if the production domain changes.

## Vercel deployment

Import this repository and keep the Vite preset. `vercel.json` sets:

```text
Build command: npm run build
Output directory: dist
```

Do not override the command with `vite build`: it would skip prerendering and profile
generation. Deploy through the existing Vercel project. After deployment, verify
View Source, the public files above, MIME types, missing-file 404s, and anonymous
access. Dashboard protection/firewall settings must permit the intended audience.

See [REDESIGN.md](REDESIGN.md) for the audit, content checklist, file changes,
measured validation results, and remaining verification limits.
