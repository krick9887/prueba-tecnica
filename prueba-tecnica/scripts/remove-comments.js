#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const skipDirs = new Set(['node_modules', '.git', 'dist', 'out', 'coverage']);
const exts = new Set(['.ts', '.js', '.html', '.scss', '.css', '.md', '.json', '.tsx', '.jsx']);

function walk(dir, fileList = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) {
      if (skipDirs.has(it.name)) continue;
      walk(full, fileList);
    } else {
      fileList.push(full);
    }
  }
  return fileList;
}

function removeComments(content, ext) {
  let s = content;
  // Remove block comments /* */ for code/css
  s = s.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove HTML comments
  s = s.replace(/<!--([\s\S]*?)-->/g, '');
  // Remove whole-line // comments (lines that start with optional whitespace then //)
  s = s.replace(/^\s*\/\/.*$/gm, '');
  // Collapse multiple blank lines
  s = s.replace(/\n{3,}/g, '\n\n');
  return s;
}

function processPath(p) {
  let stats;
  try { stats = fs.statSync(p); } catch (e) { return; }
  if (stats.isDirectory()) {
    const files = walk(p);
    files.forEach(f => processFile(f));
  } else {
    processFile(p);
  }
}

function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!exts.has(ext)) return;
  try {
    const original = fs.readFileSync(filePath, 'utf8');
    const stripped = removeComments(original, ext);
    if (stripped !== original) {
      // backup
      const bak = filePath + '.bak';
      if (!fs.existsSync(bak)) fs.writeFileSync(bak, original, 'utf8');
      fs.writeFileSync(filePath, stripped, 'utf8');
      console.log('Stripped comments:', filePath);
    }
  } catch (err) {
    console.error('Error processing', filePath, err.message);
  }
}

function main() {
  const targets = process.argv.slice(2);
  if (targets.length === 0) {
    console.log('Usage: node remove-comments.js <path> [<path> ...]');
    console.log('Example: node remove-comments.js src public');
    process.exit(1);
  }
  targets.forEach(t => processPath(path.resolve(t)));
}

main();
