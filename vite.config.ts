import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import ViteSitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(), // React plugin
    tailwindcss(), // TailwindCSS plugin for utility-first styling
    ViteSitemap({
      hostname: 'https://chennaisparklecrackers.com/', // Replace with your actual base URL
      outDir: 'dist', // Output directory for sitemap
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
