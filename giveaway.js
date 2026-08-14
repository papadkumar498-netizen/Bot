const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Start a giveaway')
    .addStringOption(o => o.setName('duration').setDescription('Duration e.g. 1h, 1d').setRequired(true))
    .addIntegerOption(o => o.setName('winners').setDescription('Number of winners').setRequired(true).setMinValue(1).setMaxValue(20))
    .addStringOption(o => o.setName('prize').setDescription('Prize').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction, client) {
    const durationStr = interaction.options.getString('duration');
    const winners = interaction.options.getInteger('winners');
    const prize = interaction.options.getString('prize');
    const duration = ms(durationStr);
    if (!duration || duration < 10000) return interaction.reply({ content: 'Invalid duration (min 10s).', ephemeral: true });

    const end = Date.now() + duration;
    const embed = new EmbedBuilder()
      .setColor(0xffd700)
      .setTitle('🎉 GIVEAWAY')
      .setDescription(`**Prize:** ${prize}\n**Winners:** ${winners}\n**Ends:** <t:${Math.floor(end / 1000)}:R>\n\nReact with 🎉 to enter!`)
      .setFooter({ text: `Hosted by ${interaction.user.tag}` })
      .setTimestamp(end);

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
    await msg.react('🎉');

    if (!client.db.giveaways[interaction.guild.id]) client.db.giveaways[interaction.guild.id] = {};
    client.db.giveaways[interaction.guild.id][msg.id] = {
      channel: interaction.channel.id,
      prize,
      winners,
      end,
      host: interaction.user.id,
      ended: false
    };
    client.db.save('giveaways');

    // Simple timeout end (for long giveaways better use interval/cron)
    setTimeout(async () => {
      try {
        await endGiveaway(client, interaction.guild.id, msg.id);
      } catch (e) { console.error(e); }
    }, duration);
  },
};

async function endGiveaway(client, guildId, msgId) {
  const g = client.db.giveaways[guildId]?.[msgId];
  if (!g || g.ended) return;
  g.ended = true;
  client.db.save('giveaways');

  const channel = await client.channels.fetch(g.channel).catch(() => null);
  if (!channel) return;
  const msg = await channel.messages.fetch(msgId).catch(() => null);
  if (!msg) return;

  const reaction = msg.reactions.cache.get('🎉');
  const users = reaction ? await reaction.users.fetch() : new Map();
  const entrants = [...users.values()].filter(u => !u.bot);
  let winnersList = [];
  if (entrants.length === 0) {
    await channel.send(`Giveaway for **${g.prize}** ended. No valid entries.`);
  } else {
    const shuffled = entrants.sort(() => 0.5 - Math.random());
    winnersList = shuffled.slice(0, Math.min(g.winners, entrants.length));
    await channel.send(`🎉 Congratulations ${winnersList.map(u => u.toString()).join(', ')}! You won **${g.prize}**!`);
  }

  const embed = EmbedBuilder.from(msg.embeds[0])
    .setColor(0x808080)
    .setDescription(`**Prize:** ${g.prize}\n**Winners:** ${winnersList.length ? winnersList.map(u => u.toString()).join(', ') : 'None'}\n**Ended**`);
  await msg.edit({ embeds: [embed] });
}

module.exports.endGiveaway = endGiveaway;
