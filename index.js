require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials, ActivityType } = require('discord.js');
const express = require('express');
const fs = require('fs');
const path = require('path');

// Keep-alive server for Render (prevents sleep on free tier when pinged)
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Nate Higgers is online 👀'));
app.get('/health', (req, res) => res.json({ status: 'ok', bot: 'Nate Higgers' }));
app.listen(PORT, () => console.log(`Keep-alive server running on port ${PORT}`));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember],
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.config = {
  prefix: process.env.PREFIX || '!',
  owners: (process.env.OWNER_IDS || '').split(',').map(id => id.trim()).filter(Boolean),
  coOwners: (process.env.CO_OWNER_IDS || '').split(',').map(id => id.trim()).filter(Boolean),
};

// Helpers for owner / co-owner checks
client.isOwner = (userId) => client.config.owners.includes(String(userId));
client.isCoOwner = (userId) => client.config.coOwners.includes(String(userId));
client.isPrivileged = (userId) => client.isOwner(userId) || client.isCoOwner(userId);

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  if (!fs.statSync(folderPath).isDirectory()) continue;
  const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(folderPath, file));
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
      console.log(`Loaded command: ${command.data.name}`);
    }
  }
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  console.log(`Loaded event: ${event.name}`);
}

// Simple in-memory + JSON persistence for economy/levels (replace with MongoDB for production scale)
const dataPath = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });

client.db = {
  economy: loadJSON('economy.json'),
  levels: loadJSON('levels.json'),
  warnings: loadJSON('warnings.json'),
  tickets: loadJSON('tickets.json'),
  giveaways: loadJSON('giveaways.json'),
  config: loadJSON('config.json'),
  save(key) {
    const file = path.join(dataPath, `${key}.json`);
    fs.writeFileSync(file, JSON.stringify(this[key], null, 2));
  }
};

function loadJSON(name) {
  const file = path.join(dataPath, name);
  if (fs.existsSync(file)) {
    try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return {}; }
  }
  return {};
}

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

client.login(process.env.DISCORD_TOKEN).catch(err => {
  console.error('Failed to login. Check DISCORD_TOKEN.', err);
  process.exit(1);
});
