import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const SCRIPT = path.join(__dirname, "..", "scripts", "create-student-branches.sh");
const env = { ...process.env, GIT_AUTHOR_NAME: "t", GIT_AUTHOR_EMAIL: "t@t", GIT_COMMITTER_NAME: "t", GIT_COMMITTER_EMAIL: "t@t" };

let root: string;
let clone: string;

const git = (cwd: string, ...args: string[]) => execFileSync("git", args, { cwd, env, encoding: "utf8" });
const remoteBranches = () =>
  git(clone, "ls-remote", "--heads", "origin")
    .trim()
    .split("\n")
    .map((l) => l.split("refs/heads/")[1])
    .filter((b) => b?.startsWith("student/"))
    .sort();
const run = (roster: string, ...args: string[]) => {
  fs.writeFileSync(path.join(clone, "roster.txt"), roster);
  return spawnSync("bash", [SCRIPT, ...args], { cwd: clone, env, encoding: "utf8" });
};

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "lion-branches-"));
  git(root, "init", "--quiet", "--bare", "-b", "main", "remote.git");
  git(root, "clone", "--quiet", path.join(root, "remote.git"), "work");
  clone = path.join(root, "work");
  git(clone, "commit", "--quiet", "--allow-empty", "-m", "init");
  git(clone, "push", "--quiet", "origin", "HEAD:main");
});
afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

describe("create-student-branches.sh", () => {
  it("creates one branch per student, from main", () => {
    const out = run("# class of 2026\nMaya Rodriguez\n\n  Jay   Park  \nJosé Álvarez  # late add\nAna María López\n");
    expect(out.status, out.stderr).toBe(0);
    expect(remoteBranches()).toEqual(["student/ana-l", "student/jay-p", "student/jose-a", "student/maya-r"]);
    const main = git(clone, "rev-parse", "origin/main").trim();
    expect(git(clone, "ls-remote", "origin", "refs/heads/student/maya-r").split("\t")[0]).toBe(main);
  });

  it("skips branches that already exist, so late students can be added", () => {
    run("Maya Rodriguez\n");
    const out = run("Maya Rodriguez\nJay Park\n");
    expect(out.stdout).toMatch(/student\/maya-r \(already exists\)/);
    expect(out.stdout).toMatch(/student\/jay-p \(created\)/);
    expect(remoteBranches()).toEqual(["student/jay-p", "student/maya-r"]);
  });

  it("creates nothing on a dry run", () => {
    const out = run("Maya Rodriguez\n", "--dry-run");
    expect(out.status).toBe(0);
    expect(out.stdout).toMatch(/would create/);
    expect(remoteBranches()).toEqual([]);
  });

  it("refuses the whole roster if two students would share a branch", () => {
    const out = run("Maya Rodriguez\nMaya Ramos\nJay Park\n");
    expect(out.status).toBe(1);
    expect(out.stderr).toMatch(/Maya Rodriguez,Maya Ramos would all get student\/maya-r/);
    expect(remoteBranches()).toEqual([]);
  });

  it("needs a first and last name", () => {
    const out = run("Maya\n");
    expect(out.status).toBe(1);
    expect(out.stderr).toMatch(/"Maya" needs a first and last name/);
  });
});
