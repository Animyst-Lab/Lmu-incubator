import type { ReactNode } from "react";
import { LEGAL } from "@/lib/legal";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import { Eyebrow } from "./ui";

/** Shared layout for the privacy, terms, disclaimer, and accessibility pages. */
export default function LegalPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="shell py-28 sm:py-32">
        <article className="mx-auto max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.02em] sm:text-6xl">{title}</h1>
          <p className="mt-4 text-sm text-muted">Effective {LEGAL.effectiveDate}</p>
          <div className="mt-8 text-lg leading-relaxed text-ink/85">{intro}</div>
          <div className="mt-10 border-t border-line pt-2 leading-relaxed text-ink/85 [&_a]:font-medium [&_a]:text-accent-strong [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink [&_li]:mt-2 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

/** A value still to be decided, shown so it can't be missed. */
function Placeholder({ what }: { what: string }) {
  return <mark className="rounded bg-accent/15 px-1.5 py-0.5 text-accent-strong">[{what} to be added]</mark>;
}

/** Who runs Lion Share, or a visible placeholder while that's undecided. */
export function Operator() {
  return LEGAL.operator ? <>{LEGAL.operator}</> : <Placeholder what="operator" />;
}

/** The contact email as a link, or a visible placeholder while there isn't one. */
export function Contact() {
  return LEGAL.contactEmail ? <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a> : <Placeholder what="contact email" />;
}
