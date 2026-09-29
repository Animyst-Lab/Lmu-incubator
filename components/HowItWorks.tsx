import Link from "next/link";
import { reveal } from "@/lib/reveal";
import { ArrowUpRight } from "./icons";
import RevealText from "./RevealText";
import { Eyebrow } from "./ui";

const STEPS = [
  { title: "Tell us what you care about", body: "Chat with the matcher above, or search every cause below.", href: "/#top" },
  { title: "Meet a local nonprofit", body: "Every page is written by an LMU student about a real LA nonprofit.", href: "/#causes" },
  { title: "Show up or chip in", body: "Volunteer or donate directly on the nonprofit's own site.", href: "/#causes" },
];

/** Numbered steps as full-width rows that fill in on hover. */
export default function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="scroll-mt-6">
      <div className="shell py-20 lg:py-28">
        <div {...reveal()}>
          <Eyebrow>How it works</Eyebrow>
        </div>
        <RevealText
          id="how-title"
          delay={120}
          lines={["Three steps to", "showing up."]}
          className="mb-12 mt-5 text-4xl font-semibold tracking-[-0.02em] sm:mb-14 sm:text-5xl"
        />
        <ol>
          {STEPS.map((step, i) => (
            <li key={step.title} {...reveal({ y: 24, delay: i * 80, className: i > 0 ? "border-t border-line" : "" })}>
              <Link
                href={step.href}
                className="group flex items-center gap-4 rounded-card-sm px-6 py-6 transition-all duration-500 ease-spring hover:bg-surface hover:pl-8 hover:pr-5 sm:gap-6 sm:py-8"
              >
                <span className="w-7 text-sm font-medium text-ink/55 sm:w-10">0{i + 1}</span>
                <h3 className="flex-1 text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">{step.title}</h3>
                <p className="hidden max-w-xs text-sm text-muted lg:block">{step.body}</p>
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-ink-card text-white transition-transform duration-300 ease-snap group-hover:translate-x-1 sm:size-12"
                >
                  <ArrowUpRight />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
