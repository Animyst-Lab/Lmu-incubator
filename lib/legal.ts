/**
 * Details the legal pages (privacy, terms, disclaimer, accessibility) share.
 * A blank `operator` or `contactEmail` renders as a visible "to be added" placeholder.
 */
export const LEGAL = {
  /** Who runs Lion Share, as it should appear in the legal pages. */
  operator: "Dr. Jason D'Mello",
  /** Where people send privacy, takedown, and accessibility requests. */
  contactEmail: "Jason.D'Mello@lmu.edu",
  effectiveDate: "October 1, 2026",
  /** Minimum age to use the AI cause matcher. */
  chatMinimumAge: 18,
};

export const LEGAL_PAGES = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Accessibility", href: "/accessibility" },
];
