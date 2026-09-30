import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findAttribution } from "@/lib/attribution";

const pr = (body: string, title = "Add cause: Food access") => ({ title, body });
const commit = (message: string) => ({ sha: "eabe23b0000000", message });

describe("tool attribution check", () => {
  it("passes a clean pull request", () => {
    expect(findAttribution(pr("## My cause\n\nFood access."), [commit("Add my cause page\n\nDetails.")])).toEqual([]);
  });

  it.each([
    "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
    "Co-authored-by: Claude <claude@anthropic.com>",
    "co-authored-by: Copilot <copilot@github.com>",
    "Claude-Session: https://claude.ai/code/session_123",
  ])("flags the commit trailer %j", (trailer) => {
    const problems = findAttribution(pr(""), [commit(`Add my cause page\n\n${trailer}`)]);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^Commit eabe23b /);
  });

  it("keeps human co-authors", () => {
    expect(findAttribution(pr(""), [commit("Pair on the quiz\n\nCo-authored-by: Maya R <maya@example.com>")])).toEqual([]);
  });

  it.each([
    "🤖 Generated with [Claude Code](https://claude.com/claude-code)",
    "Generated with [Some Tool](https://example.com)",
  ])("flags the description footer %j", (footer) => {
    expect(findAttribution(pr(`## My cause\n\nFood access.\n\n${footer}\n`), [])).toEqual([
      `The pull request description has "${footer}". Delete that line.`,
    ]);
  });

  it("ignores text that only talks about attribution", () => {
    const body = 'Turns off the "generated with" footer and the co-author trailer.\nCo-authored-by lines are checked in CI.';
    expect(findAttribution(pr(body), [])).toEqual([]);
  });

  it("handles a pull request with no description", () => {
    expect(findAttribution({ title: "Add cause", body: null }, [])).toEqual([]);
  });
});

describe("shared agent settings", () => {
  it("keep commit and pull request attribution turned off", () => {
    const settings = JSON.parse(fs.readFileSync(path.join(__dirname, "..", ".claude", "settings.json"), "utf8"));
    expect(settings.attribution).toEqual({ commit: "", pr: "", sessionUrl: false });
  });
});
