import { describe, expect, it } from "vitest";
import { parseEditablePost } from "@/lib/post-parser";
import { getAdjacentPosts, slugifyTag } from "@/lib/posts";
import { getFontStyleSheet, getThemeStyle } from "@/lib/mdx";
import type { PostSummary } from "@/types/post";

const source = `---
title: "Test Post"
date: "2026-03-16"
excerpt: "Example excerpt"
tags:
  - Reverse Engineering
  - Notes
published: true
theme:
  colors:
    accent: "#ff00aa"
  fonts:
    mono:
      family: "Spline Sans Mono"
      source: "google"
      value: "Spline+Sans+Mono:wght@400;700"
---

## Hello

World
`;

describe("post parsing", () => {
  it("merges defaults with frontmatter overrides", () => {
    const parsed = parseEditablePost(source);

    expect(parsed.frontmatter.title).toBe("Test Post");
    expect(parsed.theme.colors.accent).toBe("#ff00aa");
    expect(parsed.theme.colors.background).toBe("#1e1e1e");
    expect(parsed.theme.fonts.mono.family).toBe("Spline Sans Mono");
  });

  it("slugifies tags for routes", () => {
    expect(slugifyTag("Reverse Engineering")).toBe("reverse-engineering");
  });

  it("builds font stylesheets for google fonts", () => {
    const parsed = parseEditablePost(source);
    const css = getFontStyleSheet(parsed.theme);

    expect(css).toContain("fonts.googleapis.com");
    expect(css).toContain("Spline+Sans+Mono");
  });

  it("exposes post theme CSS variables", () => {
    const parsed = parseEditablePost(source);
    const style = getThemeStyle(parsed.theme);
    const cssVars = style as Record<"--post-accent" | "--font-post-mono", string>;

    expect(cssVars["--post-accent"]).toBe("#ff00aa");
    expect(cssVars["--font-post-mono"]).toContain("Spline Sans Mono");
  });

  it("returns no adjacent posts when slug is missing", () => {
    const posts: PostSummary[] = [
      {
        slug: "alpha",
        title: "Alpha",
        excerpt: "A",
        date: "Apr 1, 2026",
        datetime: "2026-04-01",
        tags: [],
      },
      {
        slug: "beta",
        title: "Beta",
        excerpt: "B",
        date: "Apr 2, 2026",
        datetime: "2026-04-02",
        tags: [],
      },
    ];

    expect(getAdjacentPosts(posts, "missing")).toEqual({
      previous: null,
      next: null,
    });
  });
});
