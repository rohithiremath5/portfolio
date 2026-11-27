# Rohit N Hiremath — Portfolio

A statically rendered React 18 / Vite portfolio, designed around engineering work,
professional experience, Chrome extensions, skills, education, and direct contact.
The portfolio is static; the optional AI assistant uses the same Vercel project's
Node.js function. The portfolio and local resume FAQs work without an API key.

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

With the existing local Lighthouse tooling available, optional production audits
can also be run without installing packages:

```sh
python scripts/lighthouse-check.py
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

`tests/content-baseline.json` freezes the reviewed professional data, visible
statements, functional links, and SHA-256 fingerprints of the current
content module and PDF. Tests compare those against static HTML, JSON, and Markdown.
If you intentionally update your profile later, review and update the baseline in
the same change. Replacing the PDF does not automatically parse or rewrite content.

`tests/ui-content-inventory.json` additionally captures the rendered text, link
counts, metadata, and section order before the current UI redesign. Intentional
future content changes must review and update this inventory as well.

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
The current report covers the November 27 Hybrid Modern Engineering redesign;
the earlier November 4 audit is preserved there as historical context.

## AI portfolio assistant

The floating assistant extends the existing React/Vite portfolio without changing
its sections, content, global styles, resume data, PDF, metadata, or prerendering.
It stays closed on load. Its panel, styles, conversation logic, and FAQ data are
loaded only when opened. The launcher uses the existing theme tokens and Lucide
icons, and both themes update through the existing provider.

```text
React panel → same-origin POST /api/chat → Vercel Node.js function
                                      → validation / instance limits
                                      → generated public resume context
                                      → official @google/genai → Gemini
```

The sole new runtime dependency is `@google/genai`. Node.js 22 is selected for local
development and Vercel. There is no separate backend application, database, vector
store, RAG system, external tool access, or additional UI library.

### Resume data and privacy

The source is `src/data/resumeData.js` (this repository's equivalent of `data.js`).
Its contents and schema are unchanged. Its PDF URL import cannot run directly in
Node, so `scripts/build.mjs` passes its existing Vite SSR exports to
`server/chatbot/resumeContext.js`. This generates the ignored, server-only
`server/chatbot/generated-resume.json` automatically during every production build.
`vercel.json` explicitly includes that file in `/api/chat` and gives the function a
30-second ceiling. The existing build command and resume rewrite remain intact.

The adapter includes public summary, stated skills, experience, projects,
extensions, education, statistics, and professional links. It omits the PDF import,
images, decorative fields, email address, and phone number. No manually copied
resume or derived experience totals are maintained. Saving the central data updates
the local full workflow; rebuilding/redeploying updates production knowledge.

Only submitted questions, limited recent conversation, and that public context
may be sent to Google. The UI includes a notice not to submit sensitive information.
Conversations are kept in tab-scoped `sessionStorage`, never a database; unavailable
storage falls back to memory. Server logs do not include full messages, prompts,
credentials, or raw provider errors. Google processing remains subject to its
[API terms and current free-tier policy](https://ai.google.dev/gemini-api/docs/pricing).

### API key and environment setup

1. Open [Google AI Studio's API key page](https://aistudio.google.com/apikey), select
   or create the intended project, and create a Gemini Developer API key. Use a
   project eligible for the free tier; billing is not enabled by this implementation.
2. Paste the key into the existing root `.env.local` file. It was created with an
   empty value; no real credentials are included in this repository:

   ```dotenv
   GEMINI_API_KEY=
   GEMINI_MODEL=gemini-3.8-flash
   ```

3. Restart the full development command after changing environment variables.
   Never prefix this key with `VITE_`, import the Google SDK into React components,
   or put credentials in resume data. `.env.example` is the safe tracked template.
   `.env`, `.env.local`, `.env.*.local`, `.env.production`, and `.env.development`
   are ignored. Existing environment values are preserved.

The model is read only from server environment variables, defaulting to
`gemini-3.8-flash`. To change it, update `GEMINI_MODEL` locally and in Vercel and
verify the chosen model's API compatibility and free-tier eligibility. There is
no automatic model/provider fallback. For 3.8, generation uses supported LOW
reasoning, a 512-token ceiling, a 25-second deadline, and one SDK attempt.
Deprecated temperature/top-p/top-k settings and unsupported MINIMAL reasoning are
omitted following the [3.8 migration guidance](https://aistudio.google.com/docs/whats-new-gemini-3.8#migrate-to-gemini-3-8-flash).
Recent turns are quoted as untrusted context within a user request, avoiding
unsupported prefilled model turns. No Google Search, tools, or function calling is
enabled. Stop/cancel ends the local request; it cannot guarantee Google stops
processing or reverses already consumed quota.

### Windows local development

```powershell
npm.cmd ci
npm.cmd run dev:full
```

Open the URL printed by Vite (normally `http://localhost:5173`). This runs the
existing Vite server with a development-only middleware invoking the exact same
`api/chat.js` handler used by Vercel. Vite's standard `loadEnv` reads server values
from `.env.local`; non-`VITE_` values are not injected into browser code. This avoids
an extra CLI installation, project linking, Express server, or second application.
It has been exercised locally with an empty key: the page loads and a non-FAQ POST
returns safe `503 SERVICE_UNAVAILABLE` rather than crashing.

`npm.cmd run dev` retains its original frontend-only behavior. FAQs and greetings
work there; AI questions require `dev:full`. `npm.cmd run preview` serves production
static files and does not execute Vercel functions. `npx vercel dev` is an optional
platform-emulation alternative after `npm.cmd run build`; do not configure Vercel's
Development Command as `dev:full`, which would create redundant API handling.
The Vercel CLI path has not been exercised or linked to a remote project here.

For a local HTTP smoke test after starting `dev:full`:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:5173/api/chat -ContentType application/json -Body '{"message":"What are his technical skills?"}'
```

This exact FAQ uses the current source data without a Gemini request. For a live
test after adding a valid key, ask a specific follow-up that is not one of the
predefined FAQs, such as how a particular project demonstrates frontend API work.
Successful mocked tests do not establish real Gemini availability or answer quality.

### Limits and security

- Messages: 1–500 characters. History: server-validated, last 10 messages (roughly
  five turns). Stored conversation: 30 messages. Responses: at most 4,000 characters.
  JSON request bodies: at most 16KiB, including streamed bodies.
- Only POST JSON requests with the documented `message`/`history` schema are accepted.
  System roles, extra top-level configuration, client model selection, and supplied
  resume context are rejected. Browser cross-site requests are rejected without
  permissive CORS. Origin checks are not authentication.
- The browser permits one active request and a two-second cooldown. The server has
  a separate per-instance in-flight lock, two-second IP cooldown, 10 requests per
  IP/minute, 30 total requests/minute, and a bounded, expiring in-memory map. The map
  keeps salted IP hashes, not conversation text. Shared networks may share a limit.
  Responses are `no-store`, and raw provider errors are never exposed to visitors.
- These instance limits reset on cold starts and are not shared across instances
  or regions. They are **not reliable global/distributed rate limiting**. Prompt
  instructions and simple injection guards are additional layers, not complete
  protection against hallucinations, prompt injection, or automated abuse.
- Exact resume FAQs, greetings, missing salary/notice/availability information, and
  obvious unrelated/injection requests are answered locally without Gemini. There
  are no load/open/typing API calls, background requests, simulated streaming, or
  automatic retries. Requests are cancelled on clear, close, or unmount.
- Provider text is rendered through escaped React text nodes with simple paragraph
  and bullet formatting. Raw HTML, arbitrary links, scripts, and tools are not run.

The existing Vercel project's plan, firewall rules, and remaining allowances could
not be inspected locally. Vercel documents WAF rate limiting on all plans, with one
Hobby rule, but also publishes usage pricing. No paid limiter or remote firewall
rule was enabled. If an included rule is available at no additional cost, the owner
can configure a fixed-window rule for `/api/chat`, keyed by IP, returning 429, after
checking the dashboard's pricing/allowances. Counters are per region. Otherwise,
retain these best-effort limits, use the project's existing DDoS protection and
available blocking rules, monitor usage, and keep the Google project on its free
tier so provider quotas remain the final boundary. Requests from direct non-browser
clients can bypass Origin checks. Free-tier capacity is not guaranteed.
See [Vercel WAF limits/pricing](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)
and [Gemini project rate limits](https://ai.google.dev/gemini-api/docs/rate-limits).

### Vercel configuration and deployment

In the existing Vercel project, open Settings → Environment Variables and add
`GEMINI_API_KEY` and `GEMINI_MODEL=gemini-3.8-flash` for the desired Production and
Preview environments. Keep the key server-only. `.env.local` is local and does
not configure production. After reviewing and committing locally, use the existing
GitHub/Vercel deployment pipeline; redeploy after changing environment variables.
Retain `npm run build` and the `dist` output directory so resume context generation
and portfolio prerendering both run. Do not deploy only a copied `dist` directory:
the repository's `api/`, server utilities, and generated function context are also
required by Vercel. No remote settings, commits, pushes, or deployments were made.

### Testing and troubleshooting

```powershell
npm.cmd run build
npm.cmd test
npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort
# In a second terminal, with the existing optional Playwright/Chrome tooling:
python scripts/browser-check.py
python scripts/chatbot-browser-check.py
```

Node tests mock the Google client and generation layer. They cover validation,
stream byte limits over real local HTTP, timeout/quota/service failures, missing
credentials, bounded history, instance concurrency, safe response rendering
contracts, SDK configuration, and representative behavior controls. Production
bundle checks verify that credentials, the Gemini client, and Google's API endpoint
are absent. The original portfolio content and SEO inventory tests remain intact.
Browser tests mock `/api/chat`; they never call Google. Results are written under
ignored `.codex-tmp/chatbot/`, with the original regression artifacts under
`.codex-tmp/redesign/chrome/`.

- Unavailable assistant: check that the key is set on the server and restart
  `dev:full` or redeploy. Check model access, typoed model names, or provider outages
  in the owner's provider dashboard; visitors receive only a generic safe error.
- 429: wait before using the explicit retry action, check provider project quotas,
  and inspect platform limits. Repeated automatic retries are intentionally absent.
- Timeout: retry manually later or ask a shorter question. No paid fallback occurs.
- HTML/404 at `/api/chat`: use `dev:full` locally; plain Vite dev/preview does not
  run the function. On Vercel, verify the root `api/chat.js` was deployed and the
  build generated its included resume context.
- Outdated facts: save the central resume module and rebuild/redeploy; do not edit
  `generated-resume.json` manually.
- Storage or clipboard denied: conversation remains in memory and the UI offers
  manual-copy feedback. Clearing history removes the stored conversation.

Implementation validation: production build and 26 Node tests passed. Browser
checks passed at seven widths in both themes for the open chatbot, including
history/refresh, follow-ups, retry, cancellation, clearing, copying, literal HTML,
long text, keyboard focus, reduced motion, and unavailable storage. Open-chat axe
scans found zero violations in four theme/viewport combinations; the existing
portfolio suite also passed at eleven widths in both themes with fourteen axe
scans and no runtime/hydration errors. No live Gemini call has been made: a valid
key and live answer evaluation remain the owner's next step. Remote Vercel function
packaging/deployment, actual firewall allowances, real-device keyboard behavior,
Firefox/Safari, and manual screen-reader testing remain unverified.

Additional short-viewport checks cover 375×260, 320×320, and 768×360. The panel
reserves less space when its visual viewport is short, hides its redundant launcher
while open, and keeps the entire composer visible. Escape restores focus after the
launcher reappears. The panel is non-modal on desktop and mobile; it does not trap
focus or make the underlying portfolio inert.

Local Lighthouse 12.8.2 measurements in headless Chrome 158 on Windows, with the
chatbot closed by default: mobile Performance 99, desktop Performance 100;
Accessibility, Best Practices, and SEO 100 in both presets. Mobile LCP was 1.7s,
TBT 10ms, and CLS 0; desktop LCP was 0.4s, TBT 0ms, and CLS 0. Mobile used default
simulated throttling (4× CPU); desktop used its standard preset. These are local
lab results, not production field data. JSON reports are in `.codex-tmp/chatbot/`.

Existing files changed for integration: `src/App.jsx`, `scripts/build.mjs`,
`package.json`, `package-lock.json`, `vercel.json`, `.gitignore`, and this README.
New feature files are `api/chat.js`, five server utilities in `server/chatbot/`,
`shared/chatPolicy.js`, `src/components/chatbot/` (launcher, panel, and scoped CSS),
`src/hooks/usePortfolioChat.js`, and `src/services/chatApi.js`. New development/test
files are `scripts/dev-full.mjs`, `scripts/chatbot.test.mjs`, and
`scripts/chatbot-browser-check.py`, plus `.env.example`. `.env.local` and the
generated server context are intentionally ignored. No existing content, style,
theme, metadata, baseline, or section component file was edited.

Official references: [Gemini documentation](https://ai.google.dev/gemini-api/docs),
[Google GenAI SDK](https://googleapis.github.io/js-genai/release_docs/index.html),
[Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing),
[Gemini rate limits](https://ai.google.dev/gemini-api/docs/rate-limits), and
[Vercel Functions](https://vercel.com/docs/functions).
