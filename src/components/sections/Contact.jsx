import { useState, useReducer } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';
import { personalInfo } from '../../data/resumeData';
import { AnimatedSection, SectionLabel, SectionTitle, GlowCard } from '../ui';
import './Contact.css';

// useReducer for form state — demonstrates advanced state management
const formInitial = { name: '', email: '', subject: '', message: '', status: 'idle' };

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_STATUS':
      return { ...state, status: action.status };
    case 'RESET':
      return formInitial;
    default:
      return state;
  }
}

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: 'Email',
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
    color: '#00ff87',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: personalInfo.phone,
    href: `tel:${personalInfo.phone}`,
    color: '#60a5fa',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/profile',
    href: personalInfo.linkedin,
    color: '#0077b5',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/username',
    href: personalInfo.github,
    color: '#e0e0e0',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: personalInfo.location,
    href: null,
    color: '#f59e0b',
  },
];

export default function Contact() {
  const [form, dispatch] = useReducer(formReducer, formInitial);

  const setField = (field, value) =>
    dispatch({ type: 'SET_FIELD', field, value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_STATUS', status: 'sending' });
    // Simulate API call (replace with EmailJS / Formspree / your API)
    setTimeout(() => {
      dispatch({ type: 'SET_STATUS', status: 'success' });
      setTimeout(() => dispatch({ type: 'RESET' }), 3000);
    }, 1500);
  };

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <AnimatedSection>
          <SectionLabel number="07." label="CONTACT" />
          <SectionTitle accent="Touch.">Get In</SectionTitle>
          <p className="contact__intro">
            I'm currently open to new opportunities. Whether you have a project in mind,
            want to collaborate, or just say hi — my inbox is always open.
          </p>
        </AnimatedSection>

        <div className="contact__grid">
          {/* Contact links */}
          <AnimatedSection delay={0.1} className="contact__links">
            {CONTACT_LINKS.map(({ icon: Icon, label, value, href, color }) => (
              <GlowCard key={label} className="contact-link-card" glowColor={color}>
                <div className="contact-link-inner">
                  <div className="contact-link-icon" style={{ color, background: `${color}15`, borderColor: `${color}30` }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="contact-link-label font-mono">{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
                         rel="noopener noreferrer" className="contact-link-value" style={{ color }}>
                        {value}
                      </a>
                    ) : (
                      <p className="contact-link-value" style={{ color }}>{value}</p>
                    )}
                  </div>
                </div>
              </GlowCard>
            ))}
          </AnimatedSection>

          {/* Contact form */}
          <AnimatedSection delay={0.2}>
            <GlowCard className="contact-form-card">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <FormField
                    label="Name"
                    type="text"
                    value={form.name}
                    onChange={(v) => setField('name', v)}
                    placeholder="Your full name"
                    required
                  />
                  <FormField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setField('email', v)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <FormField
                  label="Subject"
                  type="text"
                  value={form.subject}
                  onChange={(v) => setField('subject', v)}
                  placeholder="What's this about?"
                />
                <FormField
                  label="Message"
                  type="textarea"
                  value={form.message}
                  onChange={(v) => setField('message', v)}
                  placeholder="Tell me about your project or opportunity..."
                  required
                />

                <button
                  type="submit"
                  className="form-submit font-mono"
                  disabled={form.status === 'sending' || form.status === 'success'}
                >
                  {form.status === 'idle' && <><Send size={14} /> Send Message</>}
                  {form.status === 'sending' && '⏳ Sending...'}
                  {form.status === 'success' && '✅ Message Sent!'}
                </button>
              </form>
            </GlowCard>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/**
 * FormField — controlled input/textarea component
 * Concept: controlled components, single responsibility
 */
function FormField({ label, type, value, onChange, placeholder, required }) {
  return (
    <div className="form-field">
      <label className="form-label font-mono">{label}{required && ' *'}</label>
      {type === 'textarea' ? (
        <textarea
          className="form-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={5}
        />
      ) : (
        <input
          className="form-input"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
}
