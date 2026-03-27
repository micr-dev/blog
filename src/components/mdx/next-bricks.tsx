function getHostname(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

export function LinkPreview({
  href,
  title,
  description,
  image,
  domain,
}: {
  href: string;
  title: string;
  description?: string;
  image: string;
  domain?: string;
}) {
  const hostname = domain ?? getHostname(href);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group my-8 grid gap-4 rounded-2xl border border-[color:var(--post-border)] bg-[color:var(--post-code-bg)]/45 p-4 no-underline transition-colors hover:border-[color:var(--post-accent)] sm:grid-cols-[1fr_220px]"
    >
      <div className="min-w-0 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--post-muted)]">
          {hostname}
        </div>
        <div className="text-lg font-semibold text-[color:var(--post-heading)] transition-colors group-hover:text-[color:var(--post-accent)]">
          {title}
        </div>
        {description ? (
          <p className="m-0 text-sm leading-6 text-[color:var(--post-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      <div className="overflow-hidden rounded-xl border border-[color:var(--post-border)] bg-black/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          loading="lazy"
          className="block aspect-video h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </div>
    </a>
  );
}

export function ProgressBarV2({
  label,
  value,
  max = 100,
  suffix = "%",
}: {
  label: string;
  value: number;
  max?: number;
  suffix?: string;
}) {
  const safeMax = max <= 0 ? 100 : max;
  const progress = Math.max(0, Math.min(100, (value / safeMax) * 100));

  return (
    <div className="my-5 rounded-2xl border border-[color:var(--post-border)] bg-[color:var(--post-code-bg)]/40 p-4">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-[color:var(--post-heading)]">{label}</span>
        <span className="text-[color:var(--post-muted)]">
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[color:var(--post-border)]/60">
        <div
          className="h-full rounded-full bg-[color:var(--post-accent)] transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
