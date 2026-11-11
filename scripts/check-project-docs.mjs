import { existsSync, readFileSync } from "node:fs";

const requiredFiles = ["docs/MASTER_ROADMAP.md", "docs/PROJECT_STATE.md"];
const errors = [];

for (const file of requiredFiles) {
  if (!existsSync(file)) errors.push(`Missing required project document: ${file}`);
}
if (errors.length) {
  console.error("Project documentation check failed:");
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

const roadmap = readFileSync(requiredFiles[0], "utf8");
const state = readFileSync(requiredFiles[1], "utf8");
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const workflow = readFileSync(".github/workflows/visual-check.yml", "utf8");

const requireText = (text, pattern, label) => {
  if (!pattern.test(text)) errors.push(label);
};

requireText(roadmap, /^# MAGNUS — главная карта разработки/m, "MASTER_ROADMAP has no project title");
requireText(roadmap, /^## 1\. Жёсткие правила разработки/m, "MASTER_ROADMAP is missing development rules");
requireText(roadmap, /^# 3\. Полная карта разработки/m, "MASTER_ROADMAP is missing the full roadmap");
requireText(state, /^# MAGNUS — текущее состояние проекта/m, "PROJECT_STATE has no project title");
requireText(state, /^## 1\. Общая информация/m, "PROJECT_STATE is missing project metadata");
requireText(state, /^## 2\. Текущий HEAD и публикация/m, "PROJECT_STATE is missing release/HEAD tracking");
requireText(state, /^## 5\. Текущая активная задача/m, "PROJECT_STATE is missing the active work package section");
requireText(state, /magnus-source-upload/, "PROJECT_STATE does not identify the working branch");
requireText(state, /docs\/MASTER_ROADMAP\.md/, "PROJECT_STATE does not point to the master roadmap");

const activeMatch = state.match(/^\*\*Текущий WP: ([A-Z]+-\d+) —/m);
if (!activeMatch) {
  errors.push("PROJECT_STATE must declare exactly one active WP using '**Текущий WP: ID — ...**'");
} else {
  const activeId = activeMatch[1];
  const roadmapLine = roadmap.split("\n").find(line => line.includes(activeId) && /^- \[[ x~!]\]/.test(line));
  if (!roadmapLine) errors.push(`Active WP ${activeId} is missing from MASTER_ROADMAP`);
  else if (!roadmapLine.startsWith("- [ ]") && !roadmapLine.startsWith("- [~]")) {
    errors.push(`Active WP ${activeId} is marked complete/blocked in MASTER_ROADMAP: ${roadmapLine}`);
  }
}

requireText(packageJson.scripts?.["check:docs"] || "", /check-project-docs\.mjs/, "package.json is missing the check:docs script");
requireText(workflow, /docs\/\*\*/, "Visual CI does not run when project documentation changes");
requireText(workflow, /check-project-docs\.mjs/, "Visual CI does not run when the documentation checker changes");
requireText(workflow, /npm run check:docs/, "Visual CI does not execute the documentation checker");

if (errors.length) {
  console.error("Project documentation check failed:");
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}
console.log("Project documentation check passed: required files, structure, active WP and roadmap status are consistent.");
