import githubDark from "@shikijs/themes/github-dark";
import { codeToHtml } from "shiki";
import type { PostTheme } from "@/types/post";

function normalizeLanguage(language: string) {
  const normalized = language.toLowerCase();

  if (normalized === "plaintext" || normalized === "plain") {
    return "text";
  }

  if (normalized === "shell" || normalized === "console") {
    return "bash";
  }

  if (normalized === "mdx") {
    return "md";
  }

  return normalized || "text";
}

export async function CodeFence({
  code,
  language,
  theme,
}: {
  code: string;
  language: string;
  theme: PostTheme;
}) {
  const normalizedLanguage = normalizeLanguage(language);
  let html: string | null = null;

  try {
    html = await codeToHtml(code, {
      lang: normalizedLanguage,
      theme: createCodeTheme(theme),
    });
  } catch {
    html = null;
  }

  if (!html) {
    return (
      <pre
        className="astro-code github-dark post-scroll my-6 overflow-x-auto"
        style={{
          backgroundColor: theme.colors.codeBackground,
          color: theme.colors.codeForeground,
        }}
        tabIndex={0}
      >
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      className="post-scroll my-6 overflow-x-auto"
      dangerouslySetInnerHTML={{
        __html: html.replace(/class="shiki ([^"]+)"/, 'class="astro-code $1"'),
      }}
    />
  );
}

function createCodeTheme(theme: PostTheme): typeof githubDark {
  const accentSoft = mixHex(theme.colors.accent, theme.colors.codeForeground, 0.25);
  const accentWarm = mixHex(theme.colors.accent, "#ffb86b", 0.4);
  const accentCool = mixHex(theme.colors.accent, theme.colors.codeForeground, 0.55);
  const surface = mixHex(theme.colors.codeBackground, theme.colors.background, 0.5);
  const tokenColors = githubDark.tokenColors ?? [];

  const replacements = new Map<string, string>([
    ["#24292e", theme.colors.codeBackground],
    ["#2f363d", surface],
    ["#1f2428", mixHex(theme.colors.codeBackground, theme.colors.background, 0.72)],
    ["#e1e4e8", theme.colors.codeForeground],
    ["#d1d5da", mixHex(theme.colors.codeForeground, theme.colors.body, 0.45)],
    ["#6a737d", theme.colors.muted],
    ["#79b8ff", theme.colors.accent],
    ["#b392f0", accentSoft],
    ["#f97583", accentWarm],
    ["#9ecbff", accentCool],
    ["#ffab70", accentWarm],
    ["#85e89d", accentSoft],
    ["#dbedff", accentCool],
  ]);

  return {
    ...githubDark,
    name: `${githubDark.name}-${theme.colors.accent.replace(/[^a-z0-9]+/gi, "")}`,
    type: githubDark.type,
    colors: replaceThemeColors(
      githubDark.colors as Record<string, string>,
      replacements,
    ) as typeof githubDark.colors,
    tokenColors: tokenColors.map((entry) => ({
      ...entry,
      settings: replaceThemeColors(
        (entry.settings ?? {}) as Record<string, string>,
        replacements,
      ) as typeof entry.settings,
    })),
  };
}

function replaceThemeColors(
  source: Record<string, string>,
  replacements: Map<string, string>,
) {
  return Object.fromEntries(
    Object.entries(source).map(([key, value]) => {
      const replacement = replacements.get(value.toLowerCase());
      return [key, replacement ?? value];
    }),
  );
}

function mixHex(primary: string, secondary: string, secondaryWeight: number) {
  const primaryRgb = toRgb(primary);
  const secondaryRgb = toRgb(secondary);

  if (!primaryRgb || !secondaryRgb) {
    return primary;
  }

  const primaryWeight = 1 - secondaryWeight;
  const [red, green, blue] = primaryRgb.map((value, index) =>
    Math.round(value * primaryWeight + secondaryRgb[index] * secondaryWeight),
  );

  return `#${[red, green, blue].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function toRgb(value: string) {
  const normalized = value.trim().replace(/^#/, "");

  if (normalized.length !== 3 && normalized.length !== 6) {
    return null;
  }

  const expanded = normalized.length === 3
    ? normalized
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
    : normalized;

  const channels = expanded.match(/.{1,2}/g);

  if (!channels) {
    return null;
  }

  return channels.map((channel) => Number.parseInt(channel, 16));
}
