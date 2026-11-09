import "./style.css";

const tg = window.Telegram?.WebApp;
tg?.ready?.();
tg?.expand?.();
tg?.setHeaderColor?.("#f7f7f5");
tg?.setBackgroundColor?.("#f7f7f5");

const telegramUser = tg?.initDataUnsafe?.user;
const firstName = telegramUser?.first_name || "друг";
const username = telegramUser?.username ? `@${telegramUser.username}` : "Студент MAGNUS";
const avatarLetter = telegramUser?.first_name?.trim().charAt(0).toUpperCase() || "M";
const telegramPhotoUrl = telegramUser?.photo_url || "";

const faculties = [
  { id:"psychology", num:"01", name:"Психология", en:"PSYCHOLOGY", desc:"Понимание человека, мышления и поведения", symbol:"◉", color:"lavender", topics:["Общая психология","Психология личности","Коммуникация и общество"] },
  { id:"management", num:"02", name:"Менеджмент", en:"MANAGEMENT", desc:"Управление командами и организациями", symbol:"↗", color:"peach", topics:["Основы менеджмента","Стратегическое мышление","Управление проектами"] },
  { id:"it", num:"03", name:"Информационные технологии", en:"INFORMATION TECHNOLOGY", desc:"Цифровые продукты и технологии будущего", symbol:"⌘", color:"blue", topics:["Основы программирования","Цифровые продукты","Искусственный интеллект"] },
  { id:"economics", num:"04", name:"Экономика и финансы", en:"ECONOMICS & FINANCE", desc:"Экономические системы и финансовая грамотность", symbol:"₸", color:"mint", topics:["Экономическая теория","Финансовая грамотность","Анализ рынков"] },
  { id:"marketing", num:"05", name:"Маркетинг", en:"MARKETING", desc:"Бренды, аудитории и коммуникации", symbol:"✳", color:"yellow", topics:["Бренд-стратегия","Исследование аудитории","Цифровые коммуникации"] },
  { id:"humanities", num:"06", name:"Гуманитарные науки", en:"HUMANITIES", desc:"История, культура и идеи", symbol:"⌂", color:"rose", topics:["История идей","Культура и общество","Критическое мышление"] }
];

const courses = [
  { id:"ai", title:"Введение в искусственный интеллект", category:"Технологии", lesson:"Урок 04 · Нейросети вокруг нас", color:"course-ai", mark:"AI" },
  { id:"mind", title:"Психология мышления", category:"Психология", lesson:"Урок 02 · Как мы принимаем решения", color:"course-mind", mark:"ψ" },
  { id:"brand", title:"Основы бренд-стратегии", category:"Маркетинг", lesson:"Урок 01 · Сила позиционирования", color:"course-brand", mark:"M" }
];

const curriculum = {"ai":[["ai-01","Что такое искусственный интеллект","Введение",12,"ИИ — область информатики, в которой создают системы для задач, обычно требующих человеческого анализа: распознавания изображений, понимания текста и поиска закономерностей.","Не один алгоритм","ИИ включает разные подходы: от заданных человеком правил до моделей, которые находят закономерности в данных.","Границы возможностей","Результат зависит от задачи, данных и качества модели. Система может ошибаться, поэтому важные выводы нужно проверять.","Что точнее всего описывает современную систему ИИ?",["Универсальный разум","Система для определённых задач на основе алгоритмов и данных","Программа без ошибок"],1],["ai-02","Данные и машинное обучение","Теория",16,"Машинное обучение находит закономерности в примерах. Разработчик подготавливает данные и задаёт способ оценки результата.","Обучающая выборка","На этих примерах модель настраивает параметры. Данные должны отражать задачу и не содержать систематических перекосов.","Проверка модели","Отдельная тестовая выборка показывает, как модель работает на ранее не встречавшихся примерах.","Зачем разделять обучающую и тестовую выборки?",["Скрыть данные от разработчика","Проверить качество на новых для модели примерах","Увеличить размер модели"],1],["ai-03","Как оценивать ответы ИИ","Практика",14,"Даже убедительно сформулированный ответ модели может содержать неточности. Проверка результата — часть работы с ИИ.","Проверяйте факты","Сопоставляйте цифры, даты и цитаты с первоисточниками. Уверенный тон не является доказательством.","Учитывайте контекст","Модель может не знать важных деталей ситуации. Уточняйте ограничения и проверяйте выводы.","Как поступить с важным фактом из ответа ИИ?",["Использовать без проверки","Проверить по надёжному первоисточнику","Считать верным по тону"],1]],"mind":[["mind-01","Как внимание отбирает информацию","Введение",13,"Внимание выделяет важную информацию из множества сигналов. Мы не можем одинаково глубоко обрабатывать всё происходящее вокруг.","Избирательность","На выбор влияют цель, интерес, новизна и эмоциональная значимость стимула.","Переключение","Частые переключения требуют времени на возвращение к прежнему контексту и повышают вероятность ошибок.","Что происходит при частом переключении задач?",["Ничего не меняется","Тратится время на восстановление контекста","Качество всегда растёт"],1],["mind-02","Эмоции и принятие решений","Теория",15,"Эмоции участвуют в оценке ситуации. Они помогают замечать значимые события, но влияют на то, какие факторы мы замечаем.","Эмоциональный сигнал","Чувства могут указывать на важность события, риск или потребность — это информация, которую полезно учитывать.","Пауза перед выбором","При сильном возбуждении полезно назвать эмоцию, выписать факты и сравнить варианты.","Что помогает принять взвешенное решение при сильной эмоции?",["Игнорировать факты","Сделать паузу и оценить факты и варианты","Выбрать первый вариант"],1],["mind-03","Когнитивные искажения","Практика",17,"Когнитивные искажения — устойчивые способы упрощать обработку информации. Иногда они приводят к систематическим ошибкам.","Подтверждающее смещение","Мы охотнее замечаем сведения, которые поддерживают уже имеющееся мнение.","Эффект доступности","Яркий или недавний пример может казаться более распространённым, чем он есть.","Что помогает снизить подтверждающее смещение?",["Читать только согласные мнения","Искать данные против своей гипотезы","Не менять мнение"],1]],"brand":[["brand-01","Что такое позиционирование","Введение",12,"Позиционирование описывает место бренда в восприятии аудитории относительно альтернатив. Оно помогает понять, для кого существует продукт и чем отличается.","Аудитория","Сначала определяют группу людей, чью задачу продукт решает.","Отличие","Сильное отличие важно аудитории и подтверждается продуктом или опытом взаимодействия.","Что лежит в основе позиционирования?",["Только логотип","Потребность аудитории и значимое отличие","Количество рекламы"],1],["brand-02","Исследование целевой аудитории","Теория",16,"Исследование помогает понять реальные задачи, мотивы и барьеры людей. Оно опирается на наблюдения и данные, а не только на предположения.","Вопросы о поведении","Полезнее спрашивать о последнем реальном опыте покупки или использования, чем о гипотетических намерениях.","Проверка гипотез","Интервью помогают понять причины, количественные данные — оценить распространённость наблюдений.","Какой вопрос полезнее для интервью?",["Купили бы идеальный продукт?","Расскажите о последнем случае решения этой задачи","Вам нравится идея?"],1],["brand-03","Сообщение и доказательства бренда","Практика",14,"Коммуникация бренда должна ясно объяснять ценность предложения. Обещание убедительно, когда его подтверждают свойства продукта и опыт клиентов.","Одно главное сообщение","Сформулируйте мысль, которая отвечает аудитории: почему стоит обратить внимание на предложение.","Конкретные доказательства","Функции, условия, примеры и прозрачные цифры могут подтвердить обещание.","Что делает обещание бренда убедительнее?",["Необычная фраза","Проверяемое доказательство в продукте или опыте","Повтор обещания"],1]]};
function courseLessons(courseId){return curriculum[courseId]||[];}
function selectedLesson(){return courseLessons(selectedCourse.id).find(item=>item[0]===selectedLessonId)||courseLessons(selectedCourse.id)[0];}
function courseCompletionCount(courseId){return courseLessons(courseId).filter(item=>completedLessons[item[0]]).length;}

const assignments = [
  {
    id:"ai-case",
    title:"Практическая работа: разбор кейса",
    course:"Введение в искусственный интеллект",
    type:"Практика",
    due:"Не установлен",
    estimate:"20–30 минут",
    description:"Разберите короткий сценарий использования искусственного интеллекта и объясните, какую задачу технология решает, какие данные ей нужны и где может возникнуть ошибка.",
    requirements:["Опишите задачу своими словами.","Назовите один возможный риск или ограничение.","Предложите способ проверить результат."]
  },
  {
    id:"mind-reflection",
    title:"Рефлексия: как мы принимаем решения",
    course:"Психология мышления",
    type:"Короткий ответ",
    due:"Не установлен",
    estimate:"10–15 минут",
    description:"Вспомните повседневное решение, которое вы недавно приняли. Кратко опишите, какие факторы повлияли на выбор и какую роль сыграли эмоции или привычки.",
    requirements:["Опишите ситуацию в 2–3 предложениях.","Выделите два фактора, повлиявших на решение.","Сформулируйте один вывод."]
  },
  {
    id:"brand-review",
    title:"Мини-анализ узнаваемого бренда",
    course:"Основы бренд-стратегии",
    type:"Анализ",
    due:"Не установлен",
    estimate:"25–30 минут",
    description:"Выберите знакомый бренд и опишите, какое первое впечатление он создаёт, кому адресовано его предложение и что помогает отличить его от конкурентов.",
    requirements:["Укажите выбранный бренд.","Опишите его аудиторию.","Назовите один элемент позиционирования."]
  }
];

let adminAccess = { loading: true, isAdmin: false, role: null };
let adminDashboard = null, adminTab = "overview", adminLoading = false, adminError = "";
let adminAuditEntries = [], adminAuditLoading = false, adminAuditError = "";
let adminStudents = [], adminStudentsLoading = false, adminStudentsError = "";
let adminPaymentOrders = [], adminPaymentOrdersLoading = false, adminPaymentOrdersError = "";
let adminPaymentOrderSummary = { paidOrders: 0, paidStars: 0, pendingOrders: 0 };
let studentPaymentHistory = [], studentPaymentHistoryLoading = false, studentPaymentHistoryError = "";
let adminPaymentPlans = [], adminPaymentPlansLoading = false, adminPaymentPlansError = "";
let adminStudentSelected = "", adminStudentDetail = null, adminStudentDetailLoading = false, adminStudentDetailError = "";
let currentPage = new URLSearchParams(window.location.search).get("admin") === "1" ? "admin" : "home";
let selectedFaculty = faculties[0];
let selectedCourse = courses[0];
let selectedLessonId = "ai-01";
let lessonTab = "lesson";
let quizChoice = "";
let searchValue = "";
let activeFilter = "Все";
let selectedAssignmentId = assignments[0].id;
let activeAssignmentFilter = "Все";
let assignmentDrafts = loadAssignmentDrafts();
let assignmentSubmissions = loadAssignmentSubmissions();
let lessonNotes = loadLessonNotes();
let interestedFaculties = loadInterestedFaculties();
let lessonQuizResults = loadLessonQuizResults();
let completedLessons = loadCompletedLessons();
let studentSubscription = { status: 'none', planId: '', startsAt: 0, endsAt: 0 };
let availableSubscriptionPlans = [];
let paymentPlansLoading = false;
let paymentPlansError = '';
let toastTimer;
let cloudSyncTimer;
let cloudSyncReady = false;

const esc = (v) => String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const icon = (name, cls="") => {
  const paths = {
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z"/>',
    faculty:'<path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z"/><path d="M6.5 10.5v5c3.5 2.5 7.5 2.5 11 0v-5M21 9v6"/>',
    study:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5v-12Z"/><path d="M4 6h13M8 9h8M8 13h8"/>',
    docs:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 12h6M9 16h6"/>',
    profile:'<circle cx="12" cy="8" r="3.5"/><path d="M4 21c.7-4 3.4-6 8-6s7.3 2 8 6"/>',
    bell:'<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
    search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    cloud:'<path d="M7 18a4 4 0 1 1 .7-7.94A5.5 5.5 0 0 1 18.4 9 4.5 4.5 0 0 1 18 18H7Z"/>',
    chart:'<path d="M4 19V5M4 19h16M8 15v-4M13 15V7M18 15V4"/>',
    play:'<path d="m9 6 9 6-9 6V6Z"/>',
    back:'<path d="m15 18-6-6 6-6"/>',
    refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9a7 7 0 0 1 11.7-2L20 12M4 12l2.7 5a7 7 0 0 0 11.7-2"/>'
  };
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
};

function avatarContent() {
  return `<span class="avatar-fallback">${esc(avatarLetter)}</span>${telegramPhotoUrl ? `<img src="${esc(telegramPhotoUrl)}" alt="Фото профиля Telegram" class="telegram-avatar-image" referrerpolicy="no-referrer" onerror="this.remove()">` : ""}`;
}

function topbar() {
  return `<header class="topbar">
    <button class="brand" data-go="home" aria-label="MAGNUS — главная"><span class="brand-symbol" aria-hidden="true"><svg viewBox="0 0 48 48" role="presentation"><path d="M8 17C8 8 14 5 20 10c2-2 6-2 8 0 6-5 12-2 12 7v11c0 9-7 15-16 15S8 37 8 28V17Z" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/><path d="M10 14 6 7l10 3M38 14l4-7-10 3" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="23" r="6.3" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="30" cy="23" r="6.3" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="18" cy="23" r="2.2" fill="currentColor"/><circle cx="30" cy="23" r="2.2" fill="currentColor"/><path d="m21 33 3-3 3 3-3 3-3-3Z" fill="currentColor"/></svg></span><span class="brand-copy"><b>MAGNUS</b><small>UNIVERSITY</small></span></button>
    <div class="top-actions"><button class="icon-button" data-action="notifications" aria-label="Уведомления">${icon("bell")}</button><button class="avatar-button" data-go="profile" aria-label="Профиль">${avatarContent()}</button></div>
  </header>`;
}

function bottomNav() {
  const items = [["home","home","Главная"],["faculties","faculty","Факультеты"],["study","study","Обучение"],["documents","docs","Документы"],["profile","profile","Профиль"]];
  return `<nav class="bottom-nav">${items.map(([id,ic,label]) => `<button data-go="${id}" class="nav-item ${currentPage===id || (currentPage==="facultyDetail"&&id==="faculties") || (currentPage==="courseDetail"&&id==="study") || (currentPage==="lesson"&&id==="study") || (currentPage==="assignments"&&id==="study") || (currentPage==="assignmentDetail"&&id==="study")?"active":""}">${icon(ic)}<span>${label}</span></button>`).join("")}</nav>`;
}

function heading(kicker, title, desc="") {
  return `<div class="page-heading"><div class="kicker">${kicker}</div><h1>${title}</h1>${desc?`<p>${desc}</p>`:""}</div>`;
}

function courseArtwork(c) {
  const drawings = {
    ai: `<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
      <path d="M38 78 78 42l42 26 42-38M78 42l5 75 37-49 32 54M38 78l45 39 79 17 37-65M120 68l32-30 40 29" stroke-width="2.2" opacity=".72"/>
      <path d="m66 99 17-57 37 26 42-38" stroke-width="1" opacity=".45"/>
      <circle cx="38" cy="78" r="9" fill="currentColor" fill-opacity=".18" stroke-width="2.5"/>
      <circle cx="78" cy="42" r="7" fill="currentColor" fill-opacity=".18" stroke-width="2.5"/>
      <circle cx="120" cy="68" r="10" fill="currentColor" fill-opacity=".22" stroke-width="2.5"/>
      <circle cx="162" cy="30" r="7" fill="currentColor" fill-opacity=".18" stroke-width="2.5"/>
      <circle cx="202" cy="61" r="8" fill="currentColor" fill-opacity=".18" stroke-width="2.5"/>
      <circle cx="83" cy="117" r="8" fill="currentColor" fill-opacity=".18" stroke-width="2.5"/>
      <circle cx="157" cy="122" r="6" fill="currentColor" fill-opacity=".18" stroke-width="2.5"/>
    </g>`,
    mind: `<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
      <path d="M120 25c-19-17-46-5-47 18-25 2-36 27-22 46-13 24 2 47 25 47 8 20 31 22 44 8 14 14 36 12 44-8 23 0 38-23 25-47 14-19 3-44-22-46-1-23-28-35-47-18Z" stroke-width="3" opacity=".88"/>
      <path d="M120 28v109M119 52c-20-18-39-2-29 17-18 13-11 34 8 35-4 17 9 25 21 20M121 52c20-18 39-2 29 17 18 13 11 34-8 35 4 17-9 25-21 20" stroke-width="2" opacity=".7"/>
      <circle cx="91" cy="69" r="5" fill="currentColor" fill-opacity=".2"/><circle cx="149" cy="69" r="5" fill="currentColor" fill-opacity=".2"/>
      <circle cx="98" cy="104" r="4" fill="currentColor" fill-opacity=".2"/><circle cx="142" cy="104" r="4" fill="currentColor" fill-opacity=".2"/>
    </g>`,
    brand: `<g fill="none" stroke="currentColor" stroke-linejoin="round">
      <path d="m120 13 19 39 42-14-14 42 40 20-40 20 14 42-42-14-19 39-20-39-41 14 14-42-40-20 40-20-14-42 41 14 20-39Z" stroke-width="2.2" opacity=".7"/>
      <path d="m120 43 15 30 33 5-24 24 6 34-30-16-30 16 6-34-24-24 33-5 15-30Z" stroke-width="2.6"/>
      <circle cx="120" cy="102" r="19" stroke-width="2.2"/>
      <path d="M120 90v24m-12-12h24" stroke-width="2.4" stroke-linecap="round"/>
    </g>`
  };
  return `<svg class="course-art-illustration" viewBox="0 0 240 190" fill="none" aria-hidden="true">${drawings[c.id] || drawings.ai}</svg>`;
}

function courseTile(c, compact=false) {
  return `<article class="course-card ${compact?"compact":""}">
    <div class="course-art ${c.color}" data-course-art="${c.id}">${courseArtwork(c)}<span class="course-art-mark">${c.mark}</span></div>
    <div class="course-details"><div class="course-meta"><span>${esc(c.category)}</span><span>Пример курса</span></div><h3>${esc(c.title)}</h3><p>${esc(c.lesson)}</p><div class="course-card-footer"><span>Ознакомительная программа</span><button data-course="${c.id}">Подробнее ${icon("arrow")}</button></div></div>
  </article>`;
}



const studentStorageScope = telegramUser?.id
  ? `telegram-${String(telegramUser.id)}`
  : "guest";

function studentStorageKey(kind) {
  return `magnus.${studentStorageScope}.${kind}`;
}

function readStudentStorage(kind) {
  try {
    const value = JSON.parse(window.localStorage.getItem(studentStorageKey(kind)) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}
function writeStudentStorage(kind, value) {
  try {
    window.localStorage.setItem(studentStorageKey(kind), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
function loadAssignmentSubmissions() { return readStudentStorage("assignmentSubmissions"); }
function storeAssignmentSubmissions() { return writeStudentStorage("assignmentSubmissions", assignmentSubmissions); }
function loadAssignmentDrafts() {
  return readStudentStorage("assignmentDrafts");
}
function storeAssignmentDrafts() {
  return writeStudentStorage("assignmentDrafts", assignmentDrafts);
}
function loadLessonNotes() {
  return readStudentStorage("lessonNotes");
}
function storeLessonNotes() {
  return writeStudentStorage("lessonNotes", lessonNotes);
}
function loadInterestedFaculties() {
  return readStudentStorage("interestedFaculties");
}
function storeInterestedFaculties() {
  return writeStudentStorage("interestedFaculties", interestedFaculties);
}
function loadLessonQuizResults() { return readStudentStorage("lessonQuizResults"); }
function storeLessonQuizResults() { return writeStudentStorage("lessonQuizResults", lessonQuizResults); }
function loadCompletedLessons() { return readStudentStorage("completedLessons"); }
function storeCompletedLessons() { return writeStudentStorage("completedLessons", completedLessons); }
function callCloudStudentData(action, payload, callback) {
  const serverless = tg?.Serverless;
  if (typeof serverless?.call !== "function") return false;
  serverless.call("studentData", { action, ...payload }, (error, result) => {
    if (typeof callback === "function") callback(error, result);
  });
  return true;
}

function callPaymentApi(action,payload,callback){
 const serverless=tg?.Serverless;
 if(typeof serverless?.call!=="function")return false;
 serverless.call("payments",{action,...payload},(error,result)=>{if(typeof callback==="function")callback(error,result);});
 return true;
}
function loadPaymentPlans(){
 if(!telegramUser?.id||paymentPlansLoading)return;
 paymentPlansLoading=true;
 callPaymentApi("plans",{},(error,result)=>{
  paymentPlansLoading=false;
  if(!error&&result?.ok){availableSubscriptionPlans=Array.isArray(result.plans)?result.plans:[];paymentPlansError='';}
  else paymentPlansError=error?.message||result?.message||'Не удалось загрузить тарифы.';
  if(currentPage==="profile")render();
 });
}
function loadStudentPaymentHistory(){
  if(!telegramUser?.id||studentPaymentHistoryLoading)return;
  studentPaymentHistoryLoading=true;studentPaymentHistoryError="";
  const called=callPaymentApi("history",{},(error,result)=>{
    studentPaymentHistoryLoading=false;
    if(error||!result?.ok){studentPaymentHistory=[];studentPaymentHistoryError=error?.message||result?.message||"Не удалось загрузить историю оплат.";}
    else{studentPaymentHistory=Array.isArray(result.orders)?result.orders:[];studentPaymentHistoryError="";}
    if(currentPage==="profile")render();
  });
  if(!called){studentPaymentHistoryLoading=false;studentPaymentHistoryError="История доступна при открытии MAGNUS через Telegram.";if(currentPage==="profile")render();}
}
function paymentStatusLabel(status){return status==="paid"?"Оплачено":status==="pending"?"Ожидает оплаты":status==="processing"?"Обрабатывается":status==="invoice_failed"?"Счёт не создан":"Не завершено";}
function studentPaymentHistorySection(){
  if(!telegramUser?.id)return "";
  const rows=studentPaymentHistory.map(order=>{
    const timestamp=order.paidAt||order.createdAt;
    const date=timestamp?new Date(timestamp*1000).toLocaleString("ru-RU",{dateStyle:"medium",timeStyle:"short"}):"Дата не указана";
    const amount=Number(order.amount)>0?Number(order.amount)+" ⭐":"—";
    const state=order.status==="paid"?"paid":"";
    return "<article class=profile-payment-row><div><b>"+esc(order.planTitle||order.planId||"Учебный доступ")+"</b><small>"+esc(date)+" · заказ "+esc(String(order.id||"").slice(-8))+"</small></div><strong>"+esc(amount)+"</strong><span class=profile-payment-status "+state+">"+esc(paymentStatusLabel(order.status))+"</span></article>";
  }).join("");
  const content=studentPaymentHistoryLoading&&!studentPaymentHistory.length?"<div class=profile-payment-empty>Загружаем историю…</div>":studentPaymentHistoryError?"<div class=profile-payment-empty>"+esc(studentPaymentHistoryError)+"</div>":rows||"<div class=profile-payment-empty>Покупок пока нет.</div>";
  return "<section class=profile-payment-history><div class=profile-plans-heading><span class=subtle-label>ПЛАТЕЖИ</span><h2>История оплат</h2><p>Заказы этого Telegram-аккаунта.</p></div><div class=profile-payment-list>"+content+"</div><button class=profile-payment-refresh data-student-payment-refresh>Обновить историю</button></section>";
}

function purchaseSubscription(planId,button){
 if(!telegramUser?.id){toast("Оплата доступна только при открытии MAGNUS из Telegram.");return;}
 button.disabled=true;button.textContent="Создаём счёт…";
 const called=callPaymentApi("createInvoice",{planId},(error,result)=>{
  if(error||!result?.ok||!result.invoiceLink){button.disabled=false;button.textContent="Купить";toast(error?.message||result?.message||"Не удалось создать счёт.");return;}
  if(typeof tg?.openInvoice!=="function"){button.disabled=false;button.textContent="Купить";window.open(result.invoiceLink,"_blank","noopener");return;}
  tg.openInvoice(result.invoiceLink,(status)=>{
   button.disabled=false;button.textContent="Купить";
   if(status==="paid"){
     loadStudentPaymentHistory();
    toast("Telegram подтвердил оплату. Обновляем доступ…");
    callCloudStudentData("load",{},(loadError,data)=>{
     if(!loadError&&data?.subscription)studentSubscription=data.subscription;
     if(currentPage==="profile")render();
    });
   }else if(status==="failed")toast("Оплата не завершена. Попробуй ещё раз.");
  });
 });
 if(!called){button.disabled=false;button.textContent="Купить";toast("Открой MAGNUS через Telegram.");}
}
function callAdminApi(action,payload,callback){const serverless=tg?.Serverless;if(typeof serverless?.call!=="function")return false;serverless.call("admin",{action,...payload},(error,result)=>{if(typeof callback==="function")callback(error,result);});return true;}
function loadAdminAccess(openPanel=false){const called=callAdminApi("status",{},(error,result)=>{adminAccess={loading:false,isAdmin:!error&&Boolean(result?.isAdmin),role:result?.role||null};if(openPanel&&adminAccess.isAdmin)loadAdminDashboard();if(currentPage==="admin"||currentPage==="profile")render();});if(!called){adminAccess={loading:false,isAdmin:false,role:null};if(currentPage==="admin"||currentPage==="profile")render();}}
function loadAdminDashboard(){adminLoading=true;adminError="";if(currentPage==="admin")render();const called=callAdminApi("overview",{},(error,result)=>{adminLoading=false;if(error||!result?.ok){adminError=error?.message||result?.message||"Не удалось загрузить панель управления.";adminDashboard=null;}else{adminDashboard=result;adminError="";}if(currentPage==="admin")render();});if(!called){adminLoading=false;adminError="Открой MAGNUS через Telegram, чтобы подключить панель управления.";if(currentPage==="admin")render();}}
function loadAdminStudents(){
 adminStudentsLoading=true;adminStudentsError='';adminStudentSelected='';adminStudentDetail=null;
 if(currentPage==='admin')render();
 const called=callAdminApi('students',{},(error,result)=>{
  adminStudentsLoading=false;
  if(error||!result?.ok){adminStudents=[];adminStudentsError=error?.message||result?.message||'Не удалось загрузить список студентов.';}
  else{adminStudents=Array.isArray(result.students)?result.students:[];adminStudentsError='';}
  if(currentPage==='admin'&&adminTab==='students')render();
 });
 if(!called){adminStudentsLoading=false;adminStudentsError='Открой MAGNUS через Telegram, чтобы загрузить студентов.';if(currentPage==='admin')render();}
}
function loadAdminStudentDetail(studentId){
 adminStudentSelected=String(studentId||'');adminStudentDetail=null;adminStudentDetailLoading=true;adminStudentDetailError='';
 if(currentPage==='admin')render();
 const called=callAdminApi('studentDetail',{studentId:adminStudentSelected},(error,result)=>{
  adminStudentDetailLoading=false;
  if(error||!result?.ok){adminStudentDetailError=error?.message||result?.message||'Не удалось загрузить профиль студента.';adminStudentDetail=null;}
  else{adminStudentDetail=result;adminStudentDetailError='';}
  if(currentPage==='admin'&&adminTab==='students')render();
 });
 if(!called){adminStudentDetailLoading=false;adminStudentDetailError='Открой MAGNUS через Telegram, чтобы загрузить профиль.';if(currentPage==='admin')render();}
}
  loadAdminPaymentOrders();
function loadAdminPaymentPlans(){
 adminPaymentPlansLoading=true;adminPaymentPlansError='';
 if(currentPage==='admin')render();
 const called=callAdminApi('paymentPlans',{},(error,result)=>{
  adminPaymentPlansLoading=false;
  if(error||!result?.ok){adminPaymentPlans=[];adminPaymentPlansError=error?.message||result?.message||'Не удалось загрузить тарифы.';}
  else{adminPaymentPlans=Array.isArray(result.plans)?result.plans:[];adminPaymentPlansError='';}
  if(currentPage==='admin'&&adminTab==='payments')render();
 });
 if(!called){adminPaymentPlansLoading=false;adminPaymentPlansError='Открой панель из Telegram.';if(currentPage==='admin')render();}
}
function loadAdminPaymentOrders(){
  adminPaymentOrdersLoading=true;adminPaymentOrdersError="";
  const called=callAdminApi("paymentOrders",{},(error,result)=>{
    adminPaymentOrdersLoading=false;
    if(error||!result?.ok){adminPaymentOrders=[];adminPaymentOrdersError=error?.message||result?.message||"Не удалось загрузить платежи.";}
    else{adminPaymentOrders=Array.isArray(result.orders)?result.orders:[];adminPaymentOrderSummary=result.summary||adminPaymentOrderSummary;adminPaymentOrdersError="";}
    if(currentPage==="admin"&&adminTab==="payments")render();
  });
  if(!called){adminPaymentOrdersLoading=false;adminPaymentOrdersError="Платежи доступны при открытии панели из Telegram.";if(currentPage==="admin")render();}
}
function adminPaymentOrdersSection(){
  const summary=adminPaymentOrderSummary;
  const body=adminPaymentOrdersLoading&&!adminPaymentOrders.length?"<div class=admin-loading>Загружаем платежи…</div>":adminPaymentOrdersError?"<div class=admin-error>"+esc(adminPaymentOrdersError)+"</div>":adminPaymentOrders.length?adminPaymentOrders.map(order=>{
    const date=order.createdAt?new Date(order.createdAt*1000).toLocaleString("ru-RU",{dateStyle:"medium",timeStyle:"short"}):"Дата не указана";
    const charge=order.telegramChargeId?" · charge "+String(order.telegramChargeId).slice(-8):"";
    const state=order.status==="paid"?"paid":"";
    return "<article class=admin-order-row><div class=admin-order-main><b>"+esc(order.planTitle||order.planId)+"</b><small>Telegram ID "+esc(order.tgId)+" · "+esc(date)+"</small><small>Заказ "+esc(String(order.id||"").slice(-12))+esc(charge)+"</small></div><div class=admin-order-side><strong>"+esc(Number(order.amount)+" ⭐")+"</strong><span class=admin-order-status "+state+">"+esc(paymentStatusLabel(order.status))+"</span></div></article>";
  }).join(""):"<div class=admin-empty>Заказов пока нет.</div>";
  return "<section class=admin-payment-orders><div class=admin-section-head><div><span>ПЛАТЁЖНЫЙ РЕЕСТР</span><h2>Последние заказы</h2></div><button data-admin-payment-history-refresh>Обновить "+icon("refresh")+"</button></div><div class=admin-payment-summary><article><small>ПОДТВЕРЖДЕНО</small><b>"+Number(summary.paidOrders||0)+"</b></article><article><small>ПОЛУЧЕНО STARS</small><b>"+Number(summary.paidStars||0)+" ⭐</b></article><article><small>ОЖИДАЮТ</small><b>"+Number(summary.pendingOrders||0)+"</b></article></div><div class=admin-order-list>"+body+"</div><p class=admin-payment-footnote>Сводка рассчитана по последним 200 заказам. В сумму входят только подтверждённые оплаты.</p></section>";
}

function adminPaymentPlansPage(){
 if(adminPaymentPlansLoading)return '<section><div class="admin-loading">Загружаем тарифы…</div></section>'+adminPaymentOrdersSection();
 if(adminPaymentPlansError)return '<section><div class="admin-error">'+esc(adminPaymentPlansError)+'</div></section>'+adminPaymentOrdersSection();
 const labels={ 'monthly-30d':'30 дней','quarterly-90d':'90 дней','annual-365d':'365 дней' };
 return `<section class="admin-payment-plans"><div class="admin-section-head"><div><span>TELEGRAM STARS · XTR</span><h2>Тарифы MAGNUS</h2></div><button data-admin-payment-refresh>Обновить ${icon('refresh')}</button></div><p class="admin-payment-intro">Укажи стоимость каждого тарифа в Telegram Stars. Цена 0 или выключенный переключатель скрывает тариф от студентов. Оплата цифрового доступа внутри Telegram принимается только в Stars.</p><div class="admin-payment-plan-list">${adminPaymentPlans.map(plan=>`<article class="admin-payment-plan"><div><span>${esc(labels[plan.planId]||plan.title)}</span><b>${plan.starsPrice?plan.starsPrice+' ⭐':'Цена не задана'}</b></div><label>Цена, Stars<input type="number" min="0" max="100000" step="1" value="${Number(plan.starsPrice)||0}" data-payment-price="${esc(plan.planId)}"></label><label class="admin-payment-toggle"><input type="checkbox" data-payment-enabled="${esc(plan.planId)}" ${plan.enabled?'checked':''}> Показывать студентам</label></article>`).join('')}</div><div class="admin-settings-actions"><button class="orange-button" data-admin-payment-save>Сохранить тарифы</button><small>Доступ включается только после подтверждённого successful_payment от Telegram.</small></div></section>`+adminPaymentOrdersSection();
}
function loadAdminAudit(){
 adminAuditLoading=true;adminAuditError='';
 if(currentPage==='admin')render();
 const called=callAdminApi('auditLog',{},(error,result)=>{
  adminAuditLoading=false;
  if(error||!result?.ok){adminAuditEntries=[];adminAuditError=error?.message||result?.message||'Не удалось загрузить журнал действий.';}
  else{adminAuditEntries=Array.isArray(result.entries)?result.entries:[];adminAuditError='';}
  if(currentPage==='admin'&&adminTab==='audit')render();
 });
 if(!called){adminAuditLoading=false;adminAuditError='Журнал доступен при открытии MAGNUS через Telegram.';if(currentPage==='admin')render();}
}
function scheduleCloudStudentDataSync() {
  if (!cloudSyncReady) return;
  window.clearTimeout(cloudSyncTimer);
  cloudSyncTimer = window.setTimeout(() => {
    callCloudStudentData("save", {
      assignmentDrafts,
      lessonNotes,
      interestedFaculties,
      lessonQuizResults,
      completedLessons,
    }, (error) => {
      if (error) console.warn("MAGNUS: не удалось синхронизировать учебные данные.", error);
    });
  }, 900);
}

function initializeCloudStudentData() {
  callCloudStudentData("load", {}, (error, result) => {
    if (error || !result) {
      console.warn("MAGNUS: облачная синхронизация пока недоступна.", error || "");
      return;
    }
    const localAssignments = Object.keys(assignmentDrafts).length > 0;
    const localSubmissions = Object.keys(assignmentSubmissions).length > 0;
    const localNotes = Object.keys(lessonNotes).length > 0;
    const localInterests = Object.keys(interestedFaculties).length > 0;
    const localQuizResults = Object.keys(lessonQuizResults).length > 0;
    const localCompletedLessons = Object.keys(completedLessons).length > 0;
    assignmentDrafts = { ...(result.assignmentDrafts || {}), ...assignmentDrafts };
    assignmentSubmissions = { ...(result.assignmentSubmissions || []).reduce((map,item)=>{ if(item?.assignmentId){(map[item.assignmentId] ||= []).push(item);} return map; },{}), ...assignmentSubmissions };
    storeAssignmentSubmissions();
    lessonNotes = { ...(result.lessonNotes || {}), ...lessonNotes };
    interestedFaculties = { ...(result.interestedFaculties || {}), ...interestedFaculties };
    lessonQuizResults = { ...(result.lessonQuizResults || {}), ...lessonQuizResults };
    completedLessons = { ...(result.completedLessons || {}), ...completedLessons };
    studentSubscription = result.subscription || { status: 'none', planId: '', startsAt: 0, endsAt: 0 };
    storeAssignmentDrafts();
    storeLessonNotes();
    storeInterestedFaculties();
    storeLessonQuizResults();
    storeCompletedLessons();
    cloudSyncReady = true;
    render();
    // Если локальные данные старше облачных, объединённый результат также отправляем в облако.
    if (localAssignments || localSubmissions || localNotes || localInterests || localQuizResults || localCompletedLessons) scheduleCloudStudentDataSync();
  });
}

function hasAssignmentDraft(id) { return Boolean(String(assignmentDrafts[id] || "").trim()); }
function hasAssignmentSubmission(id) { return Boolean((assignmentSubmissions[id] || []).length); }
function assignmentStatusText(id) {
  return hasAssignmentSubmission(id) ? "Ответ отправлен" : hasAssignmentDraft(id) ? "Черновик сохранён" : "К выполнению";
}

function dashboardOverview() {
  const drafted = assignments.filter(a => hasAssignmentDraft(a.id)).length;
  const notes = Object.values(lessonNotes).filter(value => String(value || "").trim()).length;
  const savedTotal = drafted + notes;
  return `<section class="dashboard-overview">
    <div class="section-title"><div><span class="subtle-label">СОХРАНЁННОЕ</span><h2>Мои материалы</h2></div><button class="text-link" data-go="profile">Профиль ${icon("arrow")}</button></div>
    <div class="dashboard-materials">
      <div><b>${drafted}</b><span>Черновики заданий</span></div>
      <div><b>${notes}</b><span>Заметки к урокам</span></div>
    </div>
    <div class="dashboard-overview-foot"><span>${savedTotal ? "Материалы сохраняются автоматически" : "Здесь появятся твои сохранённые ответы и заметки"}</span><button data-go="assignments">Мои задания ${icon("arrow")}</button></div>
  </section>`;
}
function dashboardTasksPreview() {
  const nextAssignment = assignments[0];
  const laterAssignments = assignments.slice(1, 3);
  return `<section class="dashboard-work-grid">
    <div class="dashboard-panel dashboard-assignment-panel">
      <div class="section-title"><div><span class="subtle-label">УЧЕБНЫЕ ПРИМЕРЫ</span><h2>Примеры заданий</h2></div><button class="text-link" data-go="assignments">Все задания ${icon("arrow")}</button></div>
      <article class="dashboard-featured-task">
        <div class="featured-task-top"><span class="featured-task-kind">${esc(nextAssignment.type)}</span><span class="featured-task-due">${hasAssignmentDraft(nextAssignment.id) ? "Черновик сохранён" : "Пример задания"}</span></div>
        <h3>${esc(nextAssignment.title)}</h3>
        <p>${esc(nextAssignment.course)}</p>
        <div class="featured-task-bottom"><span>${icon("clock")}${esc(nextAssignment.estimate)}</span><button data-assignment-open="${nextAssignment.id}">${hasAssignmentDraft(nextAssignment.id) ? "Продолжить" : "Открыть задание"} ${icon("arrow")}</button></div>
      </article>
      ${laterAssignments.map(a => `<article class="dashboard-upcoming-task"><span><b>${esc(a.title)}</b><small>${esc(a.course)} · ${esc(a.due)}</small></span><button data-assignment-open="${a.id}" aria-label="Открыть задание">${icon("arrow")}</button></article>`).join("")}
      <div class="dashboard-task-foot"><span>${assignments.length} учебных задания в списке</span><button data-go="assignments">Открыть центр заданий</button></div>
    </div>
    <div class="dashboard-next-card">
      <span class="subtle-label">РАСПИСАНИЕ</span>
      <h3>Персональные занятия</h3>
      <p>Расписание появится здесь после подключения учебной системы.</p>
      <button data-go="study">Открыть обучение ${icon("arrow")}</button>
    </div>
  </section>`;
}

function homePage() {
  return `<main class="screen home-screen">
    <section class="greeting-row"><div><div class="subtle-label">ЛИЧНЫЙ КАБИНЕТ</div><h1>Привет, ${esc(firstName)}!</h1><p>С чего начнём сегодня?</p></div></section>
    <section class="hero-card">
      <div class="hero-copy"><span class="hero-eyebrow">ВЫБЕРИ НАПРАВЛЕНИЕ</span><h2>Найди своё<br>направление.</h2><p>Посмотри факультеты и ознакомительные программы.</p><button class="orange-button" data-go="faculties">Все факультеты ${icon("arrow")}</button></div>
      <div class="mascot-stage"><img src="/mascot/magnus-owl.svg" class="hero-mascot" alt="Совёнок MAGNUS" /></div>
    </section>
    <section class="courses-section home-featured-course"><div class="section-title"><div><span class="subtle-label">ОЗНАКОМИТЕЛЬНАЯ ПРОГРАММА</span><h2>Посмотреть пример курса</h2></div><button class="text-link" data-go="study">Все курсы ${icon("arrow")}</button></div>${courseTile(courses[0],true)}</section>
    <section class="quick-section"><div class="section-title"><div><span class="subtle-label">НАВИГАЦИЯ</span><h2>Разделы MAGNUS</h2></div><button class="text-link" data-go="faculties">Все факультеты ${icon("arrow")}</button></div><div class="quick-grid">
      <button class="quick-item" data-go="faculties"><span class="quick-icon peach">${icon("faculty")}</span><b>Факультеты</b><small>Найди своё</small></button>
      <button class="quick-item" data-go="study"><span class="quick-icon lilac">${icon("study")}</span><b>Обучение</b><small>Расписание и курсы</small></button>
      <button class="quick-item" data-go="documents"><span class="quick-icon butter">${icon("docs")}</span><b>Документы</b><small>Сертификаты</small></button>
      <button class="quick-item" data-go="profile"><span class="quick-icon mint">${icon("profile")}</span><b>Профиль</b><small>Твой аккаунт</small></button>
    </div></section>
    ${dashboardOverview()}
    ${dashboardTasksPreview()}
  </main>`;
}

function facultyArt(f) {
  return `<div class="faculty-art ${f.color}" data-faculty-art="${f.id}"><span>${f.symbol}</span><i>${f.num}</i></div>`;
}
function facultiesPage() {
  const filters = ["Все","Психология","Технологии","Бизнес","Гуманитарные"];
  const filtered = faculties.filter(f => {
    const matchesQuery = `${f.name} ${f.desc} ${f.en}`.toLowerCase().includes(searchValue.toLowerCase());
    const group = f.id === "psychology" ? "Психология" : f.id === "it" ? "Технологии" : ["management","economics","marketing"].includes(f.id) ? "Бизнес" : "Гуманитарные";
    return matchesQuery && (activeFilter === "Все" || group === activeFilter);
  });
  return `<main class="screen inner-screen">${heading("MAGNUS · АКАДЕМИЧЕСКАЯ СРЕДА","Выбери свой<br><em>факультет.</em>","Краткое описание факультетов и тем, которые входят в каждое направление.")}
    <label class="search-box">${icon("search")}<input id="faculty-search" value="${esc(searchValue)}" placeholder="Поиск факультета" autocomplete="off"><span>⌘ K</span></label>
    <div class="filter-row">${filters.map(f=>`<button class="filter-chip ${activeFilter===f?"selected":""}" data-filter="${f}" aria-pressed="${activeFilter===f}">${f}</button>`).join("")}</div>
    <div class="faculty-grid">${filtered.map(f=>`<button class="faculty-card" data-faculty="${f.id}">${facultyArt(f)}<span class="faculty-card-copy"><small>${f.en}</small><b>${f.name}</b><span>${f.desc}</span><i>Подробнее ${icon("arrow")}</i></span></button>`).join("")}</div>
    ${filtered.length?"":`<div class="empty-message">Ничего не найдено. Попробуй изменить запрос.</div>`}
  </main>`;
}

function facultyDetailPage() {
  const f = selectedFaculty;
  const outcomes = {
    psychology:["Понимать поведение и мотивацию","Развивать эмоциональный интеллект","Выстраивать здоровую коммуникацию"],
    management:["Планировать работу команды","Принимать решения на основе данных","Вести проекты от идеи до результата"],
    it:["Понимать устройство цифровых продуктов","Работать с логикой и алгоритмами","Ориентироваться в возможностях ИИ"],
    economics:["Разбираться в личных финансах","Читать экономические показатели","Оценивать риски и возможности"],
    marketing:["Исследовать аудиторию","Создавать позиционирование бренда","Оценивать эффективность коммуникаций"],
    humanities:["Анализировать тексты и идеи","Видеть исторический контекст","Аргументировать собственную позицию"]
  }[f.id];
  const format = f.id==="it" ? "Практикумы и цифровые проекты" : f.id==="psychology" ? "Наблюдения, кейсы и рефлексия" : f.id==="management" ? "Командные кейсы и бизнес-сценарии" : f.id==="economics" ? "Разборы ситуаций и аналитика" : f.id==="marketing" ? "Исследования и творческие задания" : "Работа с источниками и дискуссии";
  return `<main class="screen inner-screen detail-screen"><button class="back-button" data-go="faculties">${icon("back")} Все факультеты</button>
    <div class="detail-banner ${f.color}"><div><span class="subtle-label">НАПРАВЛЕНИЕ ${f.num} / 06</span><h1>${f.name}</h1><p>${f.desc}</p><span class="detail-en">${f.en}</span></div><div class="detail-symbol">${f.symbol}</div></div>
    <section class="faculty-intro"><div><span class="subtle-label">О НАПРАВЛЕНИИ</span><h2>Основные темы<br><em>и навыки.</em></h2></div><p>В этом разделе собраны основные темы направления и навыки, которые разбираются в учебных программах.</p></section>
    <section class="detail-topics"><div><span class="subtle-label">ПЕРВЫЕ ШАГИ</span><h2>Что будем<br><em>изучать?</em></h2></div><ol>${f.topics.map((t,i)=>`<li><span>0${i+1}</span>${t}</li>`).join("")}</ol></section>
    <section class="faculty-outcomes"><div class="section-title"><div><span class="subtle-label">РЕЗУЛЬТАТ ОБУЧЕНИЯ</span><h2>Что ты освоишь</h2></div><span class="outcome-count">03 НАВЫКА</span></div><div class="outcome-grid">${outcomes.map((t,i)=>`<article class="outcome-card"><span>0${i+1}</span><b>${t}</b></article>`).join("")}</div></section>
    <section class="faculty-method"><div class="method-mark">${f.symbol}</div><div><span class="subtle-label">ФОРМАТ ОБУЧЕНИЯ</span><h3>${format}</h3><p>Теория, примеры и практические задания по темам курса.</p></div></section>
    <div class="detail-callout"><div><b>Рассматриваешь это направление?</b><p>${interestedFaculties[f.id] ? "Направление сохранено в твоих интересах." : "Сохрани направление, чтобы вернуться к нему позже."}</p></div><button class="orange-button" data-action="interest">${interestedFaculties[f.id] ? "Убрать из интересов" : "Сохранить интерес"} ${icon("arrow")}</button></div>
    <p class="demo-disclaimer">Информация о направлениях носит ознакомительный характер. Состав программ, преподаватели и условия обучения будут опубликованы отдельно.</p>
  </main>`;
}


function schedulePanel() {
  return `<section class="schedule-section">
    <div class="section-title"><div><span class="subtle-label">РАСПИСАНИЕ</span><h2>Учебные занятия</h2></div></div>
    <div class="schedule-empty-state">
      <b>Расписание пока не подключено</b>
      <p>Здесь появятся даты, время и ссылки на занятия после подключения учебной системы.</p>
    </div>
  </section>`;
}

function studyPage() {
  return `<main class="screen inner-screen study-screen">
    ${heading("ОБУЧЕНИЕ", "Расписание<br><em>и курсы.</em>", "Выбирай курс, открывай уроки и работай с материалами.")}
    ${schedulePanel()}
    <section class="courses-section study-courses"><div class="section-title"><div><span class="subtle-label">УЧЕБНЫЕ ПРИМЕРЫ</span><h2>Примеры курсов</h2></div><span class="course-count">${courses.length} курса</span></div>${courses.map(c=>courseTile(c,true)).join("")}</section>
  </main>`;
}


function courseDetailPage() {
 const c=selectedCourse,lessons=courseLessons(c.id),completed=courseCompletionCount(c.id),progress=lessons.length?Math.round(completed/lessons.length*100):0;
 return `<main class="screen inner-screen course-detail-screen"><button class="back-button" data-go="study">${icon("back")} Все курсы</button>
 <section class="course-detail-hero ${c.color}">${courseArtwork(c)}<span class="course-detail-kicker">${esc(c.category)}</span><div class="course-detail-mark">${esc(c.mark)}</div><div class="course-detail-bottom"><span>ОЗНАКОМИТЕЛЬНАЯ ПРОГРАММА</span></div></section>
 <div class="course-detail-title"><div class="kicker">УЧЕБНАЯ ПРОГРАММА · ПРИМЕР</div><h1>${esc(c.title)}</h1><p>Три занятия с материалами и вопросами для самопроверки.</p></div>
 <section class="course-detail-summary"><span class="subtle-label">ТВОЙ РЕЗУЛЬТАТ</span><b>${completed} из ${lessons.length} занятий отмечено</b><div class="curriculum-progress"><span style="width:${progress}%"></span></div><p>Ознакомительный материал, не официальная учебная программа.</p></section>
 <section class="module-section"><div class="section-title"><div><span class="subtle-label">СОДЕРЖАНИЕ</span><h2>Занятия</h2></div><span class="course-count">${lessons.length} урока</span></div><div class="module-list">${lessons.map((lesson,index)=>`<button class="module-row curriculum-lesson-row" data-lesson-open="${lesson[0]}"><span class="module-number">${completedLessons[lesson[0]]?"✓":String(index+1).padStart(2,"0")}</span><span class="curriculum-lesson-copy"><b>${esc(lesson[1])}</b><small>${esc(lesson[2])} · ${lesson[3]} минут</small></span><span class="curriculum-lesson-state">${completedLessons[lesson[0]]?"Пройдено":"Открыть"} ${icon("arrow")}</span></button>`).join("")}</div></section>
 <p class="demo-disclaimer">Материалы созданы для знакомства с форматом MAGNUS. Они не заменяют полноценную программу с преподавателем.</p></main>`;
}

function lessonPage() {
 const c=selectedCourse,lesson=selectedLesson();if(!lesson)return courseDetailPage();
 const [id,title,type,duration,intro,h1,b1,h2,b2,question,options,answer]=lesson;
 const quizResult=lessonQuizResults[id]?JSON.parse(lessonQuizResults[id]):null,lessonCompleted=Boolean(completedLessons[id]);
 const tabContent=lessonTab==="notes"?`<div class="lesson-notes"><div class="lesson-notes-head"><label for="lesson-note">МОИ ЗАМЕТКИ</label><span>${icon("cloud")} АВТОСОХРАНЕНИЕ</span></div><textarea id="lesson-note" placeholder="Запишите важную мысль, пример или вопрос...">${esc(lessonNotes[id]||"")}</textarea><small>Заметки сохраняются на устройстве и синхронизируются с облаком, если оно доступно.</small></div>`:lessonTab==="materials"?`<div class="lesson-reading"><span class="subtle-label">КРАТКИЙ КОНСПЕКТ</span><h3>${esc(title)}</h3><h3>${esc(h1)}</h3><p>${esc(b1)}</p><h3>${esc(h2)}</h3><p>${esc(b2)}</p><blockquote>${esc(intro)}</blockquote></div>`:`<div class="lesson-reading"><span class="subtle-label">${esc(type.toUpperCase())} · ${duration} МИНУТ</span><h3>${esc(title)}</h3><p>${esc(intro)}</p><div class="lesson-callout"><b>Главная мысль</b><span>${esc(b1)}</span></div><p>Открой конспект, чтобы разобрать тему подробнее, затем проверь понимание материала.</p></div>`;
 const lessons=courseLessons(c.id),index=lessons.findIndex(item=>item[0]===id),previous=lessons[index-1],next=lessons[index+1];
 return `<main class="screen inner-screen lesson-screen"><button class="back-button" data-go="courseDetail">${icon("back")} К программе курса</button>
 <div class="lesson-heading"><span class="subtle-label">${esc(c.category.toUpperCase())} · ЗАНЯТИЕ ${String(index+1).padStart(2,"0")} ИЗ ${lessons.length}</span><h1>${esc(title)}</h1><p>${esc(c.title)}</p><div class="lesson-meta-row"><span>${duration} минут</span><span>${esc(type)}</span><span>Конспект и тест</span></div></div>
 <div class="lesson-tabs" role="tablist" aria-label="Материалы урока">${[["lesson","Урок"],["materials","Конспект"],["notes","Заметки"]].map(([key,label])=>`<button type="button" role="tab" id="lesson-tab-${key}" aria-controls="lesson-panel" aria-selected="${lessonTab===key}" tabindex="${lessonTab===key?"0":"-1"}" class="${lessonTab===key?"selected":""}" data-lesson-tab="${key}">${label}</button>`).join("")}</div>
 <section class="lesson-content" id="lesson-panel" role="tabpanel" aria-labelledby="lesson-tab-${lessonTab}">${tabContent}</section>
 <section class="lesson-quiz"><div class="kicker">ПРОВЕРЬ СЕБЯ</div><h2>${esc(question)}</h2><p>Выберите один вариант ответа.</p>${options.map((option,i)=>`<button type="button" class="quiz-option ${quizChoice===String(i)?"chosen":""}" data-quiz="${i}" aria-pressed="${quizChoice===String(i)}"><span>${String.fromCharCode(65+i)}</span>${esc(option)}${quizChoice===String(i)?"<b>✓</b>":""}</button>`).join("")}${quizChoice!==""?`<div class="quiz-feedback ${quizChoice===String(answer)?"correct":"incorrect"}" role="status">${quizChoice===String(answer)?"Верно. Ты правильно понял основную мысль.":"Пока неверно. Перечитай конспект и попробуй ещё раз."}</div>`:""}${quizResult?`<div class="quiz-saved-result">Последний результат: ${quizResult.correct?"верный ответ":"ответ неверный"} · попыток: ${quizResult.attempts}</div>`:""}</section>
 <div class="lesson-footer"><button class="lesson-finish" data-action="lesson-finish" ${lessonCompleted?"disabled":""}>${lessonCompleted?"Занятие отмечено пройденным":"Отметить занятие пройденным"} ${lessonCompleted?"":icon("arrow")}</button><small>${lessonCompleted?"Отметка сохранена.":"Отметка означает, что ты ознакомился с материалом; это не подтверждение квалификации."}</small></div>
 <div class="lesson-sequence">${previous?`<button data-lesson-open="${previous[0]}">← Предыдущее занятие</button>`:"<span>Первое занятие</span>"}${next?`<button data-lesson-open="${next[0]}">Следующее занятие →</button>`:`<button data-go="courseDetail">К программе курса →</button>`}</div></main>`;
}

function assignmentsPage() {
  const counts = {
    all: assignments.length,
    pending: assignments.filter(a => !hasAssignmentDraft(a.id) && !hasAssignmentSubmission(a.id)).length,
    drafts: assignments.filter(a => hasAssignmentDraft(a.id) && !hasAssignmentSubmission(a.id)).length,
    submitted: assignments.filter(a => hasAssignmentSubmission(a.id)).length
  };
  const filters = [
    { label:"Все", count:counts.all },
    { label:"Нужно выполнить", count:counts.pending },
    { label:"Черновики", count:counts.drafts },
    { label:"Отправлено", count:counts.submitted }
  ];
  const filtered = assignments.filter(a => {
    if (activeAssignmentFilter === "Черновики") return hasAssignmentDraft(a.id) && !hasAssignmentSubmission(a.id);
    if (activeAssignmentFilter === "Отправлено") return hasAssignmentSubmission(a.id);
    if (activeAssignmentFilter === "Нужно выполнить") return !hasAssignmentDraft(a.id);
    return true;
  });
  return `<main class="screen inner-screen assignments-screen">
    ${heading("ТВОИ УЧЕБНЫЕ ЗАДАЧИ", "Список<br><em>заданий.</em>", "Задания по учебным программам и сохранённые черновики.")}
    <div class="assignment-summary">
      <div><b>${counts.all}</b><span>Всего заданий</span></div>
      <div><b>${counts.pending}</b><span>Без черновика</span></div>
      <div><b>${counts.drafts}</b><span>С черновиком</span></div>
    </div>
    <div class="assignment-filter-row" role="group" aria-label="Фильтр заданий">${filters.map(f => `<button class="filter-chip ${activeAssignmentFilter===f.label?"selected":""}" data-assignment-filter="${f.label}" aria-pressed="${activeAssignmentFilter===f.label}"><span>${f.label}</span><b>${f.count}</b></button>`).join("")}</div>
    <div class="assignment-list">
      ${filtered.map(a => `<article class="assignment-card">
        <div class="assignment-card-top"><span class="assignment-kind">${esc(a.type)}</span><span class="assignment-status ${hasAssignmentSubmission(a.id)?"is-submitted":hasAssignmentDraft(a.id)?"has-draft":""}">${assignmentStatusText(a.id)}</span></div>
        <h2>${esc(a.title)}</h2>
        <p>${esc(a.course)}</p>
        <div class="assignment-card-meta"><span class="assignment-due"><small>СРОК</small><b>${esc(a.due)}</b></span><span class="assignment-estimate"><small>ВРЕМЯ</small><b>${esc(a.estimate)}</b></span></div>
        <button class="assignment-open" data-assignment-open="${a.id}">Открыть задание ${icon("arrow")}</button>
      </article>`).join("")}
      ${filtered.length ? "" : `<div class="assignment-empty"><b>${activeAssignmentFilter==="Черновики"?"Черновиков пока нет":"Все задания уже разобраны"}</b><p>${activeAssignmentFilter==="Черновики"?"Начни с любого задания — текст ответа сохранится здесь.":"В этой категории пока нет заданий."}</p><button data-assignment-filter="Все">Показать все задания</button></div>`}
    </div>
    <p class="assignment-demo-note">Отправленные ответы сохраняются в облаке MAGNUS. Преподавательская проверка и оценки пока не подключены.</p>
  </main>`;
}

function assignmentDetailPage() {
  const a=assignments.find(item=>item.id===selectedAssignmentId)||assignments[0];
  const draft=assignmentDrafts[a.id]||"",saved=hasAssignmentDraft(a.id),submissions=assignmentSubmissions[a.id]||[];
  const latest=submissions[submissions.length-1];
  const latestStatus=latest?.status==="reviewed"?"Проверено":latest?.status==="revision"?"Нужны доработки":latest?"Получено":"К выполнению";
  return `<main class="screen inner-screen assignment-detail-screen">
    <button class="back-button" data-go="assignments">${icon("back")} Все задания</button>
    <section class="assignment-detail-hero"><div class="assignment-detail-top"><span class="assignment-kind">${esc(a.type)} · MAGNUS</span><span class="assignment-status ${saved?"has-draft":""}" id="assignment-detail-status">${latestStatus}</span></div><h1>${esc(a.title)}</h1><p>${esc(a.course)}</p><div class="assignment-detail-meta"><span><small>СРОК СДАЧИ</small><b>${esc(a.due)}</b></span><span><small>ОЦЕНКА ВРЕМЕНИ</small><b>${esc(a.estimate)}</b></span></div></section>
    <section class="assignment-instructions"><span class="subtle-label">ЧТО НУЖНО СДЕЛАТЬ</span><p>${esc(a.description)}</p><h2>План выполнения</h2><ol>${a.requirements.map((r,i)=>`<li><span>0${i+1}</span>${esc(r)}</li>`).join("")}</ol></section>
    <section class="assignment-answer"><div class="assignment-answer-head"><div><span class="subtle-label">ТВОЙ ОТВЕТ</span><h2>Рабочее поле</h2></div><span class="assignment-draft-mark" id="assignment-draft-mark">${saved?"ЧЕРНОВИК ЕСТЬ":"НОВЫЙ ОТВЕТ"}</span></div>
      <textarea id="assignment-answer" aria-label="Текст ответа на задание" maxlength="12000" placeholder="Начни писать ответ здесь...">${esc(draft)}</textarea>
      <div class="assignment-answer-footer"><span id="assignment-char-count">${draft.length} символов</span><span id="assignment-save-status" role="status" aria-live="polite">${saved?"Сохранено на устройстве":"Автосохранение включено"}</span></div>
      <div class="assignment-save-row"><small>Черновик можно редактировать до отправки. После отправки ответ сохранится в истории.</small><button class="orange-button" data-action="save-assignment-draft">Сохранить черновик</button></div>
      <div class="assignment-submit-row"><p>Отправка сохранит ответ в облаке MAGNUS. Сейчас автоматическая или преподавательская проверка не подключена.</p><button class="assignment-submit-button" data-action="submit-assignment" ${draft.trim().length<30?"disabled":""}>Отправить ответ</button></div>
    </section>
    ${submissions.length?`<section class="assignment-history"><div class="section-title"><div><span class="subtle-label">ИСТОРИЯ</span><h2>Отправленные ответы</h2></div><span class="course-count">${submissions.length}</span></div>${submissions.slice().reverse().map((item,index)=>`<article class="submission-record"><div><b>Попытка ${submissions.length-index}</b><span>${new Date(item.submittedAt).toLocaleString("ru-RU",{dateStyle:"medium",timeStyle:"short"})}</span></div><p>${esc(item.answer)}</p><small>${item.status==="reviewed"?"Проверено преподавателем":item.status==="revision"?"Нужны доработки":"Получено сервером"}${item.grade===null||item.grade===undefined?"":` · оценка ${item.grade}/100`}</small>${item.comment?`<div class="submission-comment">${esc(item.comment)}</div>`:""}</article>`).join("")}</section>`:""}
    <p class="assignment-demo-note">Отправленные ответы доступны в облачной истории этого аккаунта. Преподавательская проверка, оценки и обратная связь будут подключены отдельно.</p>
  </main>`;
}

function documentsPage() {
  return `<main class="screen inner-screen documents-screen">
    ${heading("СЕРТИФИКАТЫ", "Документы об<br><em>обучении.</em>", "В этом разделе будут храниться сертификаты по завершённым программам MAGNUS.")}
    <section class="certificate-specimen" aria-label="Образец оформления будущего сертификата">
      <div class="certificate-specimen-inner">
        <div class="certificate-specimen-top"><b>MAGNUS</b><span>ОБРАЗЕЦ · НЕ ВЫДАН</span></div>
        <div class="certificate-specimen-rule"></div>
        <span class="certificate-specimen-eyebrow">ПОДТВЕРЖДЕНИЕ ОБУЧЕНИЯ</span>
        <h2>Сертификат</h2>
        <p>о прохождении образовательной программы</p>
        <div class="certificate-specimen-name"><i></i><span>ИМЯ СТУДЕНТА</span></div>
        <div class="certificate-specimen-footer"><span>ОБРАЗОВАТЕЛЬНАЯ ПРОГРАММА</span><span>ДАТА ВЫДАЧИ</span></div>
      </div>
    </section>
    <div class="documents-empty-state"><b>Пока нет выданных сертификатов</b><p>Образец выше показывает оформление. Настоящий документ появится здесь после завершения программы и выполнения условий его выдачи.</p><button data-go="study">Перейти к обучению ${icon("arrow")}</button></div>
    <p class="legal-note">Образец не является выданным документом. Сертификаты MAGNUS подтверждают прохождение соответствующих образовательных программ и не являются государственными дипломами о высшем образовании.</p>
  </main>`;
}

function profilePage() {
  const draftCount = Object.values(assignmentDrafts).filter(value => String(value || "").trim()).length;
  const noteCount = Object.values(lessonNotes).filter(value => String(value || "").trim()).length;
  const completedCount = Object.keys(completedLessons).length;
  const quizCount = Object.keys(lessonQuizResults).length;
  const telegramConnected = Boolean(telegramUser?.id);
  const profileName = telegramUser?.first_name || "Гость MAGNUS";
  const profileCaption = telegramUser?.username
    ? `@${telegramUser.username}`
    : telegramConnected ? "Профиль из Telegram" : "Telegram-профиль не получен";
  const subscriptionLabel = studentSubscription.status === 'active' ? 'Доступ активен' : studentSubscription.status === 'expired' ? 'Срок доступа истёк' : studentSubscription.status === 'revoked' ? 'Доступ отозван' : 'Нет активного доступа';
  const subscriptionUntil = studentSubscription.endsAt ? new Date(studentSubscription.endsAt * 1000).toLocaleDateString('ru-RU') : '';
  return `<main class="screen inner-screen profile-screen">
    ${heading("ЛИЧНОЕ ПРОСТРАНСТВО", "Твой профиль<br><em>MAGNUS.</em>", "Аккаунт и сохранённые учебные материалы.")}
    <section class="profile-card">
      <div class="profile-avatar">${avatarContent()}</div>
      <div class="profile-info"><small>ЛИЧНЫЙ КАБИНЕТ</small><h2>${esc(profileName)}</h2><p>${esc(profileCaption)}</p></div>
      <span class="profile-connection ${telegramConnected?"connected":""}">${telegramConnected?"TELEGRAM":"ГОСТЕВОЙ РЕЖИМ"}</span>
    </section>
    <section class="profile-subscription-card"><div><span>УЧЕБНЫЙ ДОСТУП</span><b>${subscriptionLabel}</b><small>${studentSubscription.status==='active'&&subscriptionUntil?'Действует до '+subscriptionUntil:'Информация о доступе обновляется из аккаунта'}</small></div><i class="profile-subscription-indicator ${studentSubscription.status==='active'?'active':''}"></i></section>
    <section class="profile-plans"><div class="profile-plans-heading"><span class="subtle-label">ПОДПИСКА</span><h2>Выбери срок обучения</h2><p>Оплата цифрового доступа проходит внутри Telegram через Stars.</p></div>${availableSubscriptionPlans.length?availableSubscriptionPlans.map(plan=>`<article class="profile-plan"><div><b>${esc(plan.days+' дней')}</b><small>${esc(plan.title)}</small></div><strong>${Number(plan.starsPrice)} ⭐</strong><button data-buy-plan="${esc(plan.planId)}">Купить</button></article>`).join(''):'<div class="profile-plans-empty">'+(paymentPlansLoading?'Загружаем тарифы…':paymentPlansError?'Не удалось загрузить тарифы. Попробуй обновить профиль.':'Сейчас нет доступных тарифов.')+'</div>'}</section>
    ${studentPaymentHistorySection()}
    <div class="profile-content-heading"><div><span class="subtle-label">СОХРАНЁННОЕ</span><h2>Учебные материалы</h2></div><span>${cloudSyncReady?"Синхронизировано":"На устройстве"}</span></div>
    <div class="profile-stats">
      <div><b>${draftCount}</b><small>Черновики</small></div>
      <div><b>${noteCount}</b><small>Заметки</small></div>
      <div><b>${completedCount}</b><small>Примеры пройдены</small></div>
      <div><b>${quizCount}</b><small>Результаты тестов</small></div>
      <div><b>${telegramConnected?"Да":"—"}</b><small>Telegram</small></div>
    </div>
    ${adminAccess.isAdmin?`<button class="profile-admin-link" data-go="admin"><span>УПРАВЛЕНИЕ MAGNUS</span><b>Открыть панель администратора ${icon("arrow")}</b></button>`:""}
  <section class="profile-sync-card">
      <span class="profile-sync-icon">${icon("cloud")}</span>
      <div><b>${cloudSyncReady?"Облачная синхронизация активна":"Сохранение учебных материалов"}</b><p>${cloudSyncReady?"Черновики и заметки синхронизируются с облачным хранилищем.":"Черновики и заметки сохраняются на этом устройстве. Облачное подключение пока не подтверждено."}</p></div>
      <span class="profile-sync-state ${cloudSyncReady?"active":""}">${cloudSyncReady?"ОНЛАЙН":"ЛОКАЛЬНО"}</span>
    </section>
    <section class="profile-menu">
      <button data-action="settings"><span class="menu-icon">⚙</span><span><b>Настройки</b><small>Внешний вид и предпочтения</small></span>${icon("arrow")}</button>
      <button data-action="notifications"><span class="menu-icon">♧</span><span><b>Уведомления</b><small>Важные события и напоминания</small></span>${icon("arrow")}</button>
      <button data-action="support"><span class="menu-icon">?</span><span><b>Поддержка</b><small>Помощь и обратная связь</small></span>${icon("arrow")}</button>
      <button data-action="about"><span class="menu-icon">${icon("faculty")}</span><span><b>О MAGNUS</b><small>Пространство для знаний и развития</small></span>${icon("arrow")}</button>
    </section>
  </main>`;
}

function adminSubmissionCard(item,reviewable){
 const status=item.status==="reviewed"?"Проверено":item.status==="revision"?"На доработке":"Ожидает проверки";
 const date=item.submittedAt?new Date(item.submittedAt).toLocaleString("ru-RU",{dateStyle:"medium",timeStyle:"short"}):"Дата не указана";
 return `<article class="admin-submission" data-admin-submission="${esc(item.id)}"><div class="admin-submission-head"><div><span>${esc(item.studentName||"Студент")} · ID ${esc(item.studentId||"—")}</span><h3>${esc(assignments.find(a=>a.id===item.assignmentId)?.title||item.assignmentId)}</h3></div><span class="admin-review-status ${item.status==="reviewed"?"done":item.status==="revision"?"revision":""}">${status}</span></div><time>${date}</time><p class="admin-answer-text">${esc(item.answer||"")}</p>
 ${reviewable?`<div class="admin-review-fields"><label>Комментарий<textarea data-review-comment placeholder="Обратная связь студенту…">${esc(item.comment||"")}</textarea></label><label>Оценка<input data-review-grade type="number" min="0" max="100" step="1" placeholder="0–100" value="${item.grade??""}"></label></div><div class="admin-review-actions"><button data-review-status="revision" data-student-id="${esc(item.studentId)}" data-submission-id="${esc(item.id)}">На доработку</button><button data-review-status="reviewed" data-student-id="${esc(item.studentId)}" data-submission-id="${esc(item.id)}">Принять работу</button></div>`:item.comment?`<p class="admin-existing-comment">${esc(item.comment)}</p>`:""}</article>`;
}
function adminAuditCard(item){
 const labels={'submission.reviewed':'Проверка работы','bot.settings.updated':'Настройки бота','admin.granted':'Назначение администратора','student.message.sent':'Сообщение студенту','subscription.granted':'Выдача доступа','subscription.revoked':'Отзыв доступа','subscription.paid':'Оплата подписки','payment.plans.updated':'Настройки тарифов'};
 const d=item.details&&typeof item.details==='object'?item.details:{};
 const date=item.createdAt?new Date(item.createdAt*1000).toLocaleString('ru-RU',{dateStyle:'medium',timeStyle:'short'}):'Дата не указана';
 const actor=item.actorEmail||'Администратор';
 const actorId=item.actorTgId==='cli'?'локальная CLI-сессия':(item.actorTgId?'Telegram ID '+item.actorTgId:'');
 let detail='';
 if(item.action==='submission.reviewed'){
  const statuses={received:'Ожидала проверки',reviewed:'Принята',revision:'На доработку'};
  const prev=statuses[d.previousStatus]||d.previousStatus||'—';
  const next=statuses[d.status]||d.status||'—';
  const grade=d.grade==null?'Без оценки':'Оценка '+d.grade+'/100';
  const delivery=d.notificationSent?'Уведомление отправлено':'Уведомление не доставлено';
  detail=prev+' → '+next+' · '+grade+' · '+delivery;
 }else if(item.action==='bot.settings.updated'){
  const names={welcomeMessage:'Приветствие',description:'Описание',shortDescription:'Краткое описание',menuButtonText:'Текст кнопки'};
  detail='Изменено: '+(Array.isArray(d.changedFields)?d.changedFields.map(key=>names[key]||key).join(', '):'параметры')+(d.applied===false?' · Telegram не подтвердил применение':' · применено');
 }else if(item.action==='student.message.sent'){
  detail=(d.status==='delivered'?'Telegram принял сообщение':'Telegram не принял сообщение')+' · '+(Number(d.messageLength)||0)+' символов';
 }else if(item.action==='subscription.granted'){
  detail='Выдано на '+(Number(d.days)||0)+' дней · '+(d.planId||'ручной доступ');
 }else if(item.action==='subscription.revoked'){
  detail='Отозван тариф '+(d.planId||'—');
 }else if(item.action==='subscription.paid'){
  detail='Оплачено '+(Number(d.amount)||0)+' Stars · '+(d.planId||'тариф');
 }else if(item.action==='payment.plans.updated'){
  detail='Изменены цены и доступность тарифов';
 }else if(item.action==='admin.granted'){
  detail='Email: '+(d.email||'—')+' · роль: '+(d.role||'owner');
 }
 return '<article class="admin-audit-entry"><div class="admin-audit-entry-head"><b>'+esc(labels[item.action]||item.action||'Действие')+'</b><time>'+esc(date)+'</time></div><p>'+esc(item.summary||'Изменение в MAGNUS')+'</p><div class="admin-audit-meta">'+esc(actor)+(actorId?' · '+esc(actorId):'')+'</div><div class="admin-audit-detail">'+esc(detail)+(item.targetType?' · '+esc(item.targetType):'')+(item.targetId?' · '+esc(item.targetId):'')+'</div></article>';
}
function adminAuditPage(){
 return `<section class="admin-audit-section"><div class="admin-section-head"><div><span>ИСТОРИЯ ИЗМЕНЕНИЙ</span><h2>Действия администраторов</h2></div><button data-admin-audit-refresh>Обновить журнал ${icon('refresh')}</button></div>${adminAuditLoading?`<div class="admin-loading">Загружаем журнал…</div>`:adminAuditError?`<div class="admin-error" role="alert">${esc(adminAuditError)}</div>`:adminAuditEntries.map(adminAuditCard).join('')||`<div class="admin-empty">Административных действий пока нет. Новые проверки и изменения настроек появятся здесь.</div>`}</section>`;
}
function adminStudentName(student){
 const full=[student.firstName,student.lastName].filter(Boolean).join(' ').trim();
 return full||'Пользователь Telegram';
}
function adminStudentLastSeen(timestamp){
 return timestamp?new Date(timestamp*1000).toLocaleString('ru-RU',{dateStyle:'medium',timeStyle:'short'}):'Нет отметки активности';
}
function adminStudentCard(student){
 const name=adminStudentName(student);
 const username=student.username?'@'+student.username:'Telegram ID '+student.telegramId;
 const search=(name+' '+username+' '+student.telegramId).toLowerCase();
 const subscription=student.subscription||{};
 const accessLabel=subscription.status==='active'?'Доступ активен':subscription.status==='expired'?'Истёк':subscription.status==='revoked'?'Отозван':'Без доступа';
 return `<button class="admin-student-row" type="button" data-admin-student="${esc(student.telegramId)}" data-admin-student-row data-search="${esc(search)}"><span class="admin-student-avatar">${esc((student.firstName||'M').charAt(0).toUpperCase())}</span><span class="admin-student-main"><b>${esc(name)}</b><small>${esc(username)}</small><small>Активность: ${esc(adminStudentLastSeen(student.updatedAt))}</small><small class="admin-student-access ${subscription.status==='active'?'active':''}">${accessLabel}</small></span><span class="admin-student-counts"><b>${student.submissionsCount} работ</b><small>${student.pendingCount} ожидают</small></span><span class="admin-student-chevron">${icon('chevron-right')}</span></button>`;
}
function adminStudentSubmission(item,student){
 return adminSubmissionCard({...item,studentId:student.telegramId,studentName:adminStudentName(student)},false);
}
function adminStudentMessageCard(item){
 const date=item.createdAt?new Date(item.createdAt*1000).toLocaleString('ru-RU',{dateStyle:'medium',timeStyle:'short'}):'Дата не указана';
 const delivered=item.status==='delivered';
 const status=delivered?'Отправлено Telegram':item.status==='sending'?'Отправляется':'Не отправлено';
 const error=item.errorMessage?'<small>'+esc(item.errorMessage)+'</small>':'';
 return `<article class="admin-outgoing-message ${delivered?'is-delivered':'is-failed'}"><div class="admin-outgoing-message-head"><b>${status}</b><time>${esc(date)}</time></div><p>${esc(item.messageText||'')}</p>${error}<footer>${esc(item.adminEmail||'Администратор')}</footer></article>`;
}
function adminStudentDetailPage(){
 if(adminStudentDetailLoading)return `<section class="admin-student-detail"><button class="admin-back-button" data-admin-student-back>${icon('arrow-left')} К списку студентов</button><div class="admin-loading">Загружаем профиль студента…</div></section>`;
 if(adminStudentDetailError||!adminStudentDetail)return `<section class="admin-student-detail"><button class="admin-back-button" data-admin-student-back>${icon('arrow-left')} К списку студентов</button><div class="admin-error" role="alert">${esc(adminStudentDetailError||'Профиль не найден.')}</div></section>`;
 const detail=adminStudentDetail,student=detail.student||{},name=adminStudentName(student);
 const facultiesList=(detail.interestedFaculties||[]).map(id=>faculties.find(item=>item.id===id)?.name||id);
 const lessonName=id=>Object.values(curriculum).flat().find(item=>item[0]===id)?.[1]||id;
 const submissions=Array.isArray(detail.submissions)?detail.submissions:[];
 const messages=Array.isArray(detail.messages)?detail.messages:[];
 const subscription=detail.subscription||student.subscription||{status:'none'};
 const subscriptionStatus=subscription.status==='active'&&subscription.endsAt*1000>Date.now()?'Доступ активен':subscription.status==='expired'?'Срок истёк':subscription.status==='revoked'?'Отозван':'Нет доступа';
 const subscriptionEnd=subscription.endsAt?new Date(subscription.endsAt*1000).toLocaleString('ru-RU',{dateStyle:'medium',timeStyle:'short'}):'—';
 return `<section class="admin-student-detail"><button class="admin-back-button" data-admin-student-back>${icon('arrow-left')} К списку студентов</button><header class="admin-student-profile-head"><span class="admin-student-avatar large">${esc((student.firstName||'M').charAt(0).toUpperCase())}</span><div><span class="admin-eyebrow">ПРОФИЛЬ СТУДЕНТА</span><h2>${esc(name)}</h2><p>${student.username?'@'+esc(student.username)+' · ':''}Telegram ID ${esc(student.telegramId||'—')}</p><small>Последняя активность: ${esc(adminStudentLastSeen(student.updatedAt))}</small></div></header>
 <section class="admin-subscription-panel"><div class="admin-section-head"><div><span>УПРАВЛЕНИЕ ДОСТУПОМ</span><h2>Подписка и срок обучения</h2></div><span class="admin-subscription-status ${subscription.status==='active'&&subscription.endsAt*1000>Date.now()?'active':''}">${subscriptionStatus}</span></div><div class="admin-subscription-facts"><div><small>ТЕКУЩИЙ ТАРИФ</small><b>${esc(subscription.planId||'Не назначен')}</b></div><div><small>ДЕЙСТВУЕТ ДО</small><b>${esc(subscriptionEnd)}</b></div></div><div class="admin-subscription-actions"><label>Выдать или продлить доступ<select data-admin-subscription-days><option value="7">7 дней</option><option value="30" selected>30 дней</option><option value="90">90 дней</option><option value="365">365 дней</option></select></label><button class="orange-button" data-admin-subscription-grant data-student-id="${esc(student.telegramId)}">Выдать доступ</button><button class="admin-subscription-revoke" data-admin-subscription-revoke data-student-id="${esc(student.telegramId)}" ${subscription.status==='active'&&subscription.endsAt*1000>Date.now()?'':'disabled'}>Отозвать доступ</button></div><small class="admin-subscription-note">Ручное назначение доступа администратором. Покупки через Telegram Stars фиксируются в платёжном реестре.</small></section>
 <div class="admin-student-metrics"><article><b>${Number(student.submissionsCount)||0}</b><span>Отправлено работ</span></article><article><b>${Number(student.pendingCount)||0}</b><span>Ожидают проверки</span></article><article><b>${Number(student.completedLessonsCount)||0}</b><span>Пройдено примеров</span></article><article><b>${Number(student.quizAttempts)||0}</b><span>Ответов в тестах</span></article></div>
 <div class="admin-student-activity-grid"><article><span>ИНТЕРЕСЫ</span><h3>Направления</h3><p>${facultiesList.length?facultiesList.map(esc).join(', '):'Пока не выбраны'}</p></article><article><span>УЧЕБНАЯ АКТИВНОСТЬ</span><h3>Сохранённые материалы</h3><p>${Number(detail.notesCount)||0} заметок · ${Number(detail.draftsCount)||0} черновиков</p></article></div>
 <div class="admin-section-head"><div><span>ИСТОРИЯ ОТПРАВЛЕНИЙ</span><h2>Работы студента</h2></div><span class="admin-count">${submissions.length}</span></div>${submissions.map(item=>adminStudentSubmission(item,student)).join('')||`<div class="admin-empty">Студент пока не отправлял работы.</div>`}
 <section class="admin-student-messaging"><div class="admin-section-head"><div><span>ЛИЧНАЯ СВЯЗЬ</span><h2>Сообщения студенту</h2></div><span class="admin-count">${messages.length}</span></div>
 <div class="admin-message-compose"><textarea data-admin-student-message maxlength="3500" rows="3" placeholder="Напиши сообщение студенту…"></textarea><div><small>Сообщение будет отправлено от имени бота MAGNUS в Telegram.</small><button class="orange-button" data-admin-student-send data-student-id="${esc(student.telegramId)}">Отправить</button></div></div>
 <div class="admin-message-history">${messages.map(adminStudentMessageCard).join('')||'<div class="admin-empty">История сообщений пока пуста.</div>'}</div></section>
 <div class="admin-student-learning"><div class="admin-section-head"><div><span>УЧЕБНЫЕ РЕЗУЛЬТАТЫ</span><h2>Примеры и тесты</h2></div></div><p><b>Отмеченные примеры:</b> ${(detail.completedLessonIds||[]).length?detail.completedLessonIds.map(lessonName).map(esc).join(', '):'Нет отметок'}</p><p><b>Тесты с сохранённым ответом:</b> ${(detail.quizLessonIds||[]).length?detail.quizLessonIds.map(lessonName).map(esc).join(', '):'Нет сохранённых ответов'}</p><small>Это данные демонстрационных уроков MAGNUS, не официальная успеваемость.</small></div></section>`;
}
function adminStudentsPage(){
 if(adminStudentSelected)return adminStudentDetailPage();
 const count=adminStudents.length;
 return `<section class="admin-students-section"><div class="admin-section-head"><div><span>ПОЛЬЗОВАТЕЛИ MAGNUS</span><h2>Студенты</h2></div><div class="admin-student-toolbar"><b>${count}</b><button data-admin-students-refresh>${icon('refresh')}</button></div></div><label class="admin-student-search">${icon('search')}<input type="search" placeholder="Имя, username или Telegram ID" data-admin-student-search autocomplete="off" /></label>${adminStudentsLoading?`<div class="admin-loading">Загружаем пользователей…</div>`:adminStudentsError?`<div class="admin-error" role="alert">${esc(adminStudentsError)}</div>`:count?`<div class="admin-student-list">${adminStudents.map(adminStudentCard).join('')}</div><div class="admin-student-empty-filter" hidden>Ничего не найдено.</div><p class="admin-students-note">В списке отображаются аккаунты, открывавшие MAGNUS и синхронизировавшие данные с облаком.</p>`:`<div class="admin-empty">Пользователей пока нет. Они появятся здесь после первого открытия MAGNUS из Telegram.</div>`}</section>`;
}
function adminPage(){
 if(!adminAccess.isAdmin)return `<main class="screen inner-screen admin-screen"><div class="admin-access-state"><span class="admin-eyebrow">MAGNUS · CONTROL</span><h1>Панель управления</h1><p>${adminAccess.loading?"Проверяем права доступа…":"Для этого аккаунта пока не подключены права администратора."}</p><button class="orange-button" data-admin-refresh>Проверить доступ</button></div></main>`;
 const data=adminDashboard;
 const stats=data?.stats||{students:0,submissions:0,pending:0,reviewed:0};
 const items=data?.submissions||[];
 const settings=data?.botSettings||{
  welcomeMessage:"Добро пожаловать в MAGNUS.\n\nУчебные программы, материалы и задания собраны в одном пространстве.",
  description:"MAGNUS — образовательная платформа. Изучай темы, выполняй задания и отслеживай результаты.",
  shortDescription:"Обучение, учебные программы и задания в Telegram.",
  menuButtonText:"Открыть MAGNUS"
 };
 const tabs=[["overview","Обзор"],["students","Студенты"],["reviews","Работы"],["payments","Оплаты"],["bot","Бот"],["audit","Журнал"]];
 return `<main class="screen inner-screen admin-screen"><header class="admin-header"><div><span class="admin-eyebrow">MAGNUS · CONTROL CENTER</span><h1>Управление</h1><p>${esc(data?.admin?.email||"Администратор")} · ${esc(data?.admin?.role||"admin")}</p></div><button class="admin-refresh" data-admin-refresh aria-label="Обновить данные">${icon("refresh")}</button></header>
 <nav class="admin-tabs" aria-label="Разделы панели">${tabs.map(([key,label])=>`<button class="${adminTab===key?"active":""}" data-admin-tab="${key}">${label}</button>`).join("")}</nav>
 ${adminLoading&&!data?`<div class="admin-loading">Загружаем данные MAGNUS…</div>`:""}${adminError?`<div class="admin-error" role="alert">${esc(adminError)}</div>`:""}
 ${adminTab==="overview"?`<section><div class="admin-stat-grid"><article><span>СТУДЕНТЫ</span><b>${stats.students}</b><small>Аккаунтов с учебными данными</small></article><article><span>ОТПРАВКИ</span><b>${stats.submissions}</b><small>Ответов в истории</small></article><article class="needs-review"><span>ОЖИДАЮТ ПРОВЕРКИ</span><b>${stats.pending}</b><small>Нужны действия преподавателя</small></article><article><span>РАССМОТРЕНО</span><b>${stats.reviewed}</b><small>Проверено или возвращено</small></article></div><div class="admin-section-head"><div><span>ПОСЛЕДНИЕ СОБЫТИЯ</span><h2>Учебные работы</h2></div><button data-admin-tab="reviews">Все работы ${icon("arrow")}</button></div>${items.slice(0,4).map(item=>adminSubmissionCard(item,false)).join("")||`<div class="admin-empty">Отправленных работ пока нет.</div>`}</section>`:adminTab==="reviews"?`<section><div class="admin-section-head"><div><span>ПРОВЕРКА</span><h2>Работы студентов</h2></div><span class="admin-count">${items.length}</span></div>${items.map(item=>adminSubmissionCard(item,true)).join("")||`<div class="admin-empty">Пока нет отправленных работ.</div>`}</section>`:adminTab==="students"?adminStudentsPage():adminTab==="payments"?adminPaymentPlansPage():adminTab==="audit"?adminAuditPage():`<section><div class="admin-bot-card"><div class="admin-bot-top"><span class="admin-bot-icon">M</span><div><span>TELEGRAM BOT</span><h2>${esc(data?.bot?.firstName||"MAGNUS")}</h2><p>@${esc(data?.bot?.username||"bot")}</p></div><span class="admin-live">${data?.bot?.webhookActive?"Webhook активен":"Webhook не настроен"}</span></div><div class="admin-bot-meta"><div><small>ОЖИДАЮТ ОБРАБОТКИ</small><b>${Number(data?.bot?.webhookPending||0)}</b></div><div><small>КОМАНД В МЕНЮ</small><b>${data?.bot?.commands?.length||0}</b></div></div>${data?.bot?.lastError?`<p class="admin-bot-warning">${esc(data.bot.lastError)}</p>`:""}</div>
 <div class="admin-settings-card admin-bot-settings"><span>НАСТРОЙКИ БОТА</span><h2>Сообщения и оформление</h2><p>Изменения сохраняются в облачной базе. Приветствие применяется к новым сообщениям /start, описание и кнопка — к профилю и меню Telegram.</p>
 <label>Приветствие при запуске <textarea data-bot-setting="welcomeMessage" maxlength="3500" rows="4">${esc(settings.welcomeMessage||"")}</textarea><small>До 3500 символов. Переносы строк сохраняются.</small></label>
 <label>Описание бота <textarea data-bot-setting="description" maxlength="512" rows="3">${esc(settings.description||"")}</textarea><small>Показывается в профиле бота · до 512 символов.</small></label>
 <label>Краткое описание <input data-bot-setting="shortDescription" maxlength="120" value="${esc(settings.shortDescription||"")}" /><small>Короткая подпись профиля · до 120 символов.</small></label>
 <label>Текст кнопки меню <input data-bot-setting="menuButtonText" maxlength="64" value="${esc(settings.menuButtonText||"")}" /><small>До 64 символов.</small></label>
 <div class="admin-settings-actions"><button class="orange-button" data-admin-action="save-bot-settings">Сохранить и применить ${icon("arrow")}</button><span>Команды: /start и /help. Админ-команда скрыта из меню.</span></div>
 </div>
 <div class="admin-command-list"><span>КОМАНДЫ БОТА</span>${(data?.bot?.commands||[]).map(item=>`<div><b>/${esc(item.command)}</b><span>${esc(item.description)}</span></div>`).join("")||`<p>Команды ещё не настроены.</p>`}</div></section>`}
 </main>`;
}

function render() {
  const pages = {home:homePage,faculties:facultiesPage,facultyDetail:facultyDetailPage,study:studyPage,courseDetail:courseDetailPage,lesson:lessonPage,assignments:assignmentsPage,assignmentDetail:assignmentDetailPage,documents:documentsPage,profile:profilePage,admin:adminPage};
  document.querySelector("#app").innerHTML = `${topbar()}${(pages[currentPage] || homePage)()}${bottomNav()}<div class="toast" id="toast" role="status"></div>`;
  bindEvents();
}

function toast(message) {
  const el = document.querySelector("#toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("visible"), 2600);
}

function bindEvents() {
  document.querySelectorAll("[data-admin-tab]").forEach(el=>el.addEventListener("click",()=>{adminTab=el.dataset.adminTab;if(adminTab==="students")loadAdminStudents();else if(adminTab==="payments")loadAdminPaymentPlans();else if(adminTab==="audit")loadAdminAudit();else render();}));
  document.querySelectorAll("[data-admin-refresh]").forEach(el=>el.addEventListener("click",()=>{if(adminAccess.isAdmin)loadAdminDashboard();else loadAdminAccess(true);}));
  document.querySelectorAll("[data-admin-audit-refresh]").forEach(el=>el.addEventListener("click",loadAdminAudit));
  document.querySelectorAll("[data-admin-students-refresh]").forEach(el=>el.addEventListener("click",loadAdminStudents));
  document.querySelectorAll("[data-buy-plan]").forEach(button=>button.addEventListener("click",()=>purchaseSubscription(button.dataset.buyPlan,button)));
  document.querySelectorAll("[data-admin-payment-history-refresh]").forEach(el=>el.addEventListener("click",loadAdminPaymentOrders));
document.querySelectorAll("[data-student-payment-refresh]").forEach(el=>el.addEventListener("click",loadStudentPaymentHistory));
document.querySelectorAll("[data-admin-payment-refresh]").forEach(el=>el.addEventListener("click",loadAdminPaymentPlans));
  document.querySelectorAll("[data-admin-payment-save]").forEach(button=>button.addEventListener("click",()=>{
    const plans=adminPaymentPlans.map(plan=>({
      planId:plan.planId,
      starsPrice:Number(document.querySelector('[data-payment-price="'+plan.planId+'"]')?.value||0),
      enabled:Boolean(document.querySelector('[data-payment-enabled="'+plan.planId+'"]')?.checked),
    }));
    if(plans.some(plan=>!Number.isInteger(plan.starsPrice)||plan.starsPrice<0||plan.starsPrice>100000)){toast("Цена должна быть целым числом от 0 до 100 000 Stars.");return;}
    button.disabled=true;button.textContent="Сохраняем…";
    const called=callAdminApi("savePaymentPlans",{plans},(error,result)=>{
      button.disabled=false;button.textContent="Сохранить тарифы";
      if(error||!result?.ok){toast(error?.message||result?.message||"Не удалось сохранить тарифы.");return;}
      adminPaymentPlans=Array.isArray(result.plans)?result.plans:plans;render();toast(result.message||"Тарифы сохранены.");
    });
    if(!called){button.disabled=false;button.textContent="Сохранить тарифы";toast("Открой панель из Telegram.");}
  }));
  document.querySelectorAll("[data-admin-student]").forEach(el=>el.addEventListener("click",()=>loadAdminStudentDetail(el.dataset.adminStudent)));
  document.querySelectorAll("[data-admin-student-back]").forEach(el=>el.addEventListener("click",()=>{adminStudentSelected="";adminStudentDetail=null;adminStudentDetailError="";render();}));
  document.querySelectorAll("[data-admin-subscription-grant]").forEach(button=>button.addEventListener("click",()=>{
    const studentId=button.dataset.studentId;
    const days=Number(document.querySelector("[data-admin-subscription-days]")?.value||30);
    if(!window.confirm("Выдать этому студенту учебный доступ на "+days+" дней?"))return;
    button.disabled=true;button.textContent="Сохраняем…";
    const called=callAdminApi("grantSubscription",{studentId,days},(error,result)=>{
      if(error||!result?.ok){button.disabled=false;button.textContent="Выдать доступ";toast(error?.message||result?.message||"Не удалось выдать доступ.");return;}
      toast(result.message||"Доступ выдан.");loadAdminStudentDetail(studentId);
    });
    if(!called){button.disabled=false;button.textContent="Выдать доступ";toast("Открой панель из Telegram.");}
  }));
  document.querySelectorAll("[data-admin-subscription-revoke]").forEach(button=>button.addEventListener("click",()=>{
    const studentId=button.dataset.studentId;
    if(!window.confirm("Отозвать действующий учебный доступ у этого студента?"))return;
    button.disabled=true;button.textContent="Отзываем…";
    const called=callAdminApi("revokeSubscription",{studentId},(error,result)=>{
      if(error||!result?.ok){button.disabled=false;button.textContent="Отозвать доступ";toast(error?.message||result?.message||"Не удалось отозвать доступ.");return;}
      toast(result.message||"Доступ отозван.");loadAdminStudentDetail(studentId);
    });
    if(!called){button.disabled=false;button.textContent="Отозвать доступ";toast("Открой панель из Telegram.");}
  }));
  document.querySelectorAll("[data-admin-student-send]").forEach(button=>button.addEventListener("click",()=>{
    const field=document.querySelector("[data-admin-student-message]");
    const message=(field?.value||"").trim();
    if(!message){toast("Напиши сообщение перед отправкой.");return;}
    if(message.length>3500){toast("Максимальная длина — 3500 символов.");return;}
    const studentId=button.dataset.studentId;
    button.disabled=true;button.textContent="Отправляем…";
    const called=callAdminApi("sendStudentMessage",{studentId,message},(error,result)=>{
      if(error||!result?.ok){button.disabled=false;button.textContent="Отправить";toast(error?.message||result?.message||"Не удалось отправить сообщение.");return;}
      if(field)field.value="";
      toast(result.message||"Результат отправки сохранён.");
      loadAdminStudentDetail(studentId);
    });
    if(!called){button.disabled=false;button.textContent="Отправить";toast("Открой панель из Telegram, чтобы отправить сообщение.");}
  }));
  document.querySelectorAll("[data-admin-student-search]").forEach(input=>input.addEventListener("input",()=>{
    const query=input.value.trim().toLowerCase();let visible=0;
    document.querySelectorAll("[data-admin-student-row]").forEach(row=>{const match=(row.dataset.search||"").includes(query);row.hidden=!match;if(match)visible++;});
    const empty=document.querySelector(".admin-student-empty-filter");if(empty)empty.hidden=visible>0;
  }));
  document.querySelectorAll("[data-admin-action]").forEach(el=>el.addEventListener("click",()=>{
    if(el.dataset.adminAction==="save-bot-settings"){
      const payload={};
      document.querySelectorAll("[data-bot-setting]").forEach(field=>{payload[field.dataset.botSetting]=field.value.trim();});
      if(Object.values(payload).some(value=>!value)){toast("Заполни все поля настроек бота.");return;}
      el.disabled=true;el.textContent="Сохраняем…";
      const called=callAdminApi("saveBotSettings",payload,(error,result)=>{
        el.disabled=false;el.textContent="Сохранить и применить";
        if(error||!result?.ok){toast(error?.message||result?.message||"Не удалось сохранить настройки.");return;}
        loadAdminDashboard();
        toast(result.message||"Настройки сохранены.");
      });
      if(!called){el.disabled=false;el.textContent="Сохранить и применить";toast("Открой панель из Telegram, чтобы сохранить настройки.");}
    }else if(el.dataset.adminAction==="configure-bot"){
      el.disabled=true;el.textContent="Применяем…";
      callAdminApi("configureBot",{},(error,result)=>{toast(error?.message||result?.message||"Настройка завершена.");loadAdminDashboard();});
    }
  }));
  document.querySelectorAll("[data-review-status]").forEach(el=>el.addEventListener("click",()=>{const card=el.closest("[data-admin-submission]"),comment=card?.querySelector("[data-review-comment]")?.value||"",grade=card?.querySelector("[data-review-grade]")?.value??"";el.disabled=true;callAdminApi("reviewSubmission",{studentId:el.dataset.studentId,submissionId:el.dataset.submissionId,status:el.dataset.reviewStatus,comment,grade},(error,result)=>{if(error||!result?.ok){toast(error?.message||result?.message||"Не удалось сохранить проверку.");loadAdminDashboard();return;}toast(result.notificationSent?"Проверка сохранена, уведомление отправлено.":"Проверка сохранена. Бот не смог доставить уведомление.");loadAdminDashboard();});}));
  document.querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", () => { currentPage = el.dataset.go; searchValue=""; if(currentPage==="admin")loadAdminDashboard(); if(currentPage==="profile")loadStudentPaymentHistory(); render(); window.scrollTo({top:0,behavior:"smooth"}); }));
  document.querySelectorAll("[data-faculty]").forEach(el => el.addEventListener("click", () => { selectedFaculty=faculties.find(f=>f.id===el.dataset.faculty)||faculties[0]; currentPage="facultyDetail"; render(); window.scrollTo({top:0,behavior:"smooth"}); }));
  document.querySelectorAll("[data-lesson-open]").forEach(el=>el.addEventListener("click",()=>{selectedLessonId=el.dataset.lessonOpen;quizChoice="";lessonTab="lesson";currentPage="lesson";render();window.scrollTo({top:0,behavior:"smooth"});}));
  document.querySelectorAll("[data-course]").forEach(el => el.addEventListener("click", (event) => {
    event.stopPropagation();
    const id = el.dataset.course;
    selectedCourse = courses.find(c => c.id === id) || courses[0];
    selectedLessonId = courseLessons(selectedCourse.id)[0]?.[0] || "";
    currentPage = "courseDetail";
    render();
    window.scrollTo({top:0,behavior:"smooth"});
  }));
  document.querySelectorAll("[data-assignment-open]").forEach(el => el.addEventListener("click", () => {
    selectedAssignmentId = el.dataset.assignmentOpen;
    currentPage = "assignmentDetail";
    render();
    window.scrollTo({top:0,behavior:"smooth"});
  }));
  document.querySelectorAll("[data-assignment-filter]").forEach(el => el.addEventListener("click", () => {
    activeAssignmentFilter = el.dataset.assignmentFilter;
    render();
  }));
  document.querySelectorAll("[data-lesson-tab]").forEach(el => el.addEventListener("click", () => { lessonTab=el.dataset.lessonTab; render(); }));
  document.querySelectorAll("[data-quiz]").forEach(el => el.addEventListener("click", () => {
    quizChoice=el.dataset.quiz;
    const previous = lessonQuizResults[selectedLessonId] ? JSON.parse(lessonQuizResults[selectedLessonId]) : null;
    lessonQuizResults[selectedLessonId] = JSON.stringify({ choice: quizChoice, correct: quizChoice === String(selectedLesson()?.[11]), attempts: (previous?.attempts || 0) + 1, answeredAt: new Date().toISOString() });
    storeLessonQuizResults();
    scheduleCloudStudentDataSync();
    render();
  }));

  document.querySelectorAll("[data-filter]").forEach(el => el.addEventListener("click", () => { activeFilter=el.dataset.filter; render(); }));
  document.querySelectorAll("[data-action]").forEach(el => el.addEventListener("click", () => {
    if (el.dataset.action === "save-assignment-draft") {
      const field = document.querySelector("#assignment-answer");
      if (!field) return;
      assignmentDrafts[selectedAssignmentId] = field.value;
      const saved = storeAssignmentDrafts();
      scheduleCloudStudentDataSync();
      render();
      toast(saved
        ? "Черновик сохранён. Преподавателю он пока не отправлен."
        : "Не удалось сохранить черновик в памяти браузера.");
      return;
    }
    if (el.dataset.action === "submit-assignment") {
      const field=document.querySelector("#assignment-answer"),answer=field?.value.trim()||"";
      if(answer.length<30){toast("Добавь ещё немного текста: минимум 30 символов.");return;}
      if(answer.length>12000){toast("Ответ слишком длинный. Максимум — 12 000 символов.");return;}
      if(!telegramUser?.id){toast("Отправка доступна после открытия MAGNUS из Telegram.");return;}
      el.disabled=true;el.textContent="Отправляем…";
      const called=callCloudStudentData("submitAssignment",{assignmentId:selectedAssignmentId,answer},(error,result)=>{
        if(error||!result?.ok||!result.submission){toast(result?.message||"Не удалось отправить ответ. Попробуй ещё раз.");render();return;}
        assignmentSubmissions[selectedAssignmentId]=[...(assignmentSubmissions[selectedAssignmentId]||[]),result.submission].slice(-50);
        storeAssignmentSubmissions();
        toast("Ответ сохранён в облачной истории MAGNUS.");render();
      });
      if(!called){toast("Облачная отправка недоступна в этом режиме.");render();}
      return;
    }
    if (el.dataset.action === "open-lesson") { selectedLessonId=courseLessons(selectedCourse.id)[0]?.[0]||""; currentPage="lesson"; lessonTab="lesson"; quizChoice=""; render(); window.scrollTo({top:0,behavior:"smooth"}); return; }
    if (el.dataset.action === "interest") {
      if (interestedFaculties[selectedFaculty.id]) delete interestedFaculties[selectedFaculty.id];
      else interestedFaculties[selectedFaculty.id] = "saved";
      const saved = storeInterestedFaculties();
      scheduleCloudStudentDataSync();
      render();
      toast(saved ? (interestedFaculties[selectedFaculty.id] ? "Направление сохранено." : "Направление убрано из интересов.") : "Не удалось сохранить интерес на устройстве.");
      return;
    }
    if (el.dataset.action === "lesson-finish") {
      completedLessons[selectedLessonId] = new Date().toISOString();
      const saved = storeCompletedLessons();
      scheduleCloudStudentDataSync();
      render();
      toast(saved ? "Отметка о прохождении примера сохранена." : "Не удалось сохранить отметку.");
      return;
    }
    const actions = {notifications:"Система уведомлений пока не подключена.",course:"Раздел курсов пока демонстрационный.", "course-start":"Видеоурок пока недоступен.",settings:"Настройки появятся в следующем обновлении.",support:"Раздел поддержки скоро будет доступен.",about:"MAGNUS — пространство для знаний, открытий и развития."};
    toast(actions[el.dataset.action] || "Это действие пока недоступно.");
  }));
  const noteField = document.querySelector("#lesson-note");
  noteField?.addEventListener("input", e => {
    lessonNotes[selectedLessonId] = e.target.value;
    storeLessonNotes();
    scheduleCloudStudentDataSync();
  });
  const assignmentField = document.querySelector("#assignment-answer");
  assignmentField?.addEventListener("input", e => {
    const value = e.target.value;
    assignmentDrafts[selectedAssignmentId] = value;
    const saved = storeAssignmentDrafts();
    scheduleCloudStudentDataSync();
    const counter = document.querySelector("#assignment-char-count");
    const status = document.querySelector("#assignment-save-status");
    const headerStatus = document.querySelector("#assignment-detail-status");
    const draftMark = document.querySelector("#assignment-draft-mark");
    if (counter) counter.textContent = `${value.length} символов`;
    if (status) status.textContent = saved ? "Сохранено на устройстве" : "Не удалось сохранить";
    const submitButton=document.querySelector("[data-action=\"submit-assignment\"]");
    if(submitButton) submitButton.disabled=value.trim().length<30;
    if (headerStatus) {
      headerStatus.textContent = value.trim() ? "Черновик сохранён" : "К выполнению";
      headerStatus.classList.toggle("has-draft", Boolean(value.trim()));
    }
    if (draftMark) draftMark.textContent = value.trim() ? "ЧЕРНОВИК ЕСТЬ" : "НОВЫЙ ОТВЕТ";
  });
  const input = document.querySelector("#faculty-search");
  input?.addEventListener("input", e => { const pos=e.target.selectionStart; searchValue=e.target.value; const y=window.scrollY; render(); const next=document.querySelector("#faculty-search"); next?.focus(); next?.setSelectionRange(pos,pos); window.scrollTo(0,y); });
}

function triggerStartupHaptic() {
  const haptic = tg?.HapticFeedback;
  if (typeof haptic?.impactOccurred === "function") {
    // Три мягких импульса создают более длинный, плавный тактильный отклик.
    const pulse = (style) => {
      try { haptic.impactOccurred(style); } catch { /* Стиль может не поддерживаться устройством. */ }
    };
    pulse("soft");
    window.setTimeout(() => pulse("medium"), 145);
    window.setTimeout(() => pulse("soft"), 315);
    return;
  }
  try {
    window.navigator?.vibrate?.([65, 55, 85, 55, 105]);
  } catch {
    // Поддержка вибрации зависит от браузера и устройства.
  }
}

function showStartupScreen() {
  const root = document.querySelector("#app");
  if (!root) return;
  root.insertAdjacentHTML("afterbegin", `
    <div class="startup-screen" role="status" aria-label="Загрузка MAGNUS">
      <div class="startup-inner">
        <div class="startup-orbit startup-orbit-one"></div><div class="startup-orbit startup-orbit-two"></div>
        <span class="startup-spark startup-spark-one">✦</span><span class="startup-spark startup-spark-two">✧</span>
        <div class="startup-owl-wrap"><span class="startup-owl-halo"></span><img class="startup-owl" src="/mascot/magnus-owl.svg" alt="" /></div>
        <div class="startup-wordmark">MAGNUS</div>
        <div class="startup-caption">UNIVERSITY <i></i> LEARN WITH PURPOSE</div>
        <div class="startup-loader" aria-hidden="true"><span></span></div>
        <div class="startup-loading-text">Открываем новые возможности</div>
      </div>
    </div>
  `);
  window.setTimeout(() => {
    const splash = document.querySelector(".startup-screen");
    if (!splash) return;
    splash.classList.add("is-hidden");
    window.setTimeout(() => splash.remove(), 420);
  }, 1650);
}

render();
if(currentPage==="admin")loadAdminAccess(true);else loadAdminAccess(false);
loadPaymentPlans();
showStartupScreen();
triggerStartupHaptic();
initializeCloudStudentData();