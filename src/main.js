import "./style.css";
import { magnusOwl3d } from "./mascot3d.js";

const tg = window.Telegram?.WebApp;
tg?.ready?.();
tg?.expand?.();
tg?.setHeaderColor?.("#f7f7f5");
tg?.setBackgroundColor?.("#f7f7f5");

const telegramUser = tg?.initDataUnsafe?.user;
const telegramWebAppMode = Boolean(tg?.initData || telegramUser);
document.documentElement.classList.toggle("telegram-webapp", telegramWebAppMode);
const firstName = telegramUser?.first_name || "друг";
const username = telegramUser?.username ? `@${telegramUser.username}` : "Студент MAGNUS";
const avatarLetter = telegramUser?.first_name?.trim().charAt(0).toUpperCase() || "M";
const telegramPhotoUrl = telegramUser?.photo_url || "";
const studentStorageScope = telegramUser?.id
  ? `telegram-${String(telegramUser.id)}`
  : "guest";

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

const curriculum = {"ai":[["ai-01","Что такое искусственный интеллект","Введение",12,"ИИ — область информатики, в которой создают системы для задач, обычно требующих человеческого анализа: распознавания изображений, понимания текста и поиска закономерностей.","Не один алгоритм","ИИ включает разные подходы: от заданных человеком правил до моделей, которые находят закономерности в данных.","Границы возможностей","Результат зависит от задачи, данных и качества модели. Система может ошибаться, поэтому важные выводы нужно проверять.","Что точнее всего описывает современную систему ИИ?",["Универсальный разум","Система для определённых задач на основе алгоритмов и данных","Программа без ошибок"],1],["ai-02","Данные и машинное обучение","Теория",16,"Машинное обучение находит закономерности в примерах. Разработчик подготавливает данные и задаёт способ оценки результата.","Обучающая выборка","На этих примерах модель настраивает параметры. Данные должны отражать задачу и не содержать систематических перекосов.","Проверка модели","Отдельная тестовая выборка показывает, как модель работает на ранее не встречавшихся примерах.","Зачем разделять обучающую и тестовую выборки?",["Скрыть данные от разработчика","Проверить качество на новых для модели примерах","Увеличить размер модели"],1],["ai-03","Как оценивать ответы ИИ","Практика",14,"Даже убедительно сформулированный ответ модели может содержать неточности. Проверка результата — часть работы с ИИ.","Проверяйте факты","Сопоставляйте цифры, даты и цитаты с первоисточниками. Уверенный тон не является доказательством.","Учитывайте контекст","Модель может не знать важных деталей ситуации. Уточняйте ограничения и проверяйте выводы.","Как поступить с важным фактом из ответа ИИ?",["Использовать без проверки","Проверить по надёжному первоисточнику","Считать верным по тону"],1],["ai-04","Как работают генеративные модели","Теория",15,"Генеративная модель создаёт новый текст, изображение или другой результат, опираясь на закономерности, найденные во время обучения. Она не ищет единственный заранее записанный ответ: на каждом шаге формирует продолжение с учётом запроса и контекста.","Токены и контекст","Текст разбивается на небольшие элементы — токены. Модель учитывает предыдущие элементы в пределах доступного контекста и на их основе строит продолжение.","Вероятностное продолжение","Модель выбирает возможное продолжение по выученным закономерностям. Поэтому один запрос может давать разные варианты, а правдоподобная формулировка не гарантирует фактическую точность.","Что в первую очередь делает генеративная языковая модель?",["Находит и показывает только готовые ответы из справочника","Формирует новое продолжение текста с учётом запроса и контекста","Гарантированно проверяет истинность каждого утверждения"],1],["ai-05","Как составлять точные запросы","Практика",16,"Качество результата зависит не только от модели, но и от того, насколько ясно поставлена задача. Хороший запрос задаёт контекст, ожидаемое действие и критерии подходящего ответа.","Контекст и задача","Кратко объясните ситуацию и сформулируйте конкретное действие: сравнить, классифицировать, составить план или найти слабые места.","Ограничения и формат","Укажите аудиторию, объём, ограничения и удобный формат ответа. Если результат важен, попросите явно обозначить допущения и неизвестные детали.","Какой запрос даст модели наиболее понятную задачу?",["Расскажи что-нибудь полезное про маркетинг","Сравни два описания продукта для владельца малого бизнеса, выдели три различия и оформи таблицей","Сделай ответ максимально хорошим и подробным"],1],["ai-06","Безопасное использование ИИ","Практика",14,"ИИ может ускорять работу, но пользователь отвечает за то, какие данные передаёт системе и как применяет результат. Особенно внимательно нужно обращаться с личной, финансовой и рабочей информацией.","Защита данных","Не отправляйте в сервисы лишние персональные данные, пароли, платёжные сведения или закрытые документы. Учитывайте правила организации и условия конкретного сервиса.","Проверка перед действием","Перед публикацией, отправкой клиенту или важным решением проверьте факты, права на материалы и возможные последствия. В критичных ситуациях решение должен подтверждать ответственный человек.","Что лучше сделать перед загрузкой рабочего документа в ИИ-сервис?",["Загрузить полностью, если сервис отвечает быстро","Удалить лишние чувствительные сведения и проверить разрешённые правилами способы обработки","Добавить к документу пароли для удобства"],1]],"mind":[["mind-01","Как внимание отбирает информацию","Введение",13,"Внимание выделяет важную информацию из множества сигналов. Мы не можем одинаково глубоко обрабатывать всё происходящее вокруг.","Избирательность","На выбор влияют цель, интерес, новизна и эмоциональная значимость стимула.","Переключение","Частые переключения требуют времени на возвращение к прежнему контексту и повышают вероятность ошибок.","Что происходит при частом переключении задач?",["Ничего не меняется","Тратится время на восстановление контекста","Качество всегда растёт"],1],["mind-02","Эмоции и принятие решений","Теория",15,"Эмоции участвуют в оценке ситуации. Они помогают замечать значимые события, но влияют на то, какие факторы мы замечаем.","Эмоциональный сигнал","Чувства могут указывать на важность события, риск или потребность — это информация, которую полезно учитывать.","Пауза перед выбором","При сильном возбуждении полезно назвать эмоцию, выписать факты и сравнить варианты.","Что помогает принять взвешенное решение при сильной эмоции?",["Игнорировать факты","Сделать паузу и оценить факты и варианты","Выбрать первый вариант"],1],["mind-03","Когнитивные искажения","Практика",17,"Когнитивные искажения — устойчивые способы упрощать обработку информации. Иногда они приводят к систематическим ошибкам.","Подтверждающее смещение","Мы охотнее замечаем сведения, которые поддерживают уже имеющееся мнение.","Эффект доступности","Яркий или недавний пример может казаться более распространённым, чем он есть.","Что помогает снизить подтверждающее смещение?",["Читать только согласные мнения","Искать данные против своей гипотезы","Не менять мнение"],1],["mind-04","Как работает память","Теория",15,"Память помогает кодировать, сохранять и извлекать информацию. Простого повторного чтения часто недостаточно: важно возвращаться к материалу и пытаться самостоятельно его вспомнить.","Извлечение из памяти","Попытка вспомнить идею без подсказки помогает обнаружить пробелы и укрепляет доступ к изученному материалу.","Интервальное повторение","Повторение с промежутками распределяет практику во времени. Интервалы можно постепенно увеличивать, возвращаясь к сложным темам чаще.","Какой подход обычно помогает лучше закрепить учебный материал?",["Один раз долго перечитать текст без проверки","Несколько раз вспоминать материал с промежутками между повторениями","Переписать весь текст дословно за один вечер"],1],["mind-05","Привычки и сила среды","Практика",14,"Поведение зависит не только от намерения. На него влияют привычные сигналы, доступность действия, окружающая среда и последствия поведения.","Сигнал и действие","Конкретный сигнал — время, место или предыдущее действие — помогает начать привычную последовательность.","Снизить трение","Чем проще первый шаг и доступнее нужные инструменты, тем легче повторить действие. Полезно заранее подготовить среду и убрать лишние препятствия.","Что помогает сделать полезное действие регулярнее?",["Полагаться только на сильную мотивацию","Привязать действие к понятному сигналу и упростить первый шаг","Каждый раз менять время и место выполнения"],1],["mind-06","Критическое мышление на практике","Практика",16,"Критическое мышление — это проверка утверждений и оснований для них. Оно помогает отличать наблюдение от интерпретации и не принимать первое объяснение за единственное.","Утверждение и доказательство","Сначала сформулируйте, что именно утверждается, затем найдите данные, которые могут это подтвердить или опровергнуть.","Альтернативные объяснения","Спросите, какие ещё причины могли привести к результату и какие сведения помогли бы различить версии. Обращайте внимание на качество и независимость источников.","Как лучше проверить неожиданное утверждение?",["Искать только примеры, которые его подтверждают","Сопоставить несколько надёжных источников и проверить альтернативные объяснения","Оценить уверенность автора по стилю текста"],1]],"brand":[["brand-01","Что такое позиционирование","Введение",12,"Позиционирование описывает место бренда в восприятии аудитории относительно альтернатив. Оно помогает понять, для кого существует продукт и чем отличается.","Аудитория","Сначала определяют группу людей, чью задачу продукт решает.","Отличие","Сильное отличие важно аудитории и подтверждается продуктом или опытом взаимодействия.","Что лежит в основе позиционирования?",["Только логотип","Потребность аудитории и значимое отличие","Количество рекламы"],1],["brand-02","Исследование целевой аудитории","Теория",16,"Исследование помогает понять реальные задачи, мотивы и барьеры людей. Оно опирается на наблюдения и данные, а не только на предположения.","Вопросы о поведении","Полезнее спрашивать о последнем реальном опыте покупки или использования, чем о гипотетических намерениях.","Проверка гипотез","Интервью помогают понять причины, количественные данные — оценить распространённость наблюдений.","Какой вопрос полезнее для интервью?",["Купили бы идеальный продукт?","Расскажите о последнем случае решения этой задачи","Вам нравится идея?"],1],["brand-03","Сообщение и доказательства бренда","Практика",14,"Коммуникация бренда должна ясно объяснять ценность предложения. Обещание убедительно, когда его подтверждают свойства продукта и опыт клиентов.","Одно главное сообщение","Сформулируйте мысль, которая отвечает аудитории: почему стоит обратить внимание на предложение.","Конкретные доказательства","Функции, условия, примеры и прозрачные цифры могут подтвердить обещание.","Что делает обещание бренда убедительнее?",["Необычная фраза","Проверяемое доказательство в продукте или опыте","Повтор обещания"],1],["brand-04","Из чего складывается идентичность бренда","Теория",15,"Идентичность бренда — целостная система узнаваемых признаков и принципов. Она проявляется не только в графике, но и в словах, поведении и опыте взаимодействия с продуктом.","Визуальный и словесный язык","Цвета, типографика, изображения, тон коммуникации и характерные формулировки помогают узнавать бренд в разных каналах.","Поведение и обещание","То, как компания отвечает клиенту, выполняет обещания и решает проблемы, тоже формирует образ бренда. Внутренние принципы должны быть заметны в реальном опыте.","Что точнее всего описывает идентичность бренда?",["Только логотип и фирменный цвет","Согласованная система визуальных, словесных и поведенческих признаков","Количество публикаций в социальных сетях"],1],["brand-05","Путь клиента и точки контакта","Практика",16,"Путь клиента описывает шаги, через которые человек проходит от первого знакомства с предложением до покупки и дальнейшего использования. На каждом шаге у него есть вопросы и ожидания.","Этапы пути","Человек может узнать о продукте, сравнить варианты, принять решение, получить услугу и оценить опыт. Реальный путь не всегда линейный.","Точки контакта","Сайт, реклама, упаковка, поддержка и сам продукт создают впечатление. Несогласованность между обещанием и опытом снижает доверие.","Зачем бренду описывать путь клиента?",["Чтобы увеличить число рекламных форматов","Чтобы понять вопросы человека и улучшить взаимодействие на каждом этапе","Чтобы заменить исследование аудитории красивой схемой"],1],["brand-06","Как оценивать силу бренда","Практика",15,"Стратегия бренда должна быть связана с задачами бизнеса и восприятием аудитории. Оценка результата начинается с конкретной цели, а не с выбора самой заметной цифры.","Метрики под задачу","Узнаваемость, предпочтение, повторные покупки и готовность рекомендовать отвечают на разные вопросы. Выбирайте показатели, связанные с целью программы.","Динамика и контекст","Сравнивайте результат с исходным уровнем и учитывайте сезонность, каналы и изменения продукта. Одна цифра редко объясняет причину результата.","Какой подход полезнее при оценке результата бренд-стратегии?",["Считать только количество лайков без связи с целью","Выбрать показатели под задачу и сравнивать их с исходным уровнем","Оценивать успех по субъективному впечатлению команды"],1]]};

const lessonPractices = {
 "ai-01":{title:"Найди границу между правилом и ИИ",task:"Представь приложение, которое сортирует входящие письма. Опиши один вариант, где оно действует по заранее заданным правилам, и один вариант, где использует машинное обучение. Объясни, в чём различие.",hint:"Подумай, кто определяет конкретные условия: разработчик заранее прописывает каждое правило или система учится на примерах."},
 "ai-02":{title:"Собери маленькую обучающую выборку",task:"Предложи три примера данных для модели, которая прогнозирует время доставки заказа. Укажи, какие признаки будут входными данными, а что модель должна предсказать. Назови один риск плохих данных.",hint:"Вспомни время оформления, расстояние, загруженность курьера и фактическое время доставки. Не используй признаки, которых ещё не существует на момент прогноза."},
 "ai-03":{title:"Проверь уверенное утверждение",task:"Нейросеть утверждает: «Большинство людей учатся эффективнее всего ночью». Составь короткий план проверки этого утверждения: какие данные нужны, где искать подтверждение и что может исказить вывод.",hint:"Раздели мнение и проверяемую гипотезу. Ищи исследования с описанной выборкой, методикой и ограничениями, а не пересказы без источников."},
 "ai-04":{title:"Объясни генерацию на примере",task:"Объясни другу, почему языковая модель может продолжить одну и ту же фразу по-разному. Используй простой пример из повседневной жизни и отдельно отметь, почему правдоподобное продолжение не гарантирует правду.",hint:"Сравни генерацию с выбором вероятного продолжения по контексту, а не с поиском единственной готовой записи в справочнике."},
 "ai-05":{title:"Составь точный запрос",task:"Тебе нужно попросить ИИ сравнить два варианта описания товара для владельца небольшого магазина. Напиши готовый запрос: добавь контекст, конкретную задачу, формат результата и хотя бы одно ограничение.",hint:"Хороший запрос отвечает на четыре вопроса: кто ты и для чего результат, что сделать, в каком формате ответить и чего не делать."},
 "ai-06":{title:"Найди риск утечки данных",task:"Сотрудник хочет загрузить в ИИ-сервис таблицу с именами клиентов, телефонами, адресами и суммами заказов, чтобы получить аналитику. Предложи безопасный порядок действий до загрузки и объясни, какие сведения можно убрать или обезличить.",hint:"Оставь только данные, нужные для задачи. Убери прямые идентификаторы, проверь правила компании и условия обработки данных самим сервисом."},
 "mind-01":{title:"Разбери переключение внимания",task:"Ты готовишь отчёт и каждые две минуты проверяешь сообщения. Опиши два сигнала, которые перетягивают внимание, и предложи один способ уменьшить переключения, не пропуская действительно важные сообщения.",hint:"Раздели важные уведомления и те, которые могут подождать. Подумай о заранее выделенных интервалах проверки."},
 "mind-02":{title:"Пауза перед эмоциональным решением",task:"После резкого сообщения коллеги ты хочешь немедленно ответить. Составь план из трёх шагов, который поможет учесть эмоцию, отделить факты от интерпретаций и выбрать спокойный ответ.",hint:"Сначала назови эмоцию, затем выпиши только то, что точно произошло, и лишь после этого выбери цель ответа."},
 "mind-03":{title:"Поймай подтверждающее смещение",task:"Ты уверен, что новый формат рекламы не работает, и находишь только два неудачных примера. Назови, какое искажение может проявляться, и сформулируй два вопроса или действия, которые помогут проверить противоположную версию.",hint:"Попробуй специально поискать удачные случаи и сравнить условия, аудиторию и период, а не только подтверждать исходное мнение."},
 "mind-04":{title:"Составь план повторения",task:"Тебе нужно запомнить пять новых понятий к концу недели. Предложи простой план повторения с промежутками и способом самостоятельно проверить, что ты действительно помнишь материал.",hint:"Используй короткие попытки вспомнить без подсказки и возвращайся к сложным понятиям чаще, чем к тем, которые уже уверенно помнишь."},
 "mind-05":{title:"Сделай полезную привычку проще",task:"Ты хочешь заниматься английским по 10 минут в день, но постоянно забываешь. Придумай конкретный сигнал, самый маленький первый шаг и одно изменение среды, которое уменьшит трение.",hint:"Привяжи действие к устойчивому событию дня и подготовь всё необходимое заранее, чтобы начать было легче, чем отложить."},
 "mind-06":{title:"Отдели факт от объяснения",task:"Коллега говорит: «Продажи упали, потому что мы подняли цену». Сформулируй, что здесь является наблюдением, что — гипотезой, и назови два альтернативных объяснения и данные, которые помогли бы их сравнить.",hint:"Падение продаж может быть фактом, а причина пока лишь предположением. Проверь сезонность, трафик, наличие товара и изменения в рекламе."},
 "brand-01":{title:"Сформулируй позиционирование",task:"Представь сервис доставки обедов для сотрудников небольших офисов. Напиши одно предложение позиционирования: для кого продукт, какую задачу решает и чем отличается от альтернатив.",hint:"Не перечисляй функции. Сначала назови конкретную аудиторию и её потребность, затем одно значимое и подтверждаемое отличие."},
 "brand-02":{title:"Подготовь вопрос для интервью",task:"Ты исследуешь, почему люди выбирают одну кофейню вместо другой. Составь три открытых вопроса о реальном последнем опыте выбора, чтобы узнать мотивы и барьеры, не подсказывая желаемый ответ.",hint:"Спроси о последнем конкретном случае: что человек сравнивал, что повлияло на выбор и что почти остановило его."},
 "brand-03":{title:"Подкрепи обещание бренда",task:"Бренд обещает: «Доставляем быстрее всех». Перепиши обещание так, чтобы оно было конкретным и проверяемым, и предложи доказательство, которое компания должна собрать перед публикацией.",hint:"Укажи измеримый срок, условия и территорию. Подтверждение должно опираться на реальные данные доставки, а не на красивую формулировку."},
 "brand-04":{title:"Проведи мини-аудит идентичности",task:"У бренда на сайте строгий деловой тон, в соцсетях — шутки, а поддержка отвечает сухими шаблонами. Назови два несоответствия и предложи единый принцип коммуникации, который можно применять во всех трёх точках контакта.",hint:"Подумай не только о цветах и логотипе. Идентичность проявляется в словах, поведении и том, как бренд решает проблемы."},
 "brand-05":{title:"Нарисуй путь клиента словами",task:"Опиши путь человека, который впервые увидел рекламу онлайн-курса и решил записаться. Назови минимум четыре последовательных этапа и по одному вопросу или барьеру клиента на каждом.",hint:"Начни с первого контакта, затем добавь сравнение, проверку доверия, решение и оформление. Не забывай о том, что происходит после оплаты."},
 "brand-06":{title:"Выбери метрику под цель",task:"Кофейня хочет увеличить число повторных визитов постоянных гостей. Выбери две подходящие метрики, укажи, с чем сравнивать результат и назови один фактор, который может исказить интерпретацию.",hint:"Лайки и общий охват не показывают повторные визиты. Подумай о доле повторных покупок, частоте визитов и периоде сравнения."}
};


const courseChapters = {
 ai:[{title:"Понять основы",subtitle:"Принципы и возможности",tag:"ОСНОВА"},{title:"Работать с моделью",subtitle:"Запросы и контекст",tag:"ИНСТРУМЕНТЫ"},{title:"Применять ответственно",subtitle:"Практика и безопасность",tag:"ПРАКТИКУМ"}],
 mind:[{title:"Исследовать внимание",subtitle:"Как мы отбираем сигналы",tag:"ОСНОВА"},{title:"Понять мышление",subtitle:"Память и привычки",tag:"МЕХАНИЗМЫ"},{title:"Выбирать осознанно",subtitle:"Проверка решений",tag:"ПРАКТИКУМ"}],
 brand:[{title:"Сформировать основу",subtitle:"Позиционирование и идентичность",tag:"ОСНОВА"},{title:"Изучить аудиторию",subtitle:"Исследование и путь клиента",tag:"АУДИТОРИЯ"},{title:"Выстроить стратегию",subtitle:"Сообщение и измерение",tag:"ПРАКТИКУМ"}]
};

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
let adminSupportRequests = [], adminSupportLoading = false, adminSupportError = "";
let adminStudents = [], adminStudentsLoading = false, adminStudentsError = "";
let adminPaymentOrders = [], adminPaymentOrdersLoading = false, adminPaymentOrdersError = "";
let adminPaymentOrderSummary = { paidOrders: 0, paidStars: 0, pendingOrders: 0 };
let studentPaymentHistory = [], studentPaymentHistoryLoading = false, studentPaymentHistoryError = "";
let adminPaymentPlans = [], adminPaymentPlansLoading = false, adminPaymentPlansError = "";
let adminStudentSelected = "", adminStudentDetail = null, adminStudentDetailLoading = false, adminStudentDetailError = "";
let currentPage = new URLSearchParams(window.location.search).has("certificate") ? "documents" : new URLSearchParams(window.location.search).get("admin") === "1" ? "admin" : "home";
let selectedFaculty = faculties[0];
let selectedCourse = courses[0];
let selectedLessonId = "ai-01";
let lessonTab = "lesson";
let lessonPracticeDrafts = readStudentStorage("lessonPracticeDrafts");
let lessonPracticeResults = readStudentStorage("lessonPracticeResults");
let practicePending = false;
let practiceHintOpen = false;
let quizChoice = "";
let searchValue = "";
let activeFilter = "Все";
let selectedAssignmentId = assignments[0].id;
let activeAssignmentFilter = "Все";
let assignmentDrafts = loadAssignmentDrafts();
let assignmentSubmissions = loadAssignmentSubmissions();
let lessonNotes = loadLessonNotes();
let tutorChats = readStudentStorage("tutorChats");
let tutorPending = false;
let interestedFaculties = loadInterestedFaculties();
let lessonQuizResults = loadLessonQuizResults();
let completedLessons = loadCompletedLessons();
let enrollments = readStudentStorage("enrollments");
let finalExams = {};
let certificates = {};
let academicCatalog = null;
let academicPassport = null;
let academicPassportLoading = false;
let academicPassportError = "";
let certificateVerification = null;
let certificateIssuePending = false;
let activeExam = null;
let examPending = false;
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
    refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9a7 7 0 0 1 11.7-2L20 12M4 12l2.7 5a7 7 0 0 0 11.7-2"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.2 1-1.4 2.4-1.5-.6a7.7 7.7 0 0 1-1.7 1l-.2 1.6h-2.8l-.2-1.6a7.7 7.7 0 0 1-1.7-1l-1.5.6-1.4-2.4 1.2-1a7.7 7.7 0 0 1 0-2l-1.2-1 1.4-2.4 1.5.6a7.7 7.7 0 0 1 1.7-1l.2-1.6h2.8l.2 1.6a7.7 7.7 0 0 1 1.7 1l1.5-.6 1.4 2.4-1.2 1a7.7 7.7 0 0 1 0 2Z"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.3 1.7c-1 .9-1.9 1.3-1.9 2.8M12 17h.01"/>',
    close:'<path d="m18 6-12 12M6 6l12 12"/>'
  };
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
};

function avatarContent() {
  return `<span class="avatar-fallback">${esc(avatarLetter)}</span>${telegramPhotoUrl ? `<img src="${esc(telegramPhotoUrl)}" alt="Фото профиля Telegram" class="telegram-avatar-image" referrerpolicy="no-referrer" onerror="this.remove()">` : ""}`;
}

function brandMark() {
  return `<svg viewBox="0 0 48 48" role="presentation"><path d="M8 17C8 8 14 5 20 10c2-2 6-2 8 0 6-5 12-2 12 7v11c0 9-7 15-16 15S8 37 8 28V17Z" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/><path d="M10 14 6 7l10 3M38 14l4-7-10 3" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="23" r="6.3" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="30" cy="23" r="6.3" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="18" cy="23" r="2.2" fill="currentColor"/><circle cx="30" cy="23" r="2.2" fill="currentColor"/><path d="m21 33 3-3 3 3-3 3-3-3Z" fill="currentColor"/></svg>`;
}

function topbar() {
  return `<header class="topbar">
    <button class="brand" data-go="home" aria-label="MAGNUS — главная"><span class="brand-symbol" aria-hidden="true">${brandMark()}</span><span class="brand-copy"><b>MAGNUS</b><small>UNIVERSITY</small></span></button>
    <div class="top-actions"><button class="icon-button" data-action="notifications" aria-label="Уведомления">${icon("bell")}</button><button class="avatar-button" data-go="profile" aria-label="Профиль">${avatarContent()}</button></div>
  </header>`;
}

function bottomNav() {
  const items = [["home","home","Главная"],["faculties","faculty","Каталог"],["study","study","Обучение"],["assignments","docs","Задания"],["profile","profile","Профиль"]];
  return `<nav class="bottom-nav" aria-label="Основная навигация">${items.map(([id,ic,label]) => `<button data-go="${id}" class="nav-item ${currentPage===id || (currentPage==="academicPassport"&&id==="profile") || (currentPage==="facultyDetail"&&id==="faculties") || (currentPage==="courseDetail"&&id==="study") || (currentPage==="lesson"&&id==="study") || (currentPage==="assignmentDetail"&&id==="assignments")?"active":""}" ${currentPage===id?"aria-current=\"page\"":""}>${icon(ic)}<span>${label}</span></button>`).join("")}</nav>`;
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

function callTutorApi(payload,callback){
 const serverless=tg?.Serverless;
 if(typeof serverless?.call!=="function")return false;
 serverless.call("tutor",payload,(error,result)=>{if(typeof callback==="function")callback(error,result);});
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
function loadAdminPaymentPlans(){
  loadAdminPaymentOrders();
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
  return "<section class=admin-payment-orders><div class=admin-section-head><div><span>ПЛАТЁЖНЫЙ РЕЕСТР</span><h2>Последние заказы</h2></div><button data-admin-payment-history-refresh>Обновить "+icon("refresh")+"</button></div><div class=admin-payment-summary><article><small>ПОДТВЕРЖДЕНО</small><b>"+Number(summary.paidOrders||0)+"</b></article><article><small>ПОЛУЧЕНО STARS</small><b>"+Number(summary.paidStars||0)+" ⭐</b></article><article><small>ОЖИДАЮТ</small><b>"+Number(summary.pendingOrders||0)+"</b></article></div><div class=admin-order-list>"+body+"</div><p class=admin-payment-footnote>Сводка рассчитана по последним заказам (не более 200). В сумму входят только подтверждённые оплаты.</p></section>";
}

function adminPaymentPlansPage(){
 if(adminPaymentPlansLoading)return '<section><div class="admin-loading">Загружаем тарифы…</div></section>'+adminPaymentOrdersSection();
 if(adminPaymentPlansError)return '<section><div class="admin-error">'+esc(adminPaymentPlansError)+'</div></section>'+adminPaymentOrdersSection();
 const labels={ 'monthly-30d':'30 дней','quarterly-90d':'90 дней','annual-365d':'365 дней' };
 const canManagePayments=adminAccess.role==="owner";
 const plans=adminPaymentPlans.map(plan=>{
  const label=esc(labels[plan.planId]||plan.title);
  const price=Number(plan.starsPrice)||0;
  if(!canManagePayments){
   return `<article class="admin-payment-plan"><div><span>${label}</span><b>${price?price+' ⭐':'Цена не задана'} · ${plan.enabled?'Включён':'Выключен'}</b></div></article>`;
  }
  return `<article class="admin-payment-plan"><div><span>${label}</span><b>${price?price+' ⭐':'Цена не задана'}</b></div><label>Цена, Stars<input type="number" min="0" max="100000" step="1" value="${price}" data-payment-price="${esc(plan.planId)}"></label><label class="admin-payment-toggle"><input type="checkbox" data-payment-enabled="${esc(plan.planId)}" ${plan.enabled?'checked':''}> Показывать студентам</label></article>`;
 }).join('');
 const controls=canManagePayments
  ? `<div class="admin-settings-actions"><button class="orange-button" data-admin-payment-save>Сохранить тарифы</button><small>Доступ включается только после подтверждённого successful_payment от Telegram.</small></div>`
  : '<p class="admin-payment-intro">Настройки цен и доступности доступны только владельцу проекта. Здесь показаны сохранённые значения без возможности изменить их.</p>';
 const intro=canManagePayments
  ? 'Укажи стоимость каждого тарифа в Telegram Stars. Цена 0 или выключенный переключатель скрывает тариф от студентов. Оплата цифрового доступа внутри Telegram принимается только в Stars.'
  : 'Тарифы и платёжный реестр доступны для просмотра. Изменять цены и включать продажи может только владелец.';
 return `<section class="admin-payment-plans"><div class="admin-section-head"><div><span>TELEGRAM STARS · XTR</span><h2>Тарифы MAGNUS</h2></div><button data-admin-payment-refresh>Обновить ${icon('refresh')}</button></div><p class="admin-payment-intro">${intro}</p><div class="admin-payment-plan-list">${plans}</div>${controls}</section>`+adminPaymentOrdersSection();
}

function loadAdminSupport(){
 adminSupportLoading=true;adminSupportError='';
 if(currentPage==='admin')render();
 const called=callAdminApi('supportInbox',{},(error,result)=>{
  adminSupportLoading=false;
  if(error||!result?.ok){adminSupportRequests=[];adminSupportError=error?.message||result?.message||'Не удалось загрузить обращения.';}
  else{adminSupportRequests=Array.isArray(result.requests)?result.requests:[];adminSupportError='';}
  if(currentPage==='admin'&&adminTab==='support')render();
 });
 if(!called){adminSupportLoading=false;adminSupportError='Открой панель MAGNUS через Telegram.';if(currentPage==='admin')render();}
}
function adminSupportPage(){
 const statusLabels={new:'Новое',in_progress:'В работе',resolved:'Решено'};
 const cards=adminSupportRequests.map(item=>{
  const date=item.createdAt?new Date(item.createdAt*1000).toLocaleString('ru-RU',{dateStyle:'medium',timeStyle:'short'}):'Дата не указана';
  const status=statusLabels[item.status]||item.status;
  const next=item.status==='new'?'in_progress':item.status==='in_progress'?'resolved':'new';
  const nextLabel=item.status==='new'?'Взять в работу':item.status==='in_progress'?'Закрыть обращение':'Открыть повторно';
  return `<article class="admin-support-card"><header><div><b>${esc(item.displayName||'Пользователь Telegram')}</b><small>${item.username?'@'+esc(item.username)+' · ':''}ID ${esc(item.telegramId)}</small></div><span class="admin-support-status ${esc(item.status)}">${esc(status)}</span></header><time>${esc(date)}</time><p>${esc(item.messageText)}</p><div class="admin-support-reply"><textarea rows="2" maxlength="3500" data-support-reply-text="${esc(item.id)}" placeholder="Ответить пользователю…"></textarea><button class="orange-button" data-support-reply="${esc(item.id)}">Ответить</button></div><footer><button data-support-status="${esc(item.id)}" data-next-status="${next}">${nextLabel}</button></footer></article>`;
 }).join('');
 return `<section class="admin-support-section"><div class="admin-section-head"><div><span>ОБРАЩЕНИЯ ПОЛЬЗОВАТЕЛЕЙ</span><h2>Поддержка</h2></div><div class="admin-student-toolbar"><b>${adminSupportRequests.filter(item=>item.status!=='resolved').length} открыто</b><button data-admin-support-refresh aria-label="Обновить">${icon('refresh')}</button></div></div><p class="admin-support-intro">Входящие сообщения из Telegram-команды /paysupport. Ответ отправляется пользователю в личный чат с ботом.</p>${adminSupportLoading?'<div class="admin-loading">Загружаем обращения…</div>':adminSupportError?'<div class="admin-error" role="alert">'+esc(adminSupportError)+'</div>':cards||'<div class="admin-empty">Новых обращений пока нет.</div>'}</section>`;
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
      lessonPracticeDrafts,
      lessonPracticeResults,
      enrollments,
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
    const localPracticeDrafts = Object.keys(lessonPracticeDrafts).length > 0;
    const localPracticeResults = Object.keys(lessonPracticeResults).length > 0;
    const localEnrollments = Object.keys(enrollments).length > 0;
    assignmentDrafts = { ...(result.assignmentDrafts || {}), ...assignmentDrafts };
    assignmentSubmissions = { ...(result.assignmentSubmissions || []).reduce((map,item)=>{ if(item?.assignmentId){(map[item.assignmentId] ||= []).push(item);} return map; },{}), ...assignmentSubmissions };
    storeAssignmentSubmissions();
    lessonNotes = { ...(result.lessonNotes || {}), ...lessonNotes };
    interestedFaculties = { ...(result.interestedFaculties || {}), ...interestedFaculties };
    lessonQuizResults = { ...(result.lessonQuizResults || {}), ...lessonQuizResults };
    completedLessons = { ...(result.completedLessons || {}), ...completedLessons };
    lessonPracticeDrafts = { ...(result.lessonPracticeDrafts || {}), ...lessonPracticeDrafts };
    lessonPracticeResults = { ...(result.lessonPracticeResults || {}), ...lessonPracticeResults };
    enrollments = { ...(result.enrollments || {}), ...enrollments };
    finalExams = result.finalExams && typeof result.finalExams === "object" ? result.finalExams : {};
    certificates = result.certificates && typeof result.certificates === "object" ? result.certificates : {};
    academicCatalog = result.academicCatalog?.programs?.length ? result.academicCatalog : academicCatalog;
    academicPassport = result.academicPassport && typeof result.academicPassport === "object" ? result.academicPassport : academicPassport;
    writeStudentStorage("enrollments", enrollments);
    studentSubscription = result.subscription || { status: 'none', planId: '', startsAt: 0, endsAt: 0 };
    storeAssignmentDrafts();
    storeLessonNotes();
    storeInterestedFaculties();
    storeLessonQuizResults();
    storeCompletedLessons();
    writeStudentStorage("lessonPracticeDrafts", lessonPracticeDrafts);
    writeStudentStorage("lessonPracticeResults", lessonPracticeResults);
    cloudSyncReady = true;
    render();
    // Если локальные данные старше облачных, объединённый результат также отправляем в облако.
    if (localAssignments || localSubmissions || localNotes || localInterests || localQuizResults || localCompletedLessons || localPracticeDrafts || localPracticeResults || localEnrollments) scheduleCloudStudentDataSync();
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
function dashboardContinueLearning() {
  const candidates = courses.map(course => {
    const lessons = courseLessons(course.id);
    const completed = courseCompletionCount(course.id);
    const nextIndex = lessons.findIndex((lesson,index) => !completedLessons[lesson[0]] && lessonIsUnlocked(lessons,index));
    return { course, lessons, completed, nextIndex, progress: lessons.length ? Math.round(completed / lessons.length * 100) : 0 };
  });
  const active = candidates.find(item => item.nextIndex >= 0) || candidates[0];
  if (!active) return "";
  const lesson = active.lessons[active.nextIndex >= 0 ? active.nextIndex : 0];
  const isStarted = active.completed > 0;
  return `<section class="dashboard-continue">
    <div class="dashboard-continue-copy">
      <span class="subtle-label">${isStarted ? "ПРОДОЛЖИТЬ ОБУЧЕНИЕ" : "ТВОЙ ПЕРВЫЙ ШАГ"}</span>
      <span class="dashboard-continue-course">${esc(active.course.title || active.course.name || "Учебная программа")}</span>
      <h2>${esc(lesson?.[1] || "Начать обучение")}</h2>
      <p>${esc(lesson?.[2] || "Открой программу и начни с первого занятия.")} · ${lesson?.[3] || 10} минут</p>
      <div class="dashboard-continue-progress"><span><i style="width:${active.progress}%"></i></span><small>${active.completed} из ${active.lessons.length} занятий · ${active.progress}%</small></div>
      <button class="orange-button" data-course="${esc(active.course.id)}">${isStarted ? "Продолжить занятие" : "Начать программу"} ${icon("arrow")}</button>
    </div>
    <div class="dashboard-owl-stage" aria-hidden="true">
      <span class="dashboard-owl-orbit dashboard-owl-orbit-one"></span>
      <span class="dashboard-owl-orbit dashboard-owl-orbit-two"></span>
      <span class="dashboard-owl-star dashboard-owl-star-one">✦</span>
      <span class="dashboard-owl-star dashboard-owl-star-two">✧</span>
      <img class="dashboard-owl" src="${magnusOwl3d}" alt="" />
      <span class="dashboard-owl-caption">ТВОЙ ПУТЬ · ТВОЙ ТЕМП</span>
    </div>
  </section>`;
}
function dashboardTasksPreview() {
  const pending = assignments.filter(a => !hasAssignmentSubmission(a.id));
  const nextAssignment = pending.find(a => hasAssignmentDraft(a.id)) || pending[0];
  const laterAssignments = pending.filter(a => a.id !== nextAssignment?.id).slice(0, 2);
  const drafted = assignments.filter(a => hasAssignmentDraft(a.id) && !hasAssignmentSubmission(a.id)).length;
  const submitted = assignments.filter(a => hasAssignmentSubmission(a.id)).length;
  return `<section class="dashboard-work-section">
    <div class="section-title"><div><span class="subtle-label">УЧЕБНЫЙ ПРОЦЕСС</span><h2>Твои задания</h2></div><button class="text-link" data-go="assignments">Все задания ${icon("arrow")}</button></div>
    <div class="dashboard-work-stats">
      <article><b>${pending.length}</b><span>Осталось выполнить</span></article>
      <article><b>${drafted}</b><span>Черновики</span></article>
      <article><b>${submitted}</b><span>Отправлено</span></article>
    </div>
    ${nextAssignment ? `<article class="dashboard-featured-task">
      <div class="featured-task-top"><span class="featured-task-kind">${esc(nextAssignment.type)}</span><span class="featured-task-due">${hasAssignmentDraft(nextAssignment.id) ? "Черновик сохранён" : "Можно начать"}</span></div>
      <h3>${esc(nextAssignment.title)}</h3><p>${esc(nextAssignment.course)}</p>
      <div class="featured-task-bottom"><span>${icon("clock")}${esc(nextAssignment.estimate)}</span><button data-assignment-open="${nextAssignment.id}">${hasAssignmentDraft(nextAssignment.id) ? "Продолжить" : "Открыть задание"} ${icon("arrow")}</button></div>
    </article>` : `<div class="dashboard-task-empty"><b>Все задания отправлены</b><p>Новые практические работы появятся вместе со следующими учебными модулями.</p></div>`}
    ${laterAssignments.map(a => `<article class="dashboard-upcoming-task"><span><b>${esc(a.title)}</b><small>${esc(a.course)} · ${esc(a.estimate)}</small></span><button data-assignment-open="${a.id}" aria-label="Открыть задание">${icon("arrow")}</button></article>`).join("")}
  </section>`;
}

function homePage() {
  const completedTotal = Object.keys(completedLessons).filter(id => completedLessons[id]).length;
  const notesTotal = Object.values(lessonNotes).filter(value => String(value || "").trim()).length;
  const activeProgramsTotal = Object.keys(enrollments).filter(id => Boolean(enrollments[id])).length;
  return `<main class="screen home-screen">
    <section class="greeting-row"><div><div class="subtle-label">ТВОЁ ПРОСТРАНСТВО ДЛЯ РОСТА</div><h1>Привет, ${esc(firstName)}!</h1><p>Продолжим с того места, где остановились?</p></div><div class="home-avatar">${telegramPhotoUrl ? `<img src="${esc(telegramPhotoUrl)}" alt="">` : icon("profile")}</div></section>
    ${dashboardContinueLearning()}
    <section class="dashboard-progress-strip">
      <article><b>${completedTotal}</b><span>Занятий пройдено</span></article>
      <article><b>${activeProgramsTotal}</b><span>Программ</span></article>
      <article><b>${notesTotal}</b><span>Заметок</span></article>
    </section>
    ${dashboardTasksPreview()}
    <section class="home-discover"><div><span class="subtle-label">ЕСТЬ ИНТЕРЕС К НОВОМУ?</span><h2>Открой другое направление</h2><p>Изучи факультеты и выбери тему для следующего этапа.</p></div><button class="text-link" data-go="faculties">Каталог факультетов ${icon("arrow")}</button></section>
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
    <label class="search-box">${icon("search")}<input id="faculty-search" value="${esc(searchValue)}" placeholder="Поиск факультета" autocomplete="off"></label>
    <div class="filter-row">${filters.map(f=>`<button class="filter-chip ${activeFilter===f?"selected":""}" data-filter="${f}" aria-pressed="${activeFilter===f}">${f}</button>`).join("")}</div>
    <div class="faculty-grid">${filtered.map(f=>`<button class="faculty-card" data-faculty="${f.id}">${facultyArt(f)}<span class="faculty-card-copy"><small>${f.en}</small><b>${f.name}</b><span>${f.desc}</span><i>Подробнее ${icon("arrow")}</i></span></button>`).join("")}</div>
    ${filtered.length?"":`<div class="empty-message">Ничего не найдено. Попробуй изменить запрос.</div>`}
  </main>`;
}

function programForFaculty(facultyId) {
  return ({ it: "ai", psychology: "mind", marketing: "brand" })[facultyId] || "";
}
function isProgramEnrolled(courseId) {
  return Boolean(enrollments[courseId]);
}
function enrollInProgram(courseId, button) {
  if (!telegramUser?.id) {
    toast("Зачисление доступно при открытии MAGNUS через Telegram.");
    return;
  }
  if (isProgramEnrolled(courseId)) {
    selectedCourse = courses.find(item => item.id === courseId) || courses[0];
    currentPage = "courseDetail";
    render();
    return;
  }
  if (button) { button.disabled = true; button.textContent = "Оформляем зачисление…"; }
  const called = callCloudStudentData("enrollProgram", { courseId }, (error, result) => {
    if (error || !result?.ok) {
      render();
      toast(error?.message || result?.message || "Не удалось оформить зачисление.");
      return;
    }
    enrollments = { ...enrollments, [courseId]: result.enrolledAt || new Date().toISOString() };
    writeStudentStorage("enrollments", enrollments);
    selectedCourse = courses.find(item => item.id === courseId) || courses[0];
    scheduleCloudStudentDataSync();
    currentPage = "study";
    render();
    toast("Зачисление оформлено. Учебная программа добавлена в твой план.");
  });
  if (!called) {
    if (button) { button.disabled = false; button.textContent = "Зачислиться на программу"; }
    toast("Открой MAGNUS через Telegram.");
  }
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
    ${programForFaculty(f.id) ? (()=>{const programId=programForFaculty(f.id),program=courses.find(item=>item.id===programId),enrolled=isProgramEnrolled(programId);return `<section class="faculty-enrollment"><div class="faculty-enrollment-copy"><span class="subtle-label">УЧЕБНЫЙ ПЛАН · 6 ЗАНЯТИЙ</span><h2>${enrolled?"Ты уже зачислен": "Начни обучение на факультете"}</h2><p>${esc(program.title)}. Последовательные занятия, практика и контрольные точки.</p></div><button class="orange-button" data-enroll-program="${programId}">${enrolled?"Перейти к программе":"Зачислиться на программу"} ${icon("arrow")}</button></section>`;})() : `<section class="faculty-enrollment faculty-enrollment-muted"><div class="faculty-enrollment-copy"><span class="subtle-label">УЧЕБНЫЕ ПРОГРАММЫ</span><h2>Программа готовится</h2><p>Учебный план этого факультета находится в разработке. Сохрани направление, чтобы не потерять его.</p></div></section>`}

    <p class="demo-disclaimer">Информация о направлениях носит ознакомительный характер. Полное содержание и условия программ будут опубликованы отдельно.</p>
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
  const catalogPrograms = academicCatalog?.programs || [];
  const programMeta = (id) => catalogPrograms.find(item => item.id === id);
  const enrolled = courses.filter(course => isProgramEnrolled(course.id));
  return `<main class="screen inner-screen study-screen">
    ${heading("ТВОЯ УЧЕБНАЯ СРЕДА", "Мои<br><em>программы.</em>", "Здесь собраны программы, к которым можно вернуться в любой момент.")}
    ${enrolled.length ? `<section class="enrolled-programs"><div class="section-title"><div><span class="subtle-label">ТВОЁ ЗАЧИСЛЕНИЕ</span><h2>Учебный план</h2></div><span class="course-count">${enrolled.length} активных</span></div>${enrolled.map(course=>{
      const lessons=courseLessons(course.id),done=courseCompletionCount(course.id),progress=lessons.length?Math.round(done/lessons.length*100):0;
      const program=programMeta(course.id),terms=program?.terms||[];
      return `<article class="enrolled-program-card academic-plan-card">
        <div class="enrolled-program-top"><span>${esc(course.category)} · ${esc(program?.code||"MAGNUS")}</span><b>${progress}%</b></div>
        <h3>${esc(program?.title||course.title)}</h3>
        <p>${done} из ${lessons.length} занятий завершено</p>
        <div class="enrolled-progress"><span style="width:${progress}%"></span></div>
        ${terms.map(term=>`<div class="plan-term"><div class="plan-term-heading"><span>МОДУЛЬ ${String(term.order).padStart(2,"0")}</span><b>${esc(term.title)}</b></div>${term.subjects.map(subject=>{
          const subjectDone=subject.lessonIds.filter(id=>Boolean(completedLessons[id])).length;
          const subjectLessons=subject.lessonIds.map(id=>lessons.find(item=>item[0]===id)).filter(Boolean);
          return `<div class="plan-subject"><div class="plan-subject-heading"><div><strong>${esc(subject.title)}</strong><small>${subjectDone} из ${subject.lessonIds.length} занятий завершено</small></div><span class="plan-subject-state">${subjectDone===subject.lessonIds.length?"Завершено":subjectDone?"В процессе":"Впереди"}</span></div><div class="plan-lesson-list">${subjectLessons.map(lesson=>{
            const lessonIndex=lessons.findIndex(item=>item[0]===lesson[0]);
            const done=Boolean(completedLessons[lesson[0]]),unlocked=lessonIsUnlocked(lessons,lessonIndex);
            return `<button class="plan-lesson-row ${done?"is-done":unlocked?"is-open":"is-locked"}" data-lesson-open="${esc(lesson[0])}" ${unlocked?"":"disabled"}><span class="plan-lesson-status">${done?"✓":String(lessonIndex+1).padStart(2,"0")}</span><span class="plan-lesson-title">${esc(lesson[1])}</span><span class="plan-lesson-action">${done?"Пройдено":unlocked?"Открыть":"Закрыто"}</span></button>`;
          }).join("")}</div></div>`;
        }).join("")}</div>`).join("")}
        <button data-course="${course.id}">Открыть занятия ${icon("arrow")}</button>
      </article>`;
    }).join("")}</section>` : `<section class="enrollment-empty"><span class="subtle-label">ТВОЙ СЛЕДУЮЩИЙ ШАГ</span><h2>Выбери программу и оформи зачисление</h2><p>После зачисления программа появится здесь. Прогресс будет сохраняться в твоём Telegram-профиле.</p><button class="orange-button" data-go="faculties">Выбрать факультет ${icon("arrow")}</button></section>`}
    <section class="courses-section study-courses"><div class="section-title"><div><span class="subtle-label">ОБРАЗОВАТЕЛЬНЫЙ КАТАЛОГ</span><h2>Все программы</h2></div><span class="course-count">${courses.length} ознакомительных</span></div>${courses.map(c=>courseTile(c,true)).join("")}</section>
  </main>`;
}


function lessonIsUnlocked(lessons,index) {
 return index===0 || Boolean(completedLessons[lessons[index-1]?.[0]]);
}
function courseDetailPage() {
 const c=selectedCourse,lessons=courseLessons(c.id),completed=courseCompletionCount(c.id),chapterList=courseChapters[c.id]||[];
 const progress=lessons.length?Math.round(completed/lessons.length*100):0;
 const remaining=Math.max(0,lessons.length-completed);
 const finishCaption=completed===lessons.length
  ? `Все ${lessons.length} занятий программы завершены.`
  : completed>0
   ? `${completed} из ${lessons.length} занятий пройдены. Осталось ${remaining}.`
   : `Впереди ${lessons.length} занятий. Начни с первого шага.`;
 const finishState=completed===lessons.length?"is-complete":"is-pending";
 const nextIndex=lessons.findIndex((lesson,index)=>!completedLessons[lesson[0]]&&lessonIsUnlocked(lessons,index));
 const nextLesson=lessons[nextIndex>=0?nextIndex:Math.max(0,lessons.length-1)];
 const mapItems=[];
 lessons.forEach((lesson,index)=>{
  const chapterIndex=Math.min(Math.floor(index/2),Math.max(0,chapterList.length-1));
  const chapter=chapterList[chapterIndex]||{title:"Продолжение программы",subtitle:"Учебный этап",tag:"ЭТАП"};
  if(index%2===0){
   const chapterLessons=lessons.slice(chapterIndex*2,chapterIndex*2+2);
   const chapterDone=chapterLessons.length>0&&chapterLessons.every(item=>Boolean(completedLessons[item[0]]));
   const chapterCurrent=chapterLessons.some(item=>{
    const itemIndex=lessons.findIndex(candidate=>candidate[0]===item[0]);
    return !completedLessons[item[0]]&&lessonIsUnlocked(lessons,itemIndex);
   });
   mapItems.push(`<div class="learning-chapter ${chapterDone?"is-done":chapterCurrent?"is-current":""}">
    <span class="learning-chapter-number">${String(chapterIndex+1).padStart(2,"0")}</span>
    <div class="learning-chapter-copy"><small>ГЛАВА ${String(chapterIndex+1).padStart(2,"0")} · ${esc(chapter.tag)}</small><b>${esc(chapter.title)}</b><span>${esc(chapter.subtitle)}</span></div>
    <span class="learning-chapter-count">${chapterLessons.length} занятия</span>
   </div>`);
  }
  const done=Boolean(completedLessons[lesson[0]]),unlocked=lessonIsUnlocked(lessons,index),current=!done&&unlocked;
  const state=done?"Пройдено":current?"Твой следующий шаг":"Пока закрыто";
  mapItems.push(`<div class="learning-node-wrap ${index%2?"right":"left"} ${done?"is-done":current?"is-current":"is-locked"}">
   <span class="learning-path-connector" aria-hidden="true"></span>
   <button type="button" class="learning-node" ${unlocked?`data-lesson-open="${esc(lesson[0])}"`:"disabled"} aria-label="${esc(lesson[1])}: ${state}">
    <span class="learning-node-icon">${done?"✓":unlocked?String(index+1).padStart(2,"0"):'<svg class="learning-node-lock" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'}</span>
   </button>
   <div class="learning-node-card">
    <div class="learning-node-kicker"><small>ЗАНЯТИЕ ${String(index+1).padStart(2,"0")} · ${esc(lesson[2].toUpperCase())}</small><span class="learning-node-status">${done?"ЗАВЕРШЁН":current?"ТЕКУЩИЙ":"ЗАКРЫТ"}</span></div>
    <b>${esc(lesson[1])}</b>
    <div class="learning-node-meta"><span>${lesson[3]} минут</span><span>${done?"Результат сохранён":current?"Можно начать":"Откроется после предыдущего"}</span></div>
   </div>
  </div>`);
  if(index%2===1&&index<lessons.length-1){
   const chapterStart=lessons[index-1],chapterEnd=lessons[index];
   const chapterDone=Boolean(completedLessons[chapterStart[0]]&&completedLessons[chapterEnd[0]]);
   const chapterCompletedCount=[chapterStart,chapterEnd].filter(item=>completedLessons[item[0]]).length;
   const checkpointChapter=chapterList[chapterIndex]||chapter;
   mapItems.push(`<div class="learning-checkpoint ${chapterDone?"is-done":""}" data-chapter-checkpoint="${chapterIndex+1}">
    <span class="learning-checkpoint-icon">${chapterDone?'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>':'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'}</span>
    <span class="learning-checkpoint-copy"><small>КОНТРОЛЬНАЯ ТОЧКА · ГЛАВА ${String(chapterIndex+1).padStart(2,"0")}</small><b>${chapterDone?"Глава завершена":esc(checkpointChapter.title)}</b><span>${chapterDone?"Оба занятия пройдены":chapterCompletedCount+" из 2 занятий завершено"}</span></span>
    <strong>${chapterDone?"ГОТОВО":"РУБЕЖ"}</strong>
   </div>`);
  }
 });
 const nodes=mapItems.join("");
 const chapterCount=chapterList.length||Math.ceil(lessons.length/2);
 return `<main class="screen inner-screen course-detail-screen learning-map-screen" data-map-course="${c.id}">
 <button class="back-button" data-go="study">${icon("back")} Все программы</button>
 <section class="learning-map-heading">
  <div class="learning-map-art ${c.color}">${courseArtwork(c)}<span>${esc(c.category)}</span></div>
  <div class="learning-map-title"><span class="subtle-label">ТВОЯ УЧЕБНАЯ ПРОГРАММА</span><h1>${esc(c.title)}</h1><p>${chapterCount} главы, ${lessons.length} занятий. Проходи главы последовательно и отмечай контрольные точки по мере обучения.</p></div>
 </section>
 <section class="learning-progress-card"><div><span><small>ТВОЙ ПРОГРЕСС</small><b>${completed} из ${lessons.length} занятий</b></span><strong>${progress}%</strong></div><div class="learning-progress-track"><span style="width:${progress}%"></span></div></section>
 <section class="learning-path-section"><div class="learning-path-head"><div><span class="subtle-label">УЧЕБНЫЙ МАРШРУТ</span><h2>Твоя траектория</h2></div><span>${chapterCount} главы · ${lessons.length} занятий</span></div><div class="learning-path">
  <div class="learning-path-map-label"><span>MAGNUS FIELD GUIDE</span><b>${String(chapterCount).padStart(2,"0")} ГЛАВЫ · ${String(lessons.length).padStart(2,"0")} ЭТАПОВ</b></div>
  <svg class="learning-path-art" viewBox="0 0 600 1370" preserveAspectRatio="none" aria-hidden="true">
   <defs><pattern id="map-dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#a6a18f" opacity=".3"/></pattern><linearGradient id="map-route-gradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d99b6e"/><stop offset="1" stop-color="#b7a18a"/></linearGradient></defs>
   <rect width="600" height="1370" fill="url(#map-dots)"/>
   <g fill="none" stroke="#bcb8aa" stroke-width="1.2" opacity=".3"><path d="M-30 190C80 75 184 90 231 190s143 105 236 45 129-56 165-13"/><path d="M-30 210C80 95 184 110 231 210s143 105 236 45 129-56 165-13"/><path d="M-30 230C80 115 184 130 231 230s143 105 236 45 129-56 165-13"/><path d="M-30 840c115-65 196-50 244 22s139 88 227 41 128-53 159-13"/><path d="M-30 860c115-65 196-50 244 22s139 88 227 41 128-53 159-13"/></g>
   <path d="M58 120C220 135 405 225 542 270S220 465 58 520 405 615 542 670 220 865 58 920 405 1015 542 1070C470 1160 380 1220 300 1290" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round" opacity=".86"/>
   <path d="M58 120C220 135 405 225 542 270S220 465 58 520 405 615 542 670 220 865 58 920 405 1015 542 1070C470 1160 380 1220 300 1290" fill="none" stroke="url(#map-route-gradient)" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 11"/>
   <g fill="#fff" stroke="#c8a78d" stroke-width="2"><circle cx="58" cy="120" r="7"/><circle cx="542" cy="270" r="7"/><circle cx="58" cy="520" r="7"/><circle cx="542" cy="670" r="7"/><circle cx="58" cy="920" r="7"/><circle cx="542" cy="1070" r="7"/></g>
  </svg>
  ${nodes}<div class="learning-path-finish ${finishState}" data-course-progress-state="${completed}/${lessons.length}"><span>${completed===lessons.length?"✓":"✦"}</span><b>Финиш маршрута</b><small>${esc(finishCaption)}</small></div>
 </div></section>
 ${completed===lessons.length?`<div class="learning-complete-note">Все доступные этапы пройдены. Новые материалы появятся в программе после публикации.</div>`:`<button class="learning-continue-button" data-lesson-open="${esc(nextLesson[0])}"><span><small>СЛЕДУЮЩИЙ ШАГ</small><b>${esc(nextLesson[1])}</b></span><strong>Продолжить ${icon("arrow")}</strong></button>`}
 ${completed===lessons.length?(()=>{const state=finalExams[c.id]||{},attempts=Array.isArray(state.attempts)?state.attempts:[],last=attempts[attempts.length-1];return `<section class="final-exam-card"><span class="subtle-label">ИТОГОВАЯ АТТЕСТАЦИЯ</span><h2>${state.passed?"Программа завершена":"Финальный экзамен"}</h2><p>${state.passed?"Итоговая проверка успешно пройдена. Результат сохранён в твоём учебном профиле.":"Шесть вопросов по материалам программы. Для зачёта нужно набрать не менее 70%."}</p>${last?`<div class="final-exam-result ${last.passed?"passed":"failed"}"><b>${last.score}%</b><span>${last.passed?"Экзамен сдан":"Экзамен не сдан"} · ${last.correct} из ${last.total}</span></div>`:""}<div class="final-exam-actions"><small>Использовано попыток: ${attempts.length} из 3</small><button class="orange-button" data-exam-start="${c.id}" ${state.passed||attempts.length>=3?"disabled":""}>${state.passed?"Экзамен сдан":attempts.length?"Пересдать экзамен":"Начать экзамен"} ${icon("arrow")}</button></div></section>`;})():""}
 <p class="demo-disclaimer">Сейчас в MAGNUS доступны ознакомительные учебные маршруты. Содержание и результаты каждого этапа отображаются в программе.</p>
 </main>`;
}
function lessonPracticePanel(id) {
 const practice=lessonPractices[id];
 if(!practice)return '<div class="lesson-practice-empty">Практическое задание для этого занятия скоро появится.</div>';
 let saved=null;
 try{saved=JSON.parse(lessonPracticeResults[id]||"null");}catch{saved=null;}
 const draft=lessonPracticeDrafts[id]||"";
 return `<section class="lesson-practice">
  <div class="lesson-practice-topline"><span class="lesson-practice-tag">ПРАКТИЧЕСКИЙ ШАГ</span><span class="lesson-practice-time">5–7 минут</span></div>
  <h3>${esc(practice.title)}</h3>
  <p class="lesson-practice-task">${esc(practice.task)}</p>
  <div class="lesson-practice-hint">
   <button type="button" data-practice-hint aria-expanded="${practiceHintOpen}">${practiceHintOpen?"Скрыть подсказку":"Нужна подсказка?"} <span>${practiceHintOpen?"−":"+"}</span></button>
   ${practiceHintOpen?`<p>${esc(practice.hint)}</p>`:""}
  </div>
  <label class="lesson-practice-answer"><span>ТВОЙ ОТВЕТ</span><textarea data-practice-answer maxlength="2000" rows="5" placeholder="Опиши ход мысли и свой вариант решения…">${esc(draft)}</textarea></label>
  <div class="lesson-practice-actions"><small>До 2 000 символов · ответ проверит MAGNUS</small><button type="button" data-practice-send ${practicePending?"disabled":""}>${practicePending?"Разбираем…":"Проверить ответ"} ${icon("arrow")}</button></div>
  ${saved?.feedback?`<div class="lesson-practice-feedback ${saved.verdict==="pass"?"is-passed":"is-revision"}"><div><span>РЕЗУЛЬТАТ ПРОВЕРКИ</span><b>${saved.verdict==="pass"?"Зачтено":"Нужно доработать"}</b><strong class="practice-score">${Number(saved.totalScore)||0}<small>/ 6</small></strong></div>${saved.scores?`<div class="practice-rubric"><span>По теме <b>${Number(saved.scores.relevance)||0}/2</b></span><span>Полнота <b>${Number(saved.scores.completeness)||0}/2</b></span><span>Обоснование <b>${Number(saved.scores.reasoning)||0}/2</b></span></div>`:""}<p>${esc(saved.feedback)}</p><small>${Number(saved.attempts)||1} ${(Number(saved.attempts)||1)===1?"попытка":"попытки"} · Проверено ${esc(new Date(saved.reviewedAt||Date.now()).toLocaleString("ru-RU",{dateStyle:"medium",timeStyle:"short"}))}</small></div>`:""}
  ${saved?.answer?`<details class="lesson-practice-previous"><summary>Показать отправленный ответ</summary><p>${esc(saved.answer)}</p></details>`:""}
 </section>`;
}

function finalExamPage() {
 const exam=activeExam;
 if(!exam)return courseDetailPage();
 return `<main class="screen inner-screen final-exam-screen"><button class="back-button" data-go="courseDetail">${icon("back")} К программе</button><div class="final-exam-heading"><span class="subtle-label">ИТОГОВАЯ АТТЕСТАЦИЯ · ${esc(selectedCourse.category.toUpperCase())}</span><h1>Проверь<br><em>свои знания.</em></h1><p>Ответь на все вопросы. Результат будет проверен и сохранён в учебной системе.</p></div><div class="final-exam-question-list">${exam.questions.map((q,index)=>`<fieldset class="final-exam-question"><legend><small>ВОПРОС ${index+1} ИЗ ${exam.questions.length}</small><b>${esc(q.text)}</b></legend>${q.options.map((option,choice)=>`<label><input type="radio" name="${esc(q.id)}" value="${choice}"><span>${esc(option)}</span></label>`).join("")}</fieldset>`).join("")}</div><button class="orange-button final-exam-submit" data-exam-submit ${examPending?"disabled":""}>${examPending?"Проверяем ответы…":"Завершить экзамен"} ${icon("arrow")}</button><p class="demo-disclaimer">Проходной результат — 70%. Доступно до трёх попыток. Это внутренняя аттестация MAGNUS, а не государственный экзамен.</p></main>`;
}

function lessonPage() {
 const c=selectedCourse,lesson=selectedLesson();if(!lesson)return courseDetailPage();
 const [id,title,type,duration,intro,h1,b1,h2,b2,question,options,answer]=lesson;
 const quizResult=lessonQuizResults[id]?JSON.parse(lessonQuizResults[id]):null,lessonCompleted=Boolean(completedLessons[id]);
 let practiceResult=null;try{practiceResult=JSON.parse(lessonPracticeResults[id]||"null");}catch{}
 const practicePassed=practiceResult?.verdict==="pass";
 const tabContent=lessonTab==="practice"?lessonPracticePanel(id):lessonTab==="notes"?`<div class="lesson-notes"><div class="lesson-notes-head"><label for="lesson-note">МОИ ЗАМЕТКИ</label><span>${icon("cloud")} АВТОСОХРАНЕНИЕ</span></div><textarea id="lesson-note" placeholder="Запишите важную мысль, пример или вопрос...">${esc(lessonNotes[id]||"")}</textarea><small>Заметки сохраняются на устройстве и синхронизируются с облаком, если оно доступно.</small></div>`:lessonTab==="materials"?`<div class="lesson-reading"><span class="subtle-label">КРАТКИЙ КОНСПЕКТ</span><h3>${esc(title)}</h3><h3>${esc(h1)}</h3><p>${esc(b1)}</p><h3>${esc(h2)}</h3><p>${esc(b2)}</p><blockquote>${esc(intro)}</blockquote></div>`:`<div class="lesson-reading"><span class="subtle-label">${esc(type.toUpperCase())} · ${duration} МИНУТ</span><h3>${esc(title)}</h3><p>${esc(intro)}</p><div class="lesson-callout"><b>Главная мысль</b><span>${esc(b1)}</span></div><p>Открой конспект, чтобы разобрать тему подробнее, затем проверь понимание материала.</p></div>`;
 const lessons=courseLessons(c.id),index=lessons.findIndex(item=>item[0]===id),previous=lessons[index-1],next=lessons[index+1];
 return `<main class="screen inner-screen lesson-screen"><button class="back-button" data-go="courseDetail">${icon("back")} К программе курса</button>
 <div class="lesson-heading"><span class="subtle-label">${esc(c.category.toUpperCase())} · ЗАНЯТИЕ ${String(index+1).padStart(2,"0")} ИЗ ${lessons.length}</span><h1>${esc(title)}</h1><p>${esc(c.title)}</p><div class="lesson-meta-row"><span>${duration} минут</span><span>${esc(type)}</span><span>Конспект и тест</span></div></div>
 <div class="lesson-tabs" role="tablist" aria-label="Материалы урока">${[["lesson","Урок"],["materials","Конспект"],["practice","Практика"],["notes","Заметки"]].map(([key,label])=>`<button type="button" role="tab" id="lesson-tab-${key}" aria-controls="lesson-panel" aria-selected="${lessonTab===key}" tabindex="${lessonTab===key?"0":"-1"}" class="${lessonTab===key?"selected":""}" data-lesson-tab="${key}">${label}</button>`).join("")}</div>
 <section class="lesson-content" id="lesson-panel" role="tabpanel" aria-labelledby="lesson-tab-${lessonTab}">${tabContent}</section>
 <section class="lesson-tutor">
  <div class="lesson-tutor-heading"><span class="subtle-label">ИНДИВИДУАЛЬНАЯ ПОМОЩЬ</span><h2>Разберём тему вместе</h2><p>Задай вопрос по этому уроку, попроси пример или объяснение сложного момента.</p></div>
  <div class="lesson-tutor-messages" aria-live="polite">${(tutorChats[id]||[]).map(item=>`<article class="lesson-tutor-message ${item.role==='user'?'from-student':'from-magnus'}"><small>${item.role==='user'?'ТЫ':'MAGNUS'}</small><p>${esc(item.content)}</p></article>`).join('')||'<div class="lesson-tutor-empty">Например: «Объясни эту тему на простом примере».</div>'}
  ${tutorPending?'<div class="lesson-tutor-thinking"><i></i><i></i><i></i><span>Подготавливаем объяснение…</span></div>':''}</div>
  <div class="lesson-tutor-compose"><textarea data-tutor-input rows="2" maxlength="1200" placeholder="Напиши свой вопрос…"></textarea><button type="button" data-tutor-send ${tutorPending?'disabled':''}>${tutorPending?'…':'Отправить'} ${icon('arrow')}</button></div>
  <small class="lesson-tutor-footnote">Ответы формируются автоматически по материалу текущего урока. Важные факты стоит перепроверять.</small>
 </section>
 <section class="lesson-quiz"><div class="kicker">ПРОВЕРЬ СЕБЯ</div><h2>${esc(question)}</h2><p>Выберите один вариант ответа.</p>${options.map((option,i)=>`<button type="button" class="quiz-option ${quizChoice===String(i)?"chosen":""}" data-quiz="${i}" aria-pressed="${quizChoice===String(i)}"><span>${String.fromCharCode(65+i)}</span>${esc(option)}${quizChoice===String(i)?"<b>✓</b>":""}</button>`).join("")}${quizChoice!==""?`<div class="quiz-feedback ${quizChoice===String(answer)?"correct":"incorrect"}" role="status">${quizChoice===String(answer)?"Верно. Ты правильно понял основную мысль.":"Пока неверно. Перечитай конспект и попробуй ещё раз."}</div>`:""}${quizResult?`<div class="quiz-saved-result">Последний результат: ${quizResult.correct?"верный ответ":"ответ неверный"} · попыток: ${quizResult.attempts}</div>`:""}</section>
 <div class="lesson-footer"><button class="lesson-finish" data-action="lesson-finish" ${lessonCompleted||!(((quizChoice===String(answer))||quizResult?.correct)&&practicePassed)?"disabled":""}>${lessonCompleted?"Занятие завершено":practicePassed&&((quizChoice===String(answer))||quizResult?.correct)?"Подтвердить завершение":!practicePassed?"Сначала получи зачёт за практику":"Сначала пройди проверку"} ${lessonCompleted?"":icon("arrow")}</button><small>${lessonCompleted?"Результат проверки сохранён в учебном прогрессе.":!practicePassed?"Для завершения занятия нужны зачёт за практику и правильный ответ на контрольный вопрос.": "Контрольный вопрос пройден, практика зачтена. Можно завершить занятие."}</small></div>
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
    if (activeAssignmentFilter === "Нужно выполнить") return !hasAssignmentDraft(a.id) && !hasAssignmentSubmission(a.id);
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
    <p class="assignment-demo-note">Отправленные ответы сохраняются в облаке MAGNUS. Проверка и оценивание ответов пока не подключены.</p>
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
      <div class="assignment-submit-row"><p>Отправка сохранит ответ в облаке MAGNUS. Проверка и оценивание ответов пока не подключены.</p><button class="assignment-submit-button" data-action="submit-assignment" ${draft.trim().length<30?"disabled":""}>Отправить ответ</button></div>
    </section>
    ${submissions.length?`<section class="assignment-history"><div class="section-title"><div><span class="subtle-label">ИСТОРИЯ</span><h2>Отправленные ответы</h2></div><span class="course-count">${submissions.length}</span></div>${submissions.slice().reverse().map((item,index)=>`<article class="submission-record"><div><b>Попытка ${submissions.length-index}</b><span>${new Date(item.submittedAt).toLocaleString("ru-RU",{dateStyle:"medium",timeStyle:"short"})}</span></div><p>${esc(item.answer)}</p><small>${item.status==="reviewed"?"Проверено":item.status==="revision"?"Нужны доработки":"Получено сервером"}${item.grade===null||item.grade===undefined?"":` · оценка ${item.grade}/100`}</small>${item.comment?`<div class="submission-comment">${esc(item.comment)}</div>`:""}</article>`).join("")}</section>`:""}
    <p class="assignment-demo-note">Отправленные ответы доступны в облачной истории этого аккаунта. Проверка, оценки и обратная связь по отправленным работам пока не подключены.</p>
  </main>`;
}

function documentsPage() {
  const verifyId = new URLSearchParams(window.location.search).get("certificate");
  const available = courses.filter(course => finalExams[course.id]?.passed && !certificates[course.id]);
  const issued = Object.entries(certificates);
  const verifyPanel = verifyId ? `<section class="certificate-verify-panel"><span class="subtle-label">ПРОВЕРКА ДОКУМЕНТА</span><h2>${certificateVerification?.loading?"Проверяем сертификат…":certificateVerification?.valid?"Сертификат подлинный":"Сертификат не найден"}</h2>${certificateVerification?.valid?`<div class="certificate-verify-status valid">Действующий документ MAGNUS</div><dl><div><dt>Выпускник</dt><dd>${esc(certificateVerification.certificate.studentName)}</dd></div><div><dt>Программа</dt><dd>${esc(certificateVerification.certificate.programTitle)}</dd></div><div><dt>Дата выдачи</dt><dd>${new Date(certificateVerification.certificate.issuedAt).toLocaleDateString("ru-RU")}</dd></div><div><dt>Итоговый результат</dt><dd>${Number(certificateVerification.certificate.finalScore)}%</dd></div><div><dt>Номер</dt><dd>${esc(certificateVerification.certificate.certificateId)}</dd></div></dl>`:`<p>${certificateVerification?.loading?"Пожалуйста, подожди.":"Не удалось подтвердить документ по указанному номеру."}</p>`}<button class="text-button" data-cert-clear>Закрыть проверку</button></section>`:"";
  const cards = issued.map(([courseId,cert])=>`<article class="issued-certificate-card"><div class="issued-certificate-top"><b>MAGNUS</b><span>СЕРТИФИКАТ ВЫДАН</span></div><span class="subtle-label">ПОДТВЕРЖДЕНИЕ ОБУЧЕНИЯ</span><h2>${esc(cert.programTitle)}</h2><p>Выдан: ${new Date(cert.issuedAt).toLocaleDateString("ru-RU")}</p><div class="issued-certificate-meta"><span>Выпускник</span><b>${esc(cert.studentName)}</b><span>Итоговый экзамен</span><b>${Number(cert.finalScore)}%</b><span>Регистрационный номер</span><b>${esc(cert.certificateId)}</b></div><button class="orange-button" data-cert-verify="${esc(cert.certificateId)}">Проверить подлинность ${icon("arrow")}</button></article>`).join("");
  const pending = available.map(course=>`<article class="certificate-ready-card"><div><span class="subtle-label">ПРОГРАММА ЗАВЕРШЕНА</span><b>${esc(course.title)}</b><small>Экзамен сдан · сертификат готов к оформлению</small></div><button data-cert-issue="${esc(course.id)}" ${certificateIssuePending?"disabled":""}>Выдать сертификат</button></article>`).join("");
  return `<main class="screen inner-screen documents-screen">
    ${heading("АКАДЕМИЧЕСКИЕ ДОКУМЕНТЫ","Твои результаты<br><em>и достижения.</em>","Сертификаты MAGNUS подтверждают завершение учебной программы и успешную итоговую аттестацию.")}
    ${verifyPanel}
    ${cards?'<section class="issued-certificates-list">'+cards+'</section>':`<div class="documents-empty-state"><b>Пока нет выданных сертификатов</b><p>Документ появится после завершения всех занятий и успешной сдачи итогового экзамена.</p><button data-go="study">Перейти к обучению ${icon("arrow")}</button></div>`}
    ${pending?'<section class="certificate-ready-list"><span class="subtle-label">ГОТОВО К ВЫДАЧЕ</span>'+pending+'</section>':''}
    <p class="legal-note">Сертификат подтверждает прохождение программы MAGNUS и результат внутренней аттестации. Он не является государственным дипломом, документом об аккредитации или квалификацией, признанной государством.</p>
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
    <section class="profile-academic-entry">
      <div class="profile-academic-entry-mark">${icon("faculty")}</div>
      <div class="profile-academic-entry-copy"><span class="subtle-label">АКАДЕМИЧЕСКИЕ ДАННЫЕ</span><b>Паспорт студента</b><small>${academicPassport ? academicPassport.enrolledProgramsCount ? academicPassport.enrolledProgramsCount + " программ · " + academicPassport.completedLessons + " из " + academicPassport.totalLessons + " занятий" : "Пока нет активных зачислений" : "Статус обучения и академические результаты"}</small></div>
      <button data-go="academicPassport" aria-label="Открыть академический паспорт">${icon("arrow")}</button>
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
      <button data-go="documents"><span class="menu-icon">${icon("docs")}</span><span class="menu-copy"><b>Сертификаты и документы</b><small>${Object.keys(certificates).length?Object.keys(certificates).length+" выдано":"Академические достижения"}</small></span>${icon("arrow")}</button>
      <button data-action="settings"><span class="menu-icon">${icon("settings")}</span><span class="menu-copy"><b>Настройки</b><small>Внешний вид и предпочтения</small></span>${icon("arrow")}</button>
      <button data-action="notifications"><span class="menu-icon">${icon("bell")}</span><span class="menu-copy"><b>Уведомления</b><small>Важные события и напоминания</small></span>${icon("arrow")}</button>
      <button data-action="support"><span class="menu-icon">${icon("help")}</span><span class="menu-copy"><b>Поддержка</b><small>Помощь и обратная связь</small></span>${icon("arrow")}</button>
      <button data-action="about"><span class="menu-icon">${icon("faculty")}</span><span class="menu-copy"><b>О MAGNUS</b><small>Пространство для знаний и развития</small></span>${icon("arrow")}</button>
    </section>
  </main>`;
}


function academicDate(value) {
  if (!value) return "Не указана";
  const date = typeof value === "number" ? new Date(value * 1000) : new Date(value);
  return Number.isNaN(date.getTime()) ? "Не указана" : date.toLocaleDateString("ru-RU", { day:"numeric", month:"long", year:"numeric" });
}

function academicStatusMeta(status) {
  const labels = {
    applicant: ["Абитуриент", "applicant"],
    active: ["Обучается", "active"],
    academic_leave: ["Академический отпуск", "paused"],
    expelled: ["Отчислен", "stopped"],
    graduated: ["Программа завершена", "graduated"],
  };
  return labels[status] || ["Статус не определён", "unknown"];
}

function refreshAcademicPassport() {
  if (!telegramUser?.id) {
    academicPassportError = "Академический паспорт доступен после открытия MAGNUS через Telegram.";
    academicPassportLoading = false;
    if (currentPage === "academicPassport") render();
    return false;
  }
  academicPassportLoading = true;
  academicPassportError = "";
  const called = callCloudStudentData("getAcademicPassport", {}, (error, result) => {
    academicPassportLoading = false;
    if (error || !result?.ok || !result.academicPassport) {
      academicPassportError = error?.message || result?.message || "Не удалось загрузить академические данные. Попробуй ещё раз.";
    } else {
      academicPassport = result.academicPassport;
    }
    if (currentPage === "academicPassport") render();
  });
  if (!called) {
    academicPassportLoading = false;
    academicPassportError = "Открой MAGNUS через Telegram, чтобы получить данные из учебной системы.";
    if (currentPage === "academicPassport") render();
    return false;
  }
  return true;
}

function academicPassportPage() {
  const passport = academicPassport;
  const [statusLabel, statusClass] = academicStatusMeta(passport?.status);
  const programs = Array.isArray(passport?.programs) ? passport.programs : [];
  const loadingState = academicPassportLoading && !passport;
  const programCards = programs.map(program => {
    const course = courses.find(item => item.id === program.id);
    const examLabel = program.exam?.passed
      ? "Сдан · " + Number(program.exam.score || 0) + "%"
      : program.exam?.attempts
        ? "Попыток: " + Number(program.exam.attempts) + " из " + Number(program.exam.maxAttempts || 3)
        : "Не начат";
    const terms = (program.terms || []).map(term => `
      <section class="passport-term">
        <div class="passport-term-heading"><span>МОДУЛЬ ${String(term.order || 0).padStart(2,"0")}</span><b>${esc(term.title)}</b></div>
        <div class="passport-subject-list">${(term.subjects || []).map(subject => {
          const done = Number(subject.completedLessons) || 0;
          const total = Number(subject.totalLessons) || 0;
          const practice = Number(subject.passedPractices) || 0;
          const subjectStatus = total > 0 && done === total ? "Завершена" : done > 0 ? "В процессе" : "Не начата";
          return `<article class="passport-subject">
            <div class="passport-subject-top"><b>${esc(subject.title)}</b><span>${subjectStatus}</span></div>
            <div class="passport-subject-progress"><i style="width:${total ? Math.round(done/total*100) : 0}%"></i></div>
            <div class="passport-subject-meta"><span>${done} из ${total} занятий</span><span>Практика: ${practice}/${total}</span></div>
          </article>`;
        }).join("")}</div>
      </section>`).join("");
    return `<article class="passport-program-card">
      <div class="passport-program-head">
        <div><span class="subtle-label">${esc(program.code || "MAGNUS")} · ${esc(program.facultyTitle || "Факультет")}</span><h2>${esc(program.title)}</h2><p>Зачисление: ${academicDate(program.enrolledAt)}</p></div>
        <strong>${Number(program.progress) || 0}%</strong>
      </div>
      <div class="passport-progress-track"><i style="width:${Number(program.progress) || 0}%"></i></div>
      <div class="passport-program-stats">
        <div><b>${Number(program.completedLessons) || 0}/${Number(program.totalLessons) || 0}</b><span>Занятия</span></div>
        <div><b>${program.practiceAverage === null || program.practiceAverage === undefined ? "—" : Number(program.practiceAverage).toFixed(1)+"/6"}</b><span>Средняя практика</span></div>
        <div><b>${esc(examLabel)}</b><span>Итоговый экзамен</span></div>
      </div>
      ${terms}
      <div class="passport-program-footer">
        <span class="passport-program-certificate">${program.certificate?.issued ? "Сертификат выдан" : program.completed ? "Можно оформить сертификат" : "Документ после завершения программы"}</span>
        ${course ? `<button data-course="${esc(course.id)}">Открыть программу ${icon("arrow")}</button>` : ""}
      </div>
    </article>`;
  }).join("");
  const history = (passport?.history || []).length ? `
    <section class="passport-history">
      <div class="section-title"><div><span class="subtle-label">ИЗМЕНЕНИЯ СТАТУСА</span><h2>Академическая история</h2></div></div>
      <div class="passport-history-list">${passport.history.map(item => {
        const [, toClass] = academicStatusMeta(item.to);
        const [toLabel] = academicStatusMeta(item.to);
        const [fromLabel] = academicStatusMeta(item.from);
        return `<article class="passport-history-item"><span class="passport-history-dot ${toClass}"></span><div><b>${esc(fromLabel)} → ${esc(toLabel)}</b><time>${academicDate(item.changedAt)}</time>${item.note ? `<p>${esc(item.note)}</p>` : ""}</div></article>`;
      }).join("")}</div>
    </section>` : "";
  return `<main class="screen inner-screen academic-passport-screen">
    <button class="back-button" data-go="profile">${icon("back")} Вернуться в профиль</button>
    ${heading("ЛИЧНОЕ ДЕЛО · MAGNUS", "Академический<br><em>паспорт.</em>", "Твоё зачисление, учебный маршрут и подтверждённые результаты в одном месте.")}
    ${!telegramUser?.id ? `<section class="passport-state-card"><b>Нужен вход через Telegram</b><p>Открой Mini App из бота MAGNUS, чтобы загрузить личные академические данные.</p></section>`
      : loadingState ? `<section class="passport-state-card is-loading"><span class="passport-loader"></span><b>Загружаем академическое дело</b><p>Получаем данные из учебной системы.</p></section>`
      : academicPassportError && !passport ? `<section class="passport-state-card"><b>Не удалось открыть паспорт</b><p>${esc(academicPassportError)}</p><button class="orange-button" data-academic-refresh>Повторить загрузку</button></section>`
      : `
        <section class="passport-identity-card">
          <div class="passport-avatar">${avatarContent()}</div>
          <div class="passport-identity-copy"><span class="subtle-label">СТУДЕНТ MAGNUS</span><h2>${esc(passport?.studentName || [telegramUser.first_name,telegramUser.last_name].filter(Boolean).join(" ") || "Студент")}</h2><p>${passport?.username ? "@"+esc(passport.username) : "Профиль подтверждён Telegram"}</p></div>
          <span class="passport-status-badge ${statusClass}">${statusLabel}</span>
        </section>
        <section class="passport-summary-grid">
          <div><span>Программы</span><b>${Number(passport?.enrolledProgramsCount) || 0}</b></div>
          <div><span>Занятия завершены</span><b>${Number(passport?.completedLessons) || 0}<small> / ${Number(passport?.totalLessons) || 0}</small></b></div>
          <div><span>Общий прогресс</span><b>${Number(passport?.progress) || 0}%</b></div>
        </section>
        ${programCards ? `<section class="passport-programs"><div class="section-title"><div><span class="subtle-label">ТВОЁ ОБУЧЕНИЕ</span><h2>Зачисленные программы</h2></div><span class="course-count">${programs.length}</span></div>${programCards}</section>`
          : `<section class="passport-state-card"><span class="subtle-label">АКАДЕМИЧЕСКОЕ ДЕЛО</span><h2>${statusLabel}</h2><p>${passport?.status === "academic_leave" ? "Обучение сейчас приостановлено. Условия возвращения можно уточнить в учебной поддержке." : passport?.status === "expelled" ? "Доступ к учебному процессу приостановлен. История профиля сохранена." : "Пока нет зачисленных программ. Выбери факультет и подайся на доступную программу."}</p>${passport?.status === "applicant" ? `<button class="orange-button" data-go="faculties">Посмотреть факультеты ${icon("arrow")}</button>` : ""}</section>`}
        ${history}
        <p class="passport-legal-note">Паспорт отражает внутренние данные образовательной платформы MAGNUS. Он не является государственным документом об образовании или подтверждением аккредитации.</p>
        <div class="passport-refresh-row"><span>Данные загружаются из учебной системы</span><button data-academic-refresh>Обновить ${icon("refresh")}</button></div>
      `}
  </main>`;
}

function adminSubmissionCard(item,reviewable){
 const status=item.status==="reviewed"?"Проверено":item.status==="revision"?"На доработке":"Ожидает проверки";
 const date=item.submittedAt?new Date(item.submittedAt).toLocaleString("ru-RU",{dateStyle:"medium",timeStyle:"short"}):"Дата не указана";
 return `<article class="admin-submission" data-admin-submission="${esc(item.id)}"><div class="admin-submission-head"><div><span>${esc(item.studentName||"Студент")} · ID ${esc(item.studentId||"—")}</span><h3>${esc(assignments.find(a=>a.id===item.assignmentId)?.title||item.assignmentId)}</h3></div><span class="admin-review-status ${item.status==="reviewed"?"done":item.status==="revision"?"revision":""}">${status}</span></div><time>${date}</time><p class="admin-answer-text">${esc(item.answer||"")}</p>
 ${reviewable?`<div class="admin-review-fields"><label>Комментарий<textarea data-review-comment placeholder="Обратная связь студенту…">${esc(item.comment||"")}</textarea></label><label>Оценка<input data-review-grade type="number" min="0" max="100" step="1" placeholder="0–100" value="${item.grade??""}"></label></div><div class="admin-review-actions"><button data-review-status="revision" data-student-id="${esc(item.studentId)}" data-submission-id="${esc(item.id)}">На доработку</button><button data-review-status="reviewed" data-student-id="${esc(item.studentId)}" data-submission-id="${esc(item.id)}">Принять работу</button></div>`:item.comment?`<p class="admin-existing-comment">${esc(item.comment)}</p>`:""}</article>`;
}
function adminAuditCard(item){
 const labels={'submission.reviewed':'Проверка работы','bot.settings.updated':'Настройки бота','admin.granted':'Назначение администратора','student.message.sent':'Сообщение студенту','support.request.updated':'Статус обращения','support.request.replied':'Ответ поддержки','subscription.granted':'Выдача доступа','subscription.revoked':'Отзыв доступа','subscription.paid':'Оплата подписки','payment.plans.updated':'Настройки тарифов'};
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

 <section class="admin-academic-panel"><div class="admin-section-head"><div><span>УЧЕБНАЯ АДМИНИСТРАЦИЯ</span><h2>Академический статус</h2></div><span class="admin-academic-status status-${esc(detail.academic?.status||'applicant')}">${({applicant:'Абитуриент',active:'Обучается',academic_leave:'Академический отпуск',expelled:'Отчислен',graduated:'Выпускник'})[detail.academic?.status||'applicant']}</span></div><div class="admin-academic-controls"><label>Изменить статус<select data-admin-academic-status><option value="applicant" ${(detail.academic?.status||'applicant')==='applicant'?'selected':''}>Абитуриент</option><option value="active" ${detail.academic?.status==='active'?'selected':''}>Обучается</option><option value="academic_leave" ${detail.academic?.status==='academic_leave'?'selected':''}>Академический отпуск</option><option value="expelled" ${detail.academic?.status==='expelled'?'selected':''}>Отчислен</option><option value="graduated" ${detail.academic?.status==='graduated'?'selected':''}>Выпускник</option></select></label><label>Основание / комментарий<textarea data-admin-academic-note rows="2" maxlength="500" placeholder="Причина изменения статуса (необязательно)"></textarea></label><button class="orange-button" data-admin-academic-save data-student-id="${esc(student.telegramId)}">Сохранить статус</button></div><small class="admin-academic-hint">Выпуск доступен только после завершения всех занятий и сдачи итогового экзамена по каждой зачисленной программе. История изменений сохраняется.</small>${(detail.academic?.history||[]).length?'<div class="admin-academic-history">'+detail.academic.history.slice(0,5).map(item=>'<div><b>'+(({applicant:'Абитуриент',active:'Обучается',academic_leave:'Академический отпуск',expelled:'Отчислен',graduated:'Выпускник'})[item.to]||esc(item.to))+'</b><span>'+(item.changedAt?new Date(item.changedAt*1000).toLocaleString('ru-RU',{dateStyle:'medium',timeStyle:'short'}):'—')+' · '+esc(item.changedByEmail||'Администратор')+'</span>'+(item.note?'<p>'+esc(item.note)+'</p>':'')+'</div>').join('')+'</div>':''}</section>
 <section class="admin-gradebook"><div class="admin-section-head"><div><span>АКАДЕМИЧЕСКАЯ ВЕДОМОСТЬ</span><h2>Результаты программ</h2></div><span class="admin-count">${(detail.academic?.courses||[]).length}</span></div>${(detail.academic?.courses||[]).length?detail.academic.courses.map(course=>'<article class="admin-gradebook-course"><div class="admin-gradebook-head"><div><b>'+esc(course.title)+'</b><small>'+esc(course.faculty)+' · зачислен '+(course.enrolledAt?new Date(course.enrolledAt).toLocaleDateString('ru-RU'):'—')+'</small></div><span class="'+(course.completion?'passed':'')+'">'+(course.completion?'Завершена':'В процессе')+'</span></div><div class="admin-gradebook-progress"><i style="width:'+Math.round((course.completedLessons/course.totalLessons)*100)+'%"></i></div><div class="admin-gradebook-facts"><div><small>ЗАНЯТИЯ</small><b>'+course.completedLessons+'/'+course.totalLessons+'</b></div><div><small>СРЕДНЯЯ ПРАКТИКА</small><b>'+(course.practiceAverage===null?'—':course.practiceAverage+'/6')+'</b></div><div><small>ИТОГОВЫЙ ЭКЗАМЕН</small><b>'+(course.examPassed?'Сдан · '+course.examScore+'%':'Не сдан')+'</b></div><div><small>ПОПЫТКИ ЭКЗАМЕНА</small><b>'+course.examAttempts+'</b></div></div></article>').join(''):'<div class="admin-empty">Студент ещё не зачислен ни на одну программу.</div>'}<small class="admin-academic-hint">Ведомость строится по сохранённым результатам MAGNUS. Это внутренняя оценка платформы, не государственная аттестация и не зачётные единицы аккредитованной программы.</small></section>
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
let adminAiConfigured=false,adminAiModel='openai/gpt-oss-20b',adminAiLoading=false,adminAiError='';
function loadAdminAiSettings(){
 adminAiLoading=true;adminAiError='';if(currentPage==='admin')render();
 const called=callAdminApi('aiSettings',{},(error,result)=>{adminAiLoading=false;if(error||!result?.ok)adminAiError=error?.message||result?.message||'Не удалось загрузить настройки.';else{adminAiConfigured=Boolean(result.configured);adminAiModel=result.model||'openai/gpt-oss-20b';}if(currentPage==='admin'&&adminTab==='ai')render();});
 if(!called){adminAiLoading=false;adminAiError='Открой панель через Telegram.';if(currentPage==='admin')render();}
}
function adminAiSettingsPage(){
 return `<section class="admin-ai-settings"><div class="admin-section-head"><div><span>УЧЕБНАЯ СИСТЕМА</span><h2>Подключение Groq</h2></div><span class="admin-ai-state ${adminAiConfigured?'is-ready':''}">${adminAiConfigured?'Подключено':'Не настроено'}</span></div>
 <p>Ключ хранится только в серверной базе MAGNUS и не отправляется в интерфейс ученика. Для работы нужен API-ключ Groq.</p>
 ${adminAiLoading?'<div class="admin-loading">Проверяем настройки…</div>':adminAiError?'<div class="admin-error">'+esc(adminAiError)+'</div>':''}
 <label>API-ключ Groq<input type="password" autocomplete="new-password" maxlength="300" data-groq-key placeholder="${adminAiConfigured?'Введи новый ключ, чтобы заменить текущий':'Вставь ключ gsk_…'}"><small class="admin-ai-key-hint">${adminAiConfigured?'Ключ уже сохранён в облачной базе. Поле пустое намеренно — новый ключ нужен только для замены.':'После сохранения ключ останется на сервере и будет скрыт в интерфейсе.'}</small></label>
 <label>Модель<select data-groq-model><option value="openai/gpt-oss-20b" ${adminAiModel==='openai/gpt-oss-20b'?'selected':''}>GPT-OSS 20B · основной вариант</option><option value="openai/gpt-oss-120b" ${adminAiModel==='openai/gpt-oss-120b'?'selected':''}>GPT-OSS 120B · более мощная</option><option value="qwen/qwen3.8-27b" ${adminAiModel==='qwen/qwen3.8-27b'?'selected':''}>Qwen 3.8 27B</option></select></label>
 <div class="admin-settings-actions"><button class="orange-button" data-admin-ai-save>Сохранить подключение</button><small>Чтобы сохранить прежний ключ, оставь поле пустым и не меняй настройки.</small></div>
 <div class="admin-ai-notice"><b>Контроль ответов</b><span>Помощник ограничен материалом открытого урока и обязан сообщать, когда информации недостаточно. Это снижает риск ошибок, но не гарантирует абсолютную безошибочность.</span></div></section>`;
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
 const tabs=[["overview","Обзор"],["students","Студенты"],["reviews","Работы"],["support","Поддержка"],["payments","Оплаты"],["ai","Учебный ИИ"],["bot","Бот"],["audit","Журнал"]];
 return `<main class="screen inner-screen admin-screen"><header class="admin-header"><div><span class="admin-eyebrow">MAGNUS · CONTROL CENTER</span><h1>Управление</h1><p>${esc(data?.admin?.email||"Администратор")} · ${esc(data?.admin?.role||"admin")}</p></div><button class="admin-refresh" data-admin-refresh aria-label="Обновить данные">${icon("refresh")}</button></header>
 <nav class="admin-tabs" aria-label="Разделы панели">${tabs.map(([key,label])=>`<button class="${adminTab===key?"active":""}" data-admin-tab="${key}">${label}</button>`).join("")}</nav>
 ${adminLoading&&!data?`<div class="admin-loading">Загружаем данные MAGNUS…</div>`:""}${adminError?`<div class="admin-error" role="alert">${esc(adminError)}</div>`:""}
 ${adminTab==="overview"?`<section><div class="admin-stat-grid"><article><span>СТУДЕНТЫ</span><b>${stats.students}</b><small>Аккаунтов с учебными данными</small></article><article><span>ОТПРАВКИ</span><b>${stats.submissions}</b><small>Ответов в истории</small></article><article class="needs-review"><span>ОЖИДАЮТ ПРОВЕРКИ</span><b>${stats.pending}</b><small>Ожидают решения администратора.</small></article><article><span>РАССМОТРЕНО</span><b>${stats.reviewed}</b><small>Проверено или возвращено</small></article></div><div class="admin-section-head"><div><span>ПОСЛЕДНИЕ СОБЫТИЯ</span><h2>Учебные работы</h2></div><button data-admin-tab="reviews">Все работы ${icon("arrow")}</button></div>${items.slice(0,4).map(item=>adminSubmissionCard(item,false)).join("")||`<div class="admin-empty">Отправленных работ пока нет.</div>`}</section>`:adminTab==="reviews"?`<section><div class="admin-section-head"><div><span>ПРОВЕРКА</span><h2>Работы студентов</h2></div><span class="admin-count">${items.length}</span></div>${items.map(item=>adminSubmissionCard(item,true)).join("")||`<div class="admin-empty">Пока нет отправленных работ.</div>`}</section>`:adminTab==="students"?adminStudentsPage():adminTab==="support"?adminSupportPage():adminTab==="payments"?adminPaymentPlansPage():adminTab==="ai"?adminAiSettingsPage():adminTab==="audit"?adminAuditPage():`<section><div class="admin-bot-card"><div class="admin-bot-top"><span class="admin-bot-icon" aria-hidden="true">${brandMark()}</span><div><span>TELEGRAM BOT</span><h2>${esc(data?.bot?.firstName||"MAGNUS")}</h2><p>@${esc(data?.bot?.username||"bot")}</p></div><span class="admin-live">${data?.bot?.webhookCheckAvailable===false?"Статус недоступен":data?.bot?.webhookActive?"Webhook активен":"Webhook не настроен"}</span></div><div class="admin-bot-meta"><div><small>ОЖИДАЮТ ОБРАБОТКИ</small><b>${Number(data?.bot?.webhookPending||0)}</b></div><div><small>КОМАНД В МЕНЮ</small><b>${data?.bot?.commandsAvailable===false?"—":data?.bot?.commands?.length||0}</b></div></div>${data?.bot?.lastError?`<p class="admin-bot-warning">${esc(data.bot.lastError)}</p>`:""}</div>
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
  const pages = {home:homePage,faculties:facultiesPage,facultyDetail:facultyDetailPage,study:studyPage,courseDetail:courseDetailPage,finalExam:finalExamPage,lesson:lessonPage,assignments:assignmentsPage,assignmentDetail:assignmentDetailPage,documents:documentsPage,profile:profilePage,academicPassport:academicPassportPage,admin:adminPage};
  document.querySelector("#app").innerHTML = `${topbar()}${bottomNav()}${(pages[currentPage] || homePage)()}<div class="toast" id="toast" role="status"></div>`;
  const screen=document.querySelector("#app > main.screen");
  if(screen){screen.classList.add("screen-enter");requestAnimationFrame(()=>screen.classList.add("screen-enter-active"));}
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
  document.querySelectorAll("[data-cert-issue]").forEach(button=>button.addEventListener("click",()=>{
    if(certificateIssuePending)return;
    const courseId=button.dataset.certIssue;
    certificateIssuePending=true;render();
    callCloudStudentData("issueCertificate",{courseId},(error,result)=>{
      certificateIssuePending=false;
      if(error||!result?.ok){toast(error?.message||result?.message||"Не удалось оформить сертификат.");render();return;}
      certificates={...certificates,[courseId]:result.certificate};render();toast("Сертификат MAGNUS выдан.");
    });
  }));
  document.querySelectorAll("[data-cert-verify]").forEach(button=>button.addEventListener("click",()=>{
    const certificateId=button.dataset.certVerify;
    certificateVerification={loading:true};const url=new URL(window.location.href);url.searchParams.set("certificate",certificateId);history.replaceState({}, "", url);
    render();
    const serverless=tg?.Serverless;
    if(typeof serverless?.call!=="function"){certificateVerification={loading:false,valid:false};render();return;}
    serverless.call("studentData",{action:"verifyCertificate",certificateId},(error,result)=>{
      certificateVerification={loading:false,valid:!error&&Boolean(result?.valid),certificate:result?.certificate||null};render();
    });
  }));
  document.querySelector("[data-cert-clear]")?.addEventListener("click",()=>{
    const url=new URL(window.location.href);url.searchParams.delete("certificate");history.replaceState({}, "", url);certificateVerification=null;render();
  });

  document.querySelectorAll("[data-exam-start]").forEach(button=>button.addEventListener("click",()=>{
    const courseId=button.dataset.examStart;
    if(!telegramUser?.id){toast("Экзамен доступен при открытии MAGNUS через Telegram.");return;}
    button.disabled=true;button.textContent="Подготавливаем экзамен…";
    callCloudStudentData("startFinalExam",{courseId},(error,result)=>{
      if(error||!result?.ok){button.disabled=false;toast(error?.message||result?.message||"Не удалось открыть экзамен.");return;}
      if(result.passed){finalExams[courseId]={...(finalExams[courseId]||{}),passed:true};render();return;}
      activeExam={courseId,sessionId:result.sessionId,questions:result.questions||[]};
      currentPage="finalExam";render();window.scrollTo({top:0,behavior:"smooth"});
    });
  }));
  document.querySelector("[data-exam-submit]")?.addEventListener("click",()=>{
    if(!activeExam||examPending)return;
    const answers={};
    activeExam.questions.forEach(q=>{const checked=document.querySelector(`input[name="${CSS.escape(q.id)}"]:checked`);if(checked)answers[q.id]=Number(checked.value);});
    if(Object.keys(answers).length!==activeExam.questions.length){toast("Ответь на каждый вопрос перед отправкой.");return;}
    examPending=true;render();
    callCloudStudentData("submitFinalExam",{courseId:activeExam.courseId,sessionId:activeExam.sessionId,answers},(error,result)=>{
      examPending=false;
      if(error||!result?.ok){toast(error?.message||result?.message||"Не удалось проверить экзамен.");render();return;}
      const old=finalExams[activeExam.courseId]||{};
      finalExams[activeExam.courseId]={...old,passed:Boolean(result.result?.passed),attempts:[...(old.attempts||[]),result.result]};
      activeExam=null;currentPage="courseDetail";render();window.scrollTo({top:0,behavior:"smooth"});
      toast(result.result?.passed?"Экзамен сдан. Результат сохранён.":"Пока не зачтено. Можно подготовиться и попробовать снова.");
    });
  });

  document.querySelectorAll("[data-admin-tab]").forEach(el=>el.addEventListener("click",()=>{adminTab=el.dataset.adminTab;if(adminTab==="students")loadAdminStudents();else if(adminTab==="support")loadAdminSupport();else if(adminTab==="payments")loadAdminPaymentPlans();else if(adminTab==="ai")loadAdminAiSettings();else if(adminTab==="audit")loadAdminAudit();else render();}));
  document.querySelectorAll("[data-admin-ai-save]").forEach(button=>button.addEventListener("click",()=>{
    const keyField=document.querySelector("[data-groq-key]");
    const modelField=document.querySelector("[data-groq-model]");
    const apiKey=(keyField?.value||"").trim();
    const model=modelField?.value||"openai/gpt-oss-20b";
    if(!adminAiConfigured&&!apiKey){toast("Сначала добавь API-ключ Groq.");return;}
    if(apiKey&&!/^gsk_[A-Za-z0-9_-]{20,}$/.test(apiKey)){toast("Проверь формат ключа Groq: он должен начинаться с gsk_.");return;}
    button.disabled=true;button.textContent="Сохраняем…";
    const called=callAdminApi("saveAiSettings",{apiKey,model},(error,result)=>{
      if(error||!result?.ok){
        button.disabled=false;button.textContent="Сохранить подключение";
        adminAiError=error?.message||result?.message||"Не удалось сохранить подключение.";
        render();toast(adminAiError);return;
      }

      // Не считаем подключение готовым, пока отдельный запрос не прочитал запись обратно.
      adminAiLoading=true;adminAiError="";
      adminAiConfigured=Boolean(result.configured);adminAiModel=result.model||model;
      render();

      const verified=callAdminApi("aiSettings",{},(verifyError,verifyResult)=>{
        adminAiLoading=false;
        button.disabled=false;
        if(verifyError||!verifyResult?.ok||!verifyResult.configured||verifyResult.model!==model){
          adminAiError=verifyError?.message||verifyResult?.message||"Запись Groq прошла, но повторное чтение из базы не подтвердило настройки.";
          render();toast(adminAiError);return;
        }
        adminAiConfigured=true;adminAiModel=verifyResult.model;adminAiError="";
        render();toast("Ключ Groq сохранён и проверен в облачной базе.");
      });
      if(!verified){
        adminAiLoading=false;button.disabled=false;
        adminAiError="Не удалось повторно проверить настройки. Открой MAGNUS через Telegram.";
        render();toast(adminAiError);
      }
    });
    if(!called){button.disabled=false;button.textContent="Сохранить подключение";toast("Открой панель из Telegram.");}
  }));
  document.querySelectorAll("[data-admin-refresh]").forEach(el=>el.addEventListener("click",()=>{if(adminAccess.isAdmin)loadAdminDashboard();else loadAdminAccess(true);}));
  document.querySelectorAll("[data-admin-audit-refresh]").forEach(el=>el.addEventListener("click",loadAdminAudit));
  document.querySelectorAll("[data-admin-students-refresh]").forEach(el=>el.addEventListener("click",loadAdminStudents));

  document.querySelectorAll("[data-admin-support-refresh]").forEach(el=>el.addEventListener("click",loadAdminSupport));
  document.querySelectorAll("[data-support-status]").forEach(button=>button.addEventListener("click",()=>{
    const requestId=button.dataset.supportStatus,status=button.dataset.nextStatus;
    button.disabled=true;
    const called=callAdminApi("updateSupportRequest",{requestId,status},(error,result)=>{
      if(error||!result?.ok){button.disabled=false;toast(error?.message||result?.message||"Не удалось изменить статус.");return;}
      toast(result.message||"Статус обновлён.");loadAdminSupport();
    });
    if(!called){button.disabled=false;toast("Открой панель через Telegram.");}
  }));
  document.querySelectorAll("[data-support-reply]").forEach(button=>button.addEventListener("click",()=>{
    const requestId=button.dataset.supportReply,field=document.querySelector('[data-support-reply-text="'+requestId+'"]'),message=(field?.value||"").trim();
    if(!message){toast("Напиши ответ перед отправкой.");return;}
    button.disabled=true;button.textContent="Отправляем…";
    const called=callAdminApi("replySupportRequest",{requestId,message},(error,result)=>{
      button.disabled=false;button.textContent="Ответить";
      if(error||!result?.ok){toast(error?.message||result?.message||"Не удалось отправить ответ.");return;}
      if(field)field.value="";
      toast(result.message||"Ответ обработан.");loadAdminSupport();
    });
    if(!called){button.disabled=false;button.textContent="Ответить";toast("Открой панель через Telegram.");}
  }));

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
  document.querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", () => { currentPage = el.dataset.go; searchValue=""; if(currentPage==="admin")loadAdminDashboard(); if(currentPage==="profile")loadStudentPaymentHistory(); if(currentPage==="academicPassport")refreshAcademicPassport(); render(); window.scrollTo({top:0,behavior:"smooth"}); }));
  document.querySelectorAll("[data-academic-refresh]").forEach(button=>button.addEventListener("click",()=>{refreshAcademicPassport();}));
  document.querySelectorAll("[data-enroll-program]").forEach(button=>button.addEventListener("click",()=>enrollInProgram(button.dataset.enrollProgram,button)));
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
  document.querySelectorAll("[data-lesson-tab]").forEach(el => el.addEventListener("click", () => { lessonTab=el.dataset.lessonTab; practiceHintOpen=false; render(); }));
  document.querySelector("[data-practice-hint]")?.addEventListener("click",()=>{practiceHintOpen=!practiceHintOpen;render();});
  document.querySelector("[data-practice-answer]")?.addEventListener("input",event=>{
    lessonPracticeDrafts[selectedLessonId]=event.target.value;
    writeStudentStorage("lessonPracticeDrafts",lessonPracticeDrafts);
    scheduleCloudStudentDataSync();
  });
  document.querySelectorAll("[data-practice-send]").forEach(button=>button.addEventListener("click",()=>{
    const field=document.querySelector("[data-practice-answer]"),answer=(field?.value||"").trim(),targetLessonId=selectedLessonId;
    if(answer.length<20){toast("Добавь немного больше деталей — минимум 20 символов.");return;}
    if(answer.length>2000){toast("Ответ слишком длинный. Максимум — 2 000 символов.");return;}
    if(!telegramUser?.id){toast("Проверка практики доступна при открытии MAGNUS из Telegram.");return;}
    if(practicePending)return;
    practicePending=true;render();
    const called=callTutorApi({lessonId:targetLessonId,mode:"practice_review",message:answer},(error,result)=>{
      practicePending=false;
      if(error||!result?.ok){
        if(currentPage==="lesson"&&selectedLessonId===targetLessonId)render();
        toast(error?.message||result?.message||"Не удалось проверить ответ. Черновик сохранён.");
        return;
      }
      const reviewText=String(result.answer||"").trim();
      if(reviewText.length<20){
        if(currentPage==="lesson"&&selectedLessonId===targetLessonId)render();
        toast("Разбор получен в неполном виде. Попробуй отправить ответ ещё раз.");
        return;
      }
      const assessment=result.assessment;
      if(!assessment?.scores||!Number.isInteger(Number(assessment.totalScore))){
        if(currentPage==="lesson"&&selectedLessonId===targetLessonId)render();
        toast("Проверка не вернула оценку по критериям. Попробуй ещё раз.");
        return;
      }
      const saved=callCloudStudentData("savePracticeReview",{lessonId:targetLessonId,answer,feedback:reviewText,assessment},(saveError,saveResult)=>{
        if(saveError||!saveResult?.ok){
          if(currentPage==="lesson"&&selectedLessonId===targetLessonId)render();
          toast(saveResult?.message||"Не удалось сохранить результат в учебном профиле.");
          return;
        }
        lessonPracticeResults[targetLessonId]=JSON.stringify(saveResult.result||{answer,feedback:reviewText,reviewedAt:new Date().toISOString(),attempts:1});
        lessonPracticeDrafts[targetLessonId]="";
        writeStudentStorage("lessonPracticeResults",lessonPracticeResults);
        writeStudentStorage("lessonPracticeDrafts",lessonPracticeDrafts);
        scheduleCloudStudentDataSync();
        if(currentPage==="lesson"&&selectedLessonId===targetLessonId)render();
        toast("Разбор проверен и сохранён в учебном профиле.");
      });
      if(!saved){
        if(currentPage==="lesson"&&selectedLessonId===targetLessonId)render();
        toast("Не удалось связаться с учебной системой. Черновик сохранён.");
      }
    });
    if(!called){practicePending=false;render();toast("Открой MAGNUS через Telegram.");}
  }));
  document.querySelectorAll("[data-tutor-send]").forEach(button=>button.addEventListener("click",()=>{
    const field=document.querySelector("[data-tutor-input]"),question=(field?.value||"").trim();
    if(question.length<2){toast("Напиши вопрос по уроку.");return;}
    if(question.length>1200){toast("Вопрос слишком длинный.");return;}
    if(!telegramUser?.id){toast("Учебная помощь доступна при открытии MAGNUS из Telegram.");return;}
    if(tutorPending)return;
    tutorPending=true;render();
    const history=(tutorChats[selectedLessonId]||[]).slice(-6);
    const called=callTutorApi({lessonId:selectedLessonId,message:question,history},(error,result)=>{
      tutorPending=false;
      if(error||!result?.ok){render();toast(error?.message||result?.message||"Не удалось получить объяснение.");return;}
      tutorChats[selectedLessonId]=[...history,{role:"user",content:question},{role:"assistant",content:result.answer}].slice(-12);
      writeStudentStorage("tutorChats",tutorChats);
      render();
      const box=document.querySelector(".lesson-tutor-messages");if(box)box.scrollTop=box.scrollHeight;
    });
    if(!called){tutorPending=false;render();toast("Открой MAGNUS через Telegram.");}
  }));
  document.querySelector("[data-tutor-input]")?.addEventListener("keydown",event=>{
    if(event.key==="Enter"&&(event.ctrlKey||event.metaKey)){event.preventDefault();document.querySelector("[data-tutor-send]")?.click();}
  });
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
        ? "Черновик сохранён. Отправка на проверку пока не подключена."
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
      const lessonId = selectedLessonId;
      let savedQuiz = null;
      try { savedQuiz = JSON.parse(lessonQuizResults[lessonId] || "null"); } catch {}
      const answerIndex = quizChoice !== "" ? Number(quizChoice) : Number(savedQuiz?.choice);
      if (!savedQuiz?.correct && quizChoice !== String(selectedLesson()?.[11])) {
        toast("Сначала ответь правильно на контрольный вопрос.");
        return;
      }
      if (!telegramUser?.id) {
        toast("Подтверждение прохождения доступно при открытии MAGNUS через Telegram.");
        return;
      }
      el.disabled = true;
      el.textContent = "Подтверждаем…";
      const called = callCloudStudentData("completeLesson", { lessonId, answerIndex }, (error, result) => {
        if (error || !result?.ok) {
          toast(result?.message || "Не удалось подтвердить занятие. Попробуй ещё раз.");
          render();
          return;
        }
        completedLessons = { ...completedLessons, [lessonId]: result.completedAt || new Date().toISOString() };
        if (result.completedLessons && typeof result.completedLessons === "object") {
          completedLessons = { ...completedLessons, ...result.completedLessons };
        }
        storeCompletedLessons();
        toast("Занятие завершено. Следующий этап открыт.");
        render();
      });
      if (!called) {
        render();
        toast("Не удалось связаться с учебной системой.");
      }
      return;
    }
    const infoActions = {
      notifications: ["Уведомления", "Здесь будут появляться новые задания, результаты и важные обновления. Пока уведомлений нет."],
      settings: ["Настройки", "Настройки внешнего вида и предпочтений пока не подключены. Основные учебные данные сохраняются в профиле."],
      support: ["Поддержка", "Канал поддержки MAGNUS пока не подключён. Не отправляй сюда пароли, платёжные данные или другую конфиденциальную информацию."],
      about: ["О MAGNUS", "MAGNUS — цифровая учебная среда. Знания открывают возможности. Сертификаты подтверждают прохождение внутренних программ, а не государственную квалификацию."]
    };
    const infoAction = infoActions[el.dataset.action];
    if (infoAction) { openInfoModal(infoAction[0], infoAction[1]); return; }
    const actions = {course:"Раздел курсов пока демонстрационный.", "course-start":"Видеоурок пока недоступен."};
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

function closeInfoModal() {
  document.querySelector(".info-modal-backdrop")?.remove();
  document.removeEventListener("keydown", handleInfoModalKeydown);
}

function handleInfoModalKeydown(event) {
  if (event.key === "Escape") closeInfoModal();
}

function openInfoModal(title, message) {
  closeInfoModal();
  document.body.insertAdjacentHTML("beforeend", `
    <div class="info-modal-backdrop" role="presentation">
      <section class="info-modal-panel" role="dialog" aria-modal="true" aria-labelledby="info-modal-title">
        <button class="info-modal-close" type="button" data-modal-close aria-label="Закрыть">${icon("close")}</button>
        <span class="subtle-label">MAGNUS · ИНФОРМАЦИЯ</span>
        <h2 id="info-modal-title">${esc(title)}</h2>
        <p>${esc(message)}</p>
        <button class="info-modal-confirm" type="button" data-modal-close>Понятно</button>
      </section>
    </div>
  `);
  const overlay = document.querySelector(".info-modal-backdrop");
  overlay?.addEventListener("click", event => { if (event.target === overlay) closeInfoModal(); });
  overlay?.querySelectorAll("[data-modal-close]").forEach(button => button.addEventListener("click", closeInfoModal));
  document.addEventListener("keydown", handleInfoModalKeydown);
  overlay?.querySelector(".info-modal-close")?.focus();
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
  const root = document.body;
  if (!root) return;
  root.insertAdjacentHTML("afterbegin", `
    <div class="startup-screen" role="status" aria-label="Загрузка MAGNUS">
      <div class="startup-inner">
        <div class="startup-orbit startup-orbit-one"></div><div class="startup-orbit startup-orbit-two"></div>
        <span class="startup-spark startup-spark-one">✦</span><span class="startup-spark startup-spark-two">✧</span>
        <div class="startup-owl-wrap"><span class="startup-owl-halo"></span><img class="startup-owl" src="${magnusOwl3d}" alt="" /></div>
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
  }, 2100);
}

showStartupScreen();
render();
if(currentPage==="admin")loadAdminAccess(true);else loadAdminAccess(false);
loadPaymentPlans();
triggerStartupHaptic();
initializeCloudStudentData();
const sharedCertificateId = new URLSearchParams(window.location.search).get("certificate");
if (sharedCertificateId) {
  certificateVerification = { loading: true };
  const serverless = tg?.Serverless;
  if (typeof serverless?.call === "function") {
    serverless.call("studentData", { action: "verifyCertificate", certificateId: sharedCertificateId }, (error, result) => {
      certificateVerification = { loading: false, valid: !error && Boolean(result?.valid), certificate: result?.certificate || null };
      render();
    });
  } else {
    certificateVerification = { loading: false, valid: false };
  }
  render();
}