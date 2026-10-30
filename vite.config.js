import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  define: { __BUILD_YEAR__: JSON.stringify(new Date().getUTCFullYear()) },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
