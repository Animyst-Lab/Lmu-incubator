"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { CauseSummary } from "@/lib/causes";
import { reveal } from "@/lib/reveal";
import { filterCauses } from "@/lib/search";
import CauseCard from "./CauseCard";
import SearchBar from "./SearchBar";

const SEARCH_DEBOUNCE_MS = 150;

export function CauseList({ causes }: { causes: CauseSummary[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {causes.map((c, i) => (
        <li key={c.slug} {...reveal({ y: 48, delay: (i % 3) * 90, className: "flex" })}>
          <CauseCard cause={c} />
        </li>
      ))}
    </ul>
  );
}

/** Searchable directory. The query lives in the URL (?q=food) so results can be shared. */
export default function CauseGrid({ causes }: { causes: CauseSummary[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [input, setInput] = useState(() => searchParams.get("q") ?? "");
  const [query, setQuery] = useState(input);

  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(input);
      const next = input.trim();
      if (next === (searchParams.get("q") ?? "")) return;
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set("q", next);
      else params.delete("q");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
    // searchParams is read only to keep other params intact; it must not retrigger the debounce.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, pathname, router]);

  const results = useMemo(() => filterCauses(causes, query), [causes, query]);

  return (
    <div className="flex flex-col gap-8">
      <SearchBar value={input} onChange={setInput} />
      <p className="sr-only" aria-live="polite">
        {query ? `${results.length} ${results.length === 1 ? "cause matches" : "causes match"} “${query}”` : ""}
      </p>
      {results.length > 0 ? (
        <CauseList causes={results} />
      ) : (
        <div className="rounded-card bg-surface p-12 text-center">
          <p className="text-2xl font-medium tracking-tight">No causes match that yet.</p>
          <p className="mt-2 text-muted">
            Try a different word, or{" "}
            <a href="#top" className="font-medium text-ink underline underline-offset-4 hover:text-accent">
              tell the chat above what you care about
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}
