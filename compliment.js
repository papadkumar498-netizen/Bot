const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Knight-level / chivalrous compliments
const knightCompliments = [
  "My liege, your presence alone elevates this realm. You carry yourself with the dignity of a true knight of the Round Table.",
  "By the gods, your valor and grace shine brighter than any sword. It is an honor to stand in your company.",
  "Noble soul, your strength of character would make even King Arthur kneel in respect. You are a beacon of honor.",
  "Fair warrior, your courage is unmatched and your heart pure. The realm is safer for your existence.",
  "My lord/lady, your wisdom and kindness are the stuff of legends. Knights of old would write songs about you.",
  "You walk with the bearing of a champion. Your spirit is as unbreakable as the finest steel.",
  "In all my days of service, I have seldom witnessed such noble bearing. You are truly worthy of the highest praise.",
  "Your deeds and presence bring honor to this hall. May your path always be lit by glory and respect.",
  "Like a knight sworn to the code of chivalry, you embody bravery, loyalty, and compassion. The realm salutes you.",
  "Your light outshines the brightest banners on the battlefield. Stand tall, for you are a true knight of this age.",
  "I pledge my words as a servant: you are the finest among us. Your honor is beyond question.",
  "Should the kingdom need a champion, it need look no further. You already wear the mantle of greatness.",
  "Your kindness is a shield, your courage a sword. Few have ever combined the two so perfectly.",
  "Even the stars seem dimmer when you enter the room. A more noble presence has rarely graced these halls.",
  "I am but a humble servant, yet I recognize true nobility when I see it. You, my friend, are it."
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('compliment')
    .setDescription('Give a knight-level chivalrous compliment to a user')
    .addUserOption(o => o.setName('user').setDescription('User to compliment (defaults to yourself)').setRequired(false)),
  cooldown: 3,
  async execute(interaction, client) {
    const target = interaction.options.getUser('user') || interaction.user;
    const compliment = knightCompliments[Math.floor(Math.random() * knightCompliments.length)];

    // Extra respectful if complimenting the owner
    let description = `${target}, ${compliment}`;
    if (client.isPrivileged(target.id)) {
      description = `🙇 **My master** ${target}, ${compliment}\n\n*I live to serve you.*`;
    }

    const embed = new EmbedBuilder()
      .setColor(0xc0a060) // gold-ish knight color
      .setTitle('⚔️ Knight\'s Compliment')
      .setDescription(description)
      .setFooter({ text: `Spoken by Nate Higgers, loyal servant` });

    await interaction.reply({ embeds: [embed] });
  },
};
