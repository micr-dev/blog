# Nightshift Dead Code Analysis: micr-dev/blog

**Date:** 2026-04-06
**Task:** dead-code
**Category:** PR
**Result:** Codebase is clean — no actionable dead code found.

## Summary

Analyzed all 54 TS/TSX source files, all dependencies, and all routes. The blog codebase is well-maintained with no unused exports, orphaned components, or dead dependencies.

## Dependency Audit

| Dependency | Status | Usage |
|------------|--------|-------|
| agentation | ✅ Used | `layout.tsx`, `agentation-root.tsx` |
| mermaid | ✅ Used | `mdx.tsx`, `mermaid-fence.tsx`, `local-editor.tsx` |
| next-view-transitions | ✅ Used | 9 components (layout, pages, navigation) |
| @mdx-js/mdx + @mdx-js/react | ✅ Used | MDX rendering pipeline |
| prism-react-renderer | ✅ Used | Code block syntax highlighting |
| @tailwindcss/typography | ✅ Used | Prose styling for blog content |

All production and dev dependencies are actively imported.

## Route Audit

| Route | Status |
|-------|--------|
| `/` (home) | ✅ Active |
| `/blog` | ✅ Active |
| `/blog/[slug]` | ✅ Active |
| `/tags` | ✅ Active |
| `/tags/[slug]` | ✅ Active |
| `/search` | ✅ Active |
| `/mdx-editor` | ⚙️ Dev-only (gated by `NODE_ENV`) |
| `/og-preview` | ⚙️ Dev tool for OG image preview |

The `mdx-editor` and `og-preview` routes are development tools, not dead code. `mdx-editor` returns 404 in production via `notFound()` guard.

## File Audit

| File | Status |
|------|--------|
| `src/app/global-error.tsx` | ✅ Next.js convention file (auto-loaded) |
| `src/types/filesystem-access.d.ts` | ✅ Ambient type declaration |
| `src/lib/mdx.test.ts` | ✅ Vitest test file |
| `src/lib/posts.test.ts` | ✅ Vitest test file |
| `website-checklist.md` | ℹ️ Project documentation, not source code |

No files found with zero importers that aren't convention/test/ambient files.

## Recommendations

1. **website-checklist.md** can be revisited for removal only when it is no longer actively used. Low priority - it is documentation and not shipped in the build output.
2. `og-preview` now has `robots: { index: false, follow: false }` metadata, matching the intended dev-only/noindex behavior.
3. No other actionable items - the codebase is clean.
