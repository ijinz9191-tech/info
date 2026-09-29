#!/usr/bin/env node
// Checks indexed coverage and counts distinct additional troubleshooting cases.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => readFileSync(path.join(root, name), 'utf8');
const firstCells = (content) => new Set([...content.matchAll(/^\| ([^|]+) \|/gm)].map((m) => m[1].trim()));
const secondCells = (content) => new Set([...content.matchAll(/^\| [^|]+ \| ([^|]+) \|/gm)].map((m) => m[1].trim()));
const extraCases = (name, prefix) => [...read(name).matchAll(new RegExp(`^\\| (${prefix}-\\d{3}) \\| ([^|]+) \\|`, 'gm'))]
  .map((match) => ({ id: match[1], topic: match[2].trim() }));
const languageAtlas = firstCells(read('language-atlas.md'));
const languageVoc = firstCells(read('voc-languages.md'));
languageAtlas.delete('언어');
languageVoc.delete('언어');
const frameworkAtlas = secondCells(read('framework-atlas.md'));
frameworkAtlas.delete('프레임워크·런타임');
const index = JSON.parse(read('public-data/cncf-landscape-index.json'));
const cncfCategories = new Set(index.items.filter((item) => item.project).map((item) => `${item.category} / ${item.subcategory}`));
const cncfVoc = firstCells(read('voc-cncf.md'));
cncfVoc.delete('분야');
const languageExtra = extraCases('voc-languages-extra.md', 'L2');
const languageMore = extraCases('voc-languages-more.md', 'L3');
const cncfExtra = extraCases('voc-cncf-extra.md', 'C2');
const cncfProjectExtra = extraCases('voc-cncf-projects-extra.md', 'C3');
const cncfMore = extraCases('voc-cncf-more.md', 'C4');
const frameworkExtra = extraCases('voc-frameworks-extra.md', 'F2');
const frameworkMore = extraCases('voc-frameworks-more.md', 'F3');
const frameworkDeeper = extraCases('voc-frameworks-deeper.md', 'F4');
const topicSet = (cases) => new Set(cases.map(({ topic }) => topic));
const missing = (expected, actual) => [...expected].filter((name) => !actual.has(name));
const allExtra = [...languageExtra, ...languageMore, ...cncfExtra, ...cncfProjectExtra, ...cncfMore, ...frameworkExtra, ...frameworkMore, ...frameworkDeeper];
const ids = allExtra.map(({ id }) => id);
const problems = [];
for (const [prefix, cases] of [
  ['L2', languageExtra], ['L3', languageMore], ['C2', cncfExtra], ['C3', cncfProjectExtra],
  ['C4', cncfMore], ['F2', frameworkExtra], ['F3', frameworkMore], ['F4', frameworkDeeper],
]) {
  cases.forEach(({ id }, index) => {
    const expected = `${prefix}-${String(index + 1).padStart(3, '0')}`;
    if (id !== expected) problems.push(`사례 ID 순서: ${id}, 예상 ${expected}`);
  });
}
for (const [label, expected, actual] of [
  ['기존 언어', languageAtlas, languageVoc],
  ['추가 언어', languageAtlas, topicSet(languageExtra)],
  ['기존 CNCF 분야', cncfCategories, cncfVoc],
  ['추가 CNCF 분야', cncfCategories, topicSet(cncfExtra)],
  ['추가 프레임워크', frameworkAtlas, topicSet(frameworkExtra)],
]) {
  for (const name of missing(expected, actual)) problems.push(`${label} 누락: ${name}`);
  for (const name of missing(actual, expected)) problems.push(`${label} 미등록: ${name}`);
}
const projectNames = new Set([...read('public-data/cncf-projects.md').matchAll(/^- (.*?) — /gm)].map((match) => match[1]));
for (const { topic } of [...cncfProjectExtra, ...cncfMore]) {
  if (!projectNames.has(topic) && !(topic === 'OPA' && projectNames.has('Open Policy Agent (OPA)'))) problems.push(`CNCF 프로젝트 미등록: ${topic}`);
}
for (const { topic } of [...frameworkMore, ...frameworkDeeper]) if (!frameworkAtlas.has(topic)) problems.push(`프레임워크 미등록: ${topic}`);
for (const { topic } of languageMore) if (!languageAtlas.has(topic)) problems.push(`언어 미등록: ${topic}`);
if (new Set(ids).size !== ids.length) problems.push('중복 사례 ID');
const languageTotal = languageVoc.size + languageExtra.length + languageMore.length;
const cncfTotal = cncfVoc.size + cncfExtra.length + cncfProjectExtra.length + cncfMore.length;
const frameworkTotal = frameworkExtra.length + frameworkMore.length + frameworkDeeper.length;
for (const [label, count] of [['언어', languageTotal], ['CNCF', cncfTotal], ['프레임워크', frameworkTotal]]) {
  if (count < 100) problems.push(`${label} 사례 ${count}건: 영역별 최소 100건 필요`);
}
for (const [label, cases] of [['추가 언어', languageExtra], ['추가 CNCF 분야', cncfExtra], ['추가 프레임워크', frameworkExtra]]) {
  if (topicSet(cases).size !== cases.length) problems.push(`${label} 주제 중복`);
}
const report = {
  status: problems.length ? 'REVIEW_NEEDED' : 'CURRENT_LOCAL',
  indexedLanguages: languageAtlas.size,
  existingLanguageCases: languageVoc.size,
  additionalLanguageCases: languageExtra.length,
  furtherLanguageCases: languageMore.length,
  languageCasesTotal: languageTotal,
  cncfProjectSubcategories: cncfCategories.size,
  existingCncfCases: cncfVoc.size,
  additionalCncfCases: cncfExtra.length,
  additionalCncfProjectCases: cncfProjectExtra.length,
  furtherCncfProjectCases: cncfMore.length,
  cncfCasesTotal: cncfTotal,
  indexedFrameworks: frameworkAtlas.size,
  additionalFrameworkCases: frameworkExtra.length,
  furtherFrameworkCases: frameworkMore.length,
  deeperFrameworkCases: frameworkDeeper.length,
  frameworkCasesTotal: frameworkTotal,
  additionalCasesTotal: allExtra.length,
  cncfProjects: index.items.filter((item) => item.project).length,
  problems,
  meaning: 'Coverage, domain counts and unique IDs only. The cases are plausible diagnostic scenarios, not an exhaustive incident catalogue or proof that each remedy works in every version.',
};
console.log(JSON.stringify(report, null, 2));
if (problems.length) process.exit(1);
