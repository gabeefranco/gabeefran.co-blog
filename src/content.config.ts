import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts live at src/content/posts/<lang>/<file>.mdx. The entry id is always
// that path ("<lang>/<file>"), never the frontmatter slug: the language comes
// from the folder, and a post and its translation share the same filename.
// The URL is /<lang>/posts/<slug>, so each translation picks its own slug.
const posts = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.replace(/\.mdx$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    language: z.enum(['en', 'pt']),
    pubDate: z.coerce.date(),
    slug: z.string(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// The about page, one file per language: src/content/about/<lang>.mdx. The
// entry id is the language; the URL is /<lang>/<slug>.
const about = defineCollection({
  loader: glob({
    pattern: '*.mdx',
    base: './src/content/about',
    generateId: ({ entry }) => entry.replace(/\.mdx$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
  }),
});

export const collections = { posts, about };
