#!/usr/bin/env node
/** Build the static open-source hub into dist/ for Cloudflare Pages. */
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const skip = new Set(['.git', '.wrangler', 'dist', 'node_modules', 'scripts', 'package.json', '.gitignore', '.DS_Store']);

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const entry of await readdir(root)) {
  if (skip.has(entry)) continue;
  await cp(join(root, entry), join(dist, entry), { recursive: true });
}
console.log('built', dist);
