import { cache } from "react";
import { renderMdx } from "@/lib/mdx";
import { getPostBySlug } from "@/lib/posts";

/**
 * Load a post by slug and return its rendered MDX content.
 * Returns null when the post does not exist or is unpublished.
 */
export const getRenderedPostContent = cache(async (
  slug: string,
  options?: {
    /** Render deterministic fallback code blocks that avoid interactive-only components. */
    clientSafeCodeBlocks?: boolean;
  },
) => {
  const post = await getPostBySlug(slug);

  if (!post) {
    return null;
  }

  return renderMdx(post.content, post.theme, options);
});
