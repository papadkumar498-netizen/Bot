const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('View your or another user\'s rank/level')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(false)),
  async execute(interaction, client) {
    const user = interaction.options.getUser('user') || interaction.user;
    const guildId = interaction.guild.id;
    const data = client.db.levels[guildId]?.[user.id] || { xp: 0, level: 0 };
    const needed = (data.level + 1) * 100;

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`📊 Rank — ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Level', value: `${data.level}`, inline: true },
        { name: 'XP', value: `${data.xp} / ${needed}`, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  },
};
