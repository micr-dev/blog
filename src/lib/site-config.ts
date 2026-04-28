import type { PostTheme } from "@/types/post";

/** Canonical site metadata and nav labels consumed by layouts and SEO helpers. */
export const siteConfig = {
  name: "micr.dev",
  author: "Microck",
  domain: "blog.micr.dev",
  description: "Writeups, notes, and experiments.",
  tagline: "writeups, notes, and experiments",
  footerMotto: "hack the planet~",
  navLinks: [
    { href: "/blog", label: "Blog" },
    { href: "/tags", label: "Tags" },
    { href: "/search", label: "Search" },
  ],
} as const;

/** Default theme applied to posts that do not provide per-post theme overrides. */
export const defaultPostTheme: PostTheme = {
  colors: {
    background: "#1e1e1e",
    body: "#f3f4f6",
    heading: "#f3f4f6",
    accent: "#f582db",
    muted: "#a1a1aa",
    border: "#27272a",
    codeBackground: "#141414",
    codeForeground: "#e2e8f0",
  },
  fonts: {
    body: {
      family: "Space Grotesk",
      source: "google",
      value: "Space+Grotesk:wght@300;400;500;700",
    },
    heading: {
      family: "Space Grotesk",
      source: "google",
      value: "Space+Grotesk:wght@300;400;500;700",
    },
    mono: {
      family: "JetBrains Mono",
      source: "google",
      value: "JetBrains+Mono:wght@400;500;700",
    },
  },
};
