const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the richest users')
    .addStringOption(o => o.setName('type').setDescription('cash or total').addChoices({ name: 'Cash', value: 'cash' }, { name: 'Total', value: 'total' }).setRequired(false)),
  async execute(interaction, client) {
    const type = interaction.options.getString('type') || 'total';
    const guildId = interaction.guild.id;
    const eco = client.db.economy[guildId] || {};
    const sorted = Object.entries(eco)
      .map(([id, d]) => ({ id, value: type === 'cash' ? d.cash : (d.cash + d.bank) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    if (sorted.length === 0) return interaction.reply('No economy data yet.');

    const embed = new EmbedBuilder().setColor(0xffd700).setTitle(`🏆 ${type === 'cash' ? 'Cash' : 'Total'} Leaderboard`)
      .setDescription(sorted.map((e, i) => `**${i + 1}.** <@${e.id}> — $${e.value.toLocaleString()}`).join('\n'));
    await interaction.reply({ embeds: [embed] });
  },
};
