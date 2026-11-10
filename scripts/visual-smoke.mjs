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

    await page.locator('[data-lesson-tab="lesson"]').click();
    await assertNoHorizontalOverflow("lesson");
    await page.screenshot({ path: `${artifacts}/${name}-lesson.png`, fullPage: true });

    const lessonText = await page.locator(".lesson-reading").innerText();
    if (!lessonText.trim()) failures.push(`${name}/lesson: пустой учебный материал`);
    await page.close();
    return { viewport: name, mapNodes: mapCheck.nodes, chapters: mapCheck.chapterCount, checkpoints: mapCheck.checkpointCount, tutorBlock: Boolean(tutorVisible), practicePanel: practiceVisible === 1, practiceDraftPersistence, mapWithinViewport: mapCheck.mapLeft >= -1 && mapCheck.mapRight <= mapCheck.viewport + 1 };
  }

  const desktop = await testViewport("desktop", { width: 1440, height: 1000 });
  const mobile = await testViewport("mobile", { width: 390, height: 844 });

  console.log("VISUAL_SMOKE_RESULTS", JSON.stringify({ desktop, mobile, expectedStandaloneWarnings, failures }, null, 2));
  if (failures.length) throw new Error(failures.join("\\n"));
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
