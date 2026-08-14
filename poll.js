const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a simple yes/no or multi-option poll')
    .addStringOption(o => o.setName('question').setDescription('Poll question').setRequired(true))
    .addStringOption(o => o.setName('option1').setDescription('Option 1').setRequired(false))
    .addStringOption(o => o.setName('option2').setDescription('Option 2').setRequired(false))
    .addStringOption(o => o.setName('option3').setDescription('Option 3').setRequired(false))
    .addStringOption(o => o.setName('option4').setDescription('Option 4').setRequired(false)),
  async execute(interaction) {
    const question = interaction.options.getString('question');
    const opts = [
      interaction.options.getString('option1'),
      interaction.options.getString('option2'),
      interaction.options.getString('option3'),
      interaction.options.getString('option4'),
    ].filter(Boolean);

    const embed = new EmbedBuilder().setColor(0x5865F2).setTitle('📊 Poll').setDescription(question).setFooter({ text: `By ${interaction.user.tag}` });

    if (opts.length === 0) {
      const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
      await msg.react('👍');
      await msg.react('👎');
    } else {
      const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
      embed.setDescription(`${question}\n\n${opts.map((o, i) => `${emojis[i]} ${o}`).join('\n')}`);
      const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
      for (let i = 0; i < opts.length; i++) await msg.react(emojis[i]);
    }
  },
};
