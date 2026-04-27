import { getFontStyleSheet } from "@/lib/mdx";
import {
  getOgPreviewTheme,
  type OgPreviewTheme,
} from "@/lib/og";
import { getOgBrandAssetUris } from "@/lib/og-assets";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { PreviewControls } from "@/app/og-preview/preview-controls";
import {
  previewGalleryTitle,
  previewThemePresets,
} from "@/app/og-preview/preview-presets";

export const metadata = {
  title: "OG Preview",
};

async function getPreviewPosts() {
  const slugs = await getAllPostSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPostBySlug(slug)));

  return posts.filter((post) => post !== null);
}

async function getThemeAssets(theme: OgPreviewTheme) {
  return getOgBrandAssetUris(theme);
}

function getThemeKey(theme: OgPreviewTheme) {
  return JSON.stringify(theme);
}

export default async function OgPreviewPage() {
  const posts = await getPreviewPosts();
  const fontCss = [...new Set(posts.map((post) => getFontStyleSheet(post.theme)).filter(Boolean))].join("\n");
  const uniquePosts = [...new Map(
    posts.map((post) => {
      const theme = getOgPreviewTheme(post.theme);
      return [getThemeKey(theme), { post, theme }] as const;
    }),
  ).values()];
  const liveCards = await Promise.all(
    uniquePosts.map(async ({ post, theme }) => ({
      id: `live-${post.slug}`,
      label: `/blog/${post.slug}`,
      title: post.title,
      note: "Actual post theme",
      theme,
      assets: await getThemeAssets(theme),
    })),
  );
  const presetCards = await Promise.all(
    previewThemePresets.map(async (preset) => ({
      id: preset.id,
      label: `preset/${preset.id}`,
      title: previewGalleryTitle,
      note: preset.name,
      theme: preset.theme,
      assets: await getThemeAssets(preset.theme),
    })),
  );
  const cards = [...liveCards, ...presetCards];

  return (
    <main className="min-h-screen bg-[#09090b] px-6 py-10 text-zinc-100">
      {fontCss ? <style>{fontCss}</style> : null}

      <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Internal OG review route
          </p>
          <h1 className="text-3xl font-semibold text-zinc-100">
            Per-post OG composition preview
          </h1>
          <p className="max-w-3xl text-sm text-zinc-400">
            One card per theme. Actual post themes are deduped, presets use one shared title, and the previews are scaled down into a compact gallery.
          </p>
        </header>

        <PreviewControls cards={cards} />
      </div>
    </main>
  );
}
