import type { ReactNode } from "react";

export function Term({
  children,
  tip,
}: {
  children: ReactNode;
  tip: string;
}) {
  return (
    <span
      className="nb-term"
      data-term-tooltip={tip}
      tabIndex={0}
      title={tip}
    >
      {children}
    </span>
  );
}
