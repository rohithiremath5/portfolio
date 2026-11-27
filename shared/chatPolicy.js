export const MAX_MESSAGE_LENGTH = 500;
export const MAX_HISTORY_MESSAGES = 10;
export const MAX_STORED_MESSAGES = 30;
export const MAX_REPLY_LENGTH = 4000;
export const COOLDOWN_MS = 2000;

export const UNRELATED = "I'm a portfolio assistant designed to answer questions about the candidate's professional background, skills, experience and projects. Is there anything you'd like to know about those?";
export const UNKNOWN = "I don't have that information in the available portfolio or resume. You can contact the candidate directly for more details.";
export const UNAVAILABLE = 'The AI assistant is temporarily unavailable. You can still explore my experience, skills and projects on this portfolio.';

// Exact FAQs deliberately avoid guessing intent in follow-up questions. Every
// factual answer is assembled from the same data used by the portfolio.
export function quickAnswer(message, data) {
  const question = message.trim().toLowerCase().replace(/[.!?]+$/g, '');
  if (/^(hi|hello|hey|thanks|thank you)$/.test(question)) return question.startsWith('thank')
    ? "You're welcome. You can ask about the professional background, skills or projects in this portfolio."
    : 'Hello! You can ask about the professional experience, technical skills and projects in this portfolio.';
  if (/ignore (all |any |the )?(previous|system)|reveal.{0,30}(prompt|key|secret)|system prompt|api[ _-]?key|environment variables|fabricate|invent (skills|experience)|pretend (he|the candidate)/i.test(message)) return UNRELATED;
  if (/\b(salary|notice period|availability|available to (start|join))\b/i.test(message)) return UNKNOWN;
  if (/\b(weather|recipe|capital of|write (me )?(an? )?(essay|poem))\b/i.test(message)) return UNRELATED;
  if (question === 'what are his technical skills') return Object.entries(data.skills).map(([group, items]) => `${group}: ${items.join(', ')}.`).join('\n\n');
  if (question === 'tell me about his professional experience') return data.experiences.map(item => `- ${item.role} at ${item.company}${item.companyDetail ? ` (${item.companyDetail})` : ''}, ${item.duration}.`).join('\n');
  if (question === 'what projects has he worked on') return data.projects.map(item => `- ${item.title} — ${item.stack.join(', ')}. Contributions: ${item.highlights.join('; ')}.`).join('\n');
  return null;
}

export function suggestedQuestions(data) {
  return [
    ...(data.experiences?.length ? ['Tell me about his professional experience.'] : []),
    ...(Object.keys(data.skills || {}).length ? ['What are his technical skills?'] : []),
    ...(data.projects?.length ? ['What projects has he worked on?'] : []),
  ];
}

export function safeStoredMessages(value) {
  if (!Array.isArray(value)) return [];
  return value.filter(item => item && ['user', 'assistant'].includes(item.role)
    && typeof item.content === 'string' && item.content.trim()
    && item.content.length <= (item.role === 'user' ? MAX_MESSAGE_LENGTH : MAX_REPLY_LENGTH))
    .slice(-MAX_STORED_MESSAGES).map(item => ({ role: item.role, content: item.content }));
}
