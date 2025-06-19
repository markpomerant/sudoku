import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/sudoku/', // if deploying to GitHub Pages
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Sudoku Game',
        short_name: 'Sudoku',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4a90e2',
        icons: [
          {
            src: 'sudoku-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'sudoku-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});