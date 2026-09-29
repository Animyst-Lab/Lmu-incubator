# Lion Share

A campus guide to giving back in Los Angeles. Each LMU student adds one cause page: a folder in `causes/` with their answers, an image, and a custom section. The site builds every page from those folders.

## When you're helping a student add their cause

Most people working in this repo are students adding their cause page, not maintainers. If the current branch starts with `student/` (or `claude/`), or the person says they're adding their cause, follow these rules. They are enforced by CI: a pull request that breaks them fails.

### Branch

- Stay on the current branch. **Do not create a new branch.** Commit and push to this branch only.
- If the current branch is `main` or `dev`, stop. Ask the student to select their own `student/<first-name>-<last-initial>` branch first. Never commit to `main` or `dev`.

### Where you can work

- Work **only** inside the student's own folder: `causes/<first-name>-<cause>/`.
- Never edit app code, config, `package.json`, `CLAUDE.md`, `README.md`, `.github/`, `causes/_template/`, `causes/example-food-access/`, or another student's folder. If something outside their folder seems broken, tell the student to ask a maintainer instead of fixing it.

### Getting started

1. Check `causes/` for a folder that already covers the same cause and nonprofit. If there is one, tell the student before continuing.
2. Copy `causes/_template/` to `causes/<first-name>-<cause>/`. Use lowercase letters, numbers, and hyphens only, e.g. `causes/maya-food-access/`. The folder name becomes the page's URL.
3. Delete `HOW-TO.md` from the new folder.

### `answers.md`

- Fill it in from what the student tells you. Put every answer inside the quotes. Keep the numbered comments.
- **Never invent anything**: no nonprofit, link, number, statistic, address, or fact the student didn't give you or that you haven't confirmed on the nonprofit's official website. If you don't know, ask the student.
- Links must be the nonprofit's official pages and start with `https://`. Donation and volunteer links must go to the nonprofit's own site.
- The tagline is 10 words or fewer. `interests` has 3 to 5 entries. `helpTypes` uses only `time`, `money`, `skills`. `effort` is `low`, `medium`, or `high`.
- No personal info: no phone numbers or email addresses of individuals.
- Write about the people served with dignity.

### The image

- The student provides the image. Ask them to add a square JPG or PNG under 1 MB to their folder, and set question 16 to its file name.
- Don't download images from other websites; the student may not have the rights to use them.

### `custom.html` (the custom section)

The student can ask for anything: a quiz, a calculator, a timeline, a map, a mini game. Build it to these rules:

- One file: HTML, CSS, and JavaScript together. No other files.
- External scripts only from `https://cdn.jsdelivr.net` or `https://cdnjs.cloudflare.com`. Anything else is blocked in the browser.
- No `<form>`, no collecting personal info, no tracking or analytics, no logins, no network requests except to those two CDNs.
- Under 500 KB. Prefer drawing with CSS or SVG over embedding large images.
- Must work and look good at phone width (about 360px).
- Keep the `<link rel="stylesheet" href="/tokens.css">` line and use its variables (`--bg`, `--surface`, `--ink`, `--muted`, `--border`, `--accent`, `--radius`, `--font-sans`, and so on) so the section matches the site.
- Don't use `100vh` or `height: 100%` on the page: the section is sized to its content automatically.
- Any numbers or facts in the section follow the same rule as `answers.md`: only what the student gave you or what's on the nonprofit's official site.

### Before you finish

1. Run `npm run validate` and fix every error it reports for the student's folder.
2. Show the student what you changed and remind them to open every link and check every fact.
3. Commit and push to the current branch, then help them open a pull request into `dev`. Never target `main`.

## Maintainers

App code, CI, and setup: see `MAINTAINER.md` and `BUILD_SPEC.md`. Next.js notes for coding agents are in `AGENTS.md`.
