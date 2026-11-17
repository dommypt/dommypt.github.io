# How to add or edit projects

You never need to touch any code. Everything happens in **two places**:

- `_data/projects.yaml`: the list of projects
- `assets/screenshots/`: the preview images

All of this can be done in your web browser on GitHub. After you save, the site
updates by itself in about a minute.

---

## Adding a new project

### 1. Get the Canva link

1. Open your design in Canva.
2. Click **Share**.
3. Under *Collaboration link* (or *Access level*), choose **Anyone with the link → Can view**.
   Use **"Can view"**, not "Can edit"!
4. Click **Copy link**.

### 2. Get a screenshot

Either:

- In Canva: **Share → Download → PNG** (the first page is enough), **or**
- Take a normal screenshot of the design.

Rename the file to something short and simple, using only **lowercase letters,
numbers and dashes**. For example: `spring-poster.png`. No spaces!

Any size works. The site shrinks images automatically. Previews are shown as
4:3 rectangles, cropped from the top, so tall or wide designs are trimmed a bit.

### 3. Upload the screenshot

1. On GitHub, open the repository and go into the **`assets`** folder, then **`screenshots`**.
2. Click **Add file → Upload files**.
3. Drag your image in and click **Commit changes**.

### 4. Add the project to the list

1. On GitHub, open **`_data`**, then **`projects.yaml`**.
2. Click the ✏️ **pencil icon** (Edit this file).
3. Go to the bottom of the file and paste this template:

   ```yaml
   - title: My Project Name
     url: https://www.canva.com/design/XXXXXXXX/view
     screenshot: my-project.png
     date: 2026-01-31
     description: One short sentence about the project.
     tags: [poster, branding]
   ```

4. Replace the example values with your own:

   | Field         | Required? | What to put                                                     |
   |---------------|-----------|-----------------------------------------------------------------|
   | `title`       | yes       | The project's name                                              |
   | `url`         | yes       | The Canva link from step 1                                      |
   | `screenshot`  | yes       | The exact file name from step 2, e.g. `spring-poster.png`       |
   | `date`        | yes       | Written as **year-month-day**, e.g. `2026-03-14`                |
   | `description` | no        | A short sentence. Delete the line if you don't want one.        |
   | `tags`        | no        | Categories in square brackets, separated by commas. Delete the line if you don't want any. |

5. Click **Commit changes…** and then **Commit changes** again.

### 5. Check that it worked

1. Click the **Actions** tab at the top of the repository.
2. The newest run at the top shows:
   - 🟡 a yellow dot while it's working,
   - ✅ a green tick when your change is live (refresh your site),
   - ❌ a red cross if something is wrong. **The live site is not affected.** See
     [When something goes wrong](#when-something-goes-wrong) below.

---

## Editing or removing a project

- **Edit:** open `projects.yaml` with the ✏️ pencil, change the text, commit.
- **Remove:** delete all the lines of that project (from its `- title:` line down to
  just before the next `- title:`), commit. You can also delete its screenshot:
  open the image in `assets/screenshots/`, click the **⋯** menu → **Delete file**.
- **Replace a screenshot:** upload a new image with the **same file name**. It
  replaces the old one.

The order of projects in the file doesn't matter. The site always shows the
newest `date` first.

---

## Tags

- Tags become the filter buttons above the projects. Click one to show only
  projects with that tag.
- Spell each tag **exactly the same way** every time (`poster` and `posters`
  become two different buttons).
- Use lowercase. The site capitalises them for display.
- Tags with spaces are fine: `[social media, branding]`.

---

## Your name and bio

Open `_data/site.yaml` with the ✏️ pencil and fill in the text between the quotes:

```yaml
name: "Jane Doe"
bio: "Graphic designer making posters, decks and social media content."
```

You can also add header links (Instagram, LinkedIn, …). Instructions are in that file.

---

## YAML rules (the format of `projects.yaml`)

YAML is strict about a few things:

1. **Indentation matters.** Every line of a project after `- title:` starts with
   exactly **two spaces**, lined up under the `t` of `title`. Use spaces, not tabs.
2. **Every project starts with `- `** (a dash and a space).
3. **Put text in quotes if it contains a colon `:` or starts with a special
   character** such as `#`, `[`, `{`, `*`, `&`, `!`, `"`:
   ```yaml
   - title: "Brand Refresh: Phase 2"
   ```
4. **Lines starting with `#` are comments.** They are ignored and you can leave them.
5. Leave an empty line between projects. It isn't required but it's easier to read.

---

## When something goes wrong

If you see a ❌ in the **Actions** tab:

1. Click the failed run, then click **build**, then the red step **Run npm run build**.
2. Scroll to the message that starts with **"There are problems in
   _data/projects.yaml"**. It lists what's wrong and which project.

Common messages:

| Message says…                                    | Fix                                                                    |
|--------------------------------------------------|------------------------------------------------------------------------|
| `screenshot "x.png" was not found`               | The file name in `projects.yaml` doesn't match the uploaded image. Check spelling, upper/lower case, and `.png` vs `.jpg`. Or the image wasn't uploaded. |
| `is missing "url"` (or title/date/screenshot)    | That line is missing or misspelled, or it isn't indented with two spaces. |
| `"url" should be a Canva link`                   | Paste the full link, starting with `https://`.                         |
| `"date" should look like 2026-03-14`             | Write the date as year-month-day with dashes.                          |
| `is not valid YAML`                              | Usually indentation, a tab character, or a `:` inside text that needs quotes. The message includes the line number. |

Fix the file the same way you edited it. A new run starts automatically when you commit.

---

## Optional: preview on your own computer

You need [Node.js](https://nodejs.org) version 20 or newer. In a terminal, inside the project folder:

```sh
npm install     # first time only
npm start       # opens a live preview at http://localhost:8080
```
