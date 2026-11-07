/**
 * Build gate for the open-source hub and all 14 project pages.
 *
 * Fails when a page is thin, misses required metadata/accessibility/JSON-LD,
 * has broken internal links/anchors, or lacks 404/security-header coverage.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
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

function visibleWords(html) {
  const text = html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

function jsonLdBlocks(html) {
  const blocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  return blocks.map((b) => {
    try {
      return JSON.parse(b[1]);
    } catch {
      return null;
    }
  });
}

function checkCommonStructure(label, html) {
  const h1s = html.match(/<h1\b/gi)?.length ?? 0;
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  if (h1s !== 1) issues.push(`${label}: expected exactly one h1, found ${h1s}`);
  if (ids.length !== new Set(ids).size) issues.push(`${label}: duplicate id`);
  if (!html.includes('href="#main"')) issues.push(`${label}: missing skip link href="#main"`);
  if (!/<main\b[^>]*\bid="main"/i.test(html)) issues.push(`${label}: missing <main id="main">`);
  return ids;
}

function checkInternalLinks(label, html, ids) {
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (href.startsWith("#") && href.length > 1 && !ids.includes(href.slice(1))) {
      issues.push(`${label}: missing anchor ${href}`);
    }
    if (href.startsWith("/") && href.includes("#")) {
      const [targetPath, anchor] = href.split("#");
      const target = join(ROOT, targetPath, "index.html");
      if (existsSync(target) && !readFileSync(target, "utf8").includes(`id="${anchor}"`)) {
        issues.push(`${label}: missing anchor ${href}`);
      }
    }
  }
  for (const href of html.matchAll(/href="(\/[^"#?]*\/?)"/g)) {
    const route = href[1];
    if (route === "/") continue;
    if (!existsSync(join(ROOT, route, "index.html"))) issues.push(`${label}: broken internal link ${route}`);
  }
}

const sitemap = readFileSync(join(ROOT, "sitemap.xml"), "utf8");
const headers = readFileSync(join(ROOT, "_headers"), "utf8");
for (const req of ["default-src 'none'", "frame-ancestors 'none'", "object-src 'none'", "max-age=31536000; includeSubDomains"]) {
  if (!headers.includes(req)) issues.push(`_headers: missing ${req}`);
}

const rootHtml = readFileSync(join(ROOT, "index.html"), "utf8");
const rootIds = checkCommonStructure("index.html", rootHtml);
checkInternalLinks("index.html", rootHtml, rootIds);
if (!rootHtml.includes('rel="canonical" href="https://open-source.gainratio.com/"')) {
  issues.push("index.html: missing canonical https://open-source.gainratio.com/");
}
if (!rootHtml.includes('name="robots"') || !rootHtml.includes("index,follow")) {
  issues.push("index.html: missing index,follow robots");
}
for (const og of ["og:type", "og:title", "og:description", "og:url"]) {
  if (!rootHtml.includes(`property="${og}"`)) issues.push(`index.html: missing ${og}`);
}
if (jsonLdBlocks(rootHtml).some((b) => b === null)) issues.push("index.html: invalid JSON-LD");

const notFoundPath = join(ROOT, "404.html");
if (!existsSync(notFoundPath)) {
  issues.push("404.html: missing");
} else {
  const notFoundHtml = readFileSync(notFoundPath, "utf8");
  const notFoundIds = checkCommonStructure("404.html", notFoundHtml);
  checkInternalLinks("404.html", notFoundHtml, notFoundIds);
  if (!notFoundHtml.includes('name="robots"') || !notFoundHtml.includes("noindex,follow")) {
    issues.push("404.html: missing noindex,follow robots");
  }
  if (sitemap.includes("404.html")) issues.push("sitemap.xml: must not list 404.html");
}

const titles = new Map();
const descriptions = new Map();

for (const slug of SLUGS) {
  const html = readFileSync(join(ROOT, slug, "index.html"), "utf8");
  const words = visibleWords(html);
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
  const description = html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)?.[1]?.trim() ?? "";
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] ?? "";
  const ids = checkCommonStructure(slug, html);
  const lds = jsonLdBlocks(html);
  const ld = lds[0];
  const expected = `https://open-source.gainratio.com/${slug}/`;

  if (words < MIN_WORDS) issues.push(`${slug}: only ${words} visible words (min ${MIN_WORDS})`);
  if (title.length < 20 || title.length > 75) issues.push(`${slug}: title length ${title.length}`);
  if (description.length < 50 || description.length > 170) issues.push(`${slug}: description length ${description.length}`);
  if (canonical !== expected) issues.push(`${slug}: canonical is ${canonical || "missing"}, expected ${expected}`);
  if (!html.includes('name="robots"') || !html.includes("index,follow")) issues.push(`${slug}: missing index,follow robots`);
  for (const og of ["og:type", "og:title", "og:description", "og:url"]) {
    if (!html.includes(`property="${og}"`)) issues.push(`${slug}: missing ${og}`);
  }
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

  checkInternalLinks(slug, html, ids);
  if (!html.includes("https://github.com/gainratio/")) issues.push(`${slug}: missing GitHub source link`);
}

const distDir = join(ROOT, "dist");
if (existsSync(distDir)) {
  const forbidden = ["wrangler.toml", "package.json", "README.md", "SECURITY.md", "LAUNCH-KIT.md", "LICENSE", "docs", "scripts"];
  const present = readdirSync(distDir);
  for (const entry of forbidden) {
    if (present.includes(entry)) issues.push(`dist/: leaked non-public file ${entry}`);
  }
}

if (issues.length > 0) {
  console.error(`Project page contract failed (${issues.length}):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Project page contract passed: root index.html + 404.html + ${SLUGS.length} project pages, min ${MIN_WORDS} words, metadata, JSON-LD, skip links, headers, sitemap, internal links, anchors.`);
