import type { Metadata } from "next";
import { PlainLayout } from "@/components/plain-layout";
import { PlainPostList } from "@/components/plain-post-list";
import { getPostSummaries } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Read",
  description: "Plain reading mode with no client-side post enhancements.",
  alternates: {
    canonical: `https://${siteConfig.domain}/read`,
  },
};

export default async function ReadPage() {
  const posts = await getPostSummaries();

  return (
    <PlainLayout>
      <div className="space-y-10 pb-16 pt-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--foreground)]">
            Read
          </h1>
          <p className="max-w-2xl text-[color:var(--muted)]">
            A plain reading path that keeps the posts accessible without the
            interactive post chrome.
          </p>
        </div>

        <PlainPostList posts={posts} />
      </div>
    </PlainLayout>
  );
}
