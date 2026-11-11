import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";

const baseUrl = "http://127.0.0.1:4173";
const artifacts = "artifacts";
await mkdir(artifacts, { recursive: true });

const server = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", "4173", "--strictPort"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) { ready = true; break; }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  if (!ready) throw new Error("Vite preview не запустился на порту 4173.");

  browser = await chromium.launch({ headless: true });
  const failures = [];
  const expectedStandaloneWarnings = [];

  async function testViewport(name, viewport) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    page.on("pageerror", error => {
      if (error.message.includes("WebAppServerlessInitDataUnavailable")) expectedStandaloneWarnings.push(`${name}: Telegram initData is unavailable outside Telegram`);
      else failures.push(`${name}: ${error.message}`);
    });
    await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForSelector("#app .home-screen", { timeout: 15000 });
    await page.waitForTimeout(1900);
    await page.screenshot({ path: `${artifacts}/${name}-home.png`, fullPage: true });

    async function assertNoHorizontalOverflow(stage) {
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
      }));
      if (dimensions.document > dimensions.viewport + 1) {
        failures.push(`${name}/${stage}: горизонтальное переполнение ${dimensions.document}px при viewport ${dimensions.viewport}px`);
      }
    }
    await assertNoHorizontalOverflow("home");

    // The passport must degrade cleanly outside Telegram without inventing student records.
    await page.locator('.avatar-button[data-go="profile"]').click();
    await page.waitForSelector(".profile-screen", { timeout: 10000 });
    await page.locator('[data-go="academicPassport"]').click();
    await page.waitForSelector(".academic-passport-screen", { timeout: 10000 });
    const passportGuestText = await page.locator(".academic-passport-screen").innerText();
    if (!passportGuestText.includes("Нужен вход через Telegram")) failures.push(`${name}/passport: guest state is missing`);
    await assertNoHorizontalOverflow("academic-passport-guest");
    await page.screenshot({ path: `${artifacts}/${name}-academic-passport-guest.png`, fullPage: true });

    // Validate populated academic data with an isolated Telegram/WebApp fixture.
    const fixturePage = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    const fixturePassport = {
      status: "active", studentName: "Тестовый Студент", username: "magnus_demo",
      enrolledProgramsCount: 1, totalLessons: 6, completedLessons: 2, progress: 33,
      programs: [{
        id: "ai", code: "MAG-IT-001", title: "Введение в искусственный интеллект",
        facultyTitle: "Факультет технологий", enrolledAt: "2026-10-01T10:00:00.000Z",
        totalLessons: 6, completedLessons: 2, progress: 33, practiceAverage: 5,
        exam: { passed: false, score: 0, attempts: 1, maxAttempts: 3 },
        certificate: { issued: false, certificateId: "", issuedAt: "" },
        terms: [
          { order: 1, title: "Первый учебный блок", subjects: [{ title: "Основы искусственного интеллекта", totalLessons: 3, completedLessons: 2, passedPractices: 2 }] },
          { order: 2, title: "Второй учебный блок", subjects: [{ title: "Генеративные модели и применение", totalLessons: 3, completedLessons: 0, passedPractices: 0 }] }
        ]
      }],
      history: [{ from: "applicant", to: "active", note: "Зачисление подтверждено", changedAt: 1790848800 }]
    };
    await fixturePage.addInitScript((passport) => {
      const empty = {};
      const base = {
        assignmentDrafts: empty, lessonNotes: empty, interestedFaculties: empty,
        lessonQuizResults: empty, completedLessons: empty, enrollments: { ai: "2026-10-01T10:00:00.000Z" },
        lessonPracticeDrafts: empty, lessonPracticeResults: empty, finalExams: empty,
        certificates: empty, assignmentSubmissions: [],
        academicCatalog: { version: 1, faculties: [], programs: [{ id: "ai", title: "Введение в искусственный интеллект" }] },
        academicPassport: passport, subscription: { status: "none", planId: "", startsAt: 0, endsAt: 0 }
      };
      window.Telegram = { WebApp: {
        initDataUnsafe: { user: { id: 987654321, first_name: "Тестовый", last_name: "Студент", username: "magnus_demo" } },
        ready() {}, expand() {}, setHeaderColor() {}, setBackgroundColor() {},
        HapticFeedback: { impactOccurred() {}, notificationOccurred() {} },
        Serverless: { call(endpoint, payload, callback) {
          if (endpoint === "studentData") callback(null, payload.action === "getAcademicPassport" ? { ok: true, academicPassport: passport } : base);
          else if (endpoint === "admin") callback(null, { ok: true, isAdmin: false });
          else if (endpoint === "payments") callback(null, payload.action === "plans" ? { ok: true, plans: [] } : { ok: true, orders: [] });
          else callback(null, { ok: true });
        } }
      } };
    }, fixturePassport);
    await fixturePage.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    await fixturePage.waitForSelector("#app .home-screen", { timeout: 15000 });
    await fixturePage.waitForTimeout(250);
    await fixturePage.locator('.avatar-button[data-go="profile"]').click();
    await fixturePage.waitForSelector(".profile-screen", { timeout: 10000 });
    await fixturePage.locator('[data-go="academicPassport"]').click();
    await fixturePage.waitForSelector(".academic-passport-screen .passport-program-card", { timeout: 10000 });
    const fixtureText = await fixturePage.locator(".academic-passport-screen").innerText();
    for (const required of ["Тестовый Студент", "MAG-IT-001", "Введение в искусственный интеллект", "2 из 3 занятий", "Практика: 2/3", "Итоговый экзамен"]) {
      if (!fixtureText.includes(required)) failures.push(`${name}/passport: missing populated data: ${required}`);
    }
    const fixtureOverflow = await fixturePage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (fixtureOverflow) failures.push(`${name}/passport: populated layout has horizontal overflow`);
    await fixturePage.screenshot({ path: `${artifacts}/${name}-academic-passport-populated.png`, fullPage: true });
    await fixturePage.close();

    // Reset to a clean startup state before the learning-flow regression checks.
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("#app .home-screen", { timeout: 15000 });
    await page.waitForTimeout(1900);

    await page.locator('[data-course="ai"]').click();
    await page.waitForSelector(".learning-map-screen .learning-path", { timeout: 10000 });
    await page.waitForTimeout(250);
    const mapCheck = await page.evaluate(() => {
      const map = document.querySelector(".learning-path");
      const nodes = [...document.querySelectorAll(".learning-node-wrap")];
      const cards = [...document.querySelectorAll(".learning-node-card")];
      const chapters = [...document.querySelectorAll(".learning-chapter")];
      const checkpoints = [...document.querySelectorAll(".learning-checkpoint")];
      const box = map.getBoundingClientRect();
      return {
        title: document.querySelector(".learning-path-head h2")?.textContent?.trim() || "",
        nodes: nodes.length,
        cardCount: cards.length,
        chapterCount: chapters.length,
        checkpointCount: checkpoints.length,
        mapLeft: box.left,
        mapRight: box.right,
        viewport: document.documentElement.clientWidth,
        currentNodeCount: document.querySelectorAll(".learning-node-wrap.is-current").length,
      };
    });
    if (!mapCheck.title.includes("траектория")) failures.push(`${name}/map: отсутствует заголовок траектории`);
    if (mapCheck.nodes !== 6 || mapCheck.cardCount !== 6) failures.push(`${name}/map: ожидалось 6 занятий, получено ${mapCheck.nodes}`);
    if (mapCheck.chapterCount !== 3 || mapCheck.checkpointCount !== 2) failures.push(`${name}/map: ожидалось 3 главы и 2 контрольные точки, получено ${mapCheck.chapterCount}/${mapCheck.checkpointCount}`);
    if (mapCheck.currentNodeCount !== 1) failures.push(`${name}/map: текущий этап выделен некорректно`);
    if (mapCheck.mapLeft < -1 || mapCheck.mapRight > mapCheck.viewport + 1) failures.push(`${name}/map: карта выходит за пределы экрана`);
    await assertNoHorizontalOverflow("map");
    await page.screenshot({ path: `${artifacts}/${name}-course-map.png`, fullPage: true });

    await page.locator(".learning-node[data-lesson-open]").first().click();
    await page.waitForSelector(".lesson-screen .lesson-tutor", { timeout: 10000 });
    const tutorVisible = await page.locator(".lesson-tutor-heading h2").textContent();
    if (!tutorVisible?.includes("Разберём тему вместе")) failures.push(`${name}/lesson: не найден блок учебного помощника`);
    const lessonTabs = await page.locator("[data-lesson-tab]").count();
    if (lessonTabs !== 4) failures.push(`${name}/lesson: ожидалось 4 вкладки, найдено ${lessonTabs}`);
    const tutorInputFont = await page.locator("[data-tutor-input]").evaluate(el => Number.parseFloat(getComputedStyle(el).fontSize));
    if (tutorInputFont < 16) failures.push(`${name}/lesson: размер шрифта поля наставника меньше 16px — возможен автозум iOS`);

    await page.locator('[data-lesson-tab="practice"]').click();
    const practiceVisible = await page.locator(".lesson-practice").count();
    if (practiceVisible !== 1) failures.push(`${name}/practice: не появилась практическая карточка`);
    await page.locator("[data-practice-hint]").click();
    const hintVisible = await page.locator(".lesson-practice-hint p").count();
    if (hintVisible !== 1) failures.push(`${name}/practice: не открылась подсказка`);
    const practiceDraft = "Модель анализирует примеры и использует найденные закономерности для нового письма.";
    await page.locator("[data-practice-answer]").fill(practiceDraft);
    await page.locator('[data-lesson-tab="notes"]').click();
    await page.locator('[data-lesson-tab="practice"]').click();
    const restoredDraft = await page.locator("[data-practice-answer]").inputValue();
    const practiceDraftPersistence = restoredDraft === practiceDraft;
    if (!practiceDraftPersistence) failures.push(`${name}/practice: черновик не восстановился после переключения вкладки`);

    // Проверяем, что черновик читается из localStorage после полной перезагрузки Mini App.
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("#app .home-screen", { timeout: 15000 });
    await page.waitForTimeout(1900);
    await page.locator('[data-course="ai"]').click();
    await page.waitForSelector(".learning-map-screen .learning-path", { timeout: 10000 });
    await page.locator(".learning-node[data-lesson-open]").first().click();
    await page.waitForSelector(".lesson-screen .lesson-tutor", { timeout: 10000 });
    await page.locator('[data-lesson-tab="practice"]').click();
    const reloadedDraft = await page.locator("[data-practice-answer]").inputValue();
    const practiceDraftPersistenceAfterReload = reloadedDraft === practiceDraft;
    if (!practiceDraftPersistenceAfterReload) failures.push(`${name}/practice: черновик не восстановился после перезапуска приложения`);

    await page.locator('[data-lesson-tab="lesson"]').click();
    await assertNoHorizontalOverflow("lesson");
    await page.screenshot({ path: `${artifacts}/${name}-lesson.png`, fullPage: true });

    const lessonText = await page.locator(".lesson-reading").innerText();
    if (!lessonText.trim()) failures.push(`${name}/lesson: пустой учебный материал`);
    await page.close();
    return { viewport: name, mapNodes: mapCheck.nodes, chapters: mapCheck.chapterCount, checkpoints: mapCheck.checkpointCount, tutorBlock: Boolean(tutorVisible), practicePanel: practiceVisible === 1, practiceDraftPersistence, practiceDraftPersistenceAfterReload, mapWithinViewport: mapCheck.mapLeft >= -1 && mapCheck.mapRight <= mapCheck.viewport + 1 };
  }

  const desktop = await testViewport("desktop", { width: 1440, height: 1000 });
  const mobile = await testViewport("mobile", { width: 390, height: 844 });

  console.log("VISUAL_SMOKE_RESULTS", JSON.stringify({ desktop, mobile, expectedStandaloneWarnings, failures }, null, 2));
  if (failures.length) throw new Error(failures.join("\\n"));
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
