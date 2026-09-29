/**
 * Copies each valid cause's image and custom.html into /public so they can be
 * served as static files. Runs before `next dev` and `next build`.
 *
 *   causes/<slug>/<image>      -> public/cause-assets/<slug>/<image>
 *   causes/<slug>/custom.html  -> public/custom/<slug>.html  (with CSP + height script added)
 */
import fs from "node:fs";
import path from "node:path";
import { CAUSES_DIR, listCauseFolders, loadCauseFolder } from "../lib/causes";
import { prepareCustomHtml } from "../lib/customSection";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const ASSETS_DIR = path.join(PUBLIC_DIR, "cause-assets");
const CUSTOM_DIR = path.join(PUBLIC_DIR, "custom");

for (const dir of [ASSETS_DIR, CUSTOM_DIR]) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

let copied = 0;
for (const slug of listCauseFolders()) {
  const { cause, errors } = loadCauseFolder(slug);
  if (!cause) {
    console.warn(`[lion-share] Not copying ${slug}, it has ${errors.length} problem(s). Run npm run validate.`);
    continue;
  }

  const src = path.join(CAUSES_DIR, slug);
  fs.mkdirSync(path.join(ASSETS_DIR, slug), { recursive: true });
  fs.copyFileSync(path.join(src, cause.image), path.join(ASSETS_DIR, slug, cause.image));

  const html = fs.readFileSync(path.join(src, "custom.html"), "utf8");
  fs.writeFileSync(path.join(CUSTOM_DIR, `${slug}.html`), prepareCustomHtml(html));
  copied++;
}

console.log(`[lion-share] Copied assets for ${copied} cause(s).`);
