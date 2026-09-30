import { execFileSync } from "node:child_process";
import { PROTECTED_FOLDERS, type Cause } from "./causes";

/**
 * When a cause folder first landed, as a Unix time from git, or null when git
 * can't say (no git on the build machine). Read at build time only.
 */
function addedAt(slug: string): number | null {
  try {
    const out = execFileSync("git", ["log", "--diff-filter=A", "--format=%ct", "-1", "--", `causes/${slug}/answers.md`], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out ? Number(out) : null;
  } catch {
    return null;
  }
}

/** The student cause added most recently, for the hero's "New" line. Null hides the line. */
export function newestCause(causes: Cause[]): Cause | null {
  let newest: Cause | null = null;
  let newestAt = -1;
  for (const cause of causes) {
    if (PROTECTED_FOLDERS.includes(cause.slug)) continue;
    const at = addedAt(cause.slug);
    if (at !== null && at > newestAt) {
      newest = cause;
      newestAt = at;
    }
  }
  return newest;
}
