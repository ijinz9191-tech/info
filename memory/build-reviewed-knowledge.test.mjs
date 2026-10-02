import {
  mkdtemp,
  mkdir,
  copyFile,
  writeFile,
  readFile,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import test from "node:test";
test("portable rebuild preserves source dates, groups related pages and rejects corruption", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "reviewed-knowledge-"));
  try {
    await copyFile(
      fileURLToPath(new URL("./build-reviewed-knowledge.mjs", import.meta.url)),
      path.join(root, "build-reviewed-knowledge.mjs"),
    );
    await mkdir(path.join(root, "llm-wiki"));
    const page = (id) =>
      "# Diagnostic fixture " +
      id +
      "\nVersion: fixture 1\nKind: official-document-synthesis\nVerified: 2026-01-01\n\n- https://example.org/official\n\n| " +
      id +
      " | symptom | evidence | hypothesis | action | validation |\n";
    await writeFile(
      path.join(root, "llm-wiki/clang-asan-memory-boundaries.md"),
      page("SYN-FIXTURE-001"),
    );
    await writeFile(
      path.join(root, "llm-wiki/clang-ubsan-integer-boundaries.md"),
      page("SYN-FIXTURE-002"),
    );
    const run = (mode) =>
      spawnSync(
        process.execPath,
        [path.join(root, "build-reviewed-knowledge.mjs"), mode],
        { encoding: "utf8" },
      );
    const firstBuild = run("--build");
    assert.equal(firstBuild.status, 0, firstBuild.stderr);
    assert.equal(run("--check").status, 0);
    const manifest = JSON.parse(
      await readFile(
        path.join(root, "llm-wiki/training/manifest.json"),
        "utf8",
      ),
    );
    assert.equal(manifest.trainExamples + manifest.evalExamples, 2);
    assert.equal(manifest.modelWeightTrainingPerformed, false);
    const docs = (
      await readFile(
        path.join(root, "llm-wiki/training/reviewed-documents.jsonl"),
        "utf8",
      )
    )
      .trim()
      .split("\n")
      .map(JSON.parse);
    assert.equal(docs[0].split, docs[1].split);
    assert.equal(docs[0].splitGroup, "sanitizer-diagnostics");
    assert.ok(docs.every((d) => d.text.includes("Verified: 2026-01-01")));
    await writeFile(
      path.join(root, "llm-wiki/training/train.jsonl"),
      "corruption\n",
    );
    assert.notEqual(run("--check").status, 0);
    assert.equal(run("--build").status, 0);
    assert.equal(run("--check").status, 0);
    await writeFile(
      path.join(root, "llm-wiki/clang-ubsan-integer-boundaries.md"),
      page("SYN-FIXTURE-001"),
    );
    assert.notEqual(run("--build").status, 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
