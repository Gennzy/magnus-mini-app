import { api, db } from 'sdk';
import { eq } from 'sdk/db';
import { adminUsers, botSettings, paymentOrders, studentSubscriptions, subscriptionPlans, adminAuditLog } from '../schema.js';
import { DEFAULT_SUBSCRIPTION_PLANS, normalizePlan } from '../lib/subscriptionPlans.js';

const APP_URL = 'https://app9020486965.tgcloud.ai/';
const BOT_COMMANDS = [
  { command: 'start', description: 'Открыть MAGNUS' },
  { command: 'help', description: 'Помощь и возможности' },
];
const DEFAULT_WELCOME = 'Добро пожаловать в MAGNUS.\n\nУчебные программы, материалы и задания собраны в одном пространстве.';

function menuKeyboard(admin = false) {
  return {
    inline_keyboard: [[
      { text: admin ? 'Открыть админ-панель' : 'Открыть MAGNUS', web_app: { url: admin ? APP_URL + '?admin=1' : APP_URL } },
    ]],
  };
}

async function processSuccessfulPayment(message) {
  const payment = message.successful_payment;
  const userId = String(message.from?.id || '');
  const payload = String(payment.invoice_payload || '');
  if (!userId || !payload.startsWith('magnus:')) return false;

  const order = await db.select().from(paymentOrders)
    .where(eq(paymentOrders.invoicePayload, payload)).get();
  if (!order || order.status !== 'pending' || String(order.tgId) !== userId) {
    console.warn('MAGNUS: получен успешный платёж без подходящего ожидающего заказа.', { userId, payload });
    return false;
  }
  if (payment.currency !== 'XTR' || Number(payment.total_amount) !== Number(order.amount) || !payment.telegram_payment_charge_id) {
    console.error('MAGNUS: параметры successful_payment не совпали с заказом.', { orderId: order.id });
    return false;
  }

  const savedPlan = await db.select().from(subscriptionPlans)
    .where(eq(subscriptionPlans.planId, order.planId)).get();
  const fallback = DEFAULT_SUBSCRIPTION_PLANS.find(plan => plan.planId === order.planId);
  const plan = savedPlan ? normalizePlan(savedPlan) : fallback ? normalizePlan(fallback) : null;
  if (!plan || plan.days <= 0) {
    console.error('MAGNUS: тариф платежа не найден.', { orderId: order.id });
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  const existing = await db.select().from(studentSubscriptions)
    .where(eq(studentSubscriptions.tgId, userId)).get();
  const active = existing?.status === 'active' && Number(existing.endsAt) > now;
  const startsAt = active ? Number(existing.startsAt) || now : now;
  const base = active ? Number(existing.endsAt) : now;
  const endsAt = base + plan.days * 86400;

  await db.insert(studentSubscriptions).values({
    tgId: userId, planId: plan.planId, status: 'active',
    startsAt, endsAt, source: 'telegram_stars', createdBy: 'telegram_payment',
    createdAt: existing?.createdAt || now, updatedAt: now,
  }).onConflictDoUpdate({
    target: studentSubscriptions.tgId,
    set: {
      planId: plan.planId, status: 'active', startsAt, endsAt,
      source: 'telegram_stars', createdBy: 'telegram_payment', updatedAt: now,
    },
  }).run();

  await db.update(paymentOrders).set({
    status: 'paid',
    telegramChargeId: String(payment.telegram_payment_charge_id),
    providerChargeId: String(payment.provider_payment_charge_id || ''),
    paidAt: now,
  }).where(eq(paymentOrders.id, order.id)).run();

  try {
    await db.insert(adminAuditLog).values({
      id: 'payment-' + order.id,
      action: 'subscription.paid',
      actorTgId: userId,
      actorEmail: 'Telegram Stars',
      targetType: 'student',
      targetId: userId,
      summary: 'Оплата Telegram Stars подтверждена',
      details: { orderId: order.id, planId: plan.planId, amount: order.amount, currency: 'XTR', telegramChargeId: String(payment.telegram_payment_charge_id), endsAt },
      createdAt: now,
    }).run();
  } catch (error) {
    console.warn('MAGNUS: не удалось записать платёж в журнал аудита.', error);
  }

  await api.sendMessage({
    chat_id: message.chat.id,
    text: 'Оплата прошла успешно. Учебный доступ MAGNUS активирован на ' + plan.days + ' дней.\n\nСрок действия до: ' + new Date(endsAt * 1000).toLocaleDateString('ru-RU') + '.',
    reply_markup: menuKeyboard(),
  });
  return true;
}

export default async function (message) {
  if (message.successful_payment) {
    try { await processSuccessfulPayment(message); }
    catch (error) { console.error('MAGNUS: ошибка обработки successful_payment.', error); }
    return;
  }
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
    let admin = null;
    try {
      admin = telegramId
        ? await db.select().from(adminUsers).where(eq(adminUsers.tgId, telegramId)).get()
        : null;
    } catch (error) {
      console.error('MAGNUS: не удалось проверить таблицу администраторов.', error);
      await api.sendMessage({
        chat_id: message.chat.id,
        text: 'Панель управления временно недоступна: база данных ещё не подготовлена. Владелец проекта должен выполнить миграцию Telegram Cloud и повторить назначение администратора.',
      });
      return;
    }
    if (!admin?.active) {
      await api.sendMessage({
        chat_id: message.chat.id,
        text: 'Доступ к панели управления пока не подключён. Назначение администратора выполняется владельцем проекта через локальный CLI и привязывается к email-аккаунту.\n\nТвой Telegram ID: ' + (telegramId || 'не определён') + '\n\nОбычный Telegram ID сам по себе не даёт административных прав.',
      });
      return;
    }
    try {
      await api.setChatMenuButton({
        chat_id: message.chat.id,
        menu_button: { type: 'web_app', text: 'Админ-панель', web_app: { url: APP_URL + '?admin=1' } },
      });
    } catch (error) {
      console.warn('MAGNUS: не удалось установить кнопку админ-панели.', error);
    }
    await api.sendMessage({
      chat_id: message.chat.id,
      text: 'Доступ администратора подтверждён.\n\nНажми кнопку ниже — откроется рабочая панель MAGNUS с обзором, проверкой работ и управлением ботом. Также панель доступна через кнопку меню «Админ-панель» рядом со строкой ввода.',
      reply_markup: menuKeyboard(true),
    });
    return;
  }

  let welcomeMessage = DEFAULT_WELCOME;
  let menuButtonText = 'Открыть MAGNUS';
  if (command === '/start') {
    try {
      const saved = await db.select().from(botSettings).where(eq(botSettings.key, 'default')).get();
      if (typeof saved?.welcomeMessage === 'string' && saved.welcomeMessage.trim()) welcomeMessage = saved.welcomeMessage;
      if (typeof saved?.menuButtonText === 'string' && saved.menuButtonText.trim()) menuButtonText = saved.menuButtonText;
    } catch (error) {
      console.warn('MAGNUS: не удалось загрузить настройки приветствия, используются значения по умолчанию.', error);
    }
    try {
      await api.setMyCommands({ commands: BOT_COMMANDS });
      await api.setChatMenuButton({
        menu_button: { type: 'web_app', text: menuButtonText, web_app: { url: APP_URL } },
      });
    } catch (error) {
      console.warn('MAGNUS: не удалось обновить меню бота.', error);
    }
  }

  const welcome = command === '/help'
    ? 'MAGNUS — образовательное пространство.\n\n/start — открыть приложение\n/help — помощь'
    : welcomeMessage;
  await api.sendMessage({
    chat_id: message.chat.id,
    text: welcome,
    reply_markup: menuKeyboard(),
  });
}
