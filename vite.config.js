// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'firebase/app': '/node_modules/firebase/app',
      'firebase/storage': '/node_modules/firebase/storage',
    },
  },
  build: {
    rollupOptions: {
      external: ['firebase/app', 'firebase/storage'], // Ensure these are listed as externals
    },
  },
});

