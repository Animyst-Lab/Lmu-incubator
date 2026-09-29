import { reveal } from "@/lib/reveal";
import CountUp from "./CountUp";
import RevealText from "./RevealText";
import { Eyebrow } from "./ui";

export type Stat = { value: number; label: string };

/** Black panel of count-up numbers. */
export default function StatsPanel({ stats }: { stats: Stat[] }) {
  return (
    <section id="numbers" aria-labelledby="numbers-title" className="scroll-mt-6">
      <div className="shell pb-20 lg:pb-28">
        <div {...reveal({ y: 40, scale: 0.99, className: "rounded-card bg-ink-card px-6 py-12 text-white sm:px-8 sm:py-16 md:px-16" })}>
          <Eyebrow tone="light">By the numbers</Eyebrow>
          <RevealText
            id="numbers-title"
            delay={120}
            lines={["Built by LMU students,", "for Los Angeles."]}
            className="mt-4 max-w-[22ch] text-3xl font-medium tracking-tight md:text-4xl"
          />
          <ul className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
            {stats.map((s, i) => (
              <li key={s.label} {...reveal({ y: 20, delay: i * 90 })}>
                <p className="text-5xl font-semibold tracking-[-0.02em] sm:text-6xl md:text-7xl">
                  <CountUp value={s.value} />
                </p>
                <p className="mt-3 text-sm text-white/65">{s.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
