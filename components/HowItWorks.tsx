import Link from "next/link";
import { reveal } from "@/lib/reveal";
import { ArrowUpRight } from "./icons";
import RevealText from "./RevealText";
import { Eyebrow } from "./ui";

const STEPS = [
  {
    label: "Care",
    pill: "bg-surface text-ink ring-1 ring-line",
    title: "Tell us what you care about",
    body: "Chat with the matcher above, or search every cause below.",
    href: "/#top",
  },
  {
    label: "Match",
    pill: "bg-[image:var(--accent-gradient)] text-white",
    title: "Meet a local nonprofit",
    body: "Every page is written by an LMU student about a real LA nonprofit.",
    href: "/#causes",
  },
  {
    label: "Give back",
    pill: "bg-ink-card text-white",
    title: "Show up or chip in",
    body: "Volunteer or donate directly on the nonprofit's own site.",
    href: "/#causes",
  },
];

/** Three steps, each headed by its Care / Match / Give back pill and linking to where it happens. */
export default function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="scroll-mt-6">
      <div className="shell pb-4 pt-20 lg:pb-8 lg:pt-28">
        <div {...reveal()}>
          <Eyebrow>How it works</Eyebrow>
        </div>
        <RevealText
          id="how-title"
          delay={120}
          lines={["Three steps to", "showing up."]}
          className="mb-10 mt-5 text-4xl font-semibold tracking-[-0.02em] sm:mb-14 sm:text-5xl"
        />
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.label} {...reveal({ y: 24, delay: i * 100, className: "flex" })}>
              <Link
                href={step.href}
                className="group flex w-full flex-col gap-5 rounded-card-sm bg-bg p-6 ring-1 ring-line transition-all duration-500 ease-spring hover:-translate-y-1 hover:bg-surface sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-5 py-2 text-lg font-medium ${step.pill}`}>{step.label}</span>
                  <span className="text-sm font-medium text-ink/55">0{i + 1}</span>
                </div>
                <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">{step.title}</h3>
                <p className="text-muted">{step.body}</p>
                <span
                  aria-hidden="true"
                  className="mt-auto grid size-10 place-items-center self-end rounded-full bg-ink-card text-white transition-transform duration-300 ease-snap group-hover:translate-x-1"
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
