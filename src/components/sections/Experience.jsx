import { experiences } from '../../data/resumeData';
import SectionHeading from '../ui/SectionHeading';

export default function Experience() {
  return <section className="section section-tinted" id="experience"><div className="container">
    <SectionHeading number="03" label="THE JOURNEY SO FAR" title={<>Learning. Building.<br /><span className="serif accent">Moving forward.</span></>} text="From browser extensions to production interfaces, and now AI-powered knowledge systems." />
    <div className="experience-list">{experiences.map((experience, index) => <article className="experience-row" key={experience.id}><div className="experience-date"><span className={`timeline-dot ${index === 0 ? 'is-current' : ''}`} /><span>{experience.duration}</span><span className="employment-type">{experience.type}</span></div><div className="experience-content"><div className="experience-title"><h3>{experience.role}</h3>{index === 0 && <span className="current-pill">NOW</span>}</div><p className="company">{experience.company}{experience.companyDetail && <span> / {experience.companyDetail}</span>}</p><ul>{experience.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul></div></article>)}</div>
  </div></section>;
}
