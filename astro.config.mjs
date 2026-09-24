// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: 'https://gabeefran.co',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [react(), mdx(), sitemap()],

  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  trailingSlash: 'never',
  build: { format: 'file' },

  vite: {
    plugins: [tailwindcss()],
  },
});
