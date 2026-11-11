export const DEFAULT_SUBSCRIPTION_PLANS = [
  { planId: 'monthly-30d', title: 'MAGNUS · 30 дней', description: 'Доступ к учебной программе MAGNUS на 30 дней.', days: 30, starsPrice: 0, enabled: 0 },
  { planId: 'quarterly-90d', title: 'MAGNUS · 90 дней', description: 'Доступ к учебной программе MAGNUS на 90 дней.', days: 90, starsPrice: 0, enabled: 0 },
  { planId: 'annual-365d', title: 'MAGNUS · 365 дней', description: 'Доступ к учебной программе MAGNUS на 365 дней.', days: 365, starsPrice: 0, enabled: 0 },
];

export function normalizePlan(row) {
  return {
    planId: String(row.planId || ''),
    title: String(row.title || '').slice(0, 32),
    description: String(row.description || '').slice(0, 255),
    days: Number(row.days) || 0,
    starsPrice: Math.max(0, Math.floor(Number(row.starsPrice) || 0)),
    enabled: Number(row.enabled) === 1 && Number(row.starsPrice) > 0 ? 1 : 0,
  };
}
