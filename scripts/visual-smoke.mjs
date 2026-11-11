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
  async function captureSettled(page, options) {
    // The page transition lasts up to 340ms; capture only the stable, fully opaque screen.
    await page.waitForTimeout(400);
    await page.screenshot(options);
  }

  async function testViewport(name, viewport) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    page.on("pageerror", error => {
      if (error.message.includes("WebAppServerlessInitDataUnavailable")) expectedStandaloneWarnings.push(`${name}: Telegram initData is unavailable outside Telegram`);
      else failures.push(`${name}: ${error.message}`);
    });
    await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForSelector("#app .home-screen", { timeout: 15000 });
    const standaloneGreetingAvatar = await page.locator(".home-avatar").evaluate(node => getComputedStyle(node).display !== "none");
    if (standaloneGreetingAvatar) failures.push(name + "/home: greeting avatar duplicates the avatar in the standalone topbar");
    const progressLabels = await page.locator(".dashboard-progress-strip article span").allTextContents();
    if (progressLabels.some(label => /черновик/i.test(label))) failures.push(name + "/home: draft count is duplicated between overview and task statistics");
    if (progressLabels[1]?.trim() !== "Программ") failures.push(name + "/home: second overview metric must show enrolled programs, not duplicated drafts");
    await page.waitForSelector(".startup-screen .startup-owl", { timeout: 5000 });
    await page.waitForFunction(() => { const img = document.querySelector(".startup-owl"); return img && img.complete && img.naturalWidth > 0; }, null, { timeout: 5000 });
    const startupMascot = await page.evaluate(() => {
      const startupFilter = getComputedStyle(document.querySelector(".startup-owl")).filter;
      const dashboardFilter = getComputedStyle(document.querySelector(".dashboard-owl")).filter;
      const colorFilter = value => value.replace(/\\s+drop-shadow\\(.*\\)$/, "");
      return {
        sameAsset: document.querySelector(".startup-owl")?.getAttribute("src") === document.querySelector(".dashboard-owl")?.getAttribute("src"),
        startupColorFilter: colorFilter(startupFilter),
        dashboardColorFilter: colorFilter(dashboardFilter)
      };
    });
    if (!startupMascot.sameAsset || !startupMascot.startupColorFilter.includes("grayscale") || startupMascot.startupColorFilter !== startupMascot.dashboardColorFilter) failures.push(name + "/startup: splash and dashboard mascot must use the same source image and shared brand color filter " + JSON.stringify(startupMascot));
    await page.screenshot({ path: artifacts + "/" + name + "-startup.png", fullPage: true });
    await page.locator(".startup-screen").evaluate(el => el.remove());
    await page.waitForTimeout(1900);
    await captureSettled(page, { path: `${artifacts}/${name}-home.png`, fullPage: true });
    await page.keyboard.press("Tab");
    const keyboardFocus = await page.evaluate(() => { const style = getComputedStyle(document.activeElement); return { tag: document.activeElement.tagName, outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth }; });
    if (keyboardFocus.outlineStyle === "none" || parseFloat(keyboardFocus.outlineWidth) < 2) failures.push(name + "/a11y: first keyboard focus target has no visible focus ring " + JSON.stringify(keyboardFocus));
    const navTargets = await page.locator(".bottom-nav button").evaluateAll(nodes => nodes.map(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })));
    if (navTargets.some(target => target.height < 44 || target.width < 44)) failures.push(name + "/a11y: navigation touch target below 44px " + JSON.stringify(navTargets));
    await page.emulateMedia({ reducedMotion: "reduce" });
    const reducedMotion = await page.locator(".dashboard-owl").evaluate(node => getComputedStyle(node).animationName);
    if (reducedMotion !== "none") failures.push(name + "/a11y: dashboard mascot still animates with reduced motion enabled");
    await page.emulateMedia({ reducedMotion: "no-preference" });


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
        await page.locator('.bottom-nav [data-go="study"]').click();
    await page.waitForSelector(".study-screen", { timeout: 10000 });
    await assertNoHorizontalOverflow("study");
    await captureSettled(page, { path: artifacts + "/" + name + "-study.png", fullPage: true });

    // Check every major student-facing screen instead of only the home and lesson flow.
    await page.locator('.bottom-nav [data-go="faculties"]').click();
    await page.waitForSelector(".faculty-grid", { timeout: 10000 });
    await assertNoHorizontalOverflow("catalog");
    const searchFontSize = await page.locator(".search-box input").evaluate(node => parseFloat(getComputedStyle(node).fontSize));
    if (viewport.width <= 650 && searchFontSize < 16) failures.push(name + "/catalog: search input below 16px may trigger iOS auto-zoom (" + searchFontSize + "px)");
    const filterTargets = await page.locator(".filter-row .filter-chip").evaluateAll(nodes => nodes.map(node => ({width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height})));
    if (viewport.width <= 650 && filterTargets.some(target => target.width < 44 || target.height < 44)) failures.push(name + "/catalog: filter touch target below 44px " + JSON.stringify(filterTargets));
    const catalogKeyHint = await page.locator(".search-box span").count();
    if (catalogKeyHint !== 0) failures.push(name + "/catalog: a keyboard shortcut hint is shown without a matching shortcut");
    await captureSettled(page, { path: artifacts + "/" + name + "-catalog.png", fullPage: true });

    await page.locator('.faculty-card[data-faculty="it"]').click();
    await page.waitForSelector(".detail-screen", { timeout: 10000 });
    await assertNoHorizontalOverflow("faculty-detail");
    const facultyBackTarget = await page.locator(".detail-screen .back-button").first().evaluate(node => ({width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height}));
    if (viewport.width <= 650 && (facultyBackTarget.width < 44 || facultyBackTarget.height < 44)) failures.push(name + "/faculty-detail: back control below 44px " + JSON.stringify(facultyBackTarget));
    const facultyCopy = await page.locator(".detail-screen").innerText();
    if (/преподавател/i.test(facultyCopy)) failures.push(name + "/faculty-detail: human teacher wording conflicts with the AI-led learning model");

    await page.locator('.bottom-nav [data-go="assignments"]').click();
    await page.waitForSelector(".assignments-screen", { timeout: 10000 });
    await assertNoHorizontalOverflow("assignments");
    await page.locator("[data-assignment-open]").first().click();
    await page.waitForSelector(".assignment-detail-screen", { timeout: 10000 });
    await assertNoHorizontalOverflow("assignment-detail");
    const answerFontSize = await page.locator(".assignment-answer textarea").evaluate(node => parseFloat(getComputedStyle(node).fontSize));
    if (answerFontSize < 16) failures.push(name + "/assignment-detail: textarea font-size below 16px may trigger iOS auto-zoom (" + answerFontSize + "px)");
    const assignmentCopy = await page.locator(".assignment-detail-screen").innerText();
    if (/преподавател/i.test(assignmentCopy)) failures.push(name + "/assignment-detail: human teacher wording conflicts with the AI-led learning model");
    await captureSettled(page, { path: artifacts + "/" + name + "-assignment-detail.png", fullPage: true });

    await page.locator('.bottom-nav [data-go="profile"]').click();
    await page.waitForSelector(".profile-screen", { timeout: 10000 });
    await assertNoHorizontalOverflow("profile");
    const profileMenuIcons = await page.locator(".profile-menu .menu-icon svg").count();
    if (profileMenuIcons !== 5) failures.push(name + "/profile: expected 5 SVG menu icons, found " + profileMenuIcons);
    for (const actionName of ["settings", "notifications", "support", "about"]) {
      await page.locator('.profile-menu [data-action="' + actionName + '"]').click();
      await page.waitForSelector(".info-modal-panel", { timeout: 5000 });
      const dialogTitle = await page.locator(".info-modal-panel h2").innerText();
      if (!dialogTitle.trim()) failures.push(name + "/profile: " + actionName + " dialog has no title");
      if (actionName === "settings") {
        await page.keyboard.press("Escape");
      } else if (actionName === "notifications") {
        await page.locator(".info-modal-backdrop").click({ position: { x: 5, y: 5 } });
      } else if (actionName === "about") {
        await page.locator(".info-modal-close").click();
      } else {
        await page.locator(".info-modal-confirm").click();
      }
      await page.waitForSelector(".info-modal-backdrop", { state: "detached", timeout: 5000 });
    }
    await page.locator('.profile-menu [data-go="documents"]').click();
    await page.waitForSelector(".documents-screen", { timeout: 10000 });
    await assertNoHorizontalOverflow("documents");
    const documentsActionText = await page.locator(".documents-empty-state button").innerText();
    if (documentsActionText.includes("${")) failures.push(name + "/documents: raw template expression is visible in the action label");
    await captureSettled(page, { path: artifacts + "/" + name + "-documents.png", fullPage: true });

    const desktopNavCheck = await page.evaluate(() => {
      const nav = document.querySelector(".bottom-nav");
      const screen = document.querySelector("main.screen");
      const navRect = nav.getBoundingClientRect();
      const screenRect = screen.getBoundingClientRect();
      return { navBottom: navRect.bottom, screenTop: screenRect.top, position: getComputedStyle(nav).position };
    });
    if (desktopNavCheck.position !== "sticky" || desktopNavCheck.navBottom > desktopNavCheck.screenTop + 1) {
      failures.push(name + "/navigation: desktop nav overlaps page content " + JSON.stringify(desktopNavCheck));
    }

    await page.locator('.avatar-button[data-go="profile"]').click();
    await page.waitForSelector(".profile-screen", { timeout: 10000 });
    await page.locator('[data-go="academicPassport"]').click();
    await page.waitForSelector(".academic-passport-screen", { timeout: 10000 });
    const passportGuestText = await page.locator(".academic-passport-screen").innerText();
    if (!passportGuestText.includes("Нужен вход через Telegram")) failures.push(`${name}/passport: guest state is missing`);
    await assertNoHorizontalOverflow("academic-passport-guest");
    await captureSettled(page, { path: `${artifacts}/${name}-academic-passport-guest.png`, fullPage: true });

    // Reset to a clean startup state before the learning-flow regression checks.
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("#app .home-screen", { timeout: 15000 });
    await page.locator(".startup-screen").evaluate(el => el.remove()).catch(() => {});
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
    await captureSettled(page, { path: `${artifacts}/${name}-course-map.png`, fullPage: true });

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
    const practiceInputFont = await page.locator("[data-practice-answer]").evaluate(node => parseFloat(getComputedStyle(node).fontSize));
    if (viewport.width <= 650 && practiceInputFont < 16) failures.push(name + "/practice: answer field below 16px may trigger iOS auto-zoom (" + practiceInputFont + "px)");
    await page.locator("[data-practice-hint]").click();
    const hintVisible = await page.locator(".lesson-practice-hint p").count();
    if (hintVisible !== 1) failures.push(`${name}/practice: не открылась подсказка`);
    const practiceDraft = "Модель анализирует примеры и использует найденные закономерности для нового письма.";
    await page.locator("[data-practice-answer]").fill(practiceDraft);
    await page.locator('[data-lesson-tab="notes"]').click();
    const notesInputFont = await page.locator("#lesson-note").evaluate(node => parseFloat(getComputedStyle(node).fontSize));
    if (viewport.width <= 650 && notesInputFont < 16) failures.push(name + "/notes: note field below 16px may trigger iOS auto-zoom (" + notesInputFont + "px)");
    await page.locator('[data-lesson-tab="practice"]').click();
    const restoredDraft = await page.locator("[data-practice-answer]").inputValue();
    const practiceDraftPersistence = restoredDraft === practiceDraft;
    if (!practiceDraftPersistence) failures.push(`${name}/practice: черновик не восстановился после переключения вкладки`);

    // Проверяем, что черновик читается из localStorage после полной перезагрузки Mini App.
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("#app .home-screen", { timeout: 15000 });
    await page.locator(".startup-screen").evaluate(el => el.remove()).catch(() => {});
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
    await captureSettled(page, { path: `${artifacts}/${name}-lesson.png`, fullPage: true });

    const lessonText = await page.locator(".lesson-reading").innerText();
    if (!lessonText.trim()) failures.push(`${name}/lesson: пустой учебный материал`);
    await page.close();
    return { viewport: name, mapNodes: mapCheck.nodes, chapters: mapCheck.chapterCount, checkpoints: mapCheck.checkpointCount, tutorBlock: Boolean(tutorVisible), practicePanel: practiceVisible === 1, practiceDraftPersistence, practiceDraftPersistenceAfterReload, mapWithinViewport: mapCheck.mapLeft >= -1 && mapCheck.mapRight <= mapCheck.viewport + 1 };
  }

  const desktop = await testViewport("desktop", { width: 1440, height: 1000 });
  const mobile = await testViewport("mobile", { width: 390, height: 844 });

  // Exercise the final-exam screen with a deterministic Telegram Mini App test bridge.
  const examPage = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await examPage.route("https://telegram.org/js/telegram-web-app.js", route => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }));
  await examPage.addInitScript(() => {
    const completedLessons = Object.fromEntries(["ai-01","ai-02","ai-03","ai-04","ai-05","ai-06"].map(id => [id, "2026-11-11T00:00:00.000Z"]));
    const questions = Array.from({ length: 6 }, (_, index) => ({ id: "smoke-q" + (index + 1), text: "Проверочный вопрос " + (index + 1), options: ["Вариант A", "Вариант B", "Вариант C"] }));
    window.Telegram = { WebApp: {
      initData: "smoke-init-data",
      initDataUnsafe: { user: { id: 770001, first_name: "Тест", username: "magnus_smoke" } },
      ready() {}, expand() {}, setHeaderColor() {}, setBackgroundColor() {},
      HapticFeedback: { impactOccurred() {} },
      Serverless: { call(service, payload, callback) {
        if (service === "admin") { callback(null, { isAdmin: false }); return; }
        if (service === "payments") { callback(null, { ok: true, plans: [] }); return; }
        if (service === "studentData" && payload.action === "load") { callback(null, { completedLessons, enrollments: { ai: "active" } }); return; }
        if (service === "studentData" && payload.action === "startFinalExam") { callback(null, { ok: true, sessionId: "smoke-session", questions }); return; }
        if (service === "studentData" && payload.action === "submitFinalExam") { callback(null, { ok: true, result: { passed: true, score: 100, correct: 6, total: 6 } }); return; }
        callback(null, { ok: false, message: "Unsupported visual smoke action" });
      } }
    } };
  });
  await examPage.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  await examPage.waitForSelector("#app .home-screen", { timeout: 15000 });
  await examPage.locator(".startup-screen").evaluate(el => el.remove()).catch(() => {});
  await examPage.locator('.bottom-nav [data-go="study"]').click();
  await examPage.waitForSelector(".study-screen", { timeout: 10000 });
  await examPage.locator('.study-screen [data-course="ai"]').last().click();
  await examPage.waitForSelector(".learning-map-screen .learning-path", { timeout: 10000 });
  await examPage.locator('[data-exam-start="ai"]').click();
  await examPage.waitForSelector(".final-exam-screen", { timeout: 10000 });
  const examQuestionCount = await examPage.locator(".final-exam-question").count();
  const examOptionCount = await examPage.locator(".final-exam-question input[type=radio]").count();
  if (examQuestionCount !== 6 || examOptionCount !== 18) failures.push("telegram-exam: expected 6 questions and 18 options, found " + examQuestionCount + "/" + examOptionCount);
  for (let index = 1; index <= 6; index++) await examPage.locator('input[name="smoke-q' + index + '"][value="0"]').check();
  await examPage.locator("[data-exam-submit]").click();
  await examPage.waitForSelector(".final-exam-result.passed", { timeout: 10000 });
  const examResultText = await examPage.locator(".final-exam-result.passed").innerText();
  if (!examResultText.includes("100%")) failures.push("telegram-exam: passed result did not display 100 percent");
  await examPage.evaluate(() => document.querySelector(".startup-screen")?.remove());
  await examPage.evaluate(() => window.scrollTo(0, 0));
  await examPage.waitForTimeout(120);
  const examOverflow = await examPage.evaluate(() => ({ viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth }));
  if (examOverflow.document > examOverflow.viewport + 1) failures.push("telegram-exam: horizontal overflow " + JSON.stringify(examOverflow));
  const examNav = await examPage.evaluate(() => {
    const nav = document.querySelector(".bottom-nav");
    const screen = document.querySelector("main.screen");
    const navRect = nav.getBoundingClientRect();
    const screenRect = screen.getBoundingClientRect();
    return { position: getComputedStyle(nav).position, navBottom: navRect.bottom, screenTop: screenRect.top };
  });
  if (examNav.position !== "sticky" || examNav.navBottom > examNav.screenTop + 1) failures.push("telegram-exam: navigation overlaps the exam content " + JSON.stringify(examNav));
  await captureSettled(examPage, { path: artifacts + "/telegram-final-exam.png", fullPage: true });
  await captureSettled(examPage, { path: artifacts + "/telegram-final-exam-result.png", fullPage: true });
  await examPage.close();
  // Audit the administrative interface in an isolated Telegram owner session.
  const adminPage = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await adminPage.route("https://telegram.org/js/telegram-web-app.js", route => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }));
  await adminPage.addInitScript(() => {
    window.Telegram = { WebApp: {
      initData: "admin-smoke-init-data",
      initDataUnsafe: { user: { id: 770002, first_name: "Owner", username: "magnus_owner" } },
      ready() {}, expand() {}, setHeaderColor() {}, setBackgroundColor() {},
      HapticFeedback: { impactOccurred() {} },
      Serverless: { call(service, payload, callback) {
        if (service === "admin") {
          const action = payload.action;
          if (action === "status") { callback(null, { isAdmin: true, role: "owner" }); return; }
          if (action === "overview") { callback(null, { ok: true, admin: { email: "owner@example.test", role: "owner" }, stats: { students: 0, submissions: 0, pending: 0, reviewed: 0 }, submissions: [], botSettings: { welcomeMessage: "Welcome", description: "MAGNUS", shortDescription: "Учёба", menuButtonText: "Открыть MAGNUS" }, bot: { firstName: "MAGNUS", username: "magnus_test", webhookActive: true, commands: [{ command: "start", description: "Запуск" }] } }); return; }
          if (action === "students") { callback(null, { ok: true, students: [] }); return; }
          if (action === "supportInbox") { callback(null, { ok: true, requests: [] }); return; }
          if (action === "paymentPlans") { callback(null, { ok: true, plans: [{ planId: "monthly-30d", title: "30 дней", starsPrice: 0, enabled: false }] }); return; }
          if (action === "paymentOrders") { callback(null, { ok: true, orders: [], summary: { paidOrders: 0, paidStars: 0, pendingOrders: 0 } }); return; }
          if (action === "aiSettings") { callback(null, { ok: true, configured: false, model: "openai/gpt-oss-20b" }); return; }
          if (action === "auditLog") { callback(null, { ok: true, entries: [] }); return; }
          callback(null, { ok: true }); return;
        }
        if (service === "studentData" && payload.action === "load") { callback(null, {}); return; }
        if (service === "payments") { callback(null, { ok: true, plans: [] }); return; }
        callback(null, { ok: true });
      } }
    } };
  });
  await adminPage.goto(baseUrl + "?admin=1", { waitUntil: "domcontentloaded", timeout: 30000 });
  await adminPage.waitForSelector(".admin-screen .admin-header", { timeout: 15000 });
  await adminPage.locator(".startup-screen").evaluate(el => el.remove()).catch(() => {});
  await adminPage.waitForSelector(".admin-stat-grid", { timeout: 10000 });
  const adminOverviewCopy = await adminPage.locator(".admin-screen").innerText();
  if (/преподавател/i.test(adminOverviewCopy)) failures.push("admin-overview: human teacher wording conflicts with the AI-led learning model");
  const mobileAdminTabs = await adminPage.locator(".admin-tabs").evaluate(el => ({ overflowX: getComputedStyle(el).overflowX, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, flexWrap: getComputedStyle(el).flexWrap }));
  if (mobileAdminTabs.overflowX !== "auto" || mobileAdminTabs.flexWrap !== "nowrap" || mobileAdminTabs.scrollWidth <= mobileAdminTabs.clientWidth) failures.push("admin-mobile: tabs are not a compact horizontal scroll row " + JSON.stringify(mobileAdminTabs));
  for (const [tab, selector] of [["overview", ".admin-stat-grid"], ["reviews", ".admin-screen section"], ["students", ".admin-students-section"], ["support", ".admin-support-section"], ["payments", ".admin-payment-plans"], ["ai", ".admin-ai-settings"], ["bot", ".admin-bot-settings"], ["audit", ".admin-audit-section"]]) {
    await adminPage.locator('.admin-tabs [data-admin-tab="' + tab + '"]').click();
    await adminPage.waitForSelector(selector, { timeout: 10000 });
    const adminDimensions = await adminPage.evaluate(() => ({ viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth, navBottom: document.querySelector(".bottom-nav").getBoundingClientRect().bottom, screenTop: document.querySelector("main.screen").getBoundingClientRect().top }));
    if (tab === "bot" && await adminPage.locator(".admin-bot-icon svg").count() !== 1) failures.push("admin-bot: expected the shared owl brand mark instead of a text monogram");
    if (adminDimensions.document > adminDimensions.viewport + 1) failures.push("admin-" + tab + ": horizontal overflow " + JSON.stringify(adminDimensions));
    if (adminDimensions.navBottom > adminDimensions.screenTop + 1) failures.push("admin-" + tab + ": primary navigation overlaps admin content " + JSON.stringify(adminDimensions));
    await captureSettled(adminPage, { path: artifacts + "/admin-mobile-" + tab + ".png", fullPage: true });
  }
  await adminPage.setViewportSize({ width: 1440, height: 1000 });
  await adminPage.goto(baseUrl + "?admin=1", { waitUntil: "domcontentloaded", timeout: 30000 });
  await adminPage.waitForSelector(".admin-screen .admin-header", { timeout: 15000 });
  await adminPage.locator(".startup-screen").evaluate(el => el.remove()).catch(() => {});
  await adminPage.waitForSelector(".admin-stat-grid", { timeout: 10000 });
  const adminDesktop = await adminPage.evaluate(() => ({ viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth, navBottom: document.querySelector(".bottom-nav").getBoundingClientRect().bottom, screenTop: document.querySelector("main.screen").getBoundingClientRect().top }));
  if (adminDesktop.document > adminDesktop.viewport + 1 || adminDesktop.navBottom > adminDesktop.screenTop + 1) failures.push("admin-desktop: layout overflow or navigation overlap " + JSON.stringify(adminDesktop));
  await captureSettled(adminPage, { path: artifacts + "/admin-desktop-overview.png", fullPage: true });
  await adminPage.close();
  const breakpointPage = await browser.newPage({ viewport: { width: 320, height: 844 }, deviceScaleFactor: 1 });
  const breakpointResults = [];
  for (const width of [320, 360, 430, 768, 1024]) {
    await breakpointPage.setViewportSize({ width, height: 844 });
    await breakpointPage.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    await breakpointPage.waitForSelector("#app .home-screen", { timeout: 15000 });
    await breakpointPage.locator(".startup-screen").evaluate(el => el.remove()).catch(() => {});
    const dimensions = await breakpointPage.evaluate(() => {
      const nav = document.querySelector(".bottom-nav").getBoundingClientRect();
      const screen = document.querySelector("main.screen");
      const firstContent = screen?.firstElementChild;
      return { viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth, navBottom: nav.bottom, screenTop: firstContent?.getBoundingClientRect().top ?? screen.getBoundingClientRect().top, navPosition: getComputedStyle(document.querySelector(".bottom-nav")).position };
    });
    if (dimensions.document > dimensions.viewport + 1) failures.push("breakpoint-" + width + "/home: horizontal overflow " + dimensions.document + "px at viewport " + dimensions.viewport + "px");
    if (dimensions.navPosition !== "sticky" || dimensions.navBottom > dimensions.screenTop + 1) failures.push("breakpoint-" + width + "/navigation: nav overlaps home content " + JSON.stringify(dimensions));
    const checkStage = async (stage) => {
      await breakpointPage.evaluate(() => window.scrollTo(0, 0));
      await breakpointPage.waitForTimeout(150);
      const result = await breakpointPage.evaluate(() => {
        const screen = document.querySelector("main.screen");
        const firstContent = screen?.firstElementChild;
        return {
          viewport: document.documentElement.clientWidth,
          document: document.documentElement.scrollWidth,
          screen: screen?.getBoundingClientRect().width ?? 0,
          navBottom: document.querySelector(".bottom-nav")?.getBoundingClientRect().bottom ?? 0,
          screenTop: firstContent?.getBoundingClientRect().top ?? screen?.getBoundingClientRect().top ?? 0,
        };
      });
      if (result.document > result.viewport + 1) failures.push("breakpoint-" + width + "/" + stage + ": horizontal overflow " + JSON.stringify(result));
      if (result.navBottom > result.screenTop + 1) failures.push("breakpoint-" + width + "/" + stage + ": navigation overlaps content " + JSON.stringify(result));
      if (width === 320) await captureSettled(breakpointPage, { path: artifacts + "/breakpoint-320-" + stage + ".png", fullPage: true });
      return result;
    };
    await checkStage("home");
    await breakpointPage.locator('.bottom-nav [data-go="study"]').click();
    await breakpointPage.waitForSelector(".study-screen", { timeout: 10000 });
    await checkStage("study");
    await breakpointPage.locator('.bottom-nav [data-go="faculties"]').click();
    await breakpointPage.waitForSelector(".faculty-grid", { timeout: 10000 });
    await checkStage("catalog");
    await breakpointPage.locator('.faculty-card[data-faculty="it"]').click();
    await breakpointPage.waitForSelector(".detail-screen", { timeout: 10000 });
    await checkStage("faculty-detail");
    await breakpointPage.locator('.bottom-nav [data-go="assignments"]').click();
    await breakpointPage.waitForSelector(".assignments-screen", { timeout: 10000 });
    await checkStage("assignments");
    await breakpointPage.locator("[data-assignment-open]").first().click();
    await breakpointPage.waitForSelector(".assignment-detail-screen", { timeout: 10000 });
    await checkStage("assignment-detail");
    await breakpointPage.locator('.bottom-nav [data-go="profile"]').click();
    await breakpointPage.waitForSelector(".profile-screen", { timeout: 10000 });
    await checkStage("profile");
    await breakpointPage.locator('.profile-menu [data-go="documents"]').click();
    await breakpointPage.waitForSelector(".documents-screen", { timeout: 10000 });
    await checkStage("documents");
    await breakpointPage.locator('.bottom-nav [data-go="study"]').click();
    await breakpointPage.waitForSelector(".study-screen", { timeout: 10000 });
    await breakpointPage.locator('.study-screen [data-course="ai"]').last().click();
    await breakpointPage.waitForSelector(".learning-map-screen .learning-path", { timeout: 10000 });
    await checkStage("course-map");
    await breakpointPage.locator(".learning-node[data-lesson-open]").first().click();
    await breakpointPage.waitForSelector(".lesson-screen .lesson-tutor", { timeout: 10000 });
    await checkStage("lesson");
    breakpointResults.push({ width, ...dimensions, screens: ["home","study","catalog","faculty-detail","assignments","assignment-detail","profile","documents","course-map","lesson"] });
  }
  await breakpointPage.close();

  // Exercise the Telegram WebApp layout with a long first name and a loaded Telegram avatar.
  const telegramHomePage = await browser.newPage({ viewport: { width: 320, height: 844 }, deviceScaleFactor: 1 });
  await telegramHomePage.route("https://telegram.org/js/telegram-web-app.js", route => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }));
  await telegramHomePage.addInitScript(() => {
    const avatarSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="32" fill="#b9855a"/><circle cx="32" cy="25" r="12" fill="#f4dfc6"/><path d="M10 64c2-17 12-25 22-25s20 8 22 25" fill="#f4dfc6"/></svg>';
    const photo = "data:image/svg+xml;base64," + btoa(avatarSvg);
    window.Telegram = { WebApp: {
      initData: "telegram-home-smoke-init-data",
      initDataUnsafe: { user: { id: 770003, first_name: "Александр-СверхдлинноеИмяДляПроверкиПереноса", username: "long_name_student", photo_url: photo } },
      ready() {}, expand() {}, setHeaderColor() {}, setBackgroundColor() {},
      HapticFeedback: { impactOccurred() {} },
      Serverless: { call(service, payload, callback) {
        if (service === "admin") { callback(null, { isAdmin: false }); return; }
        if (service === "payments") { callback(null, { ok: true, plans: [] }); return; }
        if (service === "studentData" && payload.action === "load") { callback(null, { completedLessons: {}, enrollments: {} }); return; }
        callback(null, { ok: true });
      } }
    } };
  });
  await telegramHomePage.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  await telegramHomePage.waitForSelector("#app .home-screen", { timeout: 15000 });
  await telegramHomePage.waitForFunction(() => {
    const image = document.querySelector(".home-avatar img");
    return image && image.complete && image.naturalWidth > 0;
  }, null, { timeout: 10000 });
  await telegramHomePage.waitForSelector(".startup-screen", { state: "detached", timeout: 5000 });
  const telegramGreetingAvatarVisible = await telegramHomePage.locator(".home-avatar").evaluate(node => getComputedStyle(node).display !== "none");
  if (!telegramGreetingAvatarVisible) failures.push("telegram-home: greeting avatar must remain visible when the internal Telegram topbar is hidden");
  const telegramHomeLayout = await telegramHomePage.evaluate(() => {
    const greeting = document.querySelector(".greeting-row");
    const name = greeting?.querySelector("h1");
    const avatar = document.querySelector(".home-avatar");
    return {
      telegramMode: document.documentElement.classList.contains("telegram-webapp"),
      internalTopbar: getComputedStyle(document.querySelector(".topbar")).display !== "none",
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      name: name?.textContent || "",
      nameWidth: name?.clientWidth || 0,
      nameScrollWidth: name?.scrollWidth || 0,
      nameHeight: name?.clientHeight || 0,
      nameScrollHeight: name?.scrollHeight || 0,
      nameWhiteSpace: name ? getComputedStyle(name).whiteSpace : "",
      avatarLoaded: Boolean(avatar?.querySelector("img")?.naturalWidth)
    };
  });
  if (!telegramHomeLayout.telegramMode) failures.push("telegram-home: Telegram WebApp class was not enabled");
  if (telegramHomeLayout.internalTopbar) failures.push("telegram-home: duplicated internal topbar is visible inside Telegram");
  if (telegramHomeLayout.document > telegramHomeLayout.viewport + 1) failures.push("telegram-home: long Telegram first name causes horizontal overflow " + JSON.stringify(telegramHomeLayout));
  if (!telegramHomeLayout.avatarLoaded) failures.push("telegram-home: Telegram profile photo did not load in the home greeting");
  if (telegramHomeLayout.nameScrollWidth > telegramHomeLayout.nameWidth + 1) failures.push("telegram-home: long first name overflows its heading " + JSON.stringify(telegramHomeLayout));
  if (telegramHomeLayout.nameWhiteSpace === "nowrap" || telegramHomeLayout.nameScrollHeight > telegramHomeLayout.nameHeight + 4) failures.push("telegram-home: long first name is clipped instead of wrapping " + JSON.stringify(telegramHomeLayout));
  await captureSettled(telegramHomePage, { path: artifacts + "/telegram-home-long-name.png", fullPage: true });
  await telegramHomePage.locator('.bottom-nav [data-go="profile"]').click();
  await telegramHomePage.waitForSelector(".profile-screen", { timeout: 10000 });
  const profileTelegramPhoto = await telegramHomePage.locator(".profile-avatar .telegram-avatar-image").evaluate(node => node.complete && node.naturalWidth > 0).catch(() => false);
  const profileLongName = await telegramHomePage.locator(".profile-info h2").innerText();
  if (!profileTelegramPhoto) failures.push("telegram-profile: Telegram avatar is not reused in the profile card");
  if (!profileLongName.includes("СверхдлинноеИмя")) failures.push("telegram-profile: Telegram first name is not displayed in the profile");
  const profileNameLayout = await telegramHomePage.locator(".profile-info h2").evaluate(node => ({height:node.clientHeight,scrollHeight:node.scrollHeight,width:node.clientWidth,scrollWidth:node.scrollWidth,whiteSpace:getComputedStyle(node).whiteSpace,textOverflow:getComputedStyle(node).textOverflow}));
  if (profileNameLayout.whiteSpace === "nowrap" || profileNameLayout.scrollHeight > profileNameLayout.height + 4 || profileNameLayout.scrollWidth > profileNameLayout.width + 1 || profileNameLayout.textOverflow === "ellipsis") failures.push("telegram-profile: long Telegram name is visually truncated " + JSON.stringify(profileNameLayout));
  await captureSettled(telegramHomePage, { path: artifacts + "/telegram-profile-long-name.png", fullPage: true });
  await telegramHomePage.close();

  console.log("VISUAL_SMOKE_RESULTS", JSON.stringify({ desktop, mobile, breakpointResults, expectedStandaloneWarnings, failures }, null, 2));
  if (failures.length) throw new Error(failures.join("\\n"));
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
