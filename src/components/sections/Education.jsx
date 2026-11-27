import { GraduationCap } from 'lucide-react';
import { education } from '../../data/resumeData';
import { siteCopy } from '../../data/siteCopy';

export default function Education() {
  return <section className="education-section" id="education" aria-labelledby="education-title"><div className="container education-layout">
    <div><p className="eyebrow"><span>05</span> {siteCopy.education.label}</p><h2 id="education-title">Education</h2></div>
    <div className="education-list">{education.map(item => <article key={item.degree}><GraduationCap size={20} aria-hidden="true" /><div><h3>{item.degree}</h3><p>{item.institution}</p></div><span className="education-score">{item.score}</span></article>)}</div>
  </div></section>;
}
