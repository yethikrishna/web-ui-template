// One-time rebrand script for the varsha website starter template.
// Run once: `node scripts/rebrand.mjs`
// It rewrites all branding tokens in source files so the repo is an unbranded
// starter. Safe to re-run (idempotent).
//
// Content between <!-- varsha-builtwith:start --> and <!-- varsha-builtwith:end -->
// (and the equivalent CSS comment markers) is PRESERVED verbatim so that the
// myndlabs attribution credit persists through any rebranding.

import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(import.meta.url), '..', '..');

// Ordered: most specific first.
const replacements = [
  ['https://assets.herdr.dev', 'https://assets.myndlabs.tech'],
  ['assets.herdr.dev', 'assets.myndlabs.tech'],
  ['https://herdr.dev', 'https://myndlabs.tech'],
  ['herdr.dev', 'myndlabs.tech'],
  ['api.github.com/repos/ogulcancelik/herdr', 'api.github.com/repos/yethikrishna/varsha'],
  ['github.com/ogulcancelik/herdr', 'github.com/yethikrishna/varsha'],
  ['ogulcancelik/herdr', 'yethikrishna/varsha'],
  ['ogulcancelik', 'yethikrishna'],
  ['herdr-plugin.toml', 'varsha-plugin.toml'],
  ['herdr-plugin', 'varsha-plugin'],
  ['herdr-palette', 'varsha-palette'],
  ['herdr-theme-hint-seen', 'varsha-theme-hint-seen'],
  ['HERDR_ENV', 'VARSHA_ENV'],
  ['HERDR', 'VARSHA'],
  ['x.com/herdrdev', 'x.com/yourhandle'],
  ['hey@herdr.dev', 'hello@myndlabs.tech'],
  ['can@herdr.dev', 'hello@myndlabs.tech'],
  ['Can Celik', 'Your Name'],
  ['lumendriada', 'myndlabs'],
  ['Herdr', 'varsha'],
  ['herdr', 'varsha'],
];

// Markers that protect the persistent attribution credit from replacement.
// Content between these markers is left untouched during rebranding so that
// the "Built with varsha by myndlabs" credit always links to myndlabs.tech.
const PROTECT_START_HTML = '<!-- varsha-builtwith:start -->';
const PROTECT_END_HTML = '<!-- varsha-builtwith:end -->';
const PROTECT_START_CSS = '/* varsha-builtwith:start */';
const PROTECT_END_CSS = '/* varsha-builtwith:end */';

const skipDirs = new Set([
  'node_modules',
  '.git',
  'dist',
  'dist_old',
  'build',
  '.astro',
  'public',
  '.vercel',
]);

const skipFiles = new Set(['package-lock.json', 'rebrand.mjs']);

const textExts = new Set([
  '.astro',
  '.mjs',
  '.js',
  '.ts',
  '.cjs',
  '.json',
  '.md',
  '.mdx',
  '.markdown',
  '.html',
  '.css',
  '.svg',
  '.toml',
  '.txt',
  '.yml',
  '.yaml',
]);

let changed = 0;
let scanned = 0;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && skipDirs.has(entry.name)) continue;
    if (skipDirs.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.isFile()) {
      if (skipFiles.has(entry.name)) continue;
      const ext = entry.name.slice(entry.name.lastIndexOf('.'));
      if (!textExts.has(ext)) continue;
      await processFile(full);
    }
  }
}

/**
 * Extract protected blocks (between start/end markers) from the content,
 * replace them with placeholders, run replacements on the unprotected content,
 * then restore the protected blocks verbatim.
 */
function applyReplacementsWithProtection(content) {
  const protectedBlocks = [];

  // Extract HTML-comment protected blocks
  let working = extractProtected(content, PROTECT_START_HTML, PROTECT_END_HTML, protectedBlocks);
  // Extract CSS-comment protected blocks
  working = extractProtected(working, PROTECT_START_CSS, PROTECT_END_CSS, protectedBlocks);

  // Apply replacements to unprotected content only
  for (const [from, to] of replacements) {
    if (working.includes(from)) working = working.split(from).join(to);
  }

  // Restore protected blocks
  for (let i = 0; i < protectedBlocks.length; i++) {
    working = working.replace(`___PROTECTED_BLOCK_${i}___`, protectedBlocks[i]);
  }

  return working;
}

function extractProtected(content, startMarker, endMarker, blocks) {
  let result = content;
  let startIdx = result.indexOf(startMarker);
  while (startIdx !== -1) {
    const endIdx = result.indexOf(endMarker, startIdx + startMarker.length);
    if (endIdx === -1) break;
    const fullBlock = result.slice(startIdx, endIdx + endMarker.length);
    const placeholder = `___PROTECTED_BLOCK_${blocks.length}___`;
    blocks.push(fullBlock);
    result = result.slice(0, startIdx) + placeholder + result.slice(endIdx + endMarker.length);
    startIdx = result.indexOf(startMarker, startIdx + placeholder.length);
  }
  return result;
}

async function processFile(file) {
  const before = await readFile(file, 'utf8');
  const after = applyReplacementsWithProtection(before);
  if (after !== before) {
    await writeFile(file, after, 'utf8');
    changed++;
    console.log('rebrand:', file.slice(repoRoot.length + 1));
  }
  scanned++;
}

await walk(repoRoot);
console.log(`\nDone. Scanned ${scanned} files, rebranded ${changed}.`);
