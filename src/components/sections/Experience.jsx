import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experiences } from '../../data/resumeData';
import { AnimatedSection, SectionLabel, SectionTitle, Badge, GlowCard } from '../ui';
import './Experience.css';

export default function Experience() {
  const [activeId, setActiveId] = useState(experiences[0].id);
  const active = experiences.find((e) => e.id === activeId);

  return (
    <section className="section experience" id="experience">
      <div className="container">
        <AnimatedSection>
          <SectionLabel number="02." label="EXPERIENCE" />
          <SectionTitle accent="Journey.">My</SectionTitle>
        </AnimatedSection>

        <AnimatedSection delay={0.15} className="exp__layout">
          {/* Tab list */}
          <div className="exp__tabs" role="tablist">
            {experiences.map((exp) => (
              <button
                key={exp.id}
                role="tab"
                aria-selected={activeId === exp.id}
                className={`exp__tab font-mono ${activeId === exp.id ? 'exp__tab--active' : ''}`}
                onClick={() => setActiveId(exp.id)}
                style={{ '--tab-color': exp.color }}
              >
                <span className="exp__tab-company">{exp.company.split(' (')[0]}</span>
                <span className="exp__tab-duration">{exp.duration}</span>
              </button>
            ))}

            {/* Timeline connector */}
            <div className="exp__timeline-line" />
          </div>

          {/* Content panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              className="exp__panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlowCard className="exp__card" glowColor={active.color}>
                <div className="exp__card-inner">
                  <div className="exp__header">
                    <div>
                      <h3 className="exp__role font-display">{active.role}</h3>
                      <p className="exp__meta font-mono">
                        <span className="exp__company" style={{ color: active.color }}>
                          {active.company}
                        </span>
                        &nbsp;·&nbsp;
                        <span className="exp__location">{active.location}</span>
                      </p>
                    </div>
                    <div className="exp__badges">
                      <Badge color={active.color}>{active.type}</Badge>
                      <Badge color={active.color} size="sm">{active.duration}</Badge>
                    </div>
                  </div>

                  <ul className="exp__highlights">
                    {active.highlights.map((h, i) => (
                      <motion.li
                        key={i}
                        className="exp__highlight"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <span className="exp__bullet" style={{ color: active.color }}>▶</span>
                        <span>{h}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </GlowCard>
            </motion.div>
          </AnimatePresence>
        </AnimatedSection>
      </div>
    </section>
  );
}
