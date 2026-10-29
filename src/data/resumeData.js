import resumePdf from './Rohit_N_Hiremath_Frontend_developer.pdf?url';

// Resume PDF is the source of truth. GitHub is retained from the existing portfolio.
export const personalInfo = {
  name: 'Rohit N Hiremath',
  designation: 'Software Engineer',
  tagline: 'Frontend craft. Full-stack thinking.',
  email: 'rohithiremath05@gmail.com',
  phone: '+91 9380103110',
  location: 'Bengaluru, India',
  linkedin: 'https://www.linkedin.com/in/rohit-n-hiremath',
  github: 'https://github.com/rohithiremath5',
  resume: resumePdf,
  bio: 'I’m a software engineer with 3 years of experience building web applications, analytics platforms, and AI-enabled features. I bring React and Next.js interfaces to life, connect them to reliable APIs, and turn complex business requirements into usable products.',
  currentFocus: 'At Enterprisebot, I’m working with Python-based RAG systems, DocBrain knowledge bases, document chunking, and vector databases — exploring how the right information reaches the right answer.',
};
export const skills = {
  frontend: ['React.js', 'Next.js', 'React Native', 'Tailwind CSS', 'CSS Modules', 'Responsive Design'],
  languages: ['JavaScript (ES6+)', 'Python', 'TypeScript (Basic)', 'HTML5', 'CSS3'],
  backend: ['Node.js', 'RESTful APIs', 'PostgreSQL', 'API Integration', 'Postman'],
  ai: ['RAG', 'Knowledge Bases', 'Vector Databases', 'Generative AI', 'OpenAI API'],
  tools: ['GCP', 'AWS', 'Git', 'GitHub', 'Chrome Extension APIs', 'Linux'],
};
export const experiences = [
  { id: 1, role: 'Software Engineer', company: 'Enterprisebot', duration: 'May 2026 — Present', type: 'Current role', highlights: [
    'Working on Python-based Retrieval-Augmented Generation systems and document retrieval workflows.',
    'Working with DocBrain knowledge bases to understand how documents are processed, organized, and made available for retrieval.',
    'Gaining hands-on experience with document chunking strategies and vector databases for AI-powered knowledge systems.',
  ] },
  { id: 2, role: 'Software Engineer — Frontend', company: 'AdSpyder', companyDetail: 'GSTECH Technology Pvt Ltd', duration: 'Feb 2024 — Apr 2026', type: 'Full-time', highlights: [
    'Led Next.js landing page development and optimization, improving performance, SEO, and user experience.',
    'Designed analytics dashboards with React, GA4, and Search Console APIs, and owned a reusable React and Tailwind CSS component system.',
    'Integrated GPT-4 ad generation features and partnered with designers to deliver responsive interfaces across Chrome, Firefox, and Safari.',
    'Participated in Agile sprints, GitHub code reviews, and Git branching workflows.',
  ] },
  { id: 3, role: 'Chrome Extension Developer Intern', company: 'AdSpyder', companyDetail: 'GSTECH Technology Pvt Ltd', duration: 'Aug 2023 — Jan 2024', type: 'Internship', highlights: [
    'Developed and published Dark Mode for Google Docs, reaching 40,000+ active users and 155 ratings on the Chrome Web Store.',
    'Built Roblox Friend Manager using the official Roblox API, CSRF protection, and infinite scroll; adopted by 678+ users within weeks of launch.',
    'Integrated REST APIs for real-time data fetching and tested extensions across multiple Chrome versions.',
  ] },
];
export const projects = [
  { id: 1, title: 'Omni-Channel Analytics Dashboard', category: 'Analytics platform', visual: 'analytics', stack: ['React.js', 'Next.js', 'Node.js', 'GA4 API'], description: 'A responsive dashboard bringing multi-platform ad performance into one view. I owned its design and development, integrated GA4 and Search Console APIs, and added lazy loading for better performance.', highlights: ['Real-time API integration', 'Responsive data visualization', 'Cross-browser compatibility'] },
  { id: 2, title: 'AI-Orchestrated Mobile Application Suite', category: 'Mobile development', visual: 'mobile', stack: ['React Native', 'GPT-4', 'Prompt Engineering'], description: 'Cross-platform mobile applications built around reusable UI components. I translated business requirements into structured feature flows and used GPT-4 to accelerate parts of development.', highlights: ['Cross-platform components', 'Structured product flows', 'AI-assisted development'] },
  { id: 3, title: 'AI-Driven Creative Ad Generator', category: 'Generative AI', visual: 'creative', stack: ['React.js', 'Node.js', 'OpenAI API'], description: 'A user-facing interface for personalized ad creatives, connecting GPT-4 and vector search through REST APIs. I built responsive components and handled frontend API integration end-to-end.', highlights: ['Personalized ad generation', 'GPT-4 and vector search', 'End-to-end frontend integration'] },
  { id: 4, title: 'Distributed Ad Data Ingestion System', category: 'Backend & data', visual: 'pipeline', stack: ['Node.js', 'Puppeteer', 'PostgreSQL'], description: 'Backend pipelines processing large volumes of ad data for real-time frontend dashboards. I contributed to data parsing and query optimization to improve delivery speed for the analytics UI.', highlights: ['Ad data processing', 'Query optimization', 'Dashboard data availability'] },
];
export const extensions = [
  { title: 'Dark Mode for Google Docs', description: 'Published on the Chrome Web Store and featured in Workflow & Planning.', metric: '40,000+', label: 'active users', icon: 'moon' },
  { title: 'Roblox Friend Manager', description: 'Official API integration, CSRF protection, and infinite scrolling.', metric: '678+', label: 'users within weeks', icon: 'users' },
];
export const education = [
  { degree: 'Bachelor of Engineering in Computer Science', institution: 'BIET, Davangere', score: 'CGPA 7.75' },
  { degree: 'Pre-University (PCMC)', institution: 'Sir M V College, Davangere', score: '82.1%' },
];
export const stats = [
  { value: '3', suffix: '', label: 'Years of experience' },
  { value: '40k', suffix: '+', label: 'Extension users' },
  { value: '4', suffix: '', label: 'Featured projects' },
];
