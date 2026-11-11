import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.argv[2] || process.cwd());
const filePath = path => resolve(root, path);

const requiredFiles = ["docs/MASTER_ROADMAP.md", "docs/PROJECT_STATE.md", "docs/WP_TEMPLATE.md", "docs/adr/README.md", "docs/adr/ADR-TEMPLATE.md", "docs/adr/ADR-0001-telegram-mini-app-client.md", "docs/adr/ADR-0002-telegram-serverless-backend.md", "docs/adr/ADR-0003-single-academic-catalog.md", "docs/adr/ADR-0004-server-authoritative-student-records.md", "docs/adr/ADR-0005-server-side-ai-provider.md", "docs/KNOWN_ISSUES.md", "docs/ACADEMIC_STATUS_MODEL.md", "docs/LEARNING_ACTIVITY_MODEL.md", "docs/ASSESSMENT_AND_COMPLETION_POLICY.md", "docs/ASSESSMENT_POLICY.md", "docs/SUBSCRIPTION_AND_ACCESS_POLICY.md", "docs/CERTIFICATE_POLICY.md"];
const errors = [];

for (const file of requiredFiles) {
  if (!existsSync(filePath(file))) errors.push(`Missing required project document: ${file}`);
}
if (errors.length) {
  console.error("Project documentation check failed:");
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

const roadmap = readFileSync(filePath(requiredFiles[0]), "utf8");
const state = readFileSync(filePath(requiredFiles[1]), "utf8");
const packageJson = JSON.parse(readFileSync(filePath("package.json"), "utf8"));
const template = readFileSync(filePath("docs/WP_TEMPLATE.md"), "utf8");
const workflow = readFileSync(filePath(".github/workflows/visual-check.yml"), "utf8");
const adrIndex = readFileSync(filePath("docs/adr/README.md"), "utf8");
const knownIssues = readFileSync(filePath("docs/KNOWN_ISSUES.md"), "utf8");
const academicStatusModel = readFileSync(filePath("docs/ACADEMIC_STATUS_MODEL.md"), "utf8");
const learningActivityModel = readFileSync(filePath("docs/LEARNING_ACTIVITY_MODEL.md"), "utf8");
const assessmentPolicy = readFileSync(filePath("docs/ASSESSMENT_AND_COMPLETION_POLICY.md"), "utf8");
const gradingPolicy = readFileSync(filePath("docs/ASSESSMENT_POLICY.md"), "utf8");
const subscriptionPolicy = readFileSync(filePath("docs/SUBSCRIPTION_AND_ACCESS_POLICY.md"), "utf8");
const certificatePolicy = readFileSync(filePath("docs/CERTIFICATE_POLICY.md"), "utf8");
const adrTemplate = readFileSync(filePath("docs/adr/ADR-TEMPLATE.md"), "utf8");

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

if (!template.startsWith("# Шаблон Work Package (WP)")) errors.push("WP_TEMPLATE has no title");
for (const section of [
  "Идентификация",
  "Цель и ожидаемый результат",
  "Контекст и текущее состояние",
  "Границы",
  "Зависимости и блокеры",
  "Затрагиваемые файлы и области",
  "Критерии приёмки",
  "План тестирования",
  "Публикация и проверка после публикации",
  "Риски и план отката",
  "Закрытие WP",
]) {
  if (!template.includes(section)) errors.push(`WP_TEMPLATE is missing section: ${section}`);
}
if (!roadmap.includes("docs/WP_TEMPLATE.md")) errors.push("MASTER_ROADMAP does not require the WP template");

if (!adrIndex.startsWith("# Архитектурные решения MAGNUS (ADR)")) errors.push("ADR index has no title");
if (!adrIndex.includes("ADR-TEMPLATE.md")) errors.push("ADR index does not link to the ADR template");
for (const id of ["ADR-0001", "ADR-0002", "ADR-0003", "ADR-0004", "ADR-0005"]) {
  if (!adrIndex.includes(id)) errors.push(`ADR index is missing ${id}`);
}
for (const section of ["Контекст", "Решение", "Рассмотренные альтернативы", "Последствия", "Подтверждение"]) {
  if (!adrTemplate.includes(section)) errors.push(`ADR template is missing section: ${section}`);
}

if (!knownIssues.startsWith("# Реестр известных дефектов и технического долга MAGNUS")) errors.push("Known issues register has no title");
for (const id of ["BL-001", "BL-002", "BL-003", "BL-004", "BL-005", "BL-006", "BL-007", "BL-008", "BL-009"]) {
  if (!knownIssues.includes(`### ${id} —`)) errors.push(`Known issues register is missing ${id}`);
}
for (const field of ["Категория", "Приоритет / статус", "Влияние", "Подтверждение", "Следующий шаг", "Закрытие"]) {
  if (!knownIssues.includes(`**${field}:**`)) errors.push(`Known issues register is missing required field: ${field}`);
}
if (!roadmap.includes("docs/KNOWN_ISSUES.md")) errors.push("MASTER_ROADMAP does not link to the known issues register");
if (!roadmap.includes("docs/ACADEMIC_STATUS_MODEL.md")) errors.push("MASTER_ROADMAP does not link to the academic status model");
if (!roadmap.includes("docs/LEARNING_ACTIVITY_MODEL.md")) errors.push("MASTER_ROADMAP does not link to the learning activity model");
if (!roadmap.includes("docs/ASSESSMENT_AND_COMPLETION_POLICY.md")) errors.push("MASTER_ROADMAP does not link to the assessment and completion policy");
if (!roadmap.includes("docs/ASSESSMENT_POLICY.md")) errors.push("MASTER_ROADMAP does not link to the grading and appeals policy");
for (const section of ["## 1. Принципы оценивания", "## 2. Практическая работа занятия", "## 4. Итоговая аттестация программы", "## 6. Апелляции и исправление ошибок", "## 7. История оценивания и аудит"]) {
  if (!gradingPolicy.includes(section)) errors.push(`ASSESSMENT_POLICY is missing section: ${section}`);
}
for (const required of ["4 из 6", "70%", "3 стандартные попытки", "7 календарных дней", "voided"]) {
  if (!gradingPolicy.includes(required)) errors.push(`ASSESSMENT_POLICY is missing policy requirement: ${required}`);
}

for (const section of ["## 1. Основное решение", "## 2. Термины и уровни", "### 2.3. Зачёт дисциплины", "### 2.4. Завершение учебного блока", "### 2.5. Завершение образовательной программы", "## 4. Повторные попытки и сохранение результата", "## 6. Версия программы и исторические результаты", "## 10. Подтверждённые расхождения текущей реализации"]) {
  if (!assessmentPolicy.includes(section)) errors.push(`ASSESSMENT_AND_COMPLETION_POLICY is missing section: ${section}`);
}
for (const concept of ["Завершённое занятие", "Зачёт дисциплины", "Завершение учебного блока", "Завершение образовательной программы", "required: false", "PROD-007", "ACADEMIC_CATALOG_VERSION", "не аннулирует уже достигнутый зачёт"]) {
  if (!assessmentPolicy.includes(concept)) errors.push(`ASSESSMENT_AND_COMPLETION_POLICY is missing rule/concept: ${concept}`);
}
for (const section of ["## 1. Основное решение", "## 2. Что считается первым участием", "## 3. Что не считается учебной активностью", "## 5. Учебное событие и контракт журнала", "## 9. Негативные и пограничные правила"]) {
  if (!learningActivityModel.includes(section)) errors.push(`LEARNING_ACTIVITY_MODEL is missing section: ${section}`);
}
for (const event of ["practice_submitted", "lesson_completed", "final_exam_submitted", "firstAcademicActivityAt", "lastAcademicActivityAt"]) {
  if (!learningActivityModel.includes("`" + event + "`")) errors.push(`LEARNING_ACTIVITY_MODEL is missing event/field: ${event}`);
}

for (const section of ["## 1. Основное решение", "## 4. Статусы программы", "## 5. Матрица переходов", "## 10. Сопоставление с текущими данными"]) {
  if (!academicStatusModel.includes(section)) errors.push(`ACADEMIC_STATUS_MODEL is missing section: ${section}`);
}
for (const status of ["enrolled", "active", "academic_leave", "withdrawn", "expelled", "completed"]) {
  if (!academicStatusModel.includes("`" + status + "`")) errors.push(`ACADEMIC_STATUS_MODEL is missing status: ${status}`);
}


for (const section of ["## 1. Основное решение", "## 2. Срок действия, продление и отсутствие автосписания", "## 3. Заморозка и пауза", "## 4. Истечение срока и прекращение доступа", "## 5. Академический статус, прогресс и результаты", "## 6. Возвраты и спорные платежи", "## 9. Текущее состояние реализации и расхождения", "## 10. Обязательные требования для будущей реализации"]) {
  if (!subscriptionPolicy.includes(section)) errors.push("SUBSCRIPTION_AND_ACCESS_POLICY is missing section: " + section);
}
for (const concept of ["entitlement", "автоматического продления", "заморозки нет", "не удалять", "Возврат Stars не реализован", "BL-008", "BL-009", "академический статус"]) {
  if (!subscriptionPolicy.toLowerCase().includes(concept.toLowerCase())) errors.push("SUBSCRIPTION_AND_ACCESS_POLICY is missing rule/concept: " + concept);
}

if (!roadmap.includes("docs/CERTIFICATE_POLICY.md")) errors.push("MASTER_ROADMAP does not link to the certificate policy");
for (const section of ["## 1. Значение сертификата", "## 2. Что подтверждает сертификат", "## 4. Условия выдачи", "## 6. Публичная проверка и персональные данные", "## 8. Текущее состояние реализации и ограничения"]) {
  if (!certificatePolicy.includes(section)) errors.push("CERTIFICATE_POLICY is missing section: " + section);
}
for (const concept of ["внутренний документ", "не является государственным дипломом", "зачисление", "шесть занятий", "итоговый экзамен", "версия программы", "персональные данные", "не реализован", "MAGNUS University"]) {
  if (!certificatePolicy.toLowerCase().includes(concept.toLowerCase())) errors.push("CERTIFICATE_POLICY is missing rule/concept: " + concept);
}

const activeMatch = state.match(/^\*\*Текущий WP: ([A-Z]+-\d+) —/m);
if (!activeMatch) {
  errors.push("PROJECT_STATE must declare exactly one active WP using '**Текущий WP: ID — ...**'");
} else {
  const activeId = activeMatch[1];
  const activeWorkPackagePath = "docs/work-packages/" + activeId + ".md";
  if (!existsSync(filePath(activeWorkPackagePath))) {
    errors.push("Active WP document is missing: " + activeWorkPackagePath);
  } else {
    const activeWorkPackage = readFileSync(filePath(activeWorkPackagePath), "utf8");
    for (const section of ["## 1. Цель и ожидаемый результат", "## 3. Границы", "## 5. Затрагиваемые файлы и области", "## 6. Критерии приёмки", "## 7. План тестирования", "## 10. Закрытие WP"]) {
      if (!activeWorkPackage.includes(section)) errors.push(activeId + " WP is missing section: " + section);
    }
    if (!activeWorkPackage.includes("- **Статус:** [~] In progress") && !activeWorkPackage.includes("- **Статус:** [ ] Planned")) {
      errors.push("Current WP " + activeId + " must be Planned or In progress, not complete/blocked");
    }
  }
  const roadmapLine = roadmap.split("\n").find(line => line.match(/^- \[[ x~!]\]\s+([A-Z]+-\d+)(?=\s|—)/)?.[1] === activeId);
  if (!roadmapLine) errors.push("Active WP " + activeId + " is missing from MASTER_ROADMAP");
  else if (!roadmapLine.startsWith("- [ ]") && !roadmapLine.startsWith("- [~]")) {
    errors.push("Active WP " + activeId + " is marked complete/blocked in MASTER_ROADMAP: " + roadmapLine);
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
