import type { CauseSummary } from "@/lib/causes";
import { reveal } from "@/lib/reveal";
import ChatMatcher from "./ChatMatcher";
import RevealText from "./RevealText";
import { Eyebrow, PillButton } from "./ui";

type Props = { causes: CauseSummary[]; nonprofitCount: number };

export default function Hero({ causes, nonprofitCount }: Props) {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden rounded-b-card bg-[linear-gradient(160deg,var(--hero-from),var(--hero-to))]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,rgba(255,255,255,.35),transparent,rgba(255,255,255,.35))]"
      />
      <p
        aria-hidden="true"
        {...reveal({ y: 20, delay: 300, intro: true, className: "pointer-events-none absolute inset-x-0 bottom-24 z-[1] select-none whitespace-nowrap text-center text-[clamp(4.5rem,15vw,13rem)] font-bold leading-none tracking-tight text-white/40 sm:bottom-28" })}
      >
        LION SHARE
      </p>

      <div className="shell relative z-20 flex flex-col gap-10 pb-16 pt-28 lg:grid lg:min-h-[100svh] lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-32 lg:pt-36">
        <div className="flex flex-col gap-7 lg:col-span-7">
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
          <div {...reveal({ y: 12, delay: 650, intro: true, className: "flex items-center gap-3 text-sm font-medium text-ink/75" })}>
            <span className="rounded-full bg-ink-card px-3 py-1 text-white tabular-nums">{causes.length}</span>
            {causes.length === 1 ? "cause" : "causes"} · {nonprofitCount} LA{" "}
            {nonprofitCount === 1 ? "nonprofit" : "nonprofits"}
          </div>
          <div {...reveal({ y: 12, delay: 750, intro: true, className: "flex flex-wrap gap-3" })}>
            <PillButton href="#causes" variant="dark" arrow="right">
              Browse every cause
            </PillButton>
          </div>
        </div>

        <div
          {...reveal({ y: 16, scale: 0.96, delay: 400, intro: true, className: "w-full lg:col-span-5 lg:justify-self-end lg:max-w-[28rem]" })}
        >
          <ChatMatcher causes={causes} />
        </div>
      </div>

      <div
        {...reveal({ y: 0, delay: 900, intro: true, className: "shell relative z-20 flex items-center justify-between gap-3 border-t border-ink/10 py-5 text-xs font-medium uppercase tracking-wide text-ink/65" })}
      >
        <span>Loyola Marymount University</span>
        <span className="hidden sm:inline">Los Angeles, California</span>
        <a href="#causes" className="inline-flex items-center gap-2 hover:text-ink">
          Scroll to explore <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
