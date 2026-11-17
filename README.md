# Canva Portfolio

A static portfolio linking to Canva projects, built with [Eleventy](https://www.11ty.dev/)
and hosted on GitHub Pages at `https://USERNAME.github.io/REPO_NAME/`.

**To add or edit projects, see [EDITING.md](EDITING.md).**

## How it works

- `portfolio.yaml`: all content, in two sections. `site:` holds name, bio and header links; `projects:` is
  the project list. It is loaded by `loadPortfolio()` before every build and exposed as the `site` and
  `projects` global data. It is checked on every build, and the build fails with a
  readable message if a field is missing, the date is malformed, a link isn't a Canva design,
  Instagram post or TikTok video link, or an image file doesn't exist. The card type is inferred per project:
  - `url` → Canva design: normalised to `viewUrl` (`…/view`) and `embedUrl` (`…/view?embed`)
  - `url` → Instagram post or reel: normalised to `viewUrl` (`instagram.com/p/<code>/`)
  - `url` → TikTok video: `viewUrl` (`tiktok.com/@user/video/<id>`) and `embedUrl`
    (TikTok's iframe player, `tiktok.com/player/v1/<id>`); short `vm.tiktok.com` links are rejected
  - `image` → file in `images/`: single picture. Resized by `@11ty/eleventy-img`
    (300/600/1200/2000px WebP and JPEG) while the data loads; `pictureHtml` and `fullImageUrl`
    are attached to the project.
  - `image` → folder in `images/`: gallery (`type: "gallery"`). Every supported image directly in
    the folder, in natural file-name order; each gets `html`, `thumbHtml` and `fullUrl` in `project.gallery`.
    Unsupported files (e.g. HEIC) in the folder fail the build.
- `_includes/`: page layout (`base.njk`) and project card (`card.njk`). The card media is a lazy
  Canva or TikTok `<iframe>`, an Instagram blockquote (turned into an embed by Instagram's `embed.js`, which
  is only loaded when an Instagram project exists), or a responsive `<picture>`.
- `images/`: original images for picture cards and folders for gallery cards.
- `index.njk`: the home page: branch tabs, tag filter and card grid. Branch tabs come from the optional
  `branch` field, ordered by first appearance in `portfolio.yaml` (each project gets an `order` index).
- `assets/css/style.css`: styles (pastel violet accents, automatic dark mode).
- `assets/js/gallery.js`: gallery cards. The photos are a CSS scroll-snap strip (swipeable, works without
  JS); the script adds arrows, counter, thumbnails, arrow keys, and keeps "Full size" pointing at the current photo.
- `assets/js/filter.js`: branch tabs (ARIA tablist, arrow-key navigation, selected tab kept in the URL hash)
  and the tag filter, which only offers tags present in the current tab. Without JavaScript all projects are shown.

## Local development

Requires Node.js 20+.

```sh
npm install
npm start        # dev server at http://localhost:8080
npm run build    # output in _site/
```

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.

One-time setup: in the repository go to **Settings → Pages → Build and deployment → Source**
and choose **GitHub Actions**.

The URL depends on the repository name:

- Repo named `USERNAME.github.io` → site at `https://USERNAME.github.io/`
- Any other name, e.g. `portfolio` → site at `https://USERNAME.github.io/portfolio/`

Both cases work without config changes: the workflow passes the correct base path to
Eleventy (`PATH_PREFIX`), and `HtmlBasePlugin` rewrites links to match.
