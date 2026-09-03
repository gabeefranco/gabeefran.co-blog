// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

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

  integrations: [react(), mdx()],

  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  vite: {
    plugins: [tailwindcss()],
  },
});
