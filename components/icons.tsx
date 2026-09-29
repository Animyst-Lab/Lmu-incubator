import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = { width: "1em", height: "1em", "aria-hidden": true, focusable: false } as const;

/** Lion Share mark: a pie with the lion's share (the biggest slice) filled. */
export function LogoMark(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 48 48" {...props}>
      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M24 24V4a20 20 0 1 1-20 20Z" fill="currentColor" />
    </svg>
  );
}

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M4 4l16 16M20 4 4 20" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 24 24" {...stroke} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}
