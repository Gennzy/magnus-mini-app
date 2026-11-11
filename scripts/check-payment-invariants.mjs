import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const plans = read("tgcloud/lib/subscriptionPlans.js");
const payments = read("tgcloud/endpoints/payments.js");
const preCheckout = read("tgcloud/handlers/pre_checkout_query.js");
const message = read("tgcloud/handlers/message.js");
const admin = read("tgcloud/endpoints/admin.js");
const studentData = read("tgcloud/endpoints/studentData.js");
const main = read("src/main.js");
const deployWorkflow = read(".github/workflows/deploy-telegram.yml");

const failures = [];
function check(condition, label) {
  if (!condition) failures.push(label);
}

const defaults = [...plans.matchAll(/planId:\s*'([^']+)'[^\n]*starsPrice:\s*(\d+)[^\n]*enabled:\s*(\d+)/g)]
  .map(match => ({ id: match[1], price: Number(match[2]), enabled: Number(match[3]) }));
check(defaults.length === 3, "Ожидались ровно три тарифных значения по умолчанию.");
check(defaults.every(plan => plan.price === 0 && plan.enabled === 0), "Тарифы по умолчанию должны иметь цену 0 и быть выключены.");

const saveStart = admin.indexOf("if (input?.action === 'savePaymentPlans')");
const saveEnd = admin.indexOf("if (input?.action === 'paymentOrders')", saveStart);
const saveBlock = saveStart >= 0 && saveEnd > saveStart ? admin.slice(saveStart, saveEnd) : "";
const firstWrite = saveBlock.indexOf("await db.insert(subscriptionPlans)");
check(saveBlock.includes("admin.role !== 'owner'"), "Изменять цены должен только владелец.");
check(saveBlock.includes("incoming.has(planId)"), "Повторяющиеся тарифы должны отклоняться.");
check(saveBlock.includes("incoming.size !== allowed.size"), "Должен проверяться полный набор тарифов.");
check(saveBlock.includes("item.enabled === true || item.enabled === 1"), "Флаг включения должен приниматься только в строгом формате.");
check(firstWrite > saveBlock.indexOf("if (incoming.size"), "Все записи должны быть проверены до первой записи в БД.");

check(payments.includes("const user = ctx.initData?.user"), "Платёжный endpoint должен брать пользователя только из проверенного initData.");
check(payments.includes("const tgId = String(user.id)"), "Владелец платёжной истории должен определяться сервером.");
check(payments.includes(".where(eq(paymentOrders.tgId, tgId))"), "История студента должна фильтроваться по проверенному Telegram ID.");
check(payments.includes("item.enabled && item.starsPrice > 0"), "Счёт можно создавать только для включённого тарифа с положительной ценой.");
check(!payments.includes("input.telegramId"), "Платёжный endpoint не должен принимать Telegram ID владельца из payload.");

check(preCheckout.includes("String(order.tgId) !== userId"), "Pre-checkout должен проверять владельца счёта.");
check(preCheckout.includes("query.currency !== 'XTR'"), "Pre-checkout должен проверять валюту Stars.");
check(preCheckout.includes("Number(query.total_amount) !== Number(order.amount)"), "Pre-checkout должен сверять точную сумму.");
check(preCheckout.includes("!plan.enabled || plan.starsPrice !== Number(order.amount)"), "Pre-checkout должен сверять актуальный тариф.");

check(message.includes("String(message.from?.id || '')"), "Successful payment должен использовать Telegram sender ID.");
check(message.includes("payment.currency !== 'XTR'"), "Successful payment должен проверять валюту.");
check(message.includes("Number(payment.total_amount) !== Number(order.amount)"), "Successful payment должен сверять сумму.");
check(message.includes("!payment.telegram_payment_charge_id"), "Successful payment должен требовать Telegram charge ID.");
check(message.includes("eq(paymentOrders.status, 'pending')"), "Повторное событие не должно повторно захватывать оплаченный заказ.");
check(!message.includes("refundStarPayment") && !payments.includes("refundStarPayment"), "Возвраты Stars не должны включаться без отдельной модели периодов.");

const adminGuard = admin.indexOf("if (!admin?.active)");
const ledgerAction = admin.indexOf("if (input?.action === 'paymentOrders')");
check(adminGuard >= 0 && ledgerAction > adminGuard, "Платёжный реестр должен находиться за проверкой активной роли администратора.");

const paymentPageStart = main.indexOf("function adminPaymentPlansPage()");
const paymentPageEnd = main.indexOf("\nfunction loadAdminSupport()", paymentPageStart);
const paymentPage = paymentPageStart >= 0 && paymentPageEnd > paymentPageStart
  ? main.slice(paymentPageStart, paymentPageEnd) : "";
check(paymentPage.includes('adminAccess.role==="owner"'), "UI настройки тарифов должен различать владельца и администратора.");
check(paymentPage.includes("Настройки цен и доступности доступны только владельцу проекта"), "Обычный администратор должен видеть тарифы только для чтения.");

const accessStart = studentData.indexOf("function academicAccessError");
const accessEnd = studentData.indexOf("\nfunction parseAcademicRecord", accessStart);
const academicAccess = accessStart >= 0 && accessEnd > accessStart
  ? studentData.slice(accessStart, accessEnd) : "";
check(academicAccess.length > 0 && !academicAccess.includes("subscription"), "Демонстрационные материалы не должны блокироваться подпиской.");

check(deployWorkflow.includes("workflow_dispatch:") && !/^\s*push:/m.test(deployWorkflow), "Публикация Telegram Cloud должна оставаться ручной.");
check(!deployWorkflow.includes("pages") && !deployWorkflow.includes("github-pages"), "Deploy workflow не должен включать GitHub Pages.");

if (failures.length) {
  for (const failure of failures) console.error("FAIL:", failure);
  process.exitCode = 1;
} else {
  console.log("MAGNUS payment safety invariants: OK");
  console.log(JSON.stringify({
    defaultPlans: defaults.length,
    defaultPricesZeroAndDisabled: true,
    ownerOnlyPricing: true,
    validateAllPlansBeforeWrites: true,
    verifiedTelegramOwnership: true,
    starsPreCheckoutAndChargeValidation: true,
    noRefundImplementation: true,
    demoContentNotSubscriptionGated: true,
    telegramDeploymentManualOnly: true,
  }, null, 2));
}
