import { createServer, loadEnv } from 'vite';
import { writeResumeContext } from '../server/chatbot/resumeContext.js';
import chat from '../api/chat.js';

// Vite loads .env.local without exposing non-VITE_ values to browser code.
const local = loadEnv('development', process.cwd(), '');
for (const key of ['GEMINI_API_KEY', 'GEMINI_MODEL']) {
  if (process.env[key] === undefined && local[key] !== undefined) process.env[key] = local[key];
}
const server = await createServer({
  plugins: [{
    name: 'local-portfolio-function',
    configureServer(vite) {
      vite.middlewares.use('/api/chat', (req, res, next) => {
        if (req.url?.split('?')[0] !== '/') return next();
        void chat(req, res);
      });
    },
  }],
});
async function updateContext() {
  const content = await server.ssrLoadModule('/src/data/resumeData.js');
  await writeResumeContext(content);
}
await updateContext();
server.watcher.on('change', file => {
  if (file.replaceAll('\\', '/').endsWith('/src/data/resumeData.js')) {
    updateContext().catch(() => console.error('Could not refresh public resume context. Restart dev:full after fixing the resume module.'));
  }
});
await server.listen();
server.printUrls();
console.log('Local /api/chat is enabled. Gemini credentials remain on the server.');
