import { cache } from "react";
import { renderMdx } from "@/lib/mdx";
import { getPostBySlug } from "@/lib/posts";

export const getRenderedPostContent = cache(async (slug: string) => {
  const post = await getPostBySlug(slug);

  if (!post) {
    return null;
  }

  return renderMdx(post.content, post.theme);
});
