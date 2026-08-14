const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get a user\'s avatar')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`${user.username}'s Avatar`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setDescription(`[PNG](${user.displayAvatarURL({ extension: 'png', size: 4096 })}) | [JPG](${user.displayAvatarURL({ extension: 'jpg', size: 4096 })}) | [WEBP](${user.displayAvatarURL({ extension: 'webp', size: 4096 })})`);
    await interaction.reply({ embeds: [embed] });
  },
};
