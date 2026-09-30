/**
 * Finds AI-tool attribution in a pull request: co-author or session trailers
 * in its commits, and "Generated with ..." footers in its title or body.
 * Only the actual trailer and footer lines count, so text that merely talks
 * about them (like this comment) doesn't.
 */

export type PrCommit = { sha: string; message: string };
export type PrText = { title: string; body: string | null };

const AI_NAMES = /\b(claude|anthropic|copilot|codex|chatgpt|openai|gemini)\b|noreply@anthropic\.com/i;

/** Trailer lines git and AI tools append to commit messages. */
const TRAILER = /^(co-authored-by|claude-session|claude-run|generated-by):.*$/gim;

/** The footer AI tools add to pull request descriptions, e.g. "🤖 Generated with [Tool](https://…)". */
const FOOTER = /^\W*generated (with|by) \[[^\]]+\]\([^)]+\)\s*$/gim;

export function findAttribution(pr: PrText, commits: PrCommit[]): string[] {
  const problems: string[] = [];

  for (const { sha, message } of commits) {
    for (const [line] of message.matchAll(TRAILER)) {
      if (AI_NAMES.test(line) || /^claude-/i.test(line)) {
        problems.push(`Commit ${sha.slice(0, 7)} ends with "${line.trim()}". Reword the commit without that line.`);
      }
    }
  }

  for (const [where, text] of [["title", pr.title], ["description", pr.body ?? ""]] as const) {
    for (const [line] of text.matchAll(FOOTER)) {
      problems.push(`The pull request ${where} has "${line.trim()}". Delete that line.`);
    }
  }

  return problems;
}
