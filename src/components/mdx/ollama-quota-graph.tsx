"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type ModelEntry = {
  id: string;
  name: string;
  provider: string;
  logo: string;
  color: string;
  glmMultiplier: number;
  proMultiplier: number;
  ppCall: number;
  range: string;
  quality: "good" | "rough" | "poor";
  intelligenceIndex?: number;
};

const MODELS: ModelEntry[] = [
  {
    id: "deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    provider: "DeepSeek",
    logo: "/media/i-made-my-first-benchmark/aa-logos/deepseek_crisp.png",
    color: "#0284C7",
    glmMultiplier: 2.05,
    proMultiplier: 1.00,
    ppCall: 0.1755,
    range: "1.00x-1.00x",
    quality: "good",
    intelligenceIndex: 44.0,
  },
  {
    id: "glm-5.2",
    name: "GLM 5.2",
    provider: "Zhipu AI",
    logo: "/media/i-made-my-first-benchmark/aa-logos/zhipu_crisp.png",
    color: "#7C3AED",
    glmMultiplier: 1.48,
    proMultiplier: 0.72,
    ppCall: 0.1250,
    range: "0.50x-1.03x",
    quality: "good",
    intelligenceIndex: 51.1,
  },
  {
    id: "kimi-k2.7-code",
    name: "Kimi K2.7 Code",
    provider: "Moonshot",
    logo: "/media/i-made-my-first-benchmark/aa-logos/kimi_crisp.png",
    color: "#059669",
    glmMultiplier: 1.05,
    proMultiplier: 0.51,
    ppCall: 0.0857,
    range: "0.37x-0.72x",
    quality: "good",
    intelligenceIndex: 55.0,
  },
  {
    id: "kimi-k2.6",
    name: "Kimi K2.6",
    provider: "Moonshot",
    logo: "/media/i-made-my-first-benchmark/aa-logos/kimi_crisp.png",
    color: "#059669",
    glmMultiplier: 1.00,
    proMultiplier: 0.49,
    ppCall: 0.0917,
    range: "0.34x-0.70x",
    quality: "good",
    intelligenceIndex: 53.0,
  },
  {
    id: "glm-5.1",
    name: "GLM 5.1 (Baseline)",
    provider: "Zhipu AI",
    logo: "/media/i-made-my-first-benchmark/aa-logos/zhipu_crisp.png",
    color: "#7C3AED",
    glmMultiplier: 1.00,
    proMultiplier: 0.45,
    ppCall: 0.0857,
    range: "0.32x-0.62x",
    quality: "good",
    intelligenceIndex: 47.5,
  },
  {
    id: "kimi-k2.5",
    name: "Kimi K2.5",
    provider: "Moonshot",
    logo: "/media/i-made-my-first-benchmark/aa-logos/kimi_crisp.png",
    color: "#059669",
    glmMultiplier: 0.91,
    proMultiplier: 0.41,
    ppCall: 0.0714,
    range: "0.28x-0.59x",
    quality: "good",
    intelligenceIndex: 49.0,
  },
  {
    id: "qwen3.5:397b",
    name: "Qwen 3.5 (397B)",
    provider: "Alibaba",
    logo: "/media/i-made-my-first-benchmark/aa-logos/qwen_crisp.png",
    color: "#4F46E5",
    glmMultiplier: 0.85,
    proMultiplier: 0.38,
    ppCall: 0.0714,
    range: "0.26x-0.54x",
    quality: "good",
    intelligenceIndex: 46.0,
  },
  {
    id: "minimax-m3",
    name: "MiniMax M3",
    provider: "MiniMax",
    logo: "/media/i-made-my-first-benchmark/aa-logos/minimax_crisp.png",
    color: "#D97706",
    glmMultiplier: 0.78,
    proMultiplier: 0.35,
    ppCall: 0.0611,
    range: "0.25x-0.48x",
    quality: "good",
    intelligenceIndex: 44.4,
  },
  {
    id: "nemotron-3-ultra",
    name: "Nemotron 3 Ultra",
    provider: "NVIDIA",
    logo: "/media/i-made-my-first-benchmark/aa-logos/nvidia_crisp.png",
    color: "#DB2777",
    glmMultiplier: 0.58,
    proMultiplier: 0.26,
    ppCall: 0.0458,
    range: "0.18x-0.37x",
    quality: "good",
    intelligenceIndex: 38.0,
  },
  {
    id: "mistral-large-3:675b",
    name: "Mistral Large 3 (675B)",
    provider: "Mistral",
    logo: "/media/i-made-my-first-benchmark/aa-logos/mistral_crisp.png",
    color: "#EA580C",
    glmMultiplier: 0.54,
    proMultiplier: 0.24,
    ppCall: 0.0429,
    range: "0.17x-0.33x",
    quality: "good",
    intelligenceIndex: 42.0,
  },
  {
    id: "minimax-m2.7",
    name: "MiniMax M2.7",
    provider: "MiniMax",
    logo: "/media/i-made-my-first-benchmark/aa-logos/minimax_crisp.png",
    color: "#D97706",
    glmMultiplier: 0.36,
    proMultiplier: 0.16,
    ppCall: 0.0263,
    range: "0.11x-0.22x",
    quality: "good",
    intelligenceIndex: 32.0,
  },
  {
    id: "minimax-m2.5",
    name: "MiniMax M2.5",
    provider: "MiniMax",
    logo: "/media/i-made-my-first-benchmark/aa-logos/minimax_crisp.png",
    color: "#D97706",
    glmMultiplier: 0.33,
    proMultiplier: 0.15,
    ppCall: 0.0278,
    range: "0.11x-0.22x",
    quality: "good",
    intelligenceIndex: 30.0,
  },
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    provider: "DeepSeek",
    logo: "/media/i-made-my-first-benchmark/aa-logos/deepseek_crisp.png",
    color: "#0284C7",
    glmMultiplier: 0.20,
    proMultiplier: 0.09,
    ppCall: 0.0156,
    range: "0.06x-0.12x",
    quality: "good",
    intelligenceIndex: 40.0,
  },
  {
    id: "gemma4:31b",
    name: "Gemma 4 (31B)",
    provider: "Google",
    logo: "/media/i-made-my-first-benchmark/aa-logos/google_crisp.png",
    color: "#2563EB",
    glmMultiplier: 0.11,
    proMultiplier: 0.05,
    ppCall: 0.0094,
    range: "0.03x-0.08x",
    quality: "rough",
    intelligenceIndex: 29.0,
  },
  {
    id: "gpt-oss:20b",
    name: "GPT-OSS (20B)",
    provider: "OpenAI",
    logo: "/media/i-made-my-first-benchmark/aa-logos/openai_crisp.png",
    color: "#0D9488",
    glmMultiplier: 0.09,
    proMultiplier: 0.04,
    ppCall: 0.0063,
    range: "0.02x-0.06x",
    quality: "poor",
    intelligenceIndex: 16.0,
  },
];

const fontStyle = { fontFamily: "var(--font-sans), Inter, system-ui, -apple-system, sans-serif" };

/** Interactive Graph 1: Relative Quota Multipliers Vertical Column Chart */
export function OllamaMultipliersGraph({ className }: { className?: string }) {
  const [baselineId, setBaselineId] = useState<string>("glm-5.1");
  const [hovered, setHovered] = useState<ModelEntry | null>(null);

  const selectedBaseline =
    MODELS.find((m) => m.id === baselineId) ||
    MODELS.find((m) => m.id === "glm-5.1")!;

  const getMultiplier = (m: ModelEntry) => {
    if (m.id === selectedBaseline.id) return 1.0;
    return m.ppCall / selectedBaseline.ppCall;
  };

  // Sorted by calculated multiplier ascending
  const sorted = [...MODELS].sort((a, b) => getMultiplier(a) - getMultiplier(b));

  const maxValRaw = Math.max(...MODELS.map(getMultiplier));
  // Round maxVal up to nearest clean step for graph scaling
  const maxVal = maxValRaw <= 2.2 ? 2.5 : Math.ceil(maxValRaw * 1.25);

  // Generate dynamic Y ticks
  const step = maxVal <= 3 ? 0.5 : maxVal <= 6 ? 1.0 : maxVal <= 12 ? 2.0 : 5.0;
  const yTicks: number[] = [];
  for (let t = 0; t <= maxVal; t += step) {
    yTicks.push(Number(t.toFixed(1)));
  }

  const viewBoxWidth = 1000;
  const viewBoxHeight = 560;

  const marginLeft = 60;
  const marginRight = 30;
  const marginTop = 70;
  const marginBottom = 160;

  const chartWidth = viewBoxWidth - marginLeft - marginRight;
  const chartHeight = viewBoxHeight - marginTop - marginBottom;

  const colWidth = chartWidth / sorted.length;
  const barWidth = colWidth * 0.52;

  const isDefaultBaseline = selectedBaseline.id === "glm-5.1";
  const baselineCleanName = selectedBaseline.name.replace(" (Baseline)", "");

  return (
    <div className={cn("not-prose my-10 w-full", className)}>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-auto overflow-visible select-none"
        style={fontStyle}
      >
        {/* Header Title */}
        <text
          x={marginLeft}
          y={26}
          style={fontStyle}
          className="text-lg font-bold fill-[color:var(--post-heading)] tracking-tight"
        >
          Relative Quota Multipliers
        </text>
        <g>
          <text
            x={marginLeft}
            y={46}
            style={fontStyle}
            className="text-xs fill-[color:var(--post-muted)]"
          >
            Baseline: <tspan className="font-semibold fill-[color:var(--post-heading)]">{baselineCleanName}</tspan> = 1.00x — click any model bar to set as baseline
          </text>
          {!isDefaultBaseline && (
            <g
              onClick={() => setBaselineId("glm-5.1")}
              className="cursor-pointer group"
            >
              <rect
                x={marginLeft + 440}
                y={33}
                width={130}
                height={18}
                rx={4}
                fill="var(--post-border)"
                className="transition-colors group-hover:fill-[color:var(--post-heading)]"
              />
              <text
                x={marginLeft + 505}
                y={45}
                textAnchor="middle"
                style={fontStyle}
                className="text-[10px] font-medium fill-[color:var(--post-heading)] group-hover:fill-white"
              >
                Reset to GLM-5.1
              </text>
            </g>
          )}
        </g>

        {/* Horizontal Gridlines & Y-Axis Labels */}
        {yTicks.map((tick) => {
          const yPos = marginTop + chartHeight - (tick / maxVal) * chartHeight;
          if (yPos < marginTop - 5) return null;
          return (
            <g key={tick}>
              <line
                x1={marginLeft}
                y1={yPos}
                x2={marginLeft + chartWidth}
                y2={yPos}
                stroke="var(--post-border)"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
              />
              <text
                x={marginLeft - 12}
                y={yPos + 4}
                textAnchor="end"
                style={fontStyle}
                className="text-xs font-medium fill-[color:var(--post-muted)]"
              >
                {tick.toFixed(1)}x
              </text>
            </g>
          );
        })}

        {/* Baseline Line at Y = 0.0 */}
        <line
          x1={marginLeft}
          y1={marginTop + chartHeight}
          x2={marginLeft + chartWidth}
          y2={marginTop + chartHeight}
          stroke="#CBD5E1"
          strokeWidth={1.5}
        />

        {/* Left Spine */}
        <line
          x1={marginLeft}
          y1={marginTop + chartHeight}
          x2={marginLeft}
          y2={marginTop}
          stroke="#CBD5E1"
          strokeWidth={1.5}
        />

        {/* Vertical Bars & Labels */}
        {sorted.map((m, i) => {
          const cx = marginLeft + i * colWidth + colWidth / 2;
          const mult = getMultiplier(m);
          const barH = Math.max(4, (mult / maxVal) * chartHeight);
          const barY = marginTop + chartHeight - barH;
          const barX = cx - barWidth / 2;

          const isBaseline = m.id === selectedBaseline.id;
          const isHovered = hovered?.id === m.id;
          const isDimmed = hovered !== null && !isHovered;

          return (
            <g
              key={m.id}
              className="cursor-pointer transition-opacity duration-200"
              onClick={() => setBaselineId(m.id)}
              onMouseEnter={() => setHovered(m)}
              onMouseLeave={() => setHovered(null)}
              style={{ opacity: isDimmed ? 0.35 : 1 }}
            >
              {/* Value Label above Bar */}
              <text
                x={cx}
                y={barY - (isBaseline ? 16 : 8)}
                textAnchor="middle"
                style={fontStyle}
                className={cn(
                  "text-xs font-bold transition-all duration-300",
                  isBaseline
                    ? "fill-[color:var(--post-heading)] text-[13px]"
                    : "fill-[color:var(--post-heading)]"
                )}
              >
                {mult.toFixed(2)}x
              </text>

              {/* Baseline indicator tag */}
              {isBaseline && (
                <text
                  x={cx}
                  y={barY - 4}
                  textAnchor="middle"
                  style={fontStyle}
                  className="text-[9px] font-semibold uppercase fill-[color:var(--post-muted)] tracking-wider"
                >
                  Baseline
                </text>
              )}

              {/* Vertical Column Bar */}
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={barH}
                fill={m.color}
                rx={2}
                stroke={isBaseline ? "var(--post-heading)" : "none"}
                strokeWidth={isBaseline ? 2 : 0}
                className="transition-all duration-300 ease-out"
                style={{
                  filter: isHovered ? "brightness(1.15)" : "none",
                }}
              />

              {/* Crisp Official Provider Logo under Baseline Y=0 */}
              <image
                href={m.logo}
                x={cx - 10}
                y={marginTop + chartHeight + 10}
                width={20}
                height={20}
                preserveAspectRatio="xMidYMid meet"
              />

              {/* Model Name rotated 60 degrees matching Artificial Analysis */}
              <text
                x={cx - 4}
                y={marginTop + chartHeight + 42}
                textAnchor="end"
                transform={`rotate(-60, ${cx - 4}, ${marginTop + chartHeight + 42})`}
                style={fontStyle}
                className={cn(
                  "text-[11px] font-bold fill-[color:var(--post-heading)] transition-all duration-200",
                  isBaseline && "underline"
                )}
              >
                {m.name.replace(" (Baseline)", "")}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Interactive Graph 2: Quota % Consumed per Call Vertical Column Chart */
export function OllamaQuotaPctGraph({ className }: { className?: string }) {
  const [hovered, setHovered] = useState<ModelEntry | null>(null);

  // Sorted by ppCall ascending
  const sorted = [...MODELS].sort((a, b) => a.ppCall - b.ppCall);

  const viewBoxWidth = 1000;
  const viewBoxHeight = 560;

  const marginLeft = 65;
  const marginRight = 30;
  const marginTop = 70;
  const marginBottom = 160;

  const chartWidth = viewBoxWidth - marginLeft - marginRight;
  const chartHeight = viewBoxHeight - marginTop - marginBottom;

  const maxVal = 0.20;
  const yTicks = [0.00, 0.05, 0.10, 0.15, 0.20];

  const colWidth = chartWidth / sorted.length;
  const barWidth = colWidth * 0.52;

  return (
    <div className={cn("not-prose my-10 w-full", className)}>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-auto overflow-visible select-none"
        style={fontStyle}
      >
        {/* Header Title */}
        <text
          x={marginLeft}
          y={26}
          style={fontStyle}
          className="text-lg font-bold fill-[color:var(--post-heading)] tracking-tight"
        >
          Quota % Consumed per Call
        </text>
        <text
          x={marginLeft}
          y={46}
          style={fontStyle}
          className="text-xs fill-[color:var(--post-muted)]"
        >
          Five-hour session quota percentage points per 2,048 generated tokens
        </text>

        {/* Horizontal Gridlines & Y-Axis Labels */}
        {yTicks.map((tick) => {
          const yPos = marginTop + chartHeight - (tick / maxVal) * chartHeight;
          return (
            <g key={tick}>
              <line
                x1={marginLeft}
                y1={yPos}
                x2={marginLeft + chartWidth}
                y2={yPos}
                stroke="var(--post-border)"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
              />
              <text
                x={marginLeft - 12}
                y={yPos + 4}
                textAnchor="end"
                style={fontStyle}
                className="text-xs font-medium fill-[color:var(--post-muted)]"
              >
                {tick.toFixed(2)}%
              </text>
            </g>
          );
        })}

        {/* Baseline Line at Y = 0.0 */}
        <line
          x1={marginLeft}
          y1={marginTop + chartHeight}
          x2={marginLeft + chartWidth}
          y2={marginTop + chartHeight}
          stroke="#CBD5E1"
          strokeWidth={1.5}
        />

        {/* Left Spine */}
        <line
          x1={marginLeft}
          y1={marginTop + chartHeight}
          x2={marginLeft}
          y2={marginTop}
          stroke="#CBD5E1"
          strokeWidth={1.5}
        />

        {/* Vertical Bars & Labels */}
        {sorted.map((m, i) => {
          const cx = marginLeft + i * colWidth + colWidth / 2;
          const barH = (m.ppCall / maxVal) * chartHeight;
          const barY = marginTop + chartHeight - barH;
          const barX = cx - barWidth / 2;

          const isHovered = hovered?.id === m.id;
          const isDimmed = hovered !== null && !isHovered;

          return (
            <g
              key={m.id}
              className="cursor-pointer transition-opacity duration-200"
              onMouseEnter={() => setHovered(m)}
              onMouseLeave={() => setHovered(null)}
              style={{ opacity: isDimmed ? 0.35 : 1 }}
            >
              {/* Value Label above Bar */}
              <text
                x={cx}
                y={barY - 8}
                textAnchor="middle"
                style={fontStyle}
                className="text-[11px] font-bold fill-[color:var(--post-heading)]"
              >
                {m.ppCall.toFixed(3)}%
              </text>

              {/* Vertical Column Bar */}
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={barH}
                fill={m.color}
                rx={2}
                className="transition-all duration-200"
                style={{
                  filter: isHovered ? "brightness(1.1)" : "none",
                }}
              />

              {/* Crisp Official Provider Logo under Baseline Y=0 */}
              <image
                href={m.logo}
                x={cx - 10}
                y={marginTop + chartHeight + 10}
                width={20}
                height={20}
                preserveAspectRatio="xMidYMid meet"
              />

              {/* Model Name rotated 60 degrees matching Artificial Analysis */}
              <text
                x={cx - 4}
                y={marginTop + chartHeight + 42}
                textAnchor="end"
                transform={`rotate(-60, ${cx - 4}, ${marginTop + chartHeight + 42})`}
                style={fontStyle}
                className="text-[11px] font-bold fill-[color:var(--post-heading)]"
              >
                {m.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Interactive Graph 3: Dual-bar Benchmark - Quota Multiplier vs AA Intelligence Index */
export function OllamaIntelligenceGraph({ className }: { className?: string }) {
  const [hovered, setHovered] = useState<ModelEntry | null>(null);

  // Sorted by intelligence index descending matching generate_dual_bar_intelligence_graph.py
  const sorted = [...MODELS]
    .filter((m) => m.intelligenceIndex !== undefined)
    .sort((a, b) => (b.intelligenceIndex ?? 0) - (a.intelligenceIndex ?? 0));

  const viewBoxWidth = 1050;
  const viewBoxHeight = 580;

  const marginLeft = 65;
  const marginRight = 65;
  const marginTop = 70;
  const marginBottom = 160;

  const chartWidth = viewBoxWidth - marginLeft - marginRight;
  const chartHeight = viewBoxHeight - marginTop - marginBottom;

  const maxMult = 2.50;
  const maxIntel = 67.0;

  const leftYTicks = [0.0, 0.5, 1.0, 1.5, 2.0, 2.5];
  const rightYTicks = [0, 15, 30, 45, 60];

  const colWidth = chartWidth / sorted.length;
  const singleBarWidth = colWidth * 0.36;

  return (
    <div className={cn("not-prose my-10 w-full", className)}>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-auto overflow-visible select-none"
        style={fontStyle}
      >
        {/* Header Title */}
        <text
          x={marginLeft}
          y={26}
          style={fontStyle}
          className="text-lg font-bold fill-[color:var(--post-heading)] tracking-tight"
        >
          Quota Multiplier vs. Artificial Analysis Intelligence Index
        </text>
        <text
          x={marginLeft}
          y={46}
          style={fontStyle}
          className="text-xs fill-[color:var(--post-muted)]"
        >
          Comparing relative quota multiplier (left bar) against Artificial Analysis score (right bar)
        </text>

        {/* Left Y-Axis Gridlines & Ticks (Quota Multiplier) */}
        {leftYTicks.map((tick) => {
          const yPos = marginTop + chartHeight - (tick / maxMult) * chartHeight;
          return (
            <g key={tick}>
              <line
                x1={marginLeft}
                y1={yPos}
                x2={marginLeft + chartWidth}
                y2={yPos}
                stroke="var(--post-border)"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
              />
              <text
                x={marginLeft - 12}
                y={yPos + 4}
                textAnchor="end"
                style={fontStyle}
                className="text-xs font-medium fill-[color:var(--post-muted)]"
              >
                {tick.toFixed(1)}x
              </text>
            </g>
          );
        })}

        {/* Right Y-Axis Ticks (AA Intelligence Score) */}
        {rightYTicks.map((tick) => {
          const yPos = marginTop + chartHeight - (tick / maxIntel) * chartHeight;
          return (
            <text
              key={tick}
              x={marginLeft + chartWidth + 12}
              y={yPos + 4}
              textAnchor="start"
              style={fontStyle}
              className="text-xs font-medium fill-[color:var(--post-muted)]"
            >
              {tick}
            </text>
          );
        })}

        {/* Baseline Line at Y = 0.0 */}
        <line
          x1={marginLeft}
          y1={marginTop + chartHeight}
          x2={marginLeft + chartWidth}
          y2={marginTop + chartHeight}
          stroke="#CBD5E1"
          strokeWidth={1.5}
        />

        {/* Spines */}
        <line
          x1={marginLeft}
          y1={marginTop + chartHeight}
          x2={marginLeft}
          y2={marginTop}
          stroke="#CBD5E1"
          strokeWidth={1.5}
        />
        <line
          x1={marginLeft + chartWidth}
          y1={marginTop + chartHeight}
          x2={marginLeft + chartWidth}
          y2={marginTop}
          stroke="#CBD5E1"
          strokeWidth={1.5}
        />

        {/* Dual Bars for Each Model */}
        {sorted.map((m, i) => {
          const cx = marginLeft + i * colWidth + colWidth / 2;

          const barH1 = (m.glmMultiplier / maxMult) * chartHeight;
          const barY1 = marginTop + chartHeight - barH1;
          const barX1 = cx - singleBarWidth;

          const intelScore = m.intelligenceIndex ?? 0;
          const barH2 = (intelScore / maxIntel) * chartHeight;
          const barY2 = marginTop + chartHeight - barH2;
          const barX2 = cx;

          const isHovered = hovered?.id === m.id;
          const isDimmed = hovered !== null && !isHovered;

          return (
            <g
              key={m.id}
              className="cursor-pointer transition-opacity duration-200"
              onMouseEnter={() => setHovered(m)}
              onMouseLeave={() => setHovered(null)}
              style={{ opacity: isDimmed ? 0.35 : 1 }}
            >
              {/* Left Bar Value (Quota Multiplier) */}
              <text
                x={barX1 + singleBarWidth / 2}
                y={barY1 - 6}
                textAnchor="middle"
                style={fontStyle}
                className="text-[10px] font-bold fill-[color:var(--post-heading)]"
              >
                {m.glmMultiplier.toFixed(2)}x
              </text>

              {/* Left Vertical Bar (Quota Multiplier - Brand Color) */}
              <rect
                x={barX1}
                y={barY1}
                width={singleBarWidth}
                height={barH1}
                fill={m.color}
                rx={1.5}
                style={{
                  filter: isHovered ? "brightness(1.1)" : "none",
                }}
              />

              {/* Right Bar Value (AA Intelligence Score) */}
              <text
                x={barX2 + singleBarWidth / 2}
                y={barY2 - 6}
                textAnchor="middle"
                style={fontStyle}
                className="text-[10px] font-bold fill-[color:var(--post-heading)]"
              >
                {intelScore.toFixed(0)}
              </text>

              {/* Right Vertical Bar (AA Intelligence Index - Dark #0F172A) */}
              <rect
                x={barX2}
                y={barY2}
                width={singleBarWidth}
                height={barH2}
                fill="#0F172A"
                rx={1.5}
                style={{
                  filter: isHovered ? "brightness(1.1)" : "none",
                }}
              />

              {/* Crisp Official Provider Logo under Baseline Y=0 */}
              <image
                href={m.logo}
                x={cx - 10}
                y={marginTop + chartHeight + 10}
                width={20}
                height={20}
                preserveAspectRatio="xMidYMid meet"
              />

              {/* Model Name rotated 60 degrees matching Artificial Analysis */}
              <text
                x={cx - 4}
                y={marginTop + chartHeight + 42}
                textAnchor="end"
                transform={`rotate(-60, ${cx - 4}, ${marginTop + chartHeight + 42})`}
                style={fontStyle}
                className="text-[11px] font-bold fill-[color:var(--post-heading)]"
              >
                {m.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
