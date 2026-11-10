import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
const tutor = readFileSync(new URL("../tgcloud/endpoints/tutor.js", import.meta.url), "utf8");

const curriculumIds = [...new Set([...source.matchAll(/\["((?:ai|mind|brand)-\d{2})"/g)].map(match => match[1]))].sort();
const tutorIds = [...tutor.matchAll(/^\s*'((?:ai|mind|brand)-\d{2})':\s*\{/gm)].map(match => match[1]);
const tutorSet = new Set(tutorIds);
const missingTutor = curriculumIds.filter(id => !tutorSet.has(id));
const duplicateTutor = tutorIds.filter((id, index) => tutorIds.indexOf(id) !== index);

const frontendPractice = source.slice(source.indexOf("const lessonPractices ="), source.indexOf("const courseChapters ="));
const serverPractice = tutor.slice(tutor.indexOf("const PRACTICE_TASKS ="), tutor.indexOf("function clean(value,max)"));
const practiceIds = [...frontendPractice.matchAll(/^\s*"((?:ai|mind|brand)-\d{2})":\s*\{/gm)].map(match => match[1]);
const reviewerIds = [...serverPractice.matchAll(/^\s*'((?:ai|mind|brand)-\d{2})':\s*\{/gm)].map(match => match[1]);
const missingPractice = curriculumIds.filter(id => !practiceIds.includes(id));
const missingReview = curriculumIds.filter(id => !reviewerIds.includes(id));
const duplicatePractice = practiceIds.filter((id, index) => practiceIds.indexOf(id) !== index);
const duplicateReview = reviewerIds.filter((id, index) => reviewerIds.indexOf(id) !== index);

const counts = Object.fromEntries(["ai", "mind", "brand"].map(course => [
  course,
  {
    lessons: curriculumIds.filter(id => id.startsWith(course + "-")).length,
    tutor: tutorIds.filter(id => id.startsWith(course + "-")).length,
    practice: practiceIds.filter(id => id.startsWith(course + "-")).length,
    review: reviewerIds.filter(id => id.startsWith(course + "-")).length,
  }
]));

console.log("MAGNUS learning coverage", JSON.stringify({
  curriculum: curriculumIds.length,
  tutor: tutorIds.length,
  practice: practiceIds.length,
  review: reviewerIds.length,
  counts
}, null, 2));

const problems = [
  ["Missing tutor support", missingTutor],
  ["Duplicate tutor entries", duplicateTutor],
  ["Missing practice tasks", missingPractice],
  ["Missing practice review criteria", missingReview],
  ["Duplicate practice tasks", duplicatePractice],
  ["Duplicate practice review criteria", duplicateReview],
];
for (const [label, ids] of problems) if (ids.length) console.error(label + ":", ids.join(", "));

if (
  curriculumIds.length !== 18 ||
  tutorIds.length !== 18 ||
  practiceIds.length !== 18 ||
  reviewerIds.length !== 18 ||
  problems.some(([, ids]) => ids.length)
) process.exitCode = 1;
