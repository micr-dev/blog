import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import { mergeTheme, parseDocument } from "@/lib/post-parser";
import type {
  BlogPost,
  PostSummary,
  TagSummary,
} from "@/types/post";

/** Absolute path to the on-disk MDX posts directory. */
const POSTS_DIR = path.join(process.cwd(), "content", "posts");
/** Shared UTC date formatter for canonical post-date display. */
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** Extract a slug from an MDX filename by stripping the extension. */
function slugFromFilename(filename: string) {
  return filename.replace(/\.mdx$/, "");
}

/** Internal shape used while building and filtering the cached post index. */
type PostIndexEntry = PostSummary & {
  published: boolean;
};

/**
 * Read and parse a single MDX file into a post index entry.
 * Returns metadata (title, excerpt, date, tags) without the full content.
 */
async function readPostIndexEntry(filename: string): Promise<PostIndexEntry> {
  const slug = slugFromFilename(filename);
  const fullPath = path.join(POSTS_DIR, filename);
  const source = await fs.readFile(fullPath, "utf8");
  const { frontmatter } = parseDocument(source);

  return {
    slug,
    title: frontmatter.title,
    excerpt: frontmatter.excerpt,
    date: formatDate(frontmatter.date),
    datetime: frontmatter.date,
    tags: frontmatter.tags,
    cover: frontmatter.cover,
    published: frontmatter.published,
  };
}

/** Format an ISO date string into a human-readable form (e.g. "Apr 22, 2026"). */
function formatDate(value: string) {
  return DATE_FORMATTER.format(new Date(`${value}T00:00:00.000Z`));
}

/** Trim whitespace from a tag string. */
function normalizeTag(tag: string) {
  return tag.trim();
}

/**
 * Type guard checking whether an error was caused by a missing file (ENOENT).
 * Used to distinguish "post not found" from unexpected IO errors.
 */
function isMissingFileError(cause: unknown) {
  return (
    typeof cause === "object"
    && cause !== null
    && "code" in cause
    && cause.code === "ENOENT"
  );
}

/**
 * Convert a tag name into a URL-safe slug (lowercased, dashes for spaces).
 * Example: `"Machine Learning"` → `"machine-learning"`
 */
export function slugifyTag(tag: string) {
  return normalizeTag(tag).toLowerCase().replace(/\s+/g, "-");
}

/**
 * Cached reader for the post index. Scans the content/posts directory,
 * parses all `.mdx` files, and returns published posts sorted newest-first.
 */
const getPostIndex = cache(async (): Promise<PostIndexEntry[]> => {
  let entries: string[] = [];

  try {
    entries = await fs.readdir(POSTS_DIR);
  } catch {
    return [];
  }

  const posts = await Promise.all(
    entries
      .filter((entry) => entry.endsWith(".mdx"))
      .map(readPostIndexEntry),
  );

  return posts
    .filter((post) => post.published)
    .sort((left, right) => right.datetime.localeCompare(left.datetime));
});

/** Return slugs for all published posts (cached). */
export const getAllPostSlugs = cache(async (): Promise<string[]> => {
  const posts = await getPostIndex();
  return posts.map((post) => post.slug);
});

/** Return lightweight summaries for all published posts (cached). */
export const getPostSummaries = cache(async (): Promise<PostSummary[]> => {
  const posts = await getPostIndex();
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    datetime: post.datetime,
    tags: post.tags,
    cover: post.cover,
  }));
});

/**
 * Load a full blog post by slug. Returns `null` if the post is
 * unpublished or the file does not exist. Re-throws unexpected errors.
 * @throws If file reads or frontmatter parsing fail for reasons other than
 * a missing post file (`ENOENT`).
 */
export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const source = await fs.readFile(path.join(POSTS_DIR, `${slug}.mdx`), "utf8");
    const { frontmatter, content } = parseDocument(source);

    if (!frontmatter.published) {
      return null;
    }

    return {
      slug,
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      date: formatDate(frontmatter.date),
      datetime: frontmatter.date,
      tags: frontmatter.tags,
      cover: frontmatter.cover,
      content,
      theme: mergeTheme(frontmatter.theme),
    };
  } catch (cause) {
    if (isMissingFileError(cause)) {
      return null;
    }

    throw cause;
  }
});

/**
 * Aggregate all unique tags across published posts with their post counts.
 * Tags are sorted alphabetically by name.
 */
export const getTags = cache(async (): Promise<TagSummary[]> => {
  const posts = await getPostIndex();
  const counts = new Map<string, { name: string; count: number }>();

  for (const post of posts) {
    for (const tag of post.tags) {
      const name = normalizeTag(tag);
      const slug = slugifyTag(name);
      const current = counts.get(slug);
      counts.set(slug, {
        name,
        count: (current?.count ?? 0) + 1,
      });
    }
  }

  return [...counts.entries()]
    .map(([slug, entry]) => ({ slug, ...entry }))
    .sort((left, right) => left.name.localeCompare(right.name));
});

/**
 * Look up a tag by its URL slug (cached).
 * @returns Matching tag metadata, or `null` when no tag uses this slug.
 */
export const getTagBySlug = cache(async (slug: string): Promise<TagSummary | null> => {
  const tags = await getTags();
  return tags.find((tag) => tag.slug === slug) ?? null;
});

/**
 * Return all published posts that carry the given tag slug (cached).
 * @returns Published posts whose normalized tags map to the requested slug.
 */
export const getPostsByTag = cache(async (slug: string): Promise<PostSummary[]> => {
  const posts = await getPostIndex();
  return posts.filter((post) =>
    post.tags.some((tag) => slugifyTag(tag) === slug),
  );
});

/** Navigation neighbors around a current post in a sorted post list. */
export type AdjacentPosts = {
  previous: PostSummary | null;
  next: PostSummary | null;
};

/**
 * Given an ordered list of posts and a target slug, return the
 * chronologically previous and next post for navigation.
 * @returns Object containing `previous` (older) and `next` (newer) neighbors,
 * or `null` when no neighbor exists in that direction. If the slug is not
 * present in `posts`, both values are `null`.
 */
export function getAdjacentPosts(posts: PostSummary[], slug: string): AdjacentPosts {
  const currentIndex = posts.findIndex((post) => post.slug === slug);
  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    next: currentIndex > 0 ? posts[currentIndex - 1] : null,
  };
}
