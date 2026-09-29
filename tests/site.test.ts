import { describe, expect, it } from "vitest";
import { relatedCauses, type Cause, type CauseSummary } from "@/lib/causes";
import { CUSTOM_SECTION_CSP, HEIGHT_MESSAGE, prepareCustomHtml } from "@/lib/customSection";
import { filterCauses } from "@/lib/search";

const summary = (slug: string, o: Partial<CauseSummary>): CauseSummary => ({
  slug,
  cause: "",
  tagline: "",
  nonprofitName: "",
  neighborhood: "",
  interests: [],
  author: "",
  imageUrl: "",
  imageAlt: "",
  ...o,
});

describe("directory search", () => {
  const causes = [
    summary("a", { cause: "Food access", author: "Maya R", neighborhood: "South LA" }),
    summary("b", { cause: "Animal rescue", nonprofitName: "Best Friends", interests: ["dogs"] }),
  ];
  it.each([
    ["FOOD", ["a"]],
    ["maya", ["a"]],
    ["south", ["a"]],
    ["friend", ["b"]],
    ["dog", ["b"]],
    ["  ", ["a", "b"]],
    ["zzz", []],
  ])("%j finds %j", (q, expected) => {
    expect(filterCauses(causes, q).map((c) => c.slug)).toEqual(expected);
  });
});

describe("custom section preparation", () => {
  it("puts the CSP first in <head> and adds the height reporter", () => {
    const out = prepareCustomHtml('<!doctype html><html><head><script src="x"></script></head><body></body></html>');
    const csp = out.indexOf("Content-Security-Policy");
    expect(csp).toBeGreaterThan(-1);
    expect(csp).toBeLessThan(out.indexOf('src="x"'));
    expect(out).toContain(HEIGHT_MESSAGE);
  });

  it("handles files without a <head>", () => {
    expect(prepareCustomHtml("<p>hi</p>")).toMatch(/^<!doctype html>\n<head>\n<meta http-equiv="Content-Security-Policy"/);
  });

  it("blocks forms and unknown script hosts in the browser too", () => {
    expect(CUSTOM_SECTION_CSP).toContain("form-action 'none'");
    expect(CUSTOM_SECTION_CSP).toMatch(/script-src 'unsafe-inline' https:\/\/cdn\.jsdelivr\.net https:\/\/cdnjs\.cloudflare\.com;/);
  });
});

describe("more causes", () => {
  const cause = (slug: string, interests: string[]) => ({ slug, interests }) as Cause;
  const all = [cause("me", ["food", "kids"]), cause("x", ["art"]), cause("y", ["Food"]), cause("z", ["food", "kids"]), cause("w", [])];

  it("ranks by shared interests and never includes the cause itself", () => {
    const result = relatedCauses(all[0], all).map((c) => c.slug);
    expect(result.slice(0, 2)).toEqual(["z", "y"]);
    expect(result).toHaveLength(3);
    expect(result).not.toContain("me");
  });
});
