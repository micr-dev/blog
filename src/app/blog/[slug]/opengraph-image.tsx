import { ImageResponse } from "next/og";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import { getOgPreviewTheme, ogLayout } from "@/lib/og";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
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

  const fontSize = post.title.length > 72 ? 68 : post.title.length > 52 ? 86 : post.title.length > 34 ? 98 : 112;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: ogLayout.width,
          height: ogLayout.height,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: ogLayout.leftPanelWidth,
            height: ogLayout.height,
            backgroundColor: theme.leftPanel,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: ogLayout.leftPanelWidth,
            width: ogLayout.rightPanelWidth,
            height: ogLayout.height,
            backgroundColor: theme.rightPanel,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: ogLayout.logo.left,
            top: ogLayout.logo.top,
            width: ogLayout.logo.width,
            height: ogLayout.logo.height,
            backgroundColor: theme.logo,
            borderRadius: 4,
          }}
        />
        <h1
          style={{
            position: "absolute",
            left: ogLayout.title.left,
            top: ogLayout.title.top,
            width: ogLayout.title.width,
            margin: 0,
            color: theme.title,
            fontSize: Math.round(fontSize * 0.75),
            fontWeight: 400,
            lineHeight: 1.1,
          }}
        >
          {post.title}
        </h1>
      </div>
    ),
    {
      width: ogLayout.width,
      height: ogLayout.height,
    }
  );
}