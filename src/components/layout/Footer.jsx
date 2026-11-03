import { ArrowRight } from 'lucide-react';
import { personalInfo } from '../../data/resumeData';
import { siteCopy } from '../../data/siteCopy';

export default function Footer() {
  return <footer className="footer"><div className="container footer-inner"><a href="#home" className="wordmark" aria-label="rh. — Back to top">rh<span>.</span></a><p>© {__BUILD_YEAR__} {personalInfo.name}. {siteCopy.footer}</p><a href="#home">Back to top <ArrowRight size={17} className="arrow-up" /></a></div></footer>;
}
