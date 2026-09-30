/**
 * CI check for every pull request: no AI-tool co-author trailers in its
 * commits and no "Generated with" footer in its title or description.
 *
 *   tsx scripts/check-attribution.ts <pr.json> <pr-commits.json>
 *
 * pr.json is { title, body } from the pull request event; pr-commits.json is
 * the output of GitHub's "list commits on a pull request" API. Prints GitHub
 * annotations and exits 1 on any problem.
 */
import fs from "node:fs";
import { findAttribution, type PrText } from "../lib/attribution";

const [prFile, commitsFile] = process.argv.slice(2);
if (!prFile || !commitsFile) {
  console.error("Usage: tsx scripts/check-attribution.ts <pr.json> <pr-commits.json>");
  process.exit(2);
}

const pr = JSON.parse(fs.readFileSync(prFile, "utf8")) as PrText;
// `gh api --paginate` concatenates one JSON array per page.
const raw = fs.readFileSync(commitsFile, "utf8").trim().replace(/\]\s*\[/g, ",");
const commits = (JSON.parse(raw) as { sha: string; commit: { message: string } }[]).map((c) => ({
  sha: c.sha,
  message: c.commit.message,
}));

const problems = findAttribution(pr, commits);
for (const p of problems) console.log(`::error title=Tool attribution::${p}`);

if (problems.length > 0) {
  console.log(`\n${problems.length} problem(s). Commits and pull requests in this repo don't credit AI tools.`);
  process.exit(1);
}
console.log(`OK: no tool attribution in ${commits.length} commit(s) or the description.`);
