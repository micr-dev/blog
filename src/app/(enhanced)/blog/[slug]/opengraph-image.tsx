import { ImageResponse } from "next/og";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import {
  DEFAULT_SCYTHE_ROTATION,
  DEFAULT_TITLE_SCALE,
  getOgPreviewTheme,
  getOgTitleStyle,
  getScytheFrame,
  ogLayout,
} from "@/lib/og";
import { getOgBrandAssetUris } from "@/lib/og-assets";
import type { FontDefinition } from "@/types/post";

const OG_SCYTHE_SCALE = 0.65;

export const dynamic = "force-static";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

async function loadOgHeadingFont(font: FontDefinition) {
  let fontPath: string | null = null;

  if (font.source === "local") {
    fontPath = font.value === "/fonts/anthropic-serif-regular.woff2"
      ? path.join(process.cwd(), "public", "fonts", "anthropic-serif-static.ttf")
      : path.join(process.cwd(), "public", font.value.replace(/^\//, ""));
  } else if (font.source === "google" && font.family === "Space Grotesk") {
    fontPath = path.join(process.cwd(), "public", "fonts", "space-grotesk-400.ttf");
  }

  if (!fontPath) {
    return null;
  }

  return fs.readFile(fontPath);
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "#1a1a1a", color: "#fff" }}>Not found</div>,
      { width: 1200, height: 630 }
    );
  }

  const theme = getOgPreviewTheme(post.theme);
  const headingFont = post.theme.fonts.heading;
  const [fontData, brandAssets] = await Promise.all([
    loadOgHeadingFont(headingFont),
    getOgBrandAssetUris(theme),
  ]);

  const titleStyle = getOgTitleStyle(post.title, DEFAULT_TITLE_SCALE);
  const titleFontSize = typeof titleStyle.fontSize === "number" ? titleStyle.fontSize : 72;
  const scytheFrame = getScytheFrame(OG_SCYTHE_SCALE);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: ogLayout.width,
          height: ogLayout.height,
          position: "relative",
          overflow: "hidden",
          backgroundColor: theme.leftPanel,
          fontFamily: headingFont.family,
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            inset: 0,
            width: ogLayout.leftPanelWidth,
            height: ogLayout.height,
            backgroundColor: theme.leftPanel,
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: ogLayout.leftPanelWidth,
            width: ogLayout.rightPanelWidth,
            height: ogLayout.height,
            backgroundColor: theme.rightPanel,
            overflow: "visible",
          }}
        >
          <img
            src={brandAssets.scythe}
            alt=""
            width={scytheFrame.width}
            height={scytheFrame.height}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: scytheFrame.width,
              height: scytheFrame.height,
              transform: `translate(-50%, -50%) rotate(${DEFAULT_SCYTHE_ROTATION}deg)`,
              transformOrigin: "center",
              zIndex: 2,
            }}
          />
        </div>
        <img
          src={brandAssets.logo}
          alt=""
          width={ogLayout.logo.width}
          height={ogLayout.logo.height}
          style={{
            position: "absolute",
            left: ogLayout.logo.left,
            top: ogLayout.logo.top,
            width: ogLayout.logo.width,
            height: ogLayout.logo.height,
          }}
        />
        <h1
          style={{
            display: "flex",
            position: "absolute",
            left: ogLayout.title.left,
            top: ogLayout.title.top,
            width: ogLayout.title.width,
            margin: 0,
            color: theme.title,
            fontFamily: headingFont.family,
            fontWeight: 400,
            fontSize: titleFontSize,
            lineHeight: 1.02,
            letterSpacing: "-0.05em",
            whiteSpace: "pre-wrap",
          }}
        >
          {post.title}
        </h1>
      </div>
    ),
    {
      width: ogLayout.width,
      height: ogLayout.height,
      fonts: fontData ? [
        {
          name: headingFont.family,
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ] : [],
    }
  );
}
