"use client";

import { useId, useState, type ReactNode } from "react";
import {
  ANCHOR_CATEGORY_HITS,
  ANCHOR_SUMMARIES,
  AGREEMENT_MATRIX,
  CATEGORY_IDS,
  CATEGORY_LABELS,
  LATENCY_VALUES,
  PAIRWISE_COMPARISONS,
  PROVIDER_COLORS,
  PROVIDER_LABELS,
  PROVIDER_SUMMARIES,
  PROVIDERS,
  QUALITY_CELLS,
  RANK_MEANS,
  SOURCE_ECOLOGY,
  SOURCE_HOSTS,
  type BenchmarkCategory,
  type ProviderId,
} from "./websearch-bench-data";

const chartFont = {
  fontFamily: "var(--font-post-body), Inter, system-ui, sans-serif",
};
const headingFont = {
  fontFamily: "var(--font-post-heading), var(--font-post-body), Inter, system-ui, sans-serif",
};

const SOURCE_COLORS = [
  "#5E6AD2",
  "#1FB8CD",
  "#FB631B",
  "#C77DFF",
  "#60FF70",
  "#E7B84B",
  "#E76F51",
  "#7EAE9A",
  "#8D99AE",
];

const QUALITY_HEATMAP_STOPS = [
  "#281532",
  "#4A1D4A",
  "#6B245E",
  "#8D2D73",
  "#AE3E8A",
  "#D55AA6",
  "#F18CCB",
];
const AGREEMENT_HEATMAP_STOPS = ["#22344B", "#2C5479", "#3676A5", "#4B98C2", "#86C0DC", "#C8E5F0"];
const DELTA_NEGATIVE_STOPS = ["#5C1F2B", "#91313C", "#C74747"];
const DELTA_POSITIVE_STOPS = ["#477A68", "#4F9A70", "#78C69B"];
const DELTA_LEGEND_STOPS = ["#5C1F2B", "#91313C", "#5A5962", "#4F9A70", "#78C69B"];
const CHART_GRID_STROKE = "var(--post-muted)";
const CHART_GRID_DASH = "4 4";
const CHART_GRID_OPACITY = 0.34;
const HEATMAP_TEXT_COLOR = "var(--post-heading)";
const ALL_LATENCY_VALUES = PROVIDERS.flatMap((provider) => LATENCY_VALUES[provider]);
const ECDF_LATENCY_MIN = Math.max(50, Math.floor(Math.min(...ALL_LATENCY_VALUES) / 100) * 100 - 20);
const ECDF_LATENCY_MAX = Math.ceil(Math.max(...ALL_LATENCY_VALUES) / 500) * 500;
const ECDF_LATENCY_TICKS = [100, 300, 500, 1000, 2000, 4000, 7000].filter(
  (tick) => tick >= ECDF_LATENCY_MIN && tick <= ECDF_LATENCY_MAX,
);
const TOOLTIP_MAX_CHARACTERS = 31;

type Point = { x: number; y: number };

function scale(value: number, domainMin: number, domainMax: number, rangeMin: number, rangeMax: number) {
  if (domainMax === domainMin) return (rangeMin + rangeMax) / 2;
  return rangeMin + ((value - domainMin) / (domainMax - domainMin)) * (rangeMax - rangeMin);
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function formatMs(value: number) {
  return `${Math.round(value).toLocaleString()} ms`;
}

function formatMoney(value: number) {
  return `$${value.toFixed(3)}`;
}

function formatPercent(value: number, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

function wrapTooltipLine(line: string, maxCharacters = TOOLTIP_MAX_CHARACTERS) {
  const words = line.split(/\s+/).flatMap((word) => {
    if (word.length <= maxCharacters) return [word];
    return word.match(new RegExp(`.{1,${maxCharacters}}`, "g")) ?? [word];
  });
  const wrapped: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (current && next.length > maxCharacters) {
      wrapped.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) wrapped.push(current);
  return wrapped;
}

function heatmapFill(value: number, stops: string[], minimum = 0, maximum = 1) {
  const normalized = clamp((value - minimum) / (maximum - minimum), 0, 1);
  const index = Math.min(stops.length - 1, Math.round(normalized * (stops.length - 1)));
  return stops[index];
}

function HeatmapLegend({
  x,
  y,
  label,
  stops,
  values,
  minimum = 0,
  maximum = 1,
}: {
  x: number;
  y: number;
  label: string;
  stops: string[];
  values: number[];
  minimum?: number;
  maximum?: number;
}) {
  return (
    <g aria-hidden="true">
      <text x={x} y={y} fill="var(--post-muted)" fontSize={12}>{label}</text>
      {values.map((value, index) => (
        <g key={value}>
          <rect x={x + index * 28} y={y + 9} width={22} height={10} rx={2} fill={heatmapFill(value, stops, minimum, maximum)} />
        </g>
      ))}
    </g>
  );
}

function ChartFrame({
  title,
  subtitle,
  description,
  width,
  height,
  children,
  onMouseLeave,
  compact = false,
  className,
  titleX = 64,
  titleY = 28,
  subtitleY = 49,
  titleFontSize = 18,
  subtitleFontSize = 13,
}: {
  title: string;
  subtitle: string;
  description: string;
  width: number;
  height: number;
  children: ReactNode;
  onMouseLeave?: () => void;
  compact?: boolean;
  className?: string;
  titleX?: number;
  titleY?: number;
  subtitleY?: number;
  titleFontSize?: number;
  subtitleFontSize?: number;
}) {
  const id = useId().replace(/:/g, "");
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  return (
    <div
      className={`not-prose websearch-chart my-10 w-full ${compact ? "websearch-chart-compact" : ""} ${className ?? ""}`}
      onMouseLeave={onMouseLeave}
    >
      <div className="overflow-x-auto" tabIndex={0} aria-label="Scrollable chart">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full overflow-visible select-none"
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
          style={{ ...chartFont, minWidth: compact ? undefined : width >= 1000 ? "760px" : undefined }}
        >
          <title id={titleId}>{title}</title>
          <desc id={descriptionId}>{description}</desc>
          <text
            x={titleX}
            y={titleY}
            fill="var(--post-heading)"
            fontSize={titleFontSize}
            fontWeight={700}
            style={headingFont}
          >
            {title}
          </text>
          {subtitle ? <text x={titleX} y={subtitleY} fill="var(--post-muted)" fontSize={subtitleFontSize}>{subtitle}</text> : null}
          {children}
        </svg>
      </div>
    </div>
  );
}

function Tooltip({
  x,
  y,
  lines,
  width,
  height,
  minimumY = 66,
}: {
  x: number;
  y: number;
  lines: string[];
  width: number;
  height: number;
  minimumY?: number;
}) {
  const tooltipLines = lines.flatMap((line) => wrapTooltipLine(line));
  const boxWidth = 236;
  const boxHeight = 18 + tooltipLines.length * 16;
  const left = clamp(x, 8, width - boxWidth - 8);
  const top = clamp(y, minimumY, height - boxHeight - 8);

  return (
    <g className="websearch-chart-tooltip" pointerEvents="none">
      <rect
        x={left}
        y={top}
        width={boxWidth}
        height={boxHeight}
        rx={5}
        fill="var(--post-background)"
        fillOpacity={0.98}
        stroke="var(--post-border)"
      />
      <text x={left + 11} y={top + 18} fill="var(--post-heading)" fontSize={12}>
        {tooltipLines.map((line, index) => (
          <tspan
            key={`${line}-${index}`}
            x={left + 11}
            dy={index === 0 ? 0 : 16}
            fontWeight={index === 0 ? 700 : 500}
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

type ProviderMetric = "cost" | "depth" | "shortList";

const PROVIDER_METRIC_CONFIG: Record<ProviderMetric, {
  title: string;
  subtitle: string;
  description: string;
  max: number;
  ticks: number[];
  axisLabel: string;
  value: (provider: (typeof PROVIDER_SUMMARIES)[number]) => number;
  format: (value: number) => string;
}> = {
  cost: {
    title: "Cost for 96 benchmark queries",
    subtitle: "Selected comparison basis from the benchmark billing estimates.",
    description: "Vertical columns compare the estimated cost for 96 searches. Lower is cheaper.",
    max: 1.25,
    ticks: [0, 0.25, 0.5, 0.75, 1, 1.25],
    axisLabel: "Estimated cost / 96 searches",
    value: (provider) => provider.cost,
    format: formatMoney,
  },
  depth: {
    title: "Result depth",
    subtitle: "Mean number of result slots returned when each request asked for ten.",
    description: "Vertical columns compare the mean number of returned result slots out of ten.",
    max: 10,
    ticks: [0, 2, 4, 6, 8, 10],
    axisLabel: "Mean results returned",
    value: (provider) => provider.meanResults,
    format: (value) => value.toFixed(2),
  },
  shortList: {
    title: "Short-list rate",
    subtitle: "Share of requests that returned fewer than the ten requested results.",
    description: "Vertical columns compare the share of requests that returned fewer than ten results.",
    max: 0.7,
    ticks: [0, 0.2, 0.4, 0.6],
    axisLabel: "Requests with fewer than ten results",
    value: (provider) => provider.shortListRate,
    format: (value) => formatPercent(value),
  },
};

function WebSearchProviderBars({ metric, compact = false }: { metric: ProviderMetric; compact?: boolean }) {
  const config = PROVIDER_METRIC_CONFIG[metric];
  const [hovered, setHovered] = useState<ProviderId | null>(null);
  // The pair is rendered at roughly half the width of a normal chart. Give it
  // its own coordinate space so labels keep the same optical size as the
  // single-column charts instead of shrinking with a 1000-unit viewBox.
  const width = compact ? 560 : 1000;
  const height = compact ? 360 : 560;
  const left = compact ? 34 : 92;
  const right = compact ? 14 : 24;
  const top = compact ? 48 : 82;
  const bottom = compact ? 64 : 100;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const baseline = top + chartHeight;
  const columnWidth = chartWidth / PROVIDER_SUMMARIES.length;
  const barWidth = columnWidth * 0.58;
  const y = (value: number) => scale(value, 0, config.max, baseline, top);
  const hoveredIndex = hovered ? PROVIDER_SUMMARIES.findIndex((provider) => provider.id === hovered) : -1;
  const hoveredProvider = hoveredIndex >= 0 ? PROVIDER_SUMMARIES[hoveredIndex] : null;
  const hoveredValue = hoveredProvider ? config.value(hoveredProvider) : 0;
  const hoveredCenterX = hoveredIndex >= 0 ? left + hoveredIndex * columnWidth + columnWidth / 2 : 0;
  const hoveredBarY = hoveredProvider ? baseline - Math.max(3, baseline - y(hoveredValue)) : 0;

  return (
    <ChartFrame
      title={config.title}
      subtitle={compact ? "" : config.subtitle}
      compact={compact}
      description={config.description}
      width={width}
      height={height}
      onMouseLeave={() => setHovered(null)}
      titleX={compact ? 34 : 64}
      titleY={compact ? 24 : 28}
      titleFontSize={compact ? 14 : 18}
    >
      {config.ticks.map((tick) => {
        const yPosition = y(tick);
        return (
          <g key={tick}>
            <line
              x1={left}
              y1={yPosition}
              x2={left + chartWidth}
              y2={yPosition}
              stroke={CHART_GRID_STROKE}
              strokeDasharray={CHART_GRID_DASH}
              strokeOpacity={tick === 0 ? 0.9 : CHART_GRID_OPACITY}
            />
            {!compact ? (
              <text x={left - 12} y={yPosition + 4} textAnchor="end" fill="var(--post-muted)" fontSize={13}>
                {config.format(tick)}
              </text>
            ) : null}
          </g>
        );
      })}
      <line x1={left} y1={baseline} x2={left + chartWidth} y2={baseline} stroke="var(--post-muted)" strokeOpacity={0.9} />
      <line x1={left} y1={top} x2={left} y2={baseline} stroke="var(--post-muted)" strokeOpacity={0.7} />
      {!compact ? (
        <text x={10} y={top + chartHeight / 2} transform={`rotate(-90 10 ${top + chartHeight / 2})`} textAnchor="middle" fill="var(--post-muted)" fontSize={12}>
          {config.axisLabel}
        </text>
      ) : null}
      {PROVIDER_SUMMARIES.map((provider, index) => {
        const value = config.value(provider);
        const centerX = left + index * columnWidth + columnWidth / 2;
        const barHeight = value === 0 ? 3 : Math.max(3, baseline - y(value));
        const barY = baseline - barHeight;
        const isHovered = hovered === provider.id;
        const isDimmed = hovered !== null && !isHovered;
        return (
          <g
            key={provider.id}
            className="websearch-chart-mark"
            data-active={isHovered}
            opacity={isDimmed ? 0.28 : 1}
            onMouseEnter={() => setHovered(provider.id)}
          >
            <rect x={centerX - columnWidth / 2} y={top} width={columnWidth} height={chartHeight} fill="transparent" />
            {isHovered ? <line x1={centerX} y1={top} x2={centerX} y2={baseline} stroke={PROVIDER_COLORS[provider.id]} strokeDasharray="4 5" strokeOpacity={0.45} /> : null}
            <rect
              x={centerX - barWidth / 2}
              y={barY}
              width={barWidth}
              height={barHeight}
              rx={3}
              fill={PROVIDER_COLORS[provider.id]}
              fillOpacity={isHovered ? 1 : 0.82}
            />
            <text x={centerX} y={barY - 8} textAnchor="middle" fill="var(--post-heading)" fontSize={13} fontWeight={isHovered ? 700 : 500}>
              {config.format(value)}
            </text>
            <text
              x={centerX - 4}
              y={baseline + 16}
              textAnchor="end"
              transform={`rotate(-38 ${centerX - 4} ${baseline + 16})`}
              fill="var(--post-heading)"
              fontSize={13}
              fontWeight={isHovered ? 700 : 500}
            >
              {PROVIDER_LABELS[provider.id]}
            </text>
          </g>
        );
      })}
      {hoveredProvider ? (
        <Tooltip
          x={hoveredCenterX - 98}
          y={hoveredBarY - 112}
          width={width}
          height={height}
          lines={[
            PROVIDER_LABELS[hoveredProvider.id],
            `${config.axisLabel}: ${config.format(hoveredValue)}`,
            metric === "shortList"
              ? `${hoveredProvider.shortListCount} of 96 requests`
              : "96 benchmark queries",
          ]}
        />
      ) : null}
      {!compact ? (
        <text x={12} y={height - 8} fill="var(--post-muted)" fontSize={13}>
          {metric === "shortList" ? "Lower is better" : metric === "cost" ? "Lower is cheaper" : "Higher is better"}
        </text>
      ) : null}
    </ChartFrame>
  );
}

export function WebSearchCostGraph() {
  return <WebSearchProviderBars metric="cost" />;
}

export function WebSearchDepthGraph({ compact = false }: { compact?: boolean }) {
  return <WebSearchProviderBars metric="depth" compact={compact} />;
}

export function WebSearchShortListGraph({ compact = false }: { compact?: boolean }) {
  return <WebSearchProviderBars metric="shortList" compact={compact} />;
}

export function WebSearchLatencySummaryGraph() {
  const [hovered, setHovered] = useState<ProviderId | null>(null);
  const ordered = PROVIDER_SUMMARIES;
  const width = 1000;
  const height = 570;
  const left = 92;
  const right = 24;
  const top = 88;
  const bottom = 100;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const baseline = top + chartHeight;
  const columnWidth = chartWidth / ordered.length;
  const barWidth = columnWidth * 0.25;
  const ticks = [0, 1000, 2000, 3000, 4000];
  const y = (value: number) => scale(value, 0, 4000, baseline, top);
  const hoveredProvider = hovered ? ordered.find((provider) => provider.id === hovered) ?? null : null;
  const hoveredIndex = hovered ? ordered.findIndex((provider) => provider.id === hovered) : -1;
  const hoveredCenterX = hoveredIndex >= 0 ? left + hoveredIndex * columnWidth + columnWidth / 2 : 0;
  const hoveredTooltipY = hoveredProvider
    ? Math.min(y(hoveredProvider.p95), y(hoveredProvider.p50)) - 108
    : 0;

  return (
    <ChartFrame
      title="Response latency"
      subtitle="Median and p95 latency across the 96 requests for each provider."
      description="Paired columns compare each provider's median and p95 latency. Shorter is faster."
      width={width}
      height={height}
      onMouseLeave={() => setHovered(null)}
    >
      <g>
        <rect x={width - 180} y={68} width={14} height={12} rx={2} fill="#4F83CC" />
        <text x={width - 158} y={78} fill="var(--post-muted)" fontSize={13}>p50</text>
        <rect x={width - 105} y={68} width={14} height={12} rx={2} fill="#D4866D" />
        <text x={width - 83} y={78} fill="var(--post-muted)" fontSize={13}>p95</text>
      </g>
      {ticks.map((tick) => {
        const yPosition = y(tick);
        return (
          <g key={tick}>
            <line x1={left} y1={yPosition} x2={left + chartWidth} y2={yPosition} stroke={CHART_GRID_STROKE} strokeDasharray={CHART_GRID_DASH} strokeOpacity={tick === 0 ? 0.9 : CHART_GRID_OPACITY} />
            <text x={left - 12} y={yPosition + 4} textAnchor="end" fill="var(--post-muted)" fontSize={13}>{tick === 0 ? "0" : `${tick / 1000}s`}</text>
          </g>
        );
      })}
      <line x1={left} y1={baseline} x2={left + chartWidth} y2={baseline} stroke="var(--post-muted)" strokeOpacity={0.9} />
      <line x1={left} y1={top} x2={left} y2={baseline} stroke="var(--post-muted)" strokeOpacity={0.7} />
      <text x={10} y={top + chartHeight / 2} transform={`rotate(-90 10 ${top + chartHeight / 2})`} textAnchor="middle" fill="var(--post-muted)" fontSize={12}>Response latency</text>
      {ordered.map((provider, index) => {
        const centerX = left + index * columnWidth + columnWidth / 2;
        const p50Height = Math.max(3, baseline - y(provider.p50));
        const p95Height = Math.max(3, baseline - y(provider.p95));
        const p50X = centerX - barWidth - 2;
        const p95X = centerX + 2;
        const isHovered = hovered === provider.id;
        return (
          <g
            key={provider.id}
            className="websearch-chart-mark"
            data-active={isHovered}
            opacity={hovered && !isHovered ? 0.24 : 1}
            onMouseEnter={() => setHovered(provider.id)}
          >
            <rect x={p50X} y={baseline - p50Height} width={barWidth} height={p50Height} rx={2} fill="#4F83CC" fillOpacity={isHovered ? 1 : 0.82} />
            <rect x={p95X} y={baseline - p95Height} width={barWidth} height={p95Height} rx={2} fill="#D4866D" fillOpacity={isHovered ? 1 : 0.82} />
            <text x={p50X + barWidth / 2} y={baseline - p50Height - 8} textAnchor="middle" fill="var(--post-heading)" fontSize={12}>{Math.round(provider.p50)}</text>
            <text x={p95X + barWidth / 2} y={baseline - p95Height - 8} textAnchor="middle" fill="var(--post-heading)" fontSize={12}>{Math.round(provider.p95)}</text>
            <text x={centerX - 4} y={baseline + 16} textAnchor="end" transform={`rotate(-38 ${centerX - 4} ${baseline + 16})`} fill="var(--post-heading)" fontSize={13} fontWeight={isHovered ? 700 : 500}>
              {PROVIDER_LABELS[provider.id]}
            </text>
          </g>
        );
      })}
      {hoveredProvider ? (
        <Tooltip
          x={hoveredCenterX - 98}
          y={hoveredTooltipY}
          width={width}
          height={height}
          lines={[PROVIDER_LABELS[hoveredProvider.id], `p50: ${formatMs(hoveredProvider.p50)}`, `p95: ${formatMs(hoveredProvider.p95)}`]}
        />
      ) : null}
      <text x={12} y={height - 8} fill="var(--post-muted)" fontSize={13}>Shorter is faster</text>
    </ChartFrame>
  );
}

function ecdfPath(values: number[], x: (value: number) => number, y: (value: number) => number) {
  if (values.length === 0) return "";
  const firstX = x(values[0]);
  let path = `M ${Math.max(x(ECDF_LATENCY_MIN), firstX - 8)} ${y(0)} L ${firstX} ${y(0)}`;
  values.forEach((value, index) => {
    const previousY = index / values.length;
    const nextY = (index + 1) / values.length;
    path += ` L ${x(value)} ${y(previousY)} L ${x(value)} ${y(nextY)}`;
  });
  return path;
}

export function WebSearchLatencyDistributionGraph() {
  const [hovered, setHovered] = useState<ProviderId | null>(null);
  const left = 70;
  const right = 34;
  const top = 116;
  const bottom = 104;
  const width = 1064;
  const height = 591;
  const plotLeft = left;
  const plotRight = width - right;
  const chartWidth = plotRight - plotLeft;
  const plotTop = 120;
  const plotBottom = height - bottom;
  const x = (value: number) => clamp(
    scale(Math.log(value), Math.log(ECDF_LATENCY_MIN), Math.log(ECDF_LATENCY_MAX), plotLeft, plotRight),
    plotLeft,
    plotRight,
  );
  const y = (value: number) => clamp(scale(value, 0, 1, plotBottom, plotTop), plotTop, plotBottom);
  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const hoveredProvider = hovered ? PROVIDER_SUMMARIES.find((provider) => provider.id === hovered) ?? null : null;
  const hoveredValues = hovered ? LATENCY_VALUES[hovered] : null;

  return (
    <ChartFrame
      title="Latency distribution"
      subtitle="ECDF of successful requests on a log-scaled latency axis. Earlier rises are faster."
      description="The empirical cumulative distribution shows the fraction of successful requests completed by each latency."
      width={width}
      height={height}
      onMouseLeave={() => setHovered(null)}
      titleX={70}
      titleY={42}
      subtitleY={70}
    >
      {yTicks.map((tick) => {
        const yPosition = y(tick);
        return (
          <g key={tick}>
            <line x1={plotLeft} y1={yPosition} x2={plotRight} y2={yPosition} stroke={CHART_GRID_STROKE} strokeDasharray={CHART_GRID_DASH} strokeOpacity={CHART_GRID_OPACITY} />
            <text x={left - 12} y={yPosition + 4} textAnchor="end" fill="var(--post-muted)" fontSize={13}>{formatPercent(tick, 0)}</text>
          </g>
        );
      })}
      {ECDF_LATENCY_TICKS.map((tick) => {
        const xPosition = x(tick);
        return (
          <g key={tick}>
            <line x1={xPosition} y1={plotTop} x2={xPosition} y2={plotBottom} stroke={CHART_GRID_STROKE} strokeDasharray={CHART_GRID_DASH} strokeOpacity={CHART_GRID_OPACITY} />
            <text x={xPosition} y={plotBottom + 23} textAnchor="middle" fill="var(--post-muted)" fontSize={13}>{tick >= 1000 ? `${tick / 1000}s` : `${tick}ms`}</text>
          </g>
        );
      })}
      <line x1={plotLeft} y1={plotBottom} x2={plotRight} y2={plotBottom} stroke="var(--post-muted)" strokeOpacity={0.72} />
      <line x1={plotLeft} y1={plotTop} x2={plotLeft} y2={plotBottom} stroke="var(--post-muted)" strokeOpacity={0.55} />
      {PROVIDERS.map((provider) => {
        const values = LATENCY_VALUES[provider];
        const path = ecdfPath(values, x, y);
        const isHovered = hovered === provider;
        return (
          <g
            key={provider}
            className="websearch-chart-mark"
            data-active={isHovered}
            opacity={hovered && !isHovered ? 0.18 : 1}
            onMouseEnter={() => setHovered(provider)}
          >
            <path d={path} fill="none" stroke={PROVIDER_COLORS[provider]} strokeWidth={isHovered ? 3.5 : 2} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={hovered && !isHovered ? 0.18 : 0.9} />
            <path d={path} fill="none" stroke="transparent" strokeWidth={12} />
          </g>
        );
      })}
      {hoveredProvider && hoveredValues ? (
        <Tooltip
          x={left + chartWidth * 0.63}
          y={top + 8}
          width={width}
          height={height}
          lines={[PROVIDER_LABELS[hoveredProvider.id], `p50: ${formatMs(hoveredProvider.p50)}`, `p95: ${formatMs(hoveredProvider.p95)}`, `n = ${hoveredValues.length} successful requests`]}
        />
      ) : null}
      <g transform={`translate(12, ${height - 34})`}>
        {PROVIDERS.map((provider, index) => (
          <g key={provider} transform={`translate(${(index % 4) * 205}, ${Math.floor(index / 4) * 24})`}>
            <line x1={0} y1={-4} x2={18} y2={-4} stroke={PROVIDER_COLORS[provider]} strokeWidth={2.5} />
            <text x={25} y={0} fill="var(--post-muted)" fontSize={12}>{PROVIDER_LABELS[provider]}</text>
          </g>
        ))}
      </g>
    </ChartFrame>
  );
}

type QualityMode = "heuristic" | "ai" | "delta";

function qualityModeLabel(mode: QualityMode) {
  if (mode === "ai") return "AI-judged";
  if (mode === "delta") return "AI judge minus heuristic";
  return "Metadata-heuristic";
}

function qualityModeValue(cell: { heuristic: number; ai: number; delta: number }, mode: QualityMode) {
  return cell[mode];
}

function qualityCellColor(value: number, mode: QualityMode) {
  if (mode === "delta") {
    if (Math.abs(value) < 0.02) return DELTA_LEGEND_STOPS[2];
    return value >= 0
      ? heatmapFill(value, DELTA_POSITIVE_STOPS, 0, 0.6)
      : heatmapFill(Math.abs(value), DELTA_NEGATIVE_STOPS, 0, 0.6);
  }
  return heatmapFill(value, QUALITY_HEATMAP_STOPS);
}

export function WebSearchQualityHeatmap({ mode = "heuristic" }: { mode?: QualityMode }) {
  const [hovered, setHovered] = useState<{ provider: ProviderId; category: BenchmarkCategory } | null>(null);
  const width = 1120;
  const left = 116;
  const top = 98;
  const right = 20;
  const rowHeight = 32.5;
  const cellWidth = (width - left - right) / CATEGORY_IDS.length;
  const gridHeight = rowHeight * PROVIDERS.length;
  // Keep the diagonal labels close enough to read as column headers, while
  // reserving a separate footer band below their longest rendered edge.
  const categoryLabelY = top + gridHeight + 17;
  const footerY = categoryLabelY + 76;
  const height = footerY + 24;
  const findCell = (provider: ProviderId, category: BenchmarkCategory) =>
    QUALITY_CELLS.find((cell) => cell.provider === provider && cell.category === category)!;
  const hoveredCell = hovered ? findCell(hovered.provider, hovered.category) : null;

  return (
    <ChartFrame
      title={`${qualityModeLabel(mode)} nDCG@10 by category`}
      subtitle={mode === "delta" ? "Positive values mean the blind AI judge scored higher than the metadata heuristic." : "Each cell is the mean nDCG@10 across eight queries in that category."}
      description={`${qualityModeLabel(mode)} quality heatmap with one row per provider and one column per benchmark category.`}
      width={width}
      height={height}
      onMouseLeave={() => setHovered(null)}
      titleX={70}
      titleY={30}
      subtitleY={55}
      titleFontSize={18}
    >
      {!hovered ? (
        <HeatmapLegend
          x={width - 320}
          y={64}
          label={mode === "delta" ? "negative / positive" : "lower / higher"}
          stops={mode === "delta" ? DELTA_LEGEND_STOPS : QUALITY_HEATMAP_STOPS}
          values={mode === "delta" ? [-0.6, -0.3, 0, 0.3, 0.6] : [0, 0.2, 0.4, 0.6, 0.8, 1]}
          minimum={mode === "delta" ? -0.6 : 0}
          maximum={mode === "delta" ? 0.6 : 1}
        />
      ) : null}
      {CATEGORY_IDS.map((category, index) => {
        const x = left + index * cellWidth + cellWidth / 2;
        return <text key={category} x={x} y={categoryLabelY} textAnchor="end" transform={`rotate(-34 ${x} ${categoryLabelY})`} fill="var(--post-muted)" fontSize={13}>{CATEGORY_LABELS[category]}</text>;
      })}
      {PROVIDERS.map((provider, rowIndex) => (
        <g key={provider}>
          <text x={left - 14} y={top + rowIndex * rowHeight + rowHeight / 2} dominantBaseline="middle" textAnchor="end" fill="var(--post-heading)" fontSize={13}>
            {PROVIDER_LABELS[provider]}
          </text>
          {CATEGORY_IDS.map((category, columnIndex) => {
            const cell = findCell(provider, category);
            const value = qualityModeValue(cell, mode);
            const x = left + columnIndex * cellWidth;
            const y = top + rowIndex * rowHeight;
            const isHovered = hovered?.provider === provider && hovered.category === category;
            return (
              <g key={`${provider}-${category}`} className="websearch-chart-mark" data-active={isHovered} onMouseEnter={() => setHovered({ provider, category })}>
                <rect x={x + 1} y={y + 1} width={cellWidth - 2} height={rowHeight - 2} rx={3} fill={qualityCellColor(value, mode)} stroke={isHovered ? "var(--post-heading)" : "var(--post-background)"} strokeOpacity={0.72} strokeWidth={isHovered ? 2 : 1} />
                <text x={x + cellWidth / 2} y={y + rowHeight / 2} dominantBaseline="middle" textAnchor="middle" fill={HEATMAP_TEXT_COLOR} stroke="var(--post-background)" strokeWidth={3} paintOrder="stroke" fontSize={13} fontWeight={isHovered ? 700 : 500}>
                  {value >= 0 && mode === "delta" ? "+" : ""}{value.toFixed(2)}
                </text>
              </g>
            );
          })}
        </g>
      ))}
      <text x={12} y={height - 8} fill="var(--post-muted)" fontSize={13}>{mode === "delta" ? "Difference in nDCG@10; zero is neutral" : "Cell color encodes mean nDCG@10; higher is better"}</text>
      {hovered && hoveredCell ? (
        <Tooltip
          x={width - 258}
          y={8}
          width={width}
          height={height}
          minimumY={8}
          lines={[`${PROVIDER_LABELS[hovered.provider]} / ${CATEGORY_LABELS[hovered.category]}`, `${qualityModeLabel(mode)}: ${qualityModeValue(hoveredCell, mode).toFixed(3)}`, mode === "delta" ? `Heuristic: ${hoveredCell.heuristic.toFixed(3)}` : `AI judge: ${hoveredCell.ai.toFixed(3)}`]}
        />
      ) : null}
    </ChartFrame>
  );
}

const QUALITY_COST_LABEL_OFFSETS: Record<ProviderId, Point> = {
  brave: { x: 10, y: -10 },
  context: { x: 10, y: 18 },
  exa: { x: 10, y: -10 },
  kagi_session: { x: -42, y: -12 },
  octen: { x: 10, y: 17 },
  parallel: { x: -58, y: -12 },
  perplexity: { x: 10, y: -10 },
  tavily: { x: 10, y: 18 },
};

const RETRIEVAL_LATENCY_LABEL_OFFSETS: Record<ProviderId, Point> = {
  brave: { x: 10, y: -10 },
  context: { x: 10, y: 18 },
  exa: { x: 10, y: 18 },
  kagi_session: { x: -48, y: 18 },
  octen: { x: 10, y: 18 },
  parallel: { x: -120, y: -14 },
  perplexity: { x: 10, y: -12 },
  tavily: { x: 10, y: 18 },
};

export function WebSearchQualityCostGraph({ mode = "heuristic" }: { mode?: "heuristic" | "ai" }) {
  const [hovered, setHovered] = useState<ProviderId | null>(null);
  const width = 1000;
  const height = 490;
  const left = 70;
  const right = 28;
  const top = 86;
  const bottom = 64;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const x = (value: number) => scale(value, 0, 1.25, left, left + chartWidth);
  const y = (value: number) => scale(value, 0, 1, top + chartHeight, top);
  const targetX = x(0.6);
  const targetY = y(0.6);
  const valueLabel = mode === "ai" ? "AI-judged nDCG@10" : "Metadata-heuristic nDCG@10";
  const hoveredProvider = hovered ? PROVIDER_SUMMARIES.find((provider) => provider.id === hovered) ?? null : null;
  const hoveredValue = hoveredProvider ? mode === "ai" ? hoveredProvider.ai : hoveredProvider.heuristic : 0;
  const hoveredPointX = hoveredProvider ? x(hoveredProvider.cost) : 0;
  const hoveredPointY = hoveredProvider ? y(hoveredValue) : 0;

  return (
    <ChartFrame
      title={`${valueLabel} versus cost`}
      subtitle="One point per provider. Cost is the selected estimate for 96 searches."
      description={`${valueLabel} plotted against estimated cost for 96 searches. Higher quality and lower cost are preferable.`}
      width={width}
      height={height}
      onMouseLeave={() => setHovered(null)}
    >
      <rect x={left} y={y(1)} width={targetX - left} height={targetY - y(1)} fill="var(--post-accent)" fillOpacity={0.06} />
      <text x={left + 8} y={y(0.6) - 8} fill="var(--post-muted)" fontSize={12}>illustrative target region</text>
      <line x1={targetX} y1={top} x2={targetX} y2={top + chartHeight} stroke="var(--post-muted)" strokeDasharray="4 5" strokeOpacity={0.45} />
      <line x1={left} y1={targetY} x2={left + chartWidth} y2={targetY} stroke="var(--post-muted)" strokeDasharray="4 5" strokeOpacity={0.45} />
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
        const yPosition = y(tick);
        return (
          <g key={tick}>
            <line x1={left} y1={yPosition} x2={left + chartWidth} y2={yPosition} stroke={CHART_GRID_STROKE} strokeDasharray={CHART_GRID_DASH} strokeOpacity={CHART_GRID_OPACITY} />
            <text x={left - 12} y={yPosition + 4} textAnchor="end" fill="var(--post-muted)" fontSize={13}>{tick.toFixed(2)}</text>
          </g>
        );
      })}
      <line x1={left} y1={top + chartHeight} x2={left + chartWidth} y2={top + chartHeight} stroke="var(--post-muted)" strokeOpacity={0.9} />
      <line x1={left} y1={top} x2={left} y2={top + chartHeight} stroke="var(--post-muted)" strokeOpacity={0.7} />
      {[0, 0.25, 0.5, 0.75, 1, 1.25].map((tick) => {
        const xPosition = x(tick);
        return (
          <g key={tick}>
            <line x1={xPosition} y1={top} x2={xPosition} y2={top + chartHeight} stroke={CHART_GRID_STROKE} strokeDasharray={CHART_GRID_DASH} strokeOpacity={CHART_GRID_OPACITY} />
            <text x={xPosition} y={top + chartHeight + 24} textAnchor="middle" fill="var(--post-muted)" fontSize={13}>{formatMoney(tick)}</text>
          </g>
        );
      })}
      {PROVIDER_SUMMARIES.map((provider) => {
        const value = mode === "ai" ? provider.ai : provider.heuristic;
        const pointX = x(provider.cost);
        const pointY = y(value);
        const offset = QUALITY_COST_LABEL_OFFSETS[provider.id];
        const isHovered = hovered === provider.id;
        return (
          <g key={provider.id} className="websearch-chart-mark" data-active={isHovered} onMouseEnter={() => setHovered(provider.id)} opacity={hovered && !isHovered ? 0.25 : 1}>
            <circle cx={pointX} cy={pointY} r={isHovered ? 8 : 6} fill={PROVIDER_COLORS[provider.id]} stroke="var(--post-background)" strokeWidth={2} />
            <text x={pointX + offset.x} y={pointY + offset.y} fill="var(--post-heading)" fontSize={13} fontWeight={isHovered ? 700 : 500}>{PROVIDER_LABELS[provider.id]}</text>
          </g>
        );
      })}
      {hoveredProvider ? (
        <Tooltip
          x={hoveredPointX + 16}
          y={hoveredPointY - 76}
          width={width}
          height={height}
          lines={[PROVIDER_LABELS[hoveredProvider.id], `${valueLabel}: ${hoveredValue.toFixed(3)}`, `Cost / 96: ${formatMoney(hoveredProvider.cost)}`]}
        />
      ) : null}
      <text x={12} y={height - 8} fill="var(--post-muted)" fontSize={13}>Lower cost is left. Higher quality is up.</text>
    </ChartFrame>
  );
}

export function WebSearchRetrievalSuccessGraph() {
  const [hovered, setHovered] = useState<ProviderId | null>(null);
  const ordered = [...ANCHOR_SUMMARIES].sort((a, b) => a.hit10 - b.hit10);
  const width = 1000;
  const height = 430;
  const left = 128;
  const right = 30;
  const top = 88;
  const rowHeight = 35;
  const chartWidth = width - left - right;
  const chartHeight = rowHeight * ordered.length;
  const x = (value: number) => scale(value, 0, 1, left, left + chartWidth);
  const hoveredProvider = hovered ? ordered.find((provider) => provider.id === hovered) ?? null : null;
  const hoveredIndex = hovered ? ordered.findIndex((provider) => provider.id === hovered) : -1;
  const hoveredY = hoveredIndex >= 0 ? top + hoveredIndex * rowHeight + 15 : 0;

  return (
    <ChartFrame
      title="Overall retrieval success"
      subtitle="Gold URL hit rate at rank 1 and anywhere in the first 10 results."
      description="Dumbbell rows compare each provider's gold URL hit rate at rank 1 and rank 10."
      width={width}
      height={height}
      onMouseLeave={() => setHovered(null)}
    >
      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((tick) => {
        const xPosition = x(tick);
        return (
          <g key={tick}>
            <line x1={xPosition} y1={top} x2={xPosition} y2={top + chartHeight} stroke={CHART_GRID_STROKE} strokeDasharray={CHART_GRID_DASH} strokeOpacity={CHART_GRID_OPACITY} />
            <text x={xPosition} y={top + chartHeight + 24} textAnchor="middle" fill="var(--post-muted)" fontSize={13}>{formatPercent(tick, 0)}</text>
          </g>
        );
      })}
      <g>
        <circle cx={790} cy={68} r={5} fill="var(--post-heading)" />
        <text x={802} y={72} fill="var(--post-muted)" fontSize={13}>hit@1</text>
        <circle cx={864} cy={68} r={8} fill="var(--post-heading)" fillOpacity={0.38} />
        <text x={878} y={72} fill="var(--post-muted)" fontSize={13}>hit@10</text>
      </g>
      {ordered.map((provider, index) => {
        const y = top + index * rowHeight + 15;
        const x1 = x(provider.hit1);
        const x10 = x(provider.hit10);
        const isHovered = hovered === provider.id;
        return (
          <g key={provider.id} className="websearch-chart-mark" data-active={isHovered} onMouseEnter={() => setHovered(provider.id)} opacity={hovered && !isHovered ? 0.25 : 1}>
            <text x={left - 14} y={y + 4} textAnchor="end" fill="var(--post-heading)" fontSize={13} fontWeight={isHovered ? 700 : 500}>{PROVIDER_LABELS[provider.id]}</text>
            <line x1={x1} y1={y} x2={x10} y2={y} stroke={PROVIDER_COLORS[provider.id]} strokeOpacity={0.5} strokeWidth={5} strokeLinecap="round" />
            <circle cx={x1} cy={y} r={5} fill={PROVIDER_COLORS[provider.id]} />
            <circle cx={x10} cy={y} r={8} fill={PROVIDER_COLORS[provider.id]} fillOpacity={0.48} />
          </g>
        );
      })}
      {hoveredProvider ? (
        <Tooltip
          x={x(hoveredProvider.hit10) + 12}
          y={hoveredY - 54}
          width={width}
          height={height}
          lines={[PROVIDER_LABELS[hoveredProvider.id], `hit@1: ${formatPercent(hoveredProvider.hit1)}`, `hit@10: ${formatPercent(hoveredProvider.hit10)}`, `${hoveredProvider.gradedQueries} gradable queries`]}
        />
      ) : null}
      <text x={12} y={height - 8} fill="var(--post-muted)" fontSize={13}>Gold URL matching on the Octen anchor set</text>
    </ChartFrame>
  );
}

export function WebSearchRetrievalLatencyGraph() {
  const [hovered, setHovered] = useState<ProviderId | null>(null);
  const width = 1000;
  const height = 490;
  const left = 70;
  const right = 28;
  const top = 88;
  const bottom = 64;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const xMax = 7000;
  const x = (value: number) => scale(value, 0, xMax, left, left + chartWidth);
  const y = (value: number) => scale(value, 0, 1, top + chartHeight, top);
  const hoveredProvider = hovered ? ANCHOR_SUMMARIES.find((provider) => provider.id === hovered) ?? null : null;
  const hoveredPointX = hoveredProvider ? x(hoveredProvider.p95) : 0;
  const hoveredPointY = hoveredProvider ? y(hoveredProvider.hit10) : 0;

  return (
    <ChartFrame
      title="Retrieval success versus tail latency"
      subtitle="Each point is one provider from the Octen anchor run. Lower latency and higher hit@10 are preferable."
      description="A scatter plot compares p95 latency with the share of anchor queries whose gold URL appeared in the first ten results."
      width={width}
      height={height}
      onMouseLeave={() => setHovered(null)}
    >
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
        const yPosition = y(tick);
        return (
          <g key={tick}>
            <line x1={left} y1={yPosition} x2={left + chartWidth} y2={yPosition} stroke={CHART_GRID_STROKE} strokeDasharray={CHART_GRID_DASH} strokeOpacity={CHART_GRID_OPACITY} />
            <text x={left - 12} y={yPosition + 4} textAnchor="end" fill="var(--post-muted)" fontSize={13}>{formatPercent(tick, 0)}</text>
          </g>
        );
      })}
      <line x1={left} y1={top + chartHeight} x2={left + chartWidth} y2={top + chartHeight} stroke="var(--post-muted)" strokeOpacity={0.9} />
      <line x1={left} y1={top} x2={left} y2={top + chartHeight} stroke="var(--post-muted)" strokeOpacity={0.7} />
      {[0, 2000, 4000, 6000].map((tick) => {
        const xPosition = x(tick);
        return (
          <g key={tick}>
            <line x1={xPosition} y1={top} x2={xPosition} y2={top + chartHeight} stroke={CHART_GRID_STROKE} strokeDasharray={CHART_GRID_DASH} strokeOpacity={CHART_GRID_OPACITY} />
            <text x={xPosition} y={top + chartHeight + 24} textAnchor="middle" fill="var(--post-muted)" fontSize={13}>{tick === 0 ? "0" : `${tick / 1000}s`}</text>
          </g>
        );
      })}
      {ANCHOR_SUMMARIES.map((provider) => {
        const pointX = x(provider.p95);
        const pointY = y(provider.hit10);
        const offset = RETRIEVAL_LATENCY_LABEL_OFFSETS[provider.id];
        const isHovered = hovered === provider.id;
        return (
          <g key={provider.id} className="websearch-chart-mark" data-active={isHovered} opacity={hovered && !isHovered ? 0.25 : 1} onMouseEnter={() => setHovered(provider.id)}>
            <circle cx={pointX} cy={pointY} r={isHovered ? 8 : 6} fill={PROVIDER_COLORS[provider.id]} stroke="var(--post-background)" strokeWidth={2} />
            <text x={pointX + offset.x} y={pointY + offset.y} fill="var(--post-heading)" fontSize={13} fontWeight={isHovered ? 700 : 500}>{PROVIDER_LABELS[provider.id]}</text>
          </g>
        );
      })}
      {hoveredProvider ? (
        <Tooltip
          x={hoveredPointX + 16}
          y={hoveredPointY - 72}
          width={width}
          height={height}
          lines={[PROVIDER_LABELS[hoveredProvider.id], `hit@10: ${formatPercent(hoveredProvider.hit10)}`, `p95: ${formatMs(hoveredProvider.p95)}`]}
        />
      ) : null}
      <text x={12} y={height - 8} fill="var(--post-muted)" fontSize={13}>p95 latency (lower is faster)</text>
    </ChartFrame>
  );
}

export function WebSearchHitHeatmap({ rank = 10 }: { rank?: 1 | 10 }) {
  const [hovered, setHovered] = useState<{ provider: ProviderId; category: string } | null>(null);
  const width = 1100;
  const left = 112;
  const top = 88;
  const right = 20;
  const rowHeight = 35;
  const categories = ANCHOR_CATEGORY_HITS.brave;
  const cellWidth = (width - left - right) / categories.length;
  const gridHeight = rowHeight * PROVIDERS.length;
  const categoryLabelY = top + gridHeight + 17;
  const footerY = categoryLabelY + 76;
  const height = footerY + 24;
  const hoveredCategory = hovered
    ? ANCHOR_CATEGORY_HITS[hovered.provider].find((category) => category.category === hovered.category) ?? null
    : null;
  const hoveredValue = hoveredCategory ? rank === 1 ? hoveredCategory.hit1 : hoveredCategory.hit10 : 0;

  return (
    <ChartFrame
      title={`Gold URL hit@${rank} by category`}
      subtitle="The anchor set has one or more gold URLs for each query. Higher cells mean more matches."
      description={`A heatmap of gold URL hit@${rank} rates by provider and Octen anchor category.`}
      width={width}
      height={height}
      onMouseLeave={() => setHovered(null)}
    >
      {!hovered ? (
        <HeatmapLegend
          x={width - 262}
          y={64}
          label="lower / higher"
          stops={QUALITY_HEATMAP_STOPS}
          values={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        />
      ) : null}
      {categories.map((category, index) => {
        const x = left + index * cellWidth + cellWidth / 2;
        return <text key={category.category} x={x} y={categoryLabelY} textAnchor="end" transform={`rotate(-34 ${x} ${categoryLabelY})`} fill="var(--post-muted)" fontSize={13}>{category.label}</text>;
      })}
      {PROVIDERS.map((provider, rowIndex) => (
        <g key={provider}>
          <text x={left - 14} y={top + rowIndex * rowHeight + rowHeight / 2} dominantBaseline="middle" textAnchor="end" fill="var(--post-heading)" fontSize={13}>{PROVIDER_LABELS[provider]}</text>
          {ANCHOR_CATEGORY_HITS[provider].map((category, columnIndex) => {
            const value = rank === 1 ? category.hit1 : category.hit10;
            const x = left + columnIndex * cellWidth;
            const y = top + rowIndex * rowHeight;
            const isHovered = hovered?.provider === provider && hovered.category === category.category;
            return (
              <g key={`${provider}-${category.category}`} className="websearch-chart-mark" data-active={isHovered} onMouseEnter={() => setHovered({ provider, category: category.category })}>
                <rect x={x + 1} y={y + 1} width={cellWidth - 2} height={rowHeight - 2} rx={3} fill={heatmapFill(value, QUALITY_HEATMAP_STOPS)} stroke={isHovered ? "var(--post-heading)" : "var(--post-background)"} strokeOpacity={0.72} strokeWidth={isHovered ? 2 : 1} />
                <text x={x + cellWidth / 2} y={y + rowHeight / 2} dominantBaseline="middle" textAnchor="middle" fill={HEATMAP_TEXT_COLOR} stroke="var(--post-background)" strokeWidth={3} paintOrder="stroke" fontSize={13} fontWeight={isHovered ? 700 : 500}>{formatPercent(value, 0)}</text>
              </g>
            );
          })}
        </g>
      ))}
      {hovered && hoveredCategory ? (
        <Tooltip
          x={width - 258}
          y={8}
          width={width}
          height={height}
          minimumY={8}
          lines={[`${PROVIDER_LABELS[hovered.provider]} / ${hoveredCategory.label}`, `hit@${rank}: ${formatPercent(hoveredValue)}`, "Gold URL matching"]}
        />
      ) : null}
      <text x={12} y={height - 8} fill="var(--post-muted)" fontSize={13}>Cell color encodes gold URL hit rate; higher is better</text>
    </ChartFrame>
  );
}

export function WebSearchRelevanceRankGraph() {
  const [hovered, setHovered] = useState<{ provider: ProviderId; rank: number } | null>(null);
  const width = 1000;
  const height = 500;
  const left = 72;
  const right = 32;
  const top = 88;
  const bottom = 62;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const x = (value: number) => scale(value, 1, 10, left, left + chartWidth);
  const y = (value: number) => scale(value, 0, 3, top + chartHeight, top);
  const yTicks = [0, 1, 2, 3];
  const hoveredValue = hovered ? RANK_MEANS[hovered.provider][hovered.rank - 1] : 0;
  const hoveredPointX = hovered ? x(hovered.rank) : 0;
  const hoveredPointY = hovered ? y(hoveredValue) : 0;

  return (
    <ChartFrame
      title="Relevance by result position"
      subtitle="Mean metadata-heuristic grade at each rank across the 80 primary queries."
      description="Lines show how the average relevance grade changes from the first to the tenth result position."
      width={width}
      height={height}
      onMouseLeave={() => setHovered(null)}
    >
      {yTicks.map((tick) => {
        const yPosition = y(tick);
        return (
          <g key={tick}>
            <line x1={left} y1={yPosition} x2={left + chartWidth} y2={yPosition} stroke={CHART_GRID_STROKE} strokeDasharray={CHART_GRID_DASH} strokeOpacity={CHART_GRID_OPACITY} />
            <text x={left - 12} y={yPosition + 4} textAnchor="end" fill="var(--post-muted)" fontSize={13}>{tick}</text>
          </g>
        );
      })}
      {Array.from({ length: 10 }, (_, index) => index + 1).map((rank) => (
        <g key={rank}>
          <line x1={x(rank)} y1={top} x2={x(rank)} y2={top + chartHeight} stroke={CHART_GRID_STROKE} strokeDasharray={CHART_GRID_DASH} strokeOpacity={CHART_GRID_OPACITY} />
          <text x={x(rank)} y={top + chartHeight + 23} textAnchor="middle" fill="var(--post-muted)" fontSize={13}>{rank}</text>
        </g>
      ))}
      {PROVIDERS.map((provider) => {
        const values = RANK_MEANS[provider];
        const path = values.map((value, index) => `${index === 0 ? "M" : "L"} ${x(index + 1)} ${y(value)}`).join(" ");
        const isProviderHovered = hovered?.provider === provider;
        return (
          <g key={provider} className="websearch-chart-mark" data-active={isProviderHovered} opacity={hovered && !isProviderHovered ? 0.2 : 1}>
            <path d={path} fill="none" stroke={PROVIDER_COLORS[provider]} strokeWidth={isProviderHovered ? 3 : 2} />
            {values.map((value, index) => {
              const rank = index + 1;
              const isHovered = hovered?.provider === provider && hovered.rank === rank;
              return (
                <g key={rank} onMouseEnter={() => setHovered({ provider, rank })}>
                  <circle cx={x(rank)} cy={y(value)} r={isHovered ? 6 : 3.5} fill={PROVIDER_COLORS[provider]} />
                </g>
              );
            })}
          </g>
        );
      })}
      {hovered ? (
        <Tooltip
          x={hoveredPointX + 12}
          y={hoveredPointY - 64}
          width={width}
          height={height}
          lines={[PROVIDER_LABELS[hovered.provider], `Rank ${hovered.rank}`, `Mean grade: ${hoveredValue.toFixed(2)} / 3`]}
        />
      ) : null}
      <g transform={`translate(12, ${height - 23})`}>
        {PROVIDERS.map((provider, index) => (
          <g key={provider} transform={`translate(${(index % 4) * 205}, ${Math.floor(index / 4) * 18})`}>
            <line x1={0} y1={-4} x2={18} y2={-4} stroke={PROVIDER_COLORS[provider]} strokeWidth={2.5} />
            <text x={25} y={0} fill="var(--post-muted)" fontSize={12}>{PROVIDER_LABELS[provider]}</text>
          </g>
        ))}
      </g>
    </ChartFrame>
  );
}

function agreementFill(diagonal: boolean, value: number) {
  if (diagonal) return "var(--post-muted)";
  return heatmapFill(value, AGREEMENT_HEATMAP_STOPS, 0, 0.55);
}

export function WebSearchAgreementHeatmap() {
  const [hovered, setHovered] = useState<{ a: ProviderId; b: ProviderId } | null>(null);
  const width = 1000;
  const left = 110;
  const top = 88;
  const right = 20;
  const cellSize = (width - left - right) / PROVIDERS.length;
  const rowHeight = cellSize;
  const gridHeight = rowHeight * PROVIDERS.length;
  const categoryLabelY = top + gridHeight + 17;
  const footerY = categoryLabelY + 58;
  const height = footerY + 24;
  const hoveredColumnIndex = hovered ? PROVIDERS.indexOf(hovered.b) : -1;
  const hoveredValue = hovered && hoveredColumnIndex >= 0 ? AGREEMENT_MATRIX[hovered.a][hoveredColumnIndex] : 0;
  const hoveredDiagonal = hovered?.a === hovered?.b;

  return (
    <ChartFrame
      title="Raw result agreement"
      subtitle="Mean Jaccard overlap between the top-ten URL sets returned by each provider."
      description="A matrix compares the overlap of each provider's top-ten URL set with every other provider."
      width={width}
      height={height}
      onMouseLeave={() => setHovered(null)}
    >
      {!hovered ? (
        <HeatmapLegend
          x={width - 242}
          y={64}
          label="lower / higher overlap"
          stops={AGREEMENT_HEATMAP_STOPS}
          values={[0, 0.1, 0.2, 0.3, 0.4, 0.5]}
          maximum={0.55}
        />
      ) : null}
      {PROVIDERS.map((provider, index) => {
        const x = left + index * cellSize + cellSize / 2;
        return <text key={provider} x={x} y={categoryLabelY} textAnchor="end" transform={`rotate(-34 ${x} ${categoryLabelY})`} fill="var(--post-muted)" fontSize={13}>{PROVIDER_LABELS[provider]}</text>;
      })}
      {PROVIDERS.map((a, rowIndex) => (
        <g key={a}>
          <text x={left - 14} y={top + rowIndex * rowHeight + rowHeight / 2} dominantBaseline="middle" textAnchor="end" fill="var(--post-heading)" fontSize={13}>{PROVIDER_LABELS[a]}</text>
          {PROVIDERS.map((b, columnIndex) => {
            const value = AGREEMENT_MATRIX[a][columnIndex];
            const diagonal = a === b;
            const x = left + columnIndex * cellSize;
            const y = top + rowIndex * rowHeight;
            const isHovered = hovered?.a === a && hovered.b === b;
            return (
              <g key={b} className="websearch-chart-mark" data-active={isHovered} onMouseEnter={() => setHovered({ a, b })}>
                <rect x={x + 1} y={y + 1} width={cellSize - 2} height={rowHeight - 2} rx={3} fill={agreementFill(diagonal, value)} fillOpacity={diagonal ? 0.28 : 1} stroke={isHovered ? "var(--post-heading)" : "var(--post-background)"} strokeOpacity={0.72} strokeWidth={isHovered ? 2 : 1} />
                <text x={x + cellSize / 2} y={y + rowHeight / 2} dominantBaseline="middle" textAnchor="middle" fill={HEATMAP_TEXT_COLOR} stroke="var(--post-background)" strokeWidth={3} paintOrder="stroke" fontSize={13} fontWeight={isHovered ? 700 : 500}>{value.toFixed(2)}</text>
              </g>
            );
          })}
        </g>
      ))}
      {hovered ? (
        <Tooltip
          x={width - 258}
          y={8}
          width={width}
          height={height}
          minimumY={8}
          lines={[`${PROVIDER_LABELS[hovered.a]} / ${PROVIDER_LABELS[hovered.b]}`, `Mean overlap: ${hoveredValue.toFixed(3)}`, hoveredDiagonal ? "Self-overlap is fixed at 1.00" : "Top-ten URL sets"]}
        />
      ) : null}
      <text x={12} y={height - 8} fill="var(--post-muted)" fontSize={13}>Diagonal cells are self-overlap. Off-diagonal values describe shared URLs, not quality.</text>
    </ChartFrame>
  );
}

export function WebSearchSourceEcologyGraph() {
  const [hovered, setHovered] = useState<{ provider: ProviderId; host: string } | null>(null);
  const width = 1100;
  const height = 520;
  const left = 120;
  const right = 20;
  const top = 88;
  const rowHeight = 35;
  const chartWidth = width - left - right;
  const chartHeight = rowHeight * PROVIDERS.length;
  const hoveredShare = hovered
    ? SOURCE_ECOLOGY[hovered.provider].find((share) => share.host === hovered.host) ?? null
    : null;
  const hoveredHostIndex = hovered
    ? SOURCE_ECOLOGY[hovered.provider].findIndex((share) => share.host === hovered.host)
    : -1;
  const hoveredSegmentX = hovered && hoveredHostIndex >= 0
    ? left + SOURCE_ECOLOGY[hovered.provider]
      .slice(0, hoveredHostIndex)
      .reduce((total, share) => total + share.value, 0) * chartWidth
    : 0;
  const hoveredSegmentY = hovered ? top + PROVIDERS.indexOf(hovered.provider) * rowHeight + 7 : 0;

  return (
    <ChartFrame
      title="Source host ecology"
      subtitle="Share of primary result URLs by host group. This is source mix, not an authority score."
      description="Stacked bars show how each provider's primary result list is distributed across common host groups and other hosts."
      width={width}
      height={height}
      onMouseLeave={() => setHovered(null)}
    >
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
        const x = left + chartWidth * tick;
        return (
          <g key={tick}>
            <line x1={x} y1={top} x2={x} y2={top + chartHeight} stroke={CHART_GRID_STROKE} strokeDasharray={CHART_GRID_DASH} strokeOpacity={CHART_GRID_OPACITY} />
            <text x={x} y={top + chartHeight + 23} textAnchor="middle" fill="var(--post-muted)" fontSize={13}>{formatPercent(tick, 0)}</text>
          </g>
        );
      })}
      {PROVIDERS.map((provider, rowIndex) => {
        const y = top + rowIndex * rowHeight + 7;
        let currentX = left;
        return (
          <g key={provider} className="websearch-chart-row" data-active={hovered?.provider === provider}>
            <text x={left - 14} y={y + 16} textAnchor="end" fill="var(--post-heading)" fontSize={13}>{PROVIDER_LABELS[provider]}</text>
            {SOURCE_ECOLOGY[provider].map((share, hostIndex) => {
              const segmentX = currentX;
              const segmentWidth = share.value * chartWidth;
              currentX += segmentWidth;
              const isHovered = hovered?.provider === provider && hovered.host === share.host;
              return (
                <g key={share.host} className="websearch-chart-mark" data-active={isHovered} onMouseEnter={() => setHovered({ provider, host: share.host })}>
                  <rect x={segmentX} y={y} width={segmentWidth} height={20} fill={SOURCE_COLORS[hostIndex]} fillOpacity={isHovered ? 1 : 0.82} stroke="var(--post-background)" strokeWidth={1} />
                </g>
              );
            })}
          </g>
        );
      })}
      {hovered && hoveredShare ? (
        <Tooltip
          x={hoveredSegmentX + (hoveredShare.value * chartWidth) / 2}
          y={hoveredSegmentY - 58}
          width={width}
          height={height}
          lines={[PROVIDER_LABELS[hovered.provider], hoveredShare.host, formatPercent(hoveredShare.value)]}
        />
      ) : null}
      <g transform={`translate(12, ${height - 44})`}>
        {SOURCE_HOSTS.map((host, index) => (
          <g key={host} transform={`translate(${(index % 3) * 295}, ${Math.floor(index / 3) * 18})`}>
            <rect x={0} y={-12} width={12} height={12} rx={2} fill={SOURCE_COLORS[index]} />
            <text x={18} y={-2} fill="var(--post-muted)" fontSize={12}>{host}</text>
          </g>
        ))}
      </g>
    </ChartFrame>
  );
}

export function WebSearchPairwiseGraph() {
  const [hovered, setHovered] = useState<number | null>(null);
  const width = 1100;
  const rowHeight = 28;
  const left = 220;
  const right = 30;
  const top = 86;
  const chartWidth = width - left - right;
  const height = top + PAIRWISE_COMPARISONS.length * rowHeight + 48;
  const hoveredComparison = hovered === null ? null : PAIRWISE_COMPARISONS[hovered] ?? null;
  const hoveredRowY = hovered === null ? 0 : top + hovered * rowHeight;

  return (
    <ChartFrame
      title="Paired win, tie, and loss"
      subtitle="Same-query comparisons using a +/-0.05 nDCG@10 tie threshold."
      description="Each row compares two providers across the same primary queries. Blue means the first provider scores higher, gray is a tie, and red means it scores lower."
      width={width}
      height={height}
      onMouseLeave={() => setHovered(null)}
    >
      <g>
        <rect x={left} y={64} width={16} height={12} rx={2} fill="#4F83CC" />
        <text x={left + 24} y={74} fill="var(--post-muted)" fontSize={13}>first wins</text>
        <rect x={left + 112} y={64} width={16} height={12} rx={2} fill="#9CA3A8" />
        <text x={left + 136} y={74} fill="var(--post-muted)" fontSize={13}>tie</text>
        <rect x={left + 190} y={64} width={16} height={12} rx={2} fill="#D46B5D" />
        <text x={left + 214} y={74} fill="var(--post-muted)" fontSize={13}>first loses</text>
      </g>
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
        const x = left + chartWidth * tick;
        return (
          <g key={tick}>
            <line x1={x} y1={top - 5} x2={x} y2={top + PAIRWISE_COMPARISONS.length * rowHeight} stroke={CHART_GRID_STROKE} strokeDasharray={CHART_GRID_DASH} strokeOpacity={CHART_GRID_OPACITY} />
            <text x={x} y={top + PAIRWISE_COMPARISONS.length * rowHeight + 24} textAnchor="middle" fill="var(--post-muted)" fontSize={13}>{formatPercent(tick, 0)}</text>
          </g>
        );
      })}
      {PAIRWISE_COMPARISONS.map((comparison, index) => {
        const total = comparison.wins + comparison.ties + comparison.losses;
        const y = top + index * rowHeight;
        const winsWidth = chartWidth * comparison.wins / total;
        const tiesWidth = chartWidth * comparison.ties / total;
        const lossesWidth = chartWidth * comparison.losses / total;
        const isHovered = hovered === index;
        return (
          <g key={`${comparison.a}-${comparison.b}`} className="websearch-chart-mark" data-active={isHovered} onMouseEnter={() => setHovered(index)} opacity={hovered !== null && !isHovered ? 0.25 : 1}>
            <text x={left - 14} y={y + 16} textAnchor="end" fill="var(--post-heading)" fontSize={13} fontWeight={isHovered ? 700 : 500}>{PROVIDER_LABELS[comparison.a]} vs {PROVIDER_LABELS[comparison.b]}</text>
            <rect x={left} y={y + 3} width={winsWidth} height={17} fill="#4F83CC" />
            <rect x={left + winsWidth} y={y + 3} width={tiesWidth} height={17} fill="#9CA3A8" />
            <rect x={left + winsWidth + tiesWidth} y={y + 3} width={lossesWidth} height={17} fill="#D46B5D" />
            {winsWidth > 48 && <text x={left + winsWidth / 2} y={y + 15} textAnchor="middle" fill="#fff" fontSize={12}>{formatPercent(comparison.wins / total, 0)}</text>}
          </g>
        );
      })}
      {hoveredComparison ? (
        <Tooltip
          x={left + chartWidth * 0.58}
          y={hoveredRowY - 48}
          width={width}
          height={height}
          lines={[`${PROVIDER_LABELS[hoveredComparison.a]} vs ${PROVIDER_LABELS[hoveredComparison.b]}`, `First wins: ${hoveredComparison.wins}`, `Ties: ${hoveredComparison.ties}`, `First loses: ${hoveredComparison.losses}`]}
        />
      ) : null}
      <text x={12} y={height - 8} fill="var(--post-muted)" fontSize={13}>Counts across 80 primary queries</text>
    </ChartFrame>
  );
}
