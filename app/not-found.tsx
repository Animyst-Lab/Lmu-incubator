import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent-strong">Page not found</p>
      <h1 className="mt-4 font-display text-4xl">We couldn&apos;t find that cause.</h1>
      <p className="mt-4 text-muted">It may not be published yet, or the link might have a typo.</p>
      <Link
        href="/#causes"
        className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 font-semibold text-bg transition-colors hover:bg-accent-strong"
      >
        See every cause
      </Link>
    </main>
  );
}
