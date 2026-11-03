import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { personalInfo } from '../../data/resumeData';
import { siteCopy } from '../../data/siteCopy';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true); setCopyError(false);
      clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(false), 2500);
    } catch { setCopyError(true); }
  };
  return <section className="contact-section" id="contact" aria-labelledby="contact-title"><div className="container contact-inner">
    <p className="eyebrow"><span>06</span> {siteCopy.contact.label}</p>
    <div className="contact-layout"><h2 id="contact-title">{siteCopy.contact.title}</h2><p>{siteCopy.contact.description}</p></div>
    <a className="contact-email" href={`mailto:${personalInfo.email}`}><span>{personalInfo.email}</span><ArrowUpRight size={40} /></a>
    <div className="contact-actions"><button className="copy-button" onClick={copyEmail}>{copied ? <><Check size={16} /> Email copied</> : 'Copy email address'}</button><span className="copy-status" role="status">{copied ? 'Copied to clipboard.' : copyError ? 'Please select and copy the email address above.' : ''}</span></div>
    <div className="contact-links"><a href={personalInfo.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={17} /></a><a href={personalInfo.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={17} /></a><a href={`tel:${personalInfo.phone.replaceAll(' ', '')}`}>{personalInfo.phone}<ArrowUpRight size={17} /></a></div>
  </div></section>;
}
