import type { CSSProperties } from "react";
import { postHeadingStyle } from "@/lib/post-heading";
import type { PostTheme } from "@/types/post";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const LEFT_PANEL_RATIO = 0.6727;
const RIGHT_PANEL_RATIO = 0.3273;

const SCYTHE_VIEWBOX = {
  width: 8276,
  height: 3015,
} as const;

export const DEFAULT_TITLE_SCALE = 0.75;
export const DEFAULT_SCYTHE_SCALE = 1.51;
export const DEFAULT_SCYTHE_ROTATION = -100;

const titleStyleByLength = [
  { maxLength: 34, fontSize: 112 },
  { maxLength: 52, fontSize: 98 },
  { maxLength: 72, fontSize: 86 },
  { maxLength: 96, fontSize: 76 },
  { maxLength: Number.POSITIVE_INFINITY, fontSize: 68 },
] as const;

export const ogLayout = {
  width: OG_WIDTH,
  height: OG_HEIGHT,
  leftPanelWidth: OG_WIDTH * LEFT_PANEL_RATIO,
  rightPanelWidth: OG_WIDTH * RIGHT_PANEL_RATIO,
  logo: {
    left: 78,
    top: 88,
    width: 60,
    height: 55,
  },
  title: {
    left: 59,
    top: 250,
    width: 674,
  },
} as const;

export interface OgPreviewTheme {
  leftPanel: string;
  rightPanel: string;
  logo: string;
  title: string;
  scythe: string;
  fontFamily: string;
}

export function getOgPreviewTheme(theme: PostTheme): OgPreviewTheme {
  return {
    leftPanel: theme.colors.background,
    rightPanel: theme.colors.codeBackground,
    logo: theme.colors.body,
    title: theme.colors.heading,
    scythe: theme.colors.accent,
    fontFamily: theme.fonts.heading.family,
  };
}

export function getOgTitleStyle(title: string, titleScale = DEFAULT_TITLE_SCALE): CSSProperties {
  const baseFontSize = titleStyleByLength.find((entry) => title.length <= entry.maxLength)?.fontSize ?? 68;
  const fontSize = Math.round(baseFontSize * titleScale);

  return {
    position: "absolute",
    left: ogLayout.title.left,
    top: ogLayout.title.top,
    width: ogLayout.title.width,
    margin: 0,
    color: "inherit",
    fontFamily: "inherit",
    fontSize,
    fontWeight: postHeadingStyle.fontWeight,
    lineHeight: "calc(0.99em + 3px)",
    letterSpacing: "-0.05em",
    whiteSpace: "pre-wrap",
  };
}

export function getScytheFrame(scytheScale: number) {
  const scale = Math.max(
    ogLayout.rightPanelWidth / SCYTHE_VIEWBOX.height,
    ogLayout.height / SCYTHE_VIEWBOX.width,
  ) * scytheScale;

  return {
    width: SCYTHE_VIEWBOX.width * scale,
    height: SCYTHE_VIEWBOX.height * scale,
  };
}
