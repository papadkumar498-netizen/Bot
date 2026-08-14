const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play rock-paper-scissors')
    .addStringOption(o => o.setName('choice').setDescription('Your choice').setRequired(true).addChoices(
      { name: 'Rock', value: 'rock' }, { name: 'Paper', value: 'paper' }, { name: 'Scissors', value: 'scissors' }
    )),
  async execute(interaction) {
    const userChoice = interaction.options.getString('choice');
    const choices = ['rock', 'paper', 'scissors'];
    const botChoice = choices[Math.floor(Math.random() * 3)];
    let result;
    if (userChoice === botChoice) result = "It's a tie!";
    else if (
      (userChoice === 'rock' && botChoice === 'scissors') ||
      (userChoice === 'paper' && botChoice === 'rock') ||
      (userChoice === 'scissors' && botChoice === 'paper')
    ) result = 'You win! 🎉';
    else result = 'You lose! 😢';

    const embed = new EmbedBuilder().setColor(0x5865F2).setTitle('✊ Rock Paper Scissors')
      .addFields(
        { name: 'You', value: userChoice, inline: true },
        { name: 'Bot', value: botChoice, inline: true },
        { name: 'Result', value: result }
      );
    await interaction.reply({ embeds: [embed] });
  },
};
