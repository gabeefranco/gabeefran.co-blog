# gabeefran.co

Personal blog of Gabriel Franco (gabeefranco). Built with Astro, TypeScript, MDX, React, and Tailwind CSS. Bilingual (English / Portuguese) via Astro's built-in i18n routing.

## Structure

```text
/
├── public/                     favicon, logo, static assets
├── src/
│   ├── components/             Astro + React components (Header, PostCard, ObservationCard, ...)
│   ├── content/posts/en/*.mdx  English posts
│   ├── content/posts/pt/*.mdx  Portuguese posts (same filename pairs a translation)
│   ├── layouts/                BaseLayout, PostLayout
│   ├── lib/                    i18n dictionary + post helpers
│   └── pages/                  routes: "/" is English (default locale), "/pt/*" is Portuguese
└── astro.config.mjs
```

Every post exists as two files with the same slug — `src/content/posts/en/<slug>.mdx` and `src/content/posts/pt/<slug>.mdx` — so the language switcher can always land on the matching translation.

## Commands

| Command             | Action                                      |
| :------------------- | :------------------------------------------ |
| `npm install`         | Install dependencies                        |
| `npm run dev`          | Start the dev server at `localhost:4321`    |
| `npm run build`        | Build the production site to `./dist/`      |
| `npm run preview`       | Preview the production build locally         |
| `npm run astro check`   | Type-check the project                      |
