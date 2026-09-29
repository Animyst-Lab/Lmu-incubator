"use client";

import { useEffect, useState } from "react";
import { formatClock } from "@/lib/clock";

/** Live LA time. Renders nothing until mounted, so server and client HTML match. */
export function useLaClock() {
  const [now, setNow] = useState<{ time: string; date: string } | null>(null);
  useEffect(() => {
    const tick = () => setNow(formatClock(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}
