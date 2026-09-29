import { reveal } from "@/lib/reveal";
import { ArrowRight } from "./icons";

const TILES = [
  { label: "Care", cls: "bg-surface text-ink" },
  { label: "Match", cls: "bg-[image:var(--accent-gradient)] text-white" },
  { label: null, cls: "bg-ink-card text-white" },
  { label: "Give back", cls: "bg-surface/60 text-ink/40" },
];

/** Decorative band of four pills: Care, Match, →, Give back. */
export default function CreateBand() {
  return (
    <section aria-label="Care, match, give back">
      <ul className="shell flex flex-col gap-3 py-10 sm:flex-row sm:gap-4">
        {TILES.map((t, i) => (
          <li key={i} {...reveal({ y: 28, delay: i * 120, className: "flex-1" })}>
            <div
              className={`grid h-24 place-items-center rounded-full text-3xl font-medium transition-transform duration-500 ease-snap hover:scale-[1.03] sm:h-40 sm:text-4xl ${t.cls}`}
            >
              {t.label ?? (
                <>
                  <ArrowRight className="text-4xl sm:text-5xl" />
                  <span className="sr-only">then</span>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
