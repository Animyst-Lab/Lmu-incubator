"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "./icons";

const FILL_MS = 550;
const EXIT_MS = 650;
export const INTRO_SEEN_KEY = "ls-intro-seen";

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Short intro on a visitor's first time on the home page: counts 000 → 100,
 * then slides up and lets the hero reveal. The boot script in the layout
 * hides it (html.no-intro) on later visits and with reduced motion.
 */
export default function IntroLoader() {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    // Skipped visits are already hidden by CSS (html.no-intro).
    if (html.classList.contains("no-intro")) return;

    html.style.overflow = "hidden";
    let raf = 0;
    let exitTimer = 0;
    const start = performance.now();

    const finish = () => {
      html.classList.add("intro-done");
      html.style.overflow = "";
      try {
        localStorage.setItem(INTRO_SEEN_KEY, "1");
      } catch {
        // Private mode: the intro just plays again next time.
      }
      setGone(true);
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / FILL_MS);
      setProgress(Math.round(easeInOutCubic(t) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      setLeaving(true);
      exitTimer = window.setTimeout(finish, EXIT_MS);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      html.style.overflow = "";
      html.classList.add("intro-done");
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className="intro-loader fixed inset-0 z-[120] flex flex-col items-center justify-center gap-8 rounded-b-card bg-ink-card text-white"
      style={{
        transform: leaving ? "translateY(-100%)" : "translateY(0)",
        transition: `transform ${EXIT_MS}ms var(--ease-spring)`,
      }}
    >
      <div
        className="flex flex-col items-center gap-5 text-center"
        style={{
          opacity: leaving ? 0 : 1,
          transform: leaving ? "translateY(-12px)" : "none",
          transition: `opacity 400ms var(--ease-spring), transform 400ms var(--ease-spring)`,
        }}
      >
        <p className="flex items-center gap-3 text-2xl font-semibold sm:text-3xl">
          <LogoMark className="text-3xl text-accent-from" /> Lion Share
        </p>
        <p className="max-w-[24ch] text-sm text-white/60">Find where you give back.</p>
      </div>
      <div className="flex w-[min(22rem,72vw)] flex-col gap-3">
        <div className="h-px bg-white/15">
          <div className="h-full bg-accent-from" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-white/50">
          <span>Loading</span>
          <span className="tabular-nums text-white/80">{String(progress).padStart(3, "0")}</span>
        </div>
      </div>
    </div>
  );
}
