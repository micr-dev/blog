"use client";

import {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  PROVIDER_COLORS,
  PROVIDER_LABELS,
  PROVIDER_SUMMARIES,
  type ProviderId,
} from "./websearch-bench-data";

type ProviderPoint = {
  id: ProviderId;
  label: string;
  color: string;
  quality: number;
  p95Latency: number;
  costPerThousand: number;
};

type WorldPoint = {
  x: number;
  y: number;
  z: number;
};

type ScreenPoint = {
  x: number;
  y: number;
  depth: number;
};

type Rotation = {
  yaw: number;
  pitch: number;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  startRotation: Rotation;
};

const POINTS: ProviderPoint[] = PROVIDER_SUMMARIES.map((summary) => ({
  id: summary.id,
  label: PROVIDER_LABELS[summary.id],
  color: PROVIDER_COLORS[summary.id],
  quality: summary.ai,
  p95Latency: summary.p95,
  costPerThousand: (summary.cost / 96) * 1000,
}));

const LATENCY_TICKS = [800, 1000, 1200, 1600, 2000, 3000, 4000];
const COST_TICKS = [0.8, 1.5, 2, 5, 10, 15];
const QUALITY_TICKS = [0, 0.25, 0.5, 0.75, 1];
const LATENCY_MIN = Math.log10(700);
const LATENCY_MAX = Math.log10(4500);
const COST_MIN = Math.log10(0.7);
const COST_MAX = Math.log10(16);
const VIEWBOX_WIDTH = 820;
const VIEWBOX_HEIGHT = 460;
const CENTER_X = 410;
const CENTER_Y = 230;
const BASE_SCALE = 122;
const DEFAULT_ROTATION: Rotation = { yaw: -0.78, pitch: 0.26 };

const CUBE_CORNERS: WorldPoint[] = [
  { x: -1, y: -1, z: -1 },
  { x: 1, y: -1, z: -1 },
  { x: 1, y: 1, z: -1 },
  { x: -1, y: 1, z: -1 },
  { x: -1, y: -1, z: 1 },
  { x: 1, y: -1, z: 1 },
  { x: 1, y: 1, z: 1 },
  { x: -1, y: 1, z: 1 },
];

const CUBE_EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

const LABEL_OFFSETS: Partial<Record<ProviderId, { x: number; y: number }>> = {
  parallel: { x: 10, y: 20 },
};
const DEFAULT_LABEL_OFFSET = { x: 10, y: -10 };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalize(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

function normalizeLog(value: number, min: number, max: number) {
  return normalize(Math.log10(value), min, max) * 2 - 1;
}

function pointToWorld(point: ProviderPoint): WorldPoint {
  return {
    x: normalizeLog(point.p95Latency, LATENCY_MIN, LATENCY_MAX),
    y: normalizeLog(point.costPerThousand, COST_MIN, COST_MAX),
    z: point.quality * 2 - 1,
  };
}

function project(world: WorldPoint, rotation: Rotation): ScreenPoint {
  const yawCos = Math.cos(rotation.yaw);
  const yawSin = Math.sin(rotation.yaw);
  const pitchCos = Math.cos(rotation.pitch);
  const pitchSin = Math.sin(rotation.pitch);
  const yawedX = world.x * yawCos - world.y * yawSin;
  const yawedY = world.x * yawSin + world.y * yawCos;
  const pitchedY = yawedY * pitchCos + world.z * pitchSin;
  const depth = yawedY * pitchSin - world.z * pitchCos;
  return {
    x: CENTER_X + yawedX * BASE_SCALE,
    y: CENTER_Y - pitchedY * BASE_SCALE,
    depth,
  };
}

function readableAngle(start: ScreenPoint, end: ScreenPoint) {
  let angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI);
  if (angle > 90 || angle < -90) angle += 180;
  return angle;
}

function axisCaption(start: ScreenPoint, end: ScreenPoint, offset = 34) {
  const midpoint = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const length = Math.hypot(deltaX, deltaY) || 1;
  const normal = { x: -deltaY / length, y: deltaX / length };
  const first = { x: midpoint.x + normal.x * offset, y: midpoint.y + normal.y * offset };
  const second = { x: midpoint.x - normal.x * offset, y: midpoint.y - normal.y * offset };
  const firstDistance = Math.hypot(first.x - CENTER_X, first.y - CENTER_Y);
  const secondDistance = Math.hypot(second.x - CENTER_X, second.y - CENTER_Y);
  const position = firstDistance >= secondDistance ? first : second;

  return { ...position, angle: readableAngle(start, end) };
}

function formatCost(value: number) {
  if (value < 1) return `$${value.toFixed(2)}`;
  if (Number.isInteger(value)) return `$${value.toFixed(0)}`;
  return `$${value.toFixed(2).replace(/0$/, "")}`;
}

function formatLatency(value: number) {
  return `${value.toLocaleString("en-US")} ms`;
}

function formatQuality(value: number) {
  return value.toFixed(3);
}

function handlePointKeyDown(
  event: KeyboardEvent<SVGGElement>,
  pointId: string,
  onSelect: (pointId: string) => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onSelect(pointId);
  }
}

/** Interactive 3D comparison of AI quality, p95 latency, and cost. */
export function WebSearchConclusion3D() {
  const [rotation, setRotation] = useState(DEFAULT_ROTATION);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);

  const selectPoint = (pointId: string) => {
    setSelectedId(pointId);
    setHoveredId(null);
  };

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startRotation: rotation,
    };
    suppressClickRef.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      suppressClickRef.current = true;
    }

    setRotation({
      yaw: drag.startRotation.yaw + deltaX * 0.008,
      pitch: drag.startRotation.pitch - deltaY * 0.006,
    });
  };

  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setIsDragging(false);
  };

  const projectedPoints = POINTS.map((point) => ({
    point,
    position: project(pointToWorld(point), rotation),
  })).sort((first, second) => first.position.depth - second.position.depth);
  const activePointId = hoveredId ?? selectedId;
  const activePoint = POINTS.find((point) => point.id === activePointId) ?? null;
  const activePosition = activePoint
    ? projectedPoints.find(({ point }) => point.id === activePoint.id)?.position ?? null
    : null;
  const tooltipWidth = 240;
  const tooltipHeight = 84;
  const tooltipX = activePosition
    ? clamp(activePosition.x + 14, 10, VIEWBOX_WIDTH - tooltipWidth - 10)
    : 0;
  const tooltipY = activePosition
    ? clamp(activePosition.y - tooltipHeight - 12, 10, VIEWBOX_HEIGHT - tooltipHeight - 10)
    : 0;
  const latencyAxisStart = project({ x: -1, y: -1, z: -1 }, rotation);
  const latencyAxisEnd = project({ x: 1, y: -1, z: -1 }, rotation);
  const costAxisStart = project({ x: 1, y: -1, z: -1 }, rotation);
  const costAxisEnd = project({ x: 1, y: 1, z: -1 }, rotation);
  const qualityAxisStart = project({ x: -1, y: -1, z: -1 }, rotation);
  const qualityAxisEnd = project({ x: -1, y: -1, z: 1 }, rotation);
  const latencyCaption = axisCaption(latencyAxisStart, latencyAxisEnd);
  const costCaption = axisCaption(costAxisStart, costAxisEnd);
  const qualityCaption = axisCaption(qualityAxisStart, qualityAxisEnd);

  return (
    <section className="not-prose websearch-chart websearch-conclusion-3d my-8" aria-label="Interactive quality, latency, and cost comparison">
      <svg
        role="img"
        aria-labelledby="websearch-conclusion-svg-title websearch-conclusion-svg-description"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className="block h-auto w-full overflow-visible select-none"
        style={{ touchAction: "none", cursor: isDragging ? "grabbing" : "grab" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <title id="websearch-conclusion-svg-title">
          Interactive 3D comparison of AI-judged quality, p95 latency, and cost
        </title>
        <desc id="websearch-conclusion-svg-description">
          Each colored point is a search provider. Height shows mean AI-judged nDCG at 10,
          the horizontal axes show p95 latency and cost per 1,000 requests on logarithmic
          scales. Drag to rotate. Hover or select a point for exact values.
        </desc>

        <g aria-hidden="true">
          {CUBE_EDGES.map(([startIndex, endIndex]) => {
            const start = project(CUBE_CORNERS[startIndex], rotation);
            const end = project(CUBE_CORNERS[endIndex], rotation);
            return (
              <line
                key={`edge-${startIndex}-${endIndex}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="var(--post-muted)"
                strokeOpacity="0.75"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>

        <g
          aria-hidden="true"
          fill="var(--post-muted)"
          fontSize="10"
          fontFamily="var(--font-post-mono), ui-monospace, monospace"
        >
          {LATENCY_TICKS.map((value) => {
            const position = project(
              { x: normalizeLog(value, LATENCY_MIN, LATENCY_MAX), y: -1.06, z: -1.06 },
              rotation,
            );
            return (
              <text
                key={`latency-label-${value}`}
                x={position.x}
                y={position.y + 13}
                textAnchor="middle"
                transform={`rotate(${latencyCaption.angle} ${position.x} ${position.y + 13})`}
              >
                {value}
              </text>
            );
          })}
          {COST_TICKS.map((value) => {
            const position = project(
              { x: 1.06, y: normalizeLog(value, COST_MIN, COST_MAX), z: -1.06 },
              rotation,
            );
            return (
              <text
                key={`cost-label-${value}`}
                x={position.x}
                y={position.y + 2}
                textAnchor="middle"
                transform={`rotate(${costCaption.angle} ${position.x} ${position.y + 2})`}
              >
                {formatCost(value)}
              </text>
            );
          })}
          {QUALITY_TICKS.map((value) => {
            const position = project(
              { x: -1.06, y: -1.06, z: value * 2 - 1 },
              rotation,
            );
            return (
              <text
                key={`quality-label-${value}`}
                x={position.x - 8}
                y={position.y}
                textAnchor="middle"
                transform={`rotate(${qualityCaption.angle} ${position.x - 8} ${position.y})`}
              >
                {value.toFixed(1)}
              </text>
            );
          })}
        </g>

        {projectedPoints.map(({ point, position }) => {
          const isActive = point.id === selectedId || point.id === hoveredId;
          const labelOffset = LABEL_OFFSETS[point.id] ?? DEFAULT_LABEL_OFFSET;
          return (
            <g
              key={point.id}
              className="websearch-chart-mark"
              data-active={isActive}
              role="button"
              tabIndex={0}
              aria-label={`${point.label}: AI nDCG ${formatQuality(point.quality)}, p95 latency ${formatLatency(point.p95Latency)}, cost ${formatCost(point.costPerThousand)} per 1,000 requests`}
              onClick={() => {
                if (suppressClickRef.current) {
                  suppressClickRef.current = false;
                  return;
                }
                selectPoint(point.id);
              }}
              onKeyDown={(event) => handlePointKeyDown(event, point.id, selectPoint)}
              onMouseEnter={() => setHoveredId(point.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(point.id)}
              onBlur={() => setHoveredId(null)}
            >
              {isActive ? (
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={12}
                  fill="none"
                  stroke="var(--post-heading)"
                  strokeOpacity="0.85"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              ) : null}
              <circle
                cx={position.x}
                cy={position.y}
                r={isActive ? 7 : 6}
                fill={point.color}
                stroke="var(--post-background)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={position.x + labelOffset.x}
                y={position.y + labelOffset.y}
                fill={isActive ? "var(--post-heading)" : "var(--post-body)"}
                fontSize="14"
                fontFamily="var(--font-post-body), sans-serif"
                fontWeight={isActive ? 700 : 500}
                paintOrder="stroke"
                stroke="var(--post-background)"
                strokeWidth="5"
                strokeLinejoin="round"
              >
                {point.label}
              </text>
            </g>
          );
        })}

        <g
          aria-hidden="true"
          fill="var(--post-body)"
          fontSize="12"
          fontFamily="var(--font-post-body), sans-serif"
        >
          <text
            x={latencyCaption.x}
            y={latencyCaption.y}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${latencyCaption.angle} ${latencyCaption.x} ${latencyCaption.y})`}
          >
            p95 latency (ms, log scale)
          </text>
          <text
            x={qualityCaption.x}
            y={qualityCaption.y}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${qualityCaption.angle} ${qualityCaption.x} ${qualityCaption.y})`}
          >
            AI nDCG@10
          </text>
          <text
            x={costCaption.x}
            y={costCaption.y}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${costCaption.angle} ${costCaption.x} ${costCaption.y})`}
          >
            cost / 1,000 (log scale)
          </text>
        </g>

        {activePoint && activePosition ? (
          <g pointerEvents="none" aria-live="polite">
            <rect
              x={tooltipX}
              y={tooltipY}
              width={tooltipWidth}
              height={tooltipHeight}
              rx="6"
              fill="var(--post-background)"
              stroke="var(--post-border)"
              vectorEffect="non-scaling-stroke"
            />
            <text x={tooltipX + 12} y={tooltipY + 19} fill="var(--post-heading)" fontSize="14" fontWeight="700" fontFamily="var(--font-post-body), sans-serif">
              {activePoint.label}
            </text>
            <text x={tooltipX + 12} y={tooltipY + 39} fill="var(--post-body)" fontSize="13" fontFamily="var(--font-post-mono), ui-monospace, monospace">
              nDCG {formatQuality(activePoint.quality)}
            </text>
            <text x={tooltipX + 12} y={tooltipY + 57} fill="var(--post-body)" fontSize="13" fontFamily="var(--font-post-mono), ui-monospace, monospace">
              p95 {formatLatency(activePoint.p95Latency)}
            </text>
            <text x={tooltipX + 12} y={tooltipY + 75} fill="var(--post-body)" fontSize="13" fontFamily="var(--font-post-mono), ui-monospace, monospace">
              {formatCost(activePoint.costPerThousand)} / 1,000 requests
            </text>
          </g>
        ) : null}
      </svg>
    </section>
  );
}
