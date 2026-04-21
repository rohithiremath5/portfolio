import { personalInfo } from '../../data/resumeData';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const initials = personalInfo.name
    .split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'YN';

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__left">
          <span className="footer__logo font-display">
            <span style={{ color: 'var(--text-muted)' }}>[</span>
            {initials}
            <span style={{ color: 'var(--text-muted)' }}>]</span>
          </span>
          <p className="footer__copy font-mono">
            © {year} {personalInfo.name || 'Your Name'} — Built with React + Vite
          </p>
        </div>



        <button className="footer__scroll-top font-mono" onClick={scrollTop}>
          ↑ Back to top
        </button>
      </div>
    </footer>
  );
}
