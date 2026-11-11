# MAGNUS University

Разработка образовательной Telegram Mini App MAGNUS.

## Документация проекта

- **[Главная карта разработки университета](docs/MASTER_ROADMAP.md)** — полный план, порядок этапов, статусы, правила одной активной задачи и критерии завершения.
- **[Текущее состояние проекта](docs/PROJECT_STATE.md)** — ветка, последний проверенный релиз, реализованные модули, ограничения и следующий WP.

## Главное правило

Работа ведётся по одной задаче за раз. Не переходить к следующей задаче, пока текущая не реализована, не протестирована, не опубликована, не проверена и не отмечена завершённой в карте и состоянии проекта.

## Техническая информация

- Рабочая ветка: `magnus-source-upload`.
- Mini App: https://app9020486965.tgcloud.ai/
- Frontend: Vite + JavaScript.
- Backend: Telegram Serverless.
- Deploy: GitHub Actions, workflow `.github/workflows/deploy-telegram.yml`.
- Visual QA: GitHub Actions, workflow `.github/workflows/visual-check.yml`.

Перед любой работой читать оба документа в `docs/`. Документы имеют приоритет над старыми сообщениями в чате.
