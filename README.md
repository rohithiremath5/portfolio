# 🚀 Portfolio — Full Stack Engineer

A blazing-fast, production-grade React portfolio built with **Vite**, **Framer Motion**, and modern React patterns. Designed to impress recruiters _and_ teach you advanced React concepts simultaneously.

---

## 📁 Folder Structure

```
portfolio/
├── index.html                        # HTML shell (Google Fonts loaded here)
├── vite.config.js                    # Vite + path alias config
├── package.json
└── src/
    ├── main.jsx                      # Entry point — ReactDOM.createRoot
    ├── App.jsx                       # Root: ThemeProvider + lazy sections
    ├── index.css                     # Global reset, CSS vars, utilities
    │
    ├── data/
    │   └── resumeData.js             # 📝 ALL your content lives here — edit this!
    │
    ├── hooks/
    │   └── index.js                  # 8 custom hooks (useScrollSpy, useDebounce…)
    │
    ├── context/
    │   └── ThemeContext.jsx          # Context API + useReducer pattern
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.jsx + .css     # Fixed nav, scroll progress, mobile menu
    │   │   └── Footer.jsx + .css     # Footer with scroll-to-top
    │   │
    │   ├── ui/
    │   │   ├── index.jsx             # Reusable: AnimatedSection, Badge, GlowCard…
    │   │   └── ui.css
    │   │
    │   └── sections/
    │       ├── Hero.jsx + .css       # Landing with terminal card + typewriter
    │       ├── About.jsx + .css      # Bio + animated counters (rAF)
    │       ├── Experience.jsx + .css # Tabbed timeline
    │       ├── Projects.jsx + .css   # Filterable grid (useMemo)
    │       ├── Skills.jsx + .css     # Animated skill bars + chip grid
    │       ├── ReactConcepts.jsx     # Accordion learning reference
    │       ├── Education.jsx + .css  # Timeline cards
    │       └── Contact.jsx + .css    # Form with useReducer
```

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# → http://localhost:5173
```

---

## ✏️ First Thing To Do — Fill In Your Details

Open `src/data/resumeData.js` and update the `personalInfo` object:

```js
export const personalInfo = {
  name: "Rahul Sharma",               // ← Your name
  designation: "Full Stack Engineer",
  email: "rahul@gmail.com",           // ← Your email
  phone: "+91 9876543210",            // ← Your phone
  location: "Bengaluru, India",
  linkedin: "https://linkedin.com/in/rahulsharma",  // ← Your LinkedIn
  github: "https://github.com/rahulsharma",          // ← Your GitHub
  resume: "/resume.pdf",              // ← Drop resume.pdf in /public folder
};
```

Everything else — projects, skills, experience — is already filled from your resume!

---

## ⚛️ React Concepts Demonstrated

### Basic
| Concept | Where Used |
|---------|-----------|
| JSX & Rendering | Every component |
| Props | Badge, GlowCard, FormField, ProjectCard |
| useState | Form, filters, accordion, mobile menu |
| Event handling | Navbar scroll, form submit, filter clicks |
| Conditional rendering | Mobile menu, form status, active states |
| Lists & keys | Projects grid, skills, education timeline |

### Intermediate
| Concept | Where Used |
|---------|-----------|
| useEffect + cleanup | Scroll spy, IntersectionObserver, event listeners |
| useRef | Animated counters (rAF), GlowCard mouse tracking |
| useCallback | ThemeContext action creators |
| useMemo | Project filtering in Projects.jsx |
| useReducer | ThemeContext, Contact form state |
| Custom hooks | useScrollSpy, useMousePosition, useMediaQuery, useDebounce, useScrollProgress, useCounter, usePrevious, useIntersectionObserver |
| Context API | ThemeProvider (split state + dispatch contexts) |

### Advanced
| Concept | Where Used |
|---------|-----------|
| React.lazy + Suspense | App.jsx — code-split all below-fold sections |
| AnimatePresence | Projects filter transitions, Experience panel swap |
| Performance (rAF) | AnimatedCounter — requestAnimationFrame animation |
| IntersectionObserver | AnimatedSection, SkillBar, AnimatedCounter |
| Compound-like patterns | ui/index.jsx shared component library |
| StrictMode | main.jsx — double-invokes effects in dev |
| Dynamic imports | Each section is a separate JS chunk in build |

---

## 🎨 Design System

All design tokens live in `src/index.css` as CSS custom properties:

```css
--bg-primary: #050a0e        /* Main background */
--accent-green: #00ff87      /* Primary accent */
--accent-blue: #60a5fa       /* Secondary accent */
--font-display: 'Syne'       /* Headings */
--font-mono: 'Space Mono'    /* Code/labels */
--font-body: 'DM Sans'       /* Body text */
```

---

## 🔌 Integrations To Add

### Contact Form
Replace the `setTimeout` in `Contact.jsx` with a real service:

**Option A — EmailJS (free, no backend needed)**
```bash
npm install @emailjs/browser
```
```js
import emailjs from '@emailjs/browser';
emailjs.send('service_id', 'template_id', { name, email, message }, 'public_key');
```

**Option B — Formspree**
```js
// Just change the form action:
fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: formData });
```

### Analytics
Add Google Analytics to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
```

---

## 🚀 Deployment

### Vercel (recommended — 1 command)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag & drop the /dist folder at netlify.com/drop
```

### GitHub Pages
```bash
npm install --save-dev gh-pages
# Add to package.json scripts: "deploy": "gh-pages -d dist"
npm run build && npm run deploy
```

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `react` + `react-dom` | Core React |
| `framer-motion` | Animations & transitions |
| `lucide-react` | Icon library |
| `react-intersection-observer` | Scroll-triggered animations |
| `vite` | Build tool + dev server |

---

## 🧩 Extending The Portfolio

**Add a new section:**
1. Create `src/components/sections/YourSection.jsx` + `YourSection.css`
2. Lazy import it in `App.jsx`
3. Add a nav entry to the `NAV_ITEMS` array in `Navbar.jsx`
4. Add a section `id` matching the nav entry

**Add a new project:**
Just push to the `projects` array in `resumeData.js` — the grid updates automatically.

**Add a new skill:**
Update `SKILL_LEVELS` and `CATEGORY_GROUPS` in `Skills.jsx`.

---

## 💡 Learning Path Using This Portfolio

1. **Start** → Read `src/main.jsx` and `src/App.jsx` to understand entry points
2. **Basics** → Study `Hero.jsx` — props, state, events, JSX
3. **Hooks** → Study `About.jsx` — useEffect + IntersectionObserver + rAF
4. **Context** → Study `ThemeContext.jsx` — useReducer + split contexts
5. **Performance** → Study `App.jsx` — React.lazy + Suspense code splitting
6. **Custom Hooks** → Read `src/hooks/index.js` — 8 reusable patterns
7. **Derived State** → Study `Projects.jsx` — useMemo for filtering
8. **Forms** → Study `Contact.jsx` — useReducer for form state machine

---

*Built with React 18 + Vite 5 — © 2024*
