"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A number that counts up with scroll: 0 when the element's top reaches the
 * bottom of the viewport, the full value when its center reaches the center.
 * Shows the final value without JS and with reduced motion.
 */
export default function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pending = 0;
    const update = () => {
      pending = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh; // top at viewport bottom
      const end = vh / 2 - r.height / 2; // center at viewport center
      const progress = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
      setShown(Math.round(progress * value));
    };
    const onScroll = () => {
      if (!pending) pending = window.setTimeout(update, 30);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(pending);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden="true">
        {shown}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}
