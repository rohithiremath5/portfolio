// ============================================================
// UI COMPONENTS — Reusable building blocks
// ============================================================

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './ui.css';

/**
 * AnimatedSection — fade-in-up on scroll using Intersection Observer
 * Concept: forwardRef, motion variants, children pattern
 */
export function AnimatedSection({ children, className = '', delay = 0, id }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * SectionLabel — consistent section header style
 */
export function SectionLabel({ number, label }) {
  return (
    <div className="section-label">
      <span className="section-number font-mono">{number}</span>
      <span className="section-label-text font-mono">{label}</span>
      <div className="section-line" />
    </div>
  );
}

/**
 * SectionTitle — large display heading
 */
export function SectionTitle({ children, accent }) {
  return (
    <h2 className="section-title font-display">
      {children}
      {accent && <span className="section-title-accent"> {accent}</span>}
    </h2>
  );
}

/**
 * Badge — small pill tag for skills/stack
 */
export function Badge({ children, color = 'var(--accent-green)', size = 'sm' }) {
  return (
    <span
      className={`badge badge--${size}`}
      style={{
        color,
        borderColor: `${color}40`,
        background: `${color}10`,
      }}
    >
      {children}
    </span>
  );
}

/**
 * GlowCard — card with hover glow effect
 * Concept: CSS custom properties + mouse tracking for dynamic glow
 */
export function GlowCard({ children, className = '', glowColor = '#00ff87' }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <div
      ref={cardRef}
      className={`glow-card ${className}`}
      style={{ '--glow-color': glowColor }}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
}

/**
 * TerminalText — typewriter effect component
 * Concept: useEffect + useState for character-by-character reveal
 */
export function TerminalText({ texts = [], speed = 50 }) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!texts.length) return;
    const current = texts[textIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < current.length) {
          setDisplayText(current.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(current.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((i) => (i + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, textIndex, texts, speed]);

  return (
    <span className="terminal-text font-mono">
      {displayText}
      <span className="terminal-cursor" />
    </span>
  );
}

/**
 * Pill — status indicator
 */
export function Pill({ label, active = false }) {
  return (
    <span className={`pill ${active ? 'pill--active' : ''}`}>
      {active && <span className="pill-dot" />}
      {label}
    </span>
  );
}

/**
 * ExternalLink button
 */
export function LinkButton({ href, children, variant = 'primary' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`link-button link-button--${variant}`}
    >
      {children}
    </a>
  );
}
