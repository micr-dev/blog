"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Download, Play, Square } from "lucide-react";
import type {
  RefugioFrame,
  RefugioLayout,
  RefugioReplay,
  RefugioRobot,
} from "@/lib/refugio-replay";

const padding = 10;
const jobIdPattern = /^[a-f0-9]{12}$/i;

const replayPresets = [
  { label: "Team 10 - 1008", jobId: "c15da13c3eaa" },
  { label: "Team 3 - 931", jobId: "3905ff4f9ead" },
  { label: "Team 4 - 907", jobId: "7a4738c9956c" },
  { label: "Team 2 - first plateau", jobId: "1b294895f546" },
];

const localReplayPaths: Record<string, string> = {
  "15c4cc5a483b": "/media/my-first-hackathon-experience/replays/15c4cc5a483b.json",
  "7a4738c9956c": "/media/my-first-hackathon-experience/replays/7a4738c9956c.json",
  c15da13c3eaa: "/media/my-first-hackathon-experience/replays/c15da13c3eaa.json",
};

const playbackSpeeds = [
  { label: "1x", frameMs: 240 },
  { label: "2x", frameMs: 120 },
  { label: "4x", frameMs: 60 },
  { label: "8x", frameMs: 30 },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function cellOrigin(x: number, y: number, cellSize: number) {
  return [padding + x * cellSize, padding + y * cellSize] as const;
}

function cellKind(layout: RefugioLayout, x: number, y: number) {
  const value = layout.grid[y]?.[x];

  if (value === layout.cell_encoding.shelf) {
    return "shelf";
  }

  if (value === layout.cell_encoding.base) {
    return "base";
  }

  return "empty";
}

function interpolateFrame(
  frames: RefugioFrame[],
  fromIndex: number,
  toIndex: number,
  progress: number,
) {
  const fromFrame = frames[fromIndex] ?? frames[0];
  const toFrame = frames[toIndex] ?? fromFrame;

  if (!fromFrame || fromIndex === toIndex || progress <= 0) {
    return fromFrame;
  }

  const nextRobots = new Map(toFrame.robots.map((robot) => [robot.id, robot]));

  return {
    tick: fromFrame.tick,
    robots: fromFrame.robots.map((robot) => {
      const nextRobot = nextRobots.get(robot.id);

      if (!nextRobot) {
        return robot;
      }

      return {
        ...robot,
        pos: [
          robot.pos[0] + (nextRobot.pos[0] - robot.pos[0]) * progress,
          robot.pos[1] + (nextRobot.pos[1] - robot.pos[1]) * progress,
        ],
      } satisfies RefugioRobot;
    }),
  } satisfies RefugioFrame;
}

function drawWarehouseFrame(
  canvas: HTMLCanvasElement,
  layout: RefugioLayout,
  frame: RefugioFrame,
  cellSize: number,
) {
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  const ratio = window.devicePixelRatio || 1;
  const cssWidth = layout.width * cellSize + padding * 2;
  const cssHeight = layout.height * cellSize + padding * 2;

  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  canvas.width = Math.floor(cssWidth * ratio);
  canvas.height = Math.floor(cssHeight * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  context.fillStyle = "#f1e6c8";
  context.fillRect(0, 0, cssWidth, cssHeight);

  for (let y = 0; y < layout.height; y += 1) {
    for (let x = 0; x < layout.width; x += 1) {
      const [left, top] = cellOrigin(x, y, cellSize);
      const kind = cellKind(layout, x, y);

      if (kind === "shelf") {
        context.fillStyle = "#0e0e0e";
        context.fillRect(left, top, cellSize, cellSize);
        continue;
      }

      if (kind === "base") {
        context.fillStyle = "#2362ab";
        context.fillRect(left, top, cellSize, cellSize);
        continue;
      }

      context.fillStyle = x === 0 || y === 0 || x === layout.width - 1 || y === layout.height - 1
        ? "#f1e6c8"
        : (x + y) % 2 === 0 ? "#fbf9f1" : "#ffffff";
      context.fillRect(left, top, cellSize, cellSize);
    }
  }

  context.strokeStyle = "rgba(14, 14, 14, 0.12)";
  context.lineWidth = 1;
  context.beginPath();

  for (let x = 0; x <= layout.width; x += 1) {
    const lineX = padding + x * cellSize + 0.5;
    context.moveTo(lineX, padding);
    context.lineTo(lineX, padding + layout.height * cellSize);
  }

  for (let y = 0; y <= layout.height; y += 1) {
    const lineY = padding + y * cellSize + 0.5;
    context.moveTo(padding, lineY);
    context.lineTo(padding + layout.width * cellSize, lineY);
  }

  context.stroke();

  for (const robot of frame.robots) {
    if (!robot.target || robot.carrying) {
      continue;
    }

    const [left, top] = cellOrigin(robot.target[0], robot.target[1], cellSize);
    context.fillStyle = "#f1b91e";
    context.globalAlpha = 0.75;
    context.fillRect(left + 1, top + 1, cellSize - 2, cellSize - 2);
    context.globalAlpha = 1;
  }

  for (const robot of frame.robots) {
    const [left, top] = cellOrigin(robot.pos[0], robot.pos[1], cellSize);

    context.beginPath();
    context.arc(
      left + cellSize / 2,
      top + cellSize / 2,
      Math.max(2, cellSize * 0.34),
      0,
      Math.PI * 2,
    );
    context.fillStyle = robot.carrying ? "#f1b91e" : "#cc3a2c";
    context.fill();
    context.strokeStyle = "#0e0e0e";
    context.lineWidth = 1;
    context.stroke();
  }
}

function getTotalDeliveries(frame: RefugioFrame | undefined) {
  return frame?.robots.reduce((total, robot) => total + robot.deliveries, 0) ?? 0;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function RefugioReplayPlayer({
  initialJobId = replayPresets[0].jobId,
  showJobControls = true,
}: {
  initialJobId?: string;
  showJobControls?: boolean;
}) {
  const startingJobId = jobIdPattern.test(initialJobId)
    ? initialJobId.toLowerCase()
    : replayPresets[0].jobId;
  const [selectedJobId, setSelectedJobId] = useState(startingJobId);
  const [jobInput, setJobInput] = useState(startingJobId);
  const [replay, setReplay] = useState<RefugioReplay | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frameMs, setFrameMs] = useState(120);
  const [cellSize, setCellSize] = useState(10);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const frameIndexRef = useRef(0);

  const frames = useMemo(() => replay?.frames ?? [], [replay]);
  const layout = replay?.layout ?? null;
  const currentFrame = frames[frameIndex];
  const totalTicks = frames.at(-1)?.tick ?? replay?.ticks ?? 0;
  const sliderMaxIndex = Math.max(0, frames.length - 1);
  const sliderProgress = sliderMaxIndex > 0
    ? `${(frameIndex / sliderMaxIndex) * 100}%`
    : "0%";
  const replaySourceUrl = localReplayPaths[selectedJobId]
    ?? `/api/refugio-replay?jobId=${selectedJobId}`;
  const downloadUrl = localReplayPaths[selectedJobId]
    ?? `/api/refugio-replay?jobId=${selectedJobId}&download=1`;

  const selectedPreset = useMemo(() => {
    return replayPresets.find((preset) => preset.jobId === selectedJobId);
  }, [selectedJobId]);

  const stopPlayback = useCallback((reset = false) => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setIsPlaying(false);

    if (reset) {
      frameIndexRef.current = 0;
      setFrameIndex(0);
    }
  }, []);

  const drawFrame = useCallback((index: number, progress = 0) => {
    if (!layout || !canvasRef.current || frames.length === 0) {
      return;
    }

    const nextIndex = clamp(index + 1, 0, frames.length - 1);
    const frame = interpolateFrame(frames, index, nextIndex, progress);

    if (frame) {
      drawWarehouseFrame(canvasRef.current, layout, frame, cellSize);
    }
  }, [cellSize, frames, layout]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(replaySourceUrl, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => null) as {
            error?: string;
          } | null;
          throw new Error(payload?.error ?? `Replay request failed with ${response.status}.`);
        }

        return response.json() as Promise<RefugioReplay>;
      })
      .then((nextReplay) => {
        setReplay(nextReplay);
        setFrameIndex(0);
        frameIndexRef.current = 0;
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setReplay(null);
        setLoadError(error instanceof Error ? error.message : "Could not load replay.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [replaySourceUrl, stopPlayback]);

  useEffect(() => {
    const shell = shellRef.current;

    if (!shell) {
      return;
    }

    const updateSize = () => {
      const availableWidth = shell.clientWidth - padding * 2;
      setCellSize(clamp(Math.floor(availableWidth / 52), 5, 12));
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(shell);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    frameIndexRef.current = frameIndex;

    if (!isPlaying) {
      drawFrame(frameIndex);
    }
  }, [drawFrame, frameIndex, isPlaying]);

  useEffect(() => {
    if (!isPlaying || frames.length < 2) {
      return;
    }

    let startedAt = performance.now();
    let startFrame = frameIndexRef.current;

    const tick = (timestamp: number) => {
      const progress = prefersReducedMotion()
        ? 0
        : clamp((timestamp - startedAt) / frameMs, 0, 1);
      const elapsedFrame = timestamp - startedAt >= frameMs;

      drawFrame(startFrame, progress);

      if (progress >= 1 || elapsedFrame) {
        const nextFrame = startFrame + 1;
        frameIndexRef.current = nextFrame;
        setFrameIndex(nextFrame);

        if (nextFrame >= frames.length - 1) {
          setIsPlaying(false);
          animationRef.current = null;
          return;
        }

        startFrame = nextFrame;
        startedAt = timestamp;
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [drawFrame, frameMs, frames.length, isPlaying]);

  const loadJob = useCallback((jobId: string) => {
    const normalizedJobId = jobId.trim().toLowerCase();

    if (!jobIdPattern.test(normalizedJobId)) {
      setLoadError("Expected a 12-character REFUGIO job ID.");
      return;
    }

    stopPlayback(true);
    setIsLoading(true);
    setLoadError(null);
    setJobInput(normalizedJobId);
    setSelectedJobId(normalizedJobId);
  }, [stopPlayback]);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (frameIndexRef.current >= frames.length - 1) {
      frameIndexRef.current = 0;
      setFrameIndex(0);
    }

    setIsPlaying(true);
  }, [frames.length, isPlaying]);

  return (
    <section className="not-prose my-8">
      <div
        className="rounded-md bg-[color:var(--post-background)]"
        ref={shellRef}
      >
        {showJobControls ? (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <select
              aria-label="Replay preset"
              className="min-h-10 rounded-md border border-[color:var(--post-border)] bg-[color:var(--post-background)] px-3 text-sm text-[color:var(--post-body)]"
              value={selectedPreset?.jobId ?? "custom"}
              onChange={(event) => {
                if (event.target.value === "custom") {
                  return;
                }

                loadJob(event.target.value);
              }}
            >
              {replayPresets.map((preset) => (
                <option key={preset.jobId} value={preset.jobId}>
                  {preset.label}
                </option>
              ))}
              <option value="custom">Custom job</option>
            </select>

            <form
              className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                loadJob(jobInput);
              }}
            >
              <input
                aria-label="REFUGIO job ID"
                className="min-h-10 min-w-44 flex-1 rounded-md border border-[color:var(--post-border)] bg-[color:var(--post-background)] px-3 font-mono text-sm text-[color:var(--post-body)]"
                maxLength={12}
                value={jobInput}
                onChange={(event) => setJobInput(event.target.value)}
              />
              <button
                className="min-h-10 rounded-md bg-[color:var(--post-heading)] px-3 text-sm font-semibold text-[color:var(--post-background)]"
                type="submit"
              >
                Load
              </button>
            </form>

            <a
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[color:var(--post-border)] px-3 text-sm font-semibold text-[color:var(--post-body)]"
              href={downloadUrl}
            >
              <Download aria-hidden="true" size={16} />
              JSON
            </a>
          </div>
        ) : null}

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[color:var(--post-accent)] px-3 text-sm font-semibold text-white disabled:opacity-50"
            disabled={isLoading || frames.length < 2}
            type="button"
            onClick={togglePlayback}
          >
            <Play aria-hidden="true" size={16} />
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[color:var(--post-border)] px-3 text-sm font-semibold text-[color:var(--post-body)] disabled:opacity-50"
            disabled={isLoading || frames.length === 0}
            type="button"
            onClick={() => stopPlayback(true)}
          >
            <Square aria-hidden="true" size={16} />
            Stop
          </button>
          <input
            aria-label="Replay tick"
            className="refugio-replay-slider min-w-48 flex-1 disabled:opacity-50"
            disabled={isLoading || frames.length === 0}
            max={sliderMaxIndex}
            min={0}
            style={{
              "--replay-progress": sliderProgress,
            } as CSSProperties}
            type="range"
            value={frameIndex}
            onChange={(event) => {
              stopPlayback();
              setFrameIndex(Number(event.target.value));
            }}
          />
          <span className="font-mono text-xs text-[color:var(--post-muted)]">
            {String(currentFrame?.tick ?? 0).padStart(String(totalTicks).length, "0")} / {totalTicks}
          </span>
          <div className="flex overflow-hidden rounded-md border border-[color:var(--post-border)]">
            {playbackSpeeds.map((speed) => (
              <button
                key={speed.frameMs}
                className={
                  frameMs === speed.frameMs
                    ? "bg-[color:var(--post-heading)] px-2 py-2 text-xs font-semibold text-[color:var(--post-background)]"
                    : "px-2 py-2 text-xs font-semibold text-[color:var(--post-body)]"
                }
                type="button"
                onClick={() => setFrameMs(speed.frameMs)}
              >
                {speed.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-end gap-2 text-sm text-[color:var(--post-muted)]">
          <span>
            {getTotalDeliveries(currentFrame).toLocaleString("en-US")} /{" "}
            {replay?.total_deliveries.toLocaleString("en-US") ?? 0} deliveries
          </span>
        </div>

        <div className="overflow-x-auto rounded-md bg-[#f1e6c8] p-2">
          <canvas
            aria-label="REFUGIO warehouse replay"
            className="mx-auto block"
            ref={canvasRef}
          />
        </div>

        {loadError ? (
          <p className="mt-3 text-sm font-semibold text-[color:var(--post-accent)]">{loadError}</p>
        ) : null}
      </div>
    </section>
  );
}
