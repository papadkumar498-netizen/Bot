const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout (mute) a member')
    .addUserOption(o => o.setName('user').setDescription('User to timeout').setRequired(true))
    .addStringOption(o => o.setName('duration').setDescription('Duration e.g. 10m, 1h, 1d (max 28d)').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const durationStr = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User not found in server.', ephemeral: true });
    if (!member.moderatable) return interaction.reply({ content: 'I cannot timeout this user.', ephemeral: true });

    const duration = ms(durationStr);
    if (!duration || duration < 5000 || duration > 28 * 24 * 60 * 60 * 1000) {
      return interaction.reply({ content: 'Invalid duration. Use e.g. 5m, 1h, 1d (5s–28d).', ephemeral: true });
    }

    await member.timeout(duration, `${reason} | By ${interaction.user.tag}`);
    const embed = new EmbedBuilder().setColor(0xff6600).setTitle('⏱️ User Timed Out')
      .addFields(
        { name: 'User', value: user.tag, inline: true },
        { name: 'Duration', value: durationStr, inline: true },
        { name: 'Moderator', value: interaction.user.tag, inline: true },
        { name: 'Reason', value: reason }
      );
    await interaction.reply({ embeds: [embed] });
  },
};
