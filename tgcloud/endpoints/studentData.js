import { db } from 'sdk';
import { eq } from 'sdk/db';
import { studentData } from '../schema.js';

function cleanMap(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result = {};
  let totalLength = 0;
  for (const [key, raw] of Object.entries(value).slice(0, 100)) {
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(key) || typeof raw !== 'string') continue;
    const item = raw.slice(0, 12000);
    totalLength += item.length;
    if (totalLength > 60000) break;
    result[key] = item;
  }
  return result;
}

export default async function (input, ctx) {
  const telegramId = ctx.initData?.user?.id;
  if (telegramId == null) {
    return { assignmentDrafts: {}, lessonNotes: {} };
  }

  const tgId = String(telegramId);
  if (input?.action === 'submitAssignment') {
    const assignmentId = String(input.assignmentId || '');
    const answer = typeof input.answer === 'string' ? input.answer.trim() : '';
    const allowedAssignments = ['ai-case', 'mind-reflection', 'brand-review'];
    if (!allowedAssignments.includes(assignmentId)) return { ok: false, code: 'INVALID_ASSIGNMENT', message: 'Задание не найдено.' };
    if (answer.length < 30 || answer.length > 12000) return { ok: false, code: 'INVALID_ANSWER', message: 'Ответ должен содержать от 30 до 12 000 символов.' };
    const existing = await db.select({ payload: studentData.payload }).from(studentData).where(eq(studentData.tgId, tgId)).get();
    const previous = Array.isArray(existing?.payload?.assignmentSubmissions) ? existing.payload.assignmentSubmissions : [];
    const submission = { id: 'sub-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8), assignmentId, answer, submittedAt: new Date().toISOString(), status: 'received' };
    const payload = { ...(existing?.payload || {}), assignmentSubmissions: [...previous, submission].slice(-50) };
    await db.insert(studentData).values({ tgId, payload, updatedAt: Math.floor(Date.now() / 1000) }).onConflictDoUpdate({ target: studentData.tgId, set: { payload, updatedAt: Math.floor(Date.now() / 1000) } }).run();
    return { ok: true, submission };
  }
  if (input?.action === 'load') {
    const row = await db.select({ payload: studentData.payload })
      .from(studentData)
      .where(eq(studentData.tgId, tgId))
      .get();
    return {
      assignmentDrafts: cleanMap(row?.payload?.assignmentDrafts),
      lessonNotes: cleanMap(row?.payload?.lessonNotes),
      interestedFaculties: cleanMap(row?.payload?.interestedFaculties),
      lessonQuizResults: cleanMap(row?.payload?.lessonQuizResults),
      completedLessons: cleanMap(row?.payload?.completedLessons),
      assignmentSubmissions: Array.isArray(row?.payload?.assignmentSubmissions) ? row.payload.assignmentSubmissions.slice(-50) : [],
    };
  }

  if (input?.action === 'save') {
    const payload = {
      assignmentDrafts: cleanMap(input.assignmentDrafts),
      lessonNotes: cleanMap(input.lessonNotes),
      interestedFaculties: cleanMap(input.interestedFaculties),
      lessonQuizResults: cleanMap(input.lessonQuizResults),
      completedLessons: cleanMap(input.completedLessons),
      assignmentSubmissions: Array.isArray(input.assignmentSubmissions) ? input.assignmentSubmissions.slice(-50) : [],
    };
    await db.insert(studentData).values({
      tgId,
      payload,
      updatedAt: Math.floor(Date.now() / 1000),
    }).onConflictDoUpdate({
      target: studentData.tgId,
      set: {
        payload,
        updatedAt: Math.floor(Date.now() / 1000),
      },
    }).run();
    return { ok: true };
  }

  return { assignmentDrafts: {}, lessonNotes: {} };
}
