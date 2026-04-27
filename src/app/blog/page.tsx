import type { Metadata } from "next";
import { Layout } from "@/components/layout";
import { PostList } from "@/components/post-list";
import { TagSidebar } from "@/components/tag-sidebar";
import { getPostSummaries, getTags } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical writeups, notes, and experiments.",
  alternates: {
    canonical: `https://${siteConfig.domain}/blog`,
  },
};

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getPostSummaries(), getTags()]);

  return (
    <Layout>
      <div>
        <div className="pb-6 pt-6">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-[color:var(--foreground)] sm:text-4xl md:text-6xl">
            Blog
          </h1>
        </div>

        <div className="flex gap-8 sm:space-x-0">
          <TagSidebar tags={tags} />
          <div className="flex-1">
            <PostList posts={posts} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
