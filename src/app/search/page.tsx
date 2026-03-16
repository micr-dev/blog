import type { Metadata } from "next";
import { Layout } from "@/components/layout";
import { SearchPage } from "@/components/search-page";
import { getPostSummaries, getTags } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Search",
  description: "Search posts and tags.",
  alternates: {
    canonical: `https://${siteConfig.domain}/search`,
  },
};

export default async function SearchRoute() {
  const [posts, tags] = await Promise.all([getPostSummaries(), getTags()]);

  return (
    <Layout>
      <SearchPage posts={posts} tags={tags} />
    </Layout>
  );
}
