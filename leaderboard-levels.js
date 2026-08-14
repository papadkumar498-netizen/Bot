const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard-levels')
    .setDescription('View the top leveled users'),
  async execute(interaction, client) {
    const guildId = interaction.guild.id;
    const levels = client.db.levels[guildId] || {};
    const sorted = Object.entries(levels)
      .map(([id, d]) => ({ id, level: d.level || 0, xp: d.xp || 0 }))
      .sort((a, b) => b.level - a.level || b.xp - a.xp)
      .slice(0, 10);

    if (sorted.length === 0) return interaction.reply('No level data yet. Chat to gain XP!');

    const embed = new EmbedBuilder().setColor(0x5865F2).setTitle('📈 Level Leaderboard')
      .setDescription(sorted.map((e, i) => `**${i + 1}.** <@${e.id}> — Level ${e.level} (${e.xp} XP)`).join('\n'));
    await interaction.reply({ embeds: [embed] });
  },
};
