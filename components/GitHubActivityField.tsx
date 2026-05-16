"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ContributionDay } from "@/types/github-activity";

type ActivityCell = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  pulseScale: number;
  pulseSpeed: number;
  pulsePhase: number;
  active: boolean;
};

type CanvasSize = {
  width: number;
  height: number;
  dpr: number;
};

const ROW_COUNT = 5;
const ROW_CENTER = (ROW_COUNT - 1) / 2;
const COLUMN_PITCH = 11;
const FIELD_PADDING_X = 18;
const FIELD_PADDING_Y = 16;
const FIELD_HEIGHT = 132;
const SCROLL_SPEED = 0.018;
const TILE_SCALE = 1.5;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildActivityCells(days: ContributionDay[]) {
  const maxDays = Math.max(days.length - 1, 1);
  const cells: ActivityCell[] = [];

  days.forEach((day, index) => {
    const progress = index / maxDays;
    const normalizedCount = Math.min(day.count / 60, 1);
    const normalizedLevel = day.level / 4;
    const rightEdgeBoost = Math.pow(progress, 1.65);
    const intensity =
      normalizedCount * 0.5 + normalizedLevel * 0.16 + rightEdgeBoost * 0.34;

    const bandCenter = clamp(
      Math.round(0.8 + progress * 3 + day.level * 0.24),
      0,
      ROW_COUNT - 1
    );
    const bandSpread = clamp(
      Math.floor((day.count > 0 ? 1 : 0) + progress * 1.5 + day.level / 2),
      0,
      3
    );
    const rightDepth = Math.pow(progress, 1.7);
    const pulsePhase = ((index * 17) % 97) / 97;
    const pulseSpeed = 0.0012 + intensity * 0.0005;
    const baseX = FIELD_PADDING_X + index * COLUMN_PITCH + progress * 16;

    for (let rowIndex = 0; rowIndex < ROW_COUNT; rowIndex += 1) {
      const rowOffset = rowIndex - ROW_CENTER;
      const distance = Math.abs(rowIndex - bandCenter);
      const active = distance <= bandSpread;
      const opacity = active
        ? Math.max(0.08, 0.08 + intensity * 0.78 - distance * 0.09 + rowOffset * 0.01)
        : 0.04;
      const size =
        Math.max(5.4, 6.2 + intensity * 3.55 - distance * 0.25) * TILE_SCALE;
      const offsetX = rowOffset * rightDepth * 2.2;
      const offsetY =
        Math.sin(progress * Math.PI) * rowOffset * -1.2 +
        rowOffset * rightDepth * 0.8;
      const pulseScale = 1.01 + intensity * 0.038;

      cells.push({
        x: baseX + offsetX,
        y: FIELD_PADDING_Y + rowIndex * 18 + offsetY,
        size,
        opacity,
        pulseScale,
        pulseSpeed,
        pulsePhase: pulsePhase + rowIndex * 0.11,
        active: active && (day.count >= 12 || day.level >= 2)
      });
    }
  });

  const patternWidth =
    FIELD_PADDING_X * 2 + Math.max(days.length - 1, 1) * COLUMN_PITCH + 40;

  return { cells, patternWidth };
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  radius: number
) {
  const r = Math.max(1, Math.min(radius, size / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + size - r, y);
  ctx.quadraticCurveTo(x + size, y, x + size, y + r);
  ctx.lineTo(x + size, y + size - r);
  ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
  ctx.lineTo(x + r, y + size);
  ctx.quadraticCurveTo(x, y + size, x, y + size - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

type GitHubActivityFieldProps = {
  days: ContributionDay[];
};

export default function GitHubActivityField({ days }: GitHubActivityFieldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cellsRef = useRef<ActivityCell[]>([]);
  const patternWidthRef = useRef(1);
  const currentElapsedRef = useRef(0);
  const baseElapsedRef = useRef(0);
  const frameStartRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({
    width: 0,
    height: FIELD_HEIGHT,
    dpr: 1
  });
  const [isPaused, setIsPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const summary = useMemo(() => {
    const total = days.reduce((sum, day) => sum + day.count, 0);
    return `${total} contributions over the last year`;
  }, [days]);

  const activityLayout = useMemo(() => buildActivityCells(days), [days]);

  useEffect(() => {
    cellsRef.current = activityLayout.cells;
    patternWidthRef.current = activityLayout.patternWidth;
  }, [activityLayout]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(media.matches);
    syncMotion();
    media.addEventListener("change", syncMotion);
    return () => media.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      setCanvasSize({
        width: Math.max(1, Math.floor(rect.width)),
        height: Math.max(1, Math.floor(rect.height || FIELD_HEIGHT)),
        dpr
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cells = cellsRef.current;
    const width = canvasSize.width;
    const height = canvasSize.height;

    if (!canvas || width <= 0 || height <= 0 || cells.length === 0) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    canvas.width = Math.floor(width * canvasSize.dpr);
    canvas.height = Math.floor(height * canvasSize.dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(canvasSize.dpr, 0, 0, canvasSize.dpr, 0, 0);

    const draw = (elapsed: number) => {
      const scrollOffset = elapsed * SCROLL_SPEED;
      const patternWidth = patternWidthRef.current;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(250, 250, 250, 1)";
      ctx.fillRect(0, 0, width, height);

      for (let copy = -1; copy <= 1; copy += 1) {
        const copyOffset = copy * patternWidth - (scrollOffset % patternWidth);

        for (const cell of cells) {
          const x = cell.x + copyOffset;

          if (x < -24 || x > width + 24) {
            continue;
          }

          const pulse = cell.active
            ? 0.5 + 0.5 * Math.sin(elapsed * cell.pulseSpeed + cell.pulsePhase)
            : 0;
          const size = cell.active
            ? cell.size * (1 + pulse * (cell.pulseScale - 1))
            : cell.size;
          const opacity = clamp(cell.opacity + pulse * 0.08, 0.04, 0.92);
          const y = cell.y + pulse * 0.4;

          ctx.fillStyle = `rgba(15, 17, 21, ${opacity})`;
          drawRoundedRect(ctx, x, y, size, 3);
          ctx.fill();
        }
      }
    };

    if (reduceMotion || isPaused) {
      draw(currentElapsedRef.current);
      return;
    }

    frameStartRef.current = performance.now();

    const frame = (now: number) => {
      const elapsed = baseElapsedRef.current + (now - frameStartRef.current);
      currentElapsedRef.current = elapsed;
      draw(elapsed);
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      baseElapsedRef.current = currentElapsedRef.current;
    };
  }, [canvasSize, isPaused, reduceMotion]);

  return (
    <div
      ref={containerRef}
      className="activity-field-shell h-full w-full"
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
    >
      <canvas
        ref={canvasRef}
        className="activity-field-canvas"
        aria-hidden="true"
      />
      <span className="sr-only">{summary}</span>
    </div>
  );
}
