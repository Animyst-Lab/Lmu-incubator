import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "./icons";

type Variant = "dark" | "light" | "outline" | "outline-light";

const variants: Record<Variant, { pill: string; badge: string }> = {
  dark: { pill: "bg-ink-card text-white", badge: "bg-white text-ink-card" },
  light: { pill: "bg-surface text-ink", badge: "bg-ink-card text-white" },
  outline: { pill: "border border-line bg-transparent text-ink", badge: "bg-ink-card text-white" },
  "outline-light": { pill: "border border-white/25 bg-transparent text-white", badge: "bg-white text-ink-card" },
};

type PillProps = {
  children: ReactNode;
  variant?: Variant;
  /** Adds the round arrow badge. */
  arrow?: "right" | "up-right";
  className?: string;
} & (
  | { href: string; external?: boolean; onClick?: never; type?: never; disabled?: never }
  | ({ href?: undefined; external?: never } & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type" | "disabled">)
);

/** Pill button with an optional arrow badge. Springs up slightly on hover. */
export function PillButton({ children, variant = "dark", arrow, className = "", ...rest }: PillProps) {
  const v = variants[variant];
  const Icon = arrow === "up-right" ? ArrowUpRight : ArrowRight;
  const shift = arrow === "up-right" ? "group-hover/pill:translate-x-0.5 group-hover/pill:-translate-y-0.5" : "group-hover/pill:translate-x-[3px]";

  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <span className={`grid size-9 shrink-0 place-items-center rounded-full ${v.badge}`}>
          <Icon className={`transition-transform duration-300 ease-snap ${shift}`} />
        </span>
      )}
    </>
  );

  const cls = `group/pill inline-flex items-center gap-3 rounded-full text-sm font-medium transition-transform duration-300 ease-snap hover:scale-[1.04] disabled:pointer-events-none disabled:opacity-50 ${
    arrow ? "py-1.5 pl-6 pr-1.5" : "px-7 py-3.5"
  } ${v.pill} ${className}`;

  if (rest.href !== undefined) {
    return rest.external ? (
      <a href={rest.href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    ) : (
      <Link href={rest.href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={rest.type ?? "button"} onClick={rest.onClick} disabled={rest.disabled} className={cls}>
      {inner}
    </button>
  );
}

/** Small label with a leading dot, used above headings. */
export function Eyebrow({
  children,
  tone = "dark",
  className = "",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  const text = tone === "dark" ? "text-ink/70" : "text-white/70";
  const dot = tone === "dark" ? "bg-ink/50" : "bg-white/60";
  return (
    <p className={`inline-flex items-center gap-2 text-sm font-medium ${text} ${className}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${dot}`} />
      {children}
    </p>
  );
}

/** Outlined chip for tags on dark or light backgrounds. */
export function TagChip({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-sm ${
        tone === "light" ? "border-white/25 text-white" : "border-line text-ink"
      }`}
    >
      {children}
    </span>
  );
}
