import Link from "next/link";
import type { PostSummary } from "@/types/post";
import { slugifyTag } from "@/lib/posts";

export function PlainPostList({
  posts,
  postHrefBase = "/read",
  tagHrefBase = "/read/tags",
}: {
  posts: PostSummary[];
  postHrefBase?: string;
  tagHrefBase?: string;
}) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-[color:var(--border)] p-6 text-[color:var(--muted)]">
        No published posts yet.
      </div>
    );
  }

  return (
    <ul className="space-y-10">
      {posts.map((post) => (
        <li
          key={post.slug}
          className="border-b border-[color:var(--border)] pb-10 last:border-b-0"
        >
          <article className="space-y-3">
            <time
              dateTime={post.datetime}
              className="block text-sm text-[color:var(--muted)]"
            >
              {post.date}
            </time>
            <h2 className="text-2xl font-semibold leading-tight text-[color:var(--foreground)]">
              <Link href={`${postHrefBase}/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="max-w-2xl text-[color:var(--muted)]">{post.excerpt}</p>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-[color:var(--accent)]">
              {post.tags.map((tag) => (
                <Link
                  key={`${post.slug}-${tag}`}
                  href={`${tagHrefBase}/${slugifyTag(tag)}`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
