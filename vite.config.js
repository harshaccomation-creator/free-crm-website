import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      '154047a1-b3db-46a2-9ced-81411e129c5d-00-mrn5rk2jzve3.sisko.replit.dev',
      '.replit.dev',
      '.sisko.replit.dev'
    ]
  }
});
