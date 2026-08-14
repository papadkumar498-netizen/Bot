# 🧠 Nate Higgers — Multipurpose Discord Bot

A feature-rich Discord bot for normal servers.  
Includes moderation, economy, leveling, fun, **mimic (webhook impersonation + images)**, tickets, giveaways, **roast / knight-level compliment**, and special **slave mode** toward the owner & co-owner.

**Prefix:** `!`  
**Also supports full slash commands** (`/`)

---

## How to name everything (Discord + files)

### 1. Discord Application & Bot name
1. Go to https://discord.com/developers/applications → **New Application**
2. Name the **Application**: `Nate Higgers`
3. Go to the **Bot** tab → click **Add Bot** (or Reset Token)
4. Under **Username** you can set the bot’s display name to **Nate Higgers**
5. (Optional) Upload an avatar
6. Enable these **Privileged Gateway Intents**:
   - ✅ Server Members Intent
   - ✅ Message Content Intent
7. Copy the **Token** (keep it secret)
8. Copy the **Application ID** (this is CLIENT_ID)

### 2. Invite the bot
OAuth2 → URL Generator:
- Scopes: `bot` + `applications.commands`
- Permissions: Administrator (easiest) **or** carefully select:
  Manage Channels, Manage Messages, Manage Webhooks, Ban Members, Kick Members, Moderate Members, etc.
- Copy the URL and open it → choose your server → Authorize

### 3. Project / GitHub naming
- Recommended repo name: `nate-higgers-bot`
- Folder name inside: `nate-higgers-bot`
- Bot presence name is already set to “Nate Higgers”

---

## Special Owner / Co-Owner behavior

In `.env` (or Render env vars):

```
OWNER_IDS=123456789012345678
CO_OWNER_IDS=987654321098765432
```

- Multiple IDs allowed (comma-separated)
- **Bot will never roast the owner or co-owner**
- When the owner/co-owner pings the bot or says “nate”, it replies as a **loyal slave**:
  > “Yes, my master? How may this humble servant assist you?”
- Compliments to the owner are extra respectful
- `!owner` or `!master` confirms recognition

---

## New / Updated features

### 🔥 Roast
- `/roast @user` or `!roast @user`
- Funny (somewhat harsh) roasts
- **Protected**: cannot roast OWNER or CO_OWNER — bot refuses and stays loyal

### ⚔️ Compliment (Knight-level)
- `/compliment @user` or `!compliment @user` (defaults to yourself)
- Chivalrous, knightly praise (“My liege…”, “Your valor…”, “true knight of the Round Table”, etc.)
- Extra submissive wording when complimenting the owner

### !help
- Type `!help` (or `/help`) for the full command list
- Owner sees a more respectful version of the help menu

### Prefix
- Global prefix is `!`
- Works alongside modern slash commands

---

## Full feature list

**Moderation**  
`/ban` `/kick` `/timeout` `/warn` `/warnings` `/clear` `/lock` `/unlock` `/slowmode` `/nickname`

**Mimic**  
`/mimic user: @someone message: text image: [optional]`  
→ Temporary webhook with the target’s name + avatar. Supports images.

**Economy**  
`/balance` `/daily` `/work` `/pay` `/leaderboard`

**Levels**  
Auto XP on messages • `/rank` `/leaderboard-levels`

**Fun**  
`/roast` `/compliment` `/meme` `/joke` `/8ball` `/coinflip` `/rps` `/ship`  
(+ prefix versions for roast & compliment)

**Tickets**  
`/ticket` (private channel + close button) `/close`

**Giveaways**  
`/giveaway` `/gend`

**Utility**  
`/help` `!help` `/ping` `/userinfo` `/serverinfo` `/avatar` `/poll` `/say` `/config`

**Config** (`/config`)  
Welcome channel • Auto-role • Mod-log channel

---

## Environment variables

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
OWNER_IDS=your_discord_id
CO_OWNER_IDS=co_owner_discord_id   # optional
PREFIX=!
# GUILD_ID=test_server_id          # optional, faster slash updates while testing
PORT=3000
```

---

## Local run

```bash
npm install
# create .env from .env.example and fill values
node src/index.js
```

---

## Deploy on Render

1. Push the project to GitHub (repo name e.g. `nate-higgers-bot`)
2. Render → New → Web Service → connect the repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add the environment variables above
6. Deploy

**Free tier tip**: Render sleeps after inactivity.  
Ping your Render URL every 5–10 minutes with a free uptime monitor (UptimeRobot / cron-job.org) so the bot stays awake.

---

## Data note
Economy, levels, warnings, tickets, config and giveaways are stored in simple JSON files under `/data`.  
On Render free tier the filesystem is ephemeral (resets on sleep/redeploy).  
For permanent data use MongoDB Atlas (free) later.

---

## Important
- Mimic is powerful — it can impersonate anyone. Staff should monitor it.
- The bot name “Nate Higgers” is intentional. Discord may act if the bot is reported depending on how it is used.
- Never roast the owner/co-owner — the code blocks it.

Made for fun. Use responsibly.
