import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import Image from "@11ty/eleventy-img";
import { HtmlBasePlugin } from "@11ty/eleventy";

const SCREENSHOT_DIR = "assets/screenshots";
const REQUIRED_FIELDS = ["title", "url", "screenshot", "date"];
const CANVA_HOSTS = ["canva.com", "canva.link", "canva.site"];

/** Throw one readable error listing every problem found in projects.yaml. */
function validateProjects(projects) {
  if (projects == null) return [];
  if (!Array.isArray(projects)) {
    throw new Error(
      "projects.yaml must be a list. Every project should start with \"- title:\"."
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
    if (p.url) {
      let host = "";
      try {
        const u = new URL(p.url);
        host = u.protocol === "https:" ? u.hostname : "";
      } catch {}
      if (!CANVA_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
        problems.push(`${label}: "url" should be a Canva link starting with https:// (got "${p.url}").`);
      }
    }
    if (p.screenshot && !fs.existsSync(path.join(SCREENSHOT_DIR, String(p.screenshot)))) {
      problems.push(
        `${label}: screenshot "${p.screenshot}" was not found in ${SCREENSHOT_DIR}/. ` +
          "Check the spelling, including upper/lower case and the file extension."
      );
    }
    if (p.date != null && !(p.date instanceof Date && !isNaN(p.date))) {
      problems.push(`${label}: "date" should look like 2026-03-14 (got "${p.date}").`);
    }
    if (p.tags != null && !Array.isArray(p.tags)) {
      problems.push(`${label}: "tags" should look like [poster, branding].`);
    }
  });

  if (problems.length) {
    throw new Error(
      "\n\nThere are problems in _data/projects.yaml:\n  - " + problems.join("\n  - ") + "\n"
    );
  }

  // Newest first.
  return [...projects].sort((a, b) => b.date - a.date);
}

export default function (eleventyConfig) {
  // Rewrites absolute URLs (/assets/..., /img/...) when the site lives in a
  // sub-folder, e.g. USERNAME.github.io/REPO_NAME/. Set via PATH_PREFIX in CI.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addDataExtension("yaml,yml", (contents, filePath) => {
    let data;
    try {
      data = yaml.load(contents);
    } catch (err) {
      throw new Error(
        `\n\n${filePath} is not valid YAML (often an indentation problem or a ":" ` +
          `inside text that needs "quotes").\n${err.message}\n`
      );
    }
    return path.basename(filePath).startsWith("projects.") ? validateProjects(data) : data;
  });

  eleventyConfig.addPassthroughCopy("assets/css");
  eleventyConfig.addPassthroughCopy("assets/js");

  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("EDITING.md");
  eleventyConfig.watchIgnores.add("_site/**");

  // {% screenshot "file.png", "alt text" %} -> responsive <picture> with lazy loading
  eleventyConfig.addShortcode("screenshot", async (file, alt) => {
    const metadata = await Image(path.join(SCREENSHOT_DIR, file), {
      widths: [400, 800],
      formats: ["webp", "jpeg"],
      outputDir: "_site/img/",
      urlPath: "/img/",
    });
    return Image.generateHTML(metadata, {
      alt,
      sizes: "(min-width: 1000px) 320px, (min-width: 640px) 45vw, 92vw",
      loading: "lazy",
      decoding: "async",
    });
  });

  eleventyConfig.addFilter("readableDate", (date) =>
    date.toLocaleDateString("en-GB", { year: "numeric", month: "long", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("isoDate", (date) => date.toISOString().slice(0, 10));

  eleventyConfig.addFilter("uniqueTags", (projects) =>
    [...new Set((projects || []).flatMap((p) => p.tags || []).map(String))].sort((a, b) =>
      a.localeCompare(b)
    )
  );

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: { input: ".", includes: "_includes", data: "_data", output: "_site" },
  };
}
