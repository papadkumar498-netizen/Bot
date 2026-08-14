const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mimic')
    .setDescription('Send a message as another user using a webhook (text + optional image)')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('The user to impersonate')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('message')
        .setDescription('The message content to send as that user')
        .setRequired(true)
        .setMaxLength(2000))
    .addAttachmentOption(opt =>
      opt.setName('image')
        .setDescription('Optional image/file to attach as the user')
        .setRequired(false))
    .addChannelOption(opt =>
      opt.setName('channel')
        .setDescription('Channel to send in (defaults to current)')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks | PermissionFlagsBits.ManageMessages),
  cooldown: 5,
  async execute(interaction, client) {
    // Permission check
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageWebhooks)) {
      return interaction.reply({ content: '❌ You need **Manage Webhooks** permission to use mimic.', ephemeral: true });
    }

    const target = interaction.options.getUser('user');
    const content = interaction.options.getString('message');
    const attachment = interaction.options.getAttachment('image');
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    if (target.bot) {
      return interaction.reply({ content: '❌ Cannot mimic bots.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      // Create temporary webhook
      const webhook = await channel.createWebhook({
        name: target.displayName || target.username,
        avatar: target.displayAvatarURL({ extension: 'png', size: 256 }),
        reason: `Mimic by ${interaction.user.tag}`,
      });

      const files = [];
      if (attachment) {
        files.push({ attachment: attachment.url, name: attachment.name });
      }

      await webhook.send({
        content: content,
        files: files.length ? files : undefined,
        username: target.displayName || target.username,
        avatarURL: target.displayAvatarURL({ dynamic: true }),
      });

      // Delete webhook after short delay to avoid clutter
      setTimeout(() => {
        webhook.delete('Mimic complete').catch(() => {});
      }, 5000);

      // Log the mimic for moderation transparency
      const logChannelId = client.db.config[interaction.guild.id]?.modLog;
      if (logChannelId) {
        const logCh = interaction.guild.channels.cache.get(logChannelId);
        if (logCh) {
          logCh.send({
            content: `🎭 **Mimic used** by ${interaction.user} → impersonated ${target} in ${channel}\nContent: \`${content.slice(0, 100)}${content.length > 100 ? '...' : ''}\``
          }).catch(() => {});
        }
      }

      await interaction.editReply({ content: `✅ Message sent as **${target.tag}** in ${channel}.` });
    } catch (error) {
      console.error('Mimic error:', error);
      await interaction.editReply({ content: `❌ Failed to mimic: ${error.message}` });
    }
  },
};
