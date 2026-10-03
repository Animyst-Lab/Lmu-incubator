import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CauseList } from "@/components/CauseGrid";
import CauseTemplate from "@/components/CauseTemplate";
import CustomSection from "@/components/CustomSection";
import RevealText from "@/components/RevealText";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getAllCauses, getCause, relatedCauses, toSummary } from "@/lib/causes";

// Only folders that exist at build time become pages. Anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCauses().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/causes/[slug]">): Promise<Metadata> {
  const cause = getCause((await params).slug);
  if (!cause) return {};
  return {
    title: cause.cause,
    description: cause.tagline,
    openGraph: {
      title: `${cause.cause} | Lion Share`,
      description: cause.tagline,
      images: [{ url: cause.imageUrl, alt: cause.imageAlt }],
    },
  };
}

export default async function CausePage({ params }: PageProps<"/causes/[slug]">) {
  const cause = getCause((await params).slug);
  if (!cause) notFound();

  const more = relatedCauses(cause, getAllCauses()).map(toSummary);

  return (
    <>
      <SiteHeader />
      <main id="main" className="shell flex flex-col gap-20 pb-20 pt-4 lg:gap-28 lg:pb-28">
        <div>
          <CauseTemplate cause={cause} />
        </div>

        <CustomSection
          src={cause.customUrl}
          heading={`More from ${cause.author}`}
          title={`Interactive section by ${cause.author} about ${cause.cause}`}
        />

        {more.length > 0 && (
          <section aria-labelledby="more-causes">
            <RevealText id="more-causes" lines={["More causes"]} className="mb-8 text-3xl font-semibold tracking-tight sm:text-4xl" />
            <CauseList causes={more} />
          </section>
        )}

        <p className="border-t border-line pt-6 text-sm text-muted">
          Lion Share is a student project, not affiliated with Loyola Marymount University or the nonprofits listed.
          Pages are written by students, often with help from AI. Always confirm details on the nonprofit&apos;s official
          site. <Link href="/disclaimer" className="underline underline-offset-2 hover:text-ink">Disclaimer</Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
