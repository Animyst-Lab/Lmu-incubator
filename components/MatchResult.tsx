import Image from "next/image";
import Link from "next/link";
import type { CauseSummary } from "@/lib/causes";

type Props = {
  cause: CauseSummary;
  reason: string;
  alternates: CauseSummary[];
  onStartOver: () => void;
};

export default function MatchResult({ cause, reason, alternates, onStartOver }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <article className="flex flex-col overflow-hidden rounded-card border border-line bg-surface text-left sm:flex-row">
        <Image
          src={cause.imageUrl}
          alt={cause.imageAlt}
          width={320}
          height={320}
          sizes="(min-width: 640px) 160px, 100vw"
          className="aspect-square w-full object-cover sm:w-40"
        />
        <div className="flex flex-1 flex-col gap-1 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-strong">Your match</p>
          <h3 className="font-display text-2xl leading-tight">{cause.cause}</h3>
          <p className="text-muted">{cause.tagline}</p>
          <p className="text-sm text-muted">
            <span className="font-semibold text-ink">{cause.nonprofitName}</span> · {cause.neighborhood}
          </p>
          <p className="mt-2 rounded-lg bg-bg px-3 py-2 text-sm">
            <span className="font-semibold">Why it fits: </span>
            {reason}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Link
              href={`/causes/${cause.slug}`}
              className="inline-flex items-center rounded-full bg-accent-strong px-5 py-2.5 font-semibold text-accent-ink transition-colors hover:bg-ink"
            >
              View cause
            </Link>
            <button
              type="button"
              onClick={onStartOver}
              className="rounded-full px-4 py-2.5 font-semibold text-muted underline-offset-4 hover:text-ink hover:underline"
            >
              Start over
            </button>
          </div>
        </div>
      </article>

      {alternates.length > 0 && (
        <p className="text-left text-sm text-muted">
          Also consider:{" "}
          {alternates.map((alt, i) => (
            <span key={alt.slug}>
              {i > 0 && " · "}
              <Link href={`/causes/${alt.slug}`} className="font-semibold text-accent-strong underline underline-offset-4">
                {alt.cause}
              </Link>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
