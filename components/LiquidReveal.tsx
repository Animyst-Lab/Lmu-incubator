"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * "Liquid" reveal behind the hero: the neutral gray base (a CSS gradient on
 * the section) is painted to warm color along a soft brush trail that
 * follows the pointer, then fades away.
 *
 * - Pointer: the trail follows the cursor.
 * - Typing in the chat: `activity` makes the brush wander on its own for a moment.
 * - Touch screens (no hover): a slow ambient brush keeps it alive.
 * - Reduced motion: nothing is drawn; the static base stays.
 */

const BRUSH_RADIUS = 143; // CSS px
const DECAY = 0.016; // alpha removed from the trail per frame
const FADE_FRAMES = 120; // frames of quiet before a hard clear
const MAX_INTERP = 60;

/** Paints the colored "after" layer the brush reveals. Swap this to change the look. */
function paintCover(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const linear = ctx.createLinearGradient(0, 0, w, h);
  linear.addColorStop(0, "#E9A36F");
  linear.addColorStop(0.45, "#CF8047");
  linear.addColorStop(1, "#97501F");
  ctx.fillStyle = linear;
  ctx.fillRect(0, 0, w, h);

  const glow = (x: number, y: number, r: number, color: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  };
  const m = Math.max(w, h);
  glow(w * 0.22, h * 0.3, m * 0.45, "rgba(246,196,140,0.75)");
  glow(w * 0.8, h * 0.72, m * 0.4, "rgba(177,95,44,0.6)");
  glow(w * 0.6, h * 0.15, m * 0.3, "rgba(242,184,62,0.45)");
}

export default function LiquidReveal({ activity }: { activity?: RefObject<number> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!container || !canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cover = document.createElement("canvas");
    const brush = document.createElement("canvas");
    const coverCtx = cover.getContext("2d")!;
    const brushCtx = brush.getContext("2d")!;

    let radius = BRUSH_RADIUS * dpr;
    let diameter = Math.ceil(radius * 2);
    let rect = container.getBoundingClientRect();
    let points: { x: number; y: number }[] = [];
    let last: { x: number; y: number } | null = null;
    let idle = FADE_FRAMES + 1;
    let raf = 0;
    let visible = true;
    let wanderT = Math.random() * 100;

    function measure() {
      rect = container!.getBoundingClientRect();
      canvas!.width = Math.max(1, Math.round(rect.width * dpr));
      canvas!.height = Math.max(1, Math.round(rect.height * dpr));
      cover.width = canvas!.width;
      cover.height = canvas!.height;
      paintCover(coverCtx, cover.width, cover.height);
      // Smaller brush on small screens so the effect stays in proportion.
      radius = Math.min(BRUSH_RADIUS, Math.max(90, rect.width * 0.18)) * dpr;
      diameter = Math.ceil(radius * 2);
      brush.width = brush.height = diameter;
      last = null;
    }

    function stamp(x: number, y: number) {
      const c = diameter / 2;
      brushCtx.globalCompositeOperation = "source-over";
      brushCtx.clearRect(0, 0, diameter, diameter);
      const g = brushCtx.createRadialGradient(c, c, 0, c, c, c);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.55, "rgba(255,255,255,0.82)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      brushCtx.fillStyle = g;
      brushCtx.fillRect(0, 0, diameter, diameter);
      brushCtx.globalCompositeOperation = "source-in";
      brushCtx.drawImage(cover, x - c, y - c, diameter, diameter, 0, 0, diameter, diameter);
      ctx!.globalCompositeOperation = "source-over";
      ctx!.drawImage(brush, x - c, y - c);
    }

    function addPoint(x: number, y: number) {
      if (x < -radius || y < -radius || x > canvas!.width + radius || y > canvas!.height + radius) {
        last = null;
        return;
      }
      if (last) {
        const dist = Math.hypot(x - last.x, y - last.y);
        const step = Math.max(radius * 0.3, 1);
        const n = Math.min(Math.ceil(dist / step), MAX_INTERP);
        for (let i = 1; i <= n; i++) {
          points.push({ x: last.x + ((x - last.x) * i) / n, y: last.y + ((y - last.y) * i) / n });
        }
      } else {
        points.push({ x, y });
      }
      last = { x, y };
      wake();
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      addPoint((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);
    }

    /** A slow looping path, used when typing and on touch screens. */
    function wander(speed: number) {
      wanderT += speed;
      const w = canvas!.width;
      const h = canvas!.height;
      addPoint(w * (0.5 + 0.38 * Math.sin(wanderT * 0.9)), h * (0.5 + 0.32 * Math.sin(wanderT * 1.3 + 1)));
    }

    function tick() {
      raf = 0;
      if (!visible) return;

      const energy = activity?.current ?? 0;
      if (energy > 0.02) {
        wander(0.03 + energy * 0.05);
        if (activity) activity.current = Math.max(0, energy - 0.012);
      } else if (!hoverCapable) {
        wander(0.012);
      }

      const drawing = points.length > 0;
      idle = drawing ? 0 : idle + 1;
      if (idle > FADE_FRAMES) {
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
        return; // Sleep until the next point.
      }

      const fade = drawing ? DECAY : Math.min(DECAY + idle * 0.004, 0.5);
      ctx!.globalCompositeOperation = "destination-out";
      ctx!.fillStyle = `rgba(0,0,0,${fade})`;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      if (drawing) {
        for (const p of points) stamp(p.x, p.y);
        points = [];
      }
      raf = requestAnimationFrame(tick);
    }

    function wake() {
      if (!raf && visible) raf = requestAnimationFrame(tick);
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !hoverCapable) wake();
    });
    io.observe(container);
    const onScroll = () => (rect = container.getBoundingClientRect());
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // Typing and touch screens drive the brush without pointer events, so poll gently.
    const poll = window.setInterval(() => {
      if ((activity?.current ?? 0) > 0.02 || !hoverCapable) wake();
    }, 120);
    if (!hoverCapable) wake();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(poll);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [activity]);

  return (
    <div ref={containerRef} aria-hidden="true" className="absolute inset-0 z-0">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 size-full" />
    </div>
  );
}
