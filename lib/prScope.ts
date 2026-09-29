import { PROTECTED_FOLDERS } from "./causes";

/** One entry from GitHub's "list pull request files" API. */
export type PrFile = { filename: string; status: string; previous_filename?: string };

export type ScopeResult = { folder: string | null; errors: string[]; warnings: string[] };

/**
 * Checks that a student's pull request only touches one cause folder.
 * `existingFolders` are the cause folders already on the base branch, used to
 * warn when a PR edits a page that's already live (it might be someone else's).
 */
export function checkPrScope(files: PrFile[], existingFolders: Set<string>): ScopeResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const folders = new Set<string>();

  // A rename touches both its old and new path.
  const paths = files.flatMap((f) => [f.filename, ...(f.previous_filename ? [f.previous_filename] : [])]);

  for (const path of paths) {
    const match = /^causes\/([^/]+)\/.+/.exec(path);
    if (!match) {
      errors.push(`${path}: Student pull requests can only change files inside your own folder in causes/.`);
      continue;
    }
    const folder = match[1];
    if (PROTECTED_FOLDERS.includes(folder) || folder.startsWith("_") || folder.startsWith(".")) {
      errors.push(`${path}: causes/${folder}/ is part of the site. Copy it to your own folder instead of changing it.`);
      continue;
    }
    folders.add(folder);
  }

  if (folders.size > 1) {
    errors.push(
      `This pull request changes ${folders.size} cause folders (${[...folders].sort().join(", ")}). Change only your own folder.`,
    );
  }

  const [folder] = folders;
  if (folders.size === 1 && existingFolders.has(folder) && errors.length === 0) {
    warnings.push(
      `causes/${folder}/ is already on the site. A maintainer should confirm it's the author's own page before merging.`,
    );
  }

  if (files.length === 0) errors.push("This pull request doesn't change any files.");

  return { folder: folders.size === 1 ? folder : null, errors, warnings };
}
