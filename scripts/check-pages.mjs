/**
 * Build gate for the open-source project pages.
 *
 * It fails when a page is thin, misses required metadata, has an invalid
 * canonical/JSON-LD block, or links to a hub route that does not exist.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SLUGS = [
  "edgeproc-browser",
  "edge-proc",
  "edgeproc-core",
  "avow",
  "privacy-core",
  "errors",
  "assay",
  "agentic-tab-context",
  "agentic-context-service",
  "agentic-saga",
  "ci",
  "aml-filter",
  "edge-reco",
  "almamesh",
];
const MIN_WORDS = 700;
const issues = [];

function page(slug) {
  return readFileSync(join(ROOT, slug, "index.html"), "utf8");
}

function visibleWords(html) {
  const text = html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

function jsonLd(html) {
  const match = html.match(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/i);
  if (!match) return undefined;
  try {
    return JSON.parse(match[1]);
  } catch {
    return undefined;
  }
}

const sitemap = readFileSync(join(ROOT, "sitemap.xml"), "utf8");
const titles = new Map();
const descriptions = new Map();

for (const slug of SLUGS) {
  const html = page(slug);
  const words = visibleWords(html);
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
  const description = html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)?.[1]?.trim() ?? "";
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] ?? "";
  const h1s = html.match(/<h1\b/gi)?.length ?? 0;
  const ld = jsonLd(html);
  const expected = `https://open-source.gainratio.com/${slug}/`;

  if (words < MIN_WORDS) issues.push(`${slug}: only ${words} visible words (min ${MIN_WORDS})`);
  if (h1s !== 1) issues.push(`${slug}: expected exactly one h1, found ${h1s}`);
  if (title.length < 20 || title.length > 75) issues.push(`${slug}: title length ${title.length}`);
  if (description.length < 50 || description.length > 170) issues.push(`${slug}: description length ${description.length}`);
  if (canonical !== expected) issues.push(`${slug}: canonical is ${canonical || "missing"}, expected ${expected}`);
  if (!html.includes('name="robots"') || !html.includes("index,follow")) issues.push(`${slug}: missing index,follow robots`);
  if (!sitemap.includes(`<loc>${expected}</loc>`)) issues.push(`${slug}: missing from sitemap.xml`);
  if (!ld || !["SoftwareSourceCode", "SoftwareApplication"].includes(ld["@type"])) {
    issues.push(`${slug}: missing SoftwareSourceCode/SoftwareApplication JSON-LD`);
  } else {
    for (const key of ["name", "description", "url", "codeRepository"]) {
      if (!ld[key]) issues.push(`${slug}: JSON-LD missing ${key}`);
    }
  }
  if (titles.has(title)) issues.push(`${slug}: duplicate title with ${titles.get(title)}`);
  if (descriptions.has(description)) issues.push(`${slug}: duplicate description with ${descriptions.get(description)}`);
  titles.set(title, slug);
  descriptions.set(description, slug);

  for (const href of html.matchAll(/href="(\/[^"#?]*\/?)"/g)) {
    const route = href[1];
    if (route === "/") continue;
    if (!existsSync(join(ROOT, route, "index.html"))) issues.push(`${slug}: broken internal link ${route}`);
  }
  if (!html.includes("https://github.com/gainratio/")) issues.push(`${slug}: missing GitHub source link`);
}

if (issues.length > 0) {
  console.error(`Project page contract failed (${issues.length}):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Project page contract passed: ${SLUGS.length} pages, min ${MIN_WORDS} words, metadata, JSON-LD, sitemap, internal links.`);
