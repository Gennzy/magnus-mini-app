import { table, text, json, integer } from 'sdk/db';

// Учебные данные привязаны к Telegram ID и доступны на разных устройствах.
export const studentData = table('student_data', {
  tgId: text('tg_id').primaryKey(),
  payload: json('payload').notNull(),
  updatedAt: integer('updated_at').notNull(),
});


// Администраторы добавляются только владельцем проекта через CLI; Telegram ID сам по себе не даёт права доступа.
export const adminUsers = table("admin_users", {
  tgId: text("tg_id").primaryKey(),
  email: text("email").notNull(),
  role: text("role").notNull().default("admin"),
  linkedAt: integer("linked_at").notNull(),
  active: integer("active").notNull().default(1),
});

// Настройки Telegram-бота редактируются владельцем из админ-панели.
export const botSettings = table('bot_settings', {
  key: text('setting_key').primaryKey(),
  welcomeMessage: text('welcome_message').notNull(),
  description: text('description').notNull(),
  shortDescription: text('short_description').notNull(),
  menuButtonText: text('menu_button_text').notNull(),
  updatedAt: integer('updated_at').notNull(),
  updatedBy: text('updated_by').notNull(),
});

// Неизменяемая история административных действий для контроля изменений.
export const adminAuditLog = table('admin_audit_log', {
  id: text('id').primaryKey(),
  action: text('action').notNull(),
  actorTgId: text('actor_tg_id').notNull(),
  actorEmail: text('actor_email').notNull(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  summary: text('summary').notNull(),
  details: json('details').notNull(),
  createdAt: integer('created_at').notNull(),
});

// Исходящие сообщения студентам из защищённой панели администратора.
export const adminMessages = table('admin_messages', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull(),
  adminTgId: text('admin_tg_id').notNull(),
  adminEmail: text('admin_email').notNull(),
  messageText: text('message_text').notNull(),
  status: text('status').notNull(),
  telegramMessageId: integer('telegram_message_id'),
  errorMessage: text('error_message').notNull(),
  createdAt: integer('created_at').notNull(),
});

// Ручные учебные доступы. Оплата через платёжного провайдера подключается отдельно.
export const studentSubscriptions = table('student_subscriptions', {
  tgId: text('tg_id').primaryKey(),
  planId: text('plan_id').notNull(),
  status: text('status').notNull(),
  startsAt: integer('starts_at').notNull(),
  endsAt: integer('ends_at').notNull(),
  source: text('source').notNull(),
  createdBy: text('created_by').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// Тарифы в Telegram Stars. Цена задаётся владельцем из админ-панели.
export const subscriptionPlans = table('subscription_plans', {
  planId: text('plan_id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  days: integer('days').notNull(),
  starsPrice: integer('stars_price').notNull(),
  enabled: integer('enabled').notNull(),
  updatedAt: integer('updated_at').notNull(),
  updatedBy: text('updated_by').notNull(),
});

// Платёжные заказы Telegram Stars с проверкой суммы и защитой от повторной активации.
export const paymentOrders = table('payment_orders', {
  id: text('id').primaryKey(),
  tgId: text('tg_id').notNull(),
  planId: text('plan_id').notNull(),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull(),
  status: text('status').notNull(),
  invoicePayload: text('invoice_payload').notNull(),
  telegramChargeId: text('telegram_charge_id').notNull(),
  providerChargeId: text('provider_charge_id').notNull(),
  createdAt: integer('created_at').notNull(),
  paidAt: integer('paid_at').notNull(),
});
