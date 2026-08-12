import { promises as fs } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { Resend } from "resend";
import { NewPostEmail, renderEmail } from "@/emails/newsletter-templates";
import { getNewsletterConfig, siteOrigin } from "@/lib/newsletter";
import { parseDocument } from "@/lib/post-parser";

/**
 * Send a post announcement to the newsletter segment.
 *
 *   npm run newsletter                 # dry run on the newest post
 *   npm run newsletter -- --send       # actually send it
 *   npm run newsletter -- --slug free-opus --send
 *   npm run newsletter -- --send --schedule "in 1 hour"
 *
 * Dry run is the default on purpose. A broadcast cannot be unsent, so the
 * script always shows what it would do and writes a previewable HTML file
 * unless `--send` is passed explicitly.
 *
 * This reads the MDX directly instead of importing `@/lib/posts`, because that
 * module wraps everything in React's `cache()` for the request lifecycle and
 * has no meaning outside a render.
 */

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const PREVIEW_PATH = path.join(process.cwd(), "newsletter-preview.html");

/** Localized variants (`post.es.mdx`) share a slug with their source post and
 * would send the same announcement twice, so they are skipped. */
const LOCALIZED_FILENAME = /^.+\.[a-z]{2}\.mdx$/;

interface Candidate {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  cover?: string;
}

/** Read every publishable, non-localized post, newest first. */
async function loadPosts(): Promise<Candidate[]> {
  const entries = await fs.readdir(POSTS_DIR);

  const posts = await Promise.all(
    entries
      .filter((entry) => entry.endsWith(".mdx") && !LOCALIZED_FILENAME.test(entry))
      .map(async (entry): Promise<Candidate | null> => {
        const source = await fs.readFile(path.join(POSTS_DIR, entry), "utf8");
        const { frontmatter } = parseDocument(source);

        if (!frontmatter.published || !frontmatter.listed) {
          return null;
        }

        return {
          slug: entry.replace(/\.mdx$/, ""),
          title: frontmatter.title,
          excerpt: frontmatter.excerpt,
          date: frontmatter.date,
          tags: frontmatter.tags,
          cover: frontmatter.cover,
        };
      }),
  );

  return posts
    .filter((post): post is Candidate => post !== null)
    .sort((left, right) => right.date.localeCompare(left.date));
}

/** Human-readable post date, matching how the site renders it. */
function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

/** Turn a repo-relative cover path into an absolute URL. Mail clients cannot
 * resolve relative image sources. */
function toAbsoluteUrl(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  return value.startsWith("http") ? value : `${siteOrigin}${value}`;
}

async function main() {
  const { values } = parseArgs({
    options: {
      slug: { type: "string" },
      subject: { type: "string" },
      schedule: { type: "string" },
      send: { type: "boolean", default: false },
    },
  });

  const posts = await loadPosts();

  if (posts.length === 0) {
    throw new Error("No published posts found in content/posts.");
  }

  const post = values.slug
    ? posts.find((candidate) => candidate.slug === values.slug)
    : posts[0];

  if (!post) {
    throw new Error(
      `No published post with slug "${values.slug}". Available: ${posts
        .map((candidate) => candidate.slug)
        .join(", ")}`,
    );
  }

  const url = `${siteOrigin}/blog/${post.slug}`;
  const subject = values.subject ?? `New post: ${post.title}`;
  const email = (
    <NewPostEmail
      title={post.title}
      excerpt={post.excerpt}
      url={url}
      date={formatDate(post.date)}
      tags={post.tags}
      coverUrl={toAbsoluteUrl(post.cover)}
    />
  );

  const { html, text } = await renderEmail(email);

  console.log(`post:     ${post.slug}`);
  console.log(`subject:  ${subject}`);
  console.log(`url:      ${url}`);
  console.log(`schedule: ${values.schedule ?? "immediately"}`);

  if (!values.send) {
    await fs.writeFile(PREVIEW_PATH, html, "utf8");
    console.log(`\nDry run. Preview written to ${PREVIEW_PATH}`);
    console.log("Re-run with --send to deliver it.");
    return;
  }

  const config = getNewsletterConfig();
  const resend = new Resend(config.apiKey);

  const broadcast = await resend.broadcasts.create({
    segmentId: config.segmentId,
    from: config.from,
    subject,
    html,
    text,
    name: `${post.slug} announcement`,
    send: true,
    ...(values.schedule ? { scheduledAt: values.schedule } : {}),
  });

  if (broadcast.error) {
    throw new Error(`Resend rejected the broadcast: ${broadcast.error.message}`);
  }

  console.log(`\nSent. Broadcast id: ${broadcast.data?.id}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
