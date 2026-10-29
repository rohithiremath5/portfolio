import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { personalInfo } from '../../data/resumeData';

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
  return <section className="contact-section" id="contact"><div className="container contact-inner"><p className="eyebrow"><span>05</span> GOOD WORK STARTS WITH A CONVERSATION</p><h2>Have something in mind?<br /><span className="serif">Let’s make it happen.</span></h2><p>A new product, a tricky frontend challenge, or just a hello.<br />I’d love to hear from you.</p><a className="contact-email" href={`mailto:${personalInfo.email}`}>{personalInfo.email}<ArrowUpRight size={27} /></a><div className="contact-actions"><button className="copy-button" onClick={copyEmail}>{copied ? <><Check size={14} /> Email copied</> : 'Copy email address'}</button><span className="copy-status" role="status">{copied ? 'Copied to clipboard.' : copyError ? 'Please select and copy the email address above.' : ''}</span></div><div className="contact-links"><a href={personalInfo.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15} /></a><a href={personalInfo.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a><a href={`tel:${personalInfo.phone.replaceAll(' ', '')}`}>{personalInfo.phone}<ArrowUpRight size={15} /></a></div></div><span className="contact-decoration" aria-hidden="true">✳</span></section>;
}
