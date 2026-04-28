import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/mdx-editor", "/og-preview"],
      },
    ],
    sitemap: `https://${siteConfig.domain}/sitemap.xml`,
    host: `https://${siteConfig.domain}`,
  };
}
