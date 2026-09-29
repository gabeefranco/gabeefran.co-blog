import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getLocalizedPath, langPaths, useTranslations, type Lang } from '../../lib/i18n';
import { getPostsByLang, slugOf } from '../../lib/posts';

export const getStaticPaths = langPaths;

export async function GET(context: APIContext) {
  const lang = context.params.lang as Lang;
  const t = useTranslations(lang);
  const posts = await getPostsByLang(lang);
  return rss({
    title: t('feed.title'),
    description: t('feed.description'),
    site: new URL(getLocalizedPath('/', lang), context.site),
    customData: `<language>${lang}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `${getLocalizedPath(`/posts/${slugOf(post)}`, lang)}/`,
    })),
  });
}
