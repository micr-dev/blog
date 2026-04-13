import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlainLayout } from "@/components/plain-layout";
import { PostShell } from "@/components/post-shell";
import { buildShareHref } from "@/lib/share-links";
import {
  getAdjacentPosts,
  getAllPostSlugs,
  getPostBySlug,
  getPostSummaries,
  slugifyTag,
} from "@/lib/posts";
import { getRenderedPostContent } from "@/lib/rendered-post";
import { siteConfig } from "@/lib/site-config";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} (Read)`,
    description: post.excerpt,
    alternates: {
      canonical: `https://${siteConfig.domain}/read/${post.slug}`,
    },
  };
}

export default async function ReadPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, summaries] = await Promise.all([
    getPostBySlug(slug),
    getPostSummaries(),
  ]);

  if (!post) {
    notFound();
  }

  const article = await getRenderedPostContent(slug, {
    clientSafeCodeBlocks: true,
  });
  const adjacent = getAdjacentPosts(summaries, slug);
  const canonicalUrl = `https://${siteConfig.domain}/blog/${post.slug}`;

  return (
    <PostShell theme={post.theme}>
      <PlainLayout>
        <article className="pb-16 pt-6">
          <header className="border-b border-[color:var(--post-border)] pb-8">
            <div className="space-y-3">
              <time
                dateTime={post.datetime}
                className="block text-sm text-[color:var(--post-muted)]"
              >
                {post.date}
              </time>
              <h1
                className="text-4xl leading-tight text-[color:var(--post-heading)] sm:text-5xl"
                style={{
                  fontFamily: "var(--font-post-heading)",
                  fontWeight: 320,
                }}
              >
                {post.title}
              </h1>
              <p className="max-w-2xl text-[color:var(--post-muted)]">
                {post.excerpt}
              </p>
            </div>
          </header>

          <div className="post-body prose prose-invert max-w-none py-10">
            {article}
          </div>

          <footer className="space-y-8 border-t border-[color:var(--post-border)] pt-10 text-sm">
            <div className="space-y-3">
              <h2 className="uppercase tracking-wide text-[color:var(--post-muted)]">
                Tags
              </h2>
              <div className="flex flex-wrap gap-3 text-[color:var(--post-accent)]">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/read/tags/${slugifyTag(tag)}`}>
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="uppercase tracking-wide text-[color:var(--post-muted)]">
                Share
              </h2>
              <div className="flex flex-wrap gap-4 text-[color:var(--post-accent)]">
                <a
                  href={buildShareHref("x", post.title, canonicalUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  X
                </a>
                <a
                  href={buildShareHref("bluesky", post.title, canonicalUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Bluesky
                </a>
                <a
                  href={buildShareHref("linkedin", post.title, canonicalUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <div className="flex justify-between gap-6">
              {adjacent.previous ? (
                <div>
                  <h2 className="uppercase tracking-wide text-[color:var(--post-muted)]">
                    Previous
                  </h2>
                  <Link
                    href={`/read/${adjacent.previous.slug}`}
                    className="text-[color:var(--post-accent)]"
                  >
                    {adjacent.previous.title}
                  </Link>
                </div>
              ) : (
                <div />
              )}

              {adjacent.next ? (
                <div className="text-right">
                  <h2 className="uppercase tracking-wide text-[color:var(--post-muted)]">
                    Next
                  </h2>
                  <Link
                    href={`/read/${adjacent.next.slug}`}
                    className="text-[color:var(--post-accent)]"
                  >
                    {adjacent.next.title}
                  </Link>
                </div>
              ) : (
                <div />
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-[color:var(--post-accent)]">
              <Link href="/read">Back to read</Link>
              <Link href={`/blog/${post.slug}`}>Open enhanced version</Link>
            </div>
          </footer>
        </article>
      </PlainLayout>
    </PostShell>
  );
}
