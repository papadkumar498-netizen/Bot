const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Get a random meme'),
  cooldown: 5,
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const res = await fetch('https://meme-api.com/gimme');
      const data = await res.json();
      if (!data.url) throw new Error('No meme');
      const embed = new EmbedBuilder()
        .setColor(0xff4500)
        .setTitle(data.title || 'Meme')
        .setImage(data.url)
        .setFooter({ text: `👍 ${data.ups || 0} | r/${data.subreddit || 'memes'}` });
      await interaction.editReply({ embeds: [embed] });
    } catch (e) {
      await interaction.editReply('Failed to fetch meme. Try again later.');
    }
  },
};
