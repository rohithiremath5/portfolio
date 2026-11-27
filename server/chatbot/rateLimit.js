import { createHash, randomBytes } from 'node:crypto';
import { ChatError } from './validation.js';

// Best effort only: separate serverless instances/regions do not share this map.
export function createRateLimiter({ now = Date.now, maxPerMinute = 10, maxGlobal = 30, cooldown = 2000 } = {}) {
  const entries = new Map();
  const salt = randomBytes(16).toString('hex');
  let windowStart = 0, globalCount = 0;
  return req => {
    const time = now();
    if (time - windowStart >= 60000) { windowStart = time; globalCount = 0; }
    for (const [key, entry] of entries) if (time - entry.start >= 60000 && !entry.busy) entries.delete(key);
    const ip = req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
    const key = createHash('sha256').update(salt + ip).digest('hex');
    const entry = entries.get(key) || { start: time, count: 0, last: -Infinity, busy: false };
    if (entry.busy || entry.count >= maxPerMinute || globalCount >= maxGlobal || time - entry.last < cooldown || entries.size >= 1000 && !entries.has(key)) {
      throw new ChatError(429, 'RATE_LIMITED', 'The AI assistant has reached its temporary usage limit. Please try again later or explore the portfolio directly.');
    }
    entry.count++; entry.last = time; entry.busy = true; globalCount++;
    entries.set(key, entry);
    return () => { entry.busy = false; };
  };
}
export const acquireRequest = createRateLimiter();
