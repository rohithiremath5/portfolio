import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useThemeState } from '../../context/ThemeContext';
import { personalInfo } from '../../data/resumeData';

const navigation = [['about', 'About'], ['projects', 'Work'], ['experience', 'Experience'], ['skills', 'Skills'], ['contact', 'Contact']];

function ThemeToggle() {
  const { theme, toggleTheme } = useThemeState();
  return <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} aria-pressed={theme === 'dark'}>
    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
  </button>;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    navigation.forEach(([id]) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
      if (event.type === 'pointerdown' && !menuRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', close);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', close); };
  }, [open]);
  return <header className="header">
    <nav className="container nav" aria-label="Main navigation">
      <a className="wordmark" href="#home" aria-label="Rohit Hiremath, home">rh<span>.</span></a>
      <div ref={menuRef} id="main-menu" className={`nav-links ${open ? 'is-open' : ''}`}>
        {navigation.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setOpen(false)}>{label}</a>)}
      </div>
      <div className="nav-actions">
        <ThemeToggle />
        <a className="nav-resume" href={personalInfo.resume} target="_blank" rel="noreferrer">Resume <ArrowUpRight size={15} /></a>
        <button ref={triggerRef} className="icon-button menu-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-menu" onClick={() => setOpen(!open)}>{open ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </nav>
  </header>;
}
