import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlainLayout } from "@/components/plain-layout";
import { PlainPostList } from "@/components/plain-post-list";
import { getPostsByTag, getTagBySlug, getTags } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return {};
  }

  return {
    title: `${tag.name} (Read)`,
    description: `Plain reading posts tagged ${tag.name}`,
    alternates: {
      canonical: `https://${siteConfig.domain}/read/tags/${tag.slug}`,
    },
  };
}

export default async function ReadTagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tag, posts] = await Promise.all([getTagBySlug(slug), getPostsByTag(slug)]);

  if (!tag) {
    notFound();
  }

  return (
    <PlainLayout>
      <div className="space-y-8 pb-16 pt-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--foreground)]">
            {tag.name}
          </h1>
          <p className="text-[color:var(--muted)]">
            {tag.count} plain post{tag.count === 1 ? "" : "s"}
          </p>
        </div>

        <PlainPostList posts={posts} />
      </div>
    </PlainLayout>
  );
}
