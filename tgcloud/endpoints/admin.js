import { db, api } from 'sdk';
import { eq } from 'sdk/db';
import { adminUsers, studentData, botSettings } from '../schema.js';

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
    const reviewed = {
      ...items[index], status, comment, grade,
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
    const settings = { welcomeMessage, description, shortDescription, menuButtonText };
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
      return { ok: true, saved: true, applied: true, settings, message: 'Настройки сохранены и применены к Telegram-боту.' };
    } catch (error) {
      console.warn('MAGNUS: настройки сохранены, но Telegram не применил часть параметров.', error);
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
