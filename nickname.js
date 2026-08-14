const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('Change a member\'s nickname')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('nickname').setDescription('New nickname (empty to reset)').setRequired(false).setMaxLength(32))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const nick = interaction.options.getString('nickname') || null;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User not in server.', ephemeral: true });
    if (!member.manageable) return interaction.reply({ content: 'I cannot change this user\'s nickname.', ephemeral: true });
    await member.setNickname(nick, `By ${interaction.user.tag}`);
    await interaction.reply(nick ? `Nickname of ${user} set to **${nick}**.` : `Nickname of ${user} reset.`);
  },
};
