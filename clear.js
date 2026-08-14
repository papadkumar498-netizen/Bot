const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Delete a number of messages')
    .addIntegerOption(o => o.setName('amount').setDescription('Number of messages (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
    .addUserOption(o => o.setName('user').setDescription('Only delete messages from this user').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const targetUser = interaction.options.getUser('user');

    await interaction.deferReply({ ephemeral: true });

    const messages = await interaction.channel.messages.fetch({ limit: 100 });
    let filtered = messages.filter(m => Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000); // 14 days limit
    if (targetUser) filtered = filtered.filter(m => m.author.id === targetUser.id);

    const toDelete = [...filtered.values()].slice(0, amount);
    if (toDelete.length === 0) return interaction.editReply('No messages to delete (or too old).');

    await interaction.channel.bulkDelete(toDelete, true);
    await interaction.editReply(`🗑️ Deleted **${toDelete.length}** messages.`);
  },
};
