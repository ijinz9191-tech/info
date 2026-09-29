#!/usr/bin/env node
// Confirms representative VOC coverage for every indexed language and CNCF project subcategory.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => readFileSync(path.join(root, name), 'utf8');
const rows = (content) => new Set([...content.matchAll(/^\| ([^|]+) \|/gm)].map((m) => m[1].trim()));
const languageAtlas = rows(read('language-atlas.md'));
const languageVoc = rows(read('voc-languages.md'));
languageAtlas.delete('언어');
languageVoc.delete('언어');
const index = JSON.parse(read('public-data/cncf-landscape-index.json'));
const cncfCategories = new Set(index.items.filter((item) => item.project).map((item) => `${item.category} / ${item.subcategory}`));
const cncfVoc = rows(read('voc-cncf.md'));
cncfVoc.delete('분야');
const missingLanguages = [...languageAtlas].filter((name) => !languageVoc.has(name));
const missingCncfCategories = [...cncfCategories].filter((name) => !cncfVoc.has(name));
const orphanLanguages = [...languageVoc].filter((name) => !languageAtlas.has(name));
const orphanCncfCategories = [...cncfVoc].filter((name) => !cncfCategories.has(name));
const report = { status: missingLanguages.length || missingCncfCategories.length || orphanLanguages.length || orphanCncfCategories.length ? 'REVIEW_NEEDED' : 'CURRENT_LOCAL', indexedLanguages: languageAtlas.size, coveredLanguages: languageVoc.size, cncfProjectSubcategories: cncfCategories.size, coveredCncfSubcategories: cncfVoc.size, cncfProjects: index.items.filter((item) => item.project).length, missingLanguages, missingCncfCategories, orphanLanguages, orphanCncfCategories, meaning: 'One representative VOC per language and CNCF project subcategory; this does not enumerate every possible incident.' };
console.log(JSON.stringify(report, null, 2));
if (report.status !== 'CURRENT_LOCAL') process.exit(1);
