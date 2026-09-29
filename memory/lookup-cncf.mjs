#!/usr/bin/env node
// Offline search across the pinned CNCF Landscape index.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const projectsOnly = args.includes('--projects-only');
const level = args.find((x) => x.startsWith('--level='))?.slice(8).toLowerCase();
const terms = args.filter((x) => !x.startsWith('--')).join(' ').toLowerCase().trim();
if (!terms && !level && !projectsOnly) {
  console.error('Usage: node lookup-cncf.mjs [--projects-only] [--level=sandbox|incubating|graduated|archived] search terms');
  process.exit(2);
}
const data = JSON.parse(readFileSync(path.join(root, 'public-data', 'cncf-landscape-index.json'), 'utf8'));
const matches = data.items.filter((item) => {
  if (projectsOnly && !item.project) return false;
  if (level && item.project?.toLowerCase() !== level) return false;
  return !terms || [item.name, item.category, item.subcategory].some((x) => x?.toLowerCase().includes(terms));
});
for (const item of matches.slice(0, 100)) {
  console.log(`${item.name}\t${item.project || 'landscape-only'}\t${item.category} / ${item.subcategory}\t${item.repo_url || item.homepage_url || ''}`);
}
console.log(`Matches: ${matches.length}${matches.length > 100 ? ' (first 100 shown)' : ''}; source commit: ${data.commit}`);
