// Reads post frontmatter straight from disk, for code that runs outside
// content collections: astro.config.mjs (before collections exist) and
// scripts/generate-social-cards.ts (plain Node). Keep this file free of Astro
// imports and use explicit .ts extensions so Node can load it directly.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LANGS, type Lang } from './i18n.ts';

const POSTS_DIR = 'src/content/posts';

export interface PostFile {
  lang: Lang;
  slug: string;
  title: string;
  description?: string;
  tags: string[];
  draft: boolean;
}

function getFrontmatterField(content: string, field: string): string | null {
  const match = content.match(new RegExp(`^${field}:\\s*"?([^"\\n]+)"?`, 'm'));
  return match ? match[1].trim() : null;
}

/** Reads an inline tag list, e.g. `tags: ["meta", "blogging"]`. */
function getFrontmatterTags(content: string): string[] {
  const list = content.match(/^tags:\s*\[([^\]]*)\]/m)?.[1] ?? '';
  return [...list.matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
}

/** Posts live at src/content/posts/<lang>/<file>.mdx (see src/content.config.ts). */
export function readPostFiles(): PostFile[] {
  return LANGS.flatMap((lang) => {
    const dir = join(POSTS_DIR, lang);
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => {
        const raw = readFileSync(join(dir, file), 'utf-8');
        const slug = getFrontmatterField(raw, 'slug');
        if (!slug) throw new Error(`${join(dir, file)} is missing a \`slug\` in its frontmatter`);
        return {
          lang,
          slug,
          title: getFrontmatterField(raw, 'title') ?? slug,
          description: getFrontmatterField(raw, 'description') ?? undefined,
          tags: getFrontmatterTags(raw),
          draft: getFrontmatterField(raw, 'draft') === 'true',
        };
      });
  });
}
