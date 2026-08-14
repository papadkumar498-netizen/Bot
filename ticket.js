const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Create a support ticket')
    .addStringOption(o => o.setName('reason').setDescription('Reason for the ticket').setRequired(false)),
  async execute(interaction, client) {
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const guildId = interaction.guild.id;

    // Check existing open ticket
    if (!client.db.tickets[guildId]) client.db.tickets[guildId] = {};
    const existing = Object.values(client.db.tickets[guildId]).find(t => t.user === interaction.user.id && t.open);
    if (existing) return interaction.reply({ content: `You already have an open ticket: <#${existing.channel}>`, ephemeral: true });

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`.slice(0, 100),
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles] },
        { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] },
      ],
    });

    client.db.tickets[guildId][channel.id] = { user: interaction.user.id, open: true, reason };
    client.db.save('tickets');

    const embed = new EmbedBuilder()
      .setColor(0x00ff99)
      .setTitle('🎫 Support Ticket')
      .setDescription(`Hello ${interaction.user}, support will be with you shortly.\n**Reason:** ${reason}`)
      .setFooter({ text: 'Click the button below to close this ticket' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('close_ticket').setLabel('Close Ticket').setStyle(ButtonStyle.Danger).setEmoji('🔒')
    );

    await channel.send({ content: `${interaction.user}`, embeds: [embed], components: [row] });
    await interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });
  },
};
