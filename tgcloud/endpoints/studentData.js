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
  if (input?.action === 'savePracticeReview') {
    const lessonId = String(input.lessonId || '');
    const courseId = lessonId.split('-')[0];
    const allowedLessons = {
      ai: ['ai-01','ai-02','ai-03','ai-04','ai-05','ai-06'],
      mind: ['mind-01','mind-02','mind-03','mind-04','mind-05','mind-06'],
      brand: ['brand-01','brand-02','brand-03','brand-04','brand-05','brand-06'],
    };
    if (!allowedLessons[courseId]?.includes(lessonId)) return { ok: false, code: 'INVALID_LESSON', message: 'Занятие не найдено.' };
    const answer = typeof input.answer === 'string' ? input.answer.trim() : '';
    const feedback = typeof input.feedback === 'string' ? input.feedback.trim() : '';
    const assessment = input.assessment && typeof input.assessment === 'object' ? input.assessment : {};
    const scores = assessment.scores && typeof assessment.scores === 'object' ? assessment.scores : {};
    const rubricScores = ['relevance','completeness','reasoning'].map(key => Number(scores[key]));
    const totalScore = rubricScores.reduce((sum, value) => sum + value, 0);
    const verdict = totalScore >= 4 && rubricScores.every(value => Number.isInteger(value) && value > 0 && value <= 2) ? 'pass' : 'revise';
    if (answer.length < 20 || answer.length > 2000 || feedback.length < 20 || feedback.length > 6000 ||
        rubricScores.some(value => !Number.isInteger(value) || value < 0 || value > 2) ||
        Number(assessment.totalScore) !== totalScore || assessment.verdict !== verdict) {
      return { ok: false, code: 'INVALID_REVIEW', message: 'Не удалось сохранить оценку. Попробуй ещё раз.' };
    }
    const existing = await db.select({ payload: studentData.payload }).from(studentData).where(eq(studentData.tgId, tgId)).get();
    const payload = existing?.payload || {};
    const enrollments = cleanMap(payload.enrollments);
    if (!enrollments[courseId]) return { ok: false, code: 'NOT_ENROLLED', message: 'Сначала оформи зачисление на эту программу.' };
    const completed = cleanMap(payload.completedLessons);
    const index = allowedLessons[courseId].indexOf(lessonId);
    if (index > 0 && !completed[allowedLessons[courseId][index - 1]]) {
      return { ok: false, code: 'LESSON_LOCKED', message: 'Сначала заверши предыдущее занятие.' };
    }
    const results = cleanMap(payload.lessonPracticeResults);
    let previous = {};
    try { previous = JSON.parse(results[lessonId] || '{}'); } catch {}
    const record = {
      answer,
      feedback,
      scores: { relevance: rubricScores[0], completeness: rubricScores[1], reasoning: rubricScores[2] },
      totalScore,
      maxScore: 6,
      verdict,
      attempts: Math.max(0, Number(previous.attempts) || 0) + 1,
      reviewedAt: new Date().toISOString(),
      status: verdict,
    };
    results[lessonId] = JSON.stringify(record);
    const updatedAt = Math.floor(Date.now() / 1000);
    const nextPayload = { ...payload, studentProfile: telegramProfile, lessonPracticeResults: results };
    await db.insert(studentData).values({ tgId, payload: nextPayload, updatedAt })
      .onConflictDoUpdate({ target: studentData.tgId, set: { payload: nextPayload, updatedAt } }).run();
    return { ok: true, lessonId, result: record };
  }

  if (input?.action === 'startFinalExam' || input?.action === 'submitFinalExam') {
    const courseId = String(input.courseId || '');
    const examBank = {
      ai: [
        ['Как корректнее всего описать ИИ?', ['Универсальный разум','Система для решения определённых задач','Программа без ошибок'], 1],
        ['Для чего нужна тестовая выборка?', ['Для увеличения объёма интерфейса','Для проверки модели на новых данных','Для хранения паролей'], 1],
        ['Что помогает снизить ошибки модели?', ['Полный отказ от проверки','Качественные данные и проверка результатов','Увеличение длины ответа'], 1],
        ['Что такое промпт?', ['Команда или инструкция модели','Название базы данных','Тип видеокарты'], 0],
        ['Почему важно проверять ответ ИИ?', ['Модель всегда выдумывает','Модель может ошибаться или упускать контекст','Проверка мешает обучению'], 1],
        ['Что лучше для сложной задачи?', ['Один общий запрос без контекста','Разбить задачу на шаги и задать критерии','Просить ответить случайно'], 1],
      ],
      mind: [
        ['Что изучает психология?', ['Только работу мозга','Психику, поведение и процессы человека','Только общественные правила'], 1],
        ['Что такое когнитивное искажение?', ['Способ измерить рост','Систематическая ошибка мышления','Вид физической нагрузки'], 1],
        ['Что помогает лучше понять эмоцию?', ['Игнорировать её','Назвать переживание и его возможную причину','Сразу оценить другого человека'], 1],
        ['Что важно в активном слушании?', ['Перебивать советами','Уточнять и проверять понимание','Менять тему'], 1],
        ['Почему нельзя делать вывод о человеке по одному поступку?', ['Поступки не имеют значения','Нужны контекст и повторяющиеся наблюдения','Характер всегда неизменен'], 1],
        ['Что такое личная граница?', ['Запрет на общение','Понимание собственных допустимых условий и пределов','Обязанность соглашаться'], 1],
      ],
      brand: [
        ['Что формирует позиционирование бренда?', ['Только логотип','Ценность и отличие для выбранной аудитории','Количество публикаций'], 1],
        ['Зачем изучать целевую аудиторию?', ['Чтобы обращаться ко всем одинаково','Чтобы понимать задачи и мотивы клиентов','Чтобы отказаться от продукта'], 1],
        ['Что такое УТП?', ['Уникальное торговое предложение','Универсальный тарифный план','Учёт товарных позиций'], 0],
        ['Что делает коммуникацию бренда последовательной?', ['Случайный тон в каждом канале','Единый смысл и узнаваемый голос','Частая смена названия'], 1],
        ['Как оценивать маркетинговую гипотезу?', ['По личному впечатлению','По заранее выбранным метрикам и результатам теста','По числу идей'], 1],
        ['Что важнее в контент-стратегии?', ['Публиковать как можно чаще','Связать контент с задачами аудитории и целью','Копировать конкурентов'], 1],
      ],
    };
    const questions = examBank[courseId];
    if (!questions) return { ok: false, code: 'INVALID_PROGRAM', message: 'Итоговый экзамен для этой программы не найден.' };
    const existing = await db.select({ payload: studentData.payload }).from(studentData).where(eq(studentData.tgId, tgId)).get();
    const payload = existing?.payload || {};
    if (!cleanMap(payload.enrollments)[courseId]) return { ok: false, code: 'NOT_ENROLLED', message: 'Сначала оформи зачисление на программу.' };
    const lessons = { ai:['ai-01','ai-02','ai-03','ai-04','ai-05','ai-06'], mind:['mind-01','mind-02','mind-03','mind-04','mind-05','mind-06'], brand:['brand-01','brand-02','brand-03','brand-04','brand-05','brand-06'] }[courseId];
    const completed = cleanMap(payload.completedLessons);
    if (!lessons.every(id => Boolean(completed[id]))) return { ok: false, code: 'LESSONS_INCOMPLETE', message: 'Сначала заверши все занятия программы.' };
    const exams = payload.finalExams && typeof payload.finalExams === 'object' ? payload.finalExams : {};
    const state = exams[courseId] && typeof exams[courseId] === 'object' ? exams[courseId] : { attempts: [], passed: false };
    if (state.passed) return { ok: true, passed: true, result: state.attempts?.at(-1) || null, attemptsUsed: (state.attempts || []).length, maxAttempts: 3 };
    if (input.action === 'startFinalExam') {
      if ((state.attempts || []).length >= 3) return { ok: false, code: 'ATTEMPTS_EXHAUSTED', message: 'Попытки экзамена закончились. Обратись в учебную поддержку.' };
      const sessionId = 'exam-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
      const session = { sessionId, questions: questions.map((q, index) => ({ id: courseId + '-q' + (index + 1), text: q[0], options: q[1] })), startedAt: new Date().toISOString() };
      const nextExams = { ...exams, [courseId]: { ...state, activeSession: session, attempts: state.attempts || [] } };
      const nextPayload = { ...payload, finalExams: nextExams };
      const updatedAt = Math.floor(Date.now() / 1000);
      await db.insert(studentData).values({ tgId, payload: nextPayload, updatedAt }).onConflictDoUpdate({ target: studentData.tgId, set: { payload: nextPayload, updatedAt } }).run();
      return { ok: true, sessionId, questions: session.questions, attemptsUsed: (state.attempts || []).length, maxAttempts: 3, passingScore: 70 };
    }
    const session = state.activeSession;
    const answers = input.answers && typeof input.answers === 'object' ? input.answers : {};
    if (!session || session.sessionId !== String(input.sessionId || '')) return { ok: false, code: 'EXAM_SESSION_INVALID', message: 'Экзаменационная сессия не найдена. Начни экзамен заново.' };
    let correct = 0;
    const details = questions.map((question, index) => {
      const selected = Number(answers[courseId + '-q' + (index + 1)]);
      const isCorrect = Number.isInteger(selected) && selected === question[2];
      if (isCorrect) correct += 1;
      return { questionId: courseId + '-q' + (index + 1), selected: Number.isInteger(selected) ? selected : -1, correct: isCorrect };
    });
    const score = Math.round(correct / questions.length * 100);
    const passed = score >= 70;
    const attempt = { score, correct, total: questions.length, passed, submittedAt: new Date().toISOString(), details };
    const attempts = [...(state.attempts || []), attempt].slice(-3);
    const nextExams = { ...exams, [courseId]: { attempts, passed, activeSession: null } };
    const nextPayload = { ...payload, finalExams: nextExams };
    const updatedAt = Math.floor(Date.now() / 1000);
    await db.insert(studentData).values({ tgId, payload: nextPayload, updatedAt }).onConflictDoUpdate({ target: studentData.tgId, set: { payload: nextPayload, updatedAt } }).run();
    return { ok: true, result: attempt, attemptsUsed: attempts.length, maxAttempts: 3 };
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
    const practiceResults = cleanMap(previousPayload.lessonPracticeResults);
    let practiceResult = {};
    try { practiceResult = JSON.parse(practiceResults[lessonId] || '{}'); } catch {}
    if (practiceResult.verdict !== 'pass' || Number(practiceResult.totalScore) < 4) {
      return { ok: false, code: 'PRACTICE_NOT_PASSED', message: 'Сначала выполни практическое задание и получи зачёт.' };
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
      finalExams: payload.finalExams && typeof payload.finalExams === 'object' ? payload.finalExams : {},
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
      lessonPracticeResults: cleanMap(existing?.payload?.lessonPracticeResults),
      finalExams: existing?.payload?.finalExams && typeof existing.payload.finalExams === 'object' ? existing.payload.finalExams : {},
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
