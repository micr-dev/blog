"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

const TRACK_HEIGHT = 240;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EXPANDED_OFFSET = 75;
const INACTIVE_RAIL_COLOR = "color-mix(in srgb, var(--post-muted) 54%, transparent)";
const PHASE_COLORS = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"] as const;

type PhaseSegment = {
  color: string;
  end: number;
  label: string;
  start: number;
};

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function PostProgressRail({
  children,
  showPhaseSegments = false,
}: {
  children: ReactNode;
  showPhaseSegments?: boolean;
}) {
  const [hidden, setHidden] = useState(false);
  const [phaseSegments, setPhaseSegments] = useState<PhaseSegment[]>([]);
  const [currentRailColor, setCurrentRailColor] = useState(INACTIVE_RAIL_COLOR);
  const phaseSegmentsRef = useRef<PhaseSegment[]>([]);
  const { scrollYProgress } = useScroll();

  const fillValue = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clipPath = useMotionTemplate`inset(0 0 ${fillValue}% 0)`;
  const progressValue = useTransform(scrollYProgress, [0, 1], [1, 100]);
  const roundedProgressValue = useTransform(progressValue, (value) =>
    Math.round(value),
  );
  const markerY = useTransform(scrollYProgress, [0, 1], [0, TRACK_HEIGHT]);
  const hasPhaseSegments = showPhaseSegments && phaseSegments.length > 0;

  function toggleHidden() {
    setHidden((value) => !value);
  }

  const measurePhaseSegments = useCallback(() => {
    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1,
    );
    const phaseHeadings = Array.from(
      document.querySelectorAll<HTMLElement>(".post-body h2"),
    ).flatMap((heading) => {
      const match = heading.textContent?.trim().match(/^Phase\s+(\d+)/i);

      if (!match) {
        return [];
      }

      return [{
        heading,
        phaseNumber: Number(match[1]),
      }];
    });

    const measuredSegments = phaseHeadings.flatMap((entry, index) => {
      const nextPhaseHeading = phaseHeadings[index + 1]?.heading;
      const start = clampProgress(
        (entry.heading.getBoundingClientRect().top + window.scrollY) / maxScroll,
      );
      const end = nextPhaseHeading
        ? clampProgress(
          (nextPhaseHeading.getBoundingClientRect().top + window.scrollY)
            / maxScroll,
        )
        : 1;

      if (end <= start) {
        return [];
      }

      return [{
        color: PHASE_COLORS[(entry.phaseNumber - 1) % PHASE_COLORS.length],
        end,
        label: `Phase ${entry.phaseNumber}`,
        start,
      }];
    });
    const currentProgress = clampProgress(window.scrollY / maxScroll);
    const activeSegment = measuredSegments.find(
      (segment) =>
        currentProgress >= segment.start && currentProgress < segment.end,
    );

    phaseSegmentsRef.current = measuredSegments;
    setPhaseSegments(measuredSegments);
    setCurrentRailColor(activeSegment?.color ?? INACTIVE_RAIL_COLOR);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!showPhaseSegments) {
      return;
    }

    const activeSegment = phaseSegmentsRef.current.find(
      (segment) => value >= segment.start && value < segment.end,
    );

    setCurrentRailColor(activeSegment?.color ?? INACTIVE_RAIL_COLOR);
  });

  useEffect(() => {
    phaseSegmentsRef.current = showPhaseSegments ? phaseSegments : [];
  }, [phaseSegments, showPhaseSegments]);

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.postProgressScrollbar = hidden ? "visible" : "hidden";

    return () => {
      delete root.dataset.postProgressScrollbar;
    };
  }, [hidden]);

  useEffect(() => {
    if (!showPhaseSegments) {
      phaseSegmentsRef.current = [];
      setPhaseSegments([]);
      setCurrentRailColor(INACTIVE_RAIL_COLOR);
      return;
    }

    let animationFrame = 0;

    function scheduleMeasurePhaseSegments() {
      window.cancelAnimationFrame(animationFrame);

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = window.requestAnimationFrame(measurePhaseSegments);
      });
    }

    const mutationObserver = new MutationObserver(scheduleMeasurePhaseSegments);
    const resizeObserver = new ResizeObserver(scheduleMeasurePhaseSegments);

    scheduleMeasurePhaseSegments();
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
    resizeObserver.observe(document.documentElement);
    window.addEventListener("resize", scheduleMeasurePhaseSegments);
    window.addEventListener("load", scheduleMeasurePhaseSegments);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleMeasurePhaseSegments);
      window.removeEventListener("load", scheduleMeasurePhaseSegments);
    };
  }, [measurePhaseSegments, showPhaseSegments]);

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
              aria-describedby={hasPhaseSegments ? "post-progress-rail-description" : undefined}
              onClick={toggleHidden}
              className="pointer-events-auto relative flex h-60 w-1.5 cursor-pointer flex-col items-center justify-center rounded-2xl p-0 transition-transform active:scale-[0.96]"
              style={{
                left: `${EXPANDED_OFFSET}px`,
                backgroundColor: showPhaseSegments
                  ? INACTIVE_RAIL_COLOR
                  : "color-mix(in srgb, var(--post-border) 50%, transparent)",
              }}
              initial={{ x: -18, opacity: 0, scale: 0.985 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -18, opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
            >
              {hasPhaseSegments ? (
                <span id="post-progress-rail-description" className="sr-only">
                  Phase sections are colored on the reading progress rail. Non-phase sections remain gray.
                </span>
              ) : null}
              <motion.div
                className="h-full w-full rounded-2xl bg-[color:var(--post-accent)]"
                style={{ clipPath }}
              />
              {hasPhaseSegments ? (
                <motion.div
                  className="absolute inset-0 overflow-hidden rounded-2xl"
                  style={{ clipPath }}
                >
                  {phaseSegments.map((segment) => (
                    <span
                      key={segment.label}
                      aria-hidden="true"
                      className="absolute left-0 w-full"
                      style={{
                        backgroundColor: segment.color,
                        height: `${Math.max((segment.end - segment.start) * 100, 1)}%`,
                        top: `${segment.start * 100}%`,
                      }}
                    />
                  ))}
                </motion.div>
              ) : null}
              {hasPhaseSegments
                ? phaseSegments.map((segment) => (
                  <span
                    key={`${segment.label}-marker`}
                    aria-hidden="true"
                    className="absolute left-1/2 z-10 size-2 -translate-x-1/2 rounded-full border border-[color:var(--post-background)] shadow-[0_0_0_1px_rgba(0,0,0,0.18)]"
                    style={{
                      backgroundColor: segment.color,
                      top: `calc(${segment.start * 100}% - 4px)`,
                    }}
                  />
                ))
                : null}
              <motion.div
                style={hasPhaseSegments
                  ? { y: markerY, backgroundColor: currentRailColor }
                  : { y: markerY }}
                className={hasPhaseSegments
                  ? "absolute top-0 flex h-px w-4 items-center justify-center"
                  : "absolute top-0 flex h-px w-4 items-center justify-center bg-[color:var(--post-accent)]"}
              >
                <motion.span
                  className={hasPhaseSegments
                    ? "absolute left-6 tabular-nums text-xs font-medium tracking-tight"
                    : "absolute left-6 tabular-nums text-xs font-medium tracking-tight text-[color:var(--post-accent)]"}
                  style={hasPhaseSegments ? { color: currentRailColor } : undefined}
                >
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
