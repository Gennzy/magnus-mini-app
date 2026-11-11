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
  "docs/adr/README.md",
  "docs/adr/ADR-TEMPLATE.md",
  "docs/adr/ADR-0001-telegram-mini-app-client.md",
  "docs/adr/ADR-0002-telegram-serverless-backend.md",
  "docs/adr/ADR-0003-single-academic-catalog.md",
  "docs/adr/ADR-0004-server-authoritative-student-records.md",
  "docs/adr/ADR-0005-server-side-ai-provider.md",
  "docs/KNOWN_ISSUES.md",
  "docs/ACADEMIC_STATUS_MODEL.md",
  "docs/LEARNING_ACTIVITY_MODEL.md",
  "docs/ASSESSMENT_AND_COMPLETION_POLICY.md",
  "docs/ASSESSMENT_POLICY.md",
  "docs/SUBSCRIPTION_AND_ACCESS_POLICY.md",
  "docs/CERTIFICATE_POLICY.md",
  "docs/work-packages/PROD-008.md",
  "docs/work-packages/PROD-009.md",
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
  ["missing ADR record fails", dir => rmSync(join(dir, "docs/adr/ADR-0003-single-academic-catalog.md")), false],
  ["missing known issues register fails", dir => rmSync(join(dir, "docs/KNOWN_ISSUES.md")), false],
  ["missing academic status model fails", dir => rmSync(join(dir, "docs/ACADEMIC_STATUS_MODEL.md")), false],
  ["missing learning activity model fails", dir => rmSync(join(dir, "docs/LEARNING_ACTIVITY_MODEL.md")), false],
  ["missing assessment and completion policy fails", dir => rmSync(join(dir, "docs/ASSESSMENT_AND_COMPLETION_POLICY.md")), false],
  ["missing grading and appeals policy fails", dir => rmSync(join(dir, "docs/ASSESSMENT_POLICY.md")), false],
  ["missing subscription and access policy fails", dir => rmSync(join(dir, "docs/SUBSCRIPTION_AND_ACCESS_POLICY.md")), false],
  ["missing certificate policy fails", dir => rmSync(join(dir, "docs/CERTIFICATE_POLICY.md")), false],
  ["certificate policy cannot claim state diploma", dir => {
    const path = join(dir, "docs/CERTIFICATE_POLICY.md");
    writeFileSync(path, readFileSync(path, "utf8").replace("не является государственным дипломом", "является государственным дипломом"));
  }, false],
  ["missing active work package document fails", dir => rmSync(join(dir, "docs/work-packages/PROD-009.md")), false],
  ["missing freeze policy concept fails", dir => {
    const path = join(dir, "docs/SUBSCRIPTION_AND_ACCESS_POLICY.md");
    writeFileSync(path, readFileSync(path, "utf8").replace("В текущем продукте пользовательской функции заморозки нет.", "Заморозка описана."));
  }, false],
  ["current planned WP cannot be marked done", dir => {
    const path = join(dir, "docs/work-packages/PROD-009.md");
    writeFileSync(path, readFileSync(path, "utf8").replace("- **Статус:** [~] In progress", "- **Статус:** [x] Done").replace("- **Статус:** [ ] Planned", "- **Статус:** [x] Done"));
  }, false],
  ["missing known issue record fails", dir => {
    const path = join(dir, "docs/KNOWN_ISSUES.md");
    writeFileSync(path, readFileSync(path, "utf8").replace("### BL-006 —", "### BL-XXX —"));
  }, false],
  ["missing required template section fails", dir => {
    const path = join(dir, "docs/WP_TEMPLATE.md");
    writeFileSync(path, readFileSync(path, "utf8").replace("## 7. План тестирования", "## 7. Тесты"));
  }, false],
  ["active WP cross-reference is not mistaken for a roadmap item", dir => {
    const path = join(dir, "docs/MASTER_ROADMAP.md");
    const roadmap = readFileSync(path, "utf8");
    const active = readFileSync(join(dir, "docs/PROJECT_STATE.md"), "utf8").match(/^\*\*Текущий WP: ([A-Z]+-\d+) —/m);
    assert.ok(active, "fixture must declare one active WP");
    const exactItem = new RegExp("^- \\[[ x~!]\] " + active[1] + "(?=\\s|—).*\\n?", "m");
    assert.match(roadmap, exactItem, "roadmap must contain the active WP item");
    writeFileSync(path, roadmap.replace(exactItem, ""));
  }, false],
  ["completed active WP fails consistency check", dir => {
    const statePath = join(dir, "docs/PROJECT_STATE.md");
    const roadmapPath = join(dir, "docs/MASTER_ROADMAP.md");
    const state = readFileSync(statePath, "utf8");
    const active = state.match(/^\*\*Текущий WP: ([A-Z]+-\d+) —/m);
    assert.ok(active, "fixture must declare one active WP");
    const pattern = new RegExp("^- \\[[ ~]\\] " + active[1] + "(?=\\s|—)", "m");
    const roadmap = readFileSync(roadmapPath, "utf8");
    assert.match(roadmap, pattern, "roadmap must contain active WP " + active[1]);
    writeFileSync(roadmapPath, roadmap.replace(pattern, "- [x] " + active[1]));
  }, false],
];

for (const [name, mutate, shouldPass] of cases) {
  const dir = fixture(mutate);
  try {
    const result = run(dir);
    assert.equal(result.status === 0, shouldPass, name + "\n" + result.stdout + "\n" + result.stderr);
    console.log("PASS: " + name);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

console.log("Documentation checker negative tests passed.");
