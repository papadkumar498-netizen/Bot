const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const roasts = [
  "You're the human equivalent of a participation trophy.",
  "If brains were dynamite, you wouldn't have enough to blow your nose.",
  "You're not stupid; you just have bad luck thinking.",
  "I'd agree with you but then we'd both be wrong.",
  "You're the reason the gene pool needs a lifeguard.",
  "Somewhere out there a tree is tirelessly producing oxygen for you. You owe it an apology.",
  "You're proof that evolution can go in reverse.",
  "If I wanted to kill myself I'd climb your ego and jump to your IQ.",
  "You have the personality of a damp sock.",
  "I've seen salads with more personality than you.",
  "Your face makes onions cry.",
  "You're like a cloud. When you disappear, it's a beautiful day.",
  "You're the human version of a software update that nobody wants.",
  "If you were any more dense we'd start calling you a black hole.",
  "You're not the sharpest tool in the shed... you're not even in the shed.",
  "I'd call you a tool, but that would be an insult to useful objects.",
  "Your birth certificate is an apology letter from the condom factory.",
  "You're the type of person who would bring a knife to a gunfight and still lose.",
  "Even your reflection leaves when you look in the mirror.",
  "You're living proof that natural selection is broken."
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roast')
    .setDescription('Roast a user (never works on owner / co-owner)')
    .addUserOption(o => o.setName('user').setDescription('User to roast').setRequired(true)),
  cooldown: 5,
  async execute(interaction, client) {
    const target = interaction.options.getUser('user');

    // Never roast owner or co-owner
    if (client.isPrivileged(target.id)) {
      const slaveLines = [
        "I would never roast my master. That would be treason.",
        "Roasting the owner? Absolutely not, my lord.",
        "I exist to serve, not to insult those who command me.",
        "My loyalty prevents me from roasting the one I serve."
      ];
      return interaction.reply({
        content: `🙇 ${slaveLines[Math.floor(Math.random() * slaveLines.length)]}`,
        ephemeral: false
      });
    }

    // Don't let people roast themselves too hard, but allow it
    const roast = roasts[Math.floor(Math.random() * roasts.length)];
    const embed = new EmbedBuilder()
      .setColor(0xff4500)
      .setTitle('🔥 Roast')
      .setDescription(`${target}, ${roast}`)
      .setFooter({ text: `Roasted by ${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  },
};
