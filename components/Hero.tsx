"use client";

import { useCallback, useRef } from "react";
import type { CauseSummary } from "@/lib/causes";
import ChatMatcher from "./ChatMatcher";
import HeroBackground from "./HeroBackground";

export default function Hero({ causes }: { causes: CauseSummary[] }) {
  // Shared with the background without re-rendering on every keystroke.
  const activity = useRef(0);
  const onActivity = useCallback(() => {
    activity.current = Math.min(1, activity.current + 0.25);
  }, []);

  return (
    <section id="top" className="relative isolate overflow-hidden border-b border-line">
      <HeroBackground activity={activity} />
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-4 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-strong">Lion Share</p>
        <h1 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">Find where you give back.</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink/80">
          Tell us what you care about. We&apos;ll match you with an LA cause built by LMU students.
        </p>
        <div className="mt-10">
          <ChatMatcher causes={causes} onActivity={onActivity} />
        </div>
        <a
          href="#causes"
          className="mx-auto mt-8 inline-flex items-center gap-2 font-semibold text-ink underline-offset-4 hover:underline"
        >
          Or browse every cause <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
