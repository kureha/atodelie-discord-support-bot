// define logger
import { logger } from './common/logger';

// import constants
import { Constants } from './common/constants';
const constants = new Constants();

// import discord modules
const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

// check db and init
import { InitializeRepository } from './db/initialize';
InitializeRepository.initialize_database_if_not_exists();

// ready event
client.on('ready', () => {
  client.user.setPresence(
    { activity: { name: constants.DISCORD_ACTIVITY_NAME }, status: 'online' }
  );
  logger.info(`logged on discord server.`);
})

// message is sended event
import { DiscordMessageController } from './controller/discord_message_controller';
client.on('messageCreate', (message: any) => {
  // call message recieve controller
  DiscordMessageController.recirve_controller(client, message);
});

// interaction event
import { DiscordInteractionController } from './controller/discord_interaction_controller';
client.on('interactionCreate', async (interaction: any) => {
  // call interaction recieve controller
  DiscordInteractionController.recirve_controller(client, interaction);
});

// cron event
import cron from 'node-cron';
logger.info(`follow cron setting : ${constants.DISCORD_FOLLOW_CRON}`);
import { CronController } from './controller/cron_controller';
cron.schedule(constants.DISCORD_FOLLOW_CRON, (() => {
  // follow recruitment member
  CronController.follow_recruitment_member(client);
}));

// discord client login
client.login(process.env['DISCORD_BOT_TOKEN']);
