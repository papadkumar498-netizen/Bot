const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const jobs = [
  { name: 'Developer', min: 100, max: 400 },
  { name: 'Streamer', min: 50, max: 350 },
  { name: 'Chef', min: 80, max: 250 },
  { name: 'Uber Driver', min: 40, max: 200 },
  { name: 'Meme Creator', min: 60, max: 300 },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work a job to earn money'),
  cooldown: 30,
  async execute(interaction, client) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    if (!client.db.economy[guildId]) client.db.economy[guildId] = {};
    if (!client.db.economy[guildId][userId]) client.db.economy[guildId][userId] = { cash: 0, bank: 0, lastWork: 0 };

    const data = client.db.economy[guildId][userId];
    const now = Date.now();
    if (now - (data.lastWork || 0) < 30 * 60 * 1000) {
      return interaction.reply({ content: '⏳ You need to rest. Try again later.', ephemeral: true });
    }

    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const amount = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;
    data.cash += amount;
    data.lastWork = now;
    client.db.save('economy');

    const embed = new EmbedBuilder().setColor(0x00aa00).setTitle('💼 Work Complete')
      .setDescription(`You worked as a **${job.name}** and earned **$${amount}**!`);
    await interaction.reply({ embeds: [embed] });
  },
};
