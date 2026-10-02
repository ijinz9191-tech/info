#!/usr/bin/env node
// Checks URL availability for the OpenViking resource seed. HTTP success is not claim validation.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.join(root, 'openviking', 'resources', 'developer-knowledge', 'sources', 'catalog.md');
const reportPath = path.join(root, 'openviking', 'source-probe-report.json');
const mode = process.argv[2];
if (!['--probe', '--check'].includes(mode)) {
  console.error('Usage: node probe-openviking-sources.mjs --probe|--check [--limit N]');
  process.exit(2);
}
const catalog = readFileSync(catalogPath, 'utf8');
const urls = [...catalog.matchAll(/^\| (https:\/\/[^| ]+) \|/gm)].map((match) => match[1]);
if (urls.length < 200 || new Set(urls).size !== urls.length) throw new Error('Source catalog unexpectedly small or duplicated');
const saved = existsSync(reportPath) ? JSON.parse(readFileSync(reportPath, 'utf8')) :
  { schemaVersion: 1, meaning: 'URL availability only; not a claim, version or solution verification.', results: [] };
const byUrl = new Map(saved.results.map((record) => [record.url, record]));
if (mode === '--probe') {
  const urlIndex = process.argv.indexOf('--url');
  const requestedUrl = urlIndex < 0 ? null : process.argv[urlIndex + 1];
  if (requestedUrl && !urls.includes(requestedUrl)) throw new Error('URL is not in source catalog');
  const limitIndex = process.argv.indexOf('--limit');
  const limit = limitIndex < 0 ? 50 : Number(process.argv[limitIndex + 1]);
  if (!Number.isInteger(limit) || limit < 1 || limit > urls.length) throw new Error('Invalid --limit');
  const sorted = (requestedUrl ? [requestedUrl] : urls).map((url) => ({ url, checkedAt: byUrl.get(url)?.checkedAt || '' }))
    .sort((a, b) => a.checkedAt.localeCompare(b.checkedAt) || a.url.localeCompare(b.url))
    .slice(0, limit);
  const results = new Array(sorted.length);
  let cursor = 0;
  async function worker() {
    while (cursor < sorted.length) {
      const index = cursor++;
      const url = sorted[index].url;
      try {
        let response = await fetch(url, {
          method: 'HEAD',
          redirect: 'follow',
          headers: { 'User-Agent': 'offline-developer-wiki-source-check/1.0' },
          signal: AbortSignal.timeout(10000),
        });
        if ([404, 405].includes(response.status)) {
          response = await fetch(url, {
            method: 'GET',
            redirect: 'follow',
            headers: { 'User-Agent': 'offline-developer-wiki-source-check/1.0' },
            signal: AbortSignal.timeout(10000),
          });
          await response.body?.cancel();
        }
        results[index] = {
          url, checkedAt: new Date().toISOString(), status: response.status, finalUrl: response.url,
          etag: response.headers.get('etag'), lastModified: response.headers.get('last-modified'),
        };
      } catch (error) {
        results[index] = { url, checkedAt: new Date().toISOString(), status: 'UNAVAILABLE',
          error: String(error?.message || error) };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(4, sorted.length) }, worker));
  for (const result of results) byUrl.set(result.url, result);
  saved.results = [...byUrl.values()].filter((record) => urls.includes(record.url))
    .sort((a, b) => a.url.localeCompare(b.url));
  saved.lastProbeAt = new Date().toISOString();
  writeFileSync(reportPath, JSON.stringify(saved, null, 2) + '\n');
}
const reachable = saved.results.filter((record) => Number(record.status) >= 200 && Number(record.status) < 400).length;
const blocked = saved.results.filter((record) => [401, 403, 429].includes(record.status)).length;
const unavailable = saved.results.filter((record) => record.status === 'UNAVAILABLE').length;
console.log(JSON.stringify({
  status: mode === '--probe' ? 'PROBED' : 'LOCAL_REPORT',
  sourceUrls: urls.length, checked: saved.results.length, reachable, blocked, unavailable,
  unchecked: urls.length - saved.results.length, meaning: saved.meaning,
}, null, 2));
