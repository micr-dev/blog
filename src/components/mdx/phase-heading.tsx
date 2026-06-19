import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Phase = 1 | 2 | 3 | 4 | 5;

type Props = {
  phase: Phase;
  title: string;
  time?: string;
  total?: string;
};

export function PhaseHeading({ phase, title, time, total }: Props) {
  return (
    <h2
      className={cn(
        "not-prose my-10 font-semibold leading-tight text-[color:var(--post-heading)]",
        "text-2xl md:text-3xl",
      )}
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
