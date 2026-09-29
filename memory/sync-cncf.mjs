#!/usr/bin/env node
// Refresh a pinned public CNCF Landscape data snapshot and a compact offline index.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(root, 'public-data');
const yamlPath = path.join(dataDir, 'cncf-landscape.yml');
const indexPath = path.join(dataDir, 'cncf-landscape-index.json');
const projectPath = path.join(dataDir, 'cncf-projects.md');
const mode = process.argv[2];
if (!['--refresh', '--check'].includes(mode)) {
  console.error('Usage: node sync-cncf.mjs --refresh|--check');
  process.exit(2);
}

function parseLandscape(source) {
  let category = null;
  let subcategory = null;
  let current = null;
  const items = [];
  for (const line of source.split(/\r?\n/)) {
    if (/^  - category:\s*$/.test(line)) { category = null; subcategory = null; current = null; continue; }
    if (/^    name: /.test(line)) { category = line.slice(10).trim(); continue; }
    if (/^      - subcategory:\s*$/.test(line)) { subcategory = null; current = null; continue; }
    if (/^        name: /.test(line)) { subcategory = line.slice(14).trim(); continue; }
    if (/^          - item:\s*$/.test(line)) {
      current = { category, subcategory };
      items.push(current);
      continue;
    }
    if (!current) continue;
    const match = line.match(/^            (name|homepage_url|repo_url|project):\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) value = value.slice(1, -1);
    current[match[1]] = value;
  }
  if (items.length < 300 || items.some((x) => !x.name || !x.category || !x.subcategory)) throw new Error('Unexpected landscape structure: incomplete item index');
  return items;
}

function verify() {
  if (!existsSync(yamlPath) || !existsSync(indexPath) || !existsSync(projectPath)) throw new Error('CNCF snapshot, index, or project list missing');
  const raw = readFileSync(yamlPath, 'utf8');
  const index = JSON.parse(readFileSync(indexPath, 'utf8'));
  const hash = createHash('sha256').update(raw).digest('hex');
  if (index.sha256 !== hash) throw new Error('CNCF snapshot hash mismatch');
  const parsed = parseLandscape(raw);
  if (parsed.length !== index.items.length) throw new Error('CNCF index count mismatch');
  for (let i = 0; i < parsed.length; i++) {
    if (JSON.stringify(parsed[i]) !== JSON.stringify(index.items[i])) throw new Error(`CNCF index differs at item ${i}`);
  }
  const projectCount = parsed.filter((x) => x.project).length;
  if (readFileSync(projectPath, 'utf8').split(/\r?\n/).filter((x) => /^- /.test(x)).length !== projectCount) throw new Error('CNCF project list count mismatch');
  const levels = Object.create(null);
  for (const item of parsed) levels[item.project || 'landscape-only'] = (levels[item.project || 'landscape-only'] || 0) + 1;
  console.log(JSON.stringify({ status: 'CURRENT_LOCAL', commit: index.commit, items: parsed.length, levels, sha256: hash }, null, 2));
}

if (mode === '--check') {
  verify();
} else {
  const remote = execFileSync('git', ['ls-remote', 'https://github.com/cncf/landscape.git', 'refs/heads/master'], { encoding: 'utf8', timeout: 30000 });
  const commit = remote.match(/^([0-9a-f]{40})\s/mi)?.[1];
  if (!commit) throw new Error('Could not resolve CNCF Landscape commit');
  if (existsSync(indexPath) && JSON.parse(readFileSync(indexPath, 'utf8')).commit === commit) {
    verify();
    console.log('UNCHANGED_SOURCE: CNCF Landscape commit is unchanged; snapshot was not rewritten.');
    process.exit(0);
  }
  const sourceUrl = `https://raw.githubusercontent.com/cncf/landscape/${commit}/landscape.yml`;
  const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`CNCF Landscape HTTP ${response.status}`);
  const raw = await response.text();
  const items = parseLandscape(raw);
  const sha256 = createHash('sha256').update(raw).digest('hex');
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(yamlPath, raw);
  writeFileSync(indexPath, JSON.stringify({ sourceUrl, commit, retrievedAt: new Date().toISOString(), sha256, license: 'CC BY 4.0; CNCF Landscape data. Logos and third-party enriched data are excluded from this snapshot.', meaning: 'Landscape ecosystem entries include CNCF projects and non-project products. A project field denotes the source maturity label, not a current independent audit.', items }, null, 2) + '\n');
  const lines = ['# CNCF 프로젝트 오프라인 목록', '', `공식 [CNCF Landscape](https://github.com/cncf/landscape)의 커밋 \`${commit}\`에서 생성. CC BY 4.0 출처 표기. 목록은 해당 커밋의 \`project\` 필드를 반영하며 새 상태는 [CNCF 프로젝트 목록](https://www.cncf.io/projects/)에서 재확인한다.`, '', 'Landscape 전체 항목은 `cncf-landscape-index.json`에 있으며 CNCF 프로젝트가 아닌 생태계 제품도 포함한다.', ''];
  let lastCategory = null;
  let lastSubcategory = null;
  for (const item of items.filter((x) => x.project)) {
    if (item.category !== lastCategory) { lines.push(`## ${item.category}`, ''); lastCategory = item.category; lastSubcategory = null; }
    if (item.subcategory !== lastSubcategory) { lines.push(`### ${item.subcategory}`, ''); lastSubcategory = item.subcategory; }
    lines.push(`- ${item.name} — ${item.project}${item.repo_url ? ` — ${item.repo_url}` : item.homepage_url ? ` — ${item.homepage_url}` : ''}`);
  }
  writeFileSync(projectPath, lines.join('\n') + '\n');
  verify();
}
