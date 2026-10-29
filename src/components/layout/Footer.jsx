import { ArrowRight } from 'lucide-react';
import { personalInfo } from '../../data/resumeData';

export default function Footer() {
  return <footer className="container footer"><a href="#home" className="wordmark" aria-label="Back to top">rh<span>.</span></a><p>© {new Date().getFullYear()} {personalInfo.name}. Built with care.</p><a href="#home">Back to top <ArrowRight size={15} className="arrow-up" /></a></footer>;
}
