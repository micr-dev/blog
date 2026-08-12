import { getPostSummaries } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

/**
 * RSS 2.0 feed at /feed.xml.
 *
 * The newsletter is the push channel; this is the pull channel for readers who
 * would rather not hand over an email address. It is built from the same post
 * index, so a published post shows up in both without extra work.
 */

/** Escape the five characters that are not legal as raw text in XML. */
function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS requires RFC 822 dates. Post frontmatter only carries a date, so noon
 * UTC is used to keep the timestamp stable across time zones. */
function toRfc822(date: string) {
  return new Date(`${date}T12:00:00.000Z`).toUTCString();
}

export async function GET() {
  const baseUrl = `https://${siteConfig.domain}`;
  const posts = await getPostSummaries();

  const items = posts
    .map((post) => {
      const url = `${baseUrl}/blog/${post.slug}`;

      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${toRfc822(post.datetime)}</pubDate>`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(siteConfig.name)}</title>`,
    `    <link>${baseUrl}</link>`,
    `    <description>${escapeXml(siteConfig.description)}</description>`,
    "    <language>en</language>",
    `    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />`,
    ...(posts.length > 0 ? [`    <lastBuildDate>${toRfc822(posts[0].datetime)}</lastBuildDate>`] : []),
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
