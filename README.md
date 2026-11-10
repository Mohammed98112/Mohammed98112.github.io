# Mohammed Yousuf Al-Hasani – Portfolio

A personal CV / portfolio website built with plain HTML, CSS and JavaScript. It is designed for GitHub Pages.

```
index.html   – page content (all sections)
style.css    – design, colors, layout, animations
script.js    – loader, typing effect, scroll animations, theme toggle, contact form
assets/      – images and CV
```

## 1. Placeholders to replace

| # | What | Where | How |
|---|------|-------|-----|
| 1 | **Hero background image** | `assets/background.jpg` | Replace the file with your own photo and keep the same name. To use a different file name, change `--hero-image` at the top of `style.css`. A wide image, 1920×1080 or larger, works best. |
| 2 | **CV PDF** | `assets/CV.pdf` | This is currently your uploaded CV. To update it, replace the file and keep the name `CV.pdf`. |
| 3 | **Profile photo** | `assets/profile.jpg` | Add a square photo with this name. Until you do, the site shows "MH" initials. |
| 4 | **Formspree ID** | `index.html` → search `formspree.io/f/` | ✅ Done: set to `meaaygvv`. To use a different form, replace that code. |
| 5 | **Project links** | `index.html` → `#projects` section, `View on GitHub` buttons | Both buttons currently go to your GitHub profile. Change each `href` to the project's repo URL. |
| 6 | **Project images** (optional) | `index.html` → `.project-img` | Replace the `<div class="project-placeholder">…</div>` with `<img src="assets/your-image.jpg" alt="…">`. |
| 7 | **Full-Stack project description** | `index.html` → second project card | Update the title, text and tags once the project is finished. |
| 8 | **LinkedIn URL** | `index.html` (search `linkedin.com`) | Already set to `http://www.linkedin.com/in/mohammed-alhasani-702645276`. Change it here if your profile URL changes. |
| 9b | **Phone / WhatsApp** | `index.html` → search `96898112524` | Appears in two links: `tel:+96898112524` and `https://wa.me/96898112524`. Update both if your number changes. |
| 9 | **GitHub URL** | `index.html` (search `github.com/Mohammed98112`) | Already set to your profile. |
| 10 | **Link-preview image** | `assets/og-image.jpg` | This image appears when the link is shared on LinkedIn. Replace it with a 1200×630 image if you want. |
| 11 | **Site URL in meta tags** | `index.html` → `og:url`, `og:image`, `canonical` | These are set to `https://mohammed98112.github.io/`. Update them if your site lives at a different address. |

### Adding a new project
In `index.html`, find the comment `PROJECT CARD (copy this whole <article> block…)`. Copy the whole `<article>…</article>` block, paste it below the others, and edit the text.

### Contact form spam protection
`script.js` (section 9) blocks messages that:
- are sent less than 3 seconds after the page opens (bots)
- come within 5 minutes of the previous message from the same browser
- come from an email that has already sent 2 messages
- use a badly formatted email, a test or temporary email domain, or a domain that can't receive email (checked via a public DNS lookup; if the lookup is blocked, this check is skipped)
- have very short messages or more than 2 links

Change the limits at the top of that section (`MIN_FILL_SECONDS`, `COOLDOWN_MINUTES`, `MAX_PER_EMAIL`, `BLOCKED_DOMAINS`). The limits are stored in the visitor's browser, so they stop bots and repeat-sending but not a determined person; Formspree's own spam filter is the second layer.

### Changing skill levels
Each progress bar has a `data-level="80"` attribute in `index.html`. Change the number, from 0 to 100.

## 2. Publish on GitHub Pages

> ⚠️ **Private repos and GitHub Pages:** on a free GitHub account, Pages only works for **public** repositories. To publish this site, do one of the following:
> - make the repo public: **Settings → General → Danger Zone → Change visibility → Public**, or
> - upgrade to GitHub Pro. Students can get it free through the GitHub Student Developer Pack.

This repo is named **`Mohammed98112.github.io`**, so the site address will be **https://mohammed98112.github.io**.

1. Open https://github.com/Mohammed98112/Mohammed98112.github.io
2. If the repo is private and you have a free account, make it public. See the warning above.
3. Go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Under **Branch**, choose **`main`** and **`/ (root)`**, then click **Save**.
6. Wait 1–2 minutes and refresh. A green box will show *"Your site is live at https://mohammed98112.github.io"*.
7. To update the site later, edit the files and push them:
   ```bash
   git add .
   git commit -m "Update site"
   git push
   ```
   The site redeploys automatically within about a minute.

## 3. Add the link to LinkedIn

**Contact info**
1. Open your LinkedIn profile and click the ✏️ pencil next to your name.
2. Click **Contact info → ✏️**.
3. Under **Website**, click **+ Add website**. Paste `https://mohammed98112.github.io`, choose type **Portfolio**, and click **Save**.

**Featured section**
1. On your profile, click **Add profile section → Recommended → Add featured**. If you already have a Featured section, click **+** on it instead.
2. Choose **Add a link** and paste `https://mohammed98112.github.io`.
3. LinkedIn loads the preview image and title from the site's Open Graph tags. Edit the title or description if needed, then click **Save**.

> Tip: if LinkedIn shows an old or empty preview, paste your URL into https://www.linkedin.com/post-inspector/ to refresh it.
