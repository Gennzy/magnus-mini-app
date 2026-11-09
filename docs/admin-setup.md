# MAGNUS administrator access

## What is included

- `/admin` is handled in the bot's private chat and opens the administrator workspace.
- Administrator access is stored in `admin_users`; it is not inferred from a Telegram username or an ID supplied by a client.
- The first owner link is created from the project owner's local Telegram Cloud CLI session.
- The Mini App calls `POST /api/admin`; the endpoint uses platform-verified `ctx.initData.user` and checks the administrator table on every privileged action.
- Administrators can review student submissions, add a comment, set a 0–100 score, accept a submission or return it for revision.
- The bot section reports webhook state and configures the command list, bot descriptions and Mini App menu button.

## Connect the first owner

1. Deploy the current source and run `/start` in a private chat with the bot.
2. Send `/admin`. Until the owner is linked, the bot replies with the Telegram ID of the person who sent the command. This only identifies the account; it does not grant access.
3. In the local project directory, run the CLI-only grant action. Replace both values with the owner's verified account email and the ID shown by the bot:

```powershell
npx tgcloud run endpoints/admin '{"action":"grantAdmin","email":"OWNER_EMAIL","telegramId":"TELEGRAM_ID"}'
```

The grant action deliberately refuses calls carrying Mini App init data. It is intended for the project owner's local CLI session, not for a public Mini App request. The CLI operator is explicitly linking the email identity to the Telegram account.

4. Send `/admin` again. The bot now returns an **Open MAGNUS** button which opens `?admin=1`.
5. In the admin workspace, open **Бот → Настроить бота** to register `/start`, `/help`, `/admin`, set the descriptions and add the Mini App menu button.

## Security notes

- Never grant access based only on a username or a Telegram ID sent in chat. The local CLI grant is an explicit owner action that binds the email identity and Telegram account.
- Do not expose the grant action as a public UI control.
- All review and bot-management actions require a matching active row in `admin_users`.
- The bot can only send review notifications to users who have opened the bot at least once; Telegram may reject a message otherwise. A failed notification does not roll back the saved review.
- The current owner grant is intentionally manual. A full multi-admin identity provider / account recovery flow is a separate authentication feature.
