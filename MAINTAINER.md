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
| `Student PR scope` (`.github/workflows/scope.yml`) | **scope**, for anyone not in `.github/maintainers.txt`: the pull request only changes files inside one folder in `causes/`, and not `_template` or the example. **attribution**, for everyone: no AI-tool co-author trailers in the pull request's commits and no "Generated with" footer in its title or description. `.claude/settings.json` turns that attribution off at the source. |

The scope check applies to every non-maintainer pull request, whatever the branch name. If Claude Code creates its own `claude/...` branch instead of using the student's branch, the check still works.

The scope check runs with `pull_request_target`, which GitHub always runs from the repo's **default branch**. A pull request can't weaken it, and it never runs the pull request's code; it only reads the list of changed files. It also means the check does nothing until `scope.yml` is on the default branch, and changes to `scope.yml` or `maintainers.txt` only take effect once they're there.

A **warning** (not a failure) appears when a student's pull request edits a cause folder that's already live. That's normal when a student fixes their own page, but check that the folder is theirs before merging.

## Before class

Students follow the README. They make their own GitHub account and, in class, their own `student/<first-name>-<last-initial>` branch from `dev` on GitHub.com; making the branch is part of the lesson. They work in a GitHub Codespace (set up by `.devcontainer/devcontainer.json`, with Node 24, Claude Code, and `gh` preinstalled and `npm ci` already run) and Claude Code uses a class API key stored as a Codespaces secret. Students need only a GitHub account, and nothing gets installed on their laptops.

### 1. Collect details

Ask each student for their GitHub username.

### 2. Invite them to the repo

Add each student as a collaborator with **Write** access, so they can create a branch, push to it, open pull requests, and open Codespaces. Invites expire after 7 days, so send them close to class and ask students to accept before they arrive.

### 3. Turn on Codespaces

GitHub's docs say Codespaces is always on for private repos in Free-plan orgs, but for Animyst-Lab it was off until an org owner turned it on in the org's **Settings → Codespaces**. Check it's still enabled for this repo and for outside collaborators (students are collaborators): open the repo's **Code → Codespaces** tab and make sure you can create one.

In the same settings, check who pays:
- **Each user pays** (the default on Free): free for students. Every personal GitHub account includes 120 core-hours a month (60 hours on the default 2-core machine), and a student with no payment method who uses it all is blocked, not charged.
- **The organization pays**: about $0.18 an hour per student on the 2-core machine. Add a Codespaces budget under **Settings → Billing and licensing → Budgets and alerts** with **Stop usage when budget limit is reached**.

### 4. Set up Claude access

Claude Code in every student's Codespace uses one class API key, billed per use to your Anthropic account. Students don't need a Claude account and never sign in.

1. In the [Claude Console](https://platform.claude.com), create a workspace for the class (for example "LMU class") and set a **spend limit** on it. A class session is usually a few dollars per student; $250 is a safe cap for 30.
2. Create an API key in that workspace.
3. In the repo, go to **Settings → Secrets and variables → Codespaces → New repository secret**. Name it `ANTHROPIC_API_KEY` and paste the key. Codespaces created after this get it automatically; existing ones don't.
4. Check your API rate-limit tier. Thirty people working at once is heavy concurrent use; if your tier is low, ask Anthropic for a temporary increase.

Anyone who can open a Codespace on this repo can read the key, so treat it as class-only: keep the workspace's spend limit low and revoke the key right after class.

### 5. Dry run

Do this from a non-maintainer test account before class:

1. On GitHub.com, create a test `student/...` branch from `dev` using the README steps.
2. Open a Codespace on that branch. Check that it builds, the terminal opens, and `claude --version` works.
3. Run `claude`. It should open straight to the prompt, with no theme, API key, terminal setup, or folder trust questions (`.devcontainer/claude-setup.mjs` answers them when the Codespace opens). Then say "Help me add my cause page."
4. Check that it interviews you one question at a time, fills the rest from the nonprofit's site, and commits to the selected branch.
5. When it asks for a photo, drag one into the folder in the file list and check that it picks it up.
6. Say "Open my pull request" and confirm it targets `dev`, both checks run, and the Vercel preview builds and opens without a login. On a private repo, Vercel may hold deployments from commit authors who aren't on the Vercel team; note whether it does.
7. Try a bad change (edit `app/page.tsx`) and confirm the scope check fails with a clear message.
8. Merge, and confirm the cause shows up in the directory and can be matched in the hero chat.
9. Check the class workspace's usage in the Console to see what the dry run cost.

### 6. Backup route: Claude Code on the web

If Codespaces fails for someone (an outage, or campus Wi-Fi blocking it), students with their **own Claude Pro or Max plan** can use Claude Code on the web instead. The README's "Codespaces isn't working" section walks them through it. The class API key can't be used there: cloud sessions always sign in with a personal Claude plan.

- **Setup:** the Claude GitHub App needs access to this repo. It's installed on Animyst-Lab with selected repositories; confirm **Lmu-incubator** is listed under [the app's repository access](https://github.com/organizations/Animyst-Lab/settings/installations/166006297).
- **What's different for the student:**
  - The session works on a `claude/...` branch instead of `student/...`. The scope check and `AGENTS.md` allow it.
  - There's no live preview. The agent opens the pull request early and uses its Vercel preview, so this route depends on Vercel deploying students' commits (see Deploying).
  - Photos go in through GitHub.com (**Add file → Upload files**), since there's no file list to drag into.
  - Cloud sessions have limited internet access by default, so the student may need to paste the nonprofit's links and text.
- **Unchanged:** `.claude/settings.json` (no AI attribution) applies there too, and the pull request gets the same checks.
- **Students without a plan:** run a session yourself at [claude.ai/code](https://claude.ai/code) and interview them there, or collect their answers and photo and build the page for them.

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

- Revoke the class API key in the Console and delete the `ANTHROPIC_API_KEY` Codespaces secret.
- Students can delete their codespace at [github.com/codespaces](https://github.com/codespaces) once their pull request is merged. Unused codespaces are also deleted automatically after a period of inactivity.
- Student branches can be deleted once their pull requests are merged.
- When there are enough causes, derive categories from everyone's `interests` (`docs/BUILD_SPEC.md`, section 15).
