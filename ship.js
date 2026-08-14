const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Ship two users (compatibility %)')
    .addUserOption(o => o.setName('user1').setDescription('First user').setRequired(true))
    .addUserOption(o => o.setName('user2').setDescription('Second user').setRequired(true)),
  async execute(interaction) {
    const u1 = interaction.options.getUser('user1');
    const u2 = interaction.options.getUser('user2');
    // Deterministic-ish based on IDs
    const seed = parseInt(u1.id.slice(-4)) + parseInt(u2.id.slice(-4));
    const percent = seed % 101;
    let comment = percent < 20 ? 'Yikes...' : percent < 50 ? 'Maybe friends?' : percent < 80 ? 'Cute potential!' : 'Soulmates! 💕';
    const embed = new EmbedBuilder().setColor(0xff69b4).setTitle('💘 Ship')
      .setDescription(`${u1} × ${u2}\n\n**${percent}%** compatible\n${comment}`);
    await interaction.reply({ embeds: [embed] });
  },
};
