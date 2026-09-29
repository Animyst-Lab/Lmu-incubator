import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const REPO_CAUSES = path.join(__dirname, "..", "causes");
export const EXAMPLE = path.join(REPO_CAUSES, "example-food-access");

/** A throwaway /causes folder holding one copy of the finished example under `slug`. */
export function makeCausesDir(slug = "maya-food-access") {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lion-share-"));
  fs.cpSync(EXAMPLE, path.join(dir, slug), { recursive: true });
  const folder = path.join(dir, slug);
  return {
    dir,
    folder,
    read: (file: string) => fs.readFileSync(path.join(folder, file), "utf8"),
    write: (file: string, content: string | Buffer) => fs.writeFileSync(path.join(folder, file), content),
    /** Replace one `key: value` line in answers.md. */
    setAnswer: (key: string, yamlValue: string) => {
      const p = path.join(folder, "answers.md");
      const next = fs.readFileSync(p, "utf8").replace(new RegExp(`^${key}:.*$`, "m"), `${key}: ${yamlValue}`);
      fs.writeFileSync(p, next);
    },
    cleanup: () => fs.rmSync(dir, { recursive: true, force: true }),
  };
}
