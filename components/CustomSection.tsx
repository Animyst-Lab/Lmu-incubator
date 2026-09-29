"use client";

import { useEffect, useRef, useState } from "react";
import { HEIGHT_MESSAGE } from "@/lib/customSection";

/** Tall enough for any reasonable section, but stops a runaway 100vh layout from growing forever. */
const MAX_HEIGHT = 4000;
/** Height used until the section reports its own. */
const PLACEHOLDER_HEIGHT = 240;
/** If the section loads but never reports a height, its scripts are broken, so it is hidden. */
const REPORT_TIMEOUT_MS = 5000;

export default function CustomSection({ src, title, heading }: { src: string; title: string; heading: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      // The sandboxed frame has an opaque origin, so trust the source window, not the origin.
      if (event.source !== frame.current?.contentWindow) return;
      const data = event.data as { type?: unknown; height?: unknown };
      if (data?.type !== HEIGHT_MESSAGE || typeof data.height !== "number" || !Number.isFinite(data.height)) return;
      setHeight(Math.min(Math.max(Math.ceil(data.height), 0), MAX_HEIGHT));
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!loaded || height !== null) return;
    const id = setTimeout(() => setFailed(true), REPORT_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [loaded, height]);

  if (failed || height === 0) return null;

  return (
    <section aria-labelledby="custom-heading">
      <h2 id="custom-heading" className="mb-6 text-3xl font-semibold tracking-tight sm:text-4xl">
        {heading}
      </h2>
      <iframe
        ref={frame}
        src={src}
        title={title}
        sandbox="allow-scripts"
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        style={{ height: height ?? PLACEHOLDER_HEIGHT }}
        className="block w-full overflow-hidden rounded-card bg-white ring-1 ring-line"
        scrolling={height === MAX_HEIGHT ? "yes" : "no"}
      />
    </section>
  );
}
