import { table, text, json, integer } from 'sdk/db';

// Учебные данные привязаны к Telegram ID и доступны на разных устройствах.
export const studentData = table('student_data', {
  tgId: text('tg_id').primaryKey(),
  payload: json('payload').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
