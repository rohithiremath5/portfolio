import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { personalInfo, stats } from '../../data/resumeData';
import { AnimatedSection, SectionLabel, SectionTitle, GlowCard } from '../ui';
import './About.css';

/**
 * AnimatedCounter — demonstrates useRef + requestAnimationFrame
 * This is a manual implementation to show React + animation patterns
 */
function AnimatedCounter({ value, suffix, label }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * value));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [started, value]);

  return (
    <GlowCard className="stat-card">
      <div ref={ref} className="stat-inner">
        <div className="stat-value font-display">
          {count}<span className="stat-suffix">{suffix}</span>
        </div>
        <p className="stat-label font-mono">{label}</p>
      </div>
    </GlowCard>
  );
}

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <AnimatedSection>
          <SectionLabel number="01." label="ABOUT_ME" />
          <SectionTitle accent="Engineer.">I'm a</SectionTitle>
        </AnimatedSection>

        <div className="about__grid">
          {/* Text col */}
          <AnimatedSection delay={0.1} className="about__text">
            <p>
              I'm a Full-Stack Software Engineer with <strong>3 years of hands-on experience</strong>,
              currently based in Bengaluru. My primary focus is frontend engineering with React.js
              and Next.js — I care deeply about performance, user experience, and code quality.
            </p>
            <p>
              At <strong className="text-accent">AdSpyder</strong>, I've built everything from
              SEO-optimized landing pages to real-time analytics dashboards powered by GA4 and
              Search Console APIs. I also love integrating AI into products — GPT-4, vector search,
              and prompt engineering are part of my regular toolkit.
            </p>
            <p>
              Beyond work, I'm passionate about learning React internals, system design, and how
              frontend architecture decisions affect the end user. I document concepts I learn to
              help others get up to speed faster.
            </p>

            <div className="about__contact-grid">
              <div className="contact-item">
                <span className="contact-label font-mono">Phone</span>
                <a href={`tel:${personalInfo.phone}`} className="contact-value">
                  {personalInfo.phone}
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-label font-mono">Email</span>
                <a href={`mailto:${personalInfo.email}`} className="contact-value">
                  {personalInfo.email}
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-label font-mono">LinkedIn</span>
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="contact-value text-accent">
                  linkedin/in/profile ↗
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-label font-mono">GitHub</span>
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="contact-value text-accent">
                  github.com/rohithiremath5 ↗
                </a>
              </div>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection delay={0.2} className="about__stats">
            {stats.map((stat) => (
              <AnimatedCounter key={stat.label} {...stat} />
            ))}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
