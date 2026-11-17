# Canva Portfolio

A static portfolio linking to Canva projects, built with [Eleventy](https://www.11ty.dev/)
and hosted on GitHub Pages at `https://USERNAME.github.io/REPO_NAME/`.

**To add or edit projects, see [EDITING.md](EDITING.md).**

## How it works

- `_data/projects.yaml`: the project list. It is checked on every build, and the build fails with a
  readable message if a field is missing, a screenshot doesn't exist, or a link isn't a Canva link.
- `_data/site.yaml`: name, bio and header links.
- `assets/screenshots/`: original preview images. At build time they are resized to
  400px and 800px WebP/JPEG by `@11ty/eleventy-img`.
- `_includes/`: page layout (`base.njk`) and project card (`card.njk`).
- `index.njk`: the home page: tag filter and card grid.
- `assets/css/style.css`: styles (pastel violet accents, automatic dark mode).
- `assets/js/filter.js`: the tag filter. Without JavaScript all projects are shown.

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
