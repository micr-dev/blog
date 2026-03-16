import type { Metadata } from "next";
import { HomeAscii } from "@/components/home-ascii";
import { Layout } from "@/components/layout";
import { PostList } from "@/components/post-list";
import { getHomeAscii } from "@/lib/home-content";
import { getPostSummaries } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  alternates: {
    canonical: `https://${siteConfig.domain}/`,
  },
};

export default async function HomePage() {
  const [posts, homeAscii] = await Promise.all([
    getPostSummaries(),
    getHomeAscii(),
  ]);

  return (
    <Layout>
      <div>
        <HomeAscii ascii={homeAscii} />
        <p className="mb-8 text-center text-[color:var(--muted)]">{siteConfig.tagline}</p>
        <PostList posts={posts} />
      </div>
    </Layout>
  );
}
