import { describe, expect, it } from "vitest";
import { promises as fs } from "node:fs";
import path from "node:path";
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
aiDetection:
  verdict: "assisted"
  aiPercent: 50
  assistedPercent: 50
  segments: 1
  model: "Pangram 3.3.2"
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
    expect(parsed.frontmatter.aiDetection).toEqual({
      verdict: "assisted",
      aiPercent: 50,
      assistedPercent: 50,
      segments: 1,
      model: "Pangram 3.3.2",
    });
  });

  it("slugifies tags for routes", () => {
    expect(slugifyTag("Reverse Engineering")).toBe("reverse-engineering");
  });

  it("defaults posts to listed and allows unlisted posts", () => {
    expect(parseEditablePost(source).frontmatter.listed).toBe(true);

    const unlisted = parseEditablePost(source.replace(
      "published: true",
      "published: true\nlisted: false",
    ));

    expect(unlisted.frontmatter.listed).toBe(false);
  });

  it("rejects AI detection breakdowns that exceed 100 percent", () => {
    expect(() => parseEditablePost(source.replace(
      "assistedPercent: 50",
      "assistedPercent: 51",
    ))).toThrow();
  });

  it("defines an authorship verdict for every blog post", async () => {
    const postsDirectory = path.join(process.cwd(), "content", "posts");
    const filenames = (await fs.readdir(postsDirectory))
      .filter((filename) => filename.endsWith(".mdx"));
    const posts = await Promise.all(filenames.map(async (filename) => {
      const postSource = await fs.readFile(path.join(postsDirectory, filename), "utf8");
      return parseEditablePost(postSource);
    }));

    expect(posts).not.toHaveLength(0);
    for (const post of posts) {
      expect(post.frontmatter.aiDetection).toBeDefined();
    }
  });

  it("preserves the published Pangram analysis values", async () => {
    const expectedAnalyses = {
      "free-opus.mdx": {
        verdict: "ai",
        aiPercent: 85,
        assistedPercent: 0,
        segments: 8,
        model: "Pangram 3.3.2",
      },
      "ja3-bypass-gateway.mdx": {
        verdict: "ai",
        aiPercent: 100,
        assistedPercent: 0,
        segments: 2,
        model: "Pangram 3.3.2",
      },
      "oracle-sniper-writeup.mdx": {
        verdict: "ai",
        aiPercent: 100,
        assistedPercent: 0,
        segments: 3,
        model: "Pangram 3.3.2",
      },
    } as const;

    for (const [filename, expectedAnalysis] of Object.entries(expectedAnalyses)) {
      const postSource = await fs.readFile(
        path.join(process.cwd(), "content", "posts", filename),
        "utf8",
      );

      expect(parseEditablePost(postSource).frontmatter.aiDetection).toEqual(expectedAnalysis);
    }
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
