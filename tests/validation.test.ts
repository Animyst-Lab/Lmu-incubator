import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { afterEach, describe, expect, it } from "vitest";
import { listCauseFolders, loadCauseFolder } from "@/lib/causes";
import { QUESTIONS } from "@/lib/schema";
import { makeCausesDir, REPO_CAUSES } from "./helpers";

let fixture: ReturnType<typeof makeCausesDir>;
afterEach(() => fixture?.cleanup());

const errorsFor = (setup: (f: ReturnType<typeof makeCausesDir>) => void, slug = "maya-food-access") => {
  fixture = makeCausesDir(slug);
  setup(fixture);
  return loadCauseFolder(slug, fixture.dir).errors;
};

describe("cause folder validation", () => {
  it("accepts the finished example", () => {
    expect(errorsFor(() => {})).toEqual([]);
  });

  it("every real cause folder in the repo passes", () => {
    for (const slug of listCauseFolders(REPO_CAUSES)) {
      expect(loadCauseFolder(slug, REPO_CAUSES).errors, slug).toEqual([]);
    }
  });

  it("names the question and asks for https when a link is wrong", () => {
    const errors = errorsFor((f) => f.setAnswer("nonprofitWebsite", '"www.lafoodbank.org"'));
    expect(errors).toEqual([
      "maya-food-access/answers.md: Question 7 (nonprofitWebsite) needs a full link starting with https:// (copy it from your browser's address bar).",
    ]);
  });

  it("rejects http links", () => {
    const errors = errorsFor((f) => f.setAnswer("donateLink", '"http://www.lafoodbank.org/donate/"'));
    expect(errors[0]).toMatch(/Question 14 \(donateLink\) needs a full link starting with https:\/\//);
  });

  it("flags empty answers with the question number", () => {
    const errors = errorsFor((f) => f.setAnswer("nonprofitName", '""'));
    expect(errors).toEqual([
      "maya-food-access/answers.md: Question 6 (nonprofitName) is empty. Put your answer inside the quotes.",
    ]);
  });

  it("limits the tagline to 10 words", () => {
    const errors = errorsFor((f) => f.setAnswer("tagline", '"one two three four five six seven eight nine ten eleven"'));
    expect(errors[0]).toMatch(/Question 3 \(tagline\) must be 10 words or fewer/);
  });

  it("needs 3 to 5 interests", () => {
    expect(errorsFor((f) => f.setAnswer("interests", '["food", "hunger"]'))[0]).toMatch(/Question 18 \(interests\) needs 3 to 5/);
    expect(errorsFor((f) => f.setAnswer("interests", '["a", "b", "c", "d", "e", "f"]'))[0]).toMatch(/Question 18/);
    expect(errorsFor((f) => f.setAnswer("interests", '["food", "", "health"]'))[0]).toMatch(
      /Question 18 \(interests\), item 2, is empty/,
    );
  });

  it("only allows time, money, and skills as help types", () => {
    expect(errorsFor((f) => f.setAnswer("helpTypes", '["time", "love"]'))[0]).toMatch(
      /Question 19 \(helpTypes\), item 2, can only contain time, money, or skills/,
    );
  });

  it("only allows low, medium, or high effort", () => {
    expect(errorsFor((f) => f.setAnswer("effort", '"a lot"'))[0]).toMatch(/Question 20 \(effort\) must be low, medium, or high/);
  });

  it("needs at least one volunteer step", () => {
    const errors = errorsFor((f) => {
      const text = f.read("answers.md").replace(/volunteerSteps:\n(  - .*\n)+/, "volunteerSteps: []\n");
      f.write("answers.md", text);
    });
    expect(errors[0]).toMatch(/Question 13 \(volunteerSteps\) needs at least 1 step/);
  });

  it("explains broken YAML instead of crashing", () => {
    const errors = errorsFor((f) => f.setAnswer("cause", '"Food access'));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/answers\.md: couldn't be read near line \d+\. Check that every answer is inside "double quotes"/);
  });

  it("flags lines that aren't questions", () => {
    const errors = errorsFor((f) => f.write("answers.md", f.read("answers.md").replace("effort:", 'favoriteColor: "red"\neffort:')));
    expect(errors[0]).toMatch(/extra lines that aren't questions \(favoriteColor\)/);
  });

  it("requires a lowercase, hyphenated folder name", () => {
    const errors = errorsFor(() => {}, "Maya_Food");
    expect(errors[0]).toMatch(/folder name must be lowercase letters and numbers joined by hyphens/);
  });

  it("requires the image named in question 16", () => {
    const errors = errorsFor((f) => fs.rmSync(path.join(f.folder, "image.jpg")));
    expect(errors).toEqual([
      'maya-food-access/image.jpg: is missing. Question 16 says your image is "image.jpg", so add that file to your folder.',
    ]);
  });

  it("rejects images over 1 MB", () => {
    const errors = errorsFor((f) => f.write("image.jpg", Buffer.alloc(1024 * 1024 + 1)));
    expect(errors[0]).toMatch(/image\.jpg: is over 1 MB/);
  });

  it("rejects image names that aren't JPG or PNG", () => {
    expect(errorsFor((f) => f.setAnswer("image", '"image.gif"'))[0]).toMatch(/Question 16 \(image\) should be a file name/);
  });

  it("requires custom.html under 500 KB", () => {
    expect(errorsFor((f) => fs.rmSync(path.join(f.folder, "custom.html")))[0]).toMatch(/custom\.html: is missing/);
    expect(errorsFor((f) => f.write("custom.html", "x".repeat(500 * 1024 + 1)))[0]).toMatch(/custom\.html: is over 500 KB/);
  });

  it("only allows scripts from the two CDNs", () => {
    const ok = errorsFor((f) =>
      f.write("custom.html", '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script><script src="https://cdnjs.cloudflare.com/x.js"></script>'),
    );
    expect(ok).toEqual([]);
    const bad = errorsFor((f) =>
      f.write("custom.html", '<script src="https://evil.example.com/track.js"></script><script src="local.js"></script>'),
    );
    expect(bad).toHaveLength(2);
    expect(bad[0]).toMatch(/loads a script from "https:\/\/evil\.example\.com\/track\.js"/);
  });

  it("rejects forms in custom.html", () => {
    expect(errorsFor((f) => f.write("custom.html", "<form><input name=email></form>"))[0]).toMatch(/has a <form>/);
  });

  it.each(["---js", "---javascript", "--- js", "---coffee"])("never runs %s front matter as code", (opening) => {
    const g = globalThis as { __answersRan?: boolean };
    delete g.__answersRan;
    const errors = errorsFor((f) => f.write("answers.md", `${opening}\n{ author: (globalThis.__answersRan = true, "x") }\n---\n`));
    expect(g.__answersRan).toBeUndefined();
    expect(errors[0]).toMatch(/answers\.md: must start with a line that's just three dashes/);
  });
});

describe("template", () => {
  it("asks exactly the questions the schema expects, in order", () => {
    const text = fs.readFileSync(path.join(REPO_CAUSES, "_template", "answers.md"), "utf8");
    expect(Object.keys(matter(text).data)).toEqual(Object.keys(QUESTIONS));
    for (const [field, { n }] of Object.entries(QUESTIONS)) {
      expect(text, field).toMatch(new RegExp(`# ${n}\\. [^\\n]*\\n${field}:`));
    }
  });

  it("is skipped by the site", () => {
    expect(listCauseFolders(REPO_CAUSES)).not.toContain("_template");
  });
});

describe("first run", () => {
  it("reports a missing image even while other answers are still blank", () => {
    fixture = makeCausesDir();
    fs.copyFileSync(path.join(REPO_CAUSES, "_template", "answers.md"), path.join(fixture.folder, "answers.md"));
    fs.rmSync(path.join(fixture.folder, "image.jpg"));
    const errors = loadCauseFolder("maya-food-access", fixture.dir).errors;
    expect(errors.some((e) => e.startsWith("maya-food-access/image.jpg: is missing"))).toBe(true);
  });
});
