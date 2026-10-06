# gabeefran.co

Personal blog of Gabriel Franco (gabeefranco). Built with Astro, TypeScript, MDX, React, and Tailwind CSS. Bilingual (English / Portuguese): every page lives under `/en/*` or `/pt/*` (see `src/lib/i18n.ts`).

## Structure

```text
/
├── public/                     favicon, logo, static assets
├── src/
│   ├── components/             Astro + React components (Header, PostCard, ObservationCard, ...)
│   ├── content/posts/en/*.mdx  English posts
│   ├── content/posts/pt/*.mdx  Portuguese posts (same filename = translation of each other)
│   ├── layouts/                BaseLayout, PostLayout
│   ├── lib/                    i18n dictionary + post helpers
│   └── pages/[lang]/           routes for every language ("/" redirects to "/en")
└── astro.config.mjs
```

A post and its translation share a **filename** — `src/content/posts/en/<file>.mdx` and `src/content/posts/pt/<file>.mdx` — which is how they're paired. The URL comes from the `slug` frontmatter field, so each language has its own: `en/hello-world.mdx` with `slug: "hello-world"` is served at `/en/posts/hello-world`, and `pt/hello-world.mdx` with `slug: "ola-mundo"` at `/pt/posts/ola-mundo`. The filename never shows up in a URL.

The language switcher, `hreflang` links, RSS feeds and sitemap all follow each post's own slug. A post can exist in only one language; its switcher then goes to the other language's home page. Social cards are named after the slug, so run `npm run og` after adding or renaming one.

Changing the slug of a published post breaks its old URL, so add a redirect for it in `astro.config.mjs`.

## Commands

| Command             | Action                                      |
| :------------------- | :------------------------------------------ |
| `npm install`         | Install dependencies                        |
| `npm run dev`          | Start the dev server at `localhost:4321`    |
| `npm run build`        | Build the production site to `./dist/`      |
| `npm run preview`       | Preview the production build locally         |
| `npm run astro check`   | Type-check the project                      |
