import Image from "next/image";
import Link from "next/link";
import type { CauseSummary } from "@/lib/causes";

export default function CauseCard({ cause, headingLevel = "h3" }: { cause: CauseSummary; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-shadow hover:shadow-lg focus-within:shadow-lg">
      <Image
        src={cause.imageUrl}
        alt={cause.imageAlt}
        width={600}
        height={600}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-square w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <Heading className="font-display text-xl leading-tight">{cause.cause}</Heading>
        <p className="line-clamp-2 text-muted">{cause.tagline}</p>
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">{cause.nonprofitName}</span> · {cause.neighborhood}
        </p>
        <p className="text-sm text-muted">By {cause.author}</p>
        <div className="mt-auto pt-3">
          <Link
            href={`/causes/${cause.slug}`}
            aria-label={`View cause: ${cause.cause}`}
            className="inline-flex items-center rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-accent-ink transition-colors group-hover:bg-ink after:absolute after:inset-0 after:content-['']"
          >
            View cause
          </Link>
        </div>
      </div>
    </article>
  );
}
