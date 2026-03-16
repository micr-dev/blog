export type FontSource = "google" | "local";

export interface FontDefinition {
  family: string;
  source: FontSource;
  value: string;
}

export interface PostThemeColors {
  background: string;
  foreground: string;
  accent: string;
  muted: string;
  border: string;
  codeBackground: string;
  codeForeground: string;
}

export interface PostThemeFonts {
  body: FontDefinition;
  heading: FontDefinition;
  mono: FontDefinition;
}

export interface PostTheme {
  colors: PostThemeColors;
  fonts: PostThemeFonts;
}

export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  published: boolean;
  cover?: string;
  theme?: Partial<{
    colors: Partial<PostThemeColors>;
    fonts: Partial<Record<keyof PostThemeFonts, Partial<FontDefinition>>>;
  }>;
}

export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  datetime: string;
  tags: string[];
  cover?: string;
}

export interface BlogPost extends PostSummary {
  content: string;
  theme: PostTheme;
}

export interface TagSummary {
  name: string;
  slug: string;
  count: number;
}
