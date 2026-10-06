import { getCollection, type CollectionEntry } from 'astro:content';
import { getLocalizedPath, LANGS, postPath, type Lang } from './i18n';

export type PostEntry = CollectionEntry<'posts'>;

/** The id is "<lang>/<file>" (see src/content.config.ts). */
export function langOf(entry: PostEntry): Lang {
  return entry.id.split('/')[0] as Lang;
}

/** Shared by a post and its translations: the filename without the language folder. */
function translationKeyOf(entry: PostEntry): string {
  return entry.id.slice(entry.id.indexOf('/') + 1);
}

export function postHref(entry: PostEntry): string {
  return postPath(langOf(entry), entry.data.slug);
}

/**
 * Drafts are left out by default so they never show up in lists, tags or the
 * feed. Pass `includeDrafts` to still build their pages (reachable by URL only).
 */
export async function getPostsByLang(lang: Lang, { includeDrafts = false } = {}): Promise<PostEntry[]> {
  const posts = await getCollection('posts', (entry) => langOf(entry) === lang && (includeDrafts || !entry.data.draft));
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * URL of the post in every language it's translated to, itself included.
 * Draft translations are only linked from other drafts.
 */
export async function getPostAlternates(entry: PostEntry): Promise<Partial<Record<Lang, string>>> {
  const key = translationKeyOf(entry);
  const translations = await getCollection(
    'posts',
    (other) => translationKeyOf(other) === key && (entry.data.draft || !other.data.draft),
  );
  return Object.fromEntries(translations.map((post) => [langOf(post), postHref(post)]));
}

export async function getAllTags(lang: Lang): Promise<string[]> {
  const posts = await getPostsByLang(lang);
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags) tags.add(tag);
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}

/** URL of the tag page in every language that has posts with that tag. */
export async function getTagAlternates(tag: string): Promise<Partial<Record<Lang, string>>> {
  const tagsByLang = await Promise.all(LANGS.map(async (lang) => [lang, await getAllTags(lang)] as const));
  return Object.fromEntries(
    tagsByLang.filter(([, tags]) => tags.includes(tag)).map(([lang]) => [lang, getLocalizedPath(`/tags/${tag}`, lang)]),
  );
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
