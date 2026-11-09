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

let currentPage = "home";
let selectedFaculty = faculties[0];
let selectedCourse = courses[0];
let lessonTab = "lesson";
let quizChoice = "";
let searchValue = "";
let activeFilter = "Все";
let selectedAssignmentId = assignments[0].id;
let activeAssignmentFilter = "Все";
let assignmentDrafts = loadAssignmentDrafts();
let lessonNotes = loadLessonNotes();
let interestedFaculties = loadInterestedFaculties();
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
    back:'<path d="m15 18-6-6 6-6"/>'
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
function callCloudStudentData(action, payload, callback) {
  const serverless = tg?.Serverless;
  if (typeof serverless?.call !== "function") return false;
  serverless.call("studentData", { action, ...payload }, (error, result) => {
    if (typeof callback === "function") callback(error, result);
  });
  return true;
}

function scheduleCloudStudentDataSync() {
  if (!cloudSyncReady) return;
  window.clearTimeout(cloudSyncTimer);
  cloudSyncTimer = window.setTimeout(() => {
    callCloudStudentData("save", {
      assignmentDrafts,
      lessonNotes,
      interestedFaculties
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
    const localNotes = Object.keys(lessonNotes).length > 0;
    const localInterests = Object.keys(interestedFaculties).length > 0;
    assignmentDrafts = { ...(result.assignmentDrafts || {}), ...assignmentDrafts };
    lessonNotes = { ...(result.lessonNotes || {}), ...lessonNotes };
    interestedFaculties = { ...(result.interestedFaculties || {}), ...interestedFaculties };
    storeAssignmentDrafts();
    storeLessonNotes();
    storeInterestedFaculties();
    cloudSyncReady = true;
    render();
    // Если локальные данные старше облачных, объединённый результат также отправляем в облако.
    if (localAssignments || localNotes || localInterests) scheduleCloudStudentDataSync();
  });
}

function hasAssignmentDraft(id) {
  return Boolean(String(assignmentDrafts[id] || "").trim());
}
function assignmentStatusText(id) {
  return hasAssignmentDraft(id) ? "Черновик сохранён" : "К выполнению";
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
  const c = selectedCourse;
  const modules = [
    ["01", "Знакомство с темой", "Введение"],
    ["02", "Ключевые понятия", "Теория"],
    ["03", "Разбираем на примерах", "Практика"],
    ["04", "Проверяем понимание", "Мини-тест"],
    ["05", "Итоговый разбор", "Закрепление"]
  ];
  return `<main class="screen inner-screen course-detail-screen">
    <button class="back-button" data-go="study">${icon("back")} Все курсы</button>
    <section class="course-detail-hero ${c.color}" data-course-art="${c.id}">
      ${courseArtwork(c)}
      <span class="course-detail-kicker">${esc(c.category)}</span>
      <div class="course-detail-mark">${esc(c.mark)}</div>
      <div class="course-detail-bottom"><span>ПРИМЕР ПРОГРАММЫ</span></div>
    </section>
    <div class="course-detail-title"><div class="kicker">ОПИСАНИЕ КУРСА</div><h1>${esc(c.title)}</h1><p>${esc(c.lesson)}. Содержание и структура приведены как пример.</p></div>
    <section class="course-detail-summary"><span class="subtle-label">СТРУКТУРА</span><b>5 тематических блоков</b><p>Это предварительный план. Содержание уроков будет добавлено после утверждения программы.</p></section>
    <section class="module-section"><div class="section-title"><div><span class="subtle-label">СОДЕРЖАНИЕ</span><h2>Темы курса</h2></div><span class="course-count">5 блоков</span></div>
      <div class="module-list">${modules.map(([n,title,meta])=>`<div class="module-row"><span class="module-number">${n}</span><div><b>${esc(title)}</b><small>${esc(meta)}</small></div></div>`).join("")}</div>
    </section>
    <div class="course-detail-cta"><div><b>Ознакомительный урок</b><small>Учебный пример, не часть действующей программы.</small></div><button class="orange-button" data-action="open-lesson">Открыть пример ${icon("arrow")}</button></div>
    <p class="demo-disclaimer">Демонстрационная программа. Фактические материалы, преподаватели и условия обучения будут опубликованы отдельно.</p>
  </main>`;
}

function lessonPage() {
  const c = selectedCourse;
  const tabContent = lessonTab === "notes"
    ? `<div class="lesson-notes"><div class="lesson-notes-head"><label for="lesson-note">МОИ ЗАМЕТКИ</label><span>${icon("cloud")} АВТОСОХРАНЕНИЕ</span></div><textarea id="lesson-note" placeholder="Запишите важную мысль, пример или вопрос...">${esc(lessonNotes[c.id] || "")}</textarea><small>Заметки сохраняются автоматически на устройстве и отправляются в облако при доступности синхронизации.</small></div>`
    : lessonTab === "materials"
      ? `<div class="lesson-reading"><span class="subtle-label">КОНСПЕКТ · 4 МИН ЧТЕНИЯ</span><h3>Главная идея занятия</h3><p>Любая сложная тема становится понятнее, если разделить её на небольшие понятия, увидеть связь между ними и разобрать конкретный пример.</p><blockquote>Сначала наблюдение — затем гипотеза — после этого проверка.</blockquote><h3>На что обратить внимание</h3><ul><li>Определите ключевые понятия.</li><li>Найдите связь между причиной и следствием.</li><li>Проверьте вывод на примере.</li></ul></div>`
      : `<div class="lesson-reading"><span class="subtle-label">УРОК 03 · 24 МИНУТЫ</span><h3>Разбираем на примерах</h3><p>В этом занятии мы переходим от теории к практике. Посмотрите на ситуацию, выделите основные факторы и попробуйте объяснить, почему результат получился именно таким.</p><div class="lesson-callout"><b>Цель занятия</b><span>Научиться применять ключевые понятия курса к реальным ситуациям.</span></div><p>После просмотра изучите конспект и ответьте на контрольный вопрос.</p></div>`;
  return `<main class="screen inner-screen lesson-screen">
    <button class="back-button" data-go="courseDetail">${icon("back")} К программе курса</button>
    <div class="lesson-heading"><span class="subtle-label">${c.category.toUpperCase()} · ПРАКТИЧЕСКОЕ ЗАНЯТИЕ</span><h1>Разбираем<br><em>на примерах.</em></h1><p>${c.title}</p>
      <div class="lesson-meta-row"><span><i class="meta-clock"></i>24 минуты</span><span><i class="meta-play"></i>Практика</span><span><i class="meta-file"></i>Конспект и тест</span></div>
    </div>
    <section class="lesson-player" aria-label="Видеоплеер — демонстрационный экран">
      <div class="player-grain"></div><div class="player-orbit"></div><div class="player-brand">MAGNUS <span>LEARNING STUDIO</span></div>
      <div class="player-center"><button class="player-play" type="button" data-action="course-start" aria-label="Видеоурок пока недоступен">▶</button><b>Видеоурок</b><small>Видео будет подключено позднее</small></div>
      <div class="player-controls"><span>МАГНУС</span><span class="player-coming-soon">УЧЕБНОЕ ВИДЕО · 24 МИН</span><span>СКОРО</span></div>
    </section>
    <div class="lesson-tabs" role="tablist" aria-label="Материалы урока">${[["lesson","Урок"],["materials","Конспект"],["notes","Заметки"]].map(([id,label])=>`<button type="button" role="tab" id="lesson-tab-${id}" aria-controls="lesson-panel" aria-selected="${lessonTab===id}" tabindex="${lessonTab===id?"0":"-1"}" class="${lessonTab===id?"selected":""}" data-lesson-tab="${id}">${label}</button>`).join("")}</div>
    <section class="lesson-content" id="lesson-panel" role="tabpanel" aria-labelledby="lesson-tab-${lessonTab}">${tabContent}</section>
    <section class="lesson-quiz" aria-labelledby="lesson-quiz-title"><div class="kicker">ПРОВЕРЬ СЕБЯ</div><h2 id="lesson-quiz-title">Что помогает перейти от теории к пониманию?</h2><p>Выберите один вариант ответа.</p>
      ${["Заучивание определений без примеров","Разбор конкретной ситуации и проверка вывода","Пропуск сложных понятий"].map((answer,i)=>`<button type="button" class="quiz-option ${quizChoice===String(i)?"chosen":""}" data-quiz="${i}" aria-pressed="${quizChoice===String(i)}"><span>${String.fromCharCode(65+i)}</span>${answer}${quizChoice===String(i)?'<b aria-hidden="true">✓</b>':""}</button>`).join("")}
      ${quizChoice!==""?`<div class="quiz-feedback ${quizChoice==="1"?"correct":"incorrect"}" role="status" aria-live="polite">${quizChoice==="1"?"Верно! Пример помогает связать понятия с практикой.":"Попробуйте ещё раз: подумайте, что помогает применить знания на практике."}</div>`:""}
    </section>
    <div class="lesson-footer"><button class="lesson-finish" data-action="lesson-finish">Отметить в демо-режиме ${icon("arrow")}</button><small>Видео и завершение урока пока не связаны с учебной системой.</small></div>
  </main>`;
}


function assignmentsPage() {
  const counts = {
    all: assignments.length,
    pending: assignments.filter(a => !hasAssignmentDraft(a.id)).length,
    drafts: assignments.filter(a => hasAssignmentDraft(a.id)).length
  };
  const filters = [
    { label:"Все", count:counts.all },
    { label:"Нужно выполнить", count:counts.pending },
    { label:"Черновики", count:counts.drafts }
  ];
  const filtered = assignments.filter(a => {
    if (activeAssignmentFilter === "Черновики") return hasAssignmentDraft(a.id);
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
        <div class="assignment-card-top"><span class="assignment-kind">${esc(a.type)}</span><span class="assignment-status ${hasAssignmentDraft(a.id)?"has-draft":""}">${assignmentStatusText(a.id)}</span></div>
        <h2>${esc(a.title)}</h2>
        <p>${esc(a.course)}</p>
        <div class="assignment-card-meta"><span class="assignment-due"><small>СРОК</small><b>${esc(a.due)}</b></span><span class="assignment-estimate"><small>ВРЕМЯ</small><b>${esc(a.estimate)}</b></span></div>
        <button class="assignment-open" data-assignment-open="${a.id}">Открыть задание ${icon("arrow")}</button>
      </article>`).join("")}
      ${filtered.length ? "" : `<div class="assignment-empty"><b>${activeAssignmentFilter==="Черновики"?"Черновиков пока нет":"Все задания уже разобраны"}</b><p>${activeAssignmentFilter==="Черновики"?"Начни с любого задания — текст ответа сохранится здесь.":"В этой категории пока нет заданий."}</p><button data-assignment-filter="Все">Показать все задания</button></div>`}
    </div>
    <p class="assignment-demo-note">Задания и сроки демонстрационные. Черновики сохраняются на устройстве; отправка преподавателю и проверка пока не подключены.</p>
  </main>`;
}

function assignmentDetailPage() {
  const a = assignments.find(item => item.id === selectedAssignmentId) || assignments[0];
  const draft = assignmentDrafts[a.id] || "";
  const saved = hasAssignmentDraft(a.id);
  return `<main class="screen inner-screen assignment-detail-screen">
    <button class="back-button" data-go="assignments">${icon("back")} Все задания</button>
    <section class="assignment-detail-hero">
      <div class="assignment-detail-top"><span class="assignment-kind">${esc(a.type)} · MAGNUS</span><span class="assignment-status ${saved?"has-draft":""}" id="assignment-detail-status">${assignmentStatusText(a.id)}</span></div>
      <h1>${esc(a.title)}</h1>
      <p>${esc(a.course)}</p>
      <div class="assignment-detail-meta"><span><small>СРОК СДАЧИ</small><b>${esc(a.due)}</b></span><span><small>ОЦЕНКА ВРЕМЕНИ</small><b>${esc(a.estimate)}</b></span></div>
    </section>
    <section class="assignment-instructions">
      <span class="subtle-label">ЧТО НУЖНО СДЕЛАТЬ</span>
      <p>${esc(a.description)}</p>
      <h2>План выполнения</h2>
      <ol>${a.requirements.map((r,i)=>`<li><span>0${i+1}</span>${esc(r)}</li>`).join("")}</ol>
    </section>
    <section class="assignment-answer">
      <div class="assignment-answer-head"><div><span class="subtle-label">ТВОЙ ОТВЕТ</span><h2>Рабочее поле</h2></div><span class="assignment-draft-mark" id="assignment-draft-mark">${saved?"ЧЕРНОВИК ЕСТЬ":"НОВЫЙ ОТВЕТ"}</span></div>
      <textarea id="assignment-answer" aria-label="Текст ответа на задание" placeholder="Начни писать ответ здесь...">${esc(draft)}</textarea>
      <div class="assignment-answer-footer"><span id="assignment-char-count">${draft.length} символов</span><span id="assignment-save-status" role="status" aria-live="polite">${saved?"Сохранено на устройстве":"Автосохранение включено"}</span></div>
      <div class="assignment-save-row"><small>Ответ пока является личным черновиком и не отправляется преподавателю.</small><button class="orange-button" data-action="save-assignment-draft">Сохранить черновик ${icon("arrow")}</button></div>
    </section>
    <p class="assignment-demo-note">Это демонстрационный центр заданий. Отправка преподавателю, загрузка файлов, проверка и выставление оценок пока не подключены.</p>
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
  const telegramConnected = Boolean(telegramUser?.id);
  const profileName = telegramUser?.first_name || "Гость MAGNUS";
  const profileCaption = telegramUser?.username
    ? `@${telegramUser.username}`
    : telegramConnected ? "Профиль из Telegram" : "Telegram-профиль не получен";
  return `<main class="screen inner-screen profile-screen">
    ${heading("ЛИЧНОЕ ПРОСТРАНСТВО", "Твой профиль<br><em>MAGNUS.</em>", "Аккаунт и сохранённые учебные материалы.")}
    <section class="profile-card">
      <div class="profile-avatar">${avatarContent()}</div>
      <div class="profile-info"><small>ЛИЧНЫЙ КАБИНЕТ</small><h2>${esc(profileName)}</h2><p>${esc(profileCaption)}</p></div>
      <span class="profile-connection ${telegramConnected?"connected":""}">${telegramConnected?"TELEGRAM":"ГОСТЕВОЙ РЕЖИМ"}</span>
    </section>
    <div class="profile-content-heading"><div><span class="subtle-label">СОХРАНЁННОЕ</span><h2>Учебные материалы</h2></div><span>${cloudSyncReady?"Синхронизировано":"На устройстве"}</span></div>
    <div class="profile-stats">
      <div><b>${draftCount}</b><small>Черновики</small></div>
      <div><b>${noteCount}</b><small>Заметки</small></div>
      <div><b>${telegramConnected?"Да":"—"}</b><small>Telegram</small></div>
    </div>
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

function render() {
  const pages = {home:homePage,faculties:facultiesPage,facultyDetail:facultyDetailPage,study:studyPage,courseDetail:courseDetailPage,lesson:lessonPage,assignments:assignmentsPage,assignmentDetail:assignmentDetailPage,documents:documentsPage,profile:profilePage};
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
  document.querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", () => { currentPage = el.dataset.go; searchValue=""; render(); window.scrollTo({top:0,behavior:"smooth"}); }));
  document.querySelectorAll("[data-faculty]").forEach(el => el.addEventListener("click", () => { selectedFaculty=faculties.find(f=>f.id===el.dataset.faculty)||faculties[0]; currentPage="facultyDetail"; render(); window.scrollTo({top:0,behavior:"smooth"}); }));
  document.querySelectorAll("[data-course]").forEach(el => el.addEventListener("click", (event) => {
    event.stopPropagation();
    const id = el.dataset.course;
    selectedCourse = courses.find(c => c.id === id) || courses[0];
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
  document.querySelectorAll("[data-quiz]").forEach(el => el.addEventListener("click", () => { quizChoice=el.dataset.quiz; render(); }));

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
    if (el.dataset.action === "open-lesson") { currentPage="lesson"; lessonTab="lesson"; quizChoice=""; render(); window.scrollTo({top:0,behavior:"smooth"}); return; }
    if (el.dataset.action === "interest") {
      if (interestedFaculties[selectedFaculty.id]) delete interestedFaculties[selectedFaculty.id];
      else interestedFaculties[selectedFaculty.id] = "saved";
      const saved = storeInterestedFaculties();
      scheduleCloudStudentDataSync();
      render();
      toast(saved ? (interestedFaculties[selectedFaculty.id] ? "Направление сохранено." : "Направление убрано из интересов.") : "Не удалось сохранить интерес на устройстве.");
      return;
    }
    const actions = {"lesson-finish":"Завершение урока пока не сохраняется.",notifications:"Система уведомлений пока не подключена.",course:"Раздел курсов пока демонстрационный.", "course-start":"Видеоурок пока недоступен.",settings:"Настройки появятся в следующем обновлении.",support:"Раздел поддержки скоро будет доступен.",about:"MAGNUS — пространство для знаний, открытий и развития."};
    toast(actions[el.dataset.action] || "Это действие пока недоступно.");
  }));
  const noteField = document.querySelector("#lesson-note");
  noteField?.addEventListener("input", e => {
    lessonNotes[selectedCourse.id] = e.target.value;
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
showStartupScreen();
triggerStartupHaptic();
initializeCloudStudentData();