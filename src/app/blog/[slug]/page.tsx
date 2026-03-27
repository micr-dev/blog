import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { Layout } from "@/components/layout";
import { PostShell } from "@/components/post-shell";
import { getAdjacentPosts, getAllPostSlugs, getPostBySlug, getPostSummaries, slugifyTag } from "@/lib/posts";
import { getRenderedPostContent } from "@/lib/rendered-post";

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

  return (
    <PostShell theme={post.theme}>
      <Layout>
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
                </div>
              </div>
            </header>

            <div className="divide-y divide-[color:var(--post-border)] pb-8">
              <div className="post-body prose prose-invert max-w-none pb-8 pt-10">
                {article}
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
      </Layout>
    </PostShell>
  );
}
