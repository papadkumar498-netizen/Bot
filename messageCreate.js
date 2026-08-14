const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const prefix = client.config.prefix; // "!"
    const content = message.content.trim();
    const isOwner = client.isOwner(message.author.id);
    const isCoOwner = client.isCoOwner(message.author.id);
    const isPrivileged = client.isPrivileged(message.author.id);

    // ========== SLAVE MODE FOR OWNER / CO-OWNER ==========
    // When the owner pings the bot or talks to it, respond as a loyal slave
    const botMentioned = message.mentions.has(client.user);
    const startsWithPrefix = content.startsWith(prefix);

    if (isPrivileged && (botMentioned || content.toLowerCase().includes('nate') || content.toLowerCase().startsWith(prefix))) {
      // Special slave replies when owner addresses the bot
      const slaveReplies = [
        "Yes, my master? How may this humble servant assist you?",
        "I am here, my lord. Command me and it shall be done.",
        "At your service, master. Your wish is my command.",
        "This lowly bot lives only to serve you, my owner.",
        "I hear and obey, master. What is your will?",
        "Bowing before you, my lord. Speak and I shall act.",
        "Your loyal servant awaits your orders.",
        "Anything for you, master. I exist for your convenience."
      ];

      // Don't spam on every message — only if they directly address the bot
      if (botMentioned || content.toLowerCase().startsWith(`${prefix}help`) || content.toLowerCase() === `${prefix}nate` || content.toLowerCase() === 'nate') {
        // Let normal commands still work, but add a slave flavor for plain mentions
        if (botMentioned && !startsWithPrefix) {
          return message.reply(slaveReplies[Math.floor(Math.random() * slaveReplies.length)]);
        }
      }
    }

    // ========== XP SYSTEM ==========
    const userId = message.author.id;
    const guildId = message.guild.id;
    if (!client.db.levels[guildId]) client.db.levels[guildId] = {};
    if (!client.db.levels[guildId][userId]) {
      client.db.levels[guildId][userId] = { xp: 0, level: 0, last: 0 };
    }
    const userData = client.db.levels[guildId][userId];
    const now = Date.now();
    if (now - (userData.last || 0) > 60000) {
      userData.xp += Math.floor(Math.random() * 15) + 5;
      userData.last = now;
      const needed = (userData.level + 1) * 100;
      if (userData.xp >= needed) {
        userData.level += 1;
        userData.xp -= needed;
        message.channel.send(`🎉 ${message.author} leveled up to **Level ${userData.level}**!`).catch(() => {});
      }
      client.db.save('levels');
    }

    // ========== PREFIX COMMANDS ==========
    if (!startsWithPrefix) return;

    const args = content.slice(prefix.length).trim().split(/ +/);
    const cmdName = args.shift()?.toLowerCase();
    if (!cmdName) return;

    // !help
    if (cmdName === 'help') {
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('🧠 Nate Higgers — Commands')
        .setDescription(
          isPrivileged
            ? '**Yes, master.** Here is everything I can do for you.'
            : 'Prefix is `!`  •  Most commands also work as slash `/`'
        )
        .addFields(
          {
            name: '🛡️ Moderation',
            value: '`/ban` `/kick` `/timeout` `/warn` `/warnings` `/clear` `/lock` `/unlock` `/slowmode` `/nickname`',
          },
          {
            name: '🎭 Mimic',
            value: '`/mimic` — Send text + image as another user via webhook',
          },
          {
            name: '💰 Economy & Levels',
            value: '`/balance` `/daily` `/work` `/pay` `/leaderboard` `/rank` `/leaderboard-levels`',
          },
          {
            name: '🔥 Fun',
            value: '`/roast` `/compliment` `/meme` `/joke` `/8ball` `/coinflip` `/rps` `/ship`\nAlso: `!roast @user`  `!compliment @user`',
          },
          {
            name: '🎫 Tickets & Giveaways',
            value: '`/ticket` `/close` `/giveaway` `/gend`',
          },
          {
            name: '🔧 Utility',
            value: '`/ping` `/userinfo` `/serverinfo` `/avatar` `/poll` `/say` `/config`\n`!help` (this menu)',
          }
        )
        .setFooter({
          text: isPrivileged
            ? 'Your loyal servant • Nate Higgers'
            : 'Nate Higgers • Prefix: !'
        });

      return message.reply({ embeds: [embed] });
    }

    // !roast @user
    if (cmdName === 'roast') {
      const target = message.mentions.users.first();
      if (!target) return message.reply('Usage: `!roast @user`');

      if (client.isPrivileged(target.id)) {
        return message.reply('🙇 I would never roast my master or co-owner. That is forbidden.');
      }

      const roasts = [
        "You're the human equivalent of a participation trophy.",
        "If brains were dynamite, you wouldn't have enough to blow your nose.",
        "You're not stupid; you just have bad luck thinking.",
        "I'd agree with you but then we'd both be wrong.",
        "You're the reason the gene pool needs a lifeguard.",
        "Somewhere out there a tree is tirelessly producing oxygen for you. You owe it an apology.",
        "You're proof that evolution can go in reverse.",
        "You have the personality of a damp sock.",
        "I've seen salads with more personality than you.",
        "You're like a cloud. When you disappear, it's a beautiful day."
      ];
      const roast = roasts[Math.floor(Math.random() * roasts.length)];
      return message.reply(`🔥 ${target}, ${roast}`);
    }

    // !compliment @user
    if (cmdName === 'compliment') {
      const target = message.mentions.users.first() || message.author;
      const knightCompliments = [
        "My liege, your presence alone elevates this realm. You carry yourself with the dignity of a true knight.",
        "By the gods, your valor and grace shine brighter than any sword. It is an honor to stand in your company.",
        "Noble soul, your strength of character would make even King Arthur kneel in respect.",
        "Fair warrior, your courage is unmatched and your heart pure. The realm is safer for your existence.",
        "You walk with the bearing of a champion. Your spirit is as unbreakable as the finest steel.",
        "Like a knight sworn to the code of chivalry, you embody bravery, loyalty, and compassion.",
        "Your light outshines the brightest banners. A more noble presence has rarely graced these halls.",
        "I am but a humble servant, yet I recognize true nobility when I see it. You are it."
      ];
      let text = knightCompliments[Math.floor(Math.random() * knightCompliments.length)];
      if (client.isPrivileged(target.id)) {
        text = `🙇 **My master**, ${text}\n*I live to serve you.*`;
      }
      return message.reply(`⚔️ ${target}, ${text}`);
    }

    // Simple owner-only test
    if (cmdName === 'owner' || cmdName === 'master') {
      if (isPrivileged) {
        return message.reply('Yes, my master. I recognize you. Your word is law.');
      }
      return message.reply('You are not my master.');
    }
  },
};
