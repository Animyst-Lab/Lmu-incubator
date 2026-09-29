import type { CauseSummary } from "./causes";

/** Case-insensitive partial match over the fields the directory search covers. */
export function filterCauses(causes: CauseSummary[], query: string): CauseSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return causes;
  return causes.filter((c) =>
    [c.cause, c.tagline, c.nonprofitName, c.neighborhood, c.author, ...c.interests].some((field) =>
      field.toLowerCase().includes(q),
    ),
  );
}
