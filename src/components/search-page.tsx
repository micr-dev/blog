"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "next-view-transitions";
import type { PostSummary, TagSummary } from "@/types/post";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function matchesPost(post: PostSummary, query: string) {
  const haystack = [
    post.title,
    post.excerpt,
    post.slug,
    ...post.tags,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function matchesTag(tag: TagSummary, query: string) {
  return `${tag.name} ${tag.slug}`.toLowerCase().includes(query);
}

export function SearchPage({
  posts,
  tags,
}: {
  posts: PostSummary[];
  tags: TagSummary[];
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalize(deferredQuery);

  const matchingPosts = useMemo(() => {
    if (!normalizedQuery) {
      return posts;
    }

    return posts.filter((post) => matchesPost(post, normalizedQuery));
  }, [normalizedQuery, posts]);

  const matchingTags = useMemo(() => {
    if (!normalizedQuery) {
      return tags;
    }

    return tags.filter((tag) => matchesTag(tag, normalizedQuery));
  }, [normalizedQuery, tags]);

  const hasQuery = normalizedQuery.length > 0;

  return (
    <div>
      <div className="pb-6 pt-6">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-[color:var(--foreground)] sm:text-4xl md:text-6xl">
          Search
        </h1>
        <p className="mt-4 max-w-2xl text-[color:var(--muted)]">
          Search post titles, excerpts, slugs, and tags.
        </p>
      </div>

      <div className="mb-10 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 sm:p-5">
        <label htmlFor="site-search" className="sr-only">
          Search posts and tags
        </label>
        <input
          id="site-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search writeups, tags, and topics…"
          className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 text-[color:var(--foreground)] outline-none transition-colors placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]"
        />
      </div>

      <div className="space-y-10">
        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">
              Tags
            </h2>
            <div className="text-sm text-[color:var(--muted)]">
              {matchingTags.length} result{matchingTags.length === 1 ? "" : "s"}
            </div>
          </div>

          {matchingTags.length === 0 ? (
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 text-[color:var(--muted)]">
              No matching tags.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {matchingTags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 transition-opacity hover:opacity-85"
                >
                  <div className="text-lg font-semibold text-[color:var(--foreground)]">
                    {tag.name}
                  </div>
                  <div className="mt-1 text-sm uppercase tracking-[0.2em] text-[color:var(--accent)]">
                    {tag.count} post{tag.count === 1 ? "" : "s"}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">
              Posts
            </h2>
            <div className="text-sm text-[color:var(--muted)]">
              {matchingPosts.length} result{matchingPosts.length === 1 ? "" : "s"}
            </div>
          </div>

          {matchingPosts.length === 0 ? (
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 text-[color:var(--muted)]">
              {hasQuery ? "No matching posts." : "No published posts yet."}
            </div>
          ) : (
            <ul className="divide-y divide-[color:var(--border)] border-t border-[color:var(--border)]">
              {matchingPosts.map((post) => (
                <li key={post.slug} className="py-8">
                  <article className="space-y-3">
                    <div className="text-sm text-[color:var(--muted)]">
                      <time dateTime={post.datetime}>{post.date}</time>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold leading-8 tracking-tight">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-[color:var(--foreground)] transition-opacity hover:opacity-80"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-sm font-medium uppercase text-[color:var(--accent)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="max-w-none text-[color:var(--muted)]">{post.excerpt}</p>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
