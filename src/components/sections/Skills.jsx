import { Code2, Database, Layers3, Sparkles } from 'lucide-react';
import { skills, education } from '../../data/resumeData';
import SectionHeading from '../ui/SectionHeading';

const skillGroups = [{ key: 'frontend', label: 'Frontend & interface', icon: Code2 }, { key: 'languages', label: 'Languages', icon: Code2 }, { key: 'backend', label: 'Backend & APIs', icon: Database }, { key: 'ai', label: 'AI & knowledge systems', icon: Sparkles }, { key: 'tools', label: 'Cloud & everyday tools', icon: Layers3 }];
export default function Skills() {
  return <section className="section" id="skills"><div className="container">
    <SectionHeading number="04" label="MY TOOLKIT" title={<>The right tools.<br /><span className="serif accent">A thoughtful approach.</span></>} text="A frontend foundation, full-stack experience, and an expanding AI toolkit." />
    <div className="skill-list">{skillGroups.map(({ key, label, icon: Icon }) => <div className="skill-row" key={key}><h3><Icon size={19} />{label}</h3><div className="tags skill-tags">{skills[key].map(skill => <span key={skill}>{skill}</span>)}</div></div>)}</div>
    <div className="education" id="education"><p className="eyebrow"><span>+</span> THE FOUNDATION</p><div className="education-grid">{education.map(item => <article key={item.degree}><span className="education-icon"><Layers3 size={20} /></span><div><h3>{item.degree}</h3><p>{item.institution}</p></div><span className="education-score">{item.score}</span></article>)}</div></div>
  </div></section>;
}
