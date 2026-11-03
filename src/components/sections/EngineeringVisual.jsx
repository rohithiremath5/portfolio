import { Braces, Database, Layers3, Sparkles } from 'lucide-react';

// A decorative composition, not a production architecture diagram.
export default function EngineeringVisual() {
  return <div className="engineering-visual" aria-hidden="true">
    <div className="engineering-label"><span>INTERFACE / SYSTEM</span><span>01—04</span></div>
    <div className="engineering-grid">
      <svg className="system-connections" viewBox="0 0 400 400" fill="none">
        <path d="M100 100H300V300H100V100ZM100 100L300 300M300 100L100 300" />
        <circle cx="200" cy="200" r="120" /><circle cx="200" cy="200" r="66" />
      </svg>
      <div className="system-core"><span className="core-mark">rh<span>.</span></span><span>ENGINEERING</span></div>
      <div className="system-node node-frontend"><Braces size={23} /><span>Frontend</span><small>01</small></div>
      <div className="system-node node-api"><Layers3 size={23} /><span>API</span><small>02</small></div>
      <div className="system-node node-data"><Database size={23} /><span>Data</span><small>03</small></div>
      <div className="system-node node-ai"><Sparkles size={23} /><span>AI</span><small>04</small></div>
      <span className="grid-cross cross-one">+</span><span className="grid-cross cross-two">+</span>
    </div>
    <div className="engineering-foot"><span>FRONTEND → API → DATA → AI</span><span>↗</span></div>
  </div>;
}
