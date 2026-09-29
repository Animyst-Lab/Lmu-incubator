import Image from "next/image";
import Link from "next/link";
import type { CauseSummary } from "@/lib/causes";
import { PillButton } from "./ui";

type Props = {
  cause: CauseSummary;
  reason: string;
  alternates: CauseSummary[];
  onStartOver: () => void;
};

export default function MatchResult({ cause, reason, alternates, onStartOver }: Props) {
  return (
    <div className="flex flex-col gap-2 text-left">
      <div className="flex gap-2">
        <Image
          src={cause.imageUrl}
          alt={cause.imageAlt}
          width={192}
          height={192}
          sizes="96px"
          className="aspect-square w-24 shrink-0 rounded-control object-cover"
        />
        <div className="flex flex-1 flex-col justify-center rounded-control bg-surface/80 p-3">
          <p className="text-[0.65rem] font-medium uppercase tracking-wider text-ink/60">Your match</p>
          <h3 className="text-lg font-semibold leading-tight tracking-tight">{cause.cause}</h3>
          <p className="mt-0.5 text-xs text-ink/65">
            {cause.nonprofitName} · {cause.neighborhood}
          </p>
        </div>
      </div>

      <div className="rounded-control bg-surface/80 p-4">
        <p className="text-sm text-ink/75">{cause.tagline}</p>
        <p className="mt-3 border-t border-line pt-3 text-sm">
          <span className="font-semibold">Why it fits: </span>
          {reason}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-1">
        <PillButton href={`/causes/${cause.slug}`} variant="dark" arrow="up-right">
          View cause
        </PillButton>
        <PillButton variant="outline" onClick={onStartOver}>
          Start over
        </PillButton>
      </div>

      {alternates.length > 0 && (
        <p className="px-2 pb-2 text-sm text-ink/65">
          Also consider:{" "}
          {alternates.map((alt, i) => (
            <span key={alt.slug}>
              {i > 0 && " · "}
              <Link href={`/causes/${alt.slug}`} className="font-medium text-ink underline underline-offset-4 hover:text-accent">
                {alt.cause}
              </Link>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
