import Link from "next/link";
import type { CauseSummary } from "@/lib/causes";
import { reveal } from "@/lib/reveal";
import ChatMatcher from "./ChatMatcher";
import { ArrowRight } from "./icons";
import RevealText from "./RevealText";
import { Eyebrow, PillButton } from "./ui";

type Props = {
  causes: CauseSummary[];
  /** The most recently added student cause, if known. */
  newest: Pick<CauseSummary, "slug" | "nonprofitName" | "author"> | null;
};

export default function Hero({ causes, newest }: Props) {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden rounded-b-card bg-[linear-gradient(160deg,var(--hero-from),var(--hero-to))]"
    >
      {/* Warm shapes drifting slowly behind everything; still under reduced motion. */}
      <div aria-hidden="true" className="hero-glow">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,rgba(255,255,255,.35),transparent,rgba(255,255,255,.3))]"
      />
      <p
        aria-hidden="true"
        {...reveal({ y: 20, delay: 300, intro: true, className: "pointer-events-none absolute inset-x-0 bottom-24 z-[1] select-none whitespace-nowrap text-center text-[clamp(4.5rem,15vw,13rem)] font-bold leading-none tracking-tight text-white/40 sm:bottom-28" })}
      >
        LION SHARE
      </p>

      {/* Phones stack headline, chat, then links; wide screens put the chat in its own column. */}
      <div className="shell relative z-20 flex flex-col gap-8 pb-16 pt-28 lg:grid lg:min-h-[100svh] lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:content-center lg:gap-x-12 lg:gap-y-8 lg:pb-32 lg:pt-36">
        <div className="flex flex-col gap-6 lg:col-span-6 lg:self-end">
          <div {...reveal({ y: 10, delay: 200, intro: true })}>
            <Eyebrow>Built by LMU students</Eyebrow>
          </div>
          <RevealText
            as="h1"
            intro
            delay={250}
            lineStagger={120}
            lines={["Find where", "you give back."]}
            className="max-w-[14ch] text-5xl font-semibold leading-[0.98] tracking-[-0.02em] sm:text-6xl md:text-7xl"
          />
          <p {...reveal({ y: 12, delay: 550, intro: true, className: "max-w-md text-lg text-ink/75" })}>
            Tell us what you care about. We&apos;ll match you with an LA cause built by LMU students.
          </p>
        </div>

        <div
          {...reveal({ y: 16, scale: 0.97, delay: 400, intro: true, className: "w-full lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-center" })}
        >
          <ChatMatcher causes={causes} />
        </div>

        <div {...reveal({ y: 12, delay: 650, intro: true, className: "flex flex-col items-start gap-5 lg:col-span-6 lg:self-start" })}>
          {newest && (
            <Link
              href={`/causes/${newest.slug}`}
              className="group inline-flex max-w-full items-center gap-2 rounded-full bg-white/60 py-1.5 pl-1.5 pr-4 text-sm text-ink/80 ring-1 ring-ink/10 backdrop-blur transition-colors hover:bg-white/85"
            >
              <span className="rounded-full bg-[image:var(--accent-gradient)] px-2.5 py-0.5 text-xs font-semibold text-white">New</span>
              <span className="truncate">
                <span className="font-medium text-ink">{newest.nonprofitName}</span>
                <span className="text-ink/60"> by {newest.author}</span>
              </span>
              <ArrowRight className="shrink-0 transition-transform duration-300 ease-snap group-hover:translate-x-0.5" />
            </Link>
          )}
          <PillButton href="#causes" variant="dark" arrow="right">
            Browse every cause
          </PillButton>
        </div>
      </div>

      <div
        {...reveal({ y: 0, delay: 900, intro: true, className: "shell relative z-20 flex items-center justify-between gap-3 border-t border-ink/10 py-5 text-xs font-medium uppercase tracking-wide text-ink/65" })}
      >
        <span>Made by LMU students</span>
        <span className="hidden sm:inline">Los Angeles, California</span>
        <a href="#how" className="inline-flex items-center gap-2 hover:text-ink">
          Scroll to explore <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
