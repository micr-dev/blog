# blog.micr.dev

Static Next.js writeup blog based on the provided reference layout, rebuilt around local MDX content.

## Commands

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## Writing posts

- Published posts live in `content/posts/*.mdx`.
- Use `content/templates/post-template.mdx` as the starting point for new posts.
- Slugs come from filenames.
- Tags are generated from frontmatter.

## Local editor

- Run `npm run dev`.
- Open `http://localhost:3000/mdx-editor`.
- This route is development-only and intended for Chromium browsers.
- It can open, edit, and save local `.mdx` files directly through the File System Access API.

## Per-post themes

Each post can override:

- page colors
- body / heading / mono fonts
- code block colors
- Mermaid colors

Supported font sources in v1:

- Google Fonts
- local files served from `public/fonts`

## Agentation

The app mounts Agentation only in development.

Recommended MCP setup:

```bash
npx add-mcp "npx -y agentation-mcp server"
npx agentation-mcp doctor
```

If you want to remove Agentation later, delete `src/components/agentation-root.tsx` and the dev-only import block in `src/app/layout.tsx`.
