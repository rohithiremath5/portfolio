import { stats } from '../../data/resumeData';
import { siteCopy } from '../../data/siteCopy';
import { BriefcaseBusiness, Layers3, Users } from 'lucide-react';

const statIcons = [BriefcaseBusiness, Users, Layers3];

export default function CredibilityStrip() {
  return <div className="credibility-strip"><div className="container credibility-inner">
    <dl className="credibility-stats">{stats.map((stat, index) => {
      const Icon = statIcons[index];
      return <div className="stat" key={stat.label}><dt><Icon size={18} aria-hidden="true" />{stat.label}</dt><dd>{stat.value}<span>{stat.suffix}</span></dd></div>;
    })}</dl>
    <p className="data-note">{siteCopy.figuresDisclaimer}</p>
  </div></div>;
}
