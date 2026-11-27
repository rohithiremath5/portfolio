# Hybrid Modern Engineering redesign — current verification

Implemented locally on November 27, 2026 (Asia/Calcutta). This report supersedes
the November 4 visual direction archived below. No commit, push, or deployment
was performed.

## Implemented design and reasons

- Centralized light/dark tokens use neutral surfaces and restrained indigo accents.
  Local variable Geist Sans and Geist Mono establish consistent display, body,
  and technical typography without runtime font requests to external services.
- The compact sticky navbar retains its existing branding, labels, active-section
  behavior, keyboard focus, mobile menu, resume action, and theme persistence.
- The hero uses a roughly 55/45 content/illustration split on desktop and stacks
  on mobile. The existing Frontend/API/Data/AI study now uses theme-aware surfaces,
  a fine grid, a small radial glow, and restrained connection lines.
- Three bordered statistic cards retain the exact metrics, labels, and disclaimer.
  Decorative Lucide icons provide context without adding claims.
- All four projects use a consistent two-column desktop card grid and a single
  mobile column. The existing interface studies retain their labels and disclaimer.
  Contributions remain open by default using the existing native disclosures.
- Extension cards emphasize the existing adoption figures. Professional experience
  remains an open vertical timeline; About uses an editorial layout without cards.
- Five skill groups use responsive grouped tiles, local technology logos, category
  icons, and visible text labels. Existing LangChain/LangGraph skills now have local
  Simple Icons assets; JSON and SQL retain appropriate conceptual icons.
- Education uses compact bordered cards. Contact and footer use the shared theme
  system and preserve copy-email, social/phone links, and back-to-top behavior.
- Hover movement is limited to 2–3px, and reduced-motion preferences disable
  transitions and smooth scrolling. Essential content never waits for animation.

The design follows the supplied principles from [Linear](https://linear.app/),
[Geist](https://vercel.com/geist/introduction),
[Brittany Chiang](https://brittanychiang.com/), and
[Aceternity](https://ui.aceternity.com/bento-grid). Their readable reference pages
were consulted alongside the prompt. Bento Grids and Simple Icons exposed no
readable page content through the web tool; the deployed portfolio URL was
inaccessible through that tool. The local production build was used for auditing.

## Audit and exact content preservation

The work began from a clean Git status after the resume-content update. React 18,
Vite 5, the existing component tree, theme provider, CSS, content modules,
prerenderer, generated public profiles, and existing browser checks were inspected.
The current production build and before screenshots were captured before redesign.

`tests/ui-content-inventory.json` records 238 rendered text fragments (199 unique),
20 links (12 unique destinations), 22 SEO/structured-data tags, and all seven section
anchors in their original order. The new inventory test compares all of them
exactly, including repeated content and decorative illustration labels.

`src/data/resumeData.js`, `src/data/siteCopy.js`, the resume PDF, the professional
content baseline, metadata text, and the social preview image remain unchanged.
The existing SHA-256 tests verify the content module and PDF; all professional data
still matches the baseline in static HTML, JSON, and Markdown. The only head asset
change is the font preload URL. No content, achievement, skill, project, or link
destination was added or rewritten.

## Executed validation

- `npm.cmd run build`: passed, including client build, prerendering, public profile
  generation, structured data, and unchanged resume copying.
- `npm.cmd test`: 10 tests passed, including the new exact UI-content inventory.
- `python scripts/browser-check.py`: passed in installed headless Chrome against
  the production preview. Hydration retains the prerendered H1 node.
- Both themes checked at 320, 375, 390, 425, 650, 768, 900, 1024, 1280, 1440, and
  1920px. No horizontal overflow, clipped skill labels, or overlapping project cards.
- Mobile navigation: opening, first-link focus, Escape, returned trigger focus,
  closing on selection, section focus, and anchor scrolling passed.
- All 26 desktop links/buttons/disclosures were traversed by keyboard with visible
  focus. Skip link, active navigation, sticky-header offsets, and back-to-top passed.
- Theme switching/persistence, system preference changes, unavailable storage,
  clipboard success/failure, PDF download, hashed PDF URL, `/resume`, and
  `/resume.pdf` passed. No browser runtime, console, or hydration errors.
- All local technology logos were scrolled into view and decoded successfully;
  their light/dark presentation was visually reviewed after lazy loading.
- With JavaScript disabled, all seven sections, contributions, mobile navigation,
  resume links, and email remain usable.
- axe WCAG 2.2 AA checks reported zero violations in fourteen combinations: both
  themes at 320, 375, 425, 768, 1024, 1440, and 1920px. This is automated evidence,
  not a complete accessibility certification; manual screen-reader testing was
  not performed.
- Generated JSON/Markdown/TXT/XML endpoints, MIME types, valid JSON/XML,
  missing-document 404s, canonical/sitemap consistency, and static SEO passed.
- `git diff --check`: passed. No lint or type-check script is configured.

### Measured Lighthouse results

Lighthouse 12.8.2, local production preview on `127.0.0.1:4173`, installed headless
Chrome 158 on Windows. Final audits ran sequentially using
`python scripts/lighthouse-check.py`.
Mobile uses Lighthouse's default simulated mobile network and 4× CPU slowdown;
desktop uses its desktop preset. These are local lab measurements, not deployed
field measurements.

| Audit | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Before, mobile | 99 | 100 | 100 | 100 | 1.8s | 50ms | 0 |
| Final, mobile | 99 | 100 | 100 | 100 | 1.8s | 10ms | 0 |
| Final, desktop | 100 | 100 | 100 | 100 | 0.4s | 0ms | 0 |

An earlier mobile audit run alongside browser checks scored 89 with 370ms TBT;
the isolated final run above removes that competing test workload. Both reports
are retained locally. The final client JS is 182.80kB (57.44kB gzip), compared with
181.28kB (57.11kB gzip) before. CSS is 33.56kB (7.17kB gzip), compared with 33.36kB
(7.53kB gzip). The two active font files total 52,528 bytes, slightly less than the
previous 53,452 bytes. No dependency was added, removed, or upgraded.

## Files changed or created

Modified:

- `src/index.css`: theme, typography, layouts, cards, illustration treatment,
  interactions, responsive rules, and reduced motion.
- `src/components/sections/Skills.css`: responsive grouped technology tiles.
- `src/components/sections/Skills.jsx`: decorative category icons.
- `src/components/sections/SkillIcon.jsx`: existing new-resume skill icon mappings.
- `src/components/sections/CredibilityStrip.jsx`: decorative statistic icons.
- `src/components/sections/Education.jsx`: decorative education icon.
- `index.html`: local Geist Sans preload; SEO metadata preserved.
- `public/fonts/README.txt`: font provenance and license references.
- `public/skill-icons/sources.json`: new local icon provenance.
- `public/skill-icons/README.md`: new logo source documentation.
- `scripts/browser-check.py`: both themes at eleven widths, label/overlap checks.
- `scripts/prerender.test.mjs`: exact content-inventory assertion.
- `README.md`: current audit and optional Lighthouse workflow links.
- `REDESIGN.md`: this current report, with the previous audit archived below.

New:

- `public/fonts/geist-sans-latin.woff2`, `public/fonts/geist-mono-latin.woff2`.
- `public/fonts/geist-OFL.txt`, `public/fonts/geistmono-OFL.txt`.
- `public/skill-icons/langchain.svg`, `public/skill-icons/langgraph.svg`.
- `scripts/content-inventory.mjs`: rendered-text/link/SEO inventory helper.
- `tests/ui-content-inventory.json`: pre-redesign content snapshot.
- `scripts/lighthouse-check.py`: optional audit using existing local tooling.

Before screenshots and the baseline Lighthouse report are under ignored
`.codex-tmp/hybrid-before/`. Final desktop/mobile screenshots and isolated mobile/
desktop Lighthouse JSON reports are under ignored `.codex-tmp/hybrid/`.
Responsive screenshots, axe results, and functional browser results are under
ignored `.codex-tmp/redesign/chrome/`. Generated `dist/` remains ignored.

## Review limits

The changes are local and ready to review. Automated functional, responsive,
accessibility, and performance checks used Chromium on Windows; Firefox, Safari,
real-device testing, screen-reader testing, and post-deployment verification were
not performed. External profile destinations were preserved, not independently
verified for account availability. The original local font assets remain for the
existing social-image authoring script; the checked-in social image is unchanged.

---

# Archived November 4 redesign and verification

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
