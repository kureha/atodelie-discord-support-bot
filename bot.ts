// define logger
import { logger } from './common/logger';

// import constants
import { Constants } from './common/constants';
const constants = new Constants();

// import discord modules
import * as Discord from 'discord.js';
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

// check db and init
import { InitializeRepository } from './db/initialize';
InitializeRepository.initialize_database_if_not_exists();

// ready event
client.on('ready', () => {
  if (client.user != null) {
    client.user.setPresence(
      { activities: [{ name: constants.DISCORD_ACTIVITY_NAME }], status: 'online' }
    );
    logger.info(`logged on discord server.`);
  } else {
    logger.error(`client is not logined.`);
  }
})

// message is sended event
import { DiscordMessageController } from './controller/discord_message_controller';
client.on('messageCreate', (message: Discord.Message<boolean>) => {
  // call message recieve controller
  DiscordMessageController.recieve_controller(client, message);
});

// interaction event
import { DiscordInteractionController } from './controller/discord_interaction_controller';
client.on('interactionCreate', async (interaction: Discord.Interaction<Discord.CacheType>) => {
  if (interaction.isButton() == true) {
    // call interaction recieve controller
    DiscordInteractionController.recieve_controller(client, interaction as Discord.ButtonInteraction);
  }
});

// cron event
import * as cron from 'node-cron';
logger.info(`follow cron setting : ${constants.DISCORD_FOLLOW_CRON}`);
import { CronController } from './controller/cron_controller';
cron.schedule(constants.DISCORD_FOLLOW_CRON, (() => {
  // follow recruitment member
  CronController.follow_recruitment_member(client);
}));

// discord client login
client.login(process.env['DISCORD_BOT_TOKEN']);
