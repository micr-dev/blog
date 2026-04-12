export type SharePlatform = "x" | "bluesky" | "linkedin";

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
