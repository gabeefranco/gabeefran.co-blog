export const LANGS = ['en', 'pt'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  pt: 'Português',
};

export const ui = {
  en: {
    'site.name': 'gabeefranco',
    'nav.home': 'Home',
    'nav.posts': 'Posts',
    'nav.about': 'About',
    'nav.menu': 'Menu',
    'lang.switch': 'Switch language',
    'theme.switch': 'Toggle color theme',
    'hero.kicker': "Gabriel Franco's notes",
    'hero.title': 'Building things, and figuring out how they work.',
    'hero.subtitle':
      "Notes on computer science, systems, and the open source projects that shaped how I think about software. I'm gabeefranco — welcome.",
    'hero.cta.posts': 'Read the posts',
    'hero.cta.about': 'About me',
    'home.recent': 'Recent posts',
    'home.recent.subtitle': 'The latest things I’ve written down.',
    'home.viewAll': 'View all posts',
    'posts.title': 'All posts',
    'posts.subtitle': 'Everything I’ve written, oldest to newest below, newest on top.',
    'posts.empty': 'No posts yet. Check back soon.',
    'posts.filteredBy': 'Posts tagged',
    'posts.clearFilter': 'Clear filter',
    'post.back': 'Back to posts',
    'post.tags': 'Tags',
    'post.readingTime': 'min read',
    'post.updated': 'Updated',
    'tag.label': 'Tag',
    'about.title': 'About',
    'footer.tagline': 'Written by hand in Porto Alegre.',
    'footer.rights': 'All rights reserved.',
    'footer.source': 'Source',
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
    'hero.kicker': 'Anotações do Gabriel Franco',
    'hero.title': 'Construindo coisas e entendendo como elas funcionam.',
    'hero.subtitle':
      'Notas sobre ciência da computação, sistemas e os projetos open source que moldaram a forma como penso sobre software. Eu sou o gabeefranco — seja bem-vindo.',
    'hero.cta.posts': 'Ler os posts',
    'hero.cta.about': 'Sobre mim',
    'home.recent': 'Posts recentes',
    'home.recent.subtitle': 'As últimas coisas que escrevi.',
    'home.viewAll': 'Ver todos os posts',
    'posts.title': 'Todos os posts',
    'posts.subtitle': 'Tudo que já escrevi, do mais recente para o mais antigo.',
    'posts.empty': 'Ainda não há posts. Volte em breve.',
    'posts.filteredBy': 'Posts com a tag',
    'posts.clearFilter': 'Limpar filtro',
    'post.back': 'Voltar para os posts',
    'post.tags': 'Tags',
    'post.readingTime': 'min de leitura',
    'post.updated': 'Atualizado em',
    'tag.label': 'Tag',
    'about.title': 'Sobre',
    'footer.tagline': 'Escrito à mão em Porto Alegre.',
    'footer.rights': 'Todos os direitos reservados.',
    'footer.source': 'Código-fonte',
    '404.title': 'Página não encontrada',
    '404.body': 'Não há nada aqui. Vamos te levar de volta para o início.',
    '404.cta': 'Voltar para o início',
  },
} as const;

export type UiKey = keyof (typeof ui)['en'];

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first === 'pt' ? 'pt' : DEFAULT_LANG;
}

export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key] ?? ui[DEFAULT_LANG][key];
  };
}

/** Prefix-strip the given pathname down to its language-agnostic form. */
export function stripLangPrefix(pathname: string): string {
  return pathname.replace(/^\/pt(?=\/|$)/, '') || '/';
}

/** Given any pathname, build the equivalent path in the target language. */
export function getLocalizedPath(pathname: string, lang: Lang): string {
  const stripped = stripLangPrefix(pathname);
  if (lang === DEFAULT_LANG) return stripped;
  return stripped === '/' ? '/pt' : `/pt${stripped}`;
}

export function localizeHref(path: string, lang: Lang): string {
  if (lang === DEFAULT_LANG) return path;
  return path === '/' ? '/pt' : `/pt${path}`;
}
