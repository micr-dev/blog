import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { Layout } from "@/components/layout";
import { PostProgressRail } from "@/components/post-progress-rail";
import { PostShareButton } from "@/components/post-share-button";
import { PostSignature } from "@/components/post-signature";
import { PostShell } from "@/components/post-shell";
import {
  getLocalizedPostParams,
  getPostBySlug,
  slugifyTag,
} from "@/lib/posts";
import { getRenderedPostContent } from "@/lib/rendered-post";
import { siteConfig } from "@/lib/site-config";

export const dynamicParams = false;

const SPANISH_DATE_FORMATTER = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export async function generateStaticParams() {
  return getLocalizedPostParams();
}

function localizedSlug(slug: string, locale: string) {
  return `${slug}.${locale}`;
}

function formatSpanishTag(tag: string) {
  const labels: Record<string, string> = {
    ai: "IA",
    reflections: "Reflexiones",
  };

  return labels[tag.toLowerCase()] ?? tag;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getPostBySlug(localizedSlug(slug, locale));

  if (!post) {
    return {};
  }

  const canonical = `https://${siteConfig.domain}/blog/${slug}/${locale}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonical,
      type: "article",
    },
  };
}

export default async function LocalizedBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const postSlug = localizedSlug(slug, locale);
  const post = await getPostBySlug(postSlug);

  if (!post) {
    notFound();
  }

  const article = await getRenderedPostContent(postSlug);
  const canonicalUrl = `https://${siteConfig.domain}/blog/${slug}/${locale}`;
  const displayDate = SPANISH_DATE_FORMATTER.format(
    new Date(`${post.datetime}T00:00:00.000Z`),
  );

  return (
    <PostShell
      theme={post.theme}
      slug={post.slug}
      aiDetection={post.aiDetection}
    >
      <Layout>
        <PostProgressRail>
          <article>
            <div className="xl:divide-y xl:divide-[color:var(--post-border)]">
              <header className="pt-6 xl:pb-6">
                <div className="space-y-1 text-center">
                  <dl className="space-y-10">
                    <div>
                      <dt className="sr-only">Publicado el</dt>
                      <dd className="text-base font-medium leading-6 text-[color:var(--post-muted)]">
                        <time dateTime={post.datetime}>{displayDate}</time>
                      </dd>
                    </div>
                  </dl>
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
                        Etiquetas
                      </h2>
                      <div className="flex flex-wrap">
                        {post.tags.map((tag) => (
                          <Link
                            key={tag}
                            href={`/tags/${slugifyTag(tag)}`}
                            className="mr-3 text-sm font-medium uppercase text-[color:var(--post-accent)] transition-colors hover:opacity-80"
                          >
                            {formatSpanishTag(tag)}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-xs uppercase tracking-wide text-[color:var(--post-muted)]">
                        Compartir
                      </h2>
                      <PostShareButton title={post.title} url={canonicalUrl} />
                    </div>

                    <div>
                      <Link
                        href={`/blog/${slug}`}
                        className="text-[color:var(--post-accent)] transition-colors hover:opacity-80"
                      >
                        Leer la versión original en inglés
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
