# Maintainer guide

How to run Lion Share: setting up a class, reviewing student pull requests, and deploying.

## Node version

Use Node 24 (see `.nvmrc`). CI and Vercel use it too. With older npm versions, `npm ci` fails on this lockfile, so don't run CI on anything older.

## House rules (in place of branch protection)

The organization is on GitHub's free plan and the repo is private, so GitHub can't enforce branch protection. These rules are enforced by us, with CI as the safety net:

1. **Nobody pushes to `main` directly.** Every change reaches `main` through a pull request.
2. **Maintainer work goes through `dev`.** Branch off `dev`, open a pull request into `dev`, and merge `dev` into `main` when it's ready to ship.
3. **Students branch from `dev` and open pull requests into `dev`.** Their pages go live when a maintainer merges `dev` into `main`.
4. **Only merge when CI is green**, unless you've read the failure and know why it's safe.
5. **Only maintainers open the `dev` → `main` pull request.** Production deploys from `main`, and a maintainer's merge is what triggers it.

Maintainers are listed in `.github/maintainers.txt` and `.github/CODEOWNERS`. Update both when that changes.

## What CI checks

Two workflows run on every pull request into `main` or `dev`:

| Workflow | What it checks |
|---|---|
| `Validate` (`.github/workflows/validate.yml`) | `npm run validate` (every cause folder), lint, tests, and a production build. Also runs on pushes to `main` and `dev`. |
| `Student PR scope` (`.github/workflows/scope.yml`) | For anyone not in `.github/maintainers.txt`: the pull request only changes files inside one folder in `causes/`, and not `_template` or the example. |

The scope check applies to every non-maintainer pull request, whatever the branch name. If Claude Code creates its own `claude/...` branch instead of using the student's branch, the check still works.

The scope check runs with `pull_request_target`, which GitHub always runs from the repo's **default branch**. A pull request can't weaken it, and it never runs the pull request's code; it only reads the list of changed files. It also means the check does nothing until `scope.yml` is on the default branch, and changes to `scope.yml` or `maintainers.txt` only take effect once they're there.

A **warning** (not a failure) appears when a student's pull request edits a cause folder that's already live. That's normal when a student fixes their own page, but check that the folder is theirs before merging.

## Before class

Students follow the README: they make their own GitHub account and, in class, their own `student/<first-name>-<last-initial>` branch from `dev` on GitHub.com. Making the branch is part of the lesson, so nothing is pre-created.

### 1. Invite students

1. Collect each student's GitHub username.
2. Add each one as a collaborator with **Write** access, so they can create a branch, push to it, and open pull requests. Invites expire after 7 days, so send them close to class and ask students to accept before they arrive.

### 2. Dry run

Do this from a non-maintainer test account before class:

1. On GitHub.com, create a test `student/...` branch from `dev` using the README steps.
2. In Claude Code, select the repo and that branch, and say "Help me add my cause page."
3. Check that it interviews you one question at a time, fills the rest from the nonprofit's site, and commits to the selected branch. If it creates a `claude/...` branch instead, note it: the scope check still works, but update the README so students know to expect it.
4. Give it a photo and check that it lands in the cause folder. If the tool can't save attached images as files, it should walk you through uploading on GitHub.com instead; make sure that works.
5. Say "Open my pull request" and confirm it targets `dev`, both checks run, and the Vercel preview builds and opens without a login. On a private repo, Vercel may hold deployments from commit authors who aren't on the Vercel team; note whether it does.
6. Try a bad change (edit `app/page.tsx`) and confirm the scope check fails with a clear message.
7. Merge, and confirm the cause shows up in the directory and can be matched in the hero chat.

## Reviewing a student pull request

1. Both checks are green.
2. Open the Vercel preview: the card, the page, and the custom section all work, including on a phone.
3. Spot-check facts and links against the nonprofit's official site. The nonprofit must be real and serve LA.
4. The image is appropriate and the student has the right to use it.
5. Merge into `dev`. When you're ready to publish, open a `dev` → `main` pull request and merge it; that deploys production.

## Deploying (Vercel)

- The Vercel project is `lion-share` on the hello-1417's projects team. Production deploys from `main`; every pushed branch and pull request gets a preview.
- Preview protection (Vercel Authentication) is off, so students can open their preview links without a Vercel account.
- Environment variables, for both Preview and Production (see `.env.example`):

| Variable | Required | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | For the AI chat | Without it the hero uses the keyword matcher. |
| `ANTHROPIC_MODEL` | No | Defaults to `claude-sonnet-5-5` (see PR #3). `claude-haiku-4-5` is cheaper but less careful with facts. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | For rate limiting | The Vercel Upstash integration's `KV_REST_API_URL` / `KV_REST_API_TOKEN` also work. |

- Set a **monthly spend cap** in the Anthropic console. When it's hit, the chat falls back to keyword matching automatically.
- Never commit keys. `.env*` files are gitignored except `.env.example`.

## After class

- Student branches can be deleted once their pull requests are merged.
- When there are enough causes, derive categories from everyone's `interests` (`docs/BUILD_SPEC.md`, section 15).
