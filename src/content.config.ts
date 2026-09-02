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
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
