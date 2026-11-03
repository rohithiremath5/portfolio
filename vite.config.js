import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { access } from 'node:fs/promises'

// Match the deployed public-file MIME types and avoid Vite's HTML fallback
// for missing machine-readable documents during production preview.
const publicDocuments = {
  '.json': 'application/json', '.md': 'text/markdown', '.xml': 'application/xml',
  '.txt': 'text/plain', '.pdf': 'application/pdf',
}
const profilePreview = {
  name: 'profile-preview',
  configurePreviewServer(server) {
    server.middlewares.use(async (req, res, next) => {
      let pathname;
      try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
      catch { res.statusCode = 400; return res.end('Bad request'); }
      if (pathname === '/resume') { req.url = '/resume.pdf'; pathname = '/resume.pdf'; }
      const type = publicDocuments[path.extname(pathname)];
      if (!type) return next();
      const root = path.resolve('dist');
      const file = path.resolve(root, '.' + pathname);
      if (!file.startsWith(root + path.sep)) { res.statusCode = 404; return res.end('Not found'); }
      try { await access(file); }
      catch { res.statusCode = 404; return res.end('Not found'); }
      res.setHeader('Content-Type', type + (type.startsWith('text/') || type.includes('json') || type.includes('xml') ? '; charset=utf-8' : ''));
      next();
    });
  },
}

export default defineConfig({
  plugins: [react(), profilePreview],
  define: { __BUILD_YEAR__: JSON.stringify(new Date().getUTCFullYear()) },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
