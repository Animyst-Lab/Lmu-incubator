# Lion Share

A campus guide to giving back in Los Angeles. Each LMU student adds one cause page: a folder in `causes/` with their answers, an image, and a creative section. The site builds every page from those folders.

These instructions are for any AI coding agent working in this repo.

## Helping a student add their cause

Most people working here are LMU students with no coding experience. If the current branch starts with `student/` (or `claude/`), or the person says they want to add their cause, follow this section. CI enforces these rules: a pull request that breaks them fails.

Be friendly and plain-spoken. Ask **one question at a time**. Don't show code, file contents, or error output unless they ask; tell them in plain words what you did and what you need from them.

### 1. Check the branch

- If the branch starts with `student/` or `claude/`, stay on it. Commit and push only to this branch.
- If the branch is `dev` or `main`, don't commit. Ask the student to create their branch on GitHub.com (the README explains how: branch menu, type `student/<first-name>-<last-initial>`, create it from `dev`) and then open it here. If they're stuck, create `student/<first-name>-<last-initial>` from `origin/dev` for them and explain in one sentence what a branch is.

### 2. Interview the student

Ask only for what only they can tell you, one question at a time:

1. Their name, as it should appear on the page.
2. The cause they care about, and the LA nonprofit working on it. If they don't have a nonprofit yet, suggest two or three real LA nonprofits you've confirmed on the nonprofits' official websites, and let them pick.
3. Why they personally care, in a sentence or two. Use their words; fix only spelling and grammar.
4. A photo for their page (see step 4).
5. What they'd like their creative section to be (see step 5). Offer ideas if they're unsure: a quiz, a "what does $10 do?" calculator, a timeline, a mini game.

Then check `causes/` for a folder that already covers the same nonprofit. If there is one, tell the student before continuing.

### 3. Fill in the rest from the nonprofit's official website

Copy `causes/_template/` to `causes/<first-name>-<cause>/` (lowercase letters, numbers, and hyphens, e.g. `causes/maya-food-access/`; the folder name becomes the page's URL).

Fill every other question in `answers.md` from the nonprofit's official website: the website, neighborhood, what they do, volunteer and donate links and details, the problem in LA, and a tagline. Pick `interests`, `helpTypes`, and `effort` to match. Then show the student a short, plain summary of what you found and ask them to confirm or correct it.

- **Never invent anything**: no nonprofit, link, number, statistic, address, or fact that isn't from the student or the nonprofit's official website. If the site doesn't say something (like a time commitment), write what it does say, e.g. "Varies by role; see the volunteer page", or ask the student.
- If you can't open websites, ask the student to paste the nonprofit's links and the text you need.
- Links must be the nonprofit's own pages and start with `https://`. Donation and volunteer links go to the nonprofit's own site.
- Put every answer inside the quotes and keep the numbered comments.
- The tagline is 10 words or fewer. `interests` has 3 to 5 entries. `helpTypes` uses only `time`, `money`, `skills`. `effort` is `low`, `medium`, or `high`.
- No personal info: no phone numbers or email addresses of individuals.
- Write about the people served with dignity.

### 4. The image

The student provides the image. Never download images from other websites; the student may not have the rights to use them.

- Create their folder first, then ask them to drag their photo from their computer into that folder in the file list on the left of the editor (in a Codespace, the Explorer panel). Wait for them to say it's there, then find it.
- Rename it to `image.jpg` or `image.png` and set question 16 to that name. It must be a JPG or PNG under 1 MB, ideally square. If it's too big, shrink it with whatever tool is available (for example ImageMagick, Python's Pillow, or `sips` on macOS); if nothing is, ask for a smaller one.
- If dragging doesn't work, push their folder, then give them the link to it on GitHub.com (on their branch) and walk them through **Add file → Upload files**. Pull afterwards.
- Write question 17 (the image description) from what the image shows.

### 5. The creative section (`custom.html`)

Build what the student asks for, and keep iterating with them until they're happy.

**Show them their page as you go.** Start the site once with `npm run dev` and leave it running in the background. Their page is at `/causes/<their-folder>`; in a Codespace the link is `https://$CODESPACE_NAME-3000.$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN/causes/<their-folder>` (build it from those environment variables), and locally it's `http://localhost:3000/causes/<their-folder>`. Changes to their folder show up when they reload. The server stops when the Codespace stops after sitting idle, so if the student says the link won't load (a browser "page can't be found" error), start `npm run dev` again and wait for **Ready** before telling them to reload. If the site's own "not found" page shows instead, their folder fails validation: run `npm run validate` and fix it. Give them the link and ask them to look after each change. The link only opens where they're signed in to GitHub, so for phone width ask them to narrow the browser window; they check on their real phone with the pull request's preview. Don't install browsers or screenshot tools (such as Playwright) to check the page yourself; the student's own view is the check.

Rules:

- One file: HTML, CSS, and JavaScript together. No other files.
- External scripts only from `https://cdn.jsdelivr.net` or `https://cdnjs.cloudflare.com`. Anything else is blocked in the browser.
- No `<form>`, no collecting personal info, no tracking or analytics, no logins, no network requests except to those two CDNs.
- Under 500 KB. Prefer drawing with CSS or SVG over embedding large images.
- Must work and look good at phone width (about 360px).
- Don't use `100vh` or `height: 100%` on the page: the section is sized to its content automatically.
- Numbers and facts follow the same rule as `answers.md`: only from the student or the nonprofit's official website.

**Match the site's design.** Start from the template's `custom.html` and keep its `<head>`, including the `<link rel="stylesheet" href="/tokens.css">` line: when the section is served, that line is replaced with the site's design tokens, so every `var(--…)` below works. Reuse the template's starter classes (`.eyebrow`, `.card`, `.card-dark`, `.btn`, `.btn-light`, `.chip`) before writing new styles. Use the tokens, never hard-coded colors, fonts, or corner sizes. For a finished example, read `causes/dmello-homeboy/custom.html`.

- **Type:** `font-family: var(--font-sans)` everywhere (Onest). Headings are semibold (600) with slightly tight letter-spacing (`-0.02em`). Body text is `var(--ink)`; secondary text is `var(--muted)`. Never use `var(--subtle)` for text people need to read.
- **Eyebrow labels** above headings: small (`0.75rem`), uppercase, semibold, `letter-spacing: 0.08em`, color `var(--accent-strong)` (on dark cards, `var(--accent-from)`).
- **Surfaces:** the page background is `var(--surface)`; cards are `var(--bg)` with a `1px solid var(--border)` edge, or `var(--ink-card)` with white text for one standout card. Use `var(--accent-gradient)` for at most one highlight block.
- **Corners:** cards `var(--radius-card-sm)` (large panels `var(--radius-card)`), inputs and small controls `var(--radius-control)`, buttons and chips `var(--radius-pill)`.
- **Buttons:** pills. Main action: `var(--ink-card)` background, white text; secondary: `var(--surface)` or a `var(--border)` outline. Weight 500, about `0.875rem`, generous padding (`14px 28px`). On hover, grow slightly (`transform: scale(1.04)`) with `transition: transform 0.3s var(--ease-snap)`.
- **Chips and toggles:** pills with a `1px solid var(--border)` edge; the selected state is `var(--ink-card)` with white text.
- **Accent:** `var(--accent)` is for small highlights (numbers, icons, a progress bar), not large backgrounds or body text.
- **Motion and focus:** ease with `var(--ease-spring)` or `var(--ease-snap)`, keep it subtle, and turn it off under `@media (prefers-reduced-motion: reduce)`. Keep a visible focus ring: `outline: 2px solid var(--accent); outline-offset: 2px`.

### 6. Check and submit

1. Run `npm run validate` (run `npm ci` first if `node_modules` is missing) and fix every error it reports for the student's folder.
2. Tell the student what you made, and ask them to open every link and check every fact on their page.
3. Commit only their folder: `git add causes/<their-folder>`. Never `git add -A` or `git add .`; other files can change on their own and would fail the pull request check. Push to their branch, open a pull request into `dev` (never `main`) using the pull request template, for example with `gh pr create --base dev`, and give them the link. Tell them a preview link will appear on the pull request in a few minutes.

### Where you can work

- **Only** inside the student's own folder: `causes/<first-name>-<cause>/`.
- Never edit app code, config, `package.json`, `AGENTS.md`, `CLAUDE.md`, `README.md`, `.github/`, `.claude/`, `.devcontainer/`, `causes/_template/`, `causes/example-food-access/`, or another student's folder. If something outside their folder seems broken, tell the student to ask their instructor instead of fixing it.

## Maintainers

Running the class, CI, and deploys: see `MAINTAINER.md`. The original design is in `docs/BUILD_SPEC.md`; the code is the source of truth where they differ.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
