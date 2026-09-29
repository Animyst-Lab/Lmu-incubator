import { Suspense } from "react";
import CauseGrid, { CauseList } from "@/components/CauseGrid";
import CreateBand from "@/components/CreateBand";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import IntroLoader from "@/components/IntroLoader";
import RevealText from "@/components/RevealText";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import StatsPanel from "@/components/StatsPanel";
import { getAllCauses, siteStats, toSummary } from "@/lib/causes";
import { reveal } from "@/lib/reveal";

export default function Home() {
  const all = getAllCauses();
  const causes = all.map(toSummary);
  const stats = siteStats(all);

  return (
    <>
      <IntroLoader />
      <SiteHeader overlay />
      <main id="main">
        <Hero causes={causes} nonprofitCount={stats.nonprofits} />

        <section id="causes" aria-labelledby="directory-title" className="scroll-mt-6">
          <div className="shell pb-20 pt-20 lg:pb-28 lg:pt-28">
            <div className="flex flex-col items-center text-center">
              <p
                {...reveal({
                  className:
                    "inline-flex items-center gap-2 rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink/70",
                })}
              >
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                {causes.length} {causes.length === 1 ? "cause" : "causes"}
              </p>
              <RevealText
                id="directory-title"
                delay={120}
                lines={["Every cause"]}
                className="mt-5 w-fit text-4xl font-semibold tracking-[-0.02em] sm:text-5xl"
              />
              <p {...reveal({ delay: 200, className: "mt-4 max-w-md text-muted" })}>
                Each one is a real LA nonprofit, picked and written up by an LMU student.
              </p>
            </div>
            <div className="mt-12">
              {/* The search reads ?q= from the URL, which is only known in the browser. */}
              <Suspense fallback={<CauseList causes={causes} />}>
                <CauseGrid causes={causes} />
              </Suspense>
            </div>
          </div>
        </section>

        <HowItWorks />
        <CreateBand />
        <StatsPanel
          stats={[
            { value: stats.causes, label: stats.causes === 1 ? "Cause" : "Causes" },
            { value: stats.nonprofits, label: stats.nonprofits === 1 ? "LA nonprofit" : "LA nonprofits" },
            { value: stats.neighborhoods, label: stats.neighborhoods === 1 ? "Area served" : "Areas served" },
            { value: stats.students, label: stats.students === 1 ? "Student author" : "Student authors" },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
