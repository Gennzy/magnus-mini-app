import { db, api } from 'sdk';
import { eq, desc } from 'sdk/db';
import { adminUsers, studentData, botSettings, adminAuditLog, adminMessages } from '../schema.js';

const APP_URL = 'https://app9020486965.tgcloud.ai/';
const BOT_COMMANDS = [
  { command: 'start', description: 'Открыть MAGNUS' },
  { command: 'help', description: 'Помощь и возможности' },
];
const DEFAULT_BOT_SETTINGS = {
  welcomeMessage: 'Добро пожаловать в MAGNUS.\n\nУчебные программы, материалы и задания собраны в одном пространстве.',
  description: 'MAGNUS — образовательная платформа. Изучай темы, выполняй задания и отслеживай результаты.',
  shortDescription: 'Обучение, учебные программы и задания в Telegram.',
  menuButtonText: 'Открыть MAGNUS',
};

function publicBotSettings(row) {
  return row ? {
    welcomeMessage: row.welcomeMessage,
    description: row.description,
    shortDescription: row.shortDescription,
    menuButtonText: row.menuButtonText,
  } : { ...DEFAULT_BOT_SETTINGS };
}

async function applyBotSettings(settings) {
  await api.setMyCommands({ commands: BOT_COMMANDS });
  await api.setMyDescription({ description: settings.description });
  await api.setMyShortDescription({ short_description: settings.shortDescription });
  await api.setChatMenuButton({
    menu_button: { type: 'web_app', text: settings.menuButtonText, web_app: { url: APP_URL } },
  });
}

function cleanText(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function plainMap(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function summarizeStudent(row) {
  const payload = plainMap(row.payload);
  const profile = plainMap(payload.studentProfile);
  const submissions = Array.isArray(payload.assignmentSubmissions) ? payload.assignmentSubmissions : [];
  const completedLessons = plainMap(payload.completedLessons);
  const quizResults = plainMap(payload.lessonQuizResults);
  const quizAttempts = Object.values(quizResults).reduce((total, raw) => {
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return total + Math.max(0, Number(parsed?.attempts) || 0);
    } catch { return total; }
  }, 0);
  return {
    telegramId: String(row.tgId),
    firstName: cleanText(profile.firstName, 80),
    lastName: cleanText(profile.lastName, 80),
    username: cleanText(profile.username, 64),
    updatedAt: Number(row.updatedAt) || 0,
    submissionsCount: submissions.length,
    pendingCount: submissions.filter(item => item.status === 'received').length,
    reviewedCount: submissions.filter(item => item.status === 'reviewed').length,
    revisionCount: submissions.filter(item => item.status === 'revision').length,
    completedLessonsCount: Object.keys(completedLessons).length,
    quizAnswersCount: Object.keys(quizResults).length,
    quizAttempts,
    interestedFacultiesCount: Object.keys(plainMap(payload.interestedFaculties)).length,
  };
}

async function writeAudit(entry) {
  await db.insert(adminAuditLog).values({
    id: Date.now() + '-' + Math.random().toString(36).slice(2, 10),
    action: entry.action,
    actorTgId: String(entry.actorTgId || 'cli'),
    actorEmail: cleanText(entry.actorEmail || 'Локальный CLI', 254),
    targetType: cleanText(entry.targetType || 'system', 40),
    targetId: cleanText(String(entry.targetId || ''), 100),
    summary: cleanText(entry.summary || 'Изменение в MAGNUS', 240),
    details: entry.details && typeof entry.details === 'object' ? entry.details : {},
    createdAt: Math.floor(Date.now() / 1000),
  }).run();
}

async function writeAuditSafely(entry) {
  try {
    await writeAudit(entry);
  } catch (error) {
    console.warn('MAGNUS: не удалось записать действие в журнал аудита.', error);
  }
}

export default async function (input, ctx) {
  // Первичное назначение администратора возможно только из локального CLI.
  // Публичный вызов Mini App всегда содержит проверенный initData.user.
  if (input?.action === 'grantAdmin' && !ctx?.initData?.user) {
    const tgId = String(input.telegramId || '').trim();
    const email = cleanText(input.email, 254).toLowerCase();
    if (!/^\d{5,20}$/.test(tgId) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, message: 'Укажи корректные Telegram ID и email владельца аккаунта.' };
    }
    await db.insert(adminUsers).values({
      tgId, email, role: 'owner', linkedAt: Math.floor(Date.now() / 1000), active: 1,
    }).onConflictDoUpdate({
      target: adminUsers.tgId,
      set: { email, role: 'owner', active: 1 },
    }).run();
    await writeAuditSafely({
      action: 'admin.granted', actorTgId: 'cli', actorEmail: 'Локальный CLI',
      targetType: 'administrator', targetId: tgId,
      summary: 'Назначен владелец MAGNUS',
      details: { email, role: 'owner' },
    });
    return { ok: true, message: 'Администратор MAGNUS назначен и связан с указанным email.' };
  }

  const user = ctx.initData?.user;
  if (!user?.id) return { ok: false, code: 'UNAUTHORIZED' };
  const tgId = String(user.id);

  if (input?.action === 'status') {
    const admin = await db.select().from(adminUsers).where(eq(adminUsers.tgId, tgId)).get();
    return { ok: true, isAdmin: Boolean(admin?.active), role: admin?.active ? admin.role : null };
  }

  const admin = await db.select().from(adminUsers).where(eq(adminUsers.tgId, tgId)).get();
  if (!admin?.active) return { ok: false, code: 'FORBIDDEN', message: 'Нет доступа к панели MAGNUS.' };

  if (input?.action === 'auditLog') {
    const entries = await db.select().from(adminAuditLog)
      .orderBy(desc(adminAuditLog.createdAt)).limit(150).all();
    return { ok: true, entries };
  }


  if (input?.action === 'students') {
    const rows = await db.select().from(studentData)
      .orderBy(desc(studentData.updatedAt)).limit(1000).all();
    return { ok: true, students: rows.map(summarizeStudent) };
  }

  if (input?.action === 'studentDetail') {
    const studentId = String(input.studentId || '').trim();
    if (!/^\d{5,20}$/.test(studentId)) {
      return { ok: false, code: 'INVALID_STUDENT', message: 'Некорректный Telegram ID студента.' };
    }
    const row = await db.select().from(studentData).where(eq(studentData.tgId, studentId)).get();
    if (!row) return { ok: false, code: 'STUDENT_NOT_FOUND', message: 'Профиль студента не найден.' };
    const payload = plainMap(row.payload);
    const profile = plainMap(payload.studentProfile);
    const submissions = Array.isArray(payload.assignmentSubmissions) ? payload.assignmentSubmissions.slice(-50) : [];
    return {
      ok: true,
      student: summarizeStudent(row),
      profile: {
        firstName: cleanText(profile.firstName, 80),
        lastName: cleanText(profile.lastName, 80),
        username: cleanText(profile.username, 64),
      },
      submissions: submissions.reverse(),
      messages: await db.select().from(adminMessages)
        .where(eq(adminMessages.studentId, studentId))
        .orderBy(desc(adminMessages.createdAt)).limit(50).all(),
      interestedFaculties: Object.keys(plainMap(payload.interestedFaculties)),
      completedLessonIds: Object.keys(plainMap(payload.completedLessons)),
      quizLessonIds: Object.keys(plainMap(payload.lessonQuizResults)),
      notesCount: Object.keys(plainMap(payload.lessonNotes)).length,
      draftsCount: Object.keys(plainMap(payload.assignmentDrafts)).length,
    };
  }

  if (input?.action === 'sendStudentMessage') {
    const studentId = String(input.studentId || '').trim();
    const messageText = typeof input.message === 'string' ? input.message.trim() : '';
    if (!/^\d{5,20}$/.test(studentId)) {
      return { ok: false, code: 'INVALID_STUDENT', message: 'Некорректный Telegram ID студента.' };
    }
    if (!messageText || messageText.length > 3500) {
      return { ok: false, code: 'INVALID_MESSAGE', message: 'Сообщение должно содержать от 1 до 3500 символов.' };
    }
    const student = await db.select({ tgId: studentData.tgId }).from(studentData)
      .where(eq(studentData.tgId, studentId)).get();
    if (!student) return { ok: false, code: 'STUDENT_NOT_FOUND', message: 'Студент не найден в облачной базе.' };

    let status = 'failed';
    let telegramMessageId = null;
    let errorMessage = '';
    try {
      const sent = await api.sendMessage({ chat_id: Number(studentId), text: messageText });
      status = 'delivered';
      telegramMessageId = Number(sent?.message_id) || null;
    } catch (error) {
      errorMessage = cleanText(error?.description || error?.message || 'Telegram не принял сообщение.', 500);
      console.warn('MAGNUS: не удалось отправить сообщение студенту.', error);
    }

    const messageId = 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    const createdAt = Math.floor(Date.now() / 1000);
    const record = {
      id: messageId, studentId, adminTgId: tgId, adminEmail: admin.email,
      messageText, status, telegramMessageId, errorMessage, createdAt,
    };
    await db.insert(adminMessages).values(record).run();
    await writeAuditSafely({
      action: 'student.message.sent', actorTgId: tgId, actorEmail: admin.email,
      targetType: 'student', targetId: studentId,
      summary: status === 'delivered' ? 'Студенту отправлено личное сообщение' : 'Не удалось доставить сообщение студенту',
      details: { messageId, status, messageLength: messageText.length, telegramMessageId },
    });
    return {
      ok: true, delivered: status === 'delivered',
      message: status === 'delivered'
        ? 'Сообщение доставлено в Telegram.'
        : 'Telegram не доставил сообщение: ' + (errorMessage || 'ошибка отправки.'),
      record,
    };
  }

  if (input?.action === 'overview') {
    const rows = await db.select().from(studentData).all();
    const submissions = [];
    for (const row of rows) {
      const profile = row.payload?.studentProfile || {};
      const items = Array.isArray(row.payload?.assignmentSubmissions) ? row.payload.assignmentSubmissions : [];
      for (const item of items) {
        submissions.push({
          ...item,
          studentId: row.tgId,
          studentName: cleanText(profile.firstName, 80) || 'Студент',
          username: cleanText(profile.username, 64),
        });
      }
    }
    submissions.sort((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt)));
    const bot = await api.getMe();
    const webhook = await api.getWebhookInfo();
    const commands = await api.getMyCommands();
    const savedBotSettings = await db.select().from(botSettings).where(eq(botSettings.key, 'default')).get();
    return {
      ok: true,
      admin: { email: admin.email, role: admin.role },
      stats: {
        students: rows.length,
        submissions: submissions.length,
        pending: submissions.filter(item => item.status === 'received').length,
        reviewed: submissions.filter(item => item.status === 'reviewed' || item.status === 'revision').length,
      },
      submissions: submissions.slice(0, 100),
      bot: {
        id: bot.id, username: bot.username, firstName: bot.first_name,
        webhookActive: Boolean(webhook.url), webhookPending: webhook.pending_update_count || 0,
        lastError: webhook.last_error_message || '',
        commands,
      },
      botSettings: publicBotSettings(savedBotSettings),
    };
  }

  if (input?.action === 'reviewSubmission') {
    const studentId = String(input.studentId || '');
    const submissionId = cleanText(input.submissionId, 100);
    const status = input.status === 'revision' ? 'revision' : input.status === 'reviewed' ? 'reviewed' : '';
    const comment = cleanText(input.comment, 2000);
    const grade = input.grade === '' || input.grade == null ? null : Number(input.grade);
    if (!/^\d{5,20}$/.test(studentId) || !submissionId || !status || (grade !== null && (!Number.isInteger(grade) || grade < 0 || grade > 100))) {
      return { ok: false, code: 'INVALID_REVIEW', message: 'Проверь статус и оценку от 0 до 100.' };
    }
    const row = await db.select().from(studentData).where(eq(studentData.tgId, studentId)).get();
    if (!row) return { ok: false, message: 'Студент не найден.' };
    const items = Array.isArray(row.payload?.assignmentSubmissions) ? row.payload.assignmentSubmissions : [];
    const index = items.findIndex(item => item.id === submissionId);
    if (index < 0) return { ok: false, message: 'Отправка не найдена.' };
    const previous = { ...items[index] };
    const reviewed = {
      ...previous, status, comment, grade,
      reviewedAt: new Date().toISOString(), reviewedBy: tgId,
    };
    items[index] = reviewed;
    const payload = { ...row.payload, assignmentSubmissions: items.slice(-50) };
    await db.update(studentData).set({ payload, updatedAt: Math.floor(Date.now() / 1000) }).where(eq(studentData.tgId, studentId)).run();
    let notificationSent = false;
    try {
      const text = status === 'reviewed' ? 'Преподаватель проверил твоё задание MAGNUS.' : 'По заданию MAGNUS нужны доработки.';
      const details = [grade === null ? '' : 'Оценка: ' + grade + '/100', comment ? 'Комментарий: ' + comment : ''].filter(Boolean).join('\n');
      await api.sendMessage({ chat_id: Number(studentId), text: [text, details].filter(Boolean).join('\n\n') });
      notificationSent = true;
    } catch (error) {
      console.warn('MAGNUS: не удалось отправить уведомление о проверке.', error);
    }
    await writeAuditSafely({
      action: 'submission.reviewed', actorTgId: tgId, actorEmail: admin.email,
      targetType: 'student_submission', targetId: submissionId,
      summary: status === 'reviewed' ? 'Работа принята' : 'Работа возвращена на доработку',
      details: {
        studentId,
        assignmentId: cleanText(previous.assignmentId, 100),
        previousStatus: cleanText(previous.status || 'received', 30),
        status,
        previousGrade: previous.grade ?? null,
        grade,
        commentChanged: String(previous.comment || '') !== comment,
        commentLength: comment.length,
        notificationSent,
      },
    });
    return { ok: true, submission: reviewed, notificationSent };
  }

  if (input?.action === 'saveBotSettings') {
    const welcomeMessage = cleanText(input.welcomeMessage, 3500);
    const description = cleanText(input.description, 512);
    const shortDescription = cleanText(input.shortDescription, 120);
    const menuButtonText = cleanText(input.menuButtonText, 64);
    if (!welcomeMessage || !description || !shortDescription || !menuButtonText ||
        String(input.welcomeMessage || '').length > 3500 ||
        String(input.description || '').length > 512 ||
        String(input.shortDescription || '').length > 120 ||
        String(input.menuButtonText || '').length > 64) {
      return { ok: false, code: 'INVALID_BOT_SETTINGS', message: 'Заполни все поля и проверь ограничения длины: приветствие — 3500, описание — 512, краткое описание — 120, кнопка — 64 символа.' };
    }
    const previousSettingsRow = await db.select().from(botSettings).where(eq(botSettings.key, 'default')).get();
    const previousSettings = publicBotSettings(previousSettingsRow);
    const settings = { welcomeMessage, description, shortDescription, menuButtonText };
    const changedFields = Object.keys(settings).filter(key => settings[key] !== previousSettings[key]);
    await db.insert(botSettings).values({
      key: 'default', ...settings,
      updatedAt: Math.floor(Date.now() / 1000),
      updatedBy: tgId,
    }).onConflictDoUpdate({
      target: botSettings.key,
      set: {
        ...settings,
        updatedAt: Math.floor(Date.now() / 1000),
        updatedBy: tgId,
      },
    }).run();
    try {
      await applyBotSettings(settings);
      await writeAuditSafely({
        action: 'bot.settings.updated', actorTgId: tgId, actorEmail: admin.email,
        targetType: 'telegram_bot', targetId: 'default',
        summary: 'Обновлены настройки Telegram-бота',
        details: { changedFields, applied: true },
      });
      return { ok: true, saved: true, applied: true, settings, message: 'Настройки сохранены и применены к Telegram-боту.' };
    } catch (error) {
      console.warn('MAGNUS: настройки сохранены, но Telegram не применил часть параметров.', error);
      await writeAuditSafely({
        action: 'bot.settings.updated', actorTgId: tgId, actorEmail: admin.email,
        targetType: 'telegram_bot', targetId: 'default',
        summary: 'Настройки Telegram-бота сохранены, применение не подтверждено',
        details: { changedFields, applied: false },
      });
      return { ok: true, saved: true, applied: false, settings, message: 'Настройки сохранены в базе, но Telegram не подтвердил их применение. Нажми «Сохранить и применить» ещё раз.' };
    }
  }

  if (input?.action === 'configureBot') {
    const row = await db.select().from(botSettings).where(eq(botSettings.key, 'default')).get();
    const settings = publicBotSettings(row);
    await applyBotSettings(settings);
    return { ok: true, applied: true, message: 'Текущие настройки бота применены к Telegram.' };
  }

  return { ok: false, code: 'UNKNOWN_ACTION' };
}
