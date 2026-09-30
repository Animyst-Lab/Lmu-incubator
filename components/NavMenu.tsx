"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";
import { NAV_ITEMS } from "@/lib/nav";
import { CloseIcon, LogoMark } from "./icons";
import { useLaClock } from "./LiveClock";

/** Full-screen menu overlay. Locks scroll while open; Escape or Close dismisses it. */
type Props = {
  open: boolean;
  onClose: () => void;
  /** Gets focus back when the menu closes. */
  returnFocusRef: RefObject<HTMLButtonElement | null>;
};

export default function NavMenu({ open, onClose, returnFocusRef }: Props) {
  const [entered, setEntered] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const clock = useLaClock();

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const returnTo = returnFocusRef.current;
    html.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => {
      setEntered(true);
      closeRef.current?.focus();
    });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      setEntered(false);
      html.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      returnTo?.focus();
    };
  }, [open, onClose, returnFocusRef]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className={`fixed inset-0 z-[115] flex flex-col bg-ink-card text-white transition-opacity duration-300 ease-spring ${
        entered ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="shell flex items-center justify-between py-5 sm:py-6">
        <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <LogoMark className="text-xl text-accent-from" /> Lion Share
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-control border border-white/15 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          <CloseIcon className="text-sm" /> Close
        </button>
      </div>

      <nav aria-label="Menu" className="shell flex flex-1 flex-col justify-center">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item, i) => {
            const cls = `group flex w-full items-baseline gap-4 py-2 text-left text-4xl font-semibold tracking-tight transition-all duration-500 ease-out sm:text-6xl ${
              entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`;
            const content = (
              <>
                <span className="text-base font-normal text-white/40 transition-colors group-hover:text-accent-from">
                  0{i + 1}
                </span>
                <span className="text-white/75 transition-colors duration-300 group-hover:text-white">{item.label}</span>
              </>
            );
            const style = { transitionDelay: `${i * 45 + 80}ms` };
            return (
              <li key={item.href}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls} style={style} onClick={onClose}>
                    {content}
                  </a>
                ) : (
                  <Link href={item.href} className={cls} style={style} onClick={onClose}>
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shell flex flex-col gap-3 border-t border-white/10 py-6 text-xs uppercase tracking-wide text-white/55 sm:flex-row sm:justify-between">
        <span>Los Angeles{clock ? ` — ${clock.time}` : ""}</span>
        <Link href="/#top" onClick={onClose} className="-my-3.5 inline-flex py-3.5 text-white/75 hover:text-white hover:underline">
          Find your match →
        </Link>
      </div>
    </div>
  );
}
