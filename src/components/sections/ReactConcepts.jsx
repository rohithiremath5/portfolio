import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reactConcepts } from '../../data/resumeData';
import { AnimatedSection, SectionLabel, SectionTitle, GlowCard, Badge } from '../ui';
import './ReactConcepts.css';

const LEVEL_COLORS = {
  Basic: '#00ff87',
  Intermediate: '#60a5fa',
  Advanced: '#a78bfa',
  Expert: '#f59e0b',
};

/**
 * ReactConcepts — interactive learning reference
 * Demonstrates: useState for accordion, computed styles, AnimatePresence
 */
export default function ReactConcepts() {
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleCategory = (cat) =>
    setActiveCategory((prev) => (prev === cat ? null : cat));

  return (
    <section className="section react-concepts" id="react-concepts">
      <div className="container">
        <AnimatedSection>
          <SectionLabel number="05." label="REACT_CONCEPTS" />
          <SectionTitle accent="Internals.">React</SectionTitle>
          <p className="rc__intro">
            An interactive reference of React concepts — from fundamentals to advanced patterns.
            Click any category to explore. This section doubles as a learning resource.
          </p>
        </AnimatedSection>

        {/* Level legend */}
        <AnimatedSection delay={0.1} className="rc__legend">
          {Object.entries(LEVEL_COLORS).map(([level, color]) => (
            <div key={level} className="rc__legend-item">
              <span className="rc__legend-dot" style={{ background: color }} />
              <span className="font-mono" style={{ color, fontSize: '0.75rem' }}>{level}</span>
            </div>
          ))}
        </AnimatedSection>

        {/* Accordion categories */}
        <AnimatedSection delay={0.15} className="rc__categories">
          {reactConcepts.map((cat, i) => (
            <ConceptCategory
              key={cat.category}
              category={cat}
              index={i}
              isOpen={activeCategory === cat.category}
              onToggle={() => toggleCategory(cat.category)}
            />
          ))}
        </AnimatedSection>

        {/* Quick reference card */}
        <AnimatedSection delay={0.2} className="rc__quick-ref">
          <GlowCard className="quick-ref-card" glowColor="#00ff87">
            <div className="quick-ref-inner">
              <h3 className="quick-ref-title font-display">
                💡 Hook Decision Guide
              </h3>
              <div className="quick-ref-grid font-mono">
                {HOOK_GUIDE.map((item) => (
                  <div key={item.hook} className="hook-guide-item">
                    <span className="hook-name">{item.hook}</span>
                    <span className="hook-when">{item.when}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlowCard>
        </AnimatedSection>
      </div>
    </section>
  );
}

function ConceptCategory({ category, index, isOpen, onToggle }) {
  const color = LEVEL_COLORS[category.level] || '#00ff87';

  return (
    <motion.div
      className="rc__category"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Category header — accordion trigger */}
      <button
        className={`rc__category-header ${isOpen ? 'rc__category-header--open' : ''}`}
        onClick={onToggle}
        style={{ '--cat-color': color }}
      >
        <div className="rc__category-left">
          <span className="rc__category-num font-mono" style={{ color }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className="rc__category-title font-display">{category.category}</h3>
            <span className="rc__concept-count font-mono">
              {category.concepts.length} concepts
            </span>
          </div>
        </div>
        <div className="rc__category-right">
          <Badge color={color}>{category.level}</Badge>
          <span className="rc__chevron">{isOpen ? '−' : '+'}</span>
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="rc__concepts-grid"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rc__concepts-inner">
              {category.concepts.map((concept, i) => (
                <motion.div
                  key={concept.name}
                  className="rc__concept-card"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ '--card-color': color }}
                >
                  <span className="rc__concept-name font-mono" style={{ color }}>
                    {concept.name}
                  </span>
                  <p className="rc__concept-desc">{concept.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const HOOK_GUIDE = [
  { hook: 'useState', when: 'Simple local UI state (toggles, inputs, counters)' },
  { hook: 'useReducer', when: 'Complex state with multiple sub-values or actions' },
  { hook: 'useEffect', when: 'Side effects — data fetch, subscriptions, DOM mutations' },
  { hook: 'useRef', when: 'DOM refs, mutable values that don\'t trigger re-renders' },
  { hook: 'useMemo', when: 'Expensive computed values — prevent recalculation' },
  { hook: 'useCallback', when: 'Stable function refs for child components / deps' },
  { hook: 'useContext', when: 'Share data deep in tree without prop drilling' },
  { hook: 'useLayoutEffect', when: 'Sync DOM measurements before browser paint' },
];
