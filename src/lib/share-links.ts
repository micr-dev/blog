/** Supported social destinations for generated share links. */
export type SharePlatform = "x" | "bluesky" | "linkedin";

/**
 * Build a share URL for the given platform, pre-filled with the
 * post title and URL. Supports X (Twitter), Bluesky, and LinkedIn.
 * @returns Absolute share-intent URL for the selected social platform.
 */
export function buildShareHref(
  platform: SharePlatform,
  title: string,
  url: string,
) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  switch (platform) {
    case "x":
      return `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    case "bluesky":
      return `https://bsky.app/intent/compose?text=${encodeURIComponent(`${title} ${url}`)}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    default: {
      const exhaustiveCheck: never = platform;
      return exhaustiveCheck;
    }
  }
}
