import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { Layout } from "@/components/layout";
import { getTags } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse posts by tag.",
  alternates: {
    canonical: `https://${siteConfig.domain}/tags`,
  },
};

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <Layout>
      <div className="pb-6 pt-6">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-[color:var(--foreground)] sm:text-4xl md:text-6xl">
          Tags
        </h1>
      </div>

      {tags.length === 0 ? (
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 text-[color:var(--muted)]">
          No tags yet. Published posts create tags automatically.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 transition-opacity hover:opacity-85"
            >
              <div className="text-lg font-semibold text-[color:var(--foreground)]">{tag.name}</div>
              <div className="mt-1 text-sm uppercase tracking-[0.2em] text-[color:var(--accent)]">
                {tag.count} post{tag.count === 1 ? "" : "s"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}
