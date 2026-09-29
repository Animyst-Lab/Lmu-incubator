import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CauseList } from "@/components/CauseGrid";
import CauseTemplate from "@/components/CauseTemplate";
import CustomSection from "@/components/CustomSection";
import SiteFooter from "@/components/SiteFooter";
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
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-10">
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
            <h2 id="more-causes" className="mb-6 font-display text-3xl">
              More causes
            </h2>
            <CauseList causes={more} />
          </section>
        )}

        <p className="border-t border-line pt-6 text-sm text-muted">
          Lion Share is a student project and is not affiliated with the nonprofits listed. Always confirm details on
          the nonprofit&apos;s official site.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
