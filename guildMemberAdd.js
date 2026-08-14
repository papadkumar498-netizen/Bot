const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
// Note: canvas is optional for welcome images; fallback to text if fails

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    const guildId = member.guild.id;
    const cfg = client.db.config[guildId] || {};
    if (!cfg.welcomeChannel) return;

    const channel = member.guild.channels.cache.get(cfg.welcomeChannel);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0x00ff99)
      .setTitle(`Welcome to ${member.guild.name}!`)
      .setDescription(`Hey ${member}, welcome aboard!\nYou are member #${member.guild.memberCount}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    try {
      await channel.send({ content: `${member}`, embeds: [embed] });
    } catch (e) {
      console.error('Welcome error:', e);
    }

    // Auto role if set
    if (cfg.autoRole) {
      const role = member.guild.roles.cache.get(cfg.autoRole);
      if (role) member.roles.add(role).catch(() => {});
    }
  },
};
