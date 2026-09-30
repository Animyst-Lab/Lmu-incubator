# Lion Share

**A campus guide to giving back in Los Angeles.**

You'll pick a cause you care about and a real LA nonprofit working on it, then build a page for it with an AI helper. Your page shows the problem, the nonprofit, and exactly how to volunteer or donate, plus one creative piece you design: a quiz, a calculator, a mini game, anything. Together, everyone's pages become one guide for our campus.

You don't need to know how to code. You need to know what you care about.

---

## Before class (about 10 minutes)

1. **Make a GitHub account** at [github.com/signup](https://github.com/signup). GitHub is where the site's code lives.
2. **Send your GitHub username** to your instructor.
3. **Accept the invite.** You'll get an email from GitHub inviting you to the `Lmu-incubator` repository. Click **Accept invitation**.

That's the only account you need. The AI helper, Claude, is set up for you, and you don't need to pay for anything.

Come to class with:
- A cause you care about, and an LA nonprofit working on it if you know one (the AI can help you find one)
- A photo for your page, saved on your laptop, that you took or have permission to use (square is best)

Everything else runs in your web browser. You don't need to install anything.

---

## In class

### 1. Make your branch

A **branch** is your own copy of the site to work on. Your changes stay there until they're reviewed and added to the real site.

1. Open the repository on GitHub: [github.com/Animyst-Lab/Lmu-incubator](https://github.com/Animyst-Lab/Lmu-incubator)
2. Click the branch menu near the top left. It says **dev**.
3. Type your branch name: `student/` then your first name and last initial, e.g. `student/maya-r`
4. Click **Create branch student/maya-r from dev**.

### 2. Open your Codespace

A **Codespace** is a computer in your browser with the site's code and your AI helper already set up.

1. On the repository page, check that the branch menu shows your branch.
2. Click the green **Code** button, open the **Codespaces** tab, and click **Create codespace on student/maya-r**.
3. Wait a minute or two while it sets up. You'll see files on the left and a **terminal** at the bottom: a place to type commands.

### 3. Start Claude

Click in the terminal, type this, and press Enter:

```
claude
```

The first time, it asks a few setup questions. Use the arrow keys and Enter to answer:

- When it asks whether to use the API key it found, choose **Yes**. (It's the class key.)
- For everything else, the first option is fine, including "Yes, I trust this folder."

If the terminal feels cramped, drag its top edge up to make it bigger.

### 4. Tell it: "Help me add my cause page."

It asks you a few questions, one at a time: your name, your cause and nonprofit, why you care, and your idea for the creative section. When it asks for your photo, drag it from your computer into your folder in the file list on the left. Then it looks up the rest on the nonprofit's official website and shows you what it found.

**Check everything it found.** AI can be wrong. Open every link and make sure every fact matches the nonprofit's site.

### 5. Build your creative section

Describe what you want at the bottom of your page. Some ideas:

- A quiz about the cause
- A "what would your $10 do?" calculator
- A timeline of the problem in LA
- A mini game

Claude gives you a **preview link** to your page. Open it in a new tab, and reload it after each change to see what's new. To see how it looks on a phone, make the browser window narrow. (You'll check it on your actual phone after you submit.)

Then keep going: "make it more colorful", "add a second question", "make the text bigger on phones".

### 6. Submit it

Say: **"Open my pull request."** A **pull request** asks the instructors to add your page to the real site.

After a few minutes, a **preview link** appears on your pull request. Open it, including on your phone, to see your page. Once your instructor merges it, your page is live and the home page can match visitors to it.

When you're done, close the Codespace tab. It stops on its own.

---

## Ground rules

- **Your branch and your folder only.** Your pull request will fail if it changes anything else.
- **Real and local.** The nonprofit must be real and serve Los Angeles.
- **Verify everything.** Open every link and check every fact before you submit.
- **Your own photo.** Only use an image you took or have permission to use.
- **No personal info.** No phone numbers or emails of individuals.
- **Respectful tone.** Write about the people served with dignity.

## Stuck?

Ask your AI helper first: "I'm stuck, what do I do next?" If that doesn't help, ask your instructor, or email **hello@animystlab.com**.

**Preview link not loading?** Your Codespace stops the preview when it sits idle. Tell your AI helper "restart my preview", or type `npm run dev` in a terminal, wait until it says **Ready**, and reload the link.

---

*For instructors and maintainers: see [MAINTAINER.md](MAINTAINER.md).*

*Lion Share is built by LMU entrepreneurship students in a hands-on session on building technology with AI, hosted by Animyst.*
