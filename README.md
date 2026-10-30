# Rohit N Hiremath — Portfolio

Personal portfolio for Rohit N Hiremath, a software engineer based in Bengaluru. It presents professional experience, selected projects, published Chrome extensions, technical skills, education, and contact links.

The portfolio content was prepared using the supplied resume PDF as its reference. This is an existing personal site; there is no initial “fill in your details” setup step.

## Features

- Responsive layouts for desktop, tablet, and mobile.
- Light and dark themes with a toggle in the navigation.
- System theme detection on the first visit and a saved preference after choosing a theme.
- Sticky navigation with active-section indicators and a mobile menu.
- Project cards with illustrative interface studies and expandable contribution details.
- Professional experience covering Enterprisebot and AdSpyder.
- Chrome extension highlights, grouped technical skills, and education.
- Resume viewing and PDF download.
- Direct email, phone, LinkedIn, and GitHub links, plus a copy-email button.
- Keyboard focus indicators, a skip-to-content link, and reduced-motion support.

Project visuals are illustrative studies, rather than screenshots of production applications. Experience and extension user figures reflect the resume, rather than live data.

## Technology

The current page uses React 18, Vite 5, Lucide React icons, and CSS custom properties. Theme state is managed through React Context and browser storage. DM Sans, DM Serif Display, and Space Mono are hosted locally in `public/fonts/`, with fallback fonts and their SIL Open Font Licenses included.

The application is a static frontend. It has no contact-form backend, automatic resume parser, or required API credentials. Some packages and components from the earlier version remain in the repository but are not used by the current page.

## Local development

Install Node.js and npm, then run these commands from the project root:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Its default development port is `5173`; it may choose another port if that port is occupied.

On Windows PowerShell, use `npm.cmd` in place of `npm` if the execution policy blocks `npm.ps1`.

### Local content dependency

The current components import portfolio content from `src/data/resumeData.js`. That module and the resume PDF are tracked by Git and must remain available to the build.

The resume PDF is located at:

```text
src/data/Rohit_N_Hiremath_Frontend_developer.pdf
```

The PDF is the editorial reference for the portfolio. Replacing it does not automatically extract or update the text displayed on the website. Content and resume links must stay consistent with the supplied document.

## Project structure

```text
portfolio/
├── index.html                  # Metadata, favicon, and initial theme selection
├── package.json                # Dependencies and npm scripts
├── package-lock.json           # Locked dependency versions
├── vite.config.js              # React plugin and @ alias for src/
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Theme provider and page composition
    ├── index.css               # Current page styles, theme tokens, breakpoints
    ├── context/
    │   └── ThemeContext.jsx    # Theme state and preference persistence
    ├── data/                   # Content module and resume PDF
    └── components/
        ├── layout/
        │   ├── Navbar.jsx      # Navigation, mobile menu, and theme toggle
        │   └── Footer.jsx      # Copyright and back-to-top link
        ├── ui/
        │   └── SectionHeading.jsx
        └── sections/
            ├── Hero.jsx
            ├── About.jsx
            ├── Projects.jsx
            ├── Experience.jsx
            ├── Skills.jsx      # Skills and education
            └── Contact.jsx
```

This tree shows the current page and its supporting files. Earlier section styles, shared utilities, and standalone `Education.jsx` and `ReactConcepts.jsx` components remain in the source tree. The current `App.jsx` does not render those standalone sections; education appears within `Skills.jsx`.

## Design and themes

The design pairs large sans-serif headings with italic serif accents, generous spacing, and project-specific illustrations.

| Token | Light theme | Dark theme |
| --- | --- | --- |
| Background | `#faf9f6` — warm ivory | `#131b19` — charcoal green |
| Main text | `#202e2a` | `#eceee6` |
| Accent | `#216655` — deep teal | `#a2d4b2` — soft mint |
| Surface | `#ffffff` | `#1d2925` |

The current page styles live in `src/index.css`. Light-theme tokens are defined on `:root`, and dark-theme overrides use `:root[data-theme='dark']`.

Theme selection uses the `portfolio-theme` local-storage key. Without a saved choice, the site follows the system preference and responds to system theme changes. Choosing a theme saves that preference when storage is available. The toggle still works for the current session if storage is unavailable.

## Maintaining the portfolio

| Change | Relevant files |
| --- | --- |
| Page sections and ordering | `src/App.jsx` |
| Section copy and layouts | `src/components/sections/` |
| Resume-backed content and links | Local `src/data/resumeData.js` module |
| Resume document | PDF in `src/data/` |
| Navigation entries | `navigation` in `src/components/layout/Navbar.jsx` |
| Colors, typography, and responsive styling | `src/index.css` |
| Theme behavior | `src/context/ThemeContext.jsx` and initial theme script in `index.html` |
| Page title, description, and favicon | `index.html` |

Keep navigation targets aligned with section IDs when changing the page structure. Contact links open the visitor’s email or phone application; the copy button uses the browser Clipboard API and displays a fallback message if copying fails.

## Build and preview

```sh
npm run build
npm run preview
```

The build first produces the Vite client assets, then builds a temporary React renderer and calls `renderToString` to insert the complete page into `dist/index.html`. The temporary renderer is removed, and no server is deployed. Run `npm run build` (rather than `vite build` directly) to include this step. The preview command serves that output locally for review; it is not a production hosting service.

For Vercel, keep the Vite framework preset, set the build command to `npm run build`, and keep the output directory as `dist`. No functions, backend, or rewrite rules are required. Custom dashboard overrides that run `vite build` directly must be changed to `npm run build`.

### Static HTML and hydration

Hero, About, Projects, Experience, Skills (including education), and Contact are rendered during the build. `src/main.jsx` uses React 18 `hydrateRoot` for that HTML and `createRoot` for the empty development shell. Theme state starts with the same value on the server and client, then reads browser preferences in an effect. The existing head script applies the palette before paint. The footer year is shared by the client and renderer at build time; rebuilding updates it.

Essential content, native project details, resume links, and email/phone links work without JavaScript. A `noscript` style exposes the mobile navigation and hides buttons that require JavaScript. Theme switching, mobile menu state, active-section tracking, and clipboard copying require JavaScript.

The current App does not import the legacy Framer Motion sections, typing utilities, counter libraries, toast library, or `react-scroll`. Vite excludes these from the current client bundle. Those source files and dependencies remain available; adding them back requires checking SSR safety, deterministic first renders, and content visibility without JavaScript. In particular, avoid essential content with an initial `opacity: 0` and move browser API reads into effects.

### Crawler access

`public/robots.txt` permits crawling and links to `public/sitemap.xml`. The document includes description, indexing, Open Graph metadata, and a canonical URL using the confirmed public domain `https://portfolio-kappa-rosy-02l4ong3uk.vercel.app/`. If the production domain changes, update the canonical link, `og:url`, robots sitemap URL, and sitemap together.

Prerendering does not bypass HTTP restrictions. In the Vercel dashboard, inspect **Settings → Deployment Protection** for the intended production domain, including authentication, passwords, and firewall/bot rules. Preview URLs may be protected independently. Check the public URL without a Vercel login and inspect status, redirects, HTML body, robots.txt, and `X-Robots-Tag` headers. A login/challenge page, 401/403 response, or `noindex` response still prevents access. This repository cannot establish the live dashboard settings.

### Automated verification

```sh
npm run build
npm test
```

The Node tests check static section text, generated asset URLs, robots.txt, and absence of a deployed renderer. For optional browser checks, install Python Playwright in your tooling environment, run `npm run preview -- --host 127.0.0.1`, then run `python scripts/browser-check.py`. The script uses installed Chrome (or `CHROME_PATH`, or Playwright Chromium). It checks retained DOM nodes during hydration, runtime errors, theme behavior, navigation, responsive overflow, clipboard, PDF download, and content with JavaScript disabled.

Font faces are included in the main stylesheet instead of chained through a third-party CSS `@import`. The same fonts are served as local WOFF2 Latin subsets, with `font-display: swap`, preloads for the two primary faces, and the existing fallback fonts. Add subsets if introducing languages outside Latin. The build inlines the small stylesheet (about 7 kB compressed) into the HTML to remove a measured render-blocking request. This single-page tradeoff increases HTML size and gives up separate stylesheet caching. CSS source files and development behavior remain unchanged. The current app has a small single client bundle; splitting static sections behind client-only lazy boundaries would add requests and risk omitting crawler content. Review measured production bottlenecks before adding chunk boundaries.

## Review checklist

- Check the page at mobile and desktop widths for readable text and horizontal overflow.
- Switch themes, reload, and confirm the selected theme persists.
- Open the mobile menu, navigate to a section, and test closing it with Escape.
- Expand project details and check keyboard focus visibility.
- Open and download the resume PDF.
- Verify contact links and the copy-email action.
- Run the production build after application changes.

`npm test` validates the generated production output, so build first. There is no lint script.
