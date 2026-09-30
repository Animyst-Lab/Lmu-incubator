"use client";

import { useSyncExternalStore } from "react";
import { SearchIcon } from "./icons";

// The full hint is cut off on a phone, so narrow screens get a short one.
const WIDE = "(min-width: 640px)";
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export default function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const wide = useSyncExternalStore(subscribe, () => window.matchMedia(WIDE).matches, () => false);
  return (
    <div className="relative">
      <label htmlFor="cause-search" className="sr-only">
        Search causes
      </label>
      <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-lg text-ink/50" />
      <input
        id="cause-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={wide ? "Search by cause, nonprofit, neighborhood, or student" : "Search causes, places, students"}
        className="w-full rounded-full border border-line bg-surface/60 py-4 pl-13 pr-5 text-base transition-colors placeholder:text-ink/50 focus:border-ink/30 focus:bg-white focus:outline-none"
      />
    </div>
  );
}
