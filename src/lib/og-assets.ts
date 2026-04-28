import "server-only";
import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { OgPreviewTheme } from "@/lib/og";

/** Absolute file-system paths to source SVG assets used in OG composition. */
const BRAND_ASSET_PATHS = {
  logo: path.join(process.cwd(), "public", "brand", "logo.svg"),
  scythe: path.join(process.cwd(), "public", "brand", "scythe.svg"),
} as const;

/** Cropped scythe viewBox that isolates the detail used in OG previews. */
const SCYTHE_CROP_VIEWBOX = "600 120 6938 2788";

/** Read and cache a brand SVG asset (logo or scythe) from disk. */
const readBrandSvg = cache(async (asset: keyof typeof BRAND_ASSET_PATHS) => {
  return fs.readFile(BRAND_ASSET_PATHS[asset], "utf8");
});

/**
 * Replace all black fills/strokes in an SVG with the given color.
 * Also strips XML declaration and DOCTYPE for inline embedding.
 */
function tintSvg(svg: string, color: string) {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/i, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/#000000/gi, color)
    .replace(/#000\b/gi, color)
    .replace(/\bblack\b/gi, color);
}

/** Crop the scythe SVG to the detailed region via viewBox override. */
function cropScytheSvg(svg: string) {
  return svg.replace(/viewBox="[^"]*"/i, `viewBox="${SCYTHE_CROP_VIEWBOX}"`);
}

/** Encode an SVG string as a UTF-8 data URI for use in CSS/HTML. */
function svgToDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Load brand SVG assets (logo + scythe), tint them to match the
 * given OG preview theme, and return them as data URIs.
 */
export async function getOgBrandAssetUris(theme: OgPreviewTheme) {
  const [logoSvg, scytheSvg] = await Promise.all([
    readBrandSvg("logo"),
    readBrandSvg("scythe"),
  ]);

  return {
    logo: svgToDataUri(tintSvg(logoSvg, theme.logo)),
    scythe: svgToDataUri(tintSvg(cropScytheSvg(scytheSvg), theme.scythe)),
  };
}
