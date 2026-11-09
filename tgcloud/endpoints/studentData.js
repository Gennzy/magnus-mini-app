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
  if (input?.action === 'load') {
    const row = await db.select({ payload: studentData.payload })
      .from(studentData)
      .where(eq(studentData.tgId, tgId))
      .get();
    return row?.payload || { assignmentDrafts: {}, lessonNotes: {} };
  }

  if (input?.action === 'save') {
    const payload = {
      assignmentDrafts: cleanMap(input.assignmentDrafts),
      lessonNotes: cleanMap(input.lessonNotes),
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
