// Every localized string on the site lives here. Keep this file free of
// runtime imports: scripts/generate-social-cards.ts loads it directly with Node.

export const LANGS = ['en', 'pt'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  pt: 'Português',
};

/** hreflang values for <link rel="alternate">. */
export const HREFLANGS: Record<Lang, string> = {
  en: 'en',
  pt: 'pt-BR',
};

export const SUPPORTED = ["pt", "en"] as const;
export const DEFAULT = "en";

export const ui = {
  en: {
    'site.name': 'gabeefranco',
    'nav.home': 'Home',
    'nav.posts': 'Posts',
    'nav.about': 'About',
    'nav.menu': 'Menu',
    'lang.switch': 'Switch language',
    'theme.switch': 'Toggle color theme',
    'hero.kicker': "Computer Science in real life.",
    'hero.title': 'Building things, and figuring out how they work.',
    'hero.subtitle':
      "Notes on computer science, systems, and the open source projects that shaped how I think about software. I'm Gabriel Franco — welcome.",
    'hero.cta.posts': 'Read the posts',
    'hero.cta.about': 'About me',
    'home.description':
      'Notes on computer science, systems, and the open source projects that shaped how I think about software.',
    'home.recent': 'Recent posts',
    'home.recent.subtitle': 'The latest things I’ve written down.',
    'home.viewAll': 'View all posts',
    'posts.title': 'All posts',
    'posts.subtitle': 'Everything I’ve written, oldest to newest below, newest on top.',
    'posts.description': 'Everything I’ve written about computer science, systems, and open source, newest first.',
    'posts.empty': 'No posts yet. Check back soon.',
    'posts.filteredBy': 'Posts tagged',
    'posts.clearFilter': 'Clear filter',
    'post.back': 'Back to posts',
    'post.tags': 'Tags',
    'post.readingTime': 'min read',
    'post.updated': 'Updated',
    'tag.label': 'Tag',
    'tag.description': 'Everything I’ve written tagged #{tag}.',
    'footer.tagline': 'Written by hand in Porto Alegre.',
    'footer.rights': 'All rights reserved.',
    'footer.source': 'Source',
    'feed.title': 'gabeefran.co',
    'feed.description': "Gabriel Franco's notes about computer science and other topics",
    '404.title': 'Page not found',
    '404.body': 'There’s nothing here. Let’s get you back home.',
    '404.cta': 'Back to home',
  },
  pt: {
    'site.name': 'gabeefranco',
    'nav.home': 'Início',
    'nav.posts': 'Posts',
    'nav.about': 'Sobre',
    'nav.menu': 'Menu',
    'lang.switch': 'Mudar idioma',
    'theme.switch': 'Alternar tema',
    'hero.kicker': 'Ciência da Computação na vida real',
    'hero.title': 'Construindo coisas e entendendo como elas funcionam.',
    'hero.subtitle':
      'Notas sobre ciência da computação, sistemas e os projetos open source que moldaram a forma como penso sobre software. Eu sou o Gabriel Franco — seja bem-vindo.',
    'hero.cta.posts': 'Ler os posts',
    'hero.cta.about': 'Sobre mim',
    'home.description':
      'Notas sobre ciência da computação, sistemas e os projetos open source que moldaram a forma como penso sobre software.',
    'home.recent': 'Posts recentes',
    'home.recent.subtitle': 'As últimas coisas que escrevi.',
    'home.viewAll': 'Ver todos os posts',
    'posts.title': 'Todos os posts',
    'posts.subtitle': 'Tudo que já escrevi, do mais recente para o mais antigo.',
    'posts.description':
      'Tudo que já escrevi sobre ciência da computação, sistemas e open source, do mais recente ao mais antigo.',
    'posts.empty': 'Ainda não há posts. Volte em breve.',
    'posts.filteredBy': 'Posts com a tag',
    'posts.clearFilter': 'Limpar filtro',
    'post.back': 'Voltar para os posts',
    'post.tags': 'Tags',
    'post.readingTime': 'min de leitura',
    'post.updated': 'Atualizado em',
    'tag.label': 'Tag',
    'tag.description': 'Tudo que já escrevi com a tag #{tag}.',
    'footer.tagline': 'Escrito à mão em Porto Alegre.',
    'footer.rights': 'Todos os direitos reservados.',
    'footer.source': 'Código-fonte',
    'feed.title': 'gabeefran.co',
    'feed.description': 'Anotações do Gabriel Franco sobre ciência da computação e outros assuntos',
    '404.title': 'Página não encontrada',
    '404.body': 'Não há nada aqui. Vamos te levar de volta para o início.',
    '404.cta': 'Voltar para o início',
  },
} as const;

export type UiKey = keyof (typeof ui)['en'];

export function isLang(value: string | undefined): value is Lang {
  return LANGS.some((lang) => lang === value);
}

/** getStaticPaths() result for pages that only vary by language. */
export function langPaths() {
  return LANGS.map((lang) => ({ params: { lang } }));
}

/** `{name}` placeholders in a string are replaced with `vars[name]`. */
export function useTranslations(lang: Lang) {
  return function t(key: UiKey, vars: Record<string, string> = {}): string {
    const template: string = ui[lang][key] ?? ui[DEFAULT_LANG][key];
    return template.replace(/\{(\w+)\}/g, (placeholder, name: string) => vars[name] ?? placeholder);
  };
}

/**
 * Pages with their own title/description (tag pages use tagPageMeta). The about
 * page's live in src/content/about/<lang>.mdx.
 */
export type PageKey = 'home' | 'posts' | '404';

export interface PageMeta {
  title: string;
  description: string;
}

const PAGE_META_KEYS: Record<PageKey, { title: UiKey; description: UiKey }> = {
  home: { title: 'hero.title', description: 'home.description' },
  posts: { title: 'posts.title', description: 'posts.description' },
  '404': { title: '404.title', description: '404.body' },
};

export function pageMeta(lang: Lang, page: PageKey): PageMeta {
  const t = useTranslations(lang);
  const keys = PAGE_META_KEYS[page];
  return { title: t(keys.title), description: t(keys.description) };
}

export function tagPageMeta(lang: Lang, tag: string): PageMeta {
  return { title: `#${tag}`, description: useTranslations(lang)('tag.description', { tag }) };
}

/** Given any pathname, build the equivalent path in the target language. */
export function getLocalizedPath(pathname: string, lang: Lang): string {
  const [, first] = pathname.split('/');
  const stripped = (isLang(first) ? pathname.slice(first.length + 1) : pathname) || '/';
  return stripped === '/' ? `/${lang}` : `/${lang}${stripped}`;
}

/** Every language has its own slug for a post, so post URLs aren't derivable from each other. */
export function postPath(lang: Lang, slug: string): string {
  return `/${lang}/posts/${slug}`;
}

/** Path of the same page in each language, for pages that exist in every language. */
export function localizedAlternates(pathname: string): Record<Lang, string> {
  return Object.fromEntries(LANGS.map((lang) => [lang, getLocalizedPath(pathname, lang)])) as Record<Lang, string>;
}

export function pickLocale(header: string | null): string {
  if (!header) return DEFAULT;

  // "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7" -> [{tag:"pt", q:1}, ...]
  const prefs = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? parseFloat(qParam.split("=")[1]) : 1;
      return { lang: tag.toLowerCase().split("-")[0], q: isNaN(q) ? 0 : q };
    })
    .filter((p) => p.q > 0)
    .sort((a, b) => b.q - a.q);

  return prefs.find((p) => (SUPPORTED as readonly string[]).includes(p.lang))?.lang ?? DEFAULT;
}
