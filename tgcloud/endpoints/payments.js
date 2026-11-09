import { api, db } from 'sdk';
import { eq, desc } from 'sdk/db';
import { paymentOrders, studentData, studentSubscriptions, subscriptionPlans } from '../schema.js';
import { DEFAULT_SUBSCRIPTION_PLANS, normalizePlan } from '../lib/subscriptionPlans.js';

async function loadPlans() {
  const saved = await db.select().from(subscriptionPlans).all();
  const byId = new Map(saved.map(row => [row.planId, row]));
  return DEFAULT_SUBSCRIPTION_PLANS.map(fallback => normalizePlan(byId.get(fallback.planId) || fallback));
}

export default async function (input, ctx) {
  const user = ctx.initData?.user;
  if (!user?.id) return { ok: false, code: 'UNAUTHORIZED' };
  const tgId = String(user.id);

  if (input?.action === 'plans') {
    const plans = await loadPlans();
    return { ok: true, plans: plans.filter(plan => plan.enabled) };
  }

  if (input?.action === 'history') {
    const orders = await db.select().from(paymentOrders)
      .where(eq(paymentOrders.tgId, tgId)).orderBy(desc(paymentOrders.createdAt)).limit(30).all();
    const savedPlans = await db.select().from(subscriptionPlans).all();
    const planTitles = new Map(savedPlans.map(row => [row.planId, row.title]));
    return {
      ok: true,
      orders: orders.map(order => ({
        id: order.id, planId: order.planId,
        planTitle: planTitles.get(order.planId) || DEFAULT_SUBSCRIPTION_PLANS.find(plan => plan.planId === order.planId)?.title || order.planId,
        amount: Number(order.amount) || 0, currency: order.currency, status: order.status,
        createdAt: Number(order.createdAt) || 0, paidAt: Number(order.paidAt) || 0,
      })),
    };
  }

  if (input?.action === 'createInvoice') {
    const planId = String(input.planId || '');
    const plan = (await loadPlans()).find(item => item.planId === planId && item.enabled && item.starsPrice > 0);
    if (!plan) return { ok: false, code: 'PLAN_UNAVAILABLE', message: 'Этот тариф сейчас недоступен.' };
    const student = await db.select({ tgId: studentData.tgId }).from(studentData)
      .where(eq(studentData.tgId, tgId)).get();
    if (!student) return { ok: false, code: 'STUDENT_NOT_FOUND', message: 'Сначала открой MAGNUS через Telegram, затем повтори покупку.' };

    const now = Math.floor(Date.now() / 1000);
    const id = 'ord-' + now + '-' + Math.random().toString(36).slice(2, 12);
    const invoicePayload = 'magnus:' + id;
    await db.insert(paymentOrders).values({
      id, tgId, planId: plan.planId, amount: plan.starsPrice, currency: 'XTR',
      status: 'pending', invoicePayload, telegramChargeId: '', providerChargeId: '',
      createdAt: now, paidAt: 0,
    }).run();

    try {
      const invoiceLink = await api.createInvoiceLink({
        title: plan.title,
        description: plan.description,
        payload: invoicePayload,
        provider_token: '',
        currency: 'XTR',
        prices: [{ label: plan.title, amount: plan.starsPrice }],
      });
      return { ok: true, invoiceLink, plan: { planId: plan.planId, title: plan.title, days: plan.days, starsPrice: plan.starsPrice } };
    } catch (error) {
      await db.update(paymentOrders).set({ status: 'invoice_failed' }).where(eq(paymentOrders.id, id)).run();
      console.error('MAGNUS: не удалось создать ссылку оплаты Telegram Stars.', error);
      return { ok: false, code: 'INVOICE_FAILED', message: 'Telegram не смог создать счёт. Попробуй позже.' };
    }
  }

  return { ok: false, code: 'UNKNOWN_ACTION' };
}
