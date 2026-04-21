import { motion } from 'framer-motion';
import { education } from '../../data/resumeData';
import { AnimatedSection, SectionLabel, SectionTitle, GlowCard } from '../ui';
import './Education.css';

export default function Education() {
  return (
    <section className="section education" id="education">
      <div className="container">
        <AnimatedSection>
          <SectionLabel number="06." label="EDUCATION" />
          <SectionTitle accent="Learned.">Where I</SectionTitle>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="edu__timeline">
          {education.map((edu, i) => (
            <motion.div
              key={edu.degree}
              className="edu__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Timeline dot */}
              <div className="edu__dot-col">
                <div className="edu__dot">
                  <span>{edu.icon}</span>
                </div>
                {i < education.length - 1 && <div className="edu__connector" />}
              </div>

              {/* Card */}
              <GlowCard className="edu__card">
                <div className="edu__card-inner">
                  <div className="edu__meta font-mono">
                    <span className="edu__duration">{edu.duration}</span>
                    <span className="edu__score">{edu.score}</span>
                  </div>
                  <h3 className="edu__degree font-display">{edu.degree}</h3>
                  <p className="edu__institution">{edu.institution}</p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
