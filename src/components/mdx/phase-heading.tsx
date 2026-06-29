import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Phase = 1 | 2 | 3 | 4 | 5;

type Props = {
  phase: Phase;
  title: string;
  time?: string;
  total?: string;
};

const phaseColors = {
  1: "#1f77b4",
  2: "#ff7f0e",
  3: "#2ca02c",
  4: "#d62728",
  5: "#9467bd",
} satisfies Record<Phase, string>;

export function PhaseHeading({ phase, title, time, total }: Props) {
  const style = {
    borderLeftColor: phaseColors[phase],
  } satisfies CSSProperties;

  return (
    <h2
      className={cn(
        "not-prose my-10 border-l-[3px] pl-4 font-semibold leading-tight text-[color:var(--post-heading)]",
        "rounded-l-[4px] text-2xl md:text-3xl",
      )}
      style={style}
    >
      <span>{`Phase ${phase}: ${title}`}</span>
      {time ? (
        <span className="mt-1.5 block text-sm font-medium text-[color:var(--post-muted)]">
          Duration: {time}
          {total ? (
            <span className="ml-1.5 opacity-70">
              (total: {total})
            </span>
          ) : null}
        </span>
      ) : null}
    </h2>
  );
}
