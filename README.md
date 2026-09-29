# Lion Share

**A campus guide to giving back in Los Angeles.**

Each of you picks a cause you care about and builds a page for it: the problem, a local LA nonprofit tackling it, and exactly how to volunteer or donate. Together, those pages become one guide that helps our campus find where to give back.

Built by LMU students, with AI, in one session.

---

## How the site works

- **Home page:** visitors chat with our AI about what they care about, and it matches them to a cause. Below that is a directory of every cause.
- **Your cause page** has two parts:
  - **Required info:** generated automatically from your answers to a list of questions
  - **Custom section:** anything you want to build with Claude

Once your page is merged, it shows up in the directory **and** the AI can match visitors to it.

---

## Your workflow

1. **Open your branch.** In Claude Code, select the Lion Share repo and your branch: `student/<your-first-name>-<last-initial>`
2. **Copy the template.** Copy `/causes/_template/` to `/causes/<your-first-name>-<cause>/`
3. **Answer the questions** in `answers.md`
4. **Add your image** to your folder as `image.jpg`
5. **Build your custom section** in `custom.html` with Claude
6. **Review** everything Claude changed
7. **Commit and push** to your branch
8. **Open a pull request** into `dev`
9. **Check your preview link**
10. **Go live** once it's merged

You don't need to write code by hand. You need to be clear about what you want.

---

## Your folder

```
/causes/maya-food-access/
  answers.md     # Your answers → the required info
  custom.html    # Your custom section
  image.jpg      # Square, JPG or PNG, under 1 MB
```

The folder name becomes your page URL: `/causes/maya-food-access`

---

## Part 1: Answer the questions

Open `answers.md`. Every question is numbered. Put your answer inside the quotes.

| # | Question |
|---|---|
| 1 | Your name, as shown on the page |
| 2 | The cause you care about |
| 3 | A one-line tagline, 10 words or fewer |
| 4 | Why you personally care |
| 5 | The problem in Los Angeles |
| 6 to 9 | The nonprofit: name, official website, neighborhood, what they do |
| 10 to 13 | Volunteering: signup link, time needed, who can join, exact steps |
| 14 to 15 | Donating: official link, what a donation makes possible |
| 16 to 17 | Your image and a short description of it |
| 18 | 3 to 5 interests that connect to your cause |
| 19 | How people can help: time, money, skills |
| 20 | Overall effort: low, medium, or high |

Questions 18 to 20 are how the AI on the home page matches visitors to your cause. Choose them carefully.

### Starter prompt

```
I'm working on my Lion Share cause page on my branch, student/[your-branch].
Copy /causes/_template/ to /causes/[first-name]-[cause]/.

Here are my answers:
- Name: [...]
- Cause: [...]
- Why I care: [...]
- LA nonprofit: [...]
- Nonprofit website: [...]
- How to volunteer: [...]
- How to donate: [...]

Fill in answers.md with these. Ask me for anything missing.
Don't invent any facts or links. Run npm run validate when done.
```

---

## Part 2: Build your custom section

This is yours. Ask Claude to build anything that helps people understand your cause or get involved.

**Ideas**
- An interactive timeline of the problem
- A "what would your $10 do?" calculator
- A quiz about the cause
- A photo story you scroll through
- A map of where the nonprofit works
- A mini game

### Starter prompt

```
Build my custom section in /causes/[my-folder]/custom.html.
I want: [describe your idea].
Keep it in one file, make it look good on a phone,
and follow the custom section rules in CLAUDE.md.
```

Then keep iterating: "make it more colorful", "add a second question", "make the text bigger on mobile".

### Custom section rules

- One file: HTML, CSS and JS together
- External scripts only from `cdn.jsdelivr.net` or `cdnjs.cloudflare.com`
- No forms asking for personal info, no tracking, no logins
- Under 500 KB
- Must work on a phone

---

## Ground rules

- **Your branch only.** Commit to `student/<you>`. Never commit to `main`, `dev`, or anyone else's branch.
- **Your folder only.** Never edit someone else's folder, the template, the example, or any site code. Your PR will fail if you do.
- **One cause per person.** Check `/causes/` first so you don't duplicate.
- **Real and local.** The nonprofit must be real and serve Los Angeles.
- **Official links only.** Volunteer and donate links go to the nonprofit's own site.
- **Verify everything.** AI can be wrong. Open every link and confirm every fact before you submit.
- **No personal info.** No phone numbers or emails of individuals.
- **Respectful tone.** Write about the people served with dignity.

---

## Pull request checklist

- [ ] I committed to my own `student/` branch
- [ ] I only changed files inside my one folder in `/causes/`
- [ ] Every question in `answers.md` is answered
- [ ] Every link opens and goes to the official source
- [ ] The nonprofit is real and serves LA
- [ ] My image is square, JPG or PNG, under 1 MB
- [ ] My custom section works on a phone
- [ ] I read everything Claude wrote before submitting

---

## For maintainers

Setting up a class, reviewing pull requests, and deploying: see [MAINTAINER.md](MAINTAINER.md).

---

## Questions

Email **hello@animystlab.com**

---

*Lion Share is built by LMU entrepreneurship students in a hands-on session on building technology with AI, hosted by Animyst.*
