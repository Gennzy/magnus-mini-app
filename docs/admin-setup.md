# MAGNUS administrator access

## What is included

- `/admin` is handled in the bot's private chat and opens the administrator workspace.
- Administrator access is stored in `admin_users`; it is not inferred from a Telegram username or an ID supplied by a client.
- The first owner link is created from the project owner's local Telegram Cloud CLI session.
- The Mini App calls `POST /api/admin`; the endpoint uses platform-verified `ctx.initData.user` and checks the administrator table on every privileged action.
- Administrators can review student submissions, add a comment, set a 0–100 score, accept a submission or return it for revision.
- The **Журнал** tab stores administrator actions: review decisions, bot-setting changes, and owner grants. It records metadata and delivery outcomes, not the full student answer or the text of private bot settings.
- The **Студенты** tab lists Telegram accounts that have opened the Mini App and synchronized cloud data. It includes a searchable profile, activity timestamps, saved lesson markers, quiz attempts and assignment history.
- Student profiles include a one-to-one message composer. Outgoing bot messages are stored with the admin identity, timestamp, Telegram message ID when available, and the Bot API send result. The full text is visible to administrators in that student's message history.
- Student profiles also include manual access management: grant or extend access for 7, 30, 90 or 365 days, or revoke the current access. Each change is stored in `student_subscriptions` and added to the administrator audit log. A still-active grant is extended from its existing end date rather than shortened.
- The bot section reports webhook state and lets the owner edit the `/start` greeting, bot descriptions and Mini App menu-button text. Settings are stored in `bot_settings` and applied to Telegram.

## Connect the first owner

1. Deploy the current source and run `/start` in a private chat with the bot.
2. Send `/admin`. Until the owner is linked, the bot replies with the Telegram ID of the person who sent the command. This only identifies the account; it does not grant access. Once linked, `/admin` sends a Mini App launch button for the admin route.
3. In the local project directory, run the CLI-only grant action. Replace both values with the owner's verified account email and the ID shown by the bot:

```powershell
npx tgcloud run endpoints/admin '{"action":"grantAdmin","email":"OWNER_EMAIL","telegramId":"TELEGRAM_ID"}'
```

The grant action deliberately refuses calls carrying Mini App init data. It is intended for the project owner's local CLI session, not for a public Mini App request. The CLI operator is explicitly linking the email identity to the Telegram account.

4. Send `/admin` again. The bot now returns an **Open MAGNUS** button which opens `?admin=1`.
5. In the admin workspace, open **Бот** to edit the welcome message, bot descriptions and menu-button text. Press **Сохранить и применить**. Only `/start` and `/help` are listed in the Telegram command menu; `/admin` remains a manually typed owner command.

## Security notes

- Never grant access based only on a username or a Telegram ID sent in chat. The local CLI grant is an explicit owner action that binds the email identity and Telegram account.
- Do not expose the grant action as a public UI control.
- All review, bot-management, student-directory, direct-message, tariff-management and audit-log read actions require a matching active row in `admin_users`.
- A successful Telegram `sendMessage` response is recorded as **Отправлено Telegram**; it is not a read receipt and does not mean the student has opened the message. Failed sends retain the Telegram error description for troubleshooting.
- The **Тарифы** tab configures 30-, 90- and 365-day plans in Telegram Stars. A price of 0 or a disabled toggle hides a plan from students. The owner must configure prices before purchase buttons appear.
- The Mini App creates a single-use invoice link using `XTR`. The `pre_checkout_query` handler checks the invoice payload, Telegram user ID, currency and exact amount against the stored pending order. Access is activated only after the `successful_payment` update is received and the Telegram charge ID is stored. Duplicate successful-payment updates cannot extend the same order twice.
- `/paysupport` opens a support request flow. The student's message is stored and forwarded to active administrators, who can reply through the student's profile.
- Manual access records are administrative entitlements, not payment confirmations. No automatic recurring billing, refund UI or paid-content gate is connected yet. The current catalog remains demonstrational, so issuing access does not turn example lessons into paid courses.
- Opening the Mini App calls the student-data `load` action. For Telegram-authenticated users, that action creates or refreshes a cloud profile using the platform-verified Telegram ID, first name, last name and username. The directory therefore reflects actual users who have opened the app and synced with Telegram Cloud; it is not a list of people who merely started a private chat with the bot.
- The student page displays example-lesson completion markers separately from graded academic progress. Manual subscription/access records are shown independently from demonstration-lesson progress.
- Audit entries are append-only from the application workflow. A review entry records status and score changes plus whether the Telegram notification was delivered; bot-setting entries list which fields changed without copying their contents.
- The bot can only send review notifications to users who have opened the bot at least once; Telegram may reject a message otherwise. A failed notification does not roll back the saved review.
- The current owner grant is intentionally manual. A full multi-admin identity provider / account recovery flow is a separate authentication feature.
