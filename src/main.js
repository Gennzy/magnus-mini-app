import "./style.css";

const tg = window.Telegram?.WebApp;
tg?.ready?.();
tg?.expand?.();
tg?.setHeaderColor?.("#f7f7f5");
tg?.setBackgroundColor?.("#f7f7f5");

const telegramUser = tg?.initDataUnsafe?.user;
const firstName = telegramUser?.first_name || "Александр";
const username = telegramUser?.username ? `@${telegramUser.username}` : "Студент MAGNUS";
const avatarLetter = firstName.trim().charAt(0).toUpperCase() || "M";
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
  { id:"ai", title:"Введение в искусственный интеллект", category:"Технологии", lesson:"Урок 04 · Нейросети вокруг нас", progress:68, time:"2 ч 40 мин", color:"course-ai", mark:"AI" },
  { id:"mind", title:"Психология мышления", category:"Психология", lesson:"Урок 02 · Как мы принимаем решения", progress:32, time:"1 ч 15 мин", color:"course-mind", mark:"ψ" },
  { id:"brand", title:"Основы бренд-стратегии", category:"Маркетинг", lesson:"Урок 01 · Сила позиционирования", progress:12, time:"45 мин", color:"course-brand", mark:"M" }
];


const assignments = [
  {
    id:"ai-case",
    title:"Практическая работа: разбор кейса",
    course:"Введение в искусственный интеллект",
    type:"Практика",
    due:"10 ноября",
    dueHint:"Завтра",
    estimate:"20–30 минут",
    description:"Разберите короткий сценарий использования искусственного интеллекта и объясните, какую задачу технология решает, какие данные ей нужны и где может возникнуть ошибка.",
    requirements:["Опишите задачу своими словами.","Назовите один возможный риск или ограничение.","Предложите способ проверить результат."]
  },
  {
    id:"mind-reflection",
    title:"Рефлексия: как мы принимаем решения",
    course:"Психология мышления",
    type:"Короткий ответ",
    due:"12 ноября",
    dueHint:"Через 3 дня",
    estimate:"10–15 минут",
    description:"Вспомните повседневное решение, которое вы недавно приняли. Кратко опишите, какие факторы повлияли на выбор и какую роль сыграли эмоции или привычки.",
    requirements:["Опишите ситуацию в 2–3 предложениях.","Выделите два фактора, повлиявших на решение.","Сформулируйте один вывод."]
  },
  {
    id:"brand-review",
    title:"Мини-анализ узнаваемого бренда",
    course:"Основы бренд-стратегии",
    type:"Анализ",
    due:"14 ноября",
    dueHint:"Суббота",
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
let selectedDay = "Пт";
let selectedAssignmentId = assignments[0].id;
let activeAssignmentFilter = "Все";
let assignmentDrafts = loadAssignmentDrafts();
let lessonNotes = loadLessonNotes();
let toastTimer;

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

function courseTile(c, compact=false) {
  return `<article class="course-card ${compact?"compact":""}" data-course="${c.id}" tabindex="0" role="button" aria-label="Открыть курс: ${c.title}">
    <div class="course-art ${c.color}"><span class="course-art-mark">${c.mark}</span><span class="art-orbit"></span><span class="art-dots">✦　·　✧</span></div>
    <div class="course-details"><div class="course-meta"><span>${c.category}</span><span>${c.time}</span></div><h3>${c.title}</h3><p>${c.lesson}</p><div class="progress-line"><span style="width:${c.progress}%"></span></div><div class="progress-caption"><span>${c.progress}% пройдено</span><button data-course="${c.id}">Продолжить ${icon("arrow")}</button></div></div>
  </article>`;
}



function loadAssignmentDrafts() {
  try {
    return JSON.parse(window.localStorage.getItem("magnus.assignmentDrafts") || "{}") || {};
  } catch {
    return {};
  }
}
function storeAssignmentDrafts() {
  try {
    window.localStorage.setItem("magnus.assignmentDrafts", JSON.stringify(assignmentDrafts));
    return true;
  } catch {
    return false;
  }
}
function loadLessonNotes() {
  try {
    return JSON.parse(window.localStorage.getItem("magnus.lessonNotes") || "{}") || {};
  } catch {
    return {};
  }
}
function storeLessonNotes() {
  try {
    window.localStorage.setItem("magnus.lessonNotes", JSON.stringify(lessonNotes));
    return true;
  } catch {
    return false;
  }
}
function hasAssignmentDraft(id) {
  return Boolean(String(assignmentDrafts[id] || "").trim());
}
function assignmentStatusText(id) {
  return hasAssignmentDraft(id) ? "Черновик на устройстве" : "К выполнению";
}

function dashboardOverview() {
  const drafted = assignments.filter(a => hasAssignmentDraft(a.id)).length;
  return `<section class="dashboard-overview">
    <div class="section-title"><div><span class="subtle-label">ТВОЯ ТРАЕКТОРИЯ</span><h2>Прогресс обучения</h2></div><span class="dashboard-demo-tag">ДЕМО-ДАННЫЕ</span></div>
    <div class="dashboard-metrics">
      <article class="dashboard-metric progress-metric"><div class="metric-ring"><span>68%</span></div><div><b>68%</b><small>Общий прогресс</small></div></article>
      <article class="dashboard-metric"><span class="metric-icon peach">▤</span><div><b>24 <i>/ 36</i></b><small>Уроков завершено</small></div></article>
      <article class="dashboard-metric"><span class="metric-icon mint">◷</span><div><b>12 <i>ч</i></b><small>Время обучения</small></div></article>
    </div>
    <div class="dashboard-overview-foot"><span>${drafted} из ${assignments.length} заданий имеют локальный черновик</span><button data-go="study">Моя статистика ${icon("arrow")}</button></div>
  </section>`;
}
function dashboardTasksPreview() {
  const preview = assignments.slice(0, 2);
  return `<section class="dashboard-work-grid">
    <div class="dashboard-panel">
      <div class="section-title"><div><span class="subtle-label">СЛЕДУЮЩИЕ ШАГИ</span><h2>Задания</h2></div><button class="text-link" data-go="assignments">Все задания ${icon("arrow")}</button></div>
      ${preview.map(a => `<article class="dashboard-task">
        <span class="task-marker ${hasAssignmentDraft(a.id) ? "draft" : ""}"></span>
        <div class="dashboard-task-copy"><b>${a.title}</b><small>${a.course}</small><span>${hasAssignmentDraft(a.id) ? "Черновик сохранён" : "Срок: " + a.due}</span></div>
        <button data-assignment-open="${a.id}" aria-label="Открыть задание">›</button>
      </article>`).join("")}
      <div class="dashboard-task-foot"><span>${assignments.length} учебных задания в списке</span><button data-go="assignments">Открыть центр заданий</button></div>
    </div>
    <div class="dashboard-next-card">
      <span class="subtle-label">БЛИЖАЙШЕЕ ЗАНЯТИЕ</span>
      <div class="next-date"><b>10</b><span>НОЯБРЯ<br>12:00</span></div>
      <h3>Введение в искусственный интеллект</h3>
      <p>Видеоурок · 18 минут</p>
      <button data-go="study">Посмотреть расписание ${icon("arrow")}</button>
      <small>Демонстрационное расписание</small>
    </div>
  </section>`;
}

function homePage() {
  return `<main class="screen home-screen">
    <section class="greeting-row"><div><div class="subtle-label">ПОНЕДЕЛЬНИК · ТВОЙ НОВЫЙ СТАРТ</div><h1>Привет, ${esc(firstName)}! <span class="wave">✦</span></h1><p>К чему сегодня хочется прийти?</p></div><div class="streak"><span>✦</span><b>7</b><small>дней подряд</small></div></section>
    <section class="hero-card">
      <div class="hero-glow"></div><div class="hero-copy"><span class="hero-eyebrow">MAGNUS · LEARN WITH PURPOSE</span><h2>Знания —<br>твой супернавык.</h2><p>Открывай новое, задавай вопросы и расти каждый день.</p><button class="orange-button" data-go="faculties">Выбрать направление ${icon("arrow")}</button></div>
      <div class="mascot-stage"><span class="floating-token token-one">✦</span><span class="floating-token token-two">M</span><span class="floating-token token-three">+</span><img src="/mascot/magnus-owl.svg" class="hero-mascot" alt="Совёнок MAGNUS" /></div>
      <div class="hero-index"><span>01</span><span>ОБУЧЕНИЕ НАЧИНАЕТСЯ С ИНТЕРЕСА</span></div>
    </section>
    ${dashboardOverview()}
    ${dashboardTasksPreview()}
    <section class="quick-section"><div class="section-title"><div><span class="subtle-label">ТВОЁ ПРОСТРАНСТВО</span><h2>Быстрый доступ</h2></div><button class="text-link" data-go="faculties">Все разделы ${icon("arrow")}</button></div><div class="quick-grid">
      <button class="quick-item" data-go="faculties"><span class="quick-icon peach">${icon("faculty")}</span><b>Факультеты</b><small>Найди своё</small></button>
      <button class="quick-item" data-go="study"><span class="quick-icon lilac">${icon("study")}</span><b>Обучение</b><small>Твои курсы</small></button>
      <button class="quick-item" data-go="documents"><span class="quick-icon butter">${icon("docs")}</span><b>Документы</b><small>Достижения</small></button>
      <button class="quick-item" data-go="profile"><span class="quick-icon mint">${icon("profile")}</span><b>Профиль</b><small>Твой аккаунт</small></button>
    </div></section>
    <section class="courses-section"><div class="section-title"><div><span class="subtle-label">НЕ ОСТАНАВЛИВАЙСЯ</span><h2>Продолжить обучение</h2></div><button class="text-link" data-go="study">Все курсы ${icon("arrow")}</button></div>${courseTile(courses[0],true)}</section>
    <section class="mascot-note"><div class="note-avatar"><img src="/mascot/magnus-owl.svg" alt="" /></div><div><span class="subtle-label">МАЛЕНЬКОЕ НАПОМИНАНИЕ</span><p>Большие открытия начинаются с маленького шага. Выбери то, что интересно именно тебе.</p></div><span class="note-star">✦</span></section>
  </main>`;
}

function facultyArt(f) {
  return `<div class="faculty-art ${f.color}"><span>${f.symbol}</span><b class="faculty-art-orbit"></b><b class="faculty-art-dot"></b><i>${f.num}</i></div>`;
}
function facultiesPage() {
  const filters = ["Все","Психология","Технологии","Бизнес","Гуманитарные"];
  const filtered = faculties.filter(f => {
    const matchesQuery = `${f.name} ${f.desc} ${f.en}`.toLowerCase().includes(searchValue.toLowerCase());
    const group = f.id === "psychology" ? "Психология" : f.id === "it" ? "Технологии" : ["management","economics","marketing"].includes(f.id) ? "Бизнес" : "Гуманитарные";
    return matchesQuery && (activeFilter === "Все" || group === activeFilter);
  });
  return `<main class="screen inner-screen">${heading("MAGNUS · АКАДЕМИЧЕСКАЯ СРЕДА","Выбери свой<br><em>факультет.</em>","Направления, которые помогут превратить любопытство в компетенции.")}
    <label class="search-box">${icon("search")}<input id="faculty-search" value="${esc(searchValue)}" placeholder="Поиск факультета" autocomplete="off"><span>⌘ K</span></label>
    <div class="filter-row">${filters.map(f=>`<button class="filter-chip ${activeFilter===f?"selected":""}" data-filter="${f}">${f}</button>`).join("")}</div>
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
    <div class="detail-banner ${f.color}"><div><span class="subtle-label">НАПРАВЛЕНИЕ ${f.num} / 06</span><h1>${f.name}</h1><p>${f.desc}</p><span class="detail-en">${f.en}</span></div><div class="detail-symbol">${f.symbol}</div><span class="detail-banner-index">MAGNUS ACADEMY</span></div>
    <section class="faculty-intro"><div><span class="subtle-label">О НАПРАВЛЕНИИ</span><h2>Знания, которые<br><em>работают в жизни.</em></h2></div><p>Здесь ты познакомишься с ключевыми идеями области, научишься применять их на практике и постепенно сформируешь собственный образовательный маршрут.</p></section>
    <section class="detail-topics"><div><span class="subtle-label">ПЕРВЫЕ ШАГИ</span><h2>Что будем<br><em>изучать?</em></h2></div><ol>${f.topics.map((t,i)=>`<li><span>0${i+1}</span>${t}</li>`).join("")}</ol></section>
    <section class="faculty-outcomes"><div class="section-title"><div><span class="subtle-label">РЕЗУЛЬТАТ ОБУЧЕНИЯ</span><h2>Что ты освоишь</h2></div><span class="outcome-count">03 НАВЫКА</span></div><div class="outcome-grid">${outcomes.map((t,i)=>`<article class="outcome-card"><span>0${i+1}</span><b>${t}</b><i>✦</i></article>`).join("")}</div></section>
    <section class="faculty-method"><div class="method-mark">${f.symbol}</div><div><span class="subtle-label">ФОРМАТ ОБУЧЕНИЯ</span><h3>${format}</h3><p>Короткие тематические блоки, понятные объяснения и задания для закрепления материала.</p></div></section>
    <div class="detail-callout"><div><b>Хочешь изучать это направление?</b><p>Отметь интерес — мы сможем учесть его при запуске программ.</p></div><button class="orange-button" data-action="interest">Мне интересно ${icon("arrow")}</button></div>
    <p class="demo-disclaimer">Информация о направлениях носит ознакомительный характер. Состав программ, преподаватели и условия обучения будут опубликованы отдельно.</p>
  </main>`;
}


const studyWeek = [
  {day:"Пн",date:"09",items:[{time:"10:00",title:"Психология мышления",type:"Видеоурок",duration:"24 мин",color:"lavender"},{time:"16:30",title:"Практика: внимание",type:"Практическое задание",duration:"15 мин",color:"peach"}]},
  {day:"Вт",date:"10",items:[{time:"12:00",title:"Введение в ИИ",type:"Видеоурок",duration:"18 мин",color:"blue"}]},
  {day:"Ср",date:"11",items:[{time:"11:30",title:"Основы бренд-стратегии",type:"Чтение",duration:"20 мин",color:"yellow"}]},
  {day:"Чт",date:"12",items:[{time:"15:00",title:"Психология мышления",type:"Мини-тест",duration:"8 мин",color:"lavender"}]},
  {day:"Пт",date:"13",items:[{time:"10:00",title:"Введение в ИИ",type:"Следующий урок",duration:"18 мин",color:"blue"},{time:"17:00",title:"Свободное повторение",type:"Самостоятельная работа",duration:"20 мин",color:"mint"}]},
  {day:"Сб",date:"14",items:[{time:"12:00",title:"Личный учебный час",type:"Повторение",duration:"30 мин",color:"peach"}]},
  {day:"Вс",date:"15",items:[]}
];
function schedulePanel() {
  const day = studyWeek.find(d=>d.day===selectedDay) || studyWeek[4];
  return `<section class="schedule-section">
    <div class="section-title"><div><span class="subtle-label">ТВОЙ ПЛАН</span><h2>Расписание</h2></div><span class="schedule-period">9—15 ноября</span></div>
    <div class="schedule-calendar">${studyWeek.map(d=>`<button class="calendar-day ${selectedDay===d.day?"selected":""}" data-day="${d.day}"><small>${d.day}</small><b>${d.date}</b><i class="${d.items.length?"has-event":""}"></i></button>`).join("")}</div>
    <div class="schedule-day-heading"><b>${day.day}, ${day.date} ноября</b><span>${day.items.length?`${day.items.length} ${day.items.length===1?"занятие":"занятия"}`:"Свободный день"}</span></div>
    ${day.items.length?`<div class="schedule-list">${day.items.map(item=>`<article class="schedule-item"><time>${item.time}</time><span class="schedule-dot ${item.color}"></span><div><b>${item.title}</b><small>${item.type} · ${item.duration}</small></div><span class="schedule-chevron">›</span></article>`).join("")}</div>`:`<div class="schedule-empty"><span>✦</span><b>Сегодня можно выдохнуть</b><small>Или посвятить время свободному чтению.</small></div>`}
    <p class="schedule-note">Расписание демонстрационное. Персональные занятия появятся после подключения учебной системы.</p>
  </section>`;
}

function studyPage() {
  return `<main class="screen inner-screen">${heading("ТВОЙ ОБРАЗОВАТЕЛЬНЫЙ ПУТЬ","Учись в своём<br><em>ритме.</em>","Небольшие шаги каждый день превращаются в большие результаты.")}
    <section class="learning-overview"><div class="overview-head"><div><span class="subtle-label">ТВОЯ АКТИВНОСТЬ</span><h2>На этой неделе</h2></div><span class="week-pill">7 дней ✦</span></div><div class="week-chart">${[["Пн",2],["Вт",3],["Ср",1],["Чт",4],["Пт",5],["Сб",2],["Вс",3]].map(([d,v],i)=>`<div class="day-bar"><span class="bar-value ${i===4?"current":""}" style="height:${v*17+18}px"></span><small>${d}</small></div>`).join("")}</div></section>
    <div class="stats-row"><div class="stat-card dark-stat"><span>${icon("clock")}</span><b>12<span>ч</span></b><small>Время обучения</small></div><div class="stat-card"><span>${icon("chart")}</span><b>68%</b><small>Общий прогресс</small></div></div>
    ${schedulePanel()}
    <section class="courses-section study-courses"><div class="section-title"><div><span class="subtle-label">ТВОЯ БИБЛИОТЕКА</span><h2>Мои курсы</h2></div><span class="course-count">03 курса</span></div>${courses.map(c=>courseTile(c,true)).join("")}</section>
  </main>`;
}


function courseDetailPage() {
  const c = selectedCourse;
  const modules = [
    ["01", "Знакомство с темой", "Введение · 12 мин", "done"],
    ["02", "Ключевые понятия", "Теория · 18 мин", "done"],
    ["03", "Разбираем на примерах", "Практика · 24 мин", "current"],
    ["04", "Проверяем понимание", "Мини-тест · 8 мин", "locked"],
    ["05", "Итоговый разбор", "Закрепление · 15 мин", "locked"]
  ];
  return `<main class="screen inner-screen course-detail-screen">
    <button class="back-button" data-go="study">${icon("back")} Моё обучение</button>
    <section class="course-detail-hero ${c.color}">
      <div class="course-detail-orbit"></div>
      <span class="course-detail-kicker">${c.category.toUpperCase()} · MAGNUS</span>
      <div class="course-detail-mark">${c.mark}</div>
      <div class="course-detail-bottom"><span>ОБРАЗОВАТЕЛЬНАЯ ПРОГРАММА</span><b>${c.time}</b></div>
    </section>
    <div class="course-detail-title"><div class="kicker">ТВОЙ КУРС</div><h1>${c.title}</h1><p>${c.lesson}. Учись в удобном темпе и возвращайся к материалам, когда захочешь.</p></div>
    <section class="course-progress-panel">
      <div><span class="subtle-label">ТВОЙ ПРОГРЕСС</span><strong>${c.progress}%</strong></div>
      <div class="progress-line"><span style="width:${c.progress}%"></span></div>
      <small>${Math.round(c.progress/100*5)} из 5 учебных блоков завершено</small>
    </section>
    <section class="module-section"><div class="section-title"><div><span class="subtle-label">ПРОГРАММА</span><h2>Путь обучения</h2></div><span class="course-count">5 блоков</span></div>
      <div class="module-list">${modules.map(([n,title,meta,state])=>`<div class="module-row ${state}"><span class="module-number">${state==="done"?"✓":n}</span><div><b>${title}</b><small>${meta}</small></div><span class="module-state">${state==="done"?"Пройдено":state==="current"?"Сейчас":"Скоро"}</span></div>`).join("")}</div>
    </section>
    <div class="course-detail-cta"><div><b>Продолжим с интересного?</b><small>Следующий блок уже ждёт тебя.</small></div><button class="orange-button" data-action="open-lesson">Открыть урок ${icon("arrow")}</button></div>
    <p class="demo-disclaimer">Демонстрационный экран: учебные материалы и сохранение прогресса будут подключены на следующем этапе.</p>
  </main>`;
}


function lessonPage() {
  const c = selectedCourse;
  const tabContent = lessonTab === "notes"
    ? `<div class="lesson-notes"><label for="lesson-note">МОИ ЗАМЕТКИ</label><textarea id="lesson-note" placeholder="Запишите важную мысль, пример или вопрос...">${esc(lessonNotes[c.id] || "")}</textarea><small>Заметки автоматически сохраняются на этом устройстве.</small></div>`
    : lessonTab === "materials"
      ? `<div class="lesson-reading"><span class="subtle-label">КОНСПЕКТ · 4 МИН ЧТЕНИЯ</span><h3>Главная идея занятия</h3><p>Любая сложная тема становится понятнее, если разделить её на небольшие понятия, увидеть связь между ними и разобрать конкретный пример.</p><blockquote>Сначала наблюдение — затем гипотеза — после этого проверка.</blockquote><h3>На что обратить внимание</h3><ul><li>Определите ключевые понятия.</li><li>Найдите связь между причиной и следствием.</li><li>Проверьте вывод на примере.</li></ul></div>`
      : `<div class="lesson-reading"><span class="subtle-label">УРОК 03 · 24 МИНУТЫ</span><h3>Разбираем на примерах</h3><p>В этом занятии мы переходим от теории к практике. Посмотрите на ситуацию, выделите основные факторы и попробуйте объяснить, почему результат получился именно таким.</p><div class="lesson-callout"><b>Цель занятия</b><span>Научиться применять ключевые понятия курса к реальным ситуациям.</span></div><p>После просмотра изучите конспект и ответьте на контрольный вопрос.</p></div>`;
  return `<main class="screen inner-screen lesson-screen">
    <button class="back-button" data-go="courseDetail">${icon("back")} К программе курса</button>
    <div class="lesson-heading"><span class="subtle-label">${c.category.toUpperCase()} · УРОК 03</span><h1>Разбираем<br><em>на примерах.</em></h1><p>${c.title} · 24 минуты</p></div>
    <section class="lesson-player" aria-label="Демонстрационная область видеозанятия">
      <div class="player-grain"></div><div class="player-orbit"></div><div class="player-brand">MAGNUS <span>LEARNING STUDIO</span></div>
      <div class="player-center"><div class="player-play">▶</div><b>Видеоурок</b><small>Демонстрационный экран</small></div>
      <div class="player-controls"><span>00:00</span><div class="player-track"><i></i></div><span>24:00</span><span>⋯</span></div>
    </section>
    <div class="lesson-tabs">${[["lesson","Урок"],["materials","Конспект"],["notes","Заметки"]].map(([id,label])=>`<button class="${lessonTab===id?"selected":""}" data-lesson-tab="${id}">${label}</button>`).join("")}</div>
    <section class="lesson-content">${tabContent}</section>
    <section class="lesson-quiz"><div class="kicker">ПРОВЕРЬ СЕБЯ</div><h2>Что помогает перейти от теории к пониманию?</h2><p>Выберите один вариант ответа.</p>
      ${["Заучивание определений без примеров","Разбор конкретной ситуации и проверка вывода","Пропуск сложных понятий"].map((answer,i)=>`<button class="quiz-option ${quizChoice===String(i)?"chosen":""}" data-quiz="${i}"><span>${String.fromCharCode(65+i)}</span>${answer}${quizChoice===String(i)?'<b>✓</b>':""}</button>`).join("")}
      ${quizChoice!==""?`<div class="quiz-feedback ${quizChoice==="1"?"correct":"incorrect"}">${quizChoice==="1"?"Верно! Пример помогает связать понятия с практикой.":"Попробуйте ещё раз: подумайте, что помогает применить знания на практике."}</div>`:""}
    </section>
    <div class="lesson-footer"><button class="lesson-finish" data-action="lesson-finish">Отметить урок завершённым ${icon("arrow")}</button><small>Демо-режим · отметка не сохраняется на сервере</small></div>
  </main>`;
}


function assignmentsPage() {
  const filters = ["Все", "Нужно выполнить", "Черновики"];
  const filtered = assignments.filter(a => {
    if (activeAssignmentFilter === "Черновики") return hasAssignmentDraft(a.id);
    if (activeAssignmentFilter === "Нужно выполнить") return !hasAssignmentDraft(a.id);
    return true;
  });
  return `<main class="screen inner-screen assignments-screen">
    ${heading("ТВОИ УЧЕБНЫЕ ЗАДАЧИ", "Двигайся<br><em>шаг за шагом.</em>", "Все задания и практические работы собраны в одном месте.")}
    <div class="assignment-summary">
      <div><b>${assignments.length}</b><span>Всего заданий</span></div>
      <div><b>${assignments.filter(a => !hasAssignmentDraft(a.id)).length}</b><span>Ожидают работы</span></div>
      <div><b>${assignments.filter(a => hasAssignmentDraft(a.id)).length}</b><span>С черновиком</span></div>
    </div>
    <div class="assignment-filter-row">${filters.map(f => `<button class="filter-chip ${activeAssignmentFilter===f?"selected":""}" data-assignment-filter="${f}">${f}</button>`).join("")}</div>
    <div class="assignment-list">
      ${filtered.map(a => `<article class="assignment-card">
        <div class="assignment-card-top"><span class="assignment-kind">${a.type}</span><span class="assignment-status ${hasAssignmentDraft(a.id)?"has-draft":""}">${assignmentStatusText(a.id)}</span></div>
        <h2>${a.title}</h2>
        <p>${a.course}</p>
        <div class="assignment-card-meta"><span>Срок: <b>${a.due}</b></span><span>${a.estimate}</span></div>
        <button class="assignment-open" data-assignment-open="${a.id}">Открыть задание ${icon("arrow")}</button>
      </article>`).join("")}
      ${filtered.length ? "" : `<div class="empty-message">В этой категории пока нет заданий.</div>`}
    </div>
    <p class="assignment-demo-note">Демонстрационные задания и сроки. Сохранённые ответы остаются в локальном хранилище этого браузера и пока не отправляются преподавателю.</p>
  </main>`;
}

function assignmentDetailPage() {
  const a = assignments.find(item => item.id === selectedAssignmentId) || assignments[0];
  const draft = assignmentDrafts[a.id] || "";
  return `<main class="screen inner-screen assignment-detail-screen">
    <button class="back-button" data-go="assignments">${icon("back")} Все задания</button>
    <div class="assignment-detail-head">
      <span class="assignment-kind">${a.type} · MAGNUS</span>
      <span class="assignment-status ${hasAssignmentDraft(a.id)?"has-draft":""}">${assignmentStatusText(a.id)}</span>
      <h1>${a.title}</h1>
      <p>${a.course}</p>
      <div class="assignment-detail-meta"><span>Срок сдачи <b>${a.due}</b></span><span>Оценка времени <b>${a.estimate}</b></span></div>
    </div>
    <section class="assignment-instructions">
      <span class="subtle-label">ЧТО НУЖНО СДЕЛАТЬ</span>
      <p>${a.description}</p>
      <h2>План выполнения</h2>
      <ol>${a.requirements.map((r,i)=>`<li><span>0${i+1}</span>${r}</li>`).join("")}</ol>
    </section>
    <section class="assignment-answer">
      <div><span class="subtle-label">ТВОЙ ОТВЕТ</span><h2>Рабочее поле</h2></div>
      <textarea id="assignment-answer" placeholder="Начни писать ответ здесь...">${esc(draft)}</textarea>
      <div class="assignment-save-row"><small>Черновик сохраняется на этом устройстве.</small><button class="orange-button" data-action="save-assignment-draft">Сохранить черновик ${icon("arrow")}</button></div>
    </section>
    <p class="assignment-demo-note">Это демонстрационный центр заданий. Отправка преподавателю, загрузка файлов, проверка и выставление оценок пока не подключены.</p>
  </main>`;
}

function documentsPage() {
  return `<main class="screen inner-screen">${heading("ТВОИ ДОСТИЖЕНИЯ","То, чем можно<br><em>гордиться.</em>","Сертификаты и подтверждения прохождения образовательных программ.")}
    <section class="certificate-preview"><div class="cert-topline"><span>MAGNUS</span><span>№ 000001</span></div><div class="cert-seal">M</div><small>INTERNATIONAL UNIVERSITY</small><h2>Сертификат<br>достижения</h2><p>Здесь появятся документы о завершении выбранных программ.</p><div class="cert-bottom"><span>KNOWLEDGE</span><span>2026</span></div></section>
    <div class="empty-docs"><span class="empty-doc-icon">✦</span><div><b>Твоя первая награда впереди</b><p>Завершай курсы, проходи задания и возвращайся за своими достижениями.</p></div></div>
    <p class="legal-note">Документы MAGNUS подтверждают прохождение соответствующих образовательных программ и не являются государственными дипломами о высшем образовании.</p>
  </main>`;
}

function profilePage() {
  return `<main class="screen inner-screen">${heading("ТВОЙ АККАУНТ","Рад видеть<br><em>тебя здесь.</em>","Личное пространство студента MAGNUS.")}
    <section class="profile-card"><div class="profile-avatar">${avatarContent()}</div><div class="profile-info"><small>СТУДЕНТ MAGNUS</small><h2>${esc(firstName)}</h2><p>${esc(username)}</p></div><span class="profile-medal">✦</span></section>
    <div class="profile-stats"><div><b>03</b><small>Курса</small></div><div><b>02</b><small>Достижения</small></div><div><b>07</b><small>Дней подряд</small></div></div>
    <section class="profile-menu"><button data-action="settings"><span class="menu-icon">⚙</span><span><b>Настройки</b><small>Внешний вид и предпочтения</small></span>${icon("arrow")}</button><button data-action="notifications"><span class="menu-icon">♧</span><span><b>Уведомления</b><small>Важные события и напоминания</small></span>${icon("arrow")}</button><button data-action="support"><span class="menu-icon">?</span><span><b>Поддержка</b><small>Помощь и обратная связь</small></span>${icon("arrow")}</button><button data-action="about"><span class="menu-icon">M</span><span><b>О MAGNUS</b><small>Университет нового поколения</small></span>${icon("arrow")}</button></section>
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
  document.querySelectorAll("[data-day]").forEach(el => el.addEventListener("click", () => { selectedDay=el.dataset.day; render(); }));
  document.querySelectorAll("[data-lesson-tab]").forEach(el => el.addEventListener("click", () => { lessonTab=el.dataset.lessonTab; render(); }));
  document.querySelectorAll("[data-quiz]").forEach(el => el.addEventListener("click", () => { quizChoice=el.dataset.quiz; render(); }));

  document.querySelectorAll("[data-filter]").forEach(el => el.addEventListener("click", () => { activeFilter=el.dataset.filter; render(); }));
  document.querySelectorAll("[data-action]").forEach(el => el.addEventListener("click", () => {
    if (el.dataset.action === "save-assignment-draft") {
      const field = document.querySelector("#assignment-answer");
      if (!field) return;
      assignmentDrafts[selectedAssignmentId] = field.value;
      const saved = storeAssignmentDrafts();
      render();
      toast(saved
        ? "Черновик сохранён на этом устройстве. Преподавателю он пока не отправлен."
        : "Не удалось сохранить черновик в памяти браузера.");
      return;
    }
    if (el.dataset.action === "open-lesson") { currentPage="lesson"; lessonTab="lesson"; quizChoice=""; render(); window.scrollTo({top:0,behavior:"smooth"}); return; }
    const actions = {"lesson-finish":"Урок отмечен в демонстрационном режиме. Сохранение прогресса подключим позже.",notifications:"Новых уведомлений пока нет.",course:"Раздел курсов пока демонстрационный.", "course-start":"Учебный плеер подключим на следующем этапе.",interest:"Интерес сохранён в демо-режиме.",settings:"Настройки появятся в следующем обновлении.",support:"Раздел поддержки скоро будет доступен.",about:"MAGNUS — пространство для знаний, открытий и развития."};
    toast(actions[el.dataset.action] || "Скоро будет доступно.");
  }));
  const noteField = document.querySelector("#lesson-note");
  noteField?.addEventListener("input", e => {
    lessonNotes[selectedCourse.id] = e.target.value;
    storeLessonNotes();
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