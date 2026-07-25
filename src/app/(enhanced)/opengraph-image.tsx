import { ImageResponse } from "next/og";
import { promises as fs } from "node:fs";
import path from "node:path";
import { ogLayout } from "@/lib/og";

export const runtime = "nodejs";

export const size = {
  width: ogLayout.width,
  height: ogLayout.height,
};

function tintSvg(svg: string, color: string) {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/i, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/#000000/gi, color)
    .replace(/#000\b/gi, color)
    .replace(/\bblack\b/gi, color);
}

function cropScytheSvg(svg: string) {
  return svg.replace(/viewBox="[^"]*"/i, 'viewBox="600 120 6938 2788"');
}

function svgToDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default async function Image() {
  const [fontData, logoSvg, scytheSvg] = await Promise.all([
    fs.readFile(path.join(process.cwd(), "public", "fonts", "space-grotesk-400.ttf")),
    fs.readFile(path.join(process.cwd(), "public", "brand", "logo.svg"), "utf8"),
    fs.readFile(path.join(process.cwd(), "public", "brand", "scythe.svg"), "utf8"),
  ]);

  // Matches the blog-post OG generator (blog/[slug]/opengraph-image.tsx).
  // Note: this is a frame *dimension* multiplier, NOT the CSS scale transform
  // used by the /og-preview dev tool (DEFAULT_SCYTHE_SCALE in og.tsx).
  const scytheScale = 0.65;
  const scytheViewBox = { width: 8276, height: 3015 };
  const scale = Math.max(
    ogLayout.rightPanelWidth / scytheViewBox.height,
    ogLayout.height / scytheViewBox.width,
  ) * scytheScale;
  const scytheFrame = {
    width: scytheViewBox.width * scale,
    height: scytheViewBox.height * scale,
  };

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: ogLayout.width,
          height: ogLayout.height,
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#1e1e1e",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            inset: 0,
            width: ogLayout.leftPanelWidth,
            height: ogLayout.height,
            backgroundColor: "#1e1e1e",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: ogLayout.leftPanelWidth,
            width: ogLayout.rightPanelWidth,
            height: ogLayout.height,
            backgroundColor: "#2a2a2a",
            overflow: "visible",
          }}
        >
          <img
            src={svgToDataUri(tintSvg(cropScytheSvg(scytheSvg), "#6366f1"))}
            alt=""
            width={scytheFrame.width}
            height={scytheFrame.height}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: scytheFrame.width,
              height: scytheFrame.height,
              transform: "translate(-50%, -50%) rotate(-100deg)",
              transformOrigin: "center",
              zIndex: 2,
            }}
          />
        </div>
        <img
          src={svgToDataUri(tintSvg(logoSvg, "#a1a1aa"))}
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
            color: "#e4e4e7",
            fontFamily: "Space Grotesk",
            fontWeight: 400,
            fontSize: 112,
            lineHeight: 1.02,
            letterSpacing: "-0.05em",
          }}
        >
          {"micr.dev"}
        </h1>
        <p
          style={{
            display: "flex",
            position: "absolute",
            left: ogLayout.title.left,
            top: 420,
            width: ogLayout.title.width,
            margin: 0,
            color: "#71717a",
            fontFamily: "Space Grotesk",
            fontWeight: 300,
            fontSize: 28,
            letterSpacing: "-0.02em",
          }}
        >
          {"Writeups, notes, and experiments."}
        </p>
      </div>
    ),
    {
      width: ogLayout.width,
      height: ogLayout.height,
      fonts: [
        {
          name: "Space Grotesk",
          data: fontData,
          style: "normal" as const,
          weight: 400,
        },
      ],
    }
  );
}
