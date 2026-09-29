import { Suspense } from "react";
import CauseGrid, { CauseList } from "@/components/CauseGrid";
import Hero from "@/components/Hero";
import SiteFooter from "@/components/SiteFooter";
import { getAllCauses, toSummary } from "@/lib/causes";

export default function Home() {
  const causes = getAllCauses().map(toSummary);

  return (
    <>
      <main>
        <Hero />
        <section id="causes" aria-labelledby="directory-title" className="mx-auto max-w-6xl scroll-mt-6 px-4 py-16">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h2 id="directory-title" className="font-display text-3xl sm:text-4xl">
              Every cause
            </h2>
            <p className="text-muted">
              {causes.length} {causes.length === 1 ? "cause" : "causes"}
            </p>
          </div>
          {/* The search reads ?q= from the URL, which is only known in the browser. */}
          <Suspense fallback={<CauseList causes={causes} />}>
            <CauseGrid causes={causes} />
          </Suspense>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
