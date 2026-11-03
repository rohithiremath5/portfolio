import { BookOpen, Braces, Cable, Database, MonitorSmartphone, Network, Puzzle, Sparkles } from 'lucide-react';

// Vendored, unmodified SVGs; upstream URLs and licenses are in public/skill-icons/.
// Tone changes only the surrounding surface (or inverts monochrome marks).
const brandIcons = {
  'React.js': { file: 'react', tone: 'cyan' },
  'Next.js': { file: 'nextjs', tone: 'monochrome' },
  'React Native': { file: 'react', tone: 'cyan' },
  'Tailwind CSS': { file: 'tailwindcss', tone: 'cyan' },
  'CSS Modules': { file: 'cssmodules', tone: 'monochrome' },
  'JavaScript (ES6+)': { file: 'javascript' },
  Python: { file: 'python' },
  'TypeScript (Basic)': { file: 'typescript' },
  HTML5: { file: 'html5' },
  CSS3: { file: 'css3' },
  'Node.js': { file: 'nodejs' },
  PostgreSQL: { file: 'postgresql' },
  Postman: { file: 'postman' },
  'OpenAI API': { file: 'openai', tone: 'monochrome' },
  GCP: { file: 'googlecloud' },
  AWS: { file: 'amazonwebservices', tone: 'light-surface' },
  Git: { file: 'git' },
  GitHub: { file: 'github', tone: 'monochrome' },
  Linux: { file: 'linux', tone: 'monochrome' },
};

const conceptIcons = {
  'Responsive Design': MonitorSmartphone,
  'RESTful APIs': Braces,
  'API Integration': Cable,
  RAG: Network,
  'Knowledge Bases': BookOpen,
  'Vector Databases': Database,
  'Generative AI': Sparkles,
  'Chrome Extension APIs': Puzzle,
};

export default function SkillIcon({ name }) {
  const brand = brandIcons[name];
  if (brand) {
    return <span className={`skill-card__icon${brand.tone ? ` skill-card__icon--${brand.tone}` : ''}`} aria-hidden="true">
      <img src={`/skill-icons/${brand.file}.svg`} width="32" height="32" alt="" loading="lazy" decoding="async" />
    </span>;
  }

  const Icon = conceptIcons[name] || Braces;
  return <span className="skill-card__icon skill-card__icon--generic" aria-hidden="true">
    <Icon size={32} strokeWidth={1.6} focusable="false" />
  </span>;
}
