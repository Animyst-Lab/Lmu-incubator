import { z } from "zod";

/**
 * The 20 questions in answers.md, keyed by field name. The numbers here must
 * match the numbers students see in causes/_template/answers.md, because every
 * validation error names the question by number.
 */
export const QUESTIONS = {
  author: { n: 1, label: "your name" },
  cause: { n: 2, label: "the cause" },
  tagline: { n: 3, label: "the one-line tagline" },
  whyICare: { n: 4, label: "why you care" },
  problem: { n: 5, label: "the problem in LA" },
  nonprofitName: { n: 6, label: "the nonprofit's name" },
  nonprofitWebsite: { n: 7, label: "the nonprofit's website" },
  neighborhood: { n: 8, label: "the neighborhood they serve" },
  nonprofitSummary: { n: 9, label: "what the nonprofit does" },
  volunteerLink: { n: 10, label: "the volunteer signup link" },
  timeCommitment: { n: 11, label: "the time commitment" },
  whoCanJoin: { n: 12, label: "who can join" },
  volunteerSteps: { n: 13, label: "the volunteer steps" },
  donateLink: { n: 14, label: "the donation link" },
  donateImpact: { n: 15, label: "what a donation makes possible" },
  image: { n: 16, label: "the image file name" },
  imageAlt: { n: 17, label: "the image description" },
  interests: { n: 18, label: "the interests" },
  helpTypes: { n: 19, label: "how people can help" },
  effort: { n: 20, label: "the overall effort" },
} as const;

export type QuestionField = keyof typeof QUESTIONS;

export const HELP_TYPES = ["time", "money", "skills"] as const;
export const EFFORT_LEVELS = ["low", "medium", "high"] as const;

export const TAGLINE_MAX_WORDS = 10;

const EMPTY = "is empty. Put your answer inside the quotes.";

const answer = () =>
  z
    .string({ error: "is missing or isn't inside quotes." })
    .trim()
    .min(1, { error: EMPTY });

const link = () =>
  z
    .string({ error: "is missing or isn't inside quotes." })
    .trim()
    .min(1, { error: EMPTY })
    .pipe(
      z.url({
        protocol: /^https$/,
        hostname: /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i,
        error: "needs a full link starting with https:// (copy it from your browser's address bar).",
      }),
    );

export const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export const answersSchema = z.strictObject({
  author: answer(),
  cause: answer(),
  tagline: answer().refine((t) => wordCount(t) <= TAGLINE_MAX_WORDS, {
    error: `must be ${TAGLINE_MAX_WORDS} words or fewer.`,
  }),
  whyICare: answer(),
  problem: answer(),
  nonprofitName: answer(),
  nonprofitWebsite: link(),
  neighborhood: answer(),
  nonprofitSummary: answer(),
  volunteerLink: link(),
  timeCommitment: answer(),
  whoCanJoin: answer(),
  volunteerSteps: z
    .array(answer(), { error: "should be a list of steps, each starting with a dash." })
    .min(1, { error: "needs at least 1 step." }),
  donateLink: link(),
  donateImpact: answer(),
  image: answer().regex(/^[^/\\]+\.(jpe?g|png)$/i, {
    error: "should be a file name in your folder ending in .jpg or .png, like \"image.jpg\".",
  }),
  imageAlt: answer(),
  interests: z
    .array(answer(), { error: "should be a list like [\"food\", \"kids\", \"health\"]." })
    .min(3, { error: "needs 3 to 5 interests." })
    .max(5, { error: "needs 3 to 5 interests." }),
  helpTypes: z
    .array(z.enum(HELP_TYPES, { error: "can only contain time, money, or skills." }), {
      error: "should be a list like [\"time\", \"money\"].",
    })
    .min(1, { error: "needs at least one of time, money, or skills." })
    .refine((list) => new Set(list).size === list.length, { error: "lists the same choice twice." }),
  effort: z.enum(EFFORT_LEVELS, { error: "must be low, medium, or high." }),
});

export type Answers = z.infer<typeof answersSchema>;

/** Turns a zod issue into a sentence a non-technical student can act on. */
export function describeIssue(issue: z.core.$ZodIssue): string {
  const [field, index] = issue.path;

  if (issue.code === "unrecognized_keys") {
    const keys = issue.keys.join(", ");
    return `has extra lines that aren't questions (${keys}). Remove them, or check for a typo in the name before the colon.`;
  }

  if (typeof field === "string" && field in QUESTIONS) {
    const q = QUESTIONS[field as QuestionField];
    const where = typeof index === "number" ? `, item ${index + 1},` : "";
    return `Question ${q.n} (${field})${where} ${issue.message}`;
  }

  return issue.message;
}
