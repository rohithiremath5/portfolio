import { readChatRequest, validateOrigin, ChatError } from '../server/chatbot/validation.js';
import { getResumeContext } from '../server/chatbot/resumeContext.js';
import { acquireRequest } from '../server/chatbot/rateLimit.js';
import { generateReply, REQUEST_TIMEOUT_MS } from '../server/chatbot/gemini.js';
import { quickAnswer, UNAVAILABLE } from '../shared/chatPolicy.js';

export function createChatHandler({ getContext = getResumeContext, generate = generateReply, acquire = acquireRequest, timeoutMs = REQUEST_TIMEOUT_MS } = {}) {
  return async function chat(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    let release, timer;
    const abort = new AbortController();
    const onClose = () => { if (!res.writableEnded) abort.abort(); };
    res.on?.('close', onClose);
    try {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        throw new ChatError(405, 'METHOD_NOT_ALLOWED', 'Use POST to ask the assistant a question.');
      }
      validateOrigin(req);
      const { message, history } = await readChatRequest(req);
      release = acquire(req);
      const context = getContext();
      let reply = quickAnswer(message, context);
      if (!reply) {
        const timeout = new Promise((_, reject) => {
          timer = setTimeout(() => { reject(new ChatError(504, 'TIMEOUT', 'The response is taking longer than expected. Please try again.')); abort.abort(); }, timeoutMs);
        });
        reply = await Promise.race([generate({ message, history, context, signal: abort.signal }), timeout]);
      }
      if (typeof reply !== 'string' || !reply.trim() || reply.length > 4000) throw new ChatError(503, 'RESPONSE_UNAVAILABLE', UNAVAILABLE);
      if (!res.destroyed) { res.statusCode = 200; res.end(JSON.stringify({ success: true, reply })); }
    } catch (error) {
      const providerStatus = Number(error?.status ?? error?.code);
      const safe = error instanceof ChatError ? error
        : providerStatus === 429 ? new ChatError(429, 'RATE_LIMITED', 'The AI assistant has reached its temporary usage limit. Please try again later or explore the portfolio directly.')
        : error?.name === 'AbortError' || error?.name === 'TimeoutError' || providerStatus === 408 || providerStatus === 504
          ? new ChatError(504, 'TIMEOUT', 'The response is taking longer than expected. Please try again.')
          : new ChatError(503, 'SERVICE_UNAVAILABLE', UNAVAILABLE);
      if (safe.status === 429) res.setHeader('Retry-After', '60');
      // No raw errors, prompts, messages or credentials are logged or returned.
      if (!res.destroyed) { res.statusCode = safe.status; res.end(JSON.stringify({ success: false, code: safe.code, message: safe.message })); }
    } finally {
      clearTimeout(timer); release?.(); res.off?.('close', onClose);
    }
  };
}

export default createChatHandler();
