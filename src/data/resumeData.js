// ============================================================
// PORTFOLIO DATA — Fill in your personal details below
// ============================================================

export const personalInfo = {
  name: "ROHIT N HIREMATH",
  designation: "Full Stack Engineer",
  tagline: "Frontend Specialist · React · Next.js · AI Workflows",
  email: "rohithiremath05@gmail.com",
  phone: "+91 9380103110",
  location: "Bengaluru, India",
  linkedin: "https://www.linkedin.com/in/rohit-n-hiremath-50128418b",
  github: "https://github.com/rohithiremath5",
  resume: "https://drive.google.com/file/d/1yi8Xhyd8NmNjVOrZkuGFXEVB398o-Oo0/view?usp=sharing",                      // link to your PDF resume
  bio: `Full-stack Software Engineer with 3 years of experience specializing in React.js and Next.js, building data-driven dashboards and scalable backend systems. I turn complex analytics data into beautiful, performant interfaces — and I love integrating AI into everyday workflows.`,
};

export const skills = {
  languages: ["JavaScript (ES6+)", "HTML5", "CSS3"],
  frontend: ["React.js", "Next.js", "React Native", "Responsive UI", "CSS Animations"],
  backend: ["Node.js", "RESTful APIs", "PostgreSQL", "Puppeteer"],
  analytics: ["Google Analytics (GA4)", "Search Console API", "SEO Optimization", "Performance Optimization"],
  ai: ["GPT-4 Integration", "Vector Search", "Prompt Engineering", "AI Workflows"],
  tools: ["Google Cloud Platform", "Chrome Extension APIs", "Vite", "Git"],
};

export const experiences = [
  {
    id: 1,
    role: "Software Engineer (Full Stack – Frontend Focus)",
    company: "AdSpyder (GSTECH Pvt Ltd)",
    location: "Bengaluru, India",
    duration: "Feb 2024 – Present",
    type: "Full-time",
    color: "#00ff87",
    highlights: [
      "Engineered and optimized Next.js landing pages — improved SEO rankings and reduced page load latency significantly",
      "Built interactive dashboards integrating GA4 & Search Console APIs to visualize multi-platform performance metrics",
      "Enhanced frontend data visualization components, improving UX and engagement across analytics workflows",
      "Implemented AI-driven features (GPT-4, Vector Search) to automate content generation, reducing manual effort for end-users",
    ],
  },
  {
    id: 2,
    role: "Chrome Extension Developer Intern (Frontend Focus)",
    company: "AdSpyder (GSTECH Pvt Ltd)",
    location: "Bengaluru, India",
    duration: "Aug 2023 – Jan 2024",
    type: "Internship",
    color: "#60a5fa",
    highlights: [
      "Built Chrome Extensions with user-facing interfaces to capture and display live ad data directly within the browser",
      "Developed frontend-integrated tools for product research, streamlining Amazon ASIN identification workflows",
    ],
  },
];

export const projects = [
  {
    id: 1,
    title: "Omni-Channel Analytics Dashboard",
    subtitle: "Real-time multi-platform performance visualization",
    stack: ["React.js", "Next.js", "Node.js", "GA4 API", "Search Console API"],
    color: "#00ff87",
    accent: "#00c96d",
    icon: "📊",
    description:
      "A responsive dashboard UI to visualize multi-platform analytics data. Integrated GA4 and Search Console APIs for real-time updates and dynamic rendering. Enabled real-time tracking of top-performing ads, increasing session duration.",
    highlights: [
      "Real-time data updates via GA4 & Search Console APIs",
      "Dynamic UI rendering with React state management",
      "Improved user session duration through intuitive UX",
    ],
    github: "#",
    live: "#",
    featured: true,
  },
  {
    id: 2,
    title: "AI-Orchestrated Mobile App Suite",
    subtitle: "Cross-platform mobile apps powered by GPT-4",
    stack: ["React Native", "GPT-4", "Prompt Engineering"],
    color: "#a78bfa",
    accent: "#7c3aed",
    icon: "🤖",
    description:
      "Cross-platform mobile applications using React Native with scalable UI components. AI-driven workflows accelerated development lifecycle by 60%, translating business requirements into functional UI systems.",
    highlights: [
      "60% reduction in development time via AI-driven workflows",
      "Scalable UI component architecture",
      "Structured feature flows from business requirements",
    ],
    github: "#",
    live: "#",
    featured: true,
  },
  {
    id: 3,
    title: "AI-Driven Creative Ad Generator",
    subtitle: "GPT-4 powered personalized ad creative generation",
    stack: ["Node.js", "OpenAI API", "Vector Database"],
    color: "#f59e0b",
    accent: "#d97706",
    icon: "✨",
    description:
      "User-facing systems to generate personalized ad creatives based on user inputs. Integrated GPT-4 workflows for dynamic content generation with improved usability and conversion-focused outputs.",
    highlights: [
      "Personalized ad creatives from user input",
      "GPT-4 dynamic content generation pipeline",
      "Vector database for semantic search & retrieval",
    ],
    github: "#",
    live: "#",
    featured: false,
  },
  {
    id: 4,
    title: "Distributed Ad Data Ingestion System",
    subtitle: "Backend pipeline handling 50M+ records",
    stack: ["Node.js", "Puppeteer", "PostgreSQL"],
    color: "#f43f5e",
    accent: "#e11d48",
    icon: "⚙️",
    description:
      "Backend systems supporting real-time data availability for frontend dashboards. Optimized data pipelines handling 50M+ records, ensuring fast and consistent data delivery.",
    highlights: [
      "50M+ records processed efficiently",
      "Real-time data availability for dashboards",
      "Optimized PostgreSQL queries for fast delivery",
    ],
    github: "#",
    live: "#",
    featured: false,
  },
];

export const education = [
  {
    degree: "Bachelor of Engineering — Computer Science",
    institution: "BIET, Davangere",
    duration: "2018 – 2022",
    score: "CGPA: 7.75",
    icon: "🎓",
  },
  {
    degree: "Pre-University (PCMC)",
    institution: "Sir M V College, Davangere",
    duration: "2016 – 2018",
    score: "82.1%",
    icon: "📚",
  },
  {
    degree: "High School",
    institution: "KLE School, Haveri",
    duration: "2013 – 2016",
    score: "CGPA: 9.4",
    icon: "🏫",
  },
];

export const stats = [
  { label: "Years Experience", value: 3, suffix: "+" },
  { label: "Projects Shipped", value: 12, suffix: "+" },
  { label: "Records Processed", value: 50, suffix: "M+" },
  { label: "Dev Time Saved", value: 60, suffix: "%" },
];

export const reactConcepts = [
  {
    category: "Core Fundamentals",
    level: "Basic",
    color: "#00ff87",
    concepts: [
      { name: "JSX & Rendering", desc: "Component rendering, conditional rendering, lists & keys" },
      { name: "Props & State", desc: "Data flow, useState, controlled vs uncontrolled components" },
      { name: "Event Handling", desc: "Synthetic events, form handling, event delegation" },
      { name: "Component Lifecycle", desc: "Mount, update, unmount phases with hooks" },
    ],
  },
  {
    category: "Hooks Deep Dive",
    level: "Intermediate",
    color: "#60a5fa",
    concepts: [
      { name: "useState & useReducer", desc: "Local state, complex state with reducer pattern" },
      { name: "useEffect & useLayoutEffect", desc: "Side effects, cleanup, dependency arrays" },
      { name: "useRef & useImperativeHandle", desc: "DOM refs, forwarding refs, imperative APIs" },
      { name: "useCallback & useMemo", desc: "Memoization strategies and performance optimization" },
      { name: "useContext", desc: "Context API for global state without prop drilling" },
      { name: "Custom Hooks", desc: "Reusable stateful logic extraction and composition" },
    ],
  },
  {
    category: "Advanced Patterns",
    level: "Advanced",
    color: "#a78bfa",
    concepts: [
      { name: "Code Splitting & Lazy Loading", desc: "React.lazy, Suspense, dynamic imports" },
      { name: "Error Boundaries", desc: "Graceful error handling in component trees" },
      { name: "Render Props & HOCs", desc: "Component composition patterns" },
      { name: "Compound Components", desc: "Flexible, expressive component APIs" },
      { name: "Concurrent Features", desc: "useTransition, useDeferredValue, Suspense" },
      { name: "Portals", desc: "Rendering outside the root DOM hierarchy" },
      { name: "Virtualization", desc: "Windowing large lists for performance" },
      { name: "Reconciliation", desc: "Virtual DOM diffing algorithm internals" },
    ],
  },
  {
    category: "Ecosystem & Architecture",
    level: "Expert",
    color: "#f59e0b",
    concepts: [
      { name: "Next.js App Router", desc: "SSR, SSG, ISR, Server Components" },
      { name: "State Management", desc: "Zustand, Redux Toolkit, React Query" },
      { name: "Testing", desc: "React Testing Library, Jest, Vitest" },
      { name: "Performance Profiling", desc: "React DevTools, bundle analysis, Core Web Vitals" },
    ],
  },
];
