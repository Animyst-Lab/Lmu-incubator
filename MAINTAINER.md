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

Students follow the README. They make their own GitHub account and, in class, their own `student/<first-name>-<last-initial>` branch from `dev` on GitHub.com; making the branch is part of the lesson. They work in a GitHub Codespace (set up by `.devcontainer/devcontainer.json`, with Node 24, Claude Code, and `gh` preinstalled and `npm ci` already run) and sign in to Claude Code with a Claude Console account you invite them to. Nothing gets installed on their laptops.

### 1. Collect details

Ask each student for their GitHub username and the email address they'll use for Claude.

### 2. Invite them to the repo

Add each student as a collaborator with **Write** access, so they can create a branch, push to it, open pull requests, and open Codespaces. Invites expire after 7 days, so send them close to class and ask students to accept before they arrive.

### 3. Turn on Codespaces for the org

Organizations get no free Codespaces usage, so the Animyst-Lab org pays: about $0.18 an hour per student on the default 2-core machine, plus a little storage. Thirty students for two hours is roughly $11.

1. In the org's **Settings → Codespaces → General**, set Codespaces access to allow members **and outside collaborators** (students are collaborators).
2. In the org's billing settings, add a payment method and a Codespaces budget (for example $25) so a forgotten codespace can't run up a bill.
3. Optional, under **Settings → Codespaces → Policies**: limit machine types to 2-core, set a short idle timeout, and a short retention period.

### 4. Set up Claude access

Students sign in to Claude Code with the Claude Console, billed per use to your API account. Don't hand out an API key.

1. In the [Claude Console](https://platform.claude.com), go to **Settings → Members → Invite** and invite each student's email with the **Claude Code** role (they can only use Claude Code).
2. Set a spend limit on the "Claude Code" workspace (created automatically the first time someone signs in). A class session is usually a few dollars per student; $250 is a safe cap for 30.
3. Check your API rate-limit tier. Thirty people working at once is heavy concurrent use; if your tier is low, ask Anthropic for a temporary increase.

### 5. Dry run

Do this from a non-maintainer test account before class:

1. On GitHub.com, create a test `student/...` branch from `dev` using the README steps.
2. Open a Codespace on that branch. Check that it builds, the terminal opens, and `claude --version` works.
3. Run `claude`, sign in with a test Console account, and say "Help me add my cause page."
4. Check that it interviews you one question at a time, fills the rest from the nonprofit's site, and commits to the selected branch.
5. When it asks for a photo, drag one into the folder in the file list and check that it picks it up.
6. Say "Open my pull request" and confirm it targets `dev`, both checks run, and the Vercel preview builds and opens without a login. On a private repo, Vercel may hold deployments from commit authors who aren't on the Vercel team; note whether it does.
7. Try a bad change (edit `app/page.tsx`) and confirm the scope check fails with a clear message.
8. Merge, and confirm the cause shows up in the directory and can be matched in the hero chat.
9. Check the Codespaces and Console usage pages to see what the dry run cost.

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

- Remove the students from the Claude Console organization.
- Delete leftover codespaces (org **Settings → Codespaces**) so they stop costing storage.
- Student branches can be deleted once their pull requests are merged.
- When there are enough causes, derive categories from everyone's `interests` (`docs/BUILD_SPEC.md`, section 15).
