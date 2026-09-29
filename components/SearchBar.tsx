"use client";

export default function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <label htmlFor="cause-search" className="sr-only">
        Search causes
      </label>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="9" cy="9" r="6" />
        <path d="m14 14 4 4" strokeLinecap="round" />
      </svg>
      <input
        id="cause-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by cause, nonprofit, neighborhood, or student"
        className="w-full rounded-full border border-line bg-surface py-3 pl-12 pr-4 text-base placeholder:text-muted focus:border-accent-strong focus:outline-none"
      />
    </div>
  );
}
