import { ArrowUpRight, ArrowDown, Code2, Download, Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import { personalInfo } from '../../data/resumeData';

export default function Hero() {
  return <section className="hero container" id="home" aria-labelledby="hero-title">
    <div className="hero-copy">
      <div className="role-pill"><span className="status-dot" /> Software Engineer <span className="pill-divider" /> Bengaluru, India</div>
      <p className="hero-intro">Hey, I’m Rohit <span className="wave" aria-hidden="true">✳</span></p>
      <h1 id="hero-title">Thoughtful code.<br /><span className="serif accent">Meaningful</span><br />experiences<span className="accent">.</span></h1>
      <p className="hero-description">I build interfaces that make complex things feel simple.<br className="desktop-break" /> React, Next.js, and a growing curiosity for AI.</p>
      <div className="hero-actions"><a href="#projects" className="button button-primary">Explore my work <ArrowUpRight size={18} /></a><a href={personalInfo.resume} className="button button-outline" download="Rohit_N_Hiremath_Resume.pdf">Download CV <Download size={16} /></a></div>
      <div className="hero-social"><a href={personalInfo.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a><a href={personalInfo.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a><a href={`mailto:${personalInfo.email}`} aria-label="Email Rohit"><Mail size={18} /></a><span className="social-rule" /><span>Let’s build something useful.</span></div>
    </div>
    <div className="hero-art" aria-label="Illustration of frontend development and connected AI systems" role="img">
      <div className="art-grid" /><span className="art-corner corner-top">IDEA → INTERFACE</span>
      <div className="orbit orbit-one" /><div className="orbit orbit-two" />
      <div className="floating-label label-react"><span className="react-mark">⚛</span> React & Next.js</div>
      <div className="code-window">
        <div className="window-chrome"><span /><span /><span /><span className="window-file">a-little-about-me.jsx</span><Code2 size={14} /></div>
        <div className="code-body"><div><i>01</i><span className="code-purple">const</span> developer = {'{'}</div><div><i>02</i>  name: <span className="code-string">'Rohit Hiremath'</span>,</div><div><i>03</i>  craft: <span className="code-string">'Thoughtful interfaces'</span>,</div><div><i>04</i>  stack: [<span className="code-string">'React'</span>, <span className="code-string">'Next.js'</span>],</div><div><i>05</i>  exploring: <span className="code-string">'AI & RAG'</span>,</div><div><i>06</i>  mindset: <span className="code-string">'Always learning'</span></div><div><i>07</i>{'}'};</div><div className="code-comment"><i>08</i>// small details. better experiences.</div></div>
        <div className="window-footer"><span><span className="status-dot" /> Built with curiosity</span><span>JavaScript</span></div>
      </div>
      <div className="floating-label label-ai"><Sparkles size={17} /><div>Currently exploring<strong>AI-powered knowledge</strong></div></div>
      <span className="art-spark spark-one">✳</span><span className="art-spark spark-two">+</span><span className="art-corner corner-bottom">CRAFTED WITH INTENTION / 01</span>
    </div>
    <div className="hero-bottom"><span>FRONTEND CRAFT. FULL-STACK THINKING.</span><a href="#about">A little more about me <ArrowDown size={15} /></a></div>
  </section>;
}
