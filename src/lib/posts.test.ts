import { describe, expect, it } from "vitest";
import { parseEditablePost } from "@/lib/post-parser";
import { slugifyTag } from "@/lib/posts";
import { getFontStyleSheet, getThemeStyle } from "@/lib/mdx";

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

    expect((style as Record<string, string>)["--post-accent"]).toBe("#ff00aa");
    expect((style as Record<string, string>)["--font-post-mono"]).toContain("Spline Sans Mono");
  });
});
