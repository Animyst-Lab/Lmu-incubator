# How to make your cause page

This folder is the starting point for every cause page. Don't edit it. Copy it.

## 1. Copy this folder

Copy `causes/_template/` to a new folder named `<your-first-name>-<cause>`:

```
causes/maya-food-access/
```

Use lowercase letters, numbers, and hyphens only. The folder name becomes your page's web address: `/causes/maya-food-access`.

You can delete `HOW-TO.md` from your copy.

## 2. Answer the questions

Open `answers.md` in your folder. Put each answer inside the quotes.

- Links must be the nonprofit's official pages and start with `https://`
- The tagline is 10 words or fewer
- Questions 18 to 20 are how the home page matches visitors to your cause, so choose them carefully

## 3. Add your image

Put a square JPG or PNG under 1 MB in your folder. If it isn't named `image.jpg`, change question 16 to match.

## 4. Build your custom section

`custom.html` is yours. Ask Claude to build a quiz, a calculator, a timeline, a map, a mini game, or anything else that helps people understand your cause.

- Keep everything in that one file
- Scripts can only come from `cdn.jsdelivr.net` or `cdnjs.cloudflare.com`
- No forms, no collecting personal info, no tracking, no logins
- Under 500 KB, and it has to look good on a phone

See `causes/example-food-access/` for a finished example.

## 5. Check your work

Run:

```
npm run validate
```

It lists anything that needs fixing, with the question number. Fix everything it reports, then commit and push to your branch and open a pull request.
