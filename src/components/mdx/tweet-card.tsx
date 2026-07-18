import { EmbeddedTweet } from "react-tweet";
import { getTweet } from "react-tweet/api";
import { cn } from "@/lib/utils";

/**
 * Theme-matched TweetCard built on react-tweet (MagicUI-style).
 *
 * Fetches the tweet server-side via react-tweet's syndication API so the full
 * card renders during static prerender (the client-only <Tweet> SWR component
 * would otherwise leave a skeleton because SWR does not run during SSG).
 *
 * The card is re-themed with the active post's CSS variables (--post-heading,
 * --post-body, --post-muted, --post-border) so it blends into any post colorway
 * instead of forcing Twitter's palette. See the `.tweet-card-theme` rules in
 * globals.css.
 *
 * Usage: <TweetCard id="2074462417975754926" />
 */
export async function TweetCard({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  let tweet;
  try {
    tweet = await getTweet(id);
  } catch (err) {
    console.error(`TweetCard: failed to fetch tweet ${id}:`, err);
  }

  return (
    <figure
      className={cn(
        "not-prose tweet-card-theme my-8 mx-auto w-full max-w-xl",
        className,
      )}
    >
      {tweet ? (
        <EmbeddedTweet tweet={tweet} />
      ) : (
        // Graceful fallback: a manual link card if the syndication API fails
        <a
          href={`https://x.com/i/status/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl border border-[color:var(--post-border)] bg-[color:var(--post-bg)] p-4 text-[color:var(--post-muted)] transition-colors hover:border-[color:var(--post-accent)]"
        >
          View this post on X &rarr;
        </a>
      )}
    </figure>
  );
}
