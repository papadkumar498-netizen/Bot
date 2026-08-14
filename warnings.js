const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction, client) {
    const user = interaction.options.getUser('user');
    const guildId = interaction.guild.id;
    const warns = client.db.warnings[guildId]?.[user.id] || [];

    if (warns.length === 0) return interaction.reply({ content: `${user.tag} has no warnings.`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor(0xffff00)
      .setTitle(`Warnings for ${user.tag}`)
      .setDescription(warns.map((w, i) => `**${i + 1}.** ${w.reason} — <@${w.mod}> <t:${Math.floor(w.time / 1000)}:R>`).join('\n'))
      .setFooter({ text: `Total: ${warns.length}` });
    await interaction.reply({ embeds: [embed] });
  },
};
