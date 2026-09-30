#!/usr/bin/env node
// Finish a native import only after OpenViking's persisted task reports success.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'memory', 'openviking');
const reportPath = path.join(root, 'native-import-report.json');
const manifestBytes = readFileSync(path.join(root, 'manifest.json'));
const report = JSON.parse(readFileSync(reportPath, 'utf8'));
const currentHash = createHash('sha256').update(manifestBytes).digest('hex');
if (report.manifestSha256 !== currentHash) throw new Error('Source manifest changed since the native import');
if (report.state === 'IMPORT_COMPLETED_AWAITING_READBACK') {
  console.log('Import task completed; readback verification is still required.');
  process.exit(0);
}
if (report.state !== 'IMPORT_QUEUED' || !report.taskId) throw new Error('No queued import task in report');
const base = (process.env.OPENVIKING_URL || 'http://127.0.0.1:1933').replace(/\/$/, '');
const headers = process.env.OPENVIKING_API_KEY ? { 'X-API-Key': process.env.OPENVIKING_API_KEY } : {};
const response = await fetch(base + '/api/v1/tasks/' + encodeURIComponent(report.taskId), {
  headers, signal: AbortSignal.timeout(30000),
});
if (!response.ok) throw new Error('Task API returned HTTP ' + response.status);
const payload = await response.json();
const task = payload.result;
if (!task || task.task_id !== report.taskId) throw new Error('Task API returned the wrong task');
if (['pending', 'running', 'cancelling'].includes(task.status)) {
  console.log(JSON.stringify({ state: 'IMPORT_QUEUED', taskId: report.taskId,
    taskStatus: task.status, stage: task.stage || null }));
  process.exit(0);
}
const result = task.result || {};
const queueErrors = Object.values(result.queue_status || {}).reduce((sum, value) =>
  sum + (value && typeof value === 'object' ? value.error_count || 0 : 0), 0);
if (task.status !== 'completed' || result.status !== 'success' ||
    result.root_uri?.replace(/\/$/, '') !== report.virtualRoot.replace(/\/$/, '') || queueErrors ||
    (result.meta?.failed_files || []).length) {
  report.state = 'IMPORT_FAILED';
  report.failure = { taskStatus: task.status, error: task.error || null,
    resultStatus: result.status || null, queueErrors };
  writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  throw new Error('Native import task failed; inspect native-import-report.json');
}
report.state = 'IMPORT_COMPLETED_AWAITING_READBACK';
report.completedAt = new Date().toISOString();
report.queueStatus = result.queue_status || {};
report.contextCount = result.context_count ?? null;
report.skippedFiles = (result.meta?.skipped_files || []).length;
report.failedFiles = [];
writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ state: report.state, taskId: report.taskId,
  contextCount: report.contextCount }));
