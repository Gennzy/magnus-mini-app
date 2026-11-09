import { api, db } from 'sdk';
import { eq } from 'sdk/db';
import { adminUsers } from '../schema.js';

const APP_URL = 'https://app9020486965.tgcloud.ai/';

function menuKeyboard(admin = false) {
  return {
    inline_keyboard: [[
      { text: 'Открыть MAGNUS', web_app: { url: admin ? APP_URL + "?admin=1" : APP_URL } },
    ]],
  };
}

export default async function (message) {
  const text = String(message.text || '').trim();
  const command = text.split(/\s+/)[0].split('@')[0].toLowerCase();
  if (!['/start', '/help', '/admin', '/menu'].includes(command)) return;
  if (message.chat?.type !== 'private') {
    if (command === '/admin') await api.sendMessage({
      chat_id: message.chat.id,
      text: 'Панель управления доступна только в личном чате с ботом.',
    });
    return;
  }

  if (command === '/admin') {
    const telegramId = String(message.from?.id || '');
    const admin = telegramId
      ? await db.select().from(adminUsers).where(eq(adminUsers.tgId, telegramId)).get()
      : null;
    if (!admin?.active) {
      await api.sendMessage({
        chat_id: message.chat.id,
        text: 'Доступ к панели управления пока не подключён. Назначение администратора выполняется владельцем проекта через локальный CLI и привязывается к email-аккаунту.\n\nТвой Telegram ID: ' + (telegramId || 'не определён') + '\n\nОбычный Telegram ID сам по себе не даёт административных прав.',
      });
      return;
    }
    await api.sendMessage({
      chat_id: message.chat.id,
      text: 'MAGNUS · Панель управления\n\nУправление учебными отправками, проверкой работ и настройками бота.',
      reply_markup: menuKeyboard(true),
    });
    return;
  }

  const welcome = command === '/help'
    ? 'MAGNUS — образовательное пространство.\n\n/start — открыть приложение\n/help — помощь\n/admin — панель управления (только для администратора)'
    : 'Добро пожаловать в MAGNUS.\n\nУчебные программы, материалы и задания собраны в одном пространстве.';
  await api.sendMessage({
    chat_id: message.chat.id,
    text: welcome,
    reply_markup: menuKeyboard(),
  });
}
