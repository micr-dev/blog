import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import { mergeTheme, parseDocument } from "@/lib/post-parser";
import type {
  BlogPost,
  PostSummary,
  TagSummary,
} from "@/types/post";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function slugFromFilename(filename: string) {
  return filename.replace(/\.mdx$/, "");
}

type PostIndexEntry = PostSummary & {
  published: boolean;
};

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

function formatDate(value: string) {
  return DATE_FORMATTER.format(new Date(`${value}T00:00:00.000Z`));
}

function normalizeTag(tag: string) {
  return tag.trim();
}

function isMissingFileError(cause: unknown) {
  return (
    typeof cause === "object"
    && cause !== null
    && "code" in cause
    && cause.code === "ENOENT"
  );
}

export function slugifyTag(tag: string) {
  return normalizeTag(tag).toLowerCase().replace(/\s+/g, "-");
}

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

export const getAllPostSlugs = cache(async () => {
  const posts = await getPostIndex();
  return posts.map((post) => post.slug);
});

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

export const getTagBySlug = cache(async (slug: string) => {
  const tags = await getTags();
  return tags.find((tag) => tag.slug === slug) ?? null;
});

export const getPostsByTag = cache(async (slug: string) => {
  const posts = await getPostIndex();
  return posts.filter((post) =>
    post.tags.some((tag) => slugifyTag(tag) === slug),
  );
});

export function getAdjacentPosts(posts: PostSummary[], slug: string) {
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  return {
    previous: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    next: currentIndex > 0 ? posts[currentIndex - 1] : null,
  };
}
