import { experiences } from '../../data/resumeData';
import SectionHeading from '../ui/SectionHeading';
import { siteCopy } from '../../data/siteCopy';

export default function Experience() {
  return <section className="section experience-section" id="experience" aria-labelledby="experience-title"><div className="container">
    <SectionHeading id="experience-title" number="02" label={siteCopy.experience.label} title={siteCopy.experience.title} text={siteCopy.experience.introduction} />
    <div className="experience-list">{experiences.map((experience, index) => <article className="experience-row" key={experience.id}><div className="experience-date"><span className={`timeline-dot ${index === 0 ? 'is-current' : ''}`} /><span>{experience.duration}</span><span className="employment-type">{experience.type}</span></div><div className="experience-content"><div className="experience-title"><h3>{experience.role}</h3>{index === 0 && <span className="current-pill">NOW</span>}</div><p className="company">{experience.company}{experience.companyDetail && <span> / {experience.companyDetail}</span>}</p><ul>{experience.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul></div></article>)}</div>
  </div></section>;
}
