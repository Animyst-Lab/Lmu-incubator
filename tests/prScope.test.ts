import { describe, expect, it } from "vitest";
import { checkPrScope, type PrFile } from "@/lib/prScope";

const added = (filename: string): PrFile => ({ filename, status: "added" });
const existing = new Set(["example-food-access", "jay-animal-rescue"]);

describe("student PR scope", () => {
  it("allows a new cause folder", () => {
    const r = checkPrScope([added("causes/maya-food-access/answers.md"), added("causes/maya-food-access/image.jpg")], existing);
    expect(r).toEqual({ folder: "maya-food-access", errors: [], warnings: [] });
  });

  it.each([
    ["app code", "app/page.tsx"],
    ["package.json", "package.json"],
    ["CI config", ".github/workflows/validate.yml"],
    ["CLAUDE.md", "CLAUDE.md"],
    ["a file loose in causes/", "causes/answers.md"],
  ])("rejects changes to %s", (_, path) => {
    const r = checkPrScope([added("causes/maya-food-access/answers.md"), added(path)], existing);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0]).toMatch(/can only change files inside your own folder/);
  });

  it.each(["_template", "example-food-access"])("rejects changes to causes/%s", (folder) => {
    const r = checkPrScope([{ filename: `causes/${folder}/answers.md`, status: "modified" }], existing);
    expect(r.errors[0]).toMatch(/is part of the site/);
  });

  it("rejects touching two folders", () => {
    const r = checkPrScope(
      [added("causes/maya-food-access/answers.md"), { filename: "causes/jay-animal-rescue/answers.md", status: "modified" }],
      existing,
    );
    expect(r.errors).toEqual([expect.stringMatching(/changes 2 cause folders \(jay-animal-rescue, maya-food-access\)/)]);
  });

  it("counts both sides of a rename", () => {
    const r = checkPrScope([{ filename: "causes/maya-food/answers.md", previous_filename: "causes/jay-animal-rescue/answers.md", status: "renamed" }], existing);
    expect(r.errors[0]).toMatch(/changes 2 cause folders/);
  });

  it("warns, but allows, edits to a folder that's already live", () => {
    const r = checkPrScope([{ filename: "causes/jay-animal-rescue/custom.html", status: "modified" }], existing);
    expect(r.errors).toEqual([]);
    expect(r.warnings[0]).toMatch(/already on the site/);
  });

  it("rejects an empty pull request", () => {
    expect(checkPrScope([], existing).errors).toEqual(["This pull request doesn't change any files."]);
  });
});
