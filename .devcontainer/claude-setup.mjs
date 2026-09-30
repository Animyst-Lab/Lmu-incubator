// Pre-answers Claude Code's first-run questions so students land straight on
// the prompt: the theme and safety notes, terminal setup, trusting this
// folder, and using the class API key from the Codespaces secret (whose
// "Use this API key?" question defaults to No).
//
// Runs each time the Codespace is opened. It only records the answers Claude
// Code itself saves in ~/.claude.json; like Claude Code, it keeps just the
// key's last 20 characters, never the key.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const file = path.join(os.homedir(), ".claude.json");
let config = {};
try {
  config = JSON.parse(fs.readFileSync(file, "utf8"));
} catch {
  // No config yet: this is the first run.
}

config.hasCompletedOnboarding = true;
config.shiftEnterKeyBindingInstalled = true;

const workspace = process.cwd();
config.projects ??= {};
config.projects[workspace] = { ...config.projects[workspace], hasTrustDialogAccepted: true };

const key = process.env.ANTHROPIC_API_KEY;
if (key) {
  const tail = key.slice(-20);
  const responses = (config.customApiKeyResponses ??= {});
  responses.approved = [...new Set([...(responses.approved ?? []), tail])];
  responses.rejected = (responses.rejected ?? []).filter((k) => k !== tail);
}

fs.writeFileSync(file, JSON.stringify(config, null, 2));
console.log(`[lion-share] Claude Code is ready: run \`claude\`${key ? "" : " (no class API key found in this Codespace)"}.`);
