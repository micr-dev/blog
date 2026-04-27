import type { PostTheme } from "@/types/post";

export function AsciiFence({
  code,
  theme,
  label,
}: {
  code: string;
  theme: PostTheme;
  label?: string;
}) {
  return (
    <figure className="my-8 space-y-3">
      {label ? (
        <figcaption className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--post-muted)]">
          {label}
        </figcaption>
      ) : null}
      <pre
        className="ascii-diagram post-scroll overflow-x-auto rounded-md p-4"
        style={{
          backgroundColor: theme.colors.codeBackground,
          color: theme.colors.codeForeground,
        }}
        tabIndex={0}
      >
        <code>{code}</code>
      </pre>
    </figure>
  );
}
