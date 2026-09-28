// Generates OG images for every post using Cloudflare Browser Run.
// Adapted from https://developers.cloudflare.com/browser-run/how-to/og-images-astro/
//
// Usage: npm run og            (only missing images)
//        npm run og -- --force (regenerate all)
//
// Needs CF_ACCOUNT_ID and CF_API_TOKEN (read from .env), and the
// /social-card route must be deployed at BASE_URL.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE_URL = process.env.SOCIAL_CARD_BASE_URL ?? 'https://gabeefran.co';
const CF_API = 'https://api.cloudflare.com/client/v4/accounts';
const OUTPUT_DIR = 'public/social-cards';
const POSTS_DIR = 'src/content/posts';
const LANGS = ['en', 'pt'];

interface Post {
  lang: string;
  slug: string;
  title: string;
  description?: string;
}

function getFrontmatterField(content: string, field: string): string | null {
  const match = content.match(new RegExp(`^${field}:\\s*"?([^"\\n]+)"?`, 'm'));
  return match ? match[1].trim() : null;
}

/** Posts live at src/content/posts/<lang>/<slug>.mdx (see src/content.config.ts). */
function readPosts(): Post[] {
  return LANGS.flatMap((lang) => {
    const dir = join(POSTS_DIR, lang);
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter((f) => f.endsWith('.mdx'))
      .map((file) => {
        const raw = readFileSync(join(dir, file), 'utf-8');
        if (getFrontmatterField(raw, 'draft') === 'true') return null;
        const slug = file.replace(/\.mdx$/, '');
        const title = getFrontmatterField(raw, 'title') ?? slug;
        const description = getFrontmatterField(raw, 'description') ?? undefined;
        return { lang, slug, title, description };
      })
      .filter((p): p is Post => p !== null);
  });
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
  const posts = readPosts();
  if (posts.length === 0) {
    console.log(`No posts found in ${POSTS_DIR}.`);
    return;
  }
  console.log(`Found ${posts.length} posts to process\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const name = `${post.lang}/${post.slug}.png`;
    const outDir = join(OUTPUT_DIR, post.lang);
    const outPath = join(outDir, `${post.slug}.png`);
    const label = `[${i + 1}/${posts.length}]`;

    if (!force && existsSync(outPath)) {
      console.log(`${label} ${name} — skipped (exists)`);
      skipped++;
      continue;
    }

    const params = new URLSearchParams({ title: post.title, author: 'Gabriel Franco' });
    if (post.description) params.set('description', post.description);
    const url = `${BASE_URL}/social-card?${params}`;

    try {
      const png = await captureScreenshot(accountId, apiToken, url);
      mkdirSync(outDir, { recursive: true });
      writeFileSync(outPath, Buffer.from(png));
      console.log(`${label} ${name} — done`);
      generated++;
    } catch (err) {
      console.error(`${label} ${name} — failed:`, err);
      failed++;
    }

    // Stay under Browser Run rate limits.
    if (i < posts.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  console.log(`\nDone. Generated: ${generated}, Skipped: ${skipped}, Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

main();
