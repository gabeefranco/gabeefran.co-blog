// Generates OG images for every post and every other page (home, posts,
// about, tags, 404) using Cloudflare Browser Run.
// Adapted from https://developers.cloudflare.com/browser-run/how-to/og-images-astro/
//
// Usage: npm run og            (only missing images)
//        npm run og -- --force (regenerate all)
//
// Needs CF_ACCOUNT_ID and CF_API_TOKEN (read from .env), and the
// /social-card and /page-card routes must be deployed at BASE_URL.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { LANGS, pageMeta, tagPageMeta, type Lang, type PageKey } from '../src/lib/i18n.ts';
import { readPostFiles, type PostFile } from '../src/lib/post-files.ts';
import { pageCardPath, postCardPath, tagCardPath } from '../src/lib/social-cards.ts';

const BASE_URL = process.env.SOCIAL_CARD_BASE_URL ?? 'https://gabeefran.co';
const CF_API = 'https://api.cloudflare.com/client/v4/accounts';
// 404.html is prerendered once, in English (see src/pages/404.astro).
const LANG_PAGES: Record<Lang, PageKey[]> = {
  en: ['home', 'posts', 'about', '404'],
  pt: ['home', 'posts', 'about'],
};

interface Card {
  /** Path under public/, e.g. /social-cards/en/hello-world.png */
  path: string;
  /** Card template route: /social-card for posts, /page-card for everything else. */
  route: '/social-card' | '/page-card';
  params: Record<string, string>;
}

function listCards(posts: PostFile[]): Card[] {
  const postCards: Card[] = posts.map((post) => {
    const params: Record<string, string> = { title: post.title, author: 'Gabriel Franco' };
    if (post.description) params.description = post.description;
    return { path: postCardPath(post.lang, post.slug), route: '/social-card', params };
  });

  const pageCards: Card[] = LANGS.flatMap((lang) => {
    const pages = LANG_PAGES[lang].map((key) => ({ path: pageCardPath(lang, key), meta: pageMeta(lang, key) }));
    const tags = [...new Set(posts.filter((p) => p.lang === lang).flatMap((p) => p.tags))].sort();
    const tagPages = tags.map((tag) => ({ path: tagCardPath(lang, tag), meta: tagPageMeta(lang, tag) }));
    return [...pages, ...tagPages].map(({ path, meta }) => ({
      path,
      route: '/page-card' as const,
      params: { title: meta.title, description: meta.description },
    }));
  });

  return [...postCards, ...pageCards];
}

async function captureScreenshot(accountId: string, apiToken: string, pageUrl: string): Promise<ArrayBuffer> {
  const res = await fetch(`${CF_API}/${accountId}/browser-run/screenshot`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: pageUrl,
      viewport: { width: 1200, height: 630 },
      gotoOptions: { waitUntil: 'networkidle0' },
    }),
  });

  if (!res.ok) {
    throw new Error(`Screenshot API returned ${res.status}: ${await res.text()}`);
  }
  return res.arrayBuffer();
}

async function main() {
  const accountId = process.env.CF_ACCOUNT_ID;
  const apiToken = process.env.CF_API_TOKEN;
  if (!accountId || !apiToken) {
    console.error('Error: CF_ACCOUNT_ID and CF_API_TOKEN required (put them in .env)');
    process.exit(1);
  }

  const force = process.argv.includes('--force');
  const cards = listCards(readPostFiles().filter((post) => !post.draft));
  console.log(`Found ${cards.length} cards to process\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const outPath = join('public', card.path);
    const name = card.path.replace(/^\/social-cards\//, '');
    const label = `[${i + 1}/${cards.length}]`;

    if (!force && existsSync(outPath)) {
      console.log(`${label} ${name} — skipped (exists)`);
      skipped++;
      continue;
    }

    const url = `${BASE_URL}${card.route}?${new URLSearchParams(card.params)}`;

    try {
      const png = await captureScreenshot(accountId, apiToken, url);
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, Buffer.from(png));
      console.log(`${label} ${name} — done`);
      generated++;
    } catch (err) {
      console.error(`${label} ${name} — failed:`, err);
      failed++;
    }

    // Stay under Browser Run rate limits.
    if (i < cards.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }

  console.log(`\nDone. Generated: ${generated}, Skipped: ${skipped}, Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

main();
