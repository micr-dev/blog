import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Layout } from "@/components/layout";
import { PostList } from "@/components/post-list";
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
    title: `${tag.name} posts`,
    description: `Posts tagged ${tag.name}`,
    alternates: {
      canonical: `https://${siteConfig.domain}/tags/${tag.slug}`,
    },
  };
}

export default async function TagPage({
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
    <Layout>
      <div className="pb-6 pt-6">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-[color:var(--foreground)] sm:text-4xl md:text-6xl">
          {tag.name}
        </h1>
        <p className="mt-4 text-[color:var(--muted)]">
          {tag.count} published post{tag.count === 1 ? "" : "s"}
        </p>
      </div>

      <PostList posts={posts} />
    </Layout>
  );
}
