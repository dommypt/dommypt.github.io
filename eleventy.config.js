import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import Image from "@11ty/eleventy-img";
import { HtmlBasePlugin } from "@11ty/eleventy";

const REQUIRED_FIELDS = ["title"];
const DATA_FILE = "portfolio.yaml"; // site settings + projects
const IMAGE_DIR = "images"; // pictures and gallery folders

// Canva design links look like
//   https://www.canva.com/design/<DESIGN_ID>/<SHARE_TOKEN>/view?embed
// (the share token is missing on some links). Anything after "/view" is dropped.
const CANVA_DESIGN_URL =
  /^https:\/\/(?:www\.)?canva\.com\/design\/[\w-]+(?:\/[\w-]+)?\/view(?:[/?#].*)?$/;

// Instagram post/reel links, e.g. https://www.instagram.com/p/<CODE>/?utm_source=...
// or https://www.instagram.com/<username>/p/<CODE>/
const INSTAGRAM_POST_URL =
  /^https:\/\/(?:www\.)?instagram\.com\/(?:[\w.]+\/)?(p|reel|tv)\/([\w-]+)\/?(?:[?#].*)?$/;

// TikTok video links, e.g. https://www.tiktok.com/@username/video/7301234567890123456?is_from_webapp=1
// Short links (vm.tiktok.com/...) can't be used: they hide the video id.
const TIKTOK_VIDEO_URL =
  /^https:\/\/(?:www\.|m\.)?tiktok\.com\/(@[\w.-]+)\/video\/(\d+)\/?(?:[?#].*)?$/;

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".tif", ".tiff"]);
const isImageFile = (name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase());

/** Absolute path of `rel` inside assets/images/, or null if it escapes the folder ("../"). */
function imagePath(rel) {
  const root = path.resolve(IMAGE_DIR);
  const full = path.resolve(root, rel);
  return full.startsWith(root + path.sep) ? full : null;
}

/**
 * Inspect the "image" value: a single picture file, or a folder (gallery).
 * Returns { kind: "image" | "gallery" | "missing" | "not-image", files, skipped }.
 */
function inspectImage(rel) {
  const full = imagePath(rel);
  if (!full || !fs.existsSync(full)) return { kind: "missing" };
  if (!fs.statSync(full).isDirectory()) {
    return { kind: isImageFile(full) ? "image" : "not-image" };
  }
  const names = fs
    .readdirSync(full, { withFileTypes: true })
    .filter((e) => e.isFile() && !e.name.startsWith("."))
    .map((e) => e.name);
  return {
    kind: "gallery",
    // File-name order, with numbers compared as numbers: 2.jpg before 10.jpg
    files: names
      .filter(isImageFile)
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }))
      .map((name) => path.posix.join(rel.replace(/\/+$/, ""), name)),
    skipped: names.filter((n) => !isImageFile(n)),
  };
}

/** Work out the card type and the links each card type needs. */
function resolveProject(p) {
  if (p.image) {
    const image = String(p.image).trim();
    const info = inspectImage(image);
    return info.kind === "gallery"
      ? { ...p, type: "gallery", image, galleryFiles: info.files }
      : { ...p, type: "image", image };
  }
  const url = String(p.url).trim();
  if (CANVA_DESIGN_URL.test(url)) {
    const base = url.replace(/^(https:\/\/(?:www\.)?canva\.com\/design\/.*?\/view).*$/, "$1");
    return { ...p, type: "canva", viewUrl: base, embedUrl: `${base}?embed` };
  }
  const tiktok = url.match(TIKTOK_VIDEO_URL);
  if (tiktok) {
    const [, user, id] = tiktok;
    return {
      ...p,
      type: "tiktok",
      viewUrl: `https://www.tiktok.com/${user}/video/${id}`,
      embedUrl: `https://www.tiktok.com/player/v1/${id}?description=1&music_info=1&rel=0`,
    };
  }
  const [, kind, code] = url.match(INSTAGRAM_POST_URL);
  return { ...p, type: "instagram", viewUrl: `https://www.instagram.com/${kind}/${code}/` };
}

/** Throw one readable error listing every problem found in the projects list. */
function validateProjects(projects) {
  if (projects == null) return [];
  if (!Array.isArray(projects)) {
    throw new Error(
      `\n\nIn ${DATA_FILE}, "projects:" must be a list. Every project should start with "- title:".\n`
    );
  }

  const problems = [];
  projects.forEach((p, i) => {
    const label = `Project #${i + 1}${p?.title ? ` ("${p.title}")` : ""}`;
    if (!p || typeof p !== "object") {
      problems.push(`${label}: is not written as a project entry. Check its indentation.`);
      return;
    }
    for (const field of REQUIRED_FIELDS) {
      if (p[field] == null || p[field] === "") {
        problems.push(`${label}: is missing "${field}".`);
      }
    }
    if (p.url && p.image) {
      problems.push(`${label}: has both "url" and "image". Use only one of them.`);
    } else if (!p.url && !p.image) {
      problems.push(`${label}: needs either a "url" (Canva, Instagram or TikTok) or an "image".`);
    } else if (p.url) {
      const url = String(p.url).trim();
      if (/^https:\/\/(vm|vt)\.tiktok\.com\//.test(url) || /tiktok\.com\/t\//.test(url)) {
        problems.push(
          `${label}: "${p.url}" is a TikTok short link. Open it in a browser and copy the full ` +
            "link from the address bar instead (it looks like https://www.tiktok.com/@username/video/123...)."
        );
      } else if (
        ![CANVA_DESIGN_URL, INSTAGRAM_POST_URL, TIKTOK_VIDEO_URL].some((re) => re.test(url))
      ) {
        problems.push(
          `${label}: "url" should be a Canva design link like ` +
            "https://www.canva.com/design/.../view?embed (Share → Embed → Embed → " +
            "\"Smart embed link\"), an Instagram post link like https://www.instagram.com/p/..., " +
            `or a TikTok video link like https://www.tiktok.com/@username/video/... (got "${p.url}").`
        );
      }
    } else {
      const info = inspectImage(String(p.image).trim());
      const supported = "JPG, PNG, WebP, GIF, AVIF or TIFF";
      if (info.kind === "missing") {
        problems.push(
          `${label}: image "${p.image}" was not found in ${IMAGE_DIR}/. ` +
            "Check the spelling, including upper/lower case, the file extension and any folder name."
        );
      } else if (info.kind === "not-image") {
        problems.push(`${label}: "${p.image}" is not a supported picture (use ${supported}).`);
      } else if (info.kind === "gallery" && info.skipped.length) {
        problems.push(
          `${label}: the folder "${p.image}" contains files that aren't supported pictures: ` +
            `${info.skipped.join(", ")}. Convert them to ${supported} (iPhone HEIC photos ` +
            "included), or remove them from the folder."
        );
      } else if (info.kind === "gallery" && !info.files.length) {
        problems.push(`${label}: the folder "${p.image}" has no pictures in it.`);
      }
    }
    if (p.date != null && !(p.date instanceof Date && !isNaN(p.date))) {
      problems.push(`${label}: "date" should look like 2026-03-14 (got "${p.date}").`);
    }
    if (p.tags != null && !Array.isArray(p.tags)) {
      problems.push(`${label}: "tags" should look like [poster, branding].`);
    }
    if (p.branch != null && typeof p.branch !== "string") {
      problems.push(
        `${label}: "branch" should be a single name like "Social Media" ` +
          `(got ${JSON.stringify(p.branch)}). A project can only be in one branch.`
      );
    }
  });

  if (problems.length) {
    throw new Error(
      `\n\nThere are problems in the projects in ${DATA_FILE}:\n  - ` + problems.join("\n  - ") + "\n"
    );
  }

  return projects
    .map((p, i) => ({
      ...resolveProject(p),
      branch: p.branch?.trim() || null,
      order: i, // position in portfolio.yaml, used to order the branch tabs
    }))
    // Newest first; projects without a date go last, in the order they appear in the file.
    .sort((a, b) => (b.date ?? -Infinity) - (a.date ?? -Infinity) || 0);
}

// Picture and gallery cards: resized copies (300px is for gallery thumbnails),
// plus a large one for "Full size".
const IMAGE_OPTIONS = {
  widths: [300, 600, 1200, 2000],
  formats: ["webp", "jpeg"],
  outputDir: "_site/img/",
  urlPath: "/img/",
};
const CARD_SIZES = "(min-width: 1100px) 600px, (min-width: 700px) 50vw, 100vw";

/** Resize one picture; return its card HTML, thumbnail HTML and full-size URL. */
async function processPicture(rel, alt) {
  const metadata = await Image(path.join(IMAGE_DIR, rel), IMAGE_OPTIONS);
  const html = (attrs) =>
    Image.generateHTML(metadata, { loading: "lazy", decoding: "async", ...attrs });
  return {
    html: html({ alt, sizes: CARD_SIZES }),
    thumbHtml: html({ alt: "", sizes: "80px" }),
    fullUrl: metadata.jpeg.at(-1).url,
  };
}

/** For picture and gallery projects: resize the images and attach the HTML for the card. */
async function addPictures(project) {
  const alt = project.description || project.title;
  if (project.type === "image") {
    const pic = await processPicture(project.image, alt);
    return { ...project, pictureHtml: pic.html, fullImageUrl: pic.fullUrl };
  }
  if (project.type === "gallery") {
    const n = project.galleryFiles.length;
    const gallery = await Promise.all(
      project.galleryFiles.map((file, i) => processPicture(file, `${alt} (photo ${i + 1} of ${n})`))
    );
    return { ...project, gallery, fullImageUrl: gallery[0].fullUrl };
  }
  return project;
}

/** Read portfolio.yaml, check it, and prepare the `site` and `projects` data. */
async function loadPortfolio() {
  let data;
  try {
    data = yaml.load(fs.readFileSync(DATA_FILE, "utf8")) ?? {};
  } catch (err) {
    if (err.code === "ENOENT") throw new Error(`\n\n${DATA_FILE} was not found next to package.json.\n`);
    throw new Error(
      `\n\n${DATA_FILE} is not valid YAML (often an indentation problem or a ":" ` +
        `inside text that needs "quotes").\n${err.message}\n`
    );
  }
  const isMapping = (v) => v != null && typeof v === "object" && !Array.isArray(v);
  if (!isMapping(data)) {
    throw new Error(
      `\n\n${DATA_FILE} should have a "site:" section and a "projects:" section ` +
        "(both starting at the very beginning of the line).\n"
    );
  }
  const site = data.site ?? {};
  if (!isMapping(site)) {
    throw new Error(`\n\nIn ${DATA_FILE}, "site:" should contain "name:", "bio:" and "links:".\n`);
  }
  return {
    site: { ...site, name: site.name ?? "", bio: site.bio ?? "", links: site.links ?? [] },
    projects: await Promise.all(validateProjects(data.projects).map(addPictures)),
  };
}

export default function (eleventyConfig) {
  // Rewrites absolute URLs (/assets/...) when the site lives in a sub-folder,
  // e.g. USERNAME.github.io/REPO_NAME/. Set via PATH_PREFIX in CI.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // portfolio.yaml is (re)loaded once before every build, then exposed to the
  // templates as the `site` and `projects` global data.
  let portfolio = { site: {}, projects: [] };
  eleventyConfig.on("eleventy.before", async () => {
    portfolio = await loadPortfolio();
  });
  eleventyConfig.addGlobalData("site", () => portfolio.site);
  eleventyConfig.addGlobalData("projects", () => portfolio.projects);
  eleventyConfig.addWatchTarget(DATA_FILE);
  eleventyConfig.addWatchTarget(`${IMAGE_DIR}/`);

  eleventyConfig.addPassthroughCopy("assets/css");
  eleventyConfig.addPassthroughCopy("assets/js");

  // Self-hosted Playwrite FR Moderne (name heading). One file; it includes Polish letters.
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource-variable/playwrite-fr-moderne/files/playwrite-fr-moderne-fallback-wght-normal.woff2":
      "assets/fonts/playwrite-fr-moderne.woff2",
  });

  // Self-hosted Montserrat (no requests to Google): Latin + Latin-extended (Polish letters).
  for (const subset of ["latin", "latin-ext"]) {
    eleventyConfig.addPassthroughCopy({
      [`node_modules/@fontsource/montserrat/files/montserrat-${subset}-400-normal.woff2`]:
        `assets/fonts/montserrat-${subset}-400-normal.woff2`,
    });
  }

  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("EDITING.md");
  eleventyConfig.watchIgnores.add("_site/**");

  eleventyConfig.addFilter("hasType", (projects, type) =>
    (projects || []).some((p) => p.type === type)
  );

  eleventyConfig.addFilter("readableDate", (date) =>
    date.toLocaleDateString("en-GB", { year: "numeric", month: "long", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("isoDate", (date) => date.toISOString().slice(0, 10));

  // Branch tabs, in the order each branch first appears in portfolio.yaml.
  eleventyConfig.addFilter("uniqueBranches", (projects) => [
    ...new Set(
      [...(projects || [])]
        .sort((a, b) => a.order - b.order)
        .map((p) => p.branch)
        .filter(Boolean)
    ),
  ]);

  eleventyConfig.addFilter("uniqueTags", (projects) =>
    [...new Set((projects || []).flatMap((p) => p.tags || []).map(String))].sort((a, b) =>
      a.localeCompare(b)
    )
  );

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: { input: ".", includes: "_includes", output: "_site" },
  };
}
