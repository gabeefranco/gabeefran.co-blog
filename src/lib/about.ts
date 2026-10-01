import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './i18n';

// The about page lives at src/content/about/<lang>.md; its URL segment comes
// from the `slug` frontmatter field, so each language can have its own
// (/en/about, /pt/sobre).
export type AboutPage = CollectionEntry<'about'>;

export async function getAboutPages(): Promise<AboutPage[]> {
  return getCollection('about');
}

export async function getAboutPage(lang: Lang): Promise<AboutPage> {
  const page = (await getAboutPages()).find((entry) => entry.data.language === lang);
  if (!page) throw new Error(`Missing src/content/about/${lang}.md`);
  return page;
}

export function aboutPathOf(page: AboutPage): string {
  return `/${page.data.language}/${page.data.slug}`;
}

export async function getAboutPath(lang: Lang): Promise<string> {
  return aboutPathOf(await getAboutPage(lang));
}
