#!/usr/bin/env node
// Verifies a running OpenViking service has readable and searchable imported resources.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const manifestBytes = readFileSync(path.join(root, 'openviking', 'manifest.json'));
const manifest = JSON.parse(manifestBytes.toString('utf8'));
const reportPath = path.join(root, 'openviking', 'native-verification.json');
const base = (process.env.OPENVIKING_URL || 'http://127.0.0.1:1933').replace(/\/$/, '');
const apiKey = process.env.OPENVIKING_API_KEY;
const headers = apiKey ? { 'X-API-Key': apiKey } : {};
const status = { checkedAt: new Date().toISOString(), endpoint: new URL(base).origin,
  virtualRoot: manifest.virtualRoot,
  manifestSha256: createHash('sha256').update(manifestBytes).digest('hex'),
  sampleVerificationOnly: true, state: 'UNAVAILABLE', readback: [], search: [] };
async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error('HTTP ' + response.status + ' at ' + new URL(url).pathname);
  return response.json();
}
try {
  await request(base + '/health');
  const selected = [
    manifest.files.find((item) => /\/L2-\d{3}\.md$/.test(item.path)),
    manifest.files.find((item) => /\/C3-\d{3}\.md$/.test(item.path)),
    manifest.files.find((item) => /\/F2-\d{3}\.md$/.test(item.path)),
  ];
  if (selected.some((item) => !item)) throw new Error('Missing sample case in manifest');
  for (const item of selected) {
    const uri = manifest.virtualRoot + item.path;
    const payload = await request(base + '/api/v1/content/read?uri=' + encodeURIComponent(uri));
    const body = typeof payload.result === 'string' ? payload.result : JSON.stringify(payload.result);
    const id = path.basename(item.path, '.md');
    if (!body.includes(id)) throw new Error('Readback does not contain ' + id);
    status.readback.push({ uri, id, matched: true });
  }
  for (const [area, query] of [
    ['languages', 'Python exception and memory error'],
    ['cncf', 'Kubernetes pod troubleshooting'],
    ['frameworks', 'React hydration failure'],
  ]) {
    const payload = await request(base + '/api/v1/search/find', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, target_uri: manifest.virtualRoot + area, limit: 5 }),
    });
    const matches = payload.result?.resources || [];
    if (!Array.isArray(matches) || matches.length === 0) throw new Error('No search result for ' + area);
    status.search.push({ area, count: matches.length });
  }
  status.state = 'VERIFIED_NATIVE_SAMPLE_READ_AND_SEARCH';
  writeFileSync(reportPath, JSON.stringify(status, null, 2) + '\n');
  console.log(JSON.stringify(status, null, 2));
} catch (error) {
  status.state = status.readback.length || status.search.length ? 'PARTIAL' : 'UNAVAILABLE';
  status.error = String(error?.message || error);
  console.log(JSON.stringify(status, null, 2));
  process.exitCode = 1;
}
