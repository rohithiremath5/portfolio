import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Star } from 'lucide-react';
import { projects } from '../../data/resumeData';
import { AnimatedSection, SectionLabel, SectionTitle, Badge, GlowCard } from '../ui';
import './Projects.css';

const FILTERS = ['All', 'Featured', 'Frontend', 'Backend', 'AI'];

/**
 * Projects section demonstrates:
 * - useMemo for derived/filtered data
 * - AnimatePresence for list animations
 * - Compound component-like pattern
 */
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');

  // useMemo — only recomputes when projects or filter changes
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    if (activeFilter === 'Featured') return projects.filter((p) => p.featured);
    if (activeFilter === 'Frontend') return projects.filter((p) =>
      p.stack.some((s) => ['React.js', 'Next.js', 'React Native'].includes(s))
    );
    if (activeFilter === 'Backend') return projects.filter((p) =>
      p.stack.some((s) => ['Node.js', 'PostgreSQL', 'Puppeteer'].includes(s))
    );
    if (activeFilter === 'AI') return projects.filter((p) =>
      p.stack.some((s) => s.toLowerCase().includes('gpt') || s.toLowerCase().includes('openai') || s.toLowerCase().includes('vector'))
    );
    return projects;
  }, [activeFilter]);

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <AnimatedSection>
          <SectionLabel number="03." label="PROJECTS" />
          <SectionTitle accent="Built.">What I've</SectionTitle>
        </AnimatedSection>

        {/* Filter bar */}
        <AnimatedSection delay={0.1} className="projects__filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn font-mono ${activeFilter === f ? 'filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
              {f === 'All' && <span className="filter-count">{projects.length}</span>}
            </button>
          ))}
        </AnimatedSection>

        {/* Project grid */}
        <motion.div className="projects__grid" layout>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * ProjectCard — isolated component for single project
 * Concept: component composition, props destructuring
 */
function ProjectCard({ project }) {
  return (
    <GlowCard className="project-card" glowColor={project.color}>
      <div className="project-card__inner">
        {/* Header */}
        <div className="project-card__top">
          <div className="project-icon">{project.icon}</div>
          <div className="project-card__links">
            {project.featured && (
              <span className="featured-badge">
                <Star size={10} fill="currentColor" /> Featured
              </span>
            )}
            <a href={project.github} target="_blank" rel="noopener noreferrer"
               className="project-link" aria-label="GitHub">
              <Github size={16} />
            </a>
            <a href={project.live} target="_blank" rel="noopener noreferrer"
               className="project-link" aria-label="Live Demo">
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Title & description */}
        <h3 className="project-title font-display" style={{ color: project.color }}>
          {project.title}
        </h3>
        <p className="project-subtitle font-mono">{project.subtitle}</p>
        <p className="project-desc">{project.description}</p>

        {/* Highlights */}
        <ul className="project-highlights">
          {project.highlights.map((h, i) => (
            <li key={i} className="project-highlight font-mono">
              <span style={{ color: project.color }}>→</span> {h}
            </li>
          ))}
        </ul>

        {/* Stack */}
        <div className="project-stack">
          {project.stack.map((s) => (
            <Badge key={s} color={project.color} size="sm">{s}</Badge>
          ))}
        </div>
      </div>

      {/* Color accent bar */}
      <div
        className="project-accent-bar"
        style={{ background: `linear-gradient(90deg, ${project.color}, ${project.accent})` }}
      />
    </GlowCard>
  );
}
