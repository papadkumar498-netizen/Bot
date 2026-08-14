const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward'),
  cooldown: 5,
  async execute(interaction, client) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    if (!client.db.economy[guildId]) client.db.economy[guildId] = {};
    if (!client.db.economy[guildId][userId]) client.db.economy[guildId][userId] = { cash: 0, bank: 0, lastDaily: 0 };

    const data = client.db.economy[guildId][userId];
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;
    if (now - (data.lastDaily || 0) < cooldown) {
      const remaining = cooldown - (now - data.lastDaily);
      const hours = Math.floor(remaining / 3600000);
      const mins = Math.floor((remaining % 3600000) / 60000);
      return interaction.reply({ content: `⏳ Daily already claimed. Come back in ${hours}h ${mins}m.`, ephemeral: true });
    }

    const amount = Math.floor(Math.random() * 500) + 200;
    data.cash += amount;
    data.lastDaily = now;
    client.db.save('economy');

    const embed = new EmbedBuilder().setColor(0x00ff00).setTitle('📅 Daily Reward')
      .setDescription(`You claimed **$${amount}**!\nNew cash balance: $${data.cash.toLocaleString()}`);
    await interaction.reply({ embeds: [embed] });
  },
};
