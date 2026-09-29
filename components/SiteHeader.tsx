"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { reveal } from "@/lib/reveal";
import { LogoMark, MenuIcon } from "./icons";
import { useLaClock } from "./LiveClock";
import NavMenu from "./NavMenu";

const chip = "rounded-control border border-line/80 bg-white/40 backdrop-blur-sm";

/** Top bar: brand, LA clock, and the menu. `overlay` floats it over the home hero. */
export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = useCallback(() => setMenuOpen(false), []);
  const menuButton = useRef<HTMLButtonElement>(null);
  const clock = useLaClock();
  const r = reveal({ y: -14, delay: 150, intro: overlay });

  return (
    <>
      <header
        {...r}
        className={`${r.className} ${overlay ? "absolute inset-x-0 top-0 z-50" : "relative z-50"}`}
      >
        <div className="shell flex items-center justify-between gap-6 py-5 sm:py-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight transition-transform duration-300 ease-snap hover:scale-[1.04]"
          >
            <LogoMark className="text-xl text-accent" />
            Lion Share
          </Link>

          <div className="flex items-center gap-3">
            <p className={`hidden items-center gap-3 px-3 py-2 text-xs text-ink/70 md:flex ${chip}`}>
              <span className="text-ink/60">Los Angeles</span>
              <span className="min-w-14 font-medium tabular-nums text-ink">{clock?.time ?? " "}</span>
              <span aria-hidden="true" className="text-ink/30">
                •
              </span>
              <span className="font-medium">{clock?.date ?? " "}</span>
            </p>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              className={`transition-colors hover:bg-white/70 ${chip}`}
            >
              <span className="flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider transition-transform duration-300 ease-snap hover:scale-105">
                <MenuIcon className="text-sm" />
                <span className="sr-only sm:not-sr-only">Menu</span>
              </span>
            </button>
          </div>
        </div>
      </header>
      <NavMenu open={menuOpen} onClose={close} returnFocusRef={menuButton} />
    </>
  );
}
