# blog.micr.dev

A static writeup blog built with Next.js 16, MDX, and Tailwind CSS v4. Features per-post theming, a local MDX editor, Mermaid diagrams, code syntax highlighting, Open Graph image generation, and full-text search.

**Live site:** [blog.micr.dev](https://blog.micr.dev)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Content | Local MDX with frontmatter |
| Styling | Tailwind CSS v4 |
| Diagrams | Mermaid 11 |
| Code Highlighting | Shiki + Prism React Renderer |
| Animation | Motion + custom animate-ui components |
| Testing | Vitest + Testing Library |
| Linting | ESLint (next config) |

## Getting Started

```bash
npm install
npm run dev        # Start dev server at http://localhost:3000
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |

## Writing Posts

- Published posts live in `content/posts/*.mdx`.
- Use `content/templates/post-template.mdx` as the starting point for new posts.
- Slugs are derived from filenames.
- Tags are generated from frontmatter.
- Posts support custom themes (see below).

## Local Editor

- Run `npm run dev`.
- Open `http://localhost:3000/mdx-editor`.
- This route is development-only and intended for Chromium browsers.
- It can open, edit, and save local `.mdx` files directly through the File System Access API.

## Per-Post Themes

Each post can override:

- Page colors
- Body / heading / mono fonts
- Code block colors
- Mermaid diagram colors

Supported font sources in v1:

- Google Fonts
- Local files served from `public/fonts`

## Features

- **Security headers** — CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy configured in `next.config.ts`
- **OG image generation** — Dynamic Open Graph images per post via `opengraph-image.tsx`
- **Full-text search** — Search across all posts at `/search`
- **Tag system** — Auto-generated tag pages at `/tags/[slug]`
- **Plain text mode** — Accessible plain version at `/read/[slug]`
- **robots.txt & sitemap** — Auto-generated via `robots.ts` and `sitemap.ts`
- **security.txt** — Available at `/.well-known/security.txt`

## Agentation

The app mounts Agentation only in development.

Recommended MCP setup:

```bash
npx add-mcp "npx -y agentation-mcp server"
npx agentation-mcp doctor
```

If you want to remove Agentation later, delete `src/components/agentation-root.tsx` and the dev-only import block in `src/app/layout.tsx`.

## License

Private — all rights reserved.
