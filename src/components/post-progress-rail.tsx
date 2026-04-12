"use client";

import { type ReactNode, useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";

const TRACK_HEIGHT = 240;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EXPANDED_OFFSET = 75;

export function PostProgressRail({
  children,
}: {
  children: ReactNode;
}) {
  const [hidden, setHidden] = useState(false);
  const { scrollYProgress } = useScroll();

  const fillValue = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clipPath = useMotionTemplate`inset(0 0 ${fillValue}% 0)`;
  const progressValue = useTransform(scrollYProgress, [0, 1], [1, 100]);
  const roundedProgressValue = useTransform(progressValue, (value) =>
    Math.round(value),
  );
  const markerY = useTransform(scrollYProgress, [0, 1], [0, TRACK_HEIGHT]);

  function toggleHidden() {
    setHidden((value) => !value);
  }

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.postProgressScrollbar = hidden ? "visible" : "hidden";

    return () => {
      delete root.dataset.postProgressScrollbar;
    };
  }, [hidden]);

  return (
    <div className="relative">
      <div className="pointer-events-none fixed left-0 top-1/2 z-20 hidden -translate-y-1/2 xl:block">
        <AnimatePresence mode="wait" initial={false}>
          {hidden ? (
            <motion.button
              key="progress-toggle"
              type="button"
              aria-label="Show reading progress"
              onClick={toggleHidden}
              className="pointer-events-auto flex h-10 w-7 cursor-pointer items-center justify-center rounded-r-full border border-l-0 border-[color:var(--post-border)] bg-[color:var(--post-background)] text-[color:var(--post-muted)] shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-colors hover:text-[color:var(--post-heading)]"
              initial={{ x: -23, opacity: 0, scale: 0.97 }}
              animate={{ x: -5, opacity: 1, scale: 1 }}
              exit={{ x: -23, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
            >
              <ChevronRight className="size-3.5" />
            </motion.button>
          ) : (
            <motion.button
              key="progress-rail"
              type="button"
              aria-label="Hide reading progress"
              onClick={toggleHidden}
              className="pointer-events-auto relative flex h-60 w-1.5 cursor-pointer flex-col items-center justify-center rounded-2xl p-0 text-[color:var(--post-accent)]"
              style={{
                left: `${EXPANDED_OFFSET}px`,
                backgroundColor:
                  "color-mix(in srgb, var(--post-border) 50%, transparent)",
              }}
              initial={{ x: -18, opacity: 0, scale: 0.985 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -18, opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
            >
              <motion.div
                className="h-full w-full rounded-2xl bg-[color:var(--post-accent)]"
                style={{ clipPath }}
              />
              <motion.div
                style={{ y: markerY }}
                className="absolute top-0 flex h-px w-4 items-center justify-center bg-[color:var(--post-accent)]"
              >
                <motion.span className="absolute left-6 tabular-nums text-xs font-medium tracking-tight text-[color:var(--post-accent)]">
                  {roundedProgressValue}
                </motion.span>
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      {children}
    </div>
  );
}
