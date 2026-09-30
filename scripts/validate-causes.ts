/**
 * Checks every cause folder and prints plain-English problems.
 * Exits with code 1 if anything needs fixing. Run with: npm run validate
 */
import fs from "node:fs";
import path from "node:path";
import { readAnswersFrontMatter } from "../lib/answersFile";
import { CAUSES_DIR, listCauseFolders, loadCauseFolder } from "../lib/causes";
import { QUESTIONS } from "../lib/schema";

const problems: string[] = [];

// Files dropped straight into /causes instead of into a folder.
for (const entry of fs.readdirSync(CAUSES_DIR, { withFileTypes: true })) {
  if (entry.isFile() && !entry.name.startsWith(".")) {
    problems.push(`causes/${entry.name}: Files go inside your own folder, like causes/maya-food-access/${entry.name}.`);
  }
}

// The template must keep asking exactly the questions the schema expects.
const templatePath = path.join(CAUSES_DIR, "_template", "answers.md");
const templateKeys = Object.keys(readAnswersFrontMatter(fs.readFileSync(templatePath, "utf8")) as object).sort();
const expectedKeys = Object.keys(QUESTIONS).sort();
if (templateKeys.join() !== expectedKeys.join()) {
  problems.push("_template/answers.md: The template's questions don't match lib/schema.ts. Only a maintainer should change the template.");
}

const slugs = listCauseFolders();
let passed = 0;
for (const slug of slugs) {
  const { errors } = loadCauseFolder(slug);
  if (errors.length === 0) {
    console.log(`  ✓ ${slug}`);
    passed++;
  } else {
    console.log(`  ✗ ${slug}`);
    problems.push(...errors);
  }
}

console.log(`\n${passed} of ${slugs.length} cause folder(s) passed.`);

if (problems.length > 0) {
  console.log(`\nFix these ${problems.length} problem(s):\n`);
  for (const p of problems) console.log(`  • ${p}`);
  console.log("");
  process.exit(1);
}
console.log("Everything looks good.\n");
