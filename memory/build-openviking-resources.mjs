#!/usr/bin/env node
// Rebuilds a deterministic, reviewable OpenViking resource seed from this public wiki.
// Native OpenViking indexing is a separate step and must be verified through the server.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const wiki = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(wiki, 'openviking', 'resources', 'developer-knowledge');
const manifestPath = path.join(wiki, 'openviking', 'manifest.json');
const mode = process.argv[2];
if (!['--build', '--check'].includes(mode)) {
  console.error('Usage: node build-openviking-resources.mjs --build|--check');
  process.exit(2);
}
const read = (name) => readFileSync(path.join(wiki, name), 'utf8');
const hash = (value) => createHash('sha256').update(value).digest('hex');
const quoted = (value) => JSON.stringify(String(value));
const slug = (value) => {
  const stem = value.toLowerCase().replace(/\+\+/g, '-plus-plus').replace(/#/g, '-sharp')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'topic';
  return stem + '-' + hash(value).slice(0, 6);
};
const files = new Map();
const add = (relative, content) => {
  if (relative.startsWith('/') || relative.split('/').includes('..')) throw new Error('Unsafe generated path: ' + relative);
  if (files.has(relative)) throw new Error('Duplicate generated path: ' + relative);
  files.set(relative, content.replace(/\r\n/g, '\n').trimEnd() + '\n');
};
const cells = (line) => line.startsWith('|') && line.endsWith('|')
  ? line.slice(1, -1).split('|').map((value) => value.trim())
  : [];
const links = (value) => [...value.matchAll(/\[[^\]]+\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);
const languageAtlas = new Map();
for (const line of read('language-atlas.md').split(/\r?\n/)) {
  const row = cells(line);
  if (row.length === 3 && row[0] !== '언어' && row[0] !== '---') {
    const url = links(row[2])[0];
    if (url) languageAtlas.set(row[0], url);
  }
}
const landscape = JSON.parse(read('public-data/cncf-landscape-index.json'));
const cncfCategories = new Set(landscape.items.filter((item) => item.project)
  .map((item) => item.category + ' / ' + item.subcategory));
const cases = [];
const upstreamFixedIssue = new Map([
  ['F4-021', 'https://github.com/react/react/issues/35821'],
  ['F4-022', 'https://github.com/spring-projects/spring-boot/issues/51365'],
]);
function addCase({ id, area, topic, symptom, diagnosis, sourceUrl, sourceFile, line }) {
  if (!sourceUrl?.startsWith('https://')) throw new Error('Missing HTTPS source for ' + id);
  const group = area === 'cncf-category' ? 'cncf/categories' :
    area === 'cncf-project' ? 'cncf/projects' : area;
  const relative = group + '/' + slug(topic) + '/' + id + '.md';
  const issueUrl = upstreamFixedIssue.get(id);
  const body = [
    '---',
    'id: ' + quoted(id),
    'kind: ' + (issueUrl ? 'public-upstream-issue' : 'diagnostic-scenario'),
    'status: ' + (issueUrl ? 'upstream-fix-documented-not-locally-reproduced' : 'hypothesis'),
    'topic: ' + quoted(topic),
    'source_url: ' + quoted(sourceUrl),
    ...(issueUrl ? ['issue_url: ' + quoted(issueUrl)] : []),
    'source_access: not_rechecked_for_this_export',
    'origin: ' + quoted(sourceFile + ':' + line),
    '---',
    '# ' + id + ' · ' + topic,
    '',
    issueUrl ? '공개 프로젝트 이슈와 릴리스에 수정 이력이 있다. 이 환경에서 재현·해결을 별도로 검증하지 않았다.' :
      '이 항목은 가능한 장애 시나리오다. 실제 접수나 해결 완료를 의미하지 않는다.',
    '',
    '## 증상과 증거',
    '',
    symptom,
    '',
    '## 원인 가설, 조치와 검증',
    '',
    diagnosis,
    '',
    '## 공식 확인 입구',
    '',
    '- ' + sourceUrl,
    '- 출처 위키: ' + sourceFile + ' ' + line + '행',
    '- 재검증: 이 내보내기에서는 링크 접근과 제품 버전별 재현을 새로 확인하지 않음.',
  ].join('\n');
  add(relative, body);
  cases.push({ id, area, topic, relative, sourceUrl, origin: sourceFile + ':' + line });
}
function legacyCases(file, area, allowed, prefix, sourceFor) {
  let count = 0;
  read(file).split(/\r?\n/).forEach((line, index) => {
    const row = cells(line);
    if (row.length !== 4 || !allowed.has(row[0])) return;
    const id = prefix + '-' + String(++count).padStart(3, '0');
    addCase({ id, area, topic: row[0], symptom: row[1] + '; 먼저 확인: ' + row[2],
      diagnosis: row[3], sourceUrl: sourceFor(row[0]), sourceFile: file, line: index + 1 });
  });
  return count;
}
const existingLanguageCases = legacyCases('voc-languages.md', 'languages', new Set(languageAtlas.keys()),
  'L1', (topic) => languageAtlas.get(topic));
const existingCncfCases = legacyCases('voc-cncf.md', 'cncf-category', cncfCategories,
  'C1', () => 'https://github.com/cncf/landscape');
const extraFiles = readdirSync(wiki).filter((name) => /^voc-(languages|cncf|frameworks).*\.md$/.test(name))
  .filter((name) => !['voc-languages.md', 'voc-cncf.md'].includes(name)).sort();
for (const file of extraFiles) {
  read(file).split(/\r?\n/).forEach((line, index) => {
    const row = cells(line);
    if (!/^[LCF]\d+-\d{3}$/.test(row[0] || '')) return;
    if (![4, 5].includes(row.length)) throw new Error('Unexpected table row in ' + file + ':' + (index + 1));
    const area = row[0][0] === 'L' ? 'languages' : row[0][0] === 'F' ? 'frameworks' :
      cncfCategories.has(row[1]) ? 'cncf-category' : 'cncf-project';
    const sourceUrl = links(row.at(-1))[0] ||
      (area === 'cncf-category' ? 'https://github.com/cncf/landscape' : null);
    const symptom = row.length === 5 ? row[2] : row[2].split('→')[0].trim();
    const diagnosis = row.length === 5 ? row[3] : row[2].split('→').slice(1).join('→').trim();
    if (!symptom || !diagnosis) throw new Error('Missing diagnostic content in ' + file + ':' + (index + 1));
    addCase({ id: row[0], area, topic: row[1], symptom, diagnosis,
      sourceUrl, sourceFile: file, line: index + 1 });
  });
}
const caseIds = cases.map((item) => item.id);
if (cases.length < 370 || new Set(caseIds).size !== caseIds.length ||
  existingLanguageCases !== 55 || existingCncfCases !== 27) {
  throw new Error('Unexpected case coverage: ' + cases.length + ', ' + existingLanguageCases + ', ' + existingCncfCases);
}
const conceptPages = [
  'languages.md', 'language-atlas.md', 'frameworks.md', 'framework-atlas.md',
  'domain-atlas.md', 'data-distributed.md', 'security-tooling.md', 'react-deep-dive.md',
  'spring-boot-deep-dive.md', 'cncf-deep-dive.md', 'algorithms.md', 'events.md',
  'incidents.md', 'debugging.md', 'systems.md', 'github-code.md', 'code-patterns.md',
  'voc-public.md',
];
for (const name of conceptPages) {
  add('guides/' + name, [
    '---',
    'kind: curated-guide',
    'origin: ' + quoted(name),
    'source_access: see_document_links',
    '---',
    read(name).trimEnd(),
  ].join('\n'));
}
for (const [index, item] of landscape.items.entries()) {
  const group = 'cncf/landscape/' + slug(item.category) + '/' + slug(item.subcategory);
  const relative = group + '/' + slug(item.name) + '.md';
  add(relative, [
    '---',
    'kind: cncf-landscape-entry',
    'name: ' + quoted(item.name),
    'category: ' + quoted(item.category),
    'subcategory: ' + quoted(item.subcategory),
    'cncf_project: ' + Boolean(item.project),
    'snapshot_commit: ' + quoted(landscape.commit),
    'license: ' + quoted(landscape.license),
    '---',
    '# ' + item.name,
    '',
    '- 분류: ' + item.category + ' / ' + item.subcategory,
    '- CNCF 프로젝트: ' + (item.project ? '예 (' + item.project + ')' : '아니오; Landscape 생태계 항목'),
    '- 홈페이지: ' + (item.homepage_url || '미기재'),
    '- 코드 저장소: ' + (item.repo_url || '미기재'),
    '- Landscape 출처: ' + landscape.sourceUrl,
    '- 고정 커밋: ' + landscape.commit,
    '- 원본 색인 순번: ' + (index + 1),
    '',
    '이 페이지는 고정 Landscape의 메타데이터 색인이다. 제품 문서의 상세 기능이나 장애 해결을 검증한 페이지가 아니다.',
  ].join('\n'));
}
const sources = new Map();
for (const item of cases) {
  if (!sources.has(item.sourceUrl)) sources.set(item.sourceUrl, new Set());
  sources.get(item.sourceUrl).add(item.id);
}
add('sources/catalog.md', [
  '# 사례 공식 확인 입구',
  '',
  '아래 URL은 사례의 확인 출발점이다. 이 내보내기에서 모든 URL의 접근성과 최신 내용을 새로 검증하지 않았다.',
  '',
  '| URL | 연결된 사례 ID |',
  '|---|---|',
  ...[...sources].sort(([a], [b]) => a.localeCompare(b))
    .map(([url, ids]) => '| ' + url + ' | ' + [...ids].sort().join(', ') + ' |'),
].join('\n'));

const basePaths = [...files.keys()];
const directories = new Set(['']);
for (const relative of basePaths) {
  const parts = relative.split('/');
  for (let i = 1; i < parts.length; i++) directories.add(parts.slice(0, i).join('/'));
}
const labelFor = (relative) => {
  if (!relative) return '범용 개발 지식';
  const topic = cases.find((item) => relative.endsWith('/' + slug(item.topic)));
  if (topic) return topic.topic;
  const landscapeItem = landscape.items.find((item) =>
    relative.endsWith('/' + slug(item.category)) || relative.endsWith('/' + slug(item.subcategory)));
  if (landscapeItem) return relative.endsWith('/' + slug(landscapeItem.subcategory))
    ? landscapeItem.subcategory : landscapeItem.category;
  return relative.split('/').at(-1).replaceAll('-', ' ');
};
for (const relative of [...directories].sort()) {
  const prefix = relative ? relative + '/' : '';
  const descendants = basePaths.filter((name) => name.startsWith(prefix));
  const childDirs = [...directories].filter((dir) => dir && path.posix.dirname(dir) === (relative || '.'))
    .sort().slice(0, 24);
  const childFiles = basePaths.filter((name) => path.posix.dirname(name) === (relative || '.'))
    .sort().slice(0, 24);
  const label = labelFor(relative);
  const uri = 'viking://resources/developer-knowledge/' + prefix;
  const abstract = label + '의 공개 개발 지식 ' + descendants.length + '개 상세 자료를 찾는 디렉터리. 사례는 가설이며 출처와 버전을 재검증한다.';
  if (abstract.length > 256) throw new Error('L0 too long: ' + relative);
  const frontmatter = '---\ndirectory: ' + quoted(uri) + '\n---\n';
  add(prefix + '.abstract.md', frontmatter + abstract);
  add(prefix + '.overview.md', frontmatter + [
    '# ' + label,
    '',
    abstract,
    '',
    '## 바로 찾기',
    '',
    ...childDirs.map((dir) => '- ' + dir.slice(prefix.length) + '/'),
    ...childFiles.map((file) => '- ' + file.slice(prefix.length)),
    '',
    '총 상세 자료: ' + descendants.length + '개. 목록이 길면 하위 디렉터리에서 검색한다.',
  ].join('\n'));
}
const inventory = [...files].sort(([a], [b]) => a.localeCompare(b))
  .map(([relative, content]) => ({ path: relative, sha256: hash(content), bytes: Buffer.byteLength(content) }));
const manifest = {
  schemaVersion: 1,
  virtualRoot: 'viking://resources/developer-knowledge/',
  note: 'Deterministic OpenViking resource seed. Native server import, vectorization and semantic generation are separate and unverified until server readback.',
  sourceSnapshot: { cncfCommit: landscape.commit, cncfSha256: landscape.sha256 },
  counts: {
    cases: cases.length,
    languages: cases.filter((item) => item.area === 'languages').length,
    cncf: cases.filter((item) => item.area.startsWith('cncf-')).length,
    frameworks: cases.filter((item) => item.area === 'frameworks').length,
    landscape: landscape.items.length,
    cncfProjects: landscape.items.filter((item) => item.project).length,
    guides: conceptPages.length,
    uniqueCaseSourceUrls: sources.size,
    directories: directories.size,
    files: inventory.length,
  },
  files: inventory,
};
if (mode === '--build') {
  const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : { files: [] };
  const expected = new Set(files.keys());
  for (const record of previous.files || []) {
    if (expected.has(record.path)) continue;
    const target = path.resolve(output, record.path);
    if (!target.startsWith(path.resolve(output) + path.sep)) throw new Error('Unsafe previous manifest path');
    if (existsSync(target)) unlinkSync(target);
  }
  for (const [relative, content] of files) {
    const target = path.join(output, relative);
    mkdirSync(path.dirname(target), { recursive: true });
    if (!existsSync(target) || readFileSync(target, 'utf8') !== content) writeFileSync(target, content);
  }
  mkdirSync(path.dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
} else {
  if (!existsSync(manifestPath)) throw new Error('Missing OpenViking manifest');
  const saved = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (JSON.stringify(saved) !== JSON.stringify(manifest)) throw new Error('Manifest differs from current sources');
  for (const record of inventory) {
    const target = path.join(output, record.path);
    if (!existsSync(target) || hash(readFileSync(target)) !== record.sha256) {
      throw new Error('Missing or modified resource: ' + record.path);
    }
  }
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(target);
      else if (entry.isFile()) {
        const relative = path.relative(output, target).replaceAll('\\', '/');
        if (!files.has(relative)) throw new Error('Unlisted resource: ' + relative);
      }
    }
  }
  walk(output);
}
console.log(JSON.stringify({ status: mode === '--build' ? 'BUILT_RESOURCE_SEED' : 'CURRENT_LOCAL',
  virtualRoot: manifest.virtualRoot, ...manifest.counts,
  nativeOpenVikingIndexed: false }, null, 2));
