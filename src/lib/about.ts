import { getEntry, type CollectionEntry } from 'astro:content';
import { LANGS, type Lang } from './i18n';

export type AboutEntry = CollectionEntry<'about'>;

/** The id is the language (see src/content.config.ts). */
export async function getAbout(lang: Lang): Promise<AboutEntry> {
  const entry = await getEntry('about', lang);
  if (!entry) throw new Error(`Missing src/content/about/${lang}.mdx`);
  return entry;
}

/** Every language has its own slug for the about page (/en/about, /pt/sobre). */
export async function aboutPath(lang: Lang): Promise<string> {
  return `/${lang}/${(await getAbout(lang)).data.slug}`;
}

export async function getAboutAlternates(): Promise<Record<Lang, string>> {
  const paths = await Promise.all(LANGS.map(async (lang) => [lang, await aboutPath(lang)] as const));
  return Object.fromEntries(paths) as Record<Lang, string>;
}
