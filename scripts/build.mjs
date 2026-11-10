#!/usr/bin/env node
/** Build the static open-source hub into dist/ for Cloudflare Pages using an explicit allowlist. */
import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");

const ROOT_FILES = [
  "index.html",
  "404.html",
  "_headers",
  "robots.txt",
  "llms.txt",
  "sitemap.xml",
  "c18e457aee12453bad18e8a03c5499a4.txt",
];

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

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const file of ROOT_FILES) {
  await cp(join(root, file), join(dist, file));
}
for (const slug of SLUGS) {
  await mkdir(join(dist, slug), { recursive: true });
  await cp(join(root, slug, "index.html"), join(dist, slug, "index.html"));
}
console.log("built", dist);
