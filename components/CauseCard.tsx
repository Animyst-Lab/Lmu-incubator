import Image from "next/image";
import Link from "next/link";
import type { CauseSummary } from "@/lib/causes";
import { ArrowUpRight, PinIcon } from "./icons";
import { TagChip } from "./ui";

export default function CauseCard({ cause, headingLevel = "h3" }: { cause: CauseSummary; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-card bg-ink-card p-3 text-white ring-1 ring-white/5 transition-transform duration-500 ease-spring hover:-translate-y-2 hover:scale-[1.012] focus-within:-translate-y-2">
      <div className="relative overflow-hidden rounded-card-sm">
        <Image
          src={cause.imageUrl}
          alt={cause.imageAlt}
          width={640}
          height={480}
          sizes="(min-width: 1024px) 28rem, (min-width: 768px) 50vw, 100vw"
          className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-105"
        />
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-ink-card/70 text-white ring-1 ring-white/15 backdrop-blur-md transition-transform duration-300 ease-snap group-hover:rotate-45 group-hover:scale-110"
        >
          <ArrowUpRight />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-3 pb-3 pt-5">
        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/60">
          <PinIcon className="text-sm" /> {cause.neighborhood}
        </p>
        <Heading className="text-2xl font-medium tracking-tight">{cause.cause}</Heading>
        <p className="line-clamp-2 text-sm text-white/70">{cause.tagline}</p>
        <p className="text-sm text-white/70">
          <span className="font-medium text-white">{cause.nonprofitName}</span>
        </p>
        <div className="mt-1 flex flex-wrap gap-2">
          {cause.interests.slice(0, 3).map((i) => (
            <TagChip key={i}>{i}</TagChip>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <p className="text-xs text-white/60">By {cause.author}</p>
          <Link
            href={`/causes/${cause.slug}`}
            aria-label={`View cause: ${cause.cause}`}
            className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-ink-card transition-colors group-hover:bg-accent-from after:absolute after:inset-0 after:content-['']"
          >
            View cause
          </Link>
        </div>
      </div>
    </article>
  );
}
