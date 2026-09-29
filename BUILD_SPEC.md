# Lion Share: Build Spec (Phase 1)

**Owner:** Abhi / Animyst
**Scope:** Everything built before class: repo setup, home page (LLM search hero + cause directory), the templated cause page, student branches, and guardrails.

**Goal:** A visitor chats with the hero and gets matched to a cause. Below it, every cause is listed with a button to its page. Each student pulls their own branch, copies one folder, answers the questions, builds a custom section, and ships. No student ever touches app code.

---

## 1. Site map

```
HOME  /
┌──────────────────────────────────────┐
│  HERO: LLM search                     │
│  Animated background                  │
│  Chat: a few questions, then a match  │
│  Result: a cause card + "View cause"  │
├──────────────────────────────────────┤
│  DIRECTORY                            │
│  Search bar                           │
│  Cause cards, each with "View cause"  │
└──────────────────────────────────────┘
                 │
                 ▼
CAUSE PAGE  /causes/<slug>
┌──────────────────────────────────────┐
│  REQUIRED INFO                        │  ← from answers.md
│  Cause, problem, nonprofit,           │
│  volunteer, donate                    │
├──────────────────────────────────────┤
│  CUSTOM SECTION                       │  ← custom.html
│  Anything the student wants to build  │
└──────────────────────────────────────┘
```

---

## 2. Student workflow

1. Maintainer pre-creates one branch per student before class: `student/<first-name>-<last-initial>`
2. Student opens Claude Code and **selects their own branch**
3. Student copies `/causes/_template/` to `/causes/<first-name>-<cause>/`
4. Student answers the questions in `answers.md`, which fills the required info
5. Student prompts Claude to build `custom.html`, which fills the custom section
6. Student commits and pushes to **their branch**
7. Student opens a PR from their branch into `main`
8. Student checks the Vercel preview link
9. Maintainer merges, and the page goes live and becomes matchable in the hero

---

## 3. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router), TypeScript | Static pages plus one API route |
| Styling | Tailwind CSS | Fast, consistent tokens |
| Content | One folder per cause in `/causes/` | Students edit their own folder only |
| Parsing | `gray-matter` + `remark` | Reads the answers file |
| Validation | `zod` schema + a Node script | One source of truth for the format |
| LLM | Claude API via `@anthropic-ai/sdk`, server-side only | Powers the hero match |
| Rate limiting | Upstash Redis + `@upstash/ratelimit` | Protects the public chat |
| Background | Canvas / WebGL animation in a client component | The "dynamic and cool" hero |
| Custom section | Sandboxed `<iframe>` rendering `custom.html` | Creative freedom, zero risk to the site |
| Hosting | Vercel | Preview URL per PR, production on merge |
| CI | GitHub Actions | Validates every cause folder on every PR |

---

## 4. Repo structure

```
/app
  layout.tsx
  page.tsx                   # Home: hero + directory
  causes/[slug]/page.tsx     # Cause page
  api/match/route.ts         # LLM match endpoint
  not-found.tsx
/components
  Hero.tsx
  HeroBackground.tsx         # Animated background
  ChatMatcher.tsx            # Chat UI
  MatchResult.tsx            # Matched cause card
  SearchBar.tsx
  CauseCard.tsx
  CauseGrid.tsx
  CauseTemplate.tsx          # Required info
  CustomSection.tsx          # Sandboxed iframe
/lib
  causes.ts                  # Load, parse, validate, sort
  schema.ts                  # zod schema for answers.md
  causeIndex.ts              # Compact index sent to the LLM
  matchPrompt.ts             # System prompt for the matcher
  keywordMatch.ts            # Fallback matcher, no LLM
  ratelimit.ts
/causes
  _template/                 # Students copy this. Ignored by the site.
    answers.md
    custom.html
    HOW-TO.md
  example-food-access/       # One finished example page
    answers.md
    custom.html
    image.jpg
/scripts
  validate-causes.ts
  copy-cause-assets.ts       # Copies images + custom.html into /public at build
  create-student-branches.sh # Creates one branch per name in roster.txt
roster.txt                   # One student per line (maintainer only)
/.github
  workflows/validate.yml
  pull_request_template.md
  CODEOWNERS
CLAUDE.md
README.md
BUILD_SPEC.md
```

**The folder name is the URL.** `/causes/maya-food-access/` becomes `/causes/maya-food-access`.

---

## 5. Home page: hero (LLM search)

### Layout

- Full-viewport hero with the animated background behind it
- Headline: "Find where you give back."
- Subline: "Tell us what you care about. We'll match you with an LA cause built by LMU students."
- Chat panel: message thread plus an input, styled like an LLM chat
- 3 or 4 suggestion chips to start: "I love animals", "I want to help kids", "I only have weekends", "I'd rather donate"
- Link under the chat: "Or browse every cause" scrolls to the directory

### Conversation flow

1. Claude opens: "What's a cause or issue you care about, even loosely?"
2. Up to **3 short follow-up questions**, one at a time, covering:
   - What they care about
   - How they want to help: time, money, or skills
   - How much time they have, or where in LA they are
3. After enough signal, or on the visitor's 4th message at the latest, Claude returns a **match**:
   - One primary cause card: image, cause, tagline, nonprofit
   - One line on **why it fits them**, in plain words
   - Up to 2 "Also consider" causes as small links
   - A "View cause" button to the cause page
   - "Start over" resets the chat

### API: `POST /api/match`

**Request**
```json
{ "messages": [{ "role": "user", "content": "I like animals" }] }
```

**Server steps**
1. Rate limit by IP: **10 requests per minute, 30 per day**
2. Reject messages over **300 characters** or conversations over **4 visitor turns**
3. Build the cause index from `causeIndex.ts`: `slug`, `cause`, `tagline`, `nonprofitName`, `neighborhood`, `interests`, `helpTypes`, `timeCommitment`
4. Call Claude with the system prompt, the index, and the conversation
5. Force a structured reply with a tool definition (below)
6. **Verify every returned slug exists** in the index. Drop any that don't.
7. On any error or timeout (8s), fall back to `keywordMatch.ts`

**Model:** a fast, inexpensive Claude model, set in one env var `ANTHROPIC_MODEL`, so it can be swapped without code changes.

**Structured reply (tool: `respond`)**
```json
// Keep chatting
{ "type": "question", "text": "Nice. Would you rather give time, money, or a skill?" }

// Done
{
  "type": "match",
  "slug": "maya-food-access",
  "reason": "You want hands-on weekend work close to campus.",
  "alternates": ["jay-animal-rescue", "ana-beach-cleanup"]
}
```

### System prompt rules (`matchPrompt.ts`)

- You help LMU students find a local LA cause from **this list only**
- Never invent a cause, nonprofit, link, or fact
- Ask at most 3 short questions, one at a time, friendly and brief
- Never ask for a name, email, phone number, address, or any personal details
- Stay on topic. Off-topic requests get one friendly line redirecting to finding a cause.
- If nothing fits well, say so honestly and return the closest match
- Always reply using the `respond` tool

### Fallback matcher (`keywordMatch.ts`)

- Scores causes by word overlap between the visitor's messages and each cause's `interests`, `cause`, `tagline`, and `helpTypes`
- Returns the top cause plus 2 alternates, with a generic reason line
- Used when the API fails, times out, or hits the spend cap, so the hero never breaks

### Privacy

- Conversations are **not stored**
- No analytics on message content
- Small line under the input: "Don't share personal info. Chats aren't saved."

### Animated background (`HeroBackground.tsx`)

- **Default:** a slow flowing gradient mesh, subtle enough to read text over
- Reacts gently while the visitor types (drifts or brightens slightly)
- Pauses when the hero is off screen
- Static gradient when `prefers-reduced-motion` is set
- Lighter version on mobile to save battery
- Built so the visual can be swapped once the brand direction is set

---

## 6. Home page: directory

### Layout

- Section title plus live count: "24 causes"
- **Search bar**
- **Cause grid**
- Footer: "Built by LMU students with AI" and a repo link

### Search

- Client-side over data passed in at build time
- Searches `cause`, `tagline`, `nonprofitName`, `neighborhood`, `interests`, `author`
- Case-insensitive, partial matches, ~150ms debounce
- Query syncs to the URL (`?q=food`)
- Empty state: "No causes match that yet." plus a nudge to try the chat above
- Default sort: alphabetical by cause

### Cause card

- Square image with `imageAlt`
- Cause name
- Tagline, clamped to 2 lines
- Nonprofit name and neighborhood
- "By {author}"
- **"View cause" button** linking to `/causes/<slug>` (the whole card is also clickable)

### Grid

- 1 column on mobile, 2 on tablet, 3 on desktop

---

## 7. Cause page (`/causes/[slug]`)

Built with `generateStaticParams` from every cause folder except `_template`.

### Required info (from `answers.md`)

1. **Back link:** "All causes"
2. **Header:** cause name, tagline, "Added by {author}", image
3. **Story column (left on desktop)**
   - Why I care
   - The problem
   - About the nonprofit: name, neighborhood, summary, website link
4. **Action panel (right on desktop, sticky; stacks on mobile)**
   - **Volunteer:** time commitment, who can join, numbered steps, "Sign up to volunteer" button
   - **Donate:** impact line, "Donate" button

### Custom section (from `custom.html`)

5. Title: **"More from {author}"**, then the sandboxed iframe

### Page footer

6. **More causes:** 3 other cards chosen by shared `interests`, falling back to random
7. **Disclaimer:** "Lion Share is a student project and is not affiliated with the nonprofits listed. Always confirm details on the nonprofit's official site."

### Behavior

- Outbound links open in a new tab with `rel="noopener noreferrer"`
- Unknown slug shows `not-found.tsx`
- Metadata: `{cause} | Lion Share`, description from tagline, Open Graph image from the cause image

---

## 8. `answers.md` (the questions file)

Students answer questions written as comments. Every answer goes in the quotes.

```yaml
---
# ─────────────────────────────────────────────
# LION SHARE: answer every question in the quotes
# ─────────────────────────────────────────────

# 1. What's your name, as you want it shown on the page?
author: ""

# 2. What cause do you care about? (a few words)
cause: ""

# 3. Sum it up in one line. (10 words or fewer)
tagline: ""

# 4. Why do you personally care about this? (1 to 2 sentences)
whyICare: ""

# 5. What's the problem in Los Angeles? (2 to 3 sentences)
problem: ""

# ── The nonprofit ──

# 6. Which LA nonprofit is tackling it?
nonprofitName: ""

# 7. What's their official website?
nonprofitWebsite: ""

# 8. Which LA neighborhood or area do they serve?
neighborhood: ""

# 9. What do they do, in one or two sentences?
nonprofitSummary: ""

# ── Volunteer ──

# 10. Where do people sign up to volunteer? (official link)
volunteerLink: ""

# 11. How much time does it take? (e.g. "3 hours, one Saturday a month")
timeCommitment: ""

# 12. Who can join? (age, experience, anything required)
whoCanJoin: ""

# 13. What are the exact steps to start volunteering? (add as many as needed)
volunteerSteps:
  - ""
  - ""
  - ""

# ── Donate ──

# 14. Where do people donate? (official link)
donateLink: ""

# 15. What does a donation make possible? (e.g. "$25 feeds a family for a week")
donateImpact: ""

# ── Page extras ──

# 16. Image file name in this folder (square, JPG or PNG, under 1 MB)
image: "image.jpg"

# 17. Describe the image in a few words, for screen readers
imageAlt: ""

# 18. What topics or interests connect to this cause? (3 to 5 words)
interests: ["", "", ""]

# 19. How can people help? Keep any that apply: time, money, skills
helpTypes: ["time", "money", "skills"]

# 20. How much time does helping take overall? Pick one: low, medium, high
effort: "low"
---
```

`interests`, `helpTypes`, and `effort` feed the hero matcher, and later become the raw material for deriving categories.

### Validation rules (`lib/schema.ts`)

- Every question answered, no empty strings
- `tagline` is 10 words or fewer
- All links are valid `https://` URLs
- `volunteerSteps` has at least 1 step
- `interests` has 3 to 5 entries
- `helpTypes` only contains `time`, `money`, `skills`
- `effort` is `low`, `medium`, or `high`
- `image` exists in the folder and is under 1 MB
- `custom.html` exists and is under 500 KB
- Folder name is lowercase and hyphenated

Errors must be readable by non-technical students, e.g.:
> `maya-food-access/answers.md`: Question 7 (nonprofitWebsite) needs a full link starting with https://

---

## 9. `custom.html` (the custom section)

A single self-contained HTML file the student builds with Claude.

**Rules**
- One file: HTML, CSS and JS all inline
- External scripts only from `cdn.jsdelivr.net` or `cdnjs.cloudflare.com`
- No forms that collect personal info, no tracking, no login
- Under 500 KB
- Looks good at phone width

**Ideas to suggest in class**
- An interactive timeline of the problem
- A "what would your $10 do?" calculator
- A quiz about the cause
- A photo story or scrolling narrative
- A map of where the nonprofit works
- A mini game

**Rendering (`CustomSection.tsx`)**
- `<iframe src="/custom/<slug>.html" sandbox="allow-scripts" loading="lazy">`
- No access to the parent page, cookies, or other students' sections
- Build injects a small script that posts the content height to the parent, so there's no inner scrollbar
- If it fails to load, the section hides and the required info still works

**Starter `_template/custom.html`:** a blank canvas with the site's fonts and `/tokens.css` linked, plus a comment: "Ask Claude to build anything here."

---

## 10. Student branches

### Setup (maintainer, before class)

1. Collect the roster in `roster.txt`, one name per line: `Maya Rodriguez`
2. Run `scripts/create-student-branches.sh`, which for each name:
   - Makes a slug: `student/maya-r`
   - Creates the branch from the latest `main`
   - Pushes it to GitHub
3. Share the list so each student knows their branch name
4. Re-run the script any time to add late students. It skips branches that already exist.

### Rules

- **One branch per student.** Students only commit to their own branch.
- `main` is protected. Nobody pushes to it directly.
- Student branches are **not** protected, so students can commit freely
- Merges into `main` only happen through PRs the maintainer approves

### Claude Code check (dry run)

- Confirm that when a student selects `student/<name>` in Claude Code, Claude commits to that branch and does **not** create a new `claude/...` branch
- If it does create its own branch, the CLAUDE.md rule below plus the student's prompt should keep it on their branch. Verify this before class.

---

## 11. Design tokens (placeholder)

Brand direction is still open. Everything reads from one token set.

```css
:root {
  --bg: #FBF9F5;
  --surface: #FFFFFF;
  --ink: #1C1A17;
  --muted: #5E5A54;
  --border: #E8E3DA;
  --accent: #E4572E;
  --accent-ink: #FFFFFF;
  --radius: 12px;
}
```

- Also published as `/tokens.css` so custom sections can match the site
- WCAG AA contrast, visible focus states, `prefers-reduced-motion` respected

---

## 12. Guardrails

### `CLAUDE.md` (repo root)

Tells Claude, when working for a student:
- Stay on the student's current branch (`student/<name>`). **Do not create new branches.** Commit and push to this branch only.
- Work **only** inside the student's own `/causes/<slug>/` folder
- Never edit app code, config, `_template`, the example, or another student's folder
- To start: copy `/causes/_template/` to a new folder named `<first-name>-<cause>`
- Fill `answers.md` from what the student tells you. Ask for anything missing.
- **Never invent** a nonprofit, link, number, or fact. If unknown, ask the student.
- `custom.html` must follow the rules in section 9
- Run `npm run validate` before finishing and fix every error

### GitHub

- `main` protected: PR required, maintainer approval required, CI must pass
- `CODEOWNERS`: maintainer owns everything except `/causes/`
- PR template: the checklist from the README

### CI (`.github/workflows/validate.yml`)

- Runs on every PR into `main`: `npm ci`, `npm run validate`, `npm run build`
- If the source branch starts with `student/`, the PR may only touch files inside **one** folder in `/causes/`. Anything else fails.

### LLM and cost

- `ANTHROPIC_API_KEY` and `ANTHROPIC_MODEL` live in Vercel env vars only, never in the repo
- Monthly spend cap set in the Anthropic console
- Rate limits and message caps as in section 5
- Keyword fallback when the API is unavailable

### Vercel

- Preview deploy on every PR, production on merge to `main`
- Env vars set for Preview and Production

---

## 13. Build order

1. Scaffold Next.js, TypeScript, Tailwind, tokens
2. Write `schema.ts` and `causes.ts`
3. Build `_template/` and the finished example
4. Write `validate-causes.ts` and the asset copy script
5. Build the cause page: required info, then the custom section
6. Build the directory: search, cards with "View cause"
7. Build the keyword fallback matcher
8. Build `/api/match` with Claude, rate limiting, and slug checks
9. Build the chat UI and match result
10. Build the animated background
11. Add `not-found`, metadata, disclaimer
12. Add `CLAUDE.md`, PR template, CODEOWNERS
13. Add CI and branch protection on `main`
14. Connect Vercel and set env vars
15. Create student branches from the roster
16. Dry run from a test student account: select branch, copy template, answer, build the custom section, open a PR, confirm the cause is matchable after merge

---

## 14. Definition of done

- [ ] Hero chat asks at most 3 questions, then returns a real cause with a reason and a "View cause" button
- [ ] The hero never returns a cause that doesn't exist
- [ ] Hero still returns a match when the API key is removed (fallback works)
- [ ] Rate limits and message caps work
- [ ] Every cause card has a working "View cause" button
- [ ] Search works across all listed fields and syncs to the URL
- [ ] Copying `_template/`, answering the questions, and adding an image creates a card, a page, and a matchable cause, with no code changes
- [ ] A bad answer fails CI with a plain-English error naming the question
- [ ] A student PR touching anything outside one cause folder fails CI
- [ ] A broken `custom.html` cannot break the rest of the page or site
- [ ] Every student on the roster has a branch
- [ ] Claude Code commits to the selected student branch
- [ ] Pages work on mobile
- [ ] Lighthouse 90+ for performance and accessibility
- [ ] Full dry run completed from a non-maintainer account

---

## 15. Later

- **Categories:** derived at the end from everyone's `interests`, then added as filter chips to the directory
