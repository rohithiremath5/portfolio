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

The current page uses React 18, Vite 5, Lucide React icons, and CSS custom properties. Theme state is managed through React Context and browser storage. Google Fonts supplies DM Sans, DM Serif Display, and Space Mono, with local fallback fonts.

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

The current components import portfolio content from resume. The local `src/data/` directory is ignored by Git, so a fresh checkout requires the content module and resume PDF to be supplied separately before running or building the application.

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
    ├── data/                   # Local content module and resume PDF (Git-ignored)
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

The build writes the static site to `dist/`. The preview command serves that output locally for review; it is not a production hosting service.

For deployment, run the build with the local content module and PDF available, then publish the generated `dist/` directory to a static host. Repository-based build environments also need those ignored content files supplied before the build.

## Review checklist

- Check the page at mobile and desktop widths for readable text and horizontal overflow.
- Switch themes, reload, and confirm the selected theme persists.
- Open the mobile menu, navigate to a section, and test closing it with Escape.
- Expand project details and check keyboard focus visibility.
- Open and download the resume PDF.
- Verify contact links and the copy-email action.
- Run the production build after application changes.

There are currently no test or lint scripts defined in `package.json`.
