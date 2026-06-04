import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

const adminAlias = String.fromCharCode(64);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      [adminAlias]: path.resolve(process.cwd(), 'src/company-admin-exact')
    }
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true
  }
});
