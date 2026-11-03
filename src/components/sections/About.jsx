import { MapPin } from 'lucide-react';
import { personalInfo } from '../../data/resumeData';
import { siteCopy } from '../../data/siteCopy';
import SectionHeading from '../ui/SectionHeading';

export default function About() {
  return <section className="section section-tinted" id="about" aria-labelledby="about-title"><div className="container about-layout">
    <SectionHeading id="about-title" number="03" label={siteCopy.about.label} title={siteCopy.about.title} />
    <div className="about-copy"><p>{personalInfo.bio}</p><p>{personalInfo.currentFocus}</p><span className="location"><MapPin size={17} /> Based in {personalInfo.location}</span></div>
  </div></section>;
}
