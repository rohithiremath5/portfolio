import { skills } from '../../data/resumeData';
import { siteCopy, skillGroups } from '../../data/siteCopy';
import SectionHeading from '../ui/SectionHeading';
import SkillIcon from './SkillIcon';
import './Skills.css';

export default function Skills() {
  return <section className="section" id="skills" aria-labelledby="skills-title"><div className="container">
    <SectionHeading id="skills-title" number="04" label={siteCopy.skills.label} title={siteCopy.skills.title} text={siteCopy.skills.introduction} />
    <div className="skills-catalog">
      {skillGroups.map(({ key, label }, index) => <div className="skills-category" key={key}>
        <div className="skills-category__heading">
          <span className="skill-number" aria-hidden="true">0{index + 1}</span>
          <h3 id={`skills-${key}`}>{label}</h3>
        </div>
        <ul className="skills-card-grid" aria-labelledby={`skills-${key}`}>
          {skills[key].map(skill => <li className={`skill-card${skill.length > 18 ? ' skill-card--wide' : ''}`} key={skill}>
            <SkillIcon name={skill} />
            <span className="skill-card__name">{skill}</span>
          </li>)}
        </ul>
      </div>)}
    </div>
  </div></section>;
}
