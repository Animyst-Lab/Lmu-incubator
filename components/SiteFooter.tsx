export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-muted sm:flex-row sm:justify-between">
        <p>Built by LMU students with AI.</p>
        <a
          href="https://github.com/Animyst-Lab/Lmu-incubator"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-accent-strong underline underline-offset-4"
        >
          See the code on GitHub
        </a>
      </div>
    </footer>
  );
}
