import { describe, expect, it } from "vitest";
import type { CauseIndexEntry } from "@/lib/causeIndex";
import { keywordMatch } from "@/lib/keywordMatch";

const entry = (slug: string, overrides: Partial<CauseIndexEntry>): CauseIndexEntry => ({
  slug,
  cause: "",
  tagline: "",
  nonprofitName: "",
  neighborhood: "",
  interests: [],
  helpTypes: ["time"],
  timeCommitment: "",
  effort: "medium",
  ...overrides,
});

const INDEX = [
  entry("ana-beach-cleanup", { cause: "Clean beaches", interests: ["ocean", "environment", "outdoors"], neighborhood: "Venice" }),
  entry("jay-animal-rescue", { cause: "Animal rescue", interests: ["dogs", "cats", "shelters"], helpTypes: ["time", "money"] }),
  entry("maya-food-access", { cause: "Food access", interests: ["food", "hunger", "community"], helpTypes: ["money"], effort: "low" }),
  entry("leo-youth-literacy", { cause: "Youth literacy", interests: ["reading", "kids", "education"], helpTypes: ["time", "skills"] }),
  entry("abhi-youth-boxing", {
    cause: "Youth development through boxing",
    nonprofitName: "Ring of Hope LA",
    interests: ["sports", "youth", "mentorship", "fitness", "community"],
  }),
];
const slugs = new Set(INDEX.map((e) => e.slug));

describe("keyword fallback matcher", () => {
  it.each([
    [["I love animals"], "jay-animal-rescue"],
    [["I want to help kids"], "leo-youth-literacy"],
    [["the ocean", "I like being outside"], "ana-beach-cleanup"],
    [["people going hungry"], "maya-food-access"],
    [["I'd rather donate"], "maya-food-access"],
    [["martial arts"], "abhi-youth-boxing"],
    [["karate"], "abhi-youth-boxing"],
    [["I want to coach sports"], "abhi-youth-boxing"],
    [["Ring of Hope"], "abhi-youth-boxing"],
  ])("%j matches %s", (messages, expected) => {
    expect(keywordMatch(messages, INDEX)?.slug).toBe(expected);
  });

  it("returns up to 2 alternates, never the match itself", () => {
    const result = keywordMatch(["I want to volunteer with kids or dogs"], INDEX)!;
    expect(result.alternates.length).toBeLessThanOrEqual(2);
    expect(result.alternates).not.toContain(result.slug);
  });

  it("still returns a real cause when nothing matches", () => {
    const result = keywordMatch(["asdf qwerty"], INDEX)!;
    expect(slugs.has(result.slug)).toBe(true);
    expect(result.reason).toMatch(/good place to start/);
    expect(result.confident).toBe(false);
  });

  it("is confident when something the visitor said matched", () => {
    expect(keywordMatch(["martial arts"], INDEX)!.confident).toBe(true);
  });

  it("only ever returns slugs from the index", () => {
    for (const text of ["", "animals", "money time skills", "Venice weekends", "🙂"]) {
      const result = keywordMatch([text], INDEX)!;
      expect(slugs.has(result.slug)).toBe(true);
      for (const alt of result.alternates) expect(slugs.has(alt)).toBe(true);
    }
  });

  it("returns null with no causes", () => {
    expect(keywordMatch(["animals"], [])).toBeNull();
  });
});
