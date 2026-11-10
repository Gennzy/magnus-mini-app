import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
const tutor = readFileSync(new URL("../tgcloud/endpoints/tutor.js", import.meta.url), "utf8");

const curriculumIds = [...new Set([...source.matchAll(/\["((?:ai|mind|brand)-\d{2})"/g)].map(match => match[1]))].sort();
const tutorIds = [...tutor.matchAll(/^\s*'((?:ai|mind|brand)-\d{2})':\s*\{/gm)].map(match => match[1]);
const tutorSet = new Set(tutorIds);
const missing = curriculumIds.filter(id => !tutorSet.has(id));
const duplicates = tutorIds.filter((id, index) => tutorIds.indexOf(id) !== index);
const counts = Object.fromEntries(["ai", "mind", "brand"].map(course => [
  course,
  { lessons: curriculumIds.filter(id => id.startsWith(course + "-")).length,
    tutor: tutorIds.filter(id => id.startsWith(course + "-")).length }
]));

console.log("MAGNUS tutor curriculum check", JSON.stringify({ curriculum: curriculumIds.length, tutor: tutorIds.length, counts }, null, 2));

if (missing.length || duplicates.length || curriculumIds.length !== 18 || tutorIds.length !== 18) {
  if (missing.length) console.error("Lessons without tutor support:", missing.join(", "));
  if (duplicates.length) console.error("Duplicate tutor entries:", duplicates.join(", "));
  process.exitCode = 1;
}
