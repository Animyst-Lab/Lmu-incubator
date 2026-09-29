import type { CSSProperties } from "react";

type RevealOptions = {
  /** Delay in ms after the element scrolls into view. */
  delay?: number;
  /** Starting offset in px, slid up to 0. */
  y?: number;
  /** Starting scale, grown to 1. */
  scale?: number;
  /** Also wait for the intro loader to finish (hero content only). */
  intro?: boolean;
  className?: string;
};

/**
 * Props that make an element fade and slide in once, when it scrolls into
 * view. Spread onto any element: <div {...reveal({ delay: 120 })}>.
 */
export function reveal({ delay = 0, y = 16, scale = 1, intro = false, className = "" }: RevealOptions = {}) {
  return {
    "data-reveal": "",
    ...(intro ? { "data-intro": "" } : {}),
    className: `reveal ${className}`.trim(),
    style: { "--rd": `${delay}ms`, "--ry": `${y}px`, "--rs": scale } as CSSProperties,
  };
}
