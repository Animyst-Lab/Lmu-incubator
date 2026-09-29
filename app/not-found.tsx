import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Eyebrow, PillButton } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="shell flex min-h-[70dvh] flex-col items-start justify-center gap-6 py-20">
        <Eyebrow>Page not found</Eyebrow>
        <h1 className="max-w-[14ch] text-5xl font-semibold leading-[0.98] tracking-[-0.02em] sm:text-7xl">
          We couldn&apos;t find that cause.
        </h1>
        <p className="max-w-md text-lg text-muted">It may not be published yet, or the link might have a typo.</p>
        <PillButton href="/#causes" variant="dark" arrow="right">
          See every cause
        </PillButton>
      </main>
      <SiteFooter />
    </>
  );
}
