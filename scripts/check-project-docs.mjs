import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "docs/MASTER_ROADMAP.md",
  "docs/PROJECT_STATE.md",
];

const errors = [];
for (const file of requiredFiles) {
  if (!existsSync(file)) errors.push(`Missing required project document: ${file}`);
}

if (errors.length) {
  console.error("Project documentation check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const roadmap = readFileSync("docs/MASTER_ROADMAP.md", "utf8");
const state = readFileSync("docs/PROJECT_STATE.md", "utf8");
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const workflow = readFileSync(".github/workflows/visual-check.yml", "utf8");

const requireText = (text, pattern, label) => {
  if (!pattern.test(text)) errors.push(label);
};

requireText(roadmap, /^# MAGNUS — главная карта разработки/m, "MASTER_ROADMAP has no project title");
requireText(roadmap, /^## 1\. Жёсткие правила разработки/m, "MASTER_ROADMAP is missing development rules");
requireText(roadmap, /^## 3\. Полная карта разработки/m, "MASTER_ROADMAP is missing the full roadmap");
requireText(state, /^# MAGNUS — текущее состояние проекта/m, "PROJECT_STATE has no project title");
requireText(state, /^## 1\. Общая информация/m, "PROJECT_STATE is missing project metadata");
requireText(state, /^## 2\. Текущий HEAD и публикация/m, "PROJECT_STATE is missing release/HEAD tracking");
requireText(state, /^## 5\. Текущая активная задача/m, "PROJECT_STATE is missing the active work package section");
requireText(state, /magnus-source-upload/, "PROJECT_STATE does not identify the working branch");
requireText(state, /docs\/MASTER_ROADMAP\.md/, "PROJECT_STATE does not link to the master roadmap");
requireText(state, /GOV-004/, "PROJECT_STATE does not identify the active GOV-004 work package");
requireText(roadmap, /GOV-004/, "MASTER_ROADMAP does not contain GOV-004");
requireText(packageJson.scripts?.["check:docs"] || "", /check-project-docs\.mjs/, "package.json is missing the check:docs script");
requireText(workflow, /docs\/\*\*/, "Visual CI does not run when project documentation changes");
requireText(workflow, /check-project-docs\.mjs/, "Visual CI does not run when the documentation checker changes");
requireText(workflow, /npm run check:docs/, "Visual CI does not execute the documentation checker");

if (errors.length) {
  console.error("Project documentation check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Project documentation check passed: required files, structure, active WP and CI wiring are present.");
