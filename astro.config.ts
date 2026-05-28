import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  // used to generate images
  site:
    process.env.CF_PAGES_URL
      ? `https://${process.env.CF_PAGES_URL}/`
      : process.env.NODE_ENV === 'production'
        ? 'https://troubles-factory.com/'
        : 'http://localhost:4321/',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
  },
});
