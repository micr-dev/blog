import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { Layout } from "@/components/layout";
import { PlainVersionCallout } from "@/components/plain-version-callout";
import { PostProgressRail } from "@/components/post-progress-rail";
import { PostShareButton } from "@/components/post-share-button";
import { PostSignature } from "@/components/post-signature";
import { PostShell } from "@/components/post-shell";
import { siteConfig } from "@/lib/site-config";
import { getAdjacentPosts, getAllPostSlugs, getPostBySlug, getPostSummaries, slugifyTag } from "@/lib/posts";
import { getRenderedPostContent } from "@/lib/rendered-post";

export const dynamicParams = false;
const OG_IMAGE_VERSION = "20260328-1";

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
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://blog.micr.dev/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://blog.micr.dev/blog/${post.slug}`,
      type: "article",
      images: [
        {
          url: `/blog/${post.slug}/opengraph-image?v=${OG_IMAGE_VERSION}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function BlogPostPage({
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

  const article = await getRenderedPostContent(slug);
  const adjacent = getAdjacentPosts(summaries, slug);
  const canonicalUrl = `https://${siteConfig.domain}/blog/${post.slug}`;

  return (
    <PostShell theme={post.theme}>
      <Layout>
        <PostProgressRail>
          <article>
            <div className="xl:divide-y xl:divide-[color:var(--post-border)]">
              <header className="pt-6 xl:pb-6">
                <div className="space-y-1 text-center">
                  <dl className="space-y-10">
                    <div>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-[color:var(--post-muted)]">
                        <time dateTime={post.datetime}>{post.date}</time>
                      </dd>
                    </div>
                  </dl>
                  <div>
                    <h1
                      className="text-3xl leading-[1.1] tracking-normal text-[color:var(--post-heading)] sm:text-4xl md:text-5xl"
                      style={{
                        fontFamily: "var(--font-post-heading)",
                        fontWeight: 320,
                      }}
                    >
                      {post.title}
                    </h1>
                    <div className="mt-4 flex justify-center">
                      <PlainVersionCallout
                        href={`/read/${post.slug}`}
                        compact
                      />
                    </div>
                  </div>
                </div>
              </header>

              <div className="divide-y divide-[color:var(--post-border)] pb-8">
                <div className="post-body prose prose-invert max-w-none pb-8 pt-10">
                  {article}
                  <PostSignature name={siteConfig.author} />
                </div>

                <footer className="pt-10">
                  <div className="space-y-8 text-sm font-medium leading-5">
                    <div className="space-y-3">
                      <h2 className="text-xs uppercase tracking-wide text-[color:var(--post-muted)]">
                        Tags
                      </h2>
                      <div className="flex flex-wrap">
                        {post.tags.map((tag) => (
                          <Link
                            key={tag}
                            href={`/tags/${slugifyTag(tag)}`}
                            className="mr-3 text-sm font-medium uppercase text-[color:var(--post-accent)] transition-colors hover:opacity-80"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-xs uppercase tracking-wide text-[color:var(--post-muted)]">
                        Share
                      </h2>
                      <PostShareButton title={post.title} url={canonicalUrl} />
                    </div>

                    <div className="space-y-3">
                      <a
                        href="https://ko-fi.com/microck"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-[color:var(--post-muted)] transition-opacity hover:opacity-80"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <title>Ko-fi</title>
                          <path
                            fill="currentColor"
                            d="M11.351 2.715c-2.7 0-4.986.025-6.83.26C2.078 3.285 0 5.154 0 8.61c0 3.506.182 6.13 1.585 8.493 1.584 2.701 4.233 4.182 7.662 4.182h.83c4.209 0 6.494-2.234 7.637-4a9.5 9.5 0 0 0 1.091-2.338C21.792 14.688 24 12.22 24 9.208v-.415c0-3.247-2.13-5.507-5.792-5.87-1.558-.156-2.65-.208-6.857-.208m0 1.947c4.208 0 5.09.052 6.571.182 2.624.311 4.13 1.584 4.13 4v.39c0 2.156-1.792 3.844-3.87 3.844h-.935l-.156.649c-.208 1.013-.597 1.818-1.039 2.546-.909 1.428-2.545 3.064-5.922 3.064h-.805c-2.571 0-4.831-.883-6.078-3.195-1.09-2-1.298-4.155-1.298-7.506 0-2.181.857-3.402 3.012-3.714 1.533-.233 3.559-.26 6.39-.26m6.547 2.287c-.416 0-.65.234-.65.546v2.935c0 .311.234.545.65.545 1.324 0 2.051-.754 2.051-2s-.727-2.026-2.052-2.026m-10.39.182c-1.818 0-3.013 1.48-3.013 3.142 0 1.533.858 2.857 1.949 3.897.727.701 1.87 1.429 2.649 1.896a1.47 1.47 0 0 0 1.507 0c.78-.467 1.922-1.195 2.623-1.896 1.117-1.039 1.974-2.364 1.974-3.897 0-1.662-1.247-3.142-3.039-3.142-1.065 0-1.792.545-2.338 1.298-.493-.753-1.246-1.298-2.312-1.298"
                          />
                        </svg>
                        <span>Support me on Ko-fi</span>
                      </a>
                    </div>

                    <div className="flex justify-between gap-6">
                      {adjacent.previous ? (
                        <div>
                          <h2 className="text-xs uppercase tracking-wide text-[color:var(--post-muted)]">
                            Previous Article
                          </h2>
                          <div className="text-[color:var(--post-accent)]">
                            <Link href={`/blog/${adjacent.previous.slug}`}>
                              {adjacent.previous.title}
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div />
                      )}
                      {adjacent.next ? (
                        <div className="text-right">
                          <h2 className="text-xs uppercase tracking-wide text-[color:var(--post-muted)]">
                            Next Article
                          </h2>
                          <div className="text-[color:var(--post-accent)]">
                            <Link href={`/blog/${adjacent.next.slug}`}>
                              {adjacent.next.title}
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>

                    <div>
                      <Link
                        href="/blog"
                        className="text-[color:var(--post-accent)] transition-colors hover:opacity-80"
                      >
                        ← Back to the blog
                      </Link>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          </article>
        </PostProgressRail>
      </Layout>
    </PostShell>
  );
}
