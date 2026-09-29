import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { siteStats, type Cause } from "@/lib/causes";
import { formatClock } from "@/lib/clock";

describe("LA clock", () => {
  it("formats time without a leading hour zero and a lowercase meridiem", () => {
    // 2025-03-12 16:41 UTC is 9:41am in Los Angeles (PDT).
    expect(formatClock(new Date("2025-03-12T16:41:00Z"))).toEqual({ time: "9:41am", date: "12 March, 2025" });
    expect(formatClock(new Date("2025-12-01T05:05:00Z"))).toEqual({ time: "9:05pm", date: "30 November, 2025" });
  });
});

describe("site stats", () => {
  it("counts unique nonprofits, areas, and authors case-insensitively", () => {
    const c = (nonprofitName: string, neighborhood: string, author: string) => ({ nonprofitName, neighborhood, author }) as Cause;
    expect(siteStats([c("LA Food Bank", "Westchester", "Maya"), c("la food bank ", "Venice", "maya"), c("Heal the Bay", "Venice", "Jay")])).toEqual({
      causes: 3,
      nonprofits: 2,
      neighborhoods: 2,
      students: 2,
    });
  });
});

describe("design tokens", () => {
  // Student custom sections read these by name, so they must never disappear.
  const PUBLIC_CONTRACT = ["--bg", "--surface", "--ink", "--muted", "--border", "--accent", "--accent-ink", "--accent-strong", "--radius", "--font-sans", "--font-display"];

  it("keeps every token custom sections depend on", () => {
    const css = fs.readFileSync(path.join(__dirname, "..", "public", "tokens.css"), "utf8");
    for (const token of PUBLIC_CONTRACT) expect(css, token).toMatch(new RegExp(`${token}:`));
  });
});
