const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your or another user\'s balance')
    .addUserOption(o => o.setName('user').setDescription('User to check').setRequired(false)),
  async execute(interaction, client) {
    const user = interaction.options.getUser('user') || interaction.user;
    const guildId = interaction.guild.id;
    if (!client.db.economy[guildId]) client.db.economy[guildId] = {};
    if (!client.db.economy[guildId][user.id]) client.db.economy[guildId][user.id] = { cash: 0, bank: 0 };

    const data = client.db.economy[guildId][user.id];
    const embed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle(`💰 ${user.username}'s Balance`)
      .addFields(
        { name: 'Cash', value: `$${data.cash.toLocaleString()}`, inline: true },
        { name: 'Bank', value: `$${data.bank.toLocaleString()}`, inline: true },
        { name: 'Total', value: `$${(data.cash + data.bank).toLocaleString()}`, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  },
};
