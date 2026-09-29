import Image from "next/image";
import Link from "next/link";
import type { Cause } from "@/lib/causes";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

function ExternalArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 11 11 5M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const buttonClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold transition-colors";

/** The required info on every cause page, generated from answers.md. */
export default function CauseTemplate({ cause }: { cause: Cause }) {
  return (
    <>
      <Link href="/#causes" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-strong hover:underline">
        <span aria-hidden="true">←</span> All causes
      </Link>

      <header className="mt-6 grid items-center gap-8 md:grid-cols-[1fr_minmax(0,320px)]">
        <div>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">{cause.cause}</h1>
          <p className="mt-4 text-xl text-muted">{cause.tagline}</p>
          <p className="mt-4 text-sm text-muted">Added by {cause.author}</p>
        </div>
        <Image
          src={cause.imageUrl}
          alt={cause.imageAlt}
          width={640}
          height={640}
          priority
          sizes="(min-width: 768px) 320px, 100vw"
          className="aspect-square w-full rounded-card object-cover"
        />
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="flex flex-col gap-10">
          <section aria-labelledby="why">
            <h2 id="why" className="font-display text-2xl">Why I care</h2>
            <p className="mt-3 text-lg leading-relaxed">{cause.whyICare}</p>
          </section>
          <section aria-labelledby="problem">
            <h2 id="problem" className="font-display text-2xl">The problem</h2>
            <p className="mt-3 text-lg leading-relaxed">{cause.problem}</p>
          </section>
          <section aria-labelledby="nonprofit" className="rounded-card border border-line bg-surface p-6">
            <h2 id="nonprofit" className="font-display text-2xl">About the nonprofit</h2>
            <p className="mt-3 text-lg font-semibold">{cause.nonprofitName}</p>
            <p className="text-sm text-muted">{cause.neighborhood}</p>
            <p className="mt-3 leading-relaxed">{cause.nonprofitSummary}</p>
            <a
              href={cause.nonprofitWebsite}
              {...external}
              className="mt-4 inline-flex items-center gap-1 font-semibold text-accent-strong underline underline-offset-4"
            >
              Visit their website <ExternalArrow />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </section>
        </div>

        <aside aria-label="How to help" className="flex flex-col gap-6 lg:sticky lg:top-6">
          <section aria-labelledby="volunteer" className="rounded-card border border-line bg-surface p-6">
            <h2 id="volunteer" className="font-display text-2xl">Volunteer</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="font-semibold">Time commitment</dt>
                <dd className="text-muted">{cause.timeCommitment}</dd>
              </div>
              <div>
                <dt className="font-semibold">Who can join</dt>
                <dd className="text-muted">{cause.whoCanJoin}</dd>
              </div>
            </dl>
            <ol className="mt-5 flex flex-col gap-3">
              {cause.volunteerSteps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bg text-xs font-semibold text-accent-strong"
                  >
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <a href={cause.volunteerLink} {...external} className={`${buttonClass} mt-6 bg-accent-strong text-accent-ink hover:bg-ink`}>
              Sign up to volunteer <ExternalArrow />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </section>

          <section aria-labelledby="donate" className="rounded-card border border-line bg-surface p-6">
            <h2 id="donate" className="font-display text-2xl">Donate</h2>
            <p className="mt-3">{cause.donateImpact}</p>
            <a href={cause.donateLink} {...external} className={`${buttonClass} mt-6 border-2 border-accent-strong text-accent-strong hover:bg-accent-strong hover:text-accent-ink`}>
              Donate <ExternalArrow />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </section>
        </aside>
      </div>
    </>
  );
}
