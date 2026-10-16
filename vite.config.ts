import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// In development the API server runs separately (npm run dev starts both); Vite forwards these paths to it.
// changeOrigin must stay false: the API rejects state-changing requests whose Origin doesn't match the Host
// header (protection against cross-site requests), so the browser's Host has to be passed through unchanged.
// Vite's string shorthand ('/api': 'http://…') would turn changeOrigin on and break sign-in and checkout.
const API = { target: 'http://localhost:3001', changeOrigin: false };

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': API,
      '/uploads': API,
    },
  },
});
