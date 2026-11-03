# Portfolio redesign and verification

Implemented and locally verified on November 4, 2026 (Asia/Calcutta).
The redesign is ready for the existing Vercel workflow. This session did not deploy it.

## Result and visual direction

The Engineering Editorial design uses an ink hero and closing section, warm off-white
content, restrained teal accents, fine rules, and generous spacing. DM Sans provides
the display and body typography; the existing local Space Mono is reserved for small
technical labels. Reusing local fonts avoids a third-party font request chain.

The full name is now the H1. The original headline, introduction, description,
invitation, and tagline remain visible. An original CSS/SVG system composition
replaces the fake code window. It is decorative and hidden from assistive technology.
There is no photograph, portrait, avatar, face illustration, or stock photography.

The first two project studies have large feature panels; the other two use horizontal
editorial rows on desktop. All become complete stacked articles on mobile. Charts,
component studies, geometric creative elements, and a pipeline illustration are
explicitly illustrative, with no invented statistics or fictional live responses.

## Repository audit and content inventory

The repository was clean before editing. All application, component, style, data,
hook, asset, build, and existing verification files were inspected. The application
already used build-time React rendering with client hydration; no framework
migration was needed. Original production HTML was captured before editing.

The authoritative content module and PDF are unchanged. The frozen audit is
`tests/content-baseline.json`, containing exact data, 74 visible statements, 12 unique
functional links, and original SHA-256 fingerprints. Original HTML and a desktop
screenshot are retained locally under `.codex-tmp/redesign/before.*`.

| Content | Before | After verification |
| --- | --- | --- |
| Name, title, Bengaluru location | Original values | Exact values retained |
| Hero and About copy | Original statements | Word-for-word match |
| Credibility metrics | 3 / 40k+ / 4, original labels | Same values, no live counters |
| Featured projects | 4 titles, categories, full descriptions, stacks | All retained |
| Project contributions | 12 bullets | All retained, open by default |
| Chrome extensions | 2 descriptions and original user metrics | All retained |
| Experience | 3 roles, original companies/dates/types, 10 bullets | All retained |
| Skills | 5 categories, 27 technology labels | All retained |
| Education | 2 qualifications/institutions/scores | All retained |
| Contact and resume | Email, phone, GitHub, LinkedIn, PDF | All destinations retained |
| Disclaimers | Resume figures, illustrative visuals, non-live counts | All retained |
| Footer | Owner attribution and “Built with care.” | Retained; existing build-year behavior preserved |

No career dates, titles, technologies, figures, or education details were silently
corrected. No new professional claims were added. The repository has no project
demo/source URLs or Chrome Web Store URLs, so none were fabricated.

## Sections and interactions

The presentation order is navigation → hero → credibility → selected work → extensions
→ experience → About → skills → education → contact/footer. Existing `#home`,
`#projects`, `#experience`, `#about`, `#skills`, `#education`, `#contact`, and
`#main-content` anchors remain available.

Navigation remains sticky, tracks the active section, and changes its surface after
scrolling. The mobile disclosure has an explicit expanded state, focuses the first
link on opening, closes on Escape/outside interaction, and returns focus to its
trigger on Escape. Choosing a section moves focus to that section. It is a non-modal
navigation disclosure, so ordinary Tab navigation remains available.

Project contributions use native `<details open>`: all content is initially available,
and the existing disclosure interaction still works. Resume viewing/download,
direct email/phone/social links, copy-email success/error feedback, theme switching,
system theme following, saved preference, and Back to Top remain functional.

## Static rendering and generated files

`npm run build` performs these steps:

1. Build the Vite browser bundle.
2. Build a temporary server entry that imports the same App and content modules.
3. Use React 18 `renderToString` to insert the complete page into `dist/index.html`.
4. Generate profile files from the same exported content and insert JSON-LD.
5. Inline the small production stylesheet and remove the temporary renderer.

Production uses `hydrateRoot`; development still uses `createRoot` for the empty
Vite root. Tests verify that hydration retains the original static heading DOM node.
No runtime SSR server, bot-specific content, hidden alternate biography, or client
API fetch is needed to read professional content.

| Endpoint | Source and behavior |
| --- | --- |
| `/profile.json` | Complete structured profile, original values and full contribution lists |
| `/profile.md` | Professional Summary, Skills, Experience, Projects, Additional Projects, Education, Contact |
| `/llms.txt` | Supplemental links to the website, both profile formats, and original resume |
| `/robots.txt` | Original wildcard allow policy, unchanged |
| `/sitemap.xml` | Generated canonical public HTML URL |
| `/resume.pdf` | Byte-identical copy of the original PDF |
| `/resume` | Explicit Vercel rewrite to `/resume.pdf` |

The original hashed resume URL remains functional. Vercel MIME types are configured
explicitly. Production preview mirrors the MIME types and returns 404 for missing
JSON, Markdown, XML, TXT, and PDF files. There is no deployment SPA catch-all rewrite.

## SEO and discovery

The title is `Rohit N Hiremath | Software Engineer`. The existing meta description,
canonical URL, and Open Graph descriptions are retained. Added a 1200 × 630 typographic
PNG, social image dimensions/alt text, Twitter card metadata, an SVG monogram favicon,
and alternate links to the JSON/Markdown profile.

The build emits [schema.org Person](https://schema.org/Person) data using the visible
name, profession, original biography, location, contact details, skills, and original
GitHub/LinkedIn URLs. It omits a profile image and unsupported credentials, ratings,
or rich-result claims. JSON syntax and matching values are tested locally; no external
rich-results validator was run.

The existing robots policy was preserved. Search crawling and training crawling are
separate concerns, as described in [OpenAI's crawler documentation](https://developers.openai.com/api/docs/bots).
No additional GPTBot permission was introduced. `llms.txt` is supplemental and does
not guarantee indexing or access by any particular tool.

## Accessibility and performance

The page has one identifying H1, semantic sections/articles/lists, named navigation,
an accessible skip link, visible focus rings, native disclosure semantics, explicit
button names, announced clipboard status, comfortable action targets, and reduced
motion support. Important mobile paragraphs remain at least 16px. No text waits for
an animation initializer. With JavaScript disabled, the menu links and professional
content remain available and the header uses normal document flow.

Two light-theme contrast failures found during validation were corrected by darkening
the text accent to `#086c62`; the hero's decorative teal remains `#20b8a6`.

Only React, React DOM, and Lucide remain as application dependencies. Six unused
animation/interaction packages and their obsolete components/hooks/styles were removed.
The page uses local fonts, lightweight CSS/SVG illustrations, no runtime raster
project images, no continuous animation loop, and no scroll-driven React animation.

Final local mobile Lighthouse 12.8.2 run against the production preview:

| Measurement | Result |
| --- | --- |
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| First Contentful Paint | 1.4 s |
| Largest Contentful Paint | 1.8 s |
| Speed Index | 1.4 s |
| Total Blocking Time | 80 ms |
| Cumulative Layout Shift | 0 |
| Run warnings | None |

These are local lab results, not deployed measurements or field Core Web Vitals.
INP was not measured. Scores and timings vary with the environment.

Final output sizes measured from disk: HTML 69,601 bytes / 15,039 gzip; client
JavaScript 176,603 bytes / 55,540 gzip; stylesheet 30,851 bytes / 7,017 gzip. CSS is
already included in the HTML, so the HTML and stylesheet sizes should not be added
when estimating the initial transfer. The social PNG is approximately 31 kB and is
not requested by the visible page. Two local font families are loaded.

## Commands and validation results

| Executed command | Result |
| --- | --- |
| `npm.cmd run build` | PASS; full static HTML and all profile files generated |
| `npm.cmd test` | PASS; 9 tests, zero failures |
| `npm.cmd uninstall --offline framer-motion react-intersection-observer react-type-animation react-countup react-scroll react-hot-toast` | PASS; dependency lock updated |
| `npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort` | PASS; production preview served for checks |
| `python scripts/render-og.py` | PASS; checked-in typographic social PNG generated |
| `python scripts/browser-check.py` | PASS in installed Chrome |
| `$env:CHROME_PATH='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'; $env:BROWSER_NAME='edge'; python scripts/browser-check.py` | PASS in installed Edge |
| `python .codex-tmp/redesign/lighthouse-final.py` | PASS; final metrics above |
| `python .codex-tmp/redesign/audit-live.py` | PASS; existing public site and external destinations inspected |
| `git -c safe.directory=E:/Learning/Projects/portfolio diff --check` | PASS; only environment line-ending notices |

No lint script is defined in the repository. Browser checks cover hydration, console
errors, theme persistence/system changes/blocked storage, CTA hover and reduced
motion, disclosures, clipboard success and denial, original resume download bytes,
anchors, skip link, active navigation, sticky-header offsets, mobile focus/Escape,
endpoint content types/404s, and JavaScript-disabled access.
All 26 visible desktop links, buttons, and disclosures were reached using Tab with
visible focus indicators in both browsers.

Chrome and Edge show no horizontal overflow at 320, 375, 390, 650, 768, 900, 1024,
1280, and 1440px. Desktop, tablet, mobile, and narrow mobile screenshots were inspected.
Automated axe scans report zero violations in light/dark desktop and light/dark mobile
combinations in both browsers. Automated checks are not a full accessibility certification.

Artifacts are retained under `.codex-tmp/redesign/`: `chrome/`, `edge/`,
`lighthouse-final.json`, `live-audit.json`, before/after HTML/screenshots. Initial
contrast failures were corrected and scans rerun. The first Lighthouse CLI invocation
produced a report but lingered at browser shutdown and was stopped; the final run used
a controlled browser connection and exited successfully.

## Files changed

Created `src/data/siteCopy.js`, `src/components/sections/CredibilityStrip.jsx`,
`EngineeringVisual.jsx`, and `ProjectVisual.jsx`; `scripts/generate-public.mjs`,
`scripts/render-og.py`; `public/favicon.svg`, `public/og.png`;
`tests/content-baseline.json`; `vercel.json`; and this report.

Updated `src/App.jsx`, `src/entry-server.jsx`, `src/index.css`; layout `Navbar.jsx`
and `Footer.jsx`; sections `Hero.jsx`, `Projects.jsx`, `Experience.jsx`, `About.jsx`,
`Skills.jsx`, `Education.jsx`, `Contact.jsx`; `ui/SectionHeading.jsx`;
`scripts/build.mjs`, `scripts/prerender.test.mjs`, `scripts/browser-check.py`;
`index.html`, `vite.config.js`, `package.json`, `package-lock.json`, and `README.md`.

Removed unused layout/section CSS files, the disconnected `ReactConcepts.jsx` and
its CSS, the old `ui/index.jsx`/`ui.css`, and unused `hooks/index.js`. They were not
part of the rendered portfolio. Active styles now have a single home in `src/index.css`.
The original data module, PDF, theme context, browser entry, and crawler policy remain unchanged.

## Production observations and remaining limits

Before deploying this redesign, direct requests to the current public root returned
HTTP 200 with meaningful professional HTML for both ordinary and OAI-SearchBot
user-agent strings. Its robots file also returned 200. No `X-Robots-Tag` or observed
challenge header was present. A separate web-fetch tool could not access that root.
These tests do not establish access from actual crawler IP addresses or inspect
Vercel dashboard firewall/protection rules.

The supplied reference returned 200 and was used for presentation context only.
The original GitHub link returned 200; LinkedIn returned its HTTP 999 automated-access
response. Both original URLs were preserved. Email/phone destinations were checked
as links; no email or call was sent. Contact forms, store URLs, and demos were not invented.

Chrome and Edge were available; Firefox, Safari, screen-reader software, and external
structured-data validators were not tested. No Vercel publishing tool/credentials
were available, and the deployed root is the earlier site, not this redesign.
Production response headers, profile endpoints, performance, social unfurling, and
missing-document behavior must be checked again after deployment.

Deploy the existing repository through Vercel using `npm run build` and `dist`
(specified in `vercel.json`). Keep the full build command so prerendering and profile
generation run. See [README.md](README.md) for setup, content updates, and optional
social-image regeneration. No new service or framework is required.
