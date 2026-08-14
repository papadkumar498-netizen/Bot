const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all available commands for Nate Higgers'),
  async execute(interaction, client) {
    const isPrivileged = client.isPrivileged(interaction.user.id);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('🧠 Nate Higgers — Command List')
      .setDescription(
        isPrivileged
          ? '**Yes, master.** Full command list for your loyal servant.\nPrefix is also available: `!`'
          : 'Prefix: `!`  •  Slash commands preferred\nUse `/` for autocomplete.'
      )
      .addFields(
        {
          name: '🛡️ Moderation',
          value: '`/ban` `/kick` `/timeout` `/warn` `/warnings` `/clear` `/lock` `/unlock` `/slowmode` `/nickname`',
        },
        {
          name: '🎭 Mimic (Webhook Impersonation)',
          value: '`/mimic` — Send text + optional image as another user',
        },
        {
          name: '💰 Economy',
          value: '`/balance` `/daily` `/work` `/pay` `/leaderboard`',
        },
        {
          name: '📈 Levels',
          value: '`/rank` `/leaderboard-levels`',
        },
        {
          name: '🔥 Fun',
          value: '`/roast` `/compliment` `/meme` `/joke` `/8ball` `/coinflip` `/rps` `/ship`\nAlso works with `!roast` and `!compliment`',
        },
        {
          name: '🎫 Tickets & Giveaways',
          value: '`/ticket` `/close` `/giveaway` `/gend`',
        },
        {
          name: '🔧 Utility',
          value: '`/ping` `/userinfo` `/serverinfo` `/avatar` `/poll` `/say` `/config`\n`!help` or `/help`',
        }
      )
      .setFooter({
        text: isPrivileged
          ? 'Your loyal servant • Nate Higgers'
          : 'Nate Higgers • Prefix: !'
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
