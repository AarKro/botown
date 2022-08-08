import { IntentsBitField, Interaction, Message } from "discord.js";
import { Client } from "discordx";

export const createClient = (botId: string) => {

  const client = new Client({
    botId,
    // To only use global commands (use @Guild for specific guild command), comment this line
    botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
    
    // Discord intents
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildMessageReactions,
      IntentsBitField.Flags.GuildVoiceStates,
    ],
    
    // Debug logs are disabled in silent mode
    silent: true,
    
    // Configuration for @SimpleCommand
    simpleCommand: {
      prefix: "!",
    },
  });

  client.once("ready", async () => {
    // Make sure all guilds are cached
    await client.guilds.fetch();
  
    // Synchronize applications commands with Discord
    await client.initApplicationCommands();
  
    console.log(`Bot started: ${client.botId}`);
  });
  
  client.on("interactionCreate", (interaction: Interaction) => {
    client.executeInteraction(interaction);
  });
  
  client.on("messageCreate", (message: Message) => {
    client.executeCommand(message);
  });

  return client;
};