import { UNAVAILABLE, MAX_REPLY_LENGTH } from '../../shared/chatPolicy.js';

export async function askPortfolio(message, history, signal) {
  let response;
  try {
    response = await fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }), signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error(UNAVAILABLE);
  }
  let data;
  try { data = await response.json(); } catch { throw new Error(UNAVAILABLE); }
  // Only display known errors, never arbitrary proxy/provider response text.
  if (!response.ok || data.success !== true) {
    const errors = {
      RATE_LIMITED: 'The AI assistant has reached its temporary usage limit. Please try again later or explore the portfolio directly.',
      TIMEOUT: 'The response is taking longer than expected. Please try again.',
      INVALID_REQUEST: 'Please send a question of 1–500 characters.',
      REQUEST_TOO_LARGE: 'The conversation is too long. Please clear it and try again.',
    };
    throw new Error(errors[data.code] || UNAVAILABLE);
  }
  if (typeof data.reply !== 'string' || !data.reply.trim() || data.reply.length > MAX_REPLY_LENGTH) throw new Error(UNAVAILABLE);
  return data.reply.trim();
}
