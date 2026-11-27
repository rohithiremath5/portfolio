import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import './launcher.css';

const ChatWindow = lazy(() => import('./ChatWindow'));

class ChatBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function PortfolioChatbot() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const launcher = useRef(null);
  useEffect(() => setReady(true), []);
  useEffect(() => { if (loaded && !open) launcher.current?.focus({ preventScroll: true }); }, [loaded, open]);
  function close() { setOpen(false); launcher.current?.focus({ preventScroll: true }); }
  if (!ready) return null; // No extra text, API work or hydration mismatch in static HTML.
  return <div className="portfolio-chat">
    {loaded && <ChatBoundary fallback={open ? <div className="chat-loading" role="alert">The assistant couldn’t load. Please refresh to try again.</div> : null}>
      <Suspense fallback={open ? <div className="chat-loading" role="status">Loading assistant…</div> : null}>
        <ChatWindow open={open} onClose={close} />
      </Suspense>
    </ChatBoundary>}
    <button ref={launcher} className="chat-launcher" aria-label={open ? 'Close portfolio assistant' : 'Open portfolio assistant'}
      aria-expanded={open} aria-haspopup="dialog" aria-controls={loaded ? 'portfolio-chat-panel' : undefined}
      onClick={() => { if (open) close(); else { setLoaded(true); setOpen(true); } }}>
      {open ? <X size={22} aria-hidden="true" /> : <MessageSquare size={22} aria-hidden="true" />}
    </button>
  </div>;
}
