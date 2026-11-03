import { ArrowUpRight, ArrowDown, Download, Github, Linkedin, Mail } from 'lucide-react';
import { personalInfo } from '../../data/resumeData';
import { siteCopy } from '../../data/siteCopy';
import EngineeringVisual from './EngineeringVisual';

export default function Hero() {
  const lastSpace = personalInfo.name.lastIndexOf(' ');
  return <section className="hero" id="home" aria-labelledby="hero-title">
    <div className="container hero-grid">
      <div className="hero-copy">
        <div className="role-pill"><span>{personalInfo.designation}</span><span className="pill-divider" />{personalInfo.location}</div>
        <p className="hero-intro">{siteCopy.hero.introduction}</p>
        <h1 id="hero-title"><span>{personalInfo.name.slice(0, lastSpace)}</span>{' '}<span>{personalInfo.name.slice(lastSpace + 1)}<span className="name-period" aria-hidden="true">.</span></span></h1>
        <p className="hero-headline">{siteCopy.hero.headline}</p>
        <p className="hero-description">{siteCopy.hero.description}</p>
        <div className="hero-actions"><a href="#projects" className="button button-primary">Explore my work <ArrowUpRight size={19} /></a><a href={personalInfo.resume} className="button button-outline" download="Rohit_N_Hiremath_Resume.pdf">Download CV <Download size={17} /></a></div>
        <div className="hero-social"><a href={personalInfo.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={19} /></a><a href={personalInfo.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={19} /></a><a href={`mailto:${personalInfo.email}`} aria-label="Email Rohit"><Mail size={19} /></a><span>{siteCopy.hero.invitation}</span></div>
      </div>
      <EngineeringVisual />
      <div className="hero-bottom"><span>{personalInfo.tagline}</span><a href="#about">{siteCopy.hero.aboutLink} <ArrowDown size={16} /></a></div>
    </div>
  </section>;
}
