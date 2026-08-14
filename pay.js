const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Pay money to another user')
    .addUserOption(o => o.setName('user').setDescription('User to pay').setRequired(true))
    .addIntegerOption(o => o.setName('amount').setDescription('Amount').setRequired(true).setMinValue(1)),
  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    if (target.id === interaction.user.id) return interaction.reply({ content: 'Cannot pay yourself.', ephemeral: true });
    if (target.bot) return interaction.reply({ content: 'Cannot pay bots.', ephemeral: true });

    const guildId = interaction.guild.id;
    if (!client.db.economy[guildId]) client.db.economy[guildId] = {};
    if (!client.db.economy[guildId][interaction.user.id]) client.db.economy[guildId][interaction.user.id] = { cash: 0, bank: 0 };
    if (!client.db.economy[guildId][target.id]) client.db.economy[guildId][target.id] = { cash: 0, bank: 0 };

    const sender = client.db.economy[guildId][interaction.user.id];
    if (sender.cash < amount) return interaction.reply({ content: 'Insufficient cash.', ephemeral: true });

    sender.cash -= amount;
    client.db.economy[guildId][target.id].cash += amount;
    client.db.save('economy');

    const embed = new EmbedBuilder().setColor(0x00ff00).setDescription(`💸 ${interaction.user} paid **$${amount}** to ${target}`);
    await interaction.reply({ embeds: [embed] });
  },
};
