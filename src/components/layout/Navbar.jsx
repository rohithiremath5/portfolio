import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollSpy, useScrollProgress } from '../../hooks';
import { personalInfo } from '../../data/resumeData';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'react-concepts', label: 'React' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useScrollSpy(NAV_ITEMS.map((i) => i.id));
  const progress = useScrollProgress();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  // Extract initials for logo
  const initials = personalInfo.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'YN';

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="progress-bar"
        style={{ scaleX: progress, transformOrigin: '0%' }}
      />

      <motion.nav
        className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="navbar__inner">
          {/* Logo */}
          <button className="navbar__logo font-display" onClick={() => scrollTo('hero')}>
            <span className="logo-bracket">[</span>
            {initials}
            <span className="logo-bracket">]</span>
          </button>

          {/* Desktop nav */}
          <ul className="navbar__links">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.id}>
                <button
                  className={`nav-link font-mono ${activeId === item.id ? 'nav-link--active' : ''}`}
                  onClick={() => scrollTo(item.id)}
                >
                  <span className="nav-index">0{i + 1}.</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Resume CTA */}
          <a
            href={personalInfo.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__resume font-mono"
          >
            Resume ↗
          </a>

          {/* Hamburger */}
          <button
            className={`hamburger ${mobileOpen ? 'hamburger--open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul>
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <button onClick={() => scrollTo(item.id)} className="mobile-nav-link font-display">
                    <span className="mobile-nav-index font-mono">0{i + 1}.</span>
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <a
              href={personalInfo.resume}
              className="mobile-resume font-mono"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Resume ↗
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
