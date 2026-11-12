# MAGNUS — текущее состояние проекта

> Перед продолжением всегда сверять этот файл с [главной картой](MASTER_ROADMAP.md), фактическим HEAD ветки и последними GitHub Actions. Сам SHA текущего HEAD не дублируется в этой записи: он должен проверяться по живому ref, иначе файл быстро становится источником устаревших данных.

## 1. Общая информация

- **Продукт:** MAGNUS International University — цифровая образовательная среда.
- **Репозиторий:** https://github.com/Gennzy/magnus-mini-app
- **Рабочая ветка:** `magnus-source-upload`.
- **Запрет:** не работать в `main`.
- **Mini App:** https://app9020486965.tgcloud.ai/
- **Стек:** Vite, vanilla JS/CSS, Telegram WebApp, Telegram Serverless endpoints/DB.
- **Дата обновления:** 12 ноября 2026 года.

## 2. Текущий HEAD и публикация

- **Последний runtime commit:** `af6f2198cf9f971e8464a07ce664147e9ffa7689` — улучшена читаемость учебной карты на ширине 320–380 px и добавлены регрессионные assertions минимального размера текста/скрытия повторных статусов.
- **Полный visual CI:** [run 43200405223](https://github.com/Gennzy/magnus-mini-app/actions/runs/43200405223), HEAD `af6f2198cf9f971e8464a07ce664147e9ffa7689` — SUCCESS. Успешно прошли docs checker и negative tests, tutor coverage, payment invariants, backend syntax, production build, desktop/mobile Playwright и загрузка screenshot artifacts.
- Предыдущий CSS-only проход [run 43200361754](https://github.com/Gennzy/magnus-mini-app/actions/runs/43200361754), commit `7b7cec57f62f38d2f13a1fec5d2cb9e220e49f28` — SUCCESS; итоговый run выше включает также новые browser assertions.
- **Последний подтверждённый Telegram Cloud deploy:** [run 43082656469](https://github.com/Gennzy/magnus-mini-app/actions/runs/43082656469), attempt 3, job `130765932123`; deployment logs подтверждают checkout SHA `fa6ac75b49a5a4be4eecfead1f401f1895a5515d`, production build, загрузку новых JS/CSS assets и успешный `tgcloud push`. Safe migrations: schema in sync, изменений схемы не было.
- Runtime commit `af6f2198` пока **не опубликован** в Telegram Cloud. Deployment workflow остаётся manual-only; для нового runtime релиза требуется ручной запуск [deploy-telegram.yml](https://github.com/Gennzy/magnus-mini-app/actions/workflows/deploy-telegram.yml) с веткой `magnus-source-upload`. GitHub Pages не используется.
- После каждого коммита проверять новые Actions; статус запуска не равен успешному завершению.

## 3. Продукт и действующие ограничения

### Каталог
- Единый источник: `tgcloud/lib/academicCatalog.js` (`ACADEMIC_CATALOG`).
- Подключены три демонстрационные программы: AI (`ai`), психология (`mind`) и маркетинг (`brand`).
- В каждой программе шесть занятий, всего 18 демонстрационных занятий.
- Остальные факультеты — витрина/заготовки; активных программ там нет.
- Это не полноценные многосеместровые программы и не аккредитованная квалификация.

### Учебный процесс
- Студент зачисляется на программу через серверный endpoint.
- Сервер проверяет зачисление, принадлежность занятия программе, последовательность, quiz и выполнение требований практики.
- Прогресс, результаты и академический паспорт строятся по серверным записям.
- Применяется последовательное открытие учебных шагов.
- Текущий каталог и идентификаторы программ/уроков нельзя менять без отдельной миграционной стратегии.

### AI и оценивание
- AI-тьютор работает через `tgcloud/endpoints/tutor.js`; ключ Groq остаётся на сервере.
- Проверка практики использует критерии relevance/completeness/reasoning (0–2 каждый), текущий проходной результат — 4/6 при отсутствии нулей.
- AI-оценивание не является независимой человеческой экспертизой; AI нельзя выдавать за конкретного человека.
- Итоговые экзамены и выпуск внутренних сертификатов проверяются сервером.
- Сертификат MAGNUS — внутренний документ о прохождении программы, не государственный диплом и не доказательство аккредитации.

### Студент и интерфейс
- Telegram-профиль использует имя, username и аватар из Telegram.
- Академический паспорт STU-003 проверен пользователем в Telegram: гостевое состояние «Абитуриент», отсутствие зачислений и нулевые показатели отображаются ожидаемо.
- Основные интерфейсные разделы и учебный маршрут существуют; визуальная система и отдельные экраны остаются предметом будущих UX-WP.

### Администрация и платежи
- Существуют инструменты списка студентов, карточки, gradebook, академического статуса, обращений и настроек AI.
- Реализованы сущности тарифов/подписок, Stars checkout, история заказов и административный реестр.
- Тарифы не включены для реальных продаж; полный end-to-end платёжный сценарий не подтверждён.
- BL-008 (восстановление заказа в processing) и BL-009 (повторное использование незавершённого счёта) остаются блокерами включения продаж.

## 4. Завершённые Work Packages

- **PROD-006 — DONE:** правила зачёта практики, занятия, дисциплины, учебного блока и программы, обязательных/optional дисциплин, повторных попыток и версионирования зафиксированы в `docs/ASSESSMENT_AND_COMPLETION_POLICY.md`; документационный checker и негативный тест добавлены. Полный CI [run 43024279012](https://github.com/Gennzy/magnus-mini-app/actions/runs/43024279012), SHA `00318e136efcf4a068878389c3709efd258a43a1` — SUCCESS.

- **GOV-001…GOV-007 — DONE:** карта разработки, состояние проекта, правило одной активной задачи, документационный CI, шаблон WP, ADR и реестр известных дефектов.
- **STU-003 — DONE:** академический паспорт, серверная авторизация по Telegram initData и проверенное пользователем гостевое состояние.
- **PROD-003 — DONE:** жизненный цикл описан в `docs/STUDENT_LIFECYCLE.md`; checker исправлен на точное сопоставление ID, негативный регрессионный тест добавлен. Полный CI [run 43002543794](https://github.com/Gennzy/magnus-mini-app/actions/runs/43002543794) прошёл.
- **PROD-004 — DONE:** модель академических статусов и переходов описана в `docs/ACADEMIC_STATUS_MODEL.md`; глобальное поле статуса заменяется в целевой архитектуре программными состояниями и вычисляемой сводкой. Документационный checker и негативный тест добавлены. Полный CI [run 43005437660](https://github.com/Gennzy/magnus-mini-app/actions/runs/43005437660) прошёл.
- **PROD-005 — DONE:** правила асинхронной активности зафиксированы в `docs/LEARNING_ACTIVITY_MODEL.md`; квалифицирующие события, исключения, переход `enrolled → active`, last activity и границы аналитики описаны. Документ добавлен в checker и тест отсутствующей модели. Полный CI [run 43006927304](https://github.com/Gennzy/magnus-mini-app/actions/runs/43006927304) прошёл.
- **PROD-001 — DONE:** позиционирование и аудитории зафиксированы в `docs/PRODUCT_POSITIONING.md`; финальный CI run [42984319752](https://github.com/Gennzy/magnus-mini-app/actions/runs/42984319752) прошёл.

- **PROD-009 — DONE:** политика сертификатов, фактические ограничения runtime, публичная проверка, персональные данные и требования к будущей реализации оформлены; checker и негативные тесты добавлены. Финальный полный visual CI [run 43052954058](https://github.com/Gennzy/magnus-mini-app/actions/runs/43052954058), SHA `96252feda564d2ff8fbccc6d30aa9e31a4698fcd` — SUCCESS.

Подробная последовательность и оставшиеся задачи — в `docs/MASTER_ROADMAP.md`.

## 5. Текущая активная задача

**Текущий WP: UX-001 — полный аудит и исправление интерфейса MAGNUS.**

**Активная задача:** UX-001 — WP: docs/work-packages/UX-001.md.

**PROD-010 — юридическая проверка публичной модели MAGNUS:**
- **Статус:** приостановлена по приоритету владельца, не закрыта и не отменена.
- Первичное исследование, карта потоков данных, инфраструктурный checklist и стоп-условия сохранены в docs/LEGAL_COMPLIANCE_REVIEW.md и docs/work-packages/PROD-010.md.
- Неизвестные факты (рынок, продавец, TGCloud region, Groq ZDR/DPA) остаются открытыми. Реальные продажи запрещены до завершения правовой и платёжной проверки.
- Возврат к PROD-010 — после закрытия UX-001 либо по отдельному решению владельца.

## 5.1. Активный WP — UX-001
- **Статус:** [~] In progress; первый runtime-этап главной подготовлен, полный визуальный аудит остальных экранов продолжается.
- **WP:** docs/work-packages/UX-001.md.
- **Причина:** пользователь показал воспроизводимые визуальные проблемы в Telegram Desktop и потребовал комплексно исправить интерфейс и фирменного маскота.
- **Подтверждённые проблемы:** повтор бренда в верхней зоне, слабая иерархия приветствия, дисбаланс размеров/отступов, перегруженная карточка продолжения обучения, несогласованная палитра совы. Остальные экраны требуют инвентаризации.
- **Первый runtime-этап:** в Telegram WebApp скрыта внутренняя дублирующая шапка; приветственный блок получил нейтральную подпись и защиту длинного имени; карточка продолжения переработана для узкого экрана; палитра совы смещена из холодного фиолетового в приглушённые тёплые оттенки. Требуется проверка скриншотами на фактических размерах Telegram Desktop/iPhone; фильтр изображения — временная цветокоррекция, не финальная замена материалов модели.
- **Следующий точечный этап маскота:** при прямой проверке встроенного WebP обнаружено, что источник содержит сильный фиолетовый неон; слабая сепия не меняла его характер. Временная цветокоррекция усилена в следующем runtime-коммите. Не считать это финальной моделью: UX-003 должен заменить/переработать исходный арт после фиксации общей палитры.
- **Аудит артефактов CI #208/#209:** нижняя навигация перекрывала содержимое на длинных mobile-экранах; она переведена в поток перед экраном на всех ширинах и остаётся sticky под верхней оболочкой. Playwright теперь проверяет геометрию навигации и отсутствие горизонтального overflow на основных экранах и ширинах 320/360/430/768/1024/1440 px. Исходный фиолетовый маскот переведён в более нейтральную тёплую сепию; финальная модель остаётся UX-003.
- **CI #210:** `54ae223179e0dd572d87099ba2c72c4f121fce07` — SUCCESS; скриншоты показали корректное размещение sticky-навигации на mobile/desktop. Найдены и исправляются два дополнительных дефекта: сырой шаблон в пустом состоянии сертификатов и несовпадающие splash/dashboard-версии совы. В CI добавлены проверки общего источника маскота и SVG-иконок профиля.
- **Области аудита:** главная, каталог, обучение, задания, профиль, уведомления, модальные окна, сертификат, состояния loading/empty/error/success, нижняя навигация и desktop/mobile.
- **CI:** подготовительный commit `e1fbd1a7c08b918e06da6b3bdef92ccb0624f304` — visual CI run 43061042493 SUCCESS. Предыдущий run 43060393545 завершился failure на negative test checker; дефект исправлен в следующем commit.
- **Последняя завершённая задача:** PROD-009; финальный CI run 43053195367, SHA 2dab18322c2bcf3d176363d6e8bc68fd2a3032d7 — SUCCESS.

## 6. Как продолжать в новом чате

1. Прочитать `MASTER_ROADMAP.md`, `PROJECT_STATE.md` и `WP_TEMPLATE.md`.
2. Проверить фактический HEAD именно ветки `magnus-source-upload` и последние Actions.
3. Продолжить ровно текущий WP; не перескакивать на следующий и не начинать боковые улучшения.
4. Сверять факты по коду и данным; не просить пользователя повторить то, что можно проверить в репозитории.
5. Не менять `main`, не публиковать секреты и не выполнять Telegram deploy для документационных изменений.

- **CI #211:** SHA `04d341d52384b9c976747b2a9b9ed22c123e88af` — FAILURE только на новом Playwright ожидании splash; все шаги до browser-check SUCCESS. Причина: проверка заставки выполнялась после DOMContentLoaded, и splash мог исчезнуть по таймеру 1,65 секунды. Тест изменён на раннее ожидание после `commit`; повторный CI обязателен.

- **CI #212:** SHA `48f6e7066050f78a92429981af33674ca64c3293` — FAILURE на том же ожидании splash; сборка и все проверки до Playwright SUCCESS. Исправление теста: один раз удержать startup overlay через init script на первом открытии, снять скриншот и удалить overlay только в тестовом контексте. Повторные reload сохраняют штатный таймер.

- **CI #213:** SHA `fb2b3b736975be95b377e3aa94aeb4b123de023d` — FAILURE на ожидании splash. Причина уточнена: асинхронный `render()` очищал `#app`, внутри которого находилась заставка. В runtime исправляется точка монтирования на `document.body`; в тесте overlay удаляется только после проверки и после reload.

- **CI #214:** SHA `f8219a90de61661136c5e534f541abc711788b68` — FAILURE на ожидании splash даже после переноса overlay в `document.body`. Дополнительная причина: splash запускался после первого `render()`. Вызов перенесён перед рендером; длительность показа увеличена до 2,1 секунды, чтобы тест и пользователь успевали увидеть заставку.

- **UX-001 / дополнительные UI-исправления:** пустое состояние сертификатов выводит корректную SVG-стрелку; заставка и главная используют один 3D WebP-маскот; настройки/уведомления/поддержка/о MAGNUS открывают доступные информационные диалоги вместо placeholder-toast; профиль использует SVG-иконки; убран ложный `⌘ K` без реализации shortcut.

- **CI #216:** `3e7a731f51b21c037f8dbfe8b727f62f46c9e9bc` — SUCCESS. Проверены все основные student-facing экраны, профильные SVG-иконки и четыре информационных диалога; ложный keyboard hint удалён. Следующий проход расширяет покрытие страницы «Мои программы» и всех способов закрытия диалогов.

- **CI #217:** `39c2076bc41c2491d80b31847eff45734170a0a9` — SUCCESS. Экран «Мои программы» и закрытие диалогов по Escape/фону/кнопке прошли на mobile/desktop. Следующий проход проверяет итоговый экзамен через изолированный mock Telegram Serverless, не используя реальные аккаунты или данные.

- **CI #218:** SHA `fe023e2cce45145ca41e9c2d72b096c5872d6680` — FAILURE только из-за неоднозначного Playwright-селектора на двух кнопках курса AI в study-screen. Тест уточнён до последней кнопки каталога; сборка, docs, tutor, payment и backend syntax прошли.

- **CI #219:** `d9e9369cd31cdf334b8bdfc4b773cebb9bc23029` — SUCCESS. Тестовый Telegram Serverless открыл итоговый экзамен: 6 вопросов, 18 вариантов ответа, без реального аккаунта. Для корректного снимка и проверки навигации добавлен возврат scrollY к нулю и геометрическая проверка sticky-nav перед скриншотом.

- **CI #220:** `d1267f03a99c5ef0e097fff9bf8bb8c0dc159234` — SUCCESS. Telegram-режим: экран экзамена не имеет горизонтального overflow; sticky-навигация геометрически отделена от основного содержимого. Следующий тестовый проход покрывает отправку ответов и экран успешной сдачи.

- **CI #221:** `93ef18ae8bab49d71b851bbb36deb0d6c2a4cb31` — SUCCESS. Итоговый экзамен проверен end-to-end в mock Telegram: 6 ответов, отправка, возврат к программе, отображение 100% и статуса «Экзамен сдан». В UX-001 добавлена проверка admin control center: 8 вкладок на mobile и desktop через изолированный owner mock.

- **CI #222:** `5a340ec4f5a22d160ac75d95f6cde09def4391f9` — SUCCESS. Все 8 admin tabs прошли Playwright на 390 и 1440 px. Визуальный артефакт выявил слишком высокую 2×4 сетку вкладок на mobile; она заменена горизонтальной лентой, тест проверяет overflow-x/nowrap и возможность прокрутки.

- **CI #223:** `43d863826f9fc7e5803468ba7acf876f3653fb18` — SUCCESS. Мобильная админ-навигация стала горизонтальной лентой, все 8 вкладок доступны через прокрутку. Следующий проход унифицирует текст: удаляет ложные упоминания человеческих преподавателей и ручной проверки из student/admin интерфейса, проверка этого ограничения добавлена в Playwright.

- **CI #224:** `a7520f3e879dbb44dfdd00f3bc6c7381c8fb82d1` — SUCCESS. Тексты student/admin UI очищены от упоминаний человеческих преподавателей; Playwright проверяет это в карточке факультета, деталях задания и admin overview. По скриншотам обнаружен монограммный M в карточке бота; он заменяется общим SVG-маркером совы из шапки.

- **CI #225:** `6ecbcf19a3dea1ce7fae1b39576e1b59767c8da2` — SUCCESS. Общий SVG-маркер совы унифицирован в шапке и карточке Telegram-бота.
- **UX-001 / следующий этап:** Playwright расширен с проверки только главной на матрицу 320/360/430/768/1024 px для десяти student-facing экранов: home, study, catalog, faculty detail, assignments, assignment detail, profile, documents, course map и lesson. На каждом экране проверяются горизонтальное переполнение и отсутствие пересечения нижней навигации с контентом; на 320 px формируются отдельные скриншоты. Изменения ожидают CI #226; Telegram deploy не запускался.

- **CI #226:** SHA `1a2df23d8ba6fa399a528eafd68267600206a8dd` — FAILURE из-за ложных navigation-overlap assertions: `main.screen` включал внутренние отступы/трансформации, а после smooth scroll измерение делалось не в начале страницы. Скриншоты подтверждают отсутствие видимого перекрытия в части отмеченных случаев. Исправлено: мгновенный scroll-to-top перед замером и измерение первого содержательного элемента. Повторный CI обязателен.

- **CI #227:** `84a3118e00a7b93ad28617ed1f0008e7256c3ec0` — SUCCESS. Десять student-facing экранов прошли responsive-матрицу 320/360/430/768/1024 px: нет горизонтального overflow и подтверждённого перекрытия навигацией. Геометрия измеряется по первому содержимому блоку после возврата scrollY к нулю. Далее добавляются focus/touch/reduced-motion/iOS input проверки.

- CI #228: ea572f9e37bcfa7d91d55596028edad1b8a3656c — SUCCESS. Добавлены проверки keyboard focus, навигационных hit targets, reduced motion и 16px textarea ответа задания.
- UX-001 / визуальная ревизия #228: screenshot-артефакты просмотрены для mobile home, 320px home/course map/lesson и admin desktop. Горизонтального overflow не выявлено. Точечные дефекты: каталог-search на mobile имел 14px, недостаточная высота filter/back targets, визуально излишне серый тон 3D-совы. Исправлены размеры контролов и усилен тёплый бронзовый тон.
- UX-001 / CI #229: добавлен Telegram WebApp mock с длинным first_name и загруженным avatar photo_url для проверки home/profile, отсутствия внутренней шапки и переноса имени. Дополнительно проверяются 16px search/practice/notes fields и 44px filter/back targets. Результат ожидается; реальный iPhone/Telegram остаётся ручной проверкой.

- **CI #229:** `0d81a1babdda57b5daeb85f2306b172bd3d6c357` — SUCCESS. Telegram mock прошёл с длинным именем, загруженным photo_url, без внутренней шапки; мобильные input/hit targets прошли. Визуальный screenshot был частично закрыт заставкой, поэтому Telegram screenshot-test теперь ожидает естественное исчезновение splash.
- **UX-001 / найдено по артефактам #229:** профиль принудительно обрезал длинное Telegram-имя через nowrap/ellipsis; исправлено на перенос текста с отдельной проверкой scrollHeight/clientHeight. В standalone режиме второй home-avatar дублировал topbar avatar — скрывается вне Telegram. Метрика «Черновики» повторялась в двух соседних блоках главной — верхняя метрика заменена числом зачисленных программ; drafts остаются только в статистике заданий.

- CI #230: 92cff245a0e629e4aad03fcd99f00be09e7becd0 — FAILURE только на assertion приветствия: вертикальная метрика scrollHeight превышала clientHeight на 3 px при корректном word wrap; screenshot показывает полное имя, без горизонтального overflow. Остальные проверки прошли.
- UX-001 / корректировка после #230: mobile Telegram profile card перестраивается в grid (avatar слева, имя справа, Telegram badge ниже), чтобы длинное имя не сжималось до 5–6 символов в строке. Проверка сохраняет критерии отсутствия ellipsis/горизонтального обрезания, с tolerance 4px для line-box округления. В Playwright screenshot capture введена пауза 400ms после навигации/вкладок, соответствующая max 340ms CSS screen transition.

- **CI #231:** `8e20ca4cdcd837d82d0593041bb63b483e39c7af` — SUCCESS. Mobile Telegram profile grid, длинное имя, анимационно-стабильные screenshot captures и full browser smoke прошли.
- **UX-001 / визуальный контроль #231:** проверены Telegram home/profile, mobile lesson/catalog и 320px guest profile; переполнение и обрезание длинного имени устранены.
- **UX-001 / маскот:** splash и dashboard ранее имели разную насыщенность/сепию. В текущем коммите обе используют единый CSS token --magnus-owl-color-filter; Playwright контролирует идентичность общей цветовой обработки.

- **UX-001 / расширение certificate smoke:** добавлены изолированные Playwright-сценарии loading/valid/invalid public verification; проверяются вывод имени/программы/даты/score/serial, отсутствие ложного valid badge, очистка query при закрытии и отсутствие горизонтального переполнения. Данные синтетические.

- **CI #233:** `d1a163ebc8f03134ce005b05382da106c2e14591` — SUCCESS. Shared owl color filter и полная проверка certificate loading/valid/invalid/close query flow прошли.
- **UX-001 / desktop mascot correction:** screenshot #233 показал, что 3D owl stage занимал около 39% карточки и 270px высоты; нижняя часть персонажа обрезалась, подпись пересекала изображение. Desktop/tablet stage уменьшен до min(34%,300px) × 224px, text column ограничена 54%, декоративная подпись скрыта; мобильная сцена остаётся прежней. Playwright теперь контролирует stage/image/card/copy geometry на desktop и пяти responsive widths.

- **UX-001 / primary navigation regression (2026-11-11):** confirmed root cause was a late CSS override that pinned `.bottom-nav` to the top of its document-flow position (`sticky; top:70px`, Telegram overrides to 8px/0px). Corrected to a bottom-fixed navigation with safe-area padding and document clearance; Playwright assertions now check bottom anchoring rather than the obsolete sticky-before-content layout. Awaiting full CI and Telegram deploy confirmation.

- **UX-001 / navigation and desktop mascot regression (2026-11-11):** CI #239 exposed fixed nav height expanding to 992px in admin desktop, missing desktop bottom inset at 768/1024/1440 widths, and owl image overflowing its stage/card despite the stage geometry check. Final CSS now hard-constrains navigation height (72px desktop, 68px + safe area mobile), anchors desktop nav 16px from the viewport edge and mobile nav flush to the safe-area-aware bottom, reserves scroll clearance, and absolutely constrains the owl image to its stage with object-fit containment. Awaiting new visual CI.

- **UX-001 / profile menu + certificate visual QA (2026-11-11):** visual screenshot review found the “Поддержка” row losing its copy because the help SVG path's d attribute lacked its closing quote; browser HTML parsing swallowed the following span/arrow. Fixed the SVG string, gave all five profile menu copy spans an explicit menu-copy class with a stable grid column, and added a Playwright assertion for five visible titles/descriptions. Certificate smoke now reads the loading label before the delayed mock response and waits for the startup overlay to detach only before final screenshots. Visual smoke run [43085158944](https://github.com/Gennzy/magnus-mini-app/actions/runs/43085158944) checked out branch HEAD 0c49cd43d7b5b22c034863f8517398a4703a1524 and completed SUCCESS across desktop/mobile, admin, responsive matrix and certificate states. TGCloud publication of this HEAD still requires confirmation.

- **UX-001 / course-map completion copy (2026-11-11):** screenshot review found the route finish caption always claimed all lessons were completed, even at 0/6 progress. `courseDetailPage()` now derives caption and finish marker state from `courseCompletionCount`: empty shows the number of upcoming lessons, partial shows completed/remaining counts, and 100% confirms route completion. Playwright seeds isolated guest storage for 0/6, 2/6 and 6/6, verifies caption, percentage, marker class and relevant continuation/completion panel. Full visual CI [run 43086666904](https://github.com/Gennzy/magnus-mini-app/actions/runs/43086666904), HEAD `af42153a421c695227adcd90d0f5f70d09f1ed5e` — SUCCESS. TGCloud release of this runtime HEAD is the next release step.
