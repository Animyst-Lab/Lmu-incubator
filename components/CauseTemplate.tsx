import Image from "next/image";
import Link from "next/link";
import type { Cause } from "@/lib/causes";
import { reveal } from "@/lib/reveal";
import { PinIcon } from "./icons";
import RevealText from "./RevealText";
import { Eyebrow, PillButton, TagChip } from "./ui";

/** The required info on every cause page, generated from answers.md. */
export default function CauseTemplate({ cause }: { cause: Cause }) {
  return (
    <>
      <Link
        href="/#causes"
        className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
      >
        <span aria-hidden="true">←</span> All causes
      </Link>

      <header className="mt-8 grid items-end gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-5 lg:col-span-7">
          <div {...reveal({ y: 10 })}>
            <Eyebrow>
              <PinIcon className="text-sm" /> {cause.neighborhood}
            </Eyebrow>
          </div>
          <RevealText
            as="h1"
            delay={80}
            text={cause.cause}
            wordStagger={60}
            className="text-5xl font-semibold leading-[0.98] tracking-[-0.02em] sm:text-6xl md:text-7xl"
          />
          <p {...reveal({ y: 12, delay: 250, className: "max-w-xl text-xl text-ink/75" })}>{cause.tagline}</p>
          <div {...reveal({ y: 12, delay: 350, className: "flex flex-wrap items-center gap-2" })}>
            <span className="mr-2 text-sm text-muted">Added by {cause.author}</span>
            {cause.interests.map((i) => (
              <TagChip key={i} tone="dark">
                {i}
              </TagChip>
            ))}
          </div>
        </div>
        <div {...reveal({ y: 24, scale: 0.97, delay: 150, className: "lg:col-span-5" })}>
          <Image
            src={cause.imageUrl}
            alt={cause.imageAlt}
            width={720}
            height={720}
            priority
            sizes="(min-width: 1024px) 36rem, 100vw"
            className="aspect-square w-full rounded-card object-cover lg:aspect-[5/4]"
          />
        </div>
      </header>

      <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:items-start">
        <div className="flex flex-col gap-12 lg:col-span-7">
          <section aria-labelledby="why" {...reveal()}>
            <h2 id="why" className="text-xs font-medium uppercase tracking-wider text-muted">
              Why I care
            </h2>
            <p className="mt-3 text-2xl font-medium leading-snug tracking-tight">{cause.whyICare}</p>
          </section>
          <section aria-labelledby="problem" {...reveal()}>
            <h2 id="problem" className="text-xs font-medium uppercase tracking-wider text-muted">
              The problem in LA
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-ink/85">{cause.problem}</p>
          </section>
          <section aria-labelledby="nonprofit" {...reveal({ className: "rounded-card bg-surface p-6 sm:p-8" })}>
            <h2 id="nonprofit" className="text-xs font-medium uppercase tracking-wider text-muted">
              About the nonprofit
            </h2>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{cause.nonprofitName}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <PinIcon /> {cause.neighborhood}
            </p>
            <p className="mt-4 leading-relaxed text-ink/85">{cause.nonprofitSummary}</p>
            <div className="mt-6">
              <PillButton href={cause.nonprofitWebsite} external variant="outline" arrow="up-right">
                Visit their website <span className="sr-only">(opens in a new tab)</span>
              </PillButton>
            </div>
          </section>
        </div>

        <aside aria-label="How to help" className="flex flex-col gap-4 lg:sticky lg:top-6 lg:col-span-5">
          <section aria-labelledby="volunteer" {...reveal({ y: 24, className: "rounded-card bg-ink-card p-6 text-white sm:p-8" })}>
            <h2 id="volunteer" className="text-3xl font-semibold tracking-tight">
              Volunteer
            </h2>
            <dl className="mt-5 grid gap-4 border-y border-white/10 py-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-white/55">Time</dt>
                <dd className="mt-1 text-white/85">{cause.timeCommitment}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-white/55">Who can join</dt>
                <dd className="mt-1 text-white/85">{cause.whoCanJoin}</dd>
              </div>
            </dl>
            <ol className="mt-5 flex flex-col gap-4">
              {cause.volunteerSteps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span aria-hidden="true" className="w-6 shrink-0 pt-0.5 text-sm font-medium text-accent-from">
                    0{i + 1}
                  </span>
                  <span className="text-white/85">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-7">
              <PillButton href={cause.volunteerLink} external variant="light" arrow="up-right">
                Sign up to volunteer <span className="sr-only">(opens in a new tab)</span>
              </PillButton>
            </div>
          </section>

          <section
            aria-labelledby="donate"
            {...reveal({ y: 24, delay: 100, className: "rounded-card bg-[image:var(--accent-gradient)] p-6 text-white sm:p-8" })}
          >
            <h2 id="donate" className="text-3xl font-semibold tracking-tight">
              Donate
            </h2>
            <p className="mt-3 text-white/90">{cause.donateImpact}</p>
            <div className="mt-6">
              <PillButton href={cause.donateLink} external variant="dark" arrow="up-right">
                Donate <span className="sr-only">(opens in a new tab)</span>
              </PillButton>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
