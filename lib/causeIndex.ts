import type { Cause } from "./causes";

/** The compact view of a cause that the matchers (LLM and keyword) work from. */
export type CauseIndexEntry = Pick<
  Cause,
  "slug" | "cause" | "tagline" | "nonprofitName" | "neighborhood" | "interests" | "helpTypes" | "timeCommitment" | "effort"
>;

export function buildCauseIndex(causes: Cause[]): CauseIndexEntry[] {
  return causes.map((c) => ({
    slug: c.slug,
    cause: c.cause,
    tagline: c.tagline,
    nonprofitName: c.nonprofitName,
    neighborhood: c.neighborhood,
    interests: c.interests,
    helpTypes: c.helpTypes,
    timeCommitment: c.timeCommitment,
    effort: c.effort,
  }));
}
