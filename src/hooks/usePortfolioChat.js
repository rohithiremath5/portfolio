import { useCallback, useEffect, useRef, useState } from 'react';
import * as resume from '../data/resumeData';
import { askPortfolio } from '../services/chatApi.js';
import { COOLDOWN_MS, MAX_HISTORY_MESSAGES, MAX_MESSAGE_LENGTH, MAX_STORED_MESSAGES, quickAnswer, safeStoredMessages, suggestedQuestions } from '../../shared/chatPolicy.js';

const STORAGE_KEY = 'portfolio-chat-v1';

export default function usePortfolioChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooling, setCooling] = useState(false);
  const [ready, setReady] = useState(false);
  const historyRef = useRef([]);
  const active = useRef(null);
  const failed = useRef(null);
  const cooldown = useRef(0);
  const cooldownTimer = useRef(null);
  const generation = useRef(0);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    let restored = [];
    try { restored = safeStoredMessages(JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]')); } catch { /* Storage may be unavailable or corrupt. */ }
    historyRef.current = restored; setMessages(restored); setReady(true);
    return () => { mounted.current = false; generation.current++; active.current?.abort(); clearTimeout(cooldownTimer.current); };
  }, []);
  useEffect(() => {
    if (ready) try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch { /* In-memory conversation still works. */ }
  }, [messages, ready]);

  const update = useCallback(items => {
    const bounded = items.slice(-MAX_STORED_MESSAGES);
    historyRef.current = bounded; setMessages(bounded);
  }, []);

  const send = useCallback(async (value, isRetry = false) => {
    if (active.current || Date.now() < cooldown.current || !ready) return;
    const message = value.trim();
    if (!message || message.length > MAX_MESSAGE_LENGTH) return;
    const history = isRetry && failed.current ? failed.current.history : historyRef.current.slice(-MAX_HISTORY_MESSAGES);
    if (!isRetry) update([...historyRef.current, { role: 'user', content: message }]);
    setInput(''); setError(''); failed.current = { message, history };
    cooldown.current = Date.now() + COOLDOWN_MS; setCooling(true);
    clearTimeout(cooldownTimer.current);
    cooldownTimer.current = setTimeout(() => { if (mounted.current) setCooling(false); }, COOLDOWN_MS);
    const direct = quickAnswer(message, resume);
    if (direct) { update([...historyRef.current, { role: 'assistant', content: direct }]); failed.current = null; return; }
    const controller = new AbortController();
    active.current = controller; setLoading(true);
    const id = ++generation.current;
    const timer = setTimeout(() => controller.abort('timeout'), 28000);
    try {
      const reply = await askPortfolio(message, history, controller.signal);
      if (!mounted.current || id !== generation.current) return;
      update([...historyRef.current, { role: 'assistant', content: reply }]); failed.current = null;
    } catch (failure) {
      if (mounted.current && id === generation.current) setError(controller.signal.aborted
        ? controller.signal.reason === 'timeout' ? 'The response is taking longer than expected. Please try again.' : 'Response stopped. You can retry your question.'
        : failure.message);
    } finally {
      clearTimeout(timer);
      if (mounted.current && id === generation.current) { active.current = null; setLoading(false); }
    }
  }, [ready, update]);

  const cancel = useCallback(() => active.current?.abort(), []);
  const clear = useCallback(() => {
    generation.current++; active.current?.abort(); active.current = null; failed.current = null;
    clearTimeout(cooldownTimer.current); cooldown.current = 0;
    update([]); setInput(''); setError(''); setLoading(false); setCooling(false);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* State still clears. */ }
  }, [update]);

  return { messages, input, setInput, loading, error, cooling, ready, send, cancel, clear,
    retry: () => failed.current && send(failed.current.message, true), suggestions: suggestedQuestions(resume) };
}
