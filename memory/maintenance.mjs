#!/usr/bin/env node
// Offline integrity audit and optional, read-only public-source probe.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const mode = process.argv[2];
if (!['--audit', '--probe'].includes(mode)) {
  console.error('Usage: node maintenance.mjs --audit|--probe');
  process.exit(2);
}

const required = ['README.md', 'languages.md', 'language-atlas.md', 'framework-atlas.md', 'domain-atlas.md', 'data-distributed.md', 'security-tooling.md', 'coverage.md', 'react-deep-dive.md', 'spring-boot-deep-dive.md', 'cncf-deep-dive.md', 'voc-public.md', 'voc-languages.md', 'voc-cncf.md', 'check-voc-coverage.mjs', 'public-data/cncf-landscape.yml', 'public-data/cncf-landscape-index.json', 'public-data/cncf-projects.md', 'frameworks.md', 'algorithms.md', 'events.md', 'incidents.md', 'debugging.md', 'systems.md', 'github-code.md', 'code-patterns.md', 'maintenance.md', 'changes.md', 'sources.json'];
const problems = [];
for (const name of required) if (!existsSync(path.join(root, name))) problems.push(`missing: ${name}`);
const dataDir = path.join(root, 'public-data');
const markdown = readdirSync(root).filter((name) => name.endsWith('.md'))
  .concat(existsSync(dataDir) ? readdirSync(dataDir).filter((name) => name.endsWith('.md')).map((name) => path.join('public-data', name)) : []);
let localLinks = 0;
let externalLinks = 0;
for (const name of markdown) {
  const content = readFileSync(path.join(root, name), 'utf8');
  if (!content.startsWith('# ')) problems.push(`missing title: ${name}`);
  for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1].split('#')[0];
    if (/^https?:\/\//.test(target)) { externalLinks++; continue; }
    if (!target || target.startsWith('mailto:')) continue;
    localLinks++;
    const resolved = path.resolve(path.dirname(path.join(root, name)), decodeURIComponent(target));
    if (!resolved.startsWith(root + path.sep) || !existsSync(resolved)) problems.push(`broken link in ${name}: ${target}`);
  }
}
const sources = JSON.parse(readFileSync(path.join(root, 'sources.json'), 'utf8'));
const todayKst = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const ageDays = Math.floor((Date.parse(`${todayKst}T00:00:00Z`) - Date.parse(`${sources.checkedAt}T00:00:00Z`)) / 86400000);
if (!Number.isFinite(ageDays) || ageDays < 0) problems.push('invalid/future checkedAt in sources.json');
else if (ageDays > 30) problems.push(`source review due: ${ageDays} days old`);
const audit = { status: problems.length ? 'REVIEW_NEEDED' : 'CURRENT_LOCAL', pages: markdown.length, localLinks, externalLinks, sourceReviewAgeDays: ageDays, problems };
console.log(JSON.stringify(audit, null, 2));
if (mode === '--audit') process.exit(problems.length ? 1 : 0);

const previousPath = path.join(root, 'probe-report.json');
const previous = existsSync(previousPath) ? JSON.parse(readFileSync(previousPath, 'utf8')) : { repositories: [] };
const before = new Map(previous.repositories.map((record) => [record.repo, record]));
const headers = { 'User-Agent': 'offline-developer-wiki-maintenance', Accept: 'application/json' };
async function probe(url, json = false) {
  try {
    let response = await fetch(url, { method: 'GET', redirect: 'follow', headers, signal: AbortSignal.timeout(12000) });
    if (response.status >= 500 && response.status < 600) {
      await response.body?.cancel();
      await new Promise((resolve) => setTimeout(resolve, 400));
      response = await fetch(url, { method: 'GET', redirect: 'follow', headers, signal: AbortSignal.timeout(12000) });
    }
    const result = { status: response.status, finalUrl: response.url, rateLimitRemaining: response.headers.get('x-ratelimit-remaining') };
    if (json && response.ok) result.data = await response.json();
    else await response.body?.cancel();
    return result;
  } catch (error) { return { status: 'UNAVAILABLE', error: String(error?.message ?? error) }; }
}
async function mapLimited(items, fn, limit = 4) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  }));
  return results;
}
const documentation = await mapLimited(sources.documentation, async ({ topic, url }) => {
  const result = await probe(url);
  return { topic, url, status: result.status, finalUrl: result.finalUrl, error: result.error };
});
let apiRateLimited = false;
const repositories = await mapLimited(sources.repositories, async (repo) => {
  const result = apiRateLimited ? { status: 403, rateLimitRemaining: '0', error: 'GitHub API rate limit observed earlier in this run' } : await probe(`https://api.github.com/repos/${repo}`, true);
  if (result.status === 403 && result.rateLimitRemaining === '0') apiRateLimited = true;
  const prior = before.get(repo);
  const html = result.status === 403 ? await probe(`https://github.com/${repo}`) : null;
  const pushedAt = result.data?.pushed_at ?? prior?.pushedAt ?? null;
  return {
    repo,
    status: html?.status ?? result.status,
    metadataStatus: result.status,
    rateLimited: result.status === 403 && result.rateLimitRemaining === '0',
    defaultBranch: result.data?.default_branch ?? prior?.defaultBranch ?? null,
    pushedAt,
    metadataFresh: result.status === 200,
    changedSinceLastProbe: Boolean(result.status === 200 && pushedAt && prior?.pushedAt && pushedAt !== prior.pushedAt),
    error: result.error ?? html?.error,
  };
});
const report = {
  probedAt: new Date().toISOString(),
  meaning: 'Connectivity and repository activity only; page claims and code behavior require human/source review. GitHub HTML fallback confirms a repository page, but does not provide fresh metadata.',
  documentation,
  repositories,
};
writeFileSync(previousPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ probeReport: previousPath, reachableDocs: documentation.filter((x) => Number(x.status) >= 200 && Number(x.status) < 400).length, docs: documentation.length, reachableRepositories: repositories.filter((x) => x.status === 200).length, repositories: repositories.length, freshRepositoryMetadata: repositories.filter((x) => x.metadataFresh).length, rateLimitedRepositories: repositories.filter((x) => x.rateLimited).length, changedRepositories: repositories.filter((x) => x.changedSinceLastProbe).map((x) => x.repo) }, null, 2));
