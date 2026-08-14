const { Collection } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Button: close ticket
    if (interaction.isButton() && interaction.customId === 'close_ticket') {
      const guildId = interaction.guild.id;
      const ticket = client.db.tickets[guildId]?.[interaction.channel.id];
      if (!ticket || !ticket.open) return interaction.reply({ content: 'This is not an open ticket.', ephemeral: true });
      if (ticket.user !== interaction.user.id && !interaction.member.permissions.has('ManageChannels')) {
        return interaction.reply({ content: 'Only the ticket owner or staff can close this.', ephemeral: true });
      }
      ticket.open = false;
      client.db.save('tickets');
      await interaction.reply('Ticket will be deleted in 5 seconds...');
      setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
      return;
    }

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // Cooldown
    const { cooldowns } = client;
    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expiration = timestamps.get(interaction.user.id) + cooldownAmount;
      if (now < expiration) {
        const timeLeft = ((expiration - now) / 1000).toFixed(1);
        return interaction.reply({ content: `⏳ Wait ${timeLeft}s before using \`/${command.data.name}\` again.`, ephemeral: true });
      }
    }
    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`Error in ${command.data.name}:`, error);
      const msg = { content: 'There was an error executing this command.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(msg).catch(() => {});
      } else {
        await interaction.reply(msg).catch(() => {});
      }
    }
  },
};
