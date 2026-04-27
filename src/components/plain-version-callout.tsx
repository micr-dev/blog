import Link from "next/link";

export function PlainVersionCallout({
  href,
  compact = false,
}: {
  href: string;
  compact?: boolean;
}) {
  return (
    <>
      <div
        className={
          compact
            ? "text-sm text-[color:var(--post-muted,var(--muted))]"
            : "text-sm text-[color:var(--muted)]"
        }
      >
        <Link
          href={href}
          className="text-[color:var(--post-accent,var(--accent))] underline underline-offset-4 transition-opacity hover:opacity-80"
        >
          Plain version
        </Link>
      </div>

      <noscript>
        <div
          className={
            compact
              ? "mt-3 rounded-xl border border-[color:var(--post-border,var(--border))] bg-[color:var(--post-background,var(--card))] px-4 py-3 text-sm text-[color:var(--post-body,var(--foreground))]"
              : "mt-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-3 text-sm text-[color:var(--foreground)]"
          }
        >
          JavaScript is disabled. Use the{" "}
          <a
            href={href}
            className="text-[color:var(--post-accent,var(--accent))] underline underline-offset-4"
          >
            plain reading version
          </a>
          .
        </div>
      </noscript>
    </>
  );
}
