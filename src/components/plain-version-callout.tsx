export function PlainVersionCallout({
  href,
  compact = false,
}: {
  href: string;
  compact?: boolean;
}) {
  return (
    <noscript>
      <div
        className={
          compact
            ? "fixed bottom-5 right-5 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-[color:var(--post-border,var(--border))] bg-[color:var(--post-background,var(--card))] px-4 py-4 text-sm text-[color:var(--post-body,var(--foreground))] shadow-[0_18px_48px_rgba(0,0,0,0.28)]"
            : "fixed bottom-5 right-5 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-4 text-sm text-[color:var(--foreground)] shadow-[0_18px_48px_rgba(0,0,0,0.28)]"
        }
        role="note"
        aria-label="Plain reading mode available"
      >
        <p className="font-semibold text-[color:var(--post-heading,var(--foreground))]">
          JavaScript is disabled
        </p>
        <p className="mt-1 leading-6">
          Open the{" "}
          <a
            href={href}
            className="text-[color:var(--post-accent,var(--accent))] underline underline-offset-4"
          >
            plain reading version
          </a>{" "}
          for the cleanest fallback experience.
        </p>
      </div>
    </noscript>
  );
}
