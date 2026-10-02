import { readFile, readdir, mkdir, writeFile as save } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.dirname(fileURLToPath(import.meta.url));
const mode = process.argv[2];
if (!["--build", "--check"].includes(mode) || process.argv.length !== 3)
  throw Error("Usage: node build-reviewed-knowledge.mjs --build | --check");
const hash = (x) => createHash("sha256").update(x).digest("hex");
let createdAt;
let previousManifest;
try {
  previousManifest = JSON.parse(
    await readFile(path.join(root, "llm-wiki/training/manifest.json"), "utf8"),
  );
  createdAt = previousManifest.createdAt;
} catch {
  createdAt = new Date().toISOString();
}
async function writeFile(file, data) {
  if (mode === "--check") {
    if (hash(await readFile(file)) !== hash(data))
      throw Error("Generated content differs: " + path.relative(root, file));
  } else {
    await mkdir(path.dirname(file), { recursive: true });
    await save(file, data);
  }
}
const rows = { train: [], eval: [] },
  documents = [];
const source = root + "/llm-wiki";
const groups = {
  "dapr118-resiliency-target-contracts.md": "dapr-resiliency-contracts",
  "dapr118-default-policy-precedence.md": "dapr-resiliency-contracts",
  "dapr118-policy-loading-restart-contracts.md": "dapr-resiliency-contracts",
  "clang-asan-memory-boundaries.md": "sanitizer-diagnostics",
  "clang-ubsan-integer-boundaries.md": "sanitizer-diagnostics",
  ...Object.fromEntries(
    [
      "django-atomic-oncommit-boundaries.md",
      "sqlalchemy20-session-state-boundaries.md",
      "python313-sqlite-transaction-contracts.md",
      "postgresql-isolation-retry-boundaries.md",
      "spring-transaction-proxy-boundaries.md",
      "spring-transaction-event-phase-contracts.md",
    ].map((n) => [n, "database-transaction-contracts"]),
  ),
};
const excludedIds = new Set(["SYN-CILIUM-CAPACITY-002"]);
for (const name of (await readdir(source))
  .filter((x) => x.endsWith(".md") && x !== "README.md")
  .sort()) {
  const data = await readFile(source + "/" + name, "utf8"),
    kind = data.match(/^Kind: (.+)$/m)?.[1]?.trim();
  if (!kind) throw Error("Missing kind " + name);
  if (
    ![
      "official-document-synthesis",
      "public-issue-report",
      "public-issue-report-not-locally-reproduced",
      "public-reported-issue-analysis",
    ].includes(kind)
  )
    throw Error("Unsupported reviewed kind " + name);
  const version = data.match(/^Version: (.+)$/m)?.[1]?.trim(),
    title = data.match(/^# (.+)$/m)?.[1]?.trim();
  const urls = [...data.matchAll(/^- (https:\/\/\S+)/gm)].map((x) => x[1]),
    splitGroup = groups[name] || urls[0] || name,
    split =
      parseInt(hash(splitGroup).slice(0, 8), 16) % 10 === 0 ? "eval" : "train";
  if (
    !version ||
    !title ||
    !urls.length ||
    !/^Verified: \d{4}-\d{2}-\d{2}$/m.test(data)
  )
    throw Error("Missing reviewed source metadata " + name);
  documents.push({
    sourceDocument: name,
    sourceDocumentSha256: hash(data),
    sourceUrls: urls,
    kind,
    version,
    title,
    text: data,
    split,
    splitGroup,
    modelWeightTrainingPerformed: false,
  });
  if (kind !== "official-document-synthesis") continue;
  for (const line of data.split(/\r?\n/).filter((x) => /^\| SYN-/.test(x))) {
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((x) => x.trim());
    if (cells.length !== 6 || cells.some((cell) => !cell))
      throw Error("Invalid scenario columns");
    const [id, symptom, evidence, hypothesis, action, validation] = cells;
    if (excludedIds.has(id)) continue;
    rows[split].push({
      id,
      kind: "official-document-derived-diagnostic-scenario",
      isActualReportedIncident: false,
      productionReproduced: false,
      sourceDocument: name,
      sourceDocumentSha256: hash(data),
      sourceUrls: urls,
      version,
      split,
      splitGroup,
      messages: [
        {
          role: "user",
          content:
            title +
            "\n적용 버전: " +
            version +
            "\n증상: " +
            symptom +
            "\n확인할 증거: " +
            evidence +
            "\n공식 문서의 적용 조건을 지키며 원인 가설, 조치, 해결 검증을 설명해 주세요.",
        },
        {
          role: "assistant",
          content:
            "원인 가설: " +
            hypothesis +
            "\n조치: " +
            action +
            "\n해결 검증: " +
            validation +
            "\n공식 문서에서 도출한 진단 시나리오이며, 실제 장애 해결이나 운영 재현을 확인한 사례는 아닙니다.",
        },
      ],
    });
  }
}
const pages = {
  train: new Set(rows.train.map((x) => x.sourceDocument)),
  eval: new Set(rows.eval.map((x) => x.sourceDocument)),
};
const ids = new Set(),
  messages = new Set();
for (const row of [...rows.train, ...rows.eval]) {
  if (ids.has(row.id) || messages.has(JSON.stringify(row.messages)))
    throw Error("Duplicate example");
  ids.add(row.id);
  messages.add(JSON.stringify(row.messages));
}
if ([...pages.train].some((x) => pages.eval.has(x))) throw Error("leakage");
const artifacts = [
  ...Object.entries(rows),
  ["reviewed-documents", documents],
].map(([s, r]) => [
  s + ".jsonl",
  r.map((x) => JSON.stringify(x)).join("\n") + "\n",
]);
const report = {
  status: "MODEL_NEUTRAL_SYNTHETIC_DATASET_PREPARED",
  createdAt: createdAt,
  trainExamples: rows.train.length,
  evalExamples: rows.eval.length,
  trainPages: pages.train.size,
  evalPages: pages.eval.size,
  reviewedDocuments: documents.length,
  pageSplitLeakage: false,
  semanticLeakageAudit:
    previousManifest?.semanticLeakageAudit ??
    "GLOBAL_SEMANTIC_COMPLETENESS_NOT_PROVEN",
  splitPolicy:
    "canonical-source URL with manually grouped sanitizer, database transaction and Dapr resiliency pages",
  semanticDuplicateExamplesExcluded: [...excludedIds],
  actualIncidentsIncluded: false,
  actualIssueDocumentsSeparate: documents.filter(
    (x) => x.kind !== "official-document-synthesis",
  ).length,
  modelWeightTrainingPerformed: false,
  files: artifacts.map(([name, data]) => ({ name, sha256: hash(data) })),
};
{
  const dir = root + "/llm-wiki/training";
  if (mode === "--build") await mkdir(dir, { recursive: true });
  for (const [name, data] of artifacts) {
    await writeFile(dir + "/" + name, data);
    if (hash(await readFile(dir + "/" + name)) !== hash(data))
      throw Error("readback");
  }
  await writeFile(
    dir + "/manifest.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify({ root, ...report, files: report.files.length }));
}

const target = path.join(
  root,
  "openviking/verified-synthesis/resources/verified-synthesis",
);
const names = (await readdir(path.join(root, "llm-wiki")))
  .filter((n) => n.endsWith(".md") && n !== "README.md")
  .sort();
const content = {
  ".abstract.md":
    "# 공식 원문을 검토한 진단 지식\n\n" +
    names.length +
    "개 페이지의 버전·가설·해결 검증. 전체 corpus 검토 또는 네이티브 저장 완료가 아니다.\n",
  ".overview.md":
    "# LLM-wiki 검토 페이지\n\n" +
    names.map((n) => "- [" + n + "](" + n + ")").join("\n") +
    "\n\n운영 재현과 네이티브 저장은 별도 확인한다.\n",
};
for (const n of names)
  content[n] = await readFile(path.join(root, "llm-wiki", n), "utf8");
const files = [];
for (const [n, b] of Object.entries(content)) {
  await writeFile(path.join(target, n), b);
  const rb = await readFile(path.join(target, n));
  if (hash(rb) !== hash(b)) throw Error("Readback failure");
  files.push({ path: n, sha256: hash(rb), bytes: rb.length });
}
await writeFile(
  path.join(root, "openviking/verified-synthesis/manifest.json"),
  JSON.stringify(
    {
      schemaVersion: 1,
      virtualRoot: "viking://resources/developer-knowledge/verified-synthesis/",
      source: "resources/verified-synthesis",
      files: files.sort((a, b) => a.path.localeCompare(b.path)),
      state: "PREPARED_NOT_NATIVE_IMPORTED",
      reviewedPages: names.length,
      reviewedOfficialPages: names.filter((n) =>
        content[n].includes("Kind: official-document-synthesis"),
      ).length,
      reviewedPublicIssuePages: names.filter(
        (n) =>
          content[n].includes("Kind: public-issue-report") ||
          content[n].includes("Kind: public-reported-issue-analysis"),
      ).length,
      operationalReproductionPerformed: false,
    },
    null,
    2,
  ) + "\n",
);

console.log(
  JSON.stringify({
    status: "PASS",
    mode,
    reviewedPages: names.length,
    nativeStorage: "UNAVAILABLE",
    modelWeightTrainingPerformed: false,
  }),
);
