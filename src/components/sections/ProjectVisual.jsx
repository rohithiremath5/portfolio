import { Braces, Database, Layers3, Sparkles } from 'lucide-react';

export default function ProjectVisual({ type }) {
  return <div className={`project-visual visual-${type}`} aria-hidden="true">
    <div className="visual-grid" />
    {type === 'analytics' ? <div className="analytics-study">
      <div className="study-sidebar"><span>◈</span><i /><i /><i /><i /></div>
      <div className="study-main"><div className="study-toolbar"><span>Overview</span><span>GA4 / SEARCH CONSOLE</span></div>
        <div className="study-metrics">{['Performance', 'Engagement', 'Reach'].map(label => <div key={label}><span>{label}</span><i /><i /></div>)}</div>
        <div className="study-chart"><span>Performance overview</span><svg viewBox="0 0 400 100" preserveAspectRatio="none"><path d="M0 85H400M0 50H400M0 15H400" stroke="var(--border)" /><path d="M0 82C30 82 36 43 65 52S110 77 140 40S180 64 218 31S260 50 300 20S355 30 400 6" fill="none" stroke="var(--accent)" strokeWidth="3" /><path d="M0 94C40 80 60 90 100 72S155 89 200 60S250 70 290 49S350 56 400 30" fill="none" stroke="var(--muted)" strokeWidth="2" strokeDasharray="4 5" /></svg></div>
      </div>
    </div> : type === 'mobile' ? <div className="mobile-study">
      <div className="component-tile tile-one"><Layers3 size={26} /><span>Reusable UI</span><i /><i /></div>
      <div className="study-phone"><span className="phone-speaker" /><span className="phone-label">React Native</span><div className="phone-module"><Layers3 size={30} /><span>Components</span></div><div className="phone-wire"><i /><i /><i /></div><div className="phone-nav"><span /><span /><span /></div></div>
      <div className="component-tile tile-two"><Sparkles size={24} /><span>GPT-4</span></div>
    </div> : type === 'creative' ? <div className="creative-study">
      <div className="creative-source"><Sparkles size={20} /><span>Creative content</span><div className="creative-lines"><i /><i /><i /></div><span className="creative-tech">OpenAI API</span></div>
      <span className="creative-connector">→</span><div className="creative-canvas"><span>GENERATIVE AI</span><div className="creative-shape"><i /><i /><i /></div><span>Interface study</span></div>
    </div> : <div className="pipeline-study"><span className="pipeline-topline">DATA FLOW / SYSTEM STUDY</span><div className="pipeline-nodes">{[[Braces, 'Collect'], [Layers3, 'Process'], [Database, 'Deliver']].map(([Icon, label], index) => <div className="pipeline-step" key={label}><div className="pipeline-node"><Icon size={26} /><span>{label}</span></div>{index < 2 && <span className="pipeline-arrow">→</span>}</div>)}</div><div className="pipeline-tracks"><span /><span /><span /></div></div>}
    <span className="visual-caption">{type === 'pipeline' ? 'SYSTEM' : 'INTERFACE'} STUDY / {type === 'creative' ? 'GENERATIVE AI' : type.toUpperCase()}</span>
  </div>;
}
