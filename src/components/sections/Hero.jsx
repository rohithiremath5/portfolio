import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, ArrowDown } from 'lucide-react';
import { personalInfo } from '../../data/resumeData';
import { TerminalText, Pill } from '../ui';
import './Hero.css';

const TERMINAL_TEXTS = [
  'Building React dashboards',
  'Integrating GA4 + Search Console',
  'Crafting AI-powered workflows',
  'Optimizing Core Web Vitals',
  'Shipping production features',
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const SOCIAL_LINKS = [
  { icon: Github, href: personalInfo.github, label: 'GitHub' },
  { icon: Linkedin, href: personalInfo.linkedin, label: 'LinkedIn' },
  { icon: Mail, href: `mailto:${personalInfo.email}`, label: 'Email' },
  { icon: Phone, href: `tel:${personalInfo.phone}`, label: 'Phone' },
];

export default function Hero() {
  const scrollToAbout = () =>
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="hero section" id="hero">
      {/* Ambient background blobs */}
      <div className="hero-blob hero-blob--1" />
      <div className="hero-blob hero-blob--2" />
      <div className="hero-blob hero-blob--3" />

      {/* Grid overlay */}
      <div className="hero-grid" />

      <div className="container hero__content">
        <motion.div
          className="hero__text"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Status badge */}
          <motion.div variants={item}>
            <Pill label="Available for new opportunities" active />
          </motion.div>

          {/* Location + contact row */}
          <motion.p variants={item} className="hero__location font-mono">
            <span className="location-dot">◈</span>
            {personalInfo.location}
            <span className="hero__email">
              &nbsp;·&nbsp;{personalInfo.email}
            </span>
          </motion.p>

          {/* Name */}
          <motion.h1 variants={item} className="hero__name font-display">
            {personalInfo.name}
          </motion.h1>

          {/* Designation */}
          <motion.div variants={item} className="hero__designation">
            <span className="font-mono designation-bracket">{'<'}</span>
            <span className="designation-title font-display">{personalInfo.designation}</span>
            <span className="font-mono designation-bracket">{'/>'}</span>
          </motion.div>

          {/* Animated tagline */}
          <motion.div variants={item} className="hero__typewriter">
            <span className="typewriter-prefix font-mono">$ </span>
            <TerminalText texts={TERMINAL_TEXTS} speed={55} />
          </motion.div>

          {/* Bio */}
          <motion.p variants={item} className="hero__bio">
            {personalInfo.bio}
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={item} className="hero__ctas">
            <a
              href={personalInfo.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary font-mono"
            >
              View Resume ↗
            </a>
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="cta-ghost font-mono"
            >
              See Projects →
            </button>
          </motion.div>

          {/* Social links */}
          <motion.div variants={item} className="hero__socials">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — decorative terminal card */}
        <motion.div
          className="hero__terminal"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <TerminalCard />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        className="scroll-indicator"
        onClick={scrollToAbout}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        aria-label="Scroll down"
      >
        <ArrowDown size={20} />
      </motion.button>
    </section>
  );
}

function TerminalCard() {
  const lines = [
    { prompt: true, text: 'whoami' },
    { prompt: false, text: personalInfo.name || 'Full Stack Engineer', accent: true },
    { prompt: true, text: 'cat skills.json' },
    { prompt: false, text: '{ "react": "★★★★★",' },
    { prompt: false, text: '  "nextjs": "★★★★★",' },
    { prompt: false, text: '  "nodejs": "★★★★☆",' },
    { prompt: false, text: '  "ai_integration": "★★★★☆" }' },
    { prompt: true, text: 'echo $STATUS' },
    { prompt: false, text: 'Open to work ✓', accent: true },
    { prompt: true, text: '', blink: true },
  ];

  return (
    <div className="terminal-card">
      <div className="terminal-card__header">
        <div className="terminal-dots">
          <span style={{ background: '#ff5f56' }} />
          <span style={{ background: '#ffbd2e' }} />
          <span style={{ background: '#27c93f' }} />
        </div>
        <span className="terminal-card__title font-mono">profile.sh</span>
      </div>
      <div className="terminal-card__body font-mono">
        {lines.map((line, i) => (
          <div key={i} className="terminal-line">
            {line.prompt && (
              <span className="terminal-prompt">
                <span className="t-user">dev</span>
                <span className="t-at">@</span>
                <span className="t-host">portfolio</span>
                <span className="t-tilde"> ~</span>
                <span className="t-dollar"> $</span>
              </span>
            )}
            <span
              className={`terminal-output ${line.accent ? 'terminal-output--accent' : ''} ${line.blink ? 'terminal-output--blink' : ''}`}
            >
              {line.prompt ? ` ${line.text}` : line.text}
              {line.blink && <span className="terminal-cursor" />}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
