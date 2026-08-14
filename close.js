const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Close the current ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction, client) {
    const guildId = interaction.guild.id;
    const ticket = client.db.tickets[guildId]?.[interaction.channel.id];
    if (!ticket || !ticket.open) return interaction.reply({ content: 'This is not an open ticket.', ephemeral: true });

    ticket.open = false;
    client.db.save('tickets');
    await interaction.reply('Ticket will be deleted in 5 seconds...');
    setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
  },
};
