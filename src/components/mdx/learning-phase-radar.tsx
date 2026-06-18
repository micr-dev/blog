"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const metrics = [
  "Knowledge",
  "Discoverability",
  "Signal quality",
  "Social skill",
  "Barrier",
  "Value",
] as const;

const phaseColors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"] as const;

const phases = [
  {
    label: "Phase 1",
    color: phaseColors[0],
    values: [5, 95, 8, 0, 4, 10],
  },
  {
    label: "Phase 2",
    color: phaseColors[1],
    values: [25, 88, 28, 12, 18, 32],
  },
  {
    label: "Phase 3",
    color: phaseColors[2],
    values: [45, 58, 50, 52, 42, 58],
  },
  {
    label: "Phase 4",
    color: phaseColors[3],
    values: [70, 24, 74, 78, 70, 84],
  },
  {
    label: "Phase 5",
    color: phaseColors[4],
    values: [92, 12, 88, 88, 88, 95],
  },
] as const;

const center = 140;
const radius = 104;
const levels = [20, 40, 60, 80, 100];

function pointFor(metricIndex: number, value: number) {
  const angle = Math.PI / 6 + (metricIndex * Math.PI * 2) / metrics.length;
  const scaledRadius = (value / 100) * radius;

  return {
    x: center + Math.cos(angle) * scaledRadius,
    y: center + Math.sin(angle) * scaledRadius,
  };
}

function polygonPoints(values: readonly number[]) {
  return values
    .map((value, index) => {
      const point = pointFor(index, value);
      return `${point.x},${point.y}`;
    })
    .join(" ");
}

function gridPoints(value: number) {
  return metrics
    .map((_, index) => {
      const point = pointFor(index, value);
      return `${point.x},${point.y}`;
    })
    .join(" ");
}

function labelAnchor(index: number) {
  const angle = Math.PI / 6 + (index * Math.PI * 2) / metrics.length;
  const x = Math.cos(angle);

  if (x > 0.25) return "start";
  if (x < -0.25) return "end";
  return "middle";
}

export function LearningPhaseRadar() {
  const [activeIndex, setActiveIndex] = useState(4);
  const activePhase = phases[activeIndex];

  return (
    <section className="not-prose my-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
        <div>
          <svg
            aria-labelledby="learning-phase-radar-title learning-phase-radar-desc"
            className="mx-auto block h-auto w-full max-w-[560px]"
            role="img"
            viewBox="-55 0 390 300"
          >
            <title id="learning-phase-radar-title">Learning phase radar profile</title>
            <desc id="learning-phase-radar-desc">
              Radar chart comparing five learning phases across knowledge, discoverability, signal quality, social skill, barrier, and value.
            </desc>

            <g>
              {levels.map((level) => (
                <polygon
                  key={level}
                  points={gridPoints(level)}
                  fill="none"
                  stroke="color-mix(in srgb, var(--post-muted) 22%, transparent)"
                  strokeWidth="1"
                />
              ))}
              {metrics.map((metric, index) => {
                const outer = pointFor(index, 100);
                const label = pointFor(index, 118);

                return (
                  <g key={metric}>
                    <line
                      x1={center}
                      y1={center}
                      x2={outer.x}
                      y2={outer.y}
                      stroke="color-mix(in srgb, var(--post-muted) 24%, transparent)"
                      strokeWidth="1"
                    />
                    <text
                      x={label.x}
                      y={label.y}
                      dominantBaseline="middle"
                      fill="var(--post-heading)"
                      fontSize="10"
                      fontWeight="700"
                      textAnchor={labelAnchor(index)}
                    >
                      {metric}
                    </text>
                  </g>
                );
              })}
            </g>

            <g>
              {phases.map((phase, index) => {
                const selected = index === activeIndex;

                return (
                  <polygon
                    key={phase.label}
                    points={polygonPoints(phase.values)}
                    fill={selected ? phase.color : "none"}
                    fillOpacity={selected ? 0.12 : 0}
                    stroke={phase.color}
                    strokeOpacity={selected ? 1 : 0.34}
                    strokeWidth={selected ? 3 : 1.8}
                  />
                );
              })}
              {activePhase.values.map((value, index) => {
                const point = pointFor(index, value);

                return (
                  <circle
                    key={`${activePhase.label}-${metrics[index]}`}
                    cx={point.x}
                    cy={point.y}
                    fill={activePhase.color}
                    r="3.6"
                  />
                );
              })}
            </g>
          </svg>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {phases.map((phase, index) => {
              const selected = index === activeIndex;

              return (
                <button
                  key={phase.label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left text-sm font-semibold transition-colors",
                    index === phases.length - 1 && "col-span-2",
                    selected
                      ? "border-[color:var(--post-heading)] bg-white text-black"
                      : "border-[color:var(--post-border)] bg-white/[0.03] text-[color:var(--post-muted)] hover:border-[color:var(--post-accent)] hover:text-[color:var(--post-heading)]",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: phase.color }}
                  />
                  {phase.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-[color:var(--post-border)] bg-black/20 p-4">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {metrics.map((metric, index) => (
                <div key={metric}>
                  <dt className="text-[color:var(--post-muted)]">{metric}</dt>
                  <dd className="m-0 font-semibold tabular-nums text-[color:var(--post-heading)]">
                    {activePhase.values[index]}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex justify-end">
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: activePhase.color }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
