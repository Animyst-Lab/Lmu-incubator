/**
 * CI check for student pull requests: only one cause folder may change.
 *
 *   tsx scripts/check-pr-scope.ts <pr-files.json>
 *
 * The JSON is the output of GitHub's "list pull request files" API. Existing
 * cause folders are read from this checkout, which in CI is the base branch.
 * Prints GitHub annotations and exits 1 on any error.
 */
import fs from "node:fs";
import { listCauseFolders } from "../lib/causes";
import { checkPrScope, type PrFile } from "../lib/prScope";

const file = process.argv[2];
if (!file) {
  console.error("Usage: tsx scripts/check-pr-scope.ts <pr-files.json>");
  process.exit(2);
}

// `gh api --paginate` concatenates one JSON array per page.
const raw = fs.readFileSync(file, "utf8").trim().replace(/\]\s*\[/g, ",");
const files = JSON.parse(raw) as PrFile[];
const { folder, errors, warnings } = checkPrScope(files, new Set(listCauseFolders()));

for (const w of warnings) console.log(`::warning title=Existing cause folder::${w}`);
for (const e of errors) console.log(`::error title=Outside your folder::${e}`);

if (errors.length > 0) {
  console.log(`\n${errors.length} problem(s). Student pull requests can only change one folder in causes/.`);
  console.log("Ask your AI helper to undo changes to any other files, then push again.");
  process.exit(1);
}
console.log(`OK: this pull request only changes causes/${folder}/.`);
