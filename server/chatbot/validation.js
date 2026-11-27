import { MAX_MESSAGE_LENGTH, MAX_HISTORY_MESSAGES, MAX_REPLY_LENGTH } from '../../shared/chatPolicy.js';

export const MAX_BODY_BYTES = 16 * 1024;
export class ChatError extends Error {
  constructor(status, code, message) { super(message); Object.assign(this, { status, code }); }
}
export const invalid = () => new ChatError(400, 'INVALID_REQUEST', 'Please send a question of 1–500 characters with a valid conversation history.');

export async function readChatRequest(req) {
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) throw new ChatError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Please send a JSON request.');
  if (Number(req.headers['content-length']) > MAX_BODY_BYTES) throw new ChatError(413, 'REQUEST_TOO_LARGE', 'The message is too large. Please shorten it.');
  let body = req.body;
  if (body === undefined) {
    const chunks = [];
    let bytes = 0;
    const stream = typeof req.iterator === 'function' ? req.iterator({ destroyOnReturn: false }) : req;
    for await (const chunk of stream) {
      bytes += Buffer.byteLength(chunk);
      if (bytes > MAX_BODY_BYTES) {
        req.resume?.();
        throw new ChatError(413, 'REQUEST_TOO_LARGE', 'The message is too large. Please shorten it.');
      }
      chunks.push(Buffer.from(chunk));
    }
    body = Buffer.concat(chunks).toString('utf8');
  }
  if (Buffer.isBuffer(body)) body = body.toString('utf8');
  if (typeof body === 'string') {
    if (Buffer.byteLength(body) > MAX_BODY_BYTES) throw new ChatError(413, 'REQUEST_TOO_LARGE', 'The message is too large. Please shorten it.');
    try { body = JSON.parse(body); } catch { throw invalid(); }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw invalid();
  if (Buffer.byteLength(JSON.stringify(body)) > MAX_BODY_BYTES) throw new ChatError(413, 'REQUEST_TOO_LARGE', 'The message is too large. Please shorten it.');
  if (Object.keys(body).some(key => !['message', 'history'].includes(key))) throw invalid();
  if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > MAX_MESSAGE_LENGTH) throw invalid();
  const history = body.history ?? [];
  if (!Array.isArray(history) || history.length > 30) throw invalid();
  for (const item of history) {
    if (!item || typeof item !== 'object' || Array.isArray(item)
      || Object.keys(item).some(key => !['role', 'content'].includes(key))
      || !['user', 'assistant'].includes(item.role) || typeof item.content !== 'string'
      || !item.content.trim() || item.content.length > (item.role === 'user' ? MAX_MESSAGE_LENGTH : MAX_REPLY_LENGTH)) throw invalid();
  }
  return { message: body.message.trim(), history: history.slice(-MAX_HISTORY_MESSAGES).map(({ role, content }) => ({ role, content: content.trim() })) };
}

export function validateOrigin(req) {
  if (req.headers['sec-fetch-site'] === 'cross-site') throw new ChatError(403, 'FORBIDDEN', 'Please use the assistant from this portfolio.');
  const origin = req.headers.origin;
  if (!origin) return; // Non-browser clients still require limits; Origin is not authentication.
  try {
    const url = new URL(origin);
    if (['http:', 'https:'].includes(url.protocol) && url.host === req.headers.host) return;
  } catch { /* Reject invalid and opaque origins. */ }
  throw new ChatError(403, 'FORBIDDEN', 'Please use the assistant from this portfolio.');
}
