# Maintainer guide

How to run Lion Share: setting up a class, reviewing student pull requests, and deploying.

## Node version

Use Node 24 (see `.nvmrc`). CI and Vercel use it too. With older npm versions, `npm ci` fails on this lockfile, so don't run CI on anything older.

## House rules (in place of branch protection)

The organization is on GitHub's free plan and the repo is private, so GitHub can't enforce branch protection. These rules are enforced by us, with CI as the safety net:

1. **Nobody pushes to `main` directly.** Every change reaches `main` through a pull request.
2. **Maintainer work goes through `dev`.** Branch off `dev`, open a pull request into `dev`, and merge `dev` into `main` when it's ready to ship.
3. **Students branch from `main` and open pull requests into `main`.** Their pages go live on merge.
4. **Only merge when CI is green**, unless you've read the failure and know why it's safe.
5. **After merging student pull requests, merge `main` back into `dev`** so maintainer branches include the new causes.

Maintainers are listed in `.github/maintainers.txt` and `.github/CODEOWNERS`. Update both when that changes.

## What CI checks

Two workflows run on every pull request into `main` or `dev`:

| Workflow | What it checks |
|---|---|
| `Validate` (`.github/workflows/validate.yml`) | `npm run validate` (every cause folder), lint, tests, and a production build. Also runs on pushes to `main` and `dev`. |
| `Student PR scope` (`.github/workflows/scope.yml`) | For anyone not in `.github/maintainers.txt`: the pull request only changes files inside one folder in `causes/`, and not `_template` or the example. |

The scope check applies to every non-maintainer pull request, whatever the branch name. If Claude Code creates its own `claude/...` branch instead of using the student's branch, the check still works.

The scope check runs with `pull_request_target`, so it always uses the version on the base branch. It only reads the list of changed files and never runs the pull request's code. That means changes to `scope.yml` or `maintainers.txt` only take effect after they're merged.

A **warning** (not a failure) appears when a student's pull request edits a cause folder that's already live. That's normal when a student fixes their own page, but check that the folder is theirs before merging.

## Before class

### 1. Create student branches

1. Copy `roster.example.txt` to `roster.txt` and list one student per line: `Maya Rodriguez`. `roster.txt` is gitignored, so names stay out of the repo.
2. Preview: `scripts/create-student-branches.sh --dry-run`
3. Create: `scripts/create-student-branches.sh`
4. Share the printed list so each student knows their branch (for example `student/maya-r`).

Re-run it any time to add late students; existing branches are skipped. If two students would get the same branch (same first name and last initial), the script stops without creating anything. Add more of the last name to one of them, like `Maya Ro`.

Branches are created from the latest `origin/main`. Use `--base <branch>` to change that.

### 2. Invite students

Add each student as a collaborator with **Write** access, so they can push to their branch and open pull requests.

### 3. Dry run

Do this from a non-maintainer test account before class:

1. In Claude Code, select the repo and a test `student/...` branch.
2. Use the starter prompt from the README to create a cause.
3. Check that Claude commits to the selected branch. If it creates a `claude/...` branch instead, note it: the scope check still works, but update the README so students know to expect it.
4. Open a pull request into `main` and confirm both checks run, and that the Vercel preview works.
5. Try a bad change (edit `app/page.tsx`) and confirm the scope check fails with a clear message.
6. Merge, and confirm the cause shows up in the directory and can be matched in the hero chat.

## Reviewing a student pull request

1. Both checks are green.
2. Open the Vercel preview: the card, the page, and the custom section all work, including on a phone.
3. Spot-check facts and links against the nonprofit's official site. The nonprofit must be real and serve LA.
4. The image is appropriate and the student has the right to use it.
5. Merge. Then merge `main` into `dev`.

## Deploying (Vercel)

- Connect the repo in Vercel. Production deploys from `main`; every pull request gets a preview.
- Environment variables, for both Preview and Production (see `.env.example`):

| Variable | Required | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | For the AI chat | Without it the hero uses the keyword matcher. |
| `ANTHROPIC_MODEL` | No | Defaults to `claude-haiku-4-5`. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | For rate limiting | The Vercel Upstash integration's `KV_REST_API_URL` / `KV_REST_API_TOKEN` also work. |

- Set a **monthly spend cap** in the Anthropic console. When it's hit, the chat falls back to keyword matching automatically.
- Never commit keys. `.env*` files are gitignored except `.env.example`.

## After class

- Delete `roster.txt` when you no longer need it.
- Student branches can be deleted once their pull requests are merged.
- When there are enough causes, derive categories from everyone's `interests` (BUILD_SPEC.md, section 15).
