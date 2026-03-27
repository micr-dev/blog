import Image from "next/image";
import { Link } from "next-view-transitions";
import type { PostSummary } from "@/types/post";
import { slugifyTag } from "@/lib/posts";

type PostListProps = {
  posts: PostSummary[];
  variant?: "default" | "home";
};

export function PostList({
  posts,
  variant = "default",
}: PostListProps) {
  const showMeta = variant === "default";

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 text-[color:var(--muted)]">
        No published posts yet. Add an `.mdx` file in `content/posts` to publish
        the first one.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-[color:var(--border)] border-t border-[color:var(--border)]">
      {posts.map((post) => (
        <li key={post.slug} className="py-12">
          <article>
            <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:gap-8 xl:space-y-0">
              <dl className="space-y-4">
                <dt className="sr-only">Published on</dt>
                <dd className="text-base font-medium leading-6 text-[color:var(--muted)]">
                  <time dateTime={post.datetime}>{post.date}</time>
                </dd>
                {showMeta && post.cover ? (
                  <dd>
                    <Link href={`/blog/${post.slug}`} aria-label={`Open "${post.title}"`}>
                      <div className="relative aspect-video w-full overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--card)]">
                        <Image
                          src={post.cover}
                          alt=""
                          fill
                          sizes="(min-width: 1280px) 232px, (min-width: 640px) 40vw, 100vw"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </Link>
                  </dd>
                ) : null}
              </dl>

              <div className="space-y-5 xl:col-span-3">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold leading-8 tracking-tight">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-[color:var(--foreground)] transition-opacity hover:opacity-80"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    {showMeta ? (
                      <div className="mt-2 flex flex-wrap">
                        {post.tags.map((tag) => (
                          <Link
                            key={tag}
                            href={`/tags/${slugifyTag(tag)}`}
                            className="mr-3 text-sm font-medium uppercase text-[color:var(--accent)] transition-opacity hover:opacity-80"
                            style={{ color: "var(--accent)" }}
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="max-w-none text-[color:var(--muted)]">{post.excerpt}</div>
                </div>
                {showMeta ? (
                  <div className="text-base font-medium leading-6">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-[color:var(--accent)] transition-opacity hover:opacity-80"
                      aria-label={`Read "${post.title}"`}
                      style={{ color: "var(--accent)" }}
                    >
                      Read more →
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
