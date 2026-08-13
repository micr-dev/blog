"use client";

import { useEffect, useState, type ComponentType } from "react";
import {
  Bot,
  Sparkles,
  UserRound,
  X,
  type LucideProps,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { AiDetection } from "@/types/post";

type VerdictPresentation = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryPercent: (detection: AiDetection, humanPercent: number) => number;
  Icon: ComponentType<LucideProps>;
};

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const VERDICT_PRESENTATION: Record<AiDetection["verdict"], VerdictPresentation> = {
  ai: {
    title: "AI Detected",
    description: "We believe that this document is primarily AI-generated with some human-written content.",
    primaryLabel: "AI Generated",
    primaryPercent: (detection) => detection.aiPercent,
    Icon: Bot,
  },
  assisted: {
    title: "AI Assisted",
    description: "We are confident that this document contains AI-generated and AI-assisted content.",
    primaryLabel: "AI assisted",
    primaryPercent: (detection) => detection.assistedPercent,
    Icon: Sparkles,
  },
  human: {
    title: "Human Written",
    description: "We are confident that this document is human-written.",
    primaryLabel: "Human content",
    primaryPercent: (_detection, humanPercent) => humanPercent,
    Icon: UserRound,
  },
};

function PangramMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="116 116 488 488"
      className="size-4 shrink-0"
    >
      {/* Official Pangram favicon geometry, recolored to the current verdict. */}
      <path
        d="M359.983 575.114V575.131L165.343 385.77V144.852L359.983 575.114Z"
        fill="color-mix(in srgb, var(--ai-detection-state) 42%, var(--post-background))"
      />
      <path
        d="M554.623 144.852V385.77L360.034 575.098L360 575.114L359.983 575.131V575.114L360 575.081L554.623 144.852Z"
        fill="color-mix(in srgb, var(--ai-detection-state) 42%, var(--post-background))"
      />
      <path
        d="M554.657 144.852L360 575.081L359.983 575.114L165.343 144.852L360 256.258L554.657 144.852Z"
        fill="var(--ai-detection-state)"
      />
    </svg>
  );
}

export function AiDetectionPopup({ detection }: { detection: AiDetection }) {
  const [visible, setVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  // The footer signup is a permanent action. Do not let this transient panel
  // cover it when the reader reaches the end of a post on a small screen.
  useEffect(() => {
    const footerForm = document.querySelector(".newsletter-footer");
    if (!footerForm) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setVisible(false);
      }
    }, { threshold: 0.1 });

    observer.observe(footerForm);
    return () => observer.disconnect();
  }, []);

  const humanPercent = 100 - detection.aiPercent - detection.assistedPercent;
  const basePresentation = VERDICT_PRESENTATION[detection.verdict];
  const presentation = detection.verdict === "ai" && detection.aiPercent === 100
    ? {
        ...basePresentation,
        title: "AI Generated",
        description: "We believe that this document is fully AI-generated.",
      }
    : basePresentation;
  const primaryPercent = presentation.primaryPercent(detection, humanPercent);
  const PrimaryIcon = presentation.Icon;
  const breakdown = [
    {
      key: "ai",
      label: "AI",
      percent: detection.aiPercent,
      color: "var(--ai-detection-ai)",
      Icon: Bot,
    },
    {
      key: "assisted",
      label: "Assisted",
      percent: detection.assistedPercent,
      color: "var(--ai-detection-assisted)",
      Icon: Sparkles,
    },
    {
      key: "human",
      label: "Human",
      percent: humanPercent,
      color: "var(--ai-detection-human)",
      Icon: UserRound,
    },
  ];
  let segmentOffset = 0;

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.aside
          className="ai-detection-popup"
          data-verdict={detection.verdict}
          initial={false}
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          exit={reducedMotion
            ? { opacity: 0 }
            : { opacity: 0, transform: "translateY(8px) scale(0.97)" }}
          transition={reducedMotion
            ? { duration: 0.12, ease: EASE_OUT }
            : { duration: 0.16, ease: EASE_OUT }}
        >
          <header className="ai-detection-summary">
            <span className="ai-detection-primary-icon" aria-hidden="true">
              <PrimaryIcon size={19} strokeWidth={1.8} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.6875rem] font-medium text-[color:var(--post-muted)]">
                Content analysis
              </span>
              <span className="block truncate text-sm font-semibold text-[color:var(--post-heading)]">
                {presentation.title}
              </span>
            </span>
            <span className="ai-detection-summary-score">{primaryPercent}%</span>
            <button
              type="button"
              className="ai-detection-close"
              aria-label="Close content analysis"
              onClick={() => setVisible(false)}
            >
              <X aria-hidden="true" size={17} strokeWidth={1.8} />
            </button>
          </header>

          <div className="ai-detection-panel">
            <p className="ai-detection-description">{presentation.description}</p>

            <div className="ai-detection-breakdown">
              <span>Breakdown</span>
              <span className="ai-detection-model">
                <PangramMark />
                <span>{detection.model}</span>
              </span>
            </div>

            <div className="ai-detection-gauge" aria-label={`${primaryPercent}% ${presentation.primaryLabel}`}>
              <svg aria-hidden="true" viewBox="0 0 200 112">
                <path
                  d="M20 100a80 80 0 0 1 160 0"
                  pathLength="100"
                  className="ai-detection-gauge-track"
                />
                {breakdown.map((segment) => {
                  const offset = segmentOffset;
                  segmentOffset += segment.percent;

                  return segment.percent > 0 ? (
                    <path
                      key={segment.key}
                      d="M20 100a80 80 0 0 1 160 0"
                      pathLength="100"
                      stroke={segment.color}
                      strokeDasharray={`${segment.percent} ${100 - segment.percent}`}
                      strokeDashoffset={-offset}
                      className="ai-detection-gauge-value"
                    />
                  ) : null;
                })}
              </svg>
              <span className="ai-detection-gauge-icon" aria-hidden="true">
                <PrimaryIcon size={18} strokeWidth={1.8} />
              </span>
              <span className="ai-detection-gauge-number">
                <strong>{primaryPercent}</strong>
                <span>%</span>
                <small>{presentation.primaryLabel}</small>
              </span>
            </div>

            <div
              className="ai-detection-legend"
            >
              {breakdown.map((segment) => segment.percent > 0 ? (
                <span key={segment.key} style={{ color: segment.color }}>
                  <segment.Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                  <strong>{segment.percent}%</strong>
                  <small>{segment.label}</small>
                </span>
              ) : null)}
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
