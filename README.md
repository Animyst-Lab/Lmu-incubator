# Lion Share

**A campus guide to giving back in Los Angeles.**

Each of you picks a cause you care about and builds a page for it: the problem, a local LA nonprofit tackling it, and exactly how to volunteer or donate. Together, those pages become one guide that helps our campus find where to give back.

Built by LMU students, with AI, in one session.

---

## How it works

1. **Pick a cause** you actually care about
2. **Find a local LA nonprofit** working on it
3. **Prompt Claude** to build your page
4. **Review** what Claude made
5. **Open a pull request**
6. **Go live** once it's merged

You don't need to write code by hand. You need to be clear about what you want.

---

## What every page includes

| Section | What goes in it |
|---|---|
| **The cause** | Name of the cause, one line on why you care |
| **The problem** | What's happening in LA, in 2 to 3 sentences |
| **The nonprofit** | Name, what they do, neighborhood they serve |
| **Volunteer** | Exact steps: where to sign up, time commitment, who can join |
| **Donate** | Official donation link, and what a gift supports |
| **Links** | Official website and socials |

---

## Repo structure

```
/causes/
  food-insecurity.md
  animal-rescue.md
  youth-literacy.md
  ...
/public/causes/
  food-insecurity.jpg
  ...
CLAUDE.md
README.md
```

- One file per cause in `/causes/`
- One image per cause in `/public/causes/`
- The site builds every page automatically from this folder

---

## Getting started

### Before class
- GitHub account, username sent to hello@animystlab.com
- Class invite accepted
- Claude account, with GitHub connected in Claude Code
- The **Lion Share** repo visible in Claude Code

### In class
1. Open **Claude**, go to **Code**, select the **Lion Share** repo
2. Tell Claude about your cause (see the prompt below)
3. Review the files Claude created
4. Create the pull request
5. Check your preview link
6. Wait for merge, then share your live page

---

## Starter prompt

Copy this and fill in the blanks:

```
Create a new Lion Share cause page.

Cause: [your cause]
Why I care: [one sentence]
LA nonprofit: [name]
Nonprofit website: [official URL]
How to volunteer: [what you found]
How to donate: [official donation link]

Follow the template and rules in CLAUDE.md.
Only add new files in /causes/ and /public/causes/.
```

Then refine. Ask Claude to tighten the writing, fix the tone, or check every link works.

---

## Ground rules

- **Only add your own files.** Never edit someone else's page or shared files.
- **One cause per person.** Check `/causes/` first so you don't duplicate.
- **Real and local.** The nonprofit must be real and serve Los Angeles.
- **Official links only.** Donation and volunteer links go to the nonprofit's own site.
- **Verify everything.** AI can be wrong. Open every link and confirm every fact before you submit.
- **No personal info.** No phone numbers or emails of individuals.
- **Respectful tone.** Write about the people served with dignity.

---

## Branch naming

```
cause/your-name-cause
```

Example: `cause/maya-food-insecurity`

---

## Pull request checklist

- [ ] My page follows the template
- [ ] Only new files, in `/causes/` and `/public/causes/`
- [ ] Every link opens and goes to the official source
- [ ] Nonprofit is real and serves LA
- [ ] Image is square, JPG or PNG, under 1 MB
- [ ] I read everything Claude wrote before submitting

---

## Questions

Email **hello@animystlab.com**

---

*Lion Share is built by LMU entrepreneurship students in a hands-on session on building technology with AI, hosted by Animyst.*
