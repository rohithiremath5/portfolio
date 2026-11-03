import { stats } from '../../data/resumeData';
import { siteCopy } from '../../data/siteCopy';

export default function CredibilityStrip() {
  return <div className="credibility-strip"><div className="container credibility-inner">
    <dl className="credibility-stats">{stats.map(stat => <div className="stat" key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}<span>{stat.suffix}</span></dd></div>)}</dl>
    <p className="data-note">{siteCopy.figuresDisclaimer}</p>
  </div></div>;
}
