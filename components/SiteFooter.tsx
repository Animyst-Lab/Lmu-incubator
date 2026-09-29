import Link from "next/link";
import { NAV_ITEMS, REPO_URL } from "@/lib/nav";
import { LogoMark } from "./icons";
import RevealText from "./RevealText";
import { PillButton } from "./ui";

const linkCls =
  "inline-flex text-sm text-white/70 transition-all duration-300 ease-snap hover:translate-x-1 hover:text-white";

export default function SiteFooter() {
  return (
    <footer className="relative mt-4 overflow-hidden rounded-t-card bg-ink-card text-white">
      <div className="shell relative z-10 pb-10 pt-20 lg:pt-24">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-16 lg:flex-row lg:items-end lg:justify-between">
          <RevealText
            lineStagger={100}
            lines={["Care about something?", "Find where it lives in LA."]}
            className="max-w-[18ch] text-4xl font-semibold tracking-[-0.02em] sm:text-5xl md:text-6xl"
          />
          <PillButton href="/#top" variant="light" arrow="up-right">
            Find your match
          </PillButton>
        </div>

        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="flex items-center gap-2 text-lg font-semibold">
              <LogoMark className="text-xl text-accent-from" /> Lion Share
            </p>
            <p className="mt-3 max-w-xs text-sm text-white/65">
              A campus guide to giving back in Los Angeles, built by LMU students with AI.
            </p>
          </div>
          <nav aria-label="Explore">
            <p className="text-xs uppercase tracking-wide text-white/55">Explore</p>
            <ul className="mt-4 flex flex-col gap-3">
              {NAV_ITEMS.filter((i) => !i.external).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkCls}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/55">The project</p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  Source code
                </a>
              </li>
              <li>
                <a href={`${REPO_URL}#readme`} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  Add your cause
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/55 sm:flex-row">
          <p>© {new Date().getFullYear()} Lion Share. A student project at LMU.</p>
          <p className="text-center sm:text-right">
            Not affiliated with the nonprofits listed. Always confirm details on their official sites.
          </p>
        </div>
      </div>
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-6 z-0 select-none whitespace-nowrap text-center text-[clamp(4.5rem,15vw,13rem)] font-bold leading-none text-white/5"
      >
        LION SHARE
      </p>
    </footer>
  );
}
