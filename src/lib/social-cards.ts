// Where generated OG cards live, relative to public/. Shared by the pages and
// by scripts/generate-social-cards.ts (so keep this file free of runtime
// imports: the script loads it directly with Node).
import type { Lang, PageKey } from './i18n';

export function postCardPath(lang: Lang, slug: string): string {
  return `/social-cards/${lang}/${slug}.png`;
}

export function pageCardPath(lang: Lang, page: PageKey): string {
  return `/social-cards/${lang}/pages/${page}.png`;
}

/** Named after the slug, like the page itself (/pt/sobre -> pt/pages/sobre.png). */
export function aboutCardPath(lang: Lang, slug: string): string {
  return `/social-cards/${lang}/pages/${slug}.png`;
}

export function tagCardPath(lang: Lang, tag: string): string {
  return `/social-cards/${lang}/tags/${tag}.png`;
}
