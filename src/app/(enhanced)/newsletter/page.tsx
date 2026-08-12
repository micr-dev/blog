import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { Layout } from "@/components/layout";
import { SubscribeForm } from "@/components/newsletter";
import { siteConfig } from "@/lib/site-config";

/**
 * Where the confirmation link lands, and a standalone signup page for anyone
 * who arrives without a token. The `state` query parameter is set by the
 * redirect in `/api/newsletter`.
 */

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Get an email when a new post goes up.",
  alternates: {
    canonical: `https://${siteConfig.domain}/newsletter`,
  },
  // Nothing here is worth indexing, and the confirmation states least of all.
  robots: { index: false, follow: true },
};

type ConfirmState = "confirmed" | "expired" | "invalid" | "error";

const STATE_COPY: Record<ConfirmState, { heading: string; body: string }> = {
  confirmed: {
    heading: "You are subscribed",
    body: "That is it. The next post lands in your inbox. Every email has a one-click unsubscribe link if you change your mind.",
  },
  expired: {
    heading: "That link expired",
    body: "Confirmation links are good for seven days. Enter your address again and a fresh one will be on its way.",
  },
  invalid: {
    heading: "That link did not work",
    body: "It may have been cut in half by your mail client. Try signing up again below.",
  },
  error: {
    heading: "Something broke on my end",
    body: "The confirmation could not be saved. Try the link again in a minute, or sign up again below.",
  },
};

function isConfirmState(value: string | undefined): value is ConfirmState {
  return value !== undefined && value in STATE_COPY;
}

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  const outcome = isConfirmState(state) ? STATE_COPY[state] : null;
  const succeeded = state === "confirmed";

  return (
    <Layout>
      <div className="py-10">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          {outcome ? outcome.heading : "Newsletter"}
        </h1>

        <p className="mt-4 max-w-xl text-[color:var(--muted)]">
          {outcome
            ? outcome.body
            : "One email when a new post goes up. Writeups, notes, and experiments, nothing else."}
        </p>

        {succeeded ? (
          <p className="mt-6">
            <Link
              className="text-[color:var(--accent)] underline underline-offset-4"
              href="/blog"
            >
              Read the posts in the meantime
            </Link>
          </p>
        ) : (
          <div className="mt-8 max-w-md">
            <SubscribeForm variant="footer" />
          </div>
        )}
      </div>
    </Layout>
  );
}
