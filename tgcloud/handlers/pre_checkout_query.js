import { api, db } from 'sdk';
import { eq } from 'sdk/db';
import { paymentOrders, subscriptionPlans } from '../schema.js';
import { DEFAULT_SUBSCRIPTION_PLANS, normalizePlan } from '../lib/subscriptionPlans.js';

export default async function (query) {
  const queryId = query.id;
  const userId = String(query.from?.id || '');
  const payload = String(query.invoice_payload || '');
  let errorMessage = '';

  try {
    const order = payload.startsWith('magnus:')
      ? await db.select().from(paymentOrders).where(eq(paymentOrders.invoicePayload, payload)).get()
      : null;
    const savedPlan = order
      ? await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.planId, order.planId)).get()
      : null;
    const fallback = DEFAULT_SUBSCRIPTION_PLANS.find(plan => plan.planId === order?.planId);
    const plan = savedPlan ? normalizePlan(savedPlan) : fallback ? normalizePlan(fallback) : null;

    if (!order || order.status !== 'pending') errorMessage = 'Счёт уже использован или больше не действует. Создай новый.';
    else if (String(order.tgId) !== userId) errorMessage = 'Этот счёт создан для другого Telegram-аккаунта.';
    else if (query.currency !== 'XTR' || Number(query.total_amount) !== Number(order.amount)) errorMessage = 'Сумма счёта не совпадает. Создай новый счёт.';
    else if (!plan || !plan.enabled || plan.starsPrice !== Number(order.amount)) errorMessage = 'Этот тариф больше недоступен.';
  } catch (error) {
    console.error('MAGNUS: ошибка проверки pre-checkout.', error);
    errorMessage = 'Не удалось проверить заказ. Попробуй создать счёт ещё раз.';
  }

  try {
    await api.answerPreCheckoutQuery({
      pre_checkout_query_id: queryId,
      ok: !errorMessage,
      ...(errorMessage ? { error_message: errorMessage } : {}),
    });
  } catch (error) {
    console.error('MAGNUS: не удалось ответить на pre-checkout query.', error);
  }
}
