// create logger
var logger = require('./common/logger');

// import discord modules
const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

// import constants
var constants_1 = require("./common/constants");
var constants = new constants_1.Constants();

// check db and init
const InitializeRepository = require('./db/initialize');
InitializeRepository.initialize_database_if_not_exists();

// ready event
client.on('ready', () => {
  client.user.setPresence(
    { activity: { name: constants.DISCORD_ACTIVITY_NAME }, status: 'online' }
  );
  logger.info(`logged on discord server.`);
})

// message is sended event
const discord_message_controller = require('./controller/discord_message_controller');
client.on('messageCreate', message => {
  // call message recieve controller
  discord_message_controller.recirve_controller(client, message);
});

// interaction event
const discord_interaction_controller = require('./controller/discord_interaction_controller');
client.on('interactionCreate', async (interaction) => {
  // call interaction recieve controller
  discord_interaction_controller.recirve_controller(client, interaction);
});

// cron event
const cron = require('node-cron');
logger.info(`follow cron setting : ${constants.DISCORD_FOLLOW_CRON}`);
const cron_controller = require('./controller/cron_controller');
cron.schedule(constants.DISCORD_FOLLOW_CRON, (() => {
  // follow recruitment member
  cron_controller.follow_recruitment_member(client);
}));

// discord client login
client.login(process.env.DISCORD_BOT_TOKEN)
