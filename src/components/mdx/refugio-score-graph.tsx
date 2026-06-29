"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type SeriesKey = "alltime" | "team4" | "team3" | "team10";
type MarkerShape = "circle" | "square" | "x";

type ScorePoint = {
  time: string;
  label: string;
  deliveries: number;
  includeInLine?: boolean;
  marker?: MarkerShape;
  // Rejected outliers keep their real delivery count in the tooltip but plot at the chart ceiling.
  plotDeliveries?: number;
};

type ScoreSeries = {
  key: SeriesKey;
  label: string;
  color: string;
  points: ScorePoint[];
};

const series: ScoreSeries[] = [
  {
    key: "alltime",
    label: "Leaderboard best",
    color: "#0e0e0e",
    points: [
      { time: "12:06", label: "Team 16", deliveries: 24 },
      { time: "12:07", label: "Team 4", deliveries: 369 },
      { time: "12:19", label: "Team 10", deliveries: 397 },
      { time: "12:19", label: "Team 09", deliveries: 398 },
      { time: "12:22", label: "Team 3", deliveries: 610 },
      { time: "12:29", label: "Team 08", deliveries: 759 },
      { time: "12:31", label: "Team 02", deliveries: 882 },
      { time: "12:58", label: "Team 09", deliveries: 883 },
      { time: "13:02", label: "Team 02", deliveries: 884 },
      { time: "13:07", label: "Team 3", deliveries: 888 },
      { time: "13:24", label: "Team 16", deliveries: 895 },
      { time: "14:01", label: "Team 16", deliveries: 897 },
      { time: "14:19", label: "Team 06", deliveries: 898 },
      { time: "14:23", label: "Team 4", deliveries: 907 },
      { time: "14:47", label: "Team 3", deliveries: 909 },
      { time: "14:56", label: "Team 10", deliveries: 923 },
      { time: "15:18", label: "Team 3", deliveries: 924 },
      { time: "15:27", label: "Team 10", deliveries: 930 },
      { time: "15:48", label: "Team 3", deliveries: 931 },
      { time: "15:57", label: "Team 10", deliveries: 1008 },
    ],
  },
  {
    key: "team4",
    label: "Team 4",
    color: "#cc3a2c",
    points: [
      { time: "12:04", label: "local", deliveries: 37 },
      { time: "12:07", label: "local", deliveries: 336 },
      { time: "12:07", label: "public", deliveries: 369 },
      { time: "12:38", label: "local", deliveries: 768 },
      {
        time: "12:42",
        label: "safety rejected",
        deliveries: 1560,
        includeInLine: false,
        marker: "x",
        plotDeliveries: 1020,
      },
      { time: "12:48", label: "public", deliveries: 879 },
      { time: "13:15", label: "local", deliveries: 909 },
      { time: "13:19", label: "public", deliveries: 888 },
      { time: "13:55", label: "local", deliveries: 914 },
      { time: "14:13", label: "local", deliveries: 895 },
      { time: "14:23", label: "public", deliveries: 907 },
      { time: "14:32", label: "local", deliveries: 900 },
      { time: "14:43", label: "local", deliveries: 910 },
      { time: "14:58", label: "local", deliveries: 915 },
      { time: "15:04", label: "approved record", deliveries: 923 },
      {
        time: "15:23",
        label: "safety rejected",
        deliveries: 3000,
        includeInLine: false,
        marker: "x",
        plotDeliveries: 1020,
      },
      { time: "15:30", label: "local", deliveries: 924 },
      { time: "15:44", label: "local", deliveries: 927 },
      { time: "15:54", label: "local", deliveries: 926 },
    ],
  },
  {
    key: "team3",
    label: "Team 3 (winners)",
    color: "#2362ab",
    points: [
      { time: "12:22", label: "public", deliveries: 610 },
      { time: "13:07", label: "public", deliveries: 888 },
      { time: "14:47", label: "public", deliveries: 909 },
      { time: "15:18", label: "public", deliveries: 924 },
      { time: "15:48", label: "public", deliveries: 931 },
    ],
  },
  {
    key: "team10",
    label: "Team 10 (highest score)",
    color: "#f1b91e",
    points: [
      { time: "12:19", label: "public", deliveries: 397 },
      { time: "14:56", label: "public", deliveries: 923 },
      { time: "15:27", label: "public", deliveries: 930 },
      { time: "15:57", label: "public", deliveries: 1008 },
    ],
  },
];

const chart = {
  width: 720,
  height: 330,
  left: 54,
  right: 18,
  top: 24,
  bottom: 44,
};

const yTicks = [0, 250, 500, 750, 1000];
const xTicks = ["12:00", "13:00", "14:00", "15:00", "16:00"];

function minutesFromNoon(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return (hour - 12) * 60 + minute;
}

function xFor(time: string) {
  const minutes = minutesFromNoon(time);
  const range = chart.width - chart.left - chart.right;
  return chart.left + (minutes / 240) * range;
}

function yFor(deliveries: number) {
  const range = chart.height - chart.top - chart.bottom;
  return chart.top + ((1020 - deliveries) / 1020) * range;
}

function yForPoint(point: ScorePoint) {
  return yFor(point.plotDeliveries ?? point.deliveries);
}

function pathFor(points: ScorePoint[]) {
  return points
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command} ${xFor(point.time).toFixed(2)} ${yForPoint(point).toFixed(2)}`;
    })
    .join(" ");
}

function tooltipFor(point: ScorePoint) {
  const x = xFor(point.time);
  const y = yForPoint(point);
  const width = 210;
  const height = 62;
  const gap = 12;
  const left = x < chart.width / 2 ? x + gap : x - width - gap;
  const top = Math.min(
    Math.max(y - height - gap, chart.top + 6),
    chart.height - chart.bottom - height - 6,
  );

  return {
    x: left,
    y: top,
    width,
    height,
  };
}

function markerShapeFor(seriesKey: SeriesKey, point: ScorePoint): MarkerShape {
  if (point.marker) {
    return point.marker;
  }

  if (seriesKey !== "team4") {
    return "circle";
  }

  if (point.label !== "public") {
    return "square";
  }

  return "circle";
}

function renderMarker({
  shape,
  x,
  y,
  color,
  selected,
  focused,
}: {
  shape: MarkerShape;
  x: number;
  y: number;
  color: string;
  selected: boolean;
  focused: boolean;
}) {
  const opacity = selected ? 1 : 0.35;
  const size = focused ? 12 : selected ? 9 : 6;

  if (shape === "square") {
    return (
      <rect
        x={x - size / 2}
        y={y - size / 2}
        width={size}
        height={size}
        fill={color}
        opacity={opacity}
        rx="1"
      />
    );
  }

  if (shape === "x") {
    const half = size / 2;

    return (
      <g opacity={opacity}>
        <line
          x1={x - half}
          x2={x + half}
          y1={y - half}
          y2={y + half}
          stroke={color}
          strokeLinecap="round"
          strokeWidth={focused ? 3 : 2.3}
        />
        <line
          x1={x + half}
          x2={x - half}
          y1={y - half}
          y2={y + half}
          stroke={color}
          strokeLinecap="round"
          strokeWidth={focused ? 3 : 2.3}
        />
      </g>
    );
  }

  return (
    <circle
      cx={x}
      cy={y}
      fill={color}
      opacity={opacity}
      r={focused ? 6 : selected ? 4.5 : 3}
    />
  );
}

export function RefugioScoreGraph() {
  const [activeKey, setActiveKey] = useState<SeriesKey>("alltime");
  const [focusedPoint, setFocusedPoint] = useState<{
    series: ScoreSeries;
    point: ScorePoint;
  } | null>(null);
  const inactiveSeries = series.filter((entry) => entry.key !== activeKey);
  const activeSeries = series.find((entry) => entry.key === activeKey) ?? series[0];
  const renderSeries = [...inactiveSeries, activeSeries];

  return (
    <section className="not-prose my-8">
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {series.map((entry) => {
          const selected = entry.key === activeKey;

          return (
            <button
              key={entry.key}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setActiveKey(entry.key);
                setFocusedPoint(null);
              }}
              className={cn(
                "rounded-md border px-3 py-2 text-left text-xs font-semibold",
                selected
                  ? "border-[color:var(--post-heading)] bg-[color:var(--post-heading)] text-[color:var(--post-background)]"
                  : "border-[color:var(--post-border)] text-[color:var(--post-body)] hover:border-[color:var(--post-accent)]",
              )}
            >
              <span
                aria-hidden="true"
                className="mr-2 inline-block size-2 rounded-full align-middle"
                style={{ backgroundColor: entry.color }}
              />
              {entry.label}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <svg
          aria-label="Interactive REFUGIO score graph"
          className="block min-w-[42rem]"
          role="img"
          viewBox={`0 0 ${chart.width} ${chart.height}`}
        >
          <rect
            x={chart.left}
            y={chart.top}
            width={chart.width - chart.left - chart.right}
            height={chart.height - chart.top - chart.bottom}
            fill="color-mix(in srgb, var(--post-heading) 3%, transparent)"
            rx="8"
          />
          {yTicks.map((tick) => {
            const y = yFor(tick);

            return (
              <g key={tick}>
                <line
                  x1={chart.left}
                  x2={chart.width - chart.right}
                  y1={y}
                  y2={y}
                  stroke="color-mix(in srgb, var(--post-border) 64%, transparent)"
                />
                <text
                  x={chart.left - 10}
                  y={y + 4}
                  fill="var(--post-muted)"
                  fontSize="11"
                  textAnchor="end"
                >
                  {tick}
                </text>
              </g>
            );
          })}
          {xTicks.map((tick) => {
            const x = xFor(tick);

            return (
              <text
                key={tick}
                x={x}
                y={chart.height - 14}
                fill="var(--post-muted)"
                fontSize="11"
                textAnchor="middle"
              >
                {tick}
              </text>
            );
          })}

          {inactiveSeries.map((entry) => {
            return (
              <path
                key={entry.key}
                d={pathFor(entry.points.filter((point) => point.includeInLine !== false))}
                fill="none"
                pointerEvents="none"
                stroke={entry.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={0.2}
                strokeWidth={1.8}
              />
            );
          })}

          {renderSeries.map((entry) => {
            const selected = entry.key === activeKey;

            return (
              <g key={`${entry.key}-markers`}>
                {entry.points.map((point) => {
                  const focused = focusedPoint?.series.key === entry.key
                    && focusedPoint.point === point;
                  const x = xFor(point.time);
                  const y = yForPoint(point);
                  const markerShape = markerShapeFor(entry.key, point);
                  const marker = renderMarker({
                    shape: markerShape,
                    x,
                    y,
                    color: entry.color,
                    selected,
                    focused,
                  });

                  if (!selected) {
                    return (
                      <g
                        key={`${entry.key}-${point.time}-${point.deliveries}-${point.label}`}
                        aria-hidden="true"
                        pointerEvents="none"
                      >
                        {marker}
                      </g>
                    );
                  }

                  return (
                    <g
                      key={`${entry.key}-${point.time}-${point.deliveries}-${point.label}`}
                      aria-label={`${entry.label}, ${point.deliveries} deliveries at ${point.time}, ${point.label}`}
                      role="button"
                      tabIndex={0}
                      onBlur={() => setFocusedPoint(null)}
                      onClick={() => {
                        setActiveKey(entry.key);
                        setFocusedPoint({ series: entry, point });
                      }}
                      onFocus={() => {
                        setFocusedPoint({ series: entry, point });
                      }}
                      onMouseEnter={() => {
                        setFocusedPoint({ series: entry, point });
                      }}
                      onMouseLeave={() => setFocusedPoint(null)}
                    >
                      {marker}
                    </g>
                  );
                })}
              </g>
            );
          })}
          <path
            d={pathFor(activeSeries.points.filter((point) => point.includeInLine !== false))}
            fill="none"
            pointerEvents="none"
            stroke={activeSeries.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={1}
            strokeWidth={3}
          />
          {focusedPoint ? (
            <g pointerEvents="none">
              {(() => {
                const tooltip = tooltipFor(focusedPoint.point);

                return (
                  <>
                    <rect
                      x={tooltip.x}
                      y={tooltip.y}
                      width={tooltip.width}
                      height={tooltip.height}
                      fill="var(--post-code-bg)"
                      rx="8"
                      stroke={focusedPoint.series.color}
                      strokeWidth="1.5"
                    />
                    <text
                      x={tooltip.x + 12}
                      y={tooltip.y + 20}
                      fill="var(--post-code-fg)"
                      fontSize="12"
                      fontWeight="700"
                    >
                      {focusedPoint.series.label}
                    </text>
                    <text
                      x={tooltip.x + 12}
                      y={tooltip.y + 39}
                      fill="var(--post-code-fg)"
                      fontSize="12"
                    >
                      {focusedPoint.point.deliveries.toLocaleString("en-US")} deliveries at{" "}
                      {focusedPoint.point.time}
                    </text>
                    <text
                      x={tooltip.x + 12}
                      y={tooltip.y + 54}
                      fill="var(--post-code-fg)"
                      fontSize="10"
                      opacity="0.72"
                    >
                      {focusedPoint.point.label}
                    </text>
                  </>
                );
              })()}
            </g>
          ) : null}
        </svg>
      </div>
    </section>
  );
}
