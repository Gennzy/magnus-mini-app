import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const checker = resolve(root, "scripts/check-project-docs.mjs");
const sourceFiles = [
  "docs/MASTER_ROADMAP.md",
  "docs/PROJECT_STATE.md",
  "docs/WP_TEMPLATE.md",
  "package.json",
  ".github/workflows/visual-check.yml",
];

function fixture(mutator) {
  const dir = mkdtempSync(join(tmpdir(), "magnus-docs-check-"));
  for (const path of sourceFiles) {
    const target = join(dir, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, readFileSync(join(root, path)));
  }
  mutator?.(dir);
  return dir;
}

function run(dir) {
  return spawnSync(process.execPath, [checker, dir], { encoding: "utf8" });
}

const cases = [
  ["valid documentation passes", dir => {}, true],
  ["missing template fails", dir => rmSync(join(dir, "docs/WP_TEMPLATE.md")), false],
  ["missing required template section fails", dir => {
    const path = join(dir, "docs/WP_TEMPLATE.md");
    writeFileSync(path, readFileSync(path, "utf8").replace("## 7. План тестирования", "## 7. Тесты"));
  }, false],
  ["completed active WP fails consistency check", dir => {
    const path = join(dir, "docs/MASTER_ROADMAP.md");
    writeFileSync(path, readFileSync(path, "utf8").replace("- [~] GOV-005", "- [x] GOV-005"));
  }, false],
];

for (const [name, mutate, shouldPass] of cases) {
  const dir = fixture(mutate);
  try {
    const result = run(dir);
    assert.equal(result.status === 0, shouldPass, `${name}\n${result.stdout}\n${result.stderr}`);
    console.log(`PASS: ${name}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

console.log("Documentation checker negative tests passed.");
