const { ActivityType, REST, Routes } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag} | Nate Higgers is ready.`);
    client.user.setPresence({
      activities: [{ name: 'your server | /help', type: ActivityType.Watching }],
      status: 'online',
    });

    // Register slash commands
    const commands = [];
    for (const cmd of client.commands.values()) {
      commands.push(cmd.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
      if (process.env.GUILD_ID) {
        await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
          { body: commands }
        );
        console.log(`Registered ${commands.length} guild commands.`);
      } else {
        await rest.put(
          Routes.applicationCommands(process.env.CLIENT_ID),
          { body: commands }
        );
        console.log(`Registered ${commands.length} global commands (may take up to 1 hour).`);
      }
    } catch (error) {
      console.error('Error registering commands:', error);
    }
  },
};
