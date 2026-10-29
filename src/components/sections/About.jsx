import { MapPin } from 'lucide-react';
import { personalInfo, stats } from '../../data/resumeData';
import SectionHeading from '../ui/SectionHeading';

export default function About() {
  return <section className="section section-tinted" id="about"><div className="container">
    <SectionHeading number="01" label="THE PERSON BEHIND THE CODE" title={<>A builder at heart.<br /><span className="serif accent">Curious by default.</span></>} />
    <div className="about-grid"><div className="about-copy"><p>{personalInfo.bio}</p><p>{personalInfo.currentFocus}</p><span className="location"><MapPin size={15} /> Based in {personalInfo.location}</span></div><div className="about-stats">{stats.map(stat => <div className="stat" key={stat.label}><strong>{stat.value}<span>{stat.suffix}</span></strong><span>{stat.label}</span></div>)}<p className="data-note">Experience and user figures from my resume.</p></div></div>
  </div></section>;
}
