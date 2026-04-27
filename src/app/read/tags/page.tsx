import type { Metadata } from "next";
import Link from "next/link";
import { PlainLayout } from "@/components/plain-layout";
import { getTags } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Read Tags",
  description: "Browse plain reading posts by tag.",
  alternates: {
    canonical: `https://${siteConfig.domain}/read/tags`,
  },
};

export default async function ReadTagsPage() {
  const tags = await getTags();

  return (
    <PlainLayout>
      <div className="space-y-8 pb-16 pt-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--foreground)]">
            Tags
          </h1>
          <p className="max-w-2xl text-[color:var(--muted)]">
            Browse the plain reading archive by tag.
          </p>
        </div>

        {tags.length === 0 ? (
          <div className="rounded-xl border border-[color:var(--border)] p-6 text-[color:var(--muted)]">
            No tags yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/read/tags/${tag.slug}`}
                className="rounded-xl border border-[color:var(--border)] p-5"
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
      </div>
    </PlainLayout>
  );
}
