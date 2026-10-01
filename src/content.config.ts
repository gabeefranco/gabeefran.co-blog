import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Each post lives twice: src/content/posts/en/<slug>.mdx and
// src/content/posts/pt/<slug>.mdx. The loader id is "<lang>/<slug>",
// which is how we pair up translations and derive routes.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
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

// The about page, one file per language: src/content/about/<lang>.md.
// `slug` is the URL segment for that language (about, sobre).
const about = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/about' }),
  schema: z.object({
    language: z.enum(['en', 'pt']),
    slug: z.string(),
  }),
});

export const collections = { posts, about };
