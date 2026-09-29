import type { CauseIndexEntry } from "./causeIndex";

export type MatchResult = { slug: string; reason: string; alternates: string[] };

const STOPWORDS = new Set(
  "a an and are as at be but by can do for from have i i'd i'm im in into is it its just like love me more my not of on only or our really so some that the their them they this to want we what when where which who with would you your about care help".split(
    " ",
  ),
);

/** Everyday words mapped to the terms students are likely to use in their answers. */
const SYNONYMS: Record<string, string[]> = {
  animal: ["pet", "dog", "cat", "rescue", "shelter", "wildlife"],
  pet: ["animal", "dog", "cat"],
  dog: ["animal", "pet"],
  cat: ["animal", "pet"],
  kid: ["child", "youth", "student", "education", "school", "teen"],
  child: ["kid", "youth"],
  youth: ["kid", "child", "teen"],
  teen: ["youth", "kid"],
  school: ["education", "student", "literacy", "kid"],
  read: ["literacy", "book", "education"],
  book: ["literacy", "read"],
  food: ["hunger", "meal", "nutrition"],
  hunger: ["food", "meal"],
  meal: ["food", "hunger"],
  hungry: ["hunger", "food", "meal"],
  starving: ["hunger", "food"],
  eat: ["food", "meal"],
  homeless: ["housing", "unhoused", "shelter", "homelessness"],
  unhoused: ["homeless", "housing", "homelessness"],
  housing: ["homeless", "unhoused", "homelessness"],
  environment: ["climate", "nature", "ocean", "beach", "tree", "sustainability"],
  climate: ["environment", "sustainability"],
  ocean: ["beach", "environment", "water"],
  beach: ["ocean", "environment", "cleanup"],
  nature: ["environment", "park", "tree"],
  outdoor: ["nature", "park", "environment", "beach", "outside"],
  outside: ["outdoor", "nature", "park"],
  health: ["medical", "wellness", "mental"],
  mental: ["health", "wellness"],
  elderly: ["senior", "older"],
  senior: ["elderly", "older"],
  art: ["music", "creative", "arts"],
  music: ["art", "creative"],
};

/** Phrases that say how someone wants to help, mapped to helpTypes. */
const HELP_SIGNALS: Record<string, string[]> = {
  money: ["donate", "donation", "money", "give", "fund", "cash", "gift"],
  time: ["volunteer", "time", "weekend", "hands", "handson", "show", "shift", "saturday", "sunday"],
  skills: ["skill", "design", "code", "coding", "teach", "tutor", "write", "writing", "photo", "social", "marketing"],
};

const LOW_EFFORT_SIGNALS = ["busy", "little", "quick", "short", "online", "donate", "weekend"];

function stem(word: string): string {
  if (word.length > 4 && word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.length > 4 && word.endsWith("ing")) return word.slice(0, -3);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map(stem);
}

function expand(words: string[]): Set<string> {
  const out = new Set(words);
  for (const w of words) for (const s of SYNONYMS[w] ?? []) out.add(stem(s));
  return out;
}

/**
 * Scores causes by word overlap with what the visitor said. Used whenever the
 * LLM is unavailable, so the hero always returns a real cause.
 */
export function keywordMatch(visitorMessages: string[], index: CauseIndexEntry[]): MatchResult | null {
  if (index.length === 0) return null;

  const said = tokenize(visitorMessages.join(" "));
  const saidSet = new Set(said);
  const wanted = expand(said);
  const wantsLowEffort = LOW_EFFORT_SIGNALS.some((w) => saidSet.has(stem(w)));

  const scored = index.map((entry, position) => {
    const matched = new Set<string>();
    let score = 0;

    const weigh = (text: string, weight: number) => {
      for (const t of new Set(tokenize(text))) {
        if (wanted.has(t)) {
          score += weight;
          matched.add(t);
        }
      }
    };
    for (const interest of entry.interests) weigh(interest, 3);
    weigh(entry.cause, 3);
    weigh(entry.tagline, 1);
    weigh(entry.neighborhood, 1);

    for (const type of entry.helpTypes) {
      if (HELP_SIGNALS[type].some((w) => saidSet.has(stem(w)))) score += 2;
    }
    if (wantsLowEffort && entry.effort === "low") score += 1;

    return { entry, score, matched: [...matched], position };
  });

  scored.sort((a, b) => b.score - a.score || a.position - b.position);
  const [best, ...rest] = scored;

  // Quote the visitor's own words where possible, not the synonyms they were expanded to.
  const ownWords = best.matched.filter((t) => saidSet.has(t));
  const quoted = (ownWords.length > 0 ? ownWords : best.matched).slice(0, 3);
  const reason =
    quoted.length > 0
      ? `It connects to what you said about ${quoted.join(", ")}.`
      : best.score > 0
        ? "It fits the way you said you'd like to help."
        : "Nothing matched closely yet, so here's a good place to start.";

  return {
    slug: best.entry.slug,
    reason,
    alternates: rest
      .filter((r) => r.score > 0 || best.score === 0)
      .slice(0, 2)
      .map((r) => r.entry.slug),
  };
}
