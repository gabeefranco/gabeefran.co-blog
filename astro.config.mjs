// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// English used to be served without a /en prefix. Every URL published before
// the move keeps working through a 301; new pages only ever existed under /en.
// (Astro can't express this as a dynamic redirect in a static build: the
// destination must be an existing route with the same params.)
const LEGACY_EN_PATHS = [
  '/',
  '/about',
  '/posts',
  '/posts/hello-world',
  '/posts/spotify-complaining',
  '/posts/understanding-plugin4shell-git-trick-ai-coding-agents',
  '/tags/ai',
  '/tags/blogging',
  '/tags/cybersecurity',
  '/tags/git',
  '/tags/life',
  '/tags/meta',
  '/tags/software',
  '/feed.xml',
];

// Draft posts still get a page (reachable by URL) but stay out of the sitemap.
// This runs before content collections exist, so read the frontmatter directly.
const DRAFT_PATHS = readdirSync('./src/content/posts', { recursive: true, encoding: 'utf-8' })
  .filter((file) => file.endsWith('.mdx'))
  .map((file) => readFileSync(`./src/content/posts/${file}`, 'utf-8'))
  .filter((raw) => /^draft:\s*true\s*$/m.test(raw))
  .map((raw) => raw.match(/^slug:\s*"?(en|pt)-([^"\n]+)"?/m))
  .filter((match) => match !== null)
  .map(([, lang, slug]) => `/${lang}/posts/${slug.trim()}/`);

// https://astro.build/config
export default defineConfig({
  site: 'https://gabeefran.co',

  // No `i18n` block on purpose: locales come from src/lib/i18n.ts and every
  // locale, English included, lives under src/pages/[lang]/. Astro's i18n
  // routing would add middleware that 404s the unprefixed on-demand
  // /page-card and /social-card routes (prefix-always) or /en/* (default).

  redirects: Object.fromEntries(LEGACY_EN_PATHS.map((path) => [path, path === '/' ? '/en' : `/en${path}`])),

  integrations: [react(), mdx(), sitemap({ filter: (page) => !DRAFT_PATHS.some((path) => page.endsWith(path)) })],

  adapter: vercel({
    webAnalytics: { enabled: false },
  }),

  vite: {
    plugins: [tailwindcss()],
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: "iA Writer Duo S",
      cssVariable: "--font-iawriter",
      options: {
        variants: [
          {
            src: ['./src/assets/iAWriterDuoS-Regular.woff2'],
            weight: 'normal',
            style: 'normal'
          }
        ]
      }
    }
  ]
});
