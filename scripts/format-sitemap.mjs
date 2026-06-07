#!/usr/bin/env node
/**
 * Post-build sitemap pretty-printer.
 *
 * @astrojs/sitemap emits XML on a single line to save bytes. That's
 * fine for crawlers (Google ignores whitespace) but unreadable when
 * a human opens /sitemap-0.xml in the browser. This script walks
 * dist/ for any sitemap*.xml file and rewrites it with 2-space
 * indentation, preserving exact tag and attribute content.
 *
 * Runs as part of `npm run build` — see package.json.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = 'dist';

/**
 * Lightweight XML re-indenter. The input is well-formed XML produced
 * by @astrojs/sitemap (no CDATA, no mixed text+children), so we can
 * split on tag boundaries safely.
 */
function prettyXml(input) {
  // Normalize: collapse existing whitespace between tags, then re-split.
  const flat = input.replace(/>\s+</g, '><').trim();

  const lines = [];
  let depth = 0;
  let i = 0;
  let hasDeclaration = false;

  while (i < flat.length) {
    if (flat[i] !== '<') {
      // Should not happen for sitemap-style XML, but guard anyway.
      const next = flat.indexOf('<', i);
      const chunk = flat.slice(i, next === -1 ? flat.length : next);
      if (chunk.trim()) lines[lines.length - 1] += chunk.trim();
      i = next === -1 ? flat.length : next;
      continue;
    }

    const end = flat.indexOf('>', i);
    if (end === -1) break;
    const tag = flat.slice(i, end + 1);
    i = end + 1;

    // XML declaration <?xml ... ?>
    if (tag.startsWith('<?')) {
      lines.push(tag);
      hasDeclaration = true;
      continue;
    }
    // Comment
    if (tag.startsWith('<!--')) {
      lines.push('  '.repeat(depth) + tag);
      continue;
    }
    // Closing tag
    if (tag.startsWith('</')) {
      depth = Math.max(0, depth - 1);
      lines.push('  '.repeat(depth) + tag);
      continue;
    }
    // Self-closing tag (<foo .../>)
    if (tag.endsWith('/>')) {
      lines.push('  '.repeat(depth) + tag);
      continue;
    }
    // Opening tag — check if the next token is its immediate close
    const nextOpen = flat.indexOf('<', i);
    if (nextOpen !== -1) {
      const peek = flat.slice(i, nextOpen);
      const peekTag = flat.slice(nextOpen, flat.indexOf('>', nextOpen) + 1);
      // Inline leaf: <loc>text</loc> on one line
      if (peekTag.startsWith('</') && !peek.includes('<')) {
        const closeEnd = flat.indexOf('>', nextOpen) + 1;
        lines.push('  '.repeat(depth) + tag + peek + peekTag);
        i = closeEnd;
        continue;
      }
    }
    // Generic open tag — children indent by one
    lines.push('  '.repeat(depth) + tag);
    depth += 1;
  }

  return (hasDeclaration ? '' : '<?xml version="1.0" encoding="UTF-8"?>\n') + lines.join('\n') + '\n';
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/^sitemap.*\.xml$/i.test(entry.name)) out.push(full);
  }
  return out;
}

if (!fs.existsSync(DIST_DIR)) {
  console.error(`format-sitemap: ${DIST_DIR}/ not found — run astro build first.`);
  process.exit(0);
}

const files = walk(DIST_DIR);
if (files.length === 0) {
  console.log('format-sitemap: no sitemap*.xml files in dist/, nothing to do.');
  process.exit(0);
}

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const pretty = prettyXml(raw);
  fs.writeFileSync(file, pretty, 'utf8');
  const sizeKB = (Buffer.byteLength(pretty) / 1024).toFixed(1);
  console.log(`format-sitemap: ${file} → ${sizeKB} KB`);
}
