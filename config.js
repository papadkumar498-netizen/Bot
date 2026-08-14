const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure bot settings for this server')
    .addSubcommand(s => s.setName('welcome').setDescription('Set welcome channel')
      .addChannelOption(o => o.setName('channel').setDescription('Welcome channel').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(s => s.setName('autorole').setDescription('Set auto-role for new members')
      .addRoleOption(o => o.setName('role').setDescription('Role to give').setRequired(true)))
    .addSubcommand(s => s.setName('modlog').setDescription('Set mod-log channel')
      .addChannelOption(o => o.setName('channel').setDescription('Mod log channel').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(s => s.setName('view').setDescription('View current config'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    if (!client.db.config[guildId]) client.db.config[guildId] = {};

    if (sub === 'welcome') {
      const ch = interaction.options.getChannel('channel');
      client.db.config[guildId].welcomeChannel = ch.id;
      client.db.save('config');
      await interaction.reply(`✅ Welcome channel set to ${ch}`);
    } else if (sub === 'autorole') {
      const role = interaction.options.getRole('role');
      client.db.config[guildId].autoRole = role.id;
      client.db.save('config');
      await interaction.reply(`✅ Auto-role set to ${role}`);
    } else if (sub === 'modlog') {
      const ch = interaction.options.getChannel('channel');
      client.db.config[guildId].modLog = ch.id;
      client.db.save('config');
      await interaction.reply(`✅ Mod-log channel set to ${ch}`);
    } else if (sub === 'view') {
      const cfg = client.db.config[guildId];
      const embed = new EmbedBuilder().setTitle('Server Config').setColor(0x5865F2)
        .addFields(
          { name: 'Welcome Channel', value: cfg.welcomeChannel ? `<#${cfg.welcomeChannel}>` : 'Not set', inline: true },
          { name: 'Auto Role', value: cfg.autoRole ? `<@&${cfg.autoRole}>` : 'Not set', inline: true },
          { name: 'Mod Log', value: cfg.modLog ? `<#${cfg.modLog}>` : 'Not set', inline: true }
        );
      await interaction.reply({ embeds: [embed] });
    }
  },
};
