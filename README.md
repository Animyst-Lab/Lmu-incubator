<div align="center">

<img src="docs/assets/lion-share-banner.svg" alt="Lion Share" width="720">

**A campus guide to giving back in Los Angeles, built by LMU students.**

Pick a cause you care about. Build a page for it with an AI helper. Help people find where to show up.

![Built by LMU students](https://img.shields.io/badge/built%20by-LMU%20students-B15F2C?style=for-the-badge)
![For Los Angeles](https://img.shields.io/badge/for-Los%20Angeles-CF8047?style=for-the-badge)
![No coding needed](https://img.shields.io/badge/no%20coding-needed-111111?style=for-the-badge)

</div>

---

## 🦁 At a glance

| Topic | Details |
|---|---|
| **What you'll make** | A page about a cause and a real LA nonprofit: the problem, what they do, and exactly how to volunteer or donate. Plus one creative piece you design, like a quiz, a calculator, or a mini game. |
| **What you need** | A GitHub account, a cause you care about, and a photo. No coding and no installing anything. |
| **How long** | About 10 minutes before class, then one class session. |
| **Who does the typing** | Claude, the AI helper. You tell it what you want, and you check what it made. |

---

## 📋 Before class (about 10 minutes)

- [ ] **Make a GitHub account** at [github.com/signup](https://github.com/signup). GitHub is where the site's code lives.
- [ ] **Send your GitHub username** to your instructor.
- [ ] **Accept the invite** in the email from GitHub to the `Lmu-incubator` repository. Click **Accept invitation**.

> [!NOTE]
> That's the only account you need. Claude is set up for you, and you don't pay for anything.

**Bring to class:**
- A cause you care about, and the LA nonprofit working on it if you know one (Claude can help you find one)
- A photo for your page, saved on your laptop, that you took or have permission to use (square works best)

---

## 🏫 In class

### 1️⃣ Make your branch

A **branch** is your own copy of the site. Your changes stay there until they're reviewed and added to the real site.

1. Open [github.com/Animyst-Lab/Lmu-incubator](https://github.com/Animyst-Lab/Lmu-incubator).
2. Click the branch menu near the top left. It says **dev**.
3. Type `student/` then your first name and last initial, like `student/maya-r`.
4. Click **Create branch student/maya-r from dev**.

### 2️⃣ Open your Codespace

A **Codespace** is a computer in your browser with the site and Claude already set up.

1. Check that the branch menu shows your branch.
2. Click the green **Code** button, open the **Codespaces** tab, and click **Create codespace on student/maya-r**.
3. Wait a minute or two. You'll see files on the left and a **terminal** at the bottom: a place to type commands.

### 3️⃣ Start Claude

Click in the terminal, type this, and press **Enter**:

```
claude
```

Claude opens ready to go, already set up with the class key. You'll see a box with a `>` where you can type.

> [!TIP]
> If it ever asks **"Use this API key?"**, press **↑** to choose **Yes**, then **Enter**. If the terminal feels cramped, drag its top edge up.

### 4️⃣ Say "Help me add my cause page."

Claude asks you a few things, one at a time: your name, your cause and nonprofit, why you care, and your idea for the creative section. When it asks for your photo, drag the file from your computer into your folder in the file list on the left. Then it looks up the rest on the nonprofit's official website and shows you what it found.

> [!IMPORTANT]
> AI can be wrong. Open every link and check that every fact matches the nonprofit's site.

### 5️⃣ Build your creative section

Describe what you want at the bottom of your page:

| Idea | Example |
|---|---|
| A quiz | "Five questions about hunger in LA" |
| A calculator | "What would your $10 do?" |
| A timeline | "How the problem grew in LA" |
| A mini game | "Sort the donations into the right bins" |

Claude gives you a **preview link**. Open it in a new tab and reload after each change. To see the phone layout, make the browser window narrow.

Then keep going: *"make it more colorful"*, *"add a second question"*, *"make the text bigger on phones"*.

### 6️⃣ Submit it

Say **"Open my pull request."** A **pull request** asks your instructor to add your page to the real site.

After a few minutes, a preview link appears on your pull request. Open it on your phone too. Once your instructor merges it, your page is live, and the home page can match visitors to it.

When you're done, close the Codespace tab. It stops on its own.

---

## 📏 Ground rules

| Rule | What it means |
|---|---|
| **Your branch, your folder** | Your pull request fails if it changes anything else. |
| **Real and local** | The nonprofit must be real and serve Los Angeles. |
| **Verify everything** | Open every link and check every fact before you submit. |
| **Your own photo** | Only use an image you took or have permission to use. |
| **No personal info** | No phone numbers or emails of individuals. |
| **Respectful tone** | Write about the people served with dignity. |

---

## 🆘 Need help?

<details>
<summary><strong>I'm stuck</strong></summary>

Ask Claude first: *"I'm stuck, what do I do next?"* If that doesn't help, ask your instructor, or email **hello@animystlab.com**.

</details>

<details>
<summary><strong>My preview link won't load</strong></summary>

Your Codespace stops the preview when it sits idle. Tell Claude *"restart my preview"*, or type `npm run dev` in a terminal, wait until it says **Ready**, and reload the link.

</details>

<details>
<summary><strong>Codespaces isn't working (backup route)</strong></summary>

> [!WARNING]
> Only use this if your instructor says so. It needs **your own Claude Pro or Max plan**; the class key only works in Codespaces.

1. Go to [claude.ai/code](https://claude.ai/code) and sign in.
2. Connect GitHub if it asks, choose **Animyst-Lab/Lmu-incubator**, and start from the **dev** branch.
3. Say **"Help me add my cause page."** Everything else works the same, with three differences:
   - **No live preview while you build.** Claude pushes your work, and you check the preview link on your pull request instead.
   - **Your photo goes in through GitHub.com.** Claude gives you a link to your folder; click **Add file → Upload files** there.
   - **If Claude can't open the nonprofit's website,** it asks you to paste the links and text it needs.
4. Say **"Open my pull request."**

</details>

---

<sub>For instructors and maintainers: see [MAINTAINER.md](MAINTAINER.md). Lion Share is built by LMU entrepreneurship students in a hands-on session on building technology with AI, hosted by Animyst.</sub>
