import { db } from 'sdk';
import { eq } from 'sdk/db';
import { studentData, studentSubscriptions } from '../schema.js';

function publicSubscription(row, now = Math.floor(Date.now() / 1000)) {
  if (!row) return { status: 'none', planId: '', startsAt: 0, endsAt: 0 };
  return {
    status: row.status === 'active' && Number(row.endsAt) <= now ? 'expired' : row.status,
    planId: String(row.planId || ''),
    startsAt: Number(row.startsAt) || 0,
    endsAt: Number(row.endsAt) || 0,
  };
}

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
  const telegramProfile = {
    firstName: String(ctx.initData.user.first_name || '').slice(0, 80),
    lastName: String(ctx.initData.user.last_name || '').slice(0, 80),
    username: String(ctx.initData.user.username || '').slice(0, 64),
  };
  if (input?.action === 'submitAssignment') {
    const assignmentId = String(input.assignmentId || '');
    const answer = typeof input.answer === 'string' ? input.answer.trim() : '';
    const allowedAssignments = ['ai-case', 'mind-reflection', 'brand-review'];
    if (!allowedAssignments.includes(assignmentId)) return { ok: false, code: 'INVALID_ASSIGNMENT', message: 'Задание не найдено.' };
    if (answer.length < 30 || answer.length > 12000) return { ok: false, code: 'INVALID_ANSWER', message: 'Ответ должен содержать от 30 до 12 000 символов.' };
    const existing = await db.select({ payload: studentData.payload }).from(studentData).where(eq(studentData.tgId, tgId)).get();
    const previous = Array.isArray(existing?.payload?.assignmentSubmissions) ? existing.payload.assignmentSubmissions : [];
    const submission = { id: 'sub-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8), assignmentId, answer, submittedAt: new Date().toISOString(), status: 'received' };
    const payload = { ...(existing?.payload || {}), studentProfile: telegramProfile, assignmentSubmissions: [...previous, submission].slice(-50) };
    await db.insert(studentData).values({ tgId, payload, updatedAt: Math.floor(Date.now() / 1000) }).onConflictDoUpdate({ target: studentData.tgId, set: { payload, updatedAt: Math.floor(Date.now() / 1000) } }).run();
    return { ok: true, submission };
  }
  if (input?.action === 'enrollProgram') {
    const courseId = String(input.courseId || '');
    const allowedPrograms = { ai: 'it', mind: 'psychology', brand: 'marketing' };
    if (!Object.prototype.hasOwnProperty.call(allowedPrograms, courseId)) {
      return { ok: false, code: 'INVALID_PROGRAM', message: 'Эта учебная программа пока недоступна для зачисления.' };
    }
    const existing = await db.select({ payload: studentData.payload }).from(studentData).where(eq(studentData.tgId, tgId)).get();
    const payload = existing?.payload || {};
    const enrollments = cleanMap(payload.enrollments);
    if (!enrollments[courseId]) enrollments[courseId] = new Date().toISOString();
    const updatedAt = Math.floor(Date.now() / 1000);
    await db.insert(studentData).values({ tgId, payload: { ...payload, studentProfile: telegramProfile, enrollments }, updatedAt })
      .onConflictDoUpdate({ target: studentData.tgId, set: { payload: { ...payload, studentProfile: telegramProfile, enrollments }, updatedAt } }).run();
    return { ok: true, courseId, facultyId: allowedPrograms[courseId], enrolledAt: enrollments[courseId], enrollments };
  }
  if (input?.action === 'completeLesson') {
    const lessonId = String(input.lessonId || '');
    const answerIndex = Number(input.answerIndex);
    const courseLessons = {
      ai: ['ai-01','ai-02','ai-03','ai-04','ai-05','ai-06'],
      mind: ['mind-01','mind-02','mind-03','mind-04','mind-05','mind-06'],
      brand: ['brand-01','brand-02','brand-03','brand-04','brand-05','brand-06'],
    };
    const courseId = lessonId.split('-')[0];
    const sequence = courseLessons[courseId];
    const lessonIndex = sequence?.indexOf(lessonId) ?? -1;
    if (lessonIndex < 0) return { ok: false, code: 'INVALID_LESSON', message: 'Занятие не найдено.' };
    if (answerIndex !== 1) return { ok: false, code: 'QUIZ_NOT_PASSED', message: 'Сначала ответь правильно на контрольный вопрос.' };

    const existing = await db.select({ payload: studentData.payload }).from(studentData).where(eq(studentData.tgId, tgId)).get();
    const previousPayload = existing?.payload || {};
    const completedLessons = cleanMap(previousPayload.completedLessons);
    const enrollments = cleanMap(previousPayload.enrollments);
    if (!enrollments[courseId]) return { ok: false, code: 'NOT_ENROLLED', message: 'Сначала оформи зачисление на эту программу.' };
    if (lessonIndex > 0 && !completedLessons[sequence[lessonIndex - 1]]) {
      return { ok: false, code: 'LESSON_LOCKED', message: 'Сначала заверши предыдущее занятие.' };
    }
    const lessonQuizResults = cleanMap(previousPayload.lessonQuizResults);
    const previousQuiz = (() => {
      try { return JSON.parse(lessonQuizResults[lessonId] || '{}'); } catch { return {}; }
    })();
    const attempts = Math.max(1, Number(previousQuiz.attempts) || 1);
    lessonQuizResults[lessonId] = JSON.stringify({
      choice: String(answerIndex), correct: true, attempts,
      answeredAt: previousQuiz.answeredAt || new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
    });
    completedLessons[lessonId] = new Date().toISOString();
    const payload = {
      ...previousPayload,
      studentProfile: telegramProfile,
      lessonQuizResults,
      completedLessons,
    };
    const updatedAt = Math.floor(Date.now() / 1000);
    await db.insert(studentData).values({ tgId, payload, updatedAt })
      .onConflictDoUpdate({ target: studentData.tgId, set: { payload, updatedAt } }).run();
    return { ok: true, lessonId, completedAt: completedLessons[lessonId], completedLessons };
  }

  if (input?.action === 'load') {
    const existing = await db.select().from(studentData).where(eq(studentData.tgId, tgId)).get();
    const payload = {
      ...(existing?.payload || {}),
      studentProfile: {
        firstName: telegramProfile.firstName || existing?.payload?.studentProfile?.firstName || '',
        lastName: telegramProfile.lastName || existing?.payload?.studentProfile?.lastName || '',
        username: telegramProfile.username || existing?.payload?.studentProfile?.username || '',
      },
    };
    const updatedAt = Math.floor(Date.now() / 1000);
    const subscriptionRow = await db.select().from(studentSubscriptions).where(eq(studentSubscriptions.tgId, tgId)).get();
    await db.insert(studentData).values({ tgId, payload, updatedAt })
      .onConflictDoUpdate({ target: studentData.tgId, set: { payload, updatedAt } }).run();
    return {
      assignmentDrafts: cleanMap(payload.assignmentDrafts),
      lessonNotes: cleanMap(payload.lessonNotes),
      interestedFaculties: cleanMap(payload.interestedFaculties),
      lessonQuizResults: cleanMap(payload.lessonQuizResults),
      completedLessons: cleanMap(payload.completedLessons),
      enrollments: cleanMap(payload.enrollments),
      lessonPracticeDrafts: cleanMap(payload.lessonPracticeDrafts),
      lessonPracticeResults: cleanMap(payload.lessonPracticeResults),
      assignmentSubmissions: Array.isArray(payload.assignmentSubmissions) ? payload.assignmentSubmissions.slice(-50) : [],
      subscription: publicSubscription(subscriptionRow),
    };
  }

  if (input?.action === 'save') {
    const existing = await db.select({ payload: studentData.payload }).from(studentData).where(eq(studentData.tgId, tgId)).get();
    const payload = {
      assignmentDrafts: cleanMap(input.assignmentDrafts),
      lessonNotes: cleanMap(input.lessonNotes),
      interestedFaculties: cleanMap(input.interestedFaculties),
      lessonQuizResults: cleanMap(input.lessonQuizResults),
      completedLessons: cleanMap(existing?.payload?.completedLessons),
      enrollments: cleanMap(existing?.payload?.enrollments),
      lessonPracticeDrafts: cleanMap(input.lessonPracticeDrafts),
      lessonPracticeResults: cleanMap(input.lessonPracticeResults),
      assignmentSubmissions: Array.isArray(existing?.payload?.assignmentSubmissions) ? existing.payload.assignmentSubmissions.slice(-50) : [],
      studentProfile: {
        firstName: telegramProfile.firstName || existing?.payload?.studentProfile?.firstName || '',
        lastName: telegramProfile.lastName || existing?.payload?.studentProfile?.lastName || '',
        username: telegramProfile.username || existing?.payload?.studentProfile?.username || '',
      },
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
