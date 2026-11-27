import { useEffect, useRef, useState } from 'react';
import { Bot, Check, Copy, Send, Square, Trash2, X } from 'lucide-react';
import usePortfolioChat from '../../hooks/usePortfolioChat';
import { MAX_MESSAGE_LENGTH } from '../../../shared/chatPolicy.js';
import './chatbot.css';

function Message({ message }) {
  const [notice, setNotice] = useState('');
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try { await navigator.clipboard.writeText(message.content); setNotice('Response copied.'); }
    catch { setNotice('Please select and copy the response text.'); }
    clearTimeout(timer.current); timer.current = setTimeout(() => setNotice(''), 2500);
  };
  // React escapes every text node. No HTML or link parser is used.
  return <article className={`chat-message chat-message--${message.role}`} aria-label={message.role === 'user' ? 'Your message' : 'Assistant response'}>
    <div className="chat-message__text">{message.content.split(/\n\s*\n/).map((paragraph, index) => {
      const lines = paragraph.split('\n');
      return lines.every(line => /^[-•] /.test(line))
        ? <ul key={index}>{lines.map((line, i) => <li key={i}>{line.slice(2)}</li>)}</ul>
        : <p key={index}>{paragraph}</p>;
    })}</div>
    {message.role === 'assistant' && <div className="chat-copy-row"><button className="chat-small-button" onClick={copy} aria-label="Copy assistant response">
      {notice === 'Response copied.' ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
    </button><span role="status">{notice}</span></div>}
  </article>;
}

export default function ChatWindow({ open, onClose }) {
  const chat = usePortfolioChat();
  const panel = useRef(null);
  const input = useRef(null);
  const transcript = useRef(null);
  const stickToBottom = useRef(true);
  const [viewport, setViewport] = useState({});
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (!open) { chat.cancel(); return; }
    input.current?.focus({ preventScroll: true });
    const escape = event => { if (event.key === 'Escape') { event.preventDefault(); onClose(); } };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [open, onClose, chat.cancel]);
  useEffect(() => {
    const visual = window.visualViewport;
    const resize = () => {
      const height = visual?.height || window.innerHeight;
      const small = height < 480;
      setCompact(small);
      setViewport({
        '--chat-viewport-height': `${height}px`,
        '--chat-keyboard-offset': `${Math.max(0, window.innerHeight - height - (visual?.offsetTop || 0))}px`,
        '--chat-reserved-space': small ? '24px' : undefined,
        '--chat-bottom-gap': small ? '12px' : undefined,
      });
    };
    resize(); visual?.addEventListener('resize', resize); visual?.addEventListener('scroll', resize);
    window.addEventListener('resize', resize);
    return () => { visual?.removeEventListener('resize', resize); visual?.removeEventListener('scroll', resize); window.removeEventListener('resize', resize); };
  }, []);
  useEffect(() => {
    if (open && stickToBottom.current && transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight;
  }, [chat.messages, chat.loading, chat.error, open]);

  return <div ref={panel} id="portfolio-chat-panel" className="chat-panel" role="dialog" aria-labelledby="chat-title"
    aria-describedby="chat-subtitle" hidden={!open} style={viewport} data-compact={compact || undefined}>
    <header className="chat-header"><Bot size={22} aria-hidden="true" /><div><h2 id="chat-title">AI Portfolio Assistant</h2><p id="chat-subtitle">Ask about my experience, skills and projects</p></div>
      <div className="chat-header__actions"><button className="chat-small-button" aria-label="Clear conversation" onClick={() => { chat.clear(); stickToBottom.current = true; input.current?.focus(); }}><Trash2 size={17} aria-hidden="true" /></button>
        <button className="chat-small-button" aria-label="Close assistant window" onClick={onClose}><X size={19} aria-hidden="true" /></button></div>
    </header>
    <div ref={transcript} className="chat-transcript" role="log" aria-label="Portfolio conversation" aria-live="polite" aria-relevant="additions"
      onScroll={event => { const el = event.currentTarget; stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80; }}>
      <div className="chat-welcome"><p>Hi! I'm the AI assistant for this portfolio. You can ask me about professional experience, technical skills, projects and more.</p>
        <p className="chat-notice">AI-generated answers are based on the available portfolio information.</p>
        <p className="chat-notice">Messages may be processed by Google Gemini. Please don’t submit sensitive information.</p>
        {chat.messages.length === 0 && <div className="chat-suggestions">{chat.suggestions.map(question => <button key={question} disabled={chat.loading || chat.cooling || !chat.ready}
          onClick={() => { stickToBottom.current = true; void chat.send(question); }}>{question}</button>)}</div>}
      </div>
      {chat.messages.map((message, index) => <Message key={`${index}-${message.role}`} message={message} />)}
      {chat.loading && <p className="chat-progress" role="status"><span aria-hidden="true">•••</span> Preparing a response…</p>}
      {chat.error && <div className="chat-error"><p role="alert">{chat.error}</p><button onClick={() => void chat.retry()} disabled={chat.loading || chat.cooling}>Retry question</button>
        <a href="#experience" onClick={onClose}>Explore experience</a><a href="#skills" onClick={onClose}>View skills</a><a href="#projects" onClick={onClose}>View projects</a></div>}
    </div>
    <form className="chat-composer" onSubmit={event => { event.preventDefault(); stickToBottom.current = true; void chat.send(chat.input); }}>
      <label htmlFor="portfolio-chat-input" className="chat-sr-only">Your question about this portfolio</label>
      <div className="chat-input-row"><textarea ref={input} id="portfolio-chat-input" value={chat.input} maxLength={MAX_MESSAGE_LENGTH} rows={2}
        placeholder="Ask about my experience..." aria-describedby="chat-character-count" onChange={event => chat.setInput(event.target.value)}
        onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); stickToBottom.current = true; void chat.send(chat.input); } }} />
        {chat.loading ? <button type="button" className="chat-send" aria-label="Stop response" onClick={chat.cancel}><Square size={17} aria-hidden="true" /></button>
          : <button type="submit" className="chat-send" aria-label="Send question" disabled={!chat.input.trim() || chat.cooling || !chat.ready}><Send size={18} aria-hidden="true" /></button>}
      </div>
      <span id="chat-character-count" className="chat-character-count">{chat.input.length}/{MAX_MESSAGE_LENGTH}{chat.cooling && !chat.loading ? ' · Please wait a moment' : ''}</span>
    </form>
  </div>;
}
