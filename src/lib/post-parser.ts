import YAML from "yaml";
import { z } from "zod";
import { defaultPostTheme } from "@/lib/site-config";
import type { FontDefinition, PostFrontmatter, PostTheme } from "@/types/post";

const fontSchema = z.object({
  family: z.string().min(1),
  source: z.enum(["google", "local"]),
  value: z.string().min(1),
});

const themeSchema = z.object({
  colors: z
    .object({
      background: z.string().min(1).optional(),
      foreground: z.string().min(1).optional(),
      accent: z.string().min(1).optional(),
      muted: z.string().min(1).optional(),
      border: z.string().min(1).optional(),
      codeBackground: z.string().min(1).optional(),
      codeForeground: z.string().min(1).optional(),
    })
    .partial()
    .optional(),
  fonts: z
    .object({
      body: fontSchema.partial().optional(),
      heading: fontSchema.partial().optional(),
      mono: fontSchema.partial().optional(),
    })
    .partial()
    .optional(),
});

const frontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.string().min(1),
  excerpt: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  published: z.boolean().default(true),
  cover: z.string().min(1).optional(),
  theme: themeSchema.optional(),
});

export function parseDocument(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!match) {
    throw new Error("Post is missing YAML frontmatter.");
  }

  const frontmatter = YAML.parse(match[1]) as PostFrontmatter;
  const content = source.slice(match[0].length);

  return {
    frontmatter: frontmatterSchema.parse(frontmatter),
    content,
  };
}

function resolveFont(
  fallback: FontDefinition,
  override?: Partial<FontDefinition>,
): FontDefinition {
  return {
    family: override?.family ?? fallback.family,
    source: override?.source ?? fallback.source,
    value: override?.value ?? fallback.value,
  };
}

export function mergeTheme(frontmatter?: PostFrontmatter["theme"]): PostTheme {
  return {
    colors: {
      ...defaultPostTheme.colors,
      ...frontmatter?.colors,
    },
    fonts: {
      body: resolveFont(defaultPostTheme.fonts.body, frontmatter?.fonts?.body),
      heading: resolveFont(
        defaultPostTheme.fonts.heading,
        frontmatter?.fonts?.heading,
      ),
      mono: resolveFont(defaultPostTheme.fonts.mono, frontmatter?.fonts?.mono),
    },
  };
}

export function parseEditablePost(source: string) {
  const { frontmatter, content } = parseDocument(source);
  return {
    frontmatter,
    content,
    theme: mergeTheme(frontmatter.theme),
  };
}
