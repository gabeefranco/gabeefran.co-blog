import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './i18n';

export type PostEntry = CollectionEntry<'posts'>;

/** The id is "<lang>/<slug>" (see src/content.config.ts). */
export function langOf(entry: PostEntry): Lang {
  return entry.id.split('/')[0] as Lang;
}

export function slugOf(entry: PostEntry): string {
  return entry.id.split('/').slice(1).join('/');
}

export async function getPostsByLang(lang: Lang): Promise<PostEntry[]> {
  const posts = await getCollection('posts', ({ id, data }) => {
    return id.startsWith(`${lang}/`) && !data.draft;
  });
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getPostBySlug(lang: Lang, slug: string): Promise<PostEntry | undefined> {
  const posts = await getCollection('posts');
  return posts.find((p) => p.id === `${lang}/${slug}`);
}

export async function getAllTags(lang: Lang): Promise<string[]> {
  const posts = await getPostsByLang(lang);
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags) tags.add(tag);
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}

const WORDS_PER_MINUTE = 200;

export function estimateReadingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

const DATE_LOCALES: Record<Lang, string> = {
  en: 'en-US',
  pt: 'pt-BR',
};

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(DATE_LOCALES[lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
