const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption(o => o.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User not in server.', ephemeral: true });
    if (!member.kickable) return interaction.reply({ content: 'I cannot kick this user.', ephemeral: true });
    if (member.roles.highest.position >= interaction.member.roles.highest.position && interaction.guild.ownerId !== interaction.user.id) {
      return interaction.reply({ content: 'You cannot kick someone with equal/higher role.', ephemeral: true });
    }
    await member.kick(`${reason} | By ${interaction.user.tag}`);
    const embed = new EmbedBuilder().setColor(0xffaa00).setTitle('👢 User Kicked')
      .addFields({ name: 'User', value: user.tag, inline: true }, { name: 'Moderator', value: interaction.user.tag, inline: true }, { name: 'Reason', value: reason });
    await interaction.reply({ embeds: [embed] });
  },
};
