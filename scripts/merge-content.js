#!/usr/bin/env node
// Merges content/ back into a single content.json for the site to fetch.
//
// content/ is the CMS-editable source of truth; content.json is a build
// artifact (gitignored). Keeping the site on one file means no change to how
// it loads content, while the CMS gets the separate files it needs to offer
// proper collections.

const fs = require('fs');
const path = require('path');

const root = 'content';
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

const dir = (sub) => {
  const d = path.join(root, sub);
  if (!fs.existsSync(d)) return [];
  return fs
    .readdirSync(d)
    .filter((f) => f.endsWith('.json'))
    .map((f) => read(path.join(d, f)))
    // Explicit `order` drives site ordering; fall back to id for stability so
    // a missing order field can never produce a nondeterministic build.
    .sort((a, b) => (a.order ?? 1e9) - (b.order ?? 1e9) || String(a.id).localeCompare(String(b.id)))
    .map(({ order, ...rest }) => rest);
};

const settings = read(`${root}/settings.json`);

const merged = {
  brand: settings.brand,
  nav: settings.nav,
  home: read(`${root}/home.json`),
  programs: dir('programs'),
  projects: dir('projects'),
  pages: read(`${root}/pages.json`),
  footer: settings.footer,
};

// Fail loudly rather than shipping a half-empty site.
for (const [k, v] of Object.entries(merged)) {
  if (v === undefined || v === null) throw new Error(`merged content is missing "${k}"`);
}
if (!merged.programs.length) throw new Error('no programs found in content/programs');
if (!merged.projects.length) throw new Error('no projects found in content/projects');

fs.writeFileSync('content.json', JSON.stringify(merged, null, 2) + '\n');

if (process.argv.includes('--verbose')) {
  console.log(
    `content.json: ${merged.programs.length} programs, ${merged.projects.length} projects, ` +
    `${fs.statSync('content.json').size} bytes`
  );
}
