/** Home page hero. The chat matcher and animated background plug in here. */
export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_20%_20%,#F6C9A8_0%,transparent_70%),radial-gradient(50%_50%_at_85%_30%,#F3B89A_0%,transparent_70%),radial-gradient(60%_60%_at_60%_90%,#F9E3C8_0%,transparent_70%)]"
      />
      <div className="mx-auto flex min-h-[70dvh] max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-strong">Lion Share</p>
        <h1 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">Find where you give back.</h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Tell us what you care about. We&apos;ll match you with an LA cause built by LMU students.
        </p>
        <a
          href="#causes"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-bg transition-colors hover:bg-accent-strong"
        >
          Browse every cause <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
