/**
 * Copies each valid cause's image and custom.html into /public so they can be
 * served as static files. Runs before `next build`, and is how `npm run dev`
 * starts.
 *
 *   causes/<slug>/<image>      -> public/cause-assets/<slug>/<image>
 *   causes/<slug>/custom.html  -> public/custom/<slug>.html  (with CSP, height script, and tokens added)
 *
 * With --watch, it then starts `next dev` (passing along any other arguments)
 * and re-copies a cause whenever a file in its folder changes, so a reload
 * shows the latest custom section and image.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { CAUSES_DIR, listCauseFolders, loadCauseFolder } from "../lib/causes";
import { prepareCustomHtml } from "../lib/customSection";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const ASSETS_DIR = path.join(PUBLIC_DIR, "cause-assets");
const CUSTOM_DIR = path.join(PUBLIC_DIR, "custom");
const TOKENS_CSS = fs.readFileSync(path.join(PUBLIC_DIR, "tokens.css"), "utf8");

/** Removes a cause's copied files, then copies them again if the folder is valid. Returns whether it copied. */
function copyCause(slug: string, quiet = false): boolean {
  fs.rmSync(path.join(ASSETS_DIR, slug), { recursive: true, force: true });
  fs.rmSync(path.join(CUSTOM_DIR, `${slug}.html`), { force: true });
  if (!fs.existsSync(path.join(CAUSES_DIR, slug))) return false;

  const { cause, errors } = loadCauseFolder(slug);
  if (!cause) {
    if (!quiet) console.warn(`[lion-share] Not copying ${slug}, it has ${errors.length} problem(s). Run npm run validate.`);
    return false;
  }

  const src = path.join(CAUSES_DIR, slug);
  fs.mkdirSync(path.join(ASSETS_DIR, slug), { recursive: true });
  fs.copyFileSync(path.join(src, cause.image), path.join(ASSETS_DIR, slug, cause.image));

  const html = fs.readFileSync(path.join(src, "custom.html"), "utf8");
  fs.writeFileSync(path.join(CUSTOM_DIR, `${slug}.html`), prepareCustomHtml(html, TOKENS_CSS));
  return true;
}

for (const dir of [ASSETS_DIR, CUSTOM_DIR]) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}
const copied = listCauseFolders().filter((slug) => copyCause(slug)).length;
console.log(`[lion-share] Copied assets for ${copied} cause(s).`);

const [flag, ...nextArgs] = process.argv.slice(2);
if (flag === "--watch") {
  // Editors often write a file in several steps, so wait for a quiet moment before copying.
  const pending = new Map<string, NodeJS.Timeout>();
  fs.watch(CAUSES_DIR, { recursive: true }, (_event, file) => {
    const slug = file?.split(/[/\\]/)[0];
    if (!slug || slug.startsWith("_") || slug.startsWith(".")) return;
    clearTimeout(pending.get(slug));
    pending.set(
      slug,
      setTimeout(() => {
        pending.delete(slug);
        if (copyCause(slug, true)) console.log(`[lion-share] Updated ${slug}.`);
        else if (fs.existsSync(path.join(CAUSES_DIR, slug))) console.warn(`[lion-share] ${slug} has problems, so it's hidden. Run npm run validate to see them.`);
        else console.log(`[lion-share] Removed ${slug}.`);
      }, 200),
    );
  });

  // Print the address people open, which in a Codespace is the forwarded one, not localhost.
  const portArg = nextArgs.findIndex((a) => a === "-p" || a === "--port");
  const port = (portArg >= 0 && nextArgs[portArg + 1]) || process.env.PORT || "3000";
  const { CODESPACE_NAME: codespace, GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN: domain } = process.env;
  const base = codespace && domain ? `https://${codespace}-${port}.${domain}` : `http://localhost:${port}`;
  console.log(`[lion-share] Preview: ${base}/causes/<folder-name>  (reload after each change)`);

  const next = spawn(path.join(process.cwd(), "node_modules", ".bin", "next"), ["dev", ...nextArgs], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  next.on("exit", (code) => process.exit(code ?? 0));
  for (const signal of ["SIGINT", "SIGTERM"] as const) process.on(signal, () => next.kill(signal));
}
