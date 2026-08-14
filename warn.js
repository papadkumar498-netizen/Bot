const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption(o => o.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction, client) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const guildId = interaction.guild.id;

    if (!client.db.warnings[guildId]) client.db.warnings[guildId] = {};
    if (!client.db.warnings[guildId][user.id]) client.db.warnings[guildId][user.id] = [];

    client.db.warnings[guildId][user.id].push({
      reason,
      mod: interaction.user.id,
      time: Date.now()
    });
    client.db.save('warnings');

    const count = client.db.warnings[guildId][user.id].length;
    const embed = new EmbedBuilder().setColor(0xffff00).setTitle('⚠️ Warning Issued')
      .addFields(
        { name: 'User', value: `${user.tag}`, inline: true },
        { name: 'Warnings', value: `${count}`, inline: true },
        { name: 'Moderator', value: interaction.user.tag, inline: true },
        { name: 'Reason', value: reason }
      );
    await interaction.reply({ embeds: [embed] });

    try {
      await user.send(`You were warned in **${interaction.guild.name}** for: ${reason}\nTotal warnings: ${count}`);
    } catch {}
  },
};
