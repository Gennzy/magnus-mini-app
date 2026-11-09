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
