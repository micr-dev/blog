import type { CSSProperties, ReactNode } from "react";
import { CopyButton } from "@/components/mdx/copy-button";
import { cn } from "@/lib/utils";

type Tone = "default" | "accent" | "success";

function toneClass(tone: Tone) {
  if (tone === "success") {
    return "border-emerald-300/20 bg-emerald-400/[0.045]";
  }

  if (tone === "accent") {
    return "border-[color:var(--post-accent)]/35 bg-[color:var(--post-accent)]/10";
  }

  return "border-[color:var(--post-border)] bg-white/[0.035]";
}

export function MarkdownPanel({
  title,
  description,
  action,
  tabs,
  activeTab = 0,
  bodyHeight,
  children,
  bodyClassName,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  tabs?: string[];
  activeTab?: number;
  bodyHeight?: number | string;
  children: ReactNode;
  bodyClassName?: string;
  className?: string;
}) {
  const panelBodyStyle: CSSProperties | undefined = bodyHeight
    ? { height: typeof bodyHeight === "number" ? `${bodyHeight}px` : bodyHeight }
    : undefined;

  return (
    <section
      className={cn(
        "not-prose my-8 overflow-hidden rounded-2xl border border-[color:var(--post-border)] bg-white/[0.03]",
        className,
      )}
    >
      {title || description || action ? (
        <div className="border-b border-[color:var(--post-border)] p-4 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              {title ? (
                <h3 className="m-0 text-lg font-medium leading-tight text-[color:var(--post-heading)]">
                  {title}
                </h3>
              ) : null}
              {description ? (
                <p className="m-0 max-w-2xl text-sm leading-6 text-[color:var(--post-muted)]">
                  {description}
                </p>
              ) : null}
            </div>
            {action ? (
              <div className="shrink-0 text-sm text-[color:var(--post-muted)]">
                {action}
              </div>
            ) : null}
          </div>
          {tabs?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {tabs.map((tab, index) => {
                const selected = index === activeTab;

                return (
                  <span
                    key={tab}
                    aria-pressed={selected}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      selected
                        ? "border-white/70 bg-white text-black"
                        : "border-white/15 bg-white/[0.02] text-white/60",
                    )}
                  >
                    {tab}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
      <div
        className={cn(
          "m-0 overflow-auto bg-black/25 p-4 text-sm leading-6 text-[color:var(--post-body)]/80 md:p-5",
          bodyClassName,
        )}
        style={panelBodyStyle}
      >
        {children}
      </div>
    </section>
  );
}

export function MarkdownGrid({
  children,
  columns = 2,
  className,
}: {
  children: ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  const columnsClass = {
    1: "",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
  }[columns];

  return (
    <div className={cn("not-prose my-6 grid gap-4", columnsClass, className)}>
      {children}
    </div>
  );
}

export function MarkdownCard({
  title,
  meta,
  badge,
  tone = "default",
  children,
  className,
}: {
  title?: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border p-5 md:p-6", toneClass(tone), className)}>
      {title || meta || badge ? (
        <div className="mb-4 flex flex-col gap-1 border-b border-[color:var(--post-border)] pb-4 md:flex-row md:items-baseline md:justify-between">
          <div className={cn(
            "text-base text-[color:var(--post-heading)]",
            tone === "success" ? "font-semibold" : "font-medium",
          )}
          >
            {title}
          </div>
          <div className="flex items-center gap-2 text-sm text-[color:var(--post-muted)]">
            {meta ? <span>{meta}</span> : null}
            {badge ? <span className={cn(
              "rounded-full px-3 py-1 tabular-nums",
              tone === "success"
                ? "bg-emerald-300/15 font-semibold text-emerald-100"
                : "bg-white/10 text-[color:var(--post-heading)]/85",
            )}
            >
              {badge}
            </span> : null}
          </div>
        </div>
      ) : null}
      <div className="text-sm leading-6 text-[color:var(--post-muted)]">
        {children}
      </div>
    </div>
  );
}

export function MarkdownMetric({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: ReactNode;
  value: ReactNode;
  detail?: ReactNode;
  tone?: Tone;
}) {
  return (
    <div className={cn("rounded-xl border p-4", toneClass(tone))}>
      <div className="mb-2 text-xs uppercase tracking-wide text-[color:var(--post-muted)]">
        {label}
      </div>
      <div className={cn(
        "text-2xl font-semibold leading-none tabular-nums text-[color:var(--post-heading)]",
        tone === "success" && "text-emerald-100",
      )}
      >
        {value}
      </div>
      {detail ? (
        <div className="mt-3 text-sm leading-6 text-[color:var(--post-muted)]">
          {detail}
        </div>
      ) : null}
    </div>
  );
}

export function MarkdownQuoteCard({
  author,
  meta,
  children,
}: {
  author: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <MarkdownCard title={author} meta={meta} className="shadow-xl shadow-black/15">
      <blockquote className="m-0 border-0 p-0 text-base leading-7 text-[color:var(--post-body)]">
        <span className="text-3xl leading-none text-[color:var(--post-muted)]">&quot;</span>
        {children}
        <span className="text-3xl leading-none text-[color:var(--post-muted)]">&quot;</span>
      </blockquote>
    </MarkdownCard>
  );
}

export function MarkdownFigure({
  src,
  alt,
  caption,
  fullWidth = false,
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <figure
      className={cn(
        "not-prose my-8",
        fullWidth && "relative left-1/2 w-screen -translate-x-1/2 px-4 sm:px-8",
      )}
    >
      <div className="mx-auto w-fit max-w-full overflow-x-auto rounded-2xl border border-[color:var(--post-border)] bg-black/45 p-4 shadow-2xl shadow-black/20 md:p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="block h-auto max-w-full rounded-lg"
        />
      </div>
      {caption ? (
        <figcaption className="mx-auto mt-3 max-w-3xl text-center text-sm leading-6 text-[color:var(--post-muted)]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function MarkdownCodeBlock({
  text,
  label,
  copyLabel,
  copiedLabel,
}: {
  text: string;
  label?: ReactNode;
  copyLabel?: string;
  copiedLabel?: string;
}) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-[color:var(--post-border)] bg-white/[0.035]">
      {label || copyLabel ? (
        <div className="flex items-center justify-between gap-3 border-b border-[color:var(--post-border)] px-4 py-3">
          <div className="text-sm font-medium text-[color:var(--post-heading)]">
            {label}
          </div>
          <CopyButton
            text={text}
            copyLabel={copyLabel}
            copiedLabel={copiedLabel}
          />
        </div>
      ) : null}
      <pre className="post-scroll m-0 overflow-x-auto bg-[color:var(--post-code-bg)] p-4 text-sm leading-6 text-[color:var(--post-code-fg)] md:p-5">
        <code>{text}</code>
      </pre>
    </div>
  );
}
