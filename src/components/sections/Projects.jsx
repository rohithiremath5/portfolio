import { Check, ChevronDown, Moon, Users } from 'lucide-react';
import { projects, extensions } from '../../data/resumeData';
import { siteCopy } from '../../data/siteCopy';
import SectionHeading from '../ui/SectionHeading';
import ProjectVisual from './ProjectVisual';

function ProjectCard({ project, index }) {
  return <article className="project-card"><ProjectVisual type={project.visual} /><div className="project-body">
    <div className="project-meta"><span>{project.category}</span><span>0{index + 1} / 04</span></div>
    <h3>{project.title}</h3><p>{project.description}</p>
    <ul className="tags">{project.stack.map(tag => <li key={tag}>{tag}</li>)}</ul>
    <details className="project-details" open><summary>What I worked on <ChevronDown size={16} /></summary><ul>{project.highlights.map(highlight => <li key={highlight}><Check size={15} aria-hidden="true" /><span>{highlight}</span></li>)}</ul></details>
  </div></article>;
}

export default function Projects() {
  return <section className="section" id="projects" aria-labelledby="projects-title"><div className="container">
    <SectionHeading id="projects-title" number="01" label={siteCopy.work.label} title={siteCopy.work.title} text={siteCopy.work.introduction} />
    <div className="projects-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
    <p className="project-note">{siteCopy.work.disclaimer}</p>
    <div className="extensions" id="extensions"><div className="extensions-heading"><div><p className="eyebrow">ALSO SHIPPED</p><h3>{siteCopy.extensions.title}</h3></div><span className="extension-heading-mark" aria-hidden="true">↗</span></div>
      <div className="extensions-grid">{extensions.map(extension => <article className="extension-card" key={extension.title}><div className="extension-top"><span className="extension-icon" aria-hidden="true">{extension.icon === 'moon' ? <Moon size={23} /> : <Users size={23} />}</span><div className="extension-metric"><strong>{extension.metric}</strong><span>{extension.label}</span></div></div><h4>{extension.title}</h4><p>{extension.description}</p></article>)}</div>
      <p className="data-note">{siteCopy.extensions.disclaimer}</p>
    </div>
  </div></section>;
}
