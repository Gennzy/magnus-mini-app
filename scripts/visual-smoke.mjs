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
    await page.waitForSelector(".startup-screen .startup-owl", { timeout: 5000 });
    await page.waitForFunction(() => { const img = document.querySelector(".startup-owl"); return img && img.complete && img.naturalWidth > 0; }, null, { timeout: 5000 });
    const startupMascot = await page.evaluate(() => ({ sameAsset: document.querySelector(".startup-owl")?.getAttribute("src") === document.querySelector(".dashboard-owl")?.getAttribute("src"), filter: getComputedStyle(document.querySelector(".startup-owl")).filter }));
    if (!startupMascot.sameAsset || !startupMascot.filter.includes("grayscale")) failures.push(`${name}/startup: splash mascot differs from the dashboard mascot or has no brand color treatment`);
    await page.screenshot({ path: `${artifacts}/${name}-startup.png`, fullPage: true });
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
        // Check every major student-facing screen instead of only the home and lesson flow.
    await page.locator('.bottom-nav [data-go="faculties"]').click();
    await page.waitForSelector(".faculty-grid", { timeout: 10000 });
    await assertNoHorizontalOverflow("catalog");
    await page.screenshot({ path: artifacts + "/" + name + "-catalog.png", fullPage: true });

    await page.locator('.faculty-card[data-faculty="it"]').click();
    await page.waitForSelector(".detail-screen", { timeout: 10000 });
    await assertNoHorizontalOverflow("faculty-detail");

    await page.locator('.bottom-nav [data-go="assignments"]').click();
    await page.waitForSelector(".assignments-screen", { timeout: 10000 });
    await assertNoHorizontalOverflow("assignments");
    await page.locator("[data-assignment-open]").first().click();
    await page.waitForSelector(".assignment-detail-screen", { timeout: 10000 });
    await assertNoHorizontalOverflow("assignment-detail");
    await page.screenshot({ path: artifacts + "/" + name + "-assignment-detail.png", fullPage: true });

    await page.locator('.bottom-nav [data-go="profile"]').click();
    await page.waitForSelector(".profile-screen", { timeout: 10000 });
    await assertNoHorizontalOverflow("profile");
    const profileMenuIcons = await page.locator(".profile-menu .menu-icon svg").count();
    if (profileMenuIcons !== 5) failures.push(name + "/profile: expected 5 SVG menu icons, found " + profileMenuIcons);
    await page.locator('.profile-menu [data-go="documents"]').click();
    await page.waitForSelector(".documents-screen", { timeout: 10000 });
    await assertNoHorizontalOverflow("documents");
    const documentsActionText = await page.locator(".documents-empty-state button").innerText();
    if (documentsActionText.includes("${")) failures.push(name + "/documents: raw template expression is visible in the action label");
    await page.screenshot({ path: artifacts + "/" + name + "-documents.png", fullPage: true });

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
    await page.screenshot({ path: `${artifacts}/${name}-academic-passport-guest.png`, fullPage: true });

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

  const breakpointPage = await browser.newPage({ viewport: { width: 320, height: 844 }, deviceScaleFactor: 1 });
  const breakpointResults = [];
  for (const width of [320, 360, 430, 768, 1024]) {
    await breakpointPage.setViewportSize({ width, height: 844 });
    await breakpointPage.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    await breakpointPage.waitForSelector("#app .home-screen", { timeout: 15000 });
    const dimensions = await breakpointPage.evaluate(() => {
      const nav = document.querySelector(".bottom-nav").getBoundingClientRect();
      const screen = document.querySelector("main.screen").getBoundingClientRect();
      return { viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth, navBottom: nav.bottom, screenTop: screen.top, navPosition: getComputedStyle(document.querySelector(".bottom-nav")).position };
    });
    if (dimensions.document > dimensions.viewport + 1) failures.push("breakpoint-" + width + "/home: horizontal overflow " + dimensions.document + "px at viewport " + dimensions.viewport + "px");
    if (dimensions.navPosition !== "sticky" || dimensions.navBottom > dimensions.screenTop + 1) failures.push("breakpoint-" + width + "/navigation: nav overlaps home content " + JSON.stringify(dimensions));
    breakpointResults.push({ width, ...dimensions });
    if (width === 320) await breakpointPage.screenshot({ path: artifacts + "/breakpoint-320-home.png", fullPage: true });
  }
  await breakpointPage.close();

  console.log("VISUAL_SMOKE_RESULTS", JSON.stringify({ desktop, mobile, breakpointResults, expectedStandaloneWarnings, failures }, null, 2));
  if (failures.length) throw new Error(failures.join("\\n"));
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
