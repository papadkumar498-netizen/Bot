const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { endGiveaway } = require('./giveaway.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gend')
    .setDescription('End a giveaway early')
    .addStringOption(o => o.setName('message_id').setDescription('Giveaway message ID').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction, client) {
    const msgId = interaction.options.getString('message_id');
    await endGiveaway(client, interaction.guild.id, msgId);
    await interaction.reply({ content: 'Giveaway ended.', ephemeral: true });
  },
};
