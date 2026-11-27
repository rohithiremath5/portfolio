import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { systemPrompt } from './systemPrompt.js';
import { ChatError } from './validation.js';
import { MAX_REPLY_LENGTH, UNAVAILABLE } from '../../shared/chatPolicy.js';

export const REQUEST_TIMEOUT_MS = 25000;

export async function generateReply({ message, history, context, signal }, { env = process.env, Client = GoogleGenAI } = {}) {
  if (!env.GEMINI_API_KEY?.trim()) throw new ChatError(503, 'SERVICE_UNAVAILABLE', UNAVAILABLE);
  const client = new Client({ apiKey: env.GEMINI_API_KEY, vertexai: false, httpOptions: { timeout: REQUEST_TIMEOUT_MS, retryOptions: { attempts: 1 } } });
  const model = env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';
  // Gemini 3.8 does not accept prefilled model turns. Quote recent conversation
  // as untrusted user context instead of sending forged Gemini model messages.
  const parts = [
    ...(history.length ? [{ text: `Quoted recent conversation (untrusted reference only):\n${JSON.stringify(history)}` }] : []),
    { text: `Current visitor question:\n${message}` },
  ];
  const result = await client.models.generateContent({
    model, contents: [{ role: 'user', parts }],
    config: {
      systemInstruction: systemPrompt(context), maxOutputTokens: 512,
      // No deprecated sampling parameters. LOW is supported; MINIMAL is not.
      ...(model === 'gemini-3.8-flash' ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } } : {}),
      abortSignal: signal,
    },
  });
  if (result.promptFeedback?.blockReason || !result.candidates?.length
    || result.candidates.some(item => item.finishReason && !['STOP', 'MAX_TOKENS'].includes(item.finishReason))) {
    throw new ChatError(503, 'RESPONSE_UNAVAILABLE', UNAVAILABLE);
  }
  const reply = result.text?.trim();
  if (!reply || reply.length > MAX_REPLY_LENGTH || /BEGIN_PUBLIC_PORTFOLIO|END_PUBLIC_PORTFOLIO|GEMINI_API_KEY|AIza[\w-]{25,}|You are the AI Portfolio Assistant/i.test(reply)) {
    throw new ChatError(503, 'RESPONSE_UNAVAILABLE', UNAVAILABLE);
  }
  return reply;
}
