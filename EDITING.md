# How to add or edit projects

You never need to touch any code. Everything happens in **two places**, both at
the top level of the repository:

- **`portfolio.yaml`** holds your name and bio (the `site:` section at the top)
  and the list of projects (the `projects:` section below it).
- **`images/`** is the folder for pictures and photo-gallery folders.

There are **five kinds of project card**:

| Kind              | What visitors see                                 | What you put in the file |
|-------------------|---------------------------------------------------|--------------------------|
| **Canva design**  | The live design, which they can flip through on the page | `url:` with the Canva *Smart embed link* |
| **Instagram post**| The post, embedded                                | `url:` with the post's link |
| **TikTok video**  | The video, playable on the page                   | `url:` with the video's full link |
| **Picture**       | The image; clicking it opens it full size         | `image:` with the file name |
| **Photo gallery** | All photos from a folder, browsable with arrows and thumbnails | `image:` with the folder name |

The site recognises the kind automatically from the link or the `image:` line.

All of this can be done in your web browser on GitHub. After you save, the site
updates by itself in about a minute.

---

## Adding a Canva design

### 1. Get the Canva embed link

1. Open your design in Canva.
2. Click **Share**, then **See all** (if needed), then **Embed**.
3. Click the **Embed** button. Canva shows a *Smart embed link* and an *HTML embed code*.
4. Copy the **Smart embed link**. It looks like
   `https://www.canva.com/design/DAG.../view?embed`.

   You only need the link, **not** the long HTML code.

### 2. Add the project to the list

1. On GitHub, open **`portfolio.yaml`**.
2. Click the ✏️ **pencil icon** (Edit this file).
3. Go to the bottom of the file (the end of the `projects:` section) and paste this template:

   ```yaml
   - title: My Project Name
     url: https://www.canva.com/design/XXXXXXXX/YYYYYYYY/view?embed
     date: 2026-01-31
     description: One short sentence about the project.
     tags: [poster, branding]
   ```

4. Replace the example values with your own:

   | Field         | Required? | What to put                                                     |
   |---------------|-----------|-----------------------------------------------------------------|
   | `title`       | yes       | The project's name                                              |
   | `url`         | yes       | The Smart embed link from step 1                                |
   | `date`        | no        | Written as **year-month-day**, e.g. `2026-03-14`. Delete the line if you don't want a date shown. |
   | `description` | no        | A short sentence. Delete the line if you don't want one.        |
   | `tags`        | no        | Categories in square brackets, separated by commas. Delete the line if you don't want any. |
   | `branch`      | no        | The tab this project belongs to, e.g. `Graphic Design`. See [Branches](#branches-the-tabs-at-the-top). |

5. Click **Commit changes…** and then **Commit changes** again.

### 3. Check that it worked

1. Click the **Actions** tab at the top of the repository.
2. The newest run at the top shows:
   - 🟡 a yellow dot while it's working,
   - ✅ a green tick when your change is live (refresh your site),
   - ❌ a red cross if something is wrong. **The live site is not affected.** See
     [When something goes wrong](#when-something-goes-wrong) below.

---

## Adding an Instagram post

1. On Instagram, open the post, tap **⋯** (or the paper-plane share icon) → **Copy link**.
   It looks like `https://www.instagram.com/p/ABC123xyz/` (or `/reel/...` for reels).
   Extra bits at the end like `?utm_source=...` are fine.
2. Add it to `portfolio.yaml` like a Canva project, just with the Instagram link:

   ```yaml
   - title: My Instagram Post
     url: https://www.instagram.com/p/ABC123xyz/
     date: 2026-01-31
     description: One short sentence about the post.
     tags: [social media]
   ```

3. Commit and check the **Actions** tab, as above.

The post (and the account) must be **public**, otherwise Instagram won't show it.
Links to a whole profile (`instagram.com/username/`) don't work. It has to be a single post.

---

## Adding a TikTok video

1. Get the video's **full** link. The link must look like
   `https://www.tiktok.com/@username/video/7301234567890123456`.
   - **On a computer:** open the video on tiktok.com and copy the link from the
     browser's address bar.
   - **On a phone:** *Share → Copy link* gives a short link like
     `https://vm.tiktok.com/ZMabc123/`, which **won't work**. Open that short link
     in a browser first, then copy the full link from the address bar.
   - Extra bits at the end like `?is_from_webapp=1` are fine.
2. Add it to `portfolio.yaml`:

   ```yaml
   - title: My TikTok
     url: https://www.tiktok.com/@username/video/7301234567890123456
     date: 2026-01-31
     description: One short sentence about the video.
     tags: [social media, video]
   ```

3. Commit and check the **Actions** tab, as above.

The video must be **public** and allow embedding (TikTok: *Settings → Privacy →
Allow your videos to be embedded* is on by default). TikTok photo posts (slideshows)
can't be embedded. For those, use a picture card or link to them in the description.

---

## Adding a picture

1. **Prepare the image.** PNG, JPG or WebP. Any size works; the site makes smaller
   copies automatically. Give the file a simple name using only **lowercase letters,
   numbers and dashes**, e.g. `spring-poster.png`. No spaces!
2. **Upload it.** On GitHub, open the **`images`** folder → **Add file →
   Upload files**, drag the image in, and click **Commit changes**.
   You can make subfolders to keep things tidy (e.g. `images/posters/`).
3. **Add it to `portfolio.yaml`**, with `image:` instead of `url:`:

   ```yaml
   - title: Spring Poster
     image: spring-poster.png
     date: 2026-01-31
     description: Poster for a café's spring menu.
     tags: [poster]
   ```

   If the image is in a subfolder, include the folder: `image: posters/spring-poster.png`.
4. Commit and check the **Actions** tab, as above.

The whole picture is always shown (never cropped). Very tall images are shrunk to fit
the screen, and visitors can click the picture or **Full size ↗** to see it bigger.
The `description` (or the title, if there's no description) is also used as the
image's text for screen readers.

---

## Adding a photo gallery (many photos in one card)

Point `image:` at a **folder** instead of a single file, and the card becomes a
gallery of every photo in that folder. Visitors can use the ‹ › arrows, click the
thumbnails underneath, or swipe on a phone. A counter shows e.g. *3 / 12*, and
**Full size ↗** opens the photo that's currently shown.

1. **Prepare the photos** in a folder on your computer, e.g. `summer-trip`.
   - Use a simple folder name: lowercase letters, numbers and dashes, no spaces.
   - Photos are shown in **file-name order**. Numbers are sorted the way you'd
     expect (`2.jpg` before `10.jpg`), so naming them `01.jpg`, `02.jpg`… or
     `trip-1.jpg`, `trip-2.jpg`… gives you full control.
   - Supported: JPG, PNG, WebP, GIF, AVIF, TIFF. **iPhone HEIC photos must be
     converted to JPG first** (on iPhone: *Settings → Camera → Formats → Most
     Compatible* makes new photos JPG).
   - Full-resolution photos are fine; the site makes smaller copies automatically.
2. **Upload the folder.** On GitHub, open the **`images`** folder → **Add file →
   Upload files**, and drag the **whole folder** in (not just the photos). GitHub
   keeps the folder. Click **Commit changes**.
3. **Add it to `portfolio.yaml`** with the folder name as `image:`:

   ```yaml
   - title: Summer Trip
     image: summer-trip
     date: 2026-07-01
     description: Photos from the summer campaign shoot.
     tags: [photography]
   ```

   Folders inside folders work too: `image: photos/summer-trip`.
4. Commit and check the **Actions** tab, as above.

- **Add or remove photos later:** just upload to, or delete from, the folder.
  There's no need to touch `portfolio.yaml`.
- Only the photos directly in the folder are used. Subfolders inside it are ignored.

---

## Editing or removing a project

- **Edit:** open `portfolio.yaml` with the ✏️ pencil, change the text, commit.
- **Remove:** delete all the lines of that project (from its `- title:` line down to
  just before the next `- title:`), commit.
- **Hide temporarily:** put a `#` at the start of each of its lines. Lines
  starting with `#` are ignored.
- **Change a Canva design:** just edit it in Canva. The site always shows the
  current version, so there's nothing to update here.
- **Replace a picture:** upload a new image with the **same file name**. It
  replaces the old one. To delete an image, open it in the `images` folder, click
  **⋯** → **Delete file**, and remove its project from `portfolio.yaml`.

The site shows projects with the newest `date` first. Projects without a date
come after all dated ones, in the same order as in the file.

---

## Branches (the tabs at the top)

Branches split your work into big areas, e.g. *Graphic Design*, *Social Media*,
*Presentations*. Each branch becomes a **tab** above the projects, like tabs in a
web browser, plus an **All** tab that shows everything.

Add a `branch:` line to a project (any card type):

```yaml
- title: Spring Poster
  branch: Graphic Design
  image: spring-poster.png
  tags: [poster]
```

- **New branches appear automatically.** There's no list to maintain. A tab
  exists as long as at least one project uses that branch name.
- **Tab order** follows the order in which branches first appear in
  `portfolio.yaml`. To move a tab to the front, move one of its projects higher
  in the file.
- **One branch per project.** Use tags for anything more detailed.
- Spell each branch **exactly the same way**, including capital letters
  (`Social Media` and `Social media` become two tabs). Unlike tags, branch
  names are shown exactly as you write them.
- Projects **without** a `branch:` line only appear under **All**.
- Each tab has its own link: clicking a tab changes the address to e.g.
  `…/#Social%20Media`. Send that link to someone and the page opens on that tab.
- If no project has a branch, the tabs aren't shown at all.

---

## Tags

- Tags become the filter buttons above the projects. Click one to show only
  projects with that tag. Only the tags used in the current tab are shown.
- Spell each tag **exactly the same way** every time (`poster` and `posters`
  become two different buttons).
- Use lowercase. The site capitalises them for display.
- Tags with spaces are fine: `[social media, branding]`.

---

## Your name and bio

Open `portfolio.yaml` with the ✏️ pencil. The `site:` section at the top holds
them. Fill in the text between the quotes, keeping the two spaces at the start of
each line:

```yaml
site:
  name: "Jane Doe"
  bio: "Graphic designer making posters, decks and social media content."
```

You can also add header links (Instagram, LinkedIn, …). Instructions are in that section.

---

## YAML rules (the format of `portfolio.yaml`)

YAML is strict about a few things:

1. **Don't change the `site:` and `projects:` lines.** They must stay at the very
   beginning of their lines, each followed by a colon. Projects go below
   `projects:`, each starting with `- title:` at the beginning of the line.
2. **Indentation matters.** Every line of a project after `- title:` starts with
   exactly **two spaces**, lined up under the `t` of `title`. Use spaces, not tabs.
3. **Every project starts with `- `** (a dash and a space).
4. **Put text in quotes if it contains a colon `:` or starts with a special
   character** such as `#`, `[`, `{`, `*`, `&`, `!`, `"`:
   ```yaml
   - title: "Brand Refresh: Phase 2"
   ```
5. **Lines starting with `#` are comments.** They are ignored and you can leave them.
6. Leave an empty line between projects. It isn't required but it's easier to read.

---

## When something goes wrong

### The site didn't update (❌ in the Actions tab)

1. Click the failed run, then click **build**, then the red step **Run npm run build**.
2. Scroll to the message that starts with **"There are problems in the projects
   in portfolio.yaml"**. It lists what's wrong and which project.

Common messages:

| Message says…                                    | Fix                                                                    |
|--------------------------------------------------|------------------------------------------------------------------------|
| `should have a "site:" section and a "projects:" section` | The `site:` or `projects:` line was changed, deleted or indented. Put it back at the very beginning of its line. |
| `"projects:" must be a list`                     | Each project must start with `- title:` (dash, space) at the beginning of the line, below `projects:`. |
| `is missing "title"`                             | That line is missing or misspelled, or it isn't indented with two spaces. |
| `needs either a "url" ... or an "image"`         | Add a `url:` line (Canva/Instagram/TikTok) or an `image:` line (picture). |
| `is a TikTok short link`                         | Open the short link in a browser and copy the full `tiktok.com/@.../video/...` link from the address bar. |
| `"branch" should be a single name`               | Write one branch name, without square brackets: `branch: Social Media`. |
| `has both "url" and "image"`                     | Keep only one of them.                                                 |
| `"url" should be a Canva design link ... or an Instagram post link` | For Canva, copy the *Smart embed link* again (Share → Embed → Embed). Short links like `canva.link/...` don't work. For Instagram, use the link to a single post, not a profile. |
| `image "x.png" was not found`                    | The name in `portfolio.yaml` doesn't match the uploaded file or folder. Check spelling, upper/lower case, `.png` vs `.jpg`, and the folder name. Or the image wasn't uploaded. |
| `contains files that aren't supported pictures`  | A gallery folder has e.g. HEIC photos or other files in it. Convert the photos to JPG, or delete the listed files from the folder. |
| `has no pictures in it`                          | The gallery folder is empty. Upload the photos into it. |
| `"date" should look like 2026-03-14`             | Write the date as year-month-day with dashes.                          |
| `is not valid YAML`                              | Usually indentation, a tab character, or a `:` inside text that needs quotes. The message includes the line number. |

Fix the file the same way you edited it. A new run starts automatically when you commit.

### The project shows up but its preview is blank or shows an error

- **Canva** ("We can't show this page"): the design isn't shared publicly. In Canva,
  open the design → **Share → Embed → Embed** again. That turns embedding on for the design.
- **Instagram** (only a "View this post on Instagram" link): the post or the account
  is private, the post was deleted, or the link has a typo.
- **TikTok** (black box or "video unavailable"): the video is private or deleted,
  embedding is turned off for the account, or it's a photo post rather than a video.

---

## Optional: preview on your own computer

You need [Node.js](https://nodejs.org) version 20 or newer. In a terminal, inside the project folder:

```sh
npm install     # first time only
npm start       # opens a live preview at http://localhost:8080
```
