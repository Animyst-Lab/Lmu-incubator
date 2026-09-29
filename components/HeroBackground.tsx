"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Slow flowing gradient mesh behind the hero.
 *
 * Swappable: anything that fills its parent and reads `activity` (0 to 1,
 * bumped while the visitor types) can replace this component.
 */

type Blob = { color: [number, number, number]; x: number; y: number; r: number; sx: number; sy: number; phase: number };

// Warm placeholder palette drawn from the design tokens. Swap once the brand is set.
const BLOBS: Blob[] = [
  { color: [246, 176, 132], x: 0.2, y: 0.25, r: 0.55, sx: 0.11, sy: 0.07, phase: 0 },
  { color: [228, 87, 46], x: 0.8, y: 0.2, r: 0.45, sx: 0.08, sy: 0.1, phase: 1.7 },
  { color: [249, 214, 170], x: 0.55, y: 0.85, r: 0.6, sx: 0.09, sy: 0.06, phase: 3.1 },
  { color: [242, 184, 62], x: 0.1, y: 0.8, r: 0.4, sx: 0.07, sy: 0.09, phase: 4.4 },
  { color: [240, 140, 110], x: 0.9, y: 0.75, r: 0.42, sx: 0.1, sy: 0.08, phase: 5.2 },
];
const BASE: [number, number, number] = [251, 249, 245];

export default function HeroBackground({ activity }: { activity: RefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 640px)").matches;
    // Draw small and let the browser scale it up: that smooths the gradients and keeps the cost tiny.
    const scale = mobile ? 1 / 16 : 1 / 10;
    const blobs = mobile ? BLOBS.slice(0, 3) : BLOBS;
    const frameInterval = mobile ? 1000 / 24 : 1000 / 40;

    let visible = true;
    let raf = 0;
    let last = 0;
    let t = Math.random() * 100;
    let energy = 0;

    function resize() {
      canvas!.width = Math.max(8, Math.round(canvas!.clientWidth * scale));
      canvas!.height = Math.max(8, Math.round(canvas!.clientHeight * scale));
    }

    function draw() {
      const { width: w, height: h } = canvas!;
      ctx!.globalCompositeOperation = "source-over";
      ctx!.fillStyle = `rgb(${BASE.join(",")})`;
      ctx!.fillRect(0, 0, w, h);
      const size = Math.max(w, h);
      for (const b of blobs) {
        const x = (b.x + Math.sin(t * b.sx + b.phase) * 0.18) * w;
        const y = (b.y + Math.cos(t * b.sy + b.phase) * 0.18) * h;
        const r = b.r * size * (1 + energy * 0.12);
        const g = ctx!.createRadialGradient(x, y, 0, x, y, r);
        const alpha = 0.55 + energy * 0.25;
        g.addColorStop(0, `rgba(${b.color.join(",")},${alpha})`);
        g.addColorStop(1, `rgba(${b.color.join(",")},0)`);
        ctx!.fillStyle = g;
        ctx!.fillRect(0, 0, w, h);
      }
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (now - last < frameInterval) return;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      // Typing pushes energy up; it eases back down on its own.
      energy += ((activity.current ?? 0) - energy) * Math.min(1, dt * 4);
      activity.current = Math.max(0, (activity.current ?? 0) - dt * 0.8);
      t += dt * (0.35 + energy * 1.2);
      draw();
    }

    function start() {
      if (!raf && visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    resize();
    draw();
    if (reducedMotion) {
      const onResize = () => {
        resize();
        draw();
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    observer.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);
    start();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, [activity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 -z-10 size-full"
    />
  );
}
