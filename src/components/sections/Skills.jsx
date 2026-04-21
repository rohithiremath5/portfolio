import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { skills } from '../../data/resumeData';
import { AnimatedSection, SectionLabel, SectionTitle, GlowCard } from '../ui';
import './Skills.css';

const SKILL_LEVELS = [
  { name: 'HTML5', level: 100, category: 'Languages', color: '#f7951e' },
  { name: 'CSS3', level: 100, category: 'Languages', color: '#1e1ef7' },
  { name: 'JavaScript (ES6+)', level: 95, category: 'Languages', color: '#f7df1e' },
  { name: 'React.js', level: 92, category: 'Frontend', color: '#61dafb' },
  { name: 'Next.js', level: 88, category: 'Frontend', color: '#ffffff' },
  { name: 'React Native', level: 78, category: 'Frontend', color: '#61dafb' },
  { name: 'Node.js', level: 80, category: 'Backend', color: '#68a063' },
  { name: 'PostgreSQL', level: 72, category: 'Backend', color: '#336791' },
  { name: 'Google Analytics (GA4)', level: 85, category: 'Analytics', color: '#e37400' },
  { name: 'SEO Optimization', level: 82, category: 'Analytics', color: '#4285f4' },
  { name: 'GPT-4 Integration', level: 80, category: 'AI', color: '#a78bfa' },
  { name: 'Prompt Engineering', level: 78, category: 'AI', color: '#a78bfa' },
  { name: 'GCP', level: 65, category: 'Tools', color: '#4285f4' },
  { name: 'Chrome Extension APIs', level: 75, category: 'Tools', color: '#4db8ff' },
];

const CATEGORY_GROUPS = [
  {
    title: 'Languages & Frontend',
    icon: '⚛️',
    color: '#61dafb',
    items: ['JavaScript (ES6+)', 'React.js', 'Next.js', 'React Native', 'Responsive UI', 'CSS Animations', "HTML5", "Tailwind CSS", "CSS3"],
  },
  {
    title: 'Backend & Data',
    icon: '⚙️',
    color: '#68a063',
    items: ['Node.js', 'RESTful APIs', 'PostgreSQL', 'Puppeteer', 'Client-Server Integration'],
  },
  {
    title: 'Analytics & SEO',
    icon: '📊',
    color: '#e37400',
    items: ['Google Analytics (GA4)', 'Search Console API', 'SEO Optimization', 'Performance Optimization', 'Core Web Vitals'],
  },
  {
    title: 'AI & Tooling',
    icon: '🤖',
    color: '#a78bfa',
    items: ['GPT-4 Integration', 'Vector Search', 'Prompt Engineering', 'Google Cloud Platform', 'Chrome Extension APIs'],
  },
];

/**
 * SkillBar — animated progress bar that triggers on scroll
 * Concept: IntersectionObserver + CSS transitions + useEffect
 */
function SkillBar({ name, level, color, index }) {
  const [filled, setFilled] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFilled(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="skill-bar" style={{ '--delay': `${index * 80}ms` }}>
      <div className="skill-bar__header">
        <span className="skill-bar__name font-mono">{name}</span>
        <span className="skill-bar__level font-mono" style={{ color }}>{level}%</span>
      </div>
      <div className="skill-bar__track">
        <div
          className="skill-bar__fill"
          style={{
            width: filled ? `${level}%` : '0%',
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            transitionDelay: `${index * 80}ms`,
          }}
        />
      </div>
    </div>
  );
}

/**
 * SkillChip — tag-style skill chip
 */
function SkillChip({ label, color }) {
  return (
    <motion.span
      className="skill-chip font-mono"
      style={{ '--chip-color': color }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      {label}
    </motion.span>
  );
}

export default function Skills() {
  return (
    <section className="section skills" id="skills">
      <div className="container">
        <AnimatedSection>
          <SectionLabel number="04." label="SKILLS" />
          <SectionTitle accent="Stack.">My Tech</SectionTitle>
        </AnimatedSection>

        {/* Proficiency bars */}
        <AnimatedSection delay={0.1} className="skills__bars-section">
          <h3 className="skills__sub-title font-mono">// Proficiency Levels</h3>
          <div className="skills__bars">
            {SKILL_LEVELS.map((s, i) => (
              <SkillBar key={s.name} {...s} index={i} />
            ))}
          </div>
        </AnimatedSection>

        {/* Category chips */}
        <AnimatedSection delay={0.2} className="skills__categories">
          {CATEGORY_GROUPS.map((group) => (
            <GlowCard key={group.title} className="skill-category" glowColor={group.color}>
              <div className="skill-category__inner">
                <div className="skill-category__header">
                  <span className="skill-category__icon">{group.icon}</span>
                  <h3 className="skill-category__title font-display" style={{ color: group.color }}>
                    {group.title}
                  </h3>
                </div>
                <div className="skill-chips">
                  {group.items.map((item) => (
                    <SkillChip key={item} label={item} color={group.color} />
                  ))}
                </div>
              </div>
            </GlowCard>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
