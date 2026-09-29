import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ALLOWED_SCRIPT_HOSTS } from "./customSection";
import { answersSchema, describeIssue, type Answers } from "./schema";

export const CAUSES_DIR = path.join(process.cwd(), "causes");

export const MAX_IMAGE_BYTES = 1024 * 1024;
export const MAX_CUSTOM_BYTES = 500 * 1024;

/** Folders that are part of the site itself, not a student's cause. */
export const PROTECTED_FOLDERS = ["_template", "example-food-access"];

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export type Cause = Answers & {
  slug: string;
  /** Public URL of the cause image, copied into /public at build time. */
  imageUrl: string;
  /** Public URL of the custom section, copied into /public at build time. */
  customUrl: string;
};

/** The subset of a cause the directory and search need on the client. */
export type CauseSummary = Pick<
  Cause,
  "slug" | "cause" | "tagline" | "nonprofitName" | "neighborhood" | "interests" | "author" | "imageUrl" | "imageAlt"
>;

export const imageUrlFor = (slug: string, image: string) => `/cause-assets/${slug}/${image}`;
export const customUrlFor = (slug: string) => `/custom/${slug}.html`;

/** Every folder in /causes that should become a page. Folders starting with _ or . are skipped. */
export function listCauseFolders(dir = CAUSES_DIR): string[] {
  if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
    .map((d) => d.name)
    .sort();
}

/** Checks custom.html against the rules students are given. Returns plain-English errors. */
export function checkCustomHtml(html: string): string[] {
  const errors: string[] = [];

  for (const match of html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']?([^"'\s>]+)/gi)) {
    const src = match[1];
    let host: string | null = null;
    try {
      host = new URL(src).hostname;
    } catch {
      // Relative or malformed src: not an allowed CDN either.
    }
    if (!host || !ALLOWED_SCRIPT_HOSTS.includes(host)) {
      errors.push(
        `loads a script from "${src}". Scripts can only come from ${ALLOWED_SCRIPT_HOSTS.join(" or ")}. Put your own code inside the file instead.`,
      );
    }
  }

  if (/<form\b/i.test(html)) {
    errors.push(
      "has a <form>. Custom sections can't collect information. For a quiz or calculator, use buttons and inputs without a <form>.",
    );
  }

  return errors;
}

export type FolderResult = { slug: string; cause: Cause | null; errors: string[] };

/** Loads and fully validates one cause folder. Never throws: every problem becomes an error string. */
export function loadCauseFolder(slug: string, dir = CAUSES_DIR): FolderResult {
  const folder = path.join(dir, slug);
  const errors: string[] = [];
  const err = (file: string, msg: string) => errors.push(`${slug}/${file}: ${msg}`);

  if (!SLUG_PATTERN.test(slug)) {
    errors.push(
      `${slug}/: The folder name must be lowercase letters and numbers joined by hyphens, like "maya-food-access".`,
    );
  }

  let answers: Answers | null = null;
  // Checked even when other answers are wrong, so a missing image shows up on the first run.
  let imageName: string | null = null;
  const answersPath = path.join(folder, "answers.md");
  if (!fs.existsSync(/*turbopackIgnore: true*/ answersPath)) {
    err("answers.md", "is missing. Copy it from causes/_template/.");
  } else {
    let data: unknown;
    try {
      data = matter(fs.readFileSync(/*turbopackIgnore: true*/ answersPath, "utf8")).data;
    } catch (e) {
      const line = (e as { mark?: { line?: number } }).mark?.line;
      err(
        "answers.md",
        `couldn't be read${line != null ? ` near line ${line + 1}` : ""}. Check that every answer is inside "double quotes" and that no quotes are missing.`,
      );
    }
    if (data !== undefined) {
      const parsed = answersSchema.safeParse(data);
      if (parsed.success) answers = parsed.data;
      else for (const issue of parsed.error.issues) err("answers.md", describeIssue(issue));

      const image = answersSchema.shape.image.safeParse((data as { image?: unknown } | null)?.image);
      if (image.success) imageName = image.data;
    }
  }

  if (imageName) {
    const imagePath = path.join(/*turbopackIgnore: true*/ folder, imageName);
    if (!fs.existsSync(/*turbopackIgnore: true*/ imagePath)) {
      err(imageName, `is missing. Question 16 says your image is "${imageName}", so add that file to your folder.`);
    } else if (fs.statSync(/*turbopackIgnore: true*/ imagePath).size > MAX_IMAGE_BYTES) {
      err(imageName, "is over 1 MB. Resize or compress it and try again.");
    }
  }

  const customPath = path.join(folder, "custom.html");
  if (!fs.existsSync(/*turbopackIgnore: true*/ customPath)) {
    err("custom.html", "is missing. Copy it from causes/_template/.");
  } else {
    if (fs.statSync(/*turbopackIgnore: true*/ customPath).size > MAX_CUSTOM_BYTES) {
      err("custom.html", "is over 500 KB. Make it smaller, for example by using fewer or smaller images.");
    }
    for (const msg of checkCustomHtml(fs.readFileSync(/*turbopackIgnore: true*/ customPath, "utf8"))) err("custom.html", msg);
  }

  const cause =
    answers && errors.length === 0
      ? { ...answers, slug, imageUrl: imageUrlFor(slug, answers.image), customUrl: customUrlFor(slug) }
      : null;
  return { slug, cause, errors };
}

// Every page is prerendered at build time, so the fs calls above never run in production.
// The turbopackIgnore hints stop Turbopack from bundling the whole repo into the server output.

let cache: Cause[] | null = null;

/**
 * Every valid cause, sorted by cause name. Invalid folders are skipped with a
 * warning so one bad folder can never take the site down; CI blocks them anyway.
 */
export function getAllCauses(): Cause[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const causes: Cause[] = [];
  for (const slug of listCauseFolders()) {
    const result = loadCauseFolder(slug);
    if (result.cause) causes.push(result.cause);
    else console.warn(`[lion-share] Skipping ${slug}:\n  ${result.errors.join("\n  ")}`);
  }
  causes.sort((a, b) => a.cause.localeCompare(b.cause, "en", { sensitivity: "base" }));
  cache = causes;
  return causes;
}

export function getCause(slug: string): Cause | undefined {
  return getAllCauses().find((c) => c.slug === slug);
}

export function toSummary(c: Cause): CauseSummary {
  return {
    slug: c.slug,
    cause: c.cause,
    tagline: c.tagline,
    nonprofitName: c.nonprofitName,
    neighborhood: c.neighborhood,
    interests: c.interests,
    author: c.author,
    imageUrl: c.imageUrl,
    imageAlt: c.imageAlt,
  };
}

/** Up to `count` other causes, ranked by shared interests, then filled in a stable pseudo-random order. */
export function relatedCauses(cause: Cause, all: Cause[], count = 3): Cause[] {
  const mine = new Set(cause.interests.map((i) => i.toLowerCase()));
  const hash = (s: string) => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
  return all
    .filter((c) => c.slug !== cause.slug)
    .map((c) => ({
      c,
      shared: c.interests.filter((i) => mine.has(i.toLowerCase())).length,
      tiebreak: hash(cause.slug + c.slug),
    }))
    .sort((a, b) => b.shared - a.shared || a.tiebreak - b.tiebreak)
    .slice(0, count)
    .map((x) => x.c);
}

/** Counts for the home page. Names are compared case-insensitively. */
export function siteStats(causes: Cause[]) {
  const unique = (values: string[]) => new Set(values.map((v) => v.trim().toLowerCase())).size;
  return {
    causes: causes.length,
    nonprofits: unique(causes.map((c) => c.nonprofitName)),
    neighborhoods: unique(causes.map((c) => c.neighborhood)),
    students: unique(causes.map((c) => c.author)),
  };
}
