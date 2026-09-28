// Title and description for every non-post page, shared by the pages
// themselves and by scripts/generate-social-cards.ts (so keep this file free
// of runtime imports: the script loads it directly with Node).
import type { Lang } from './i18n';

export type PageKey = 'home' | 'posts' | 'about' | '404';

export interface PageMeta {
  title: string;
  description: string;
}

export const PAGES: Record<Lang, Record<PageKey, PageMeta>> = {
  en: {
    home: {
      title: 'Building things, and figuring out how they work.',
      description:
        'Notes on computer science, systems, and the open source projects that shaped how I think about software.',
    },
    posts: {
      title: 'All posts',
      description: 'Everything I’ve written about computer science, systems, and open source, newest first.',
    },
    about: {
      title: 'About',
      description:
        'Gabriel Franco: computer science student at PUCRS, interested in how software actually works and in the history of open source.',
    },
    '404': {
      title: 'Page not found',
      description: 'There’s nothing here. Let’s get you back home.',
    },
  },
  pt: {
    home: {
      title: 'Construindo coisas e entendendo como elas funcionam.',
      description:
        'Notas sobre ciência da computação, sistemas e os projetos open source que moldaram a forma como penso sobre software.',
    },
    posts: {
      title: 'Todos os posts',
      description: 'Tudo que já escrevi sobre ciência da computação, sistemas e open source, do mais recente ao mais antigo.',
    },
    about: {
      title: 'Sobre',
      description:
        'Gabriel Franco: estudante de ciência da computação na PUCRS, interessado em como o software realmente funciona e na história do open source.',
    },
    '404': {
      title: 'Página não encontrada',
      description: 'Não há nada aqui. Vamos te levar de volta para o início.',
    },
  },
};

export function tagPage(lang: Lang, tag: string): PageMeta {
  return lang === 'pt'
    ? { title: `#${tag}`, description: `Tudo que já escrevi com a tag #${tag}.` }
    : { title: `#${tag}`, description: `Everything I’ve written tagged #${tag}.` };
}

/** Where the generated card for a page lives, relative to public/. */
export function pageCardPath(lang: Lang, key: PageKey): string {
  return `/social-cards/${lang}/pages/${key}.png`;
}

export function tagCardPath(lang: Lang, tag: string): string {
  return `/social-cards/${lang}/tags/${tag}.png`;
}
