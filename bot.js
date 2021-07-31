// create logger
const logger = require('./common/logger');

// import discord modules
const Discord = require('discord.js');
const client = new Discord.Client();

// import constants
const Constants = require('./common/constants');

client.on('ready', () => {
  client.user.setPresence(
    { activity: { name: 'ぱすふぁいんだー起動中...' }, status: 'online' }
  );
  logger.info(`logged on discord server.`);
})

client.on('message', message => {
  if (message.mentions.users.has(client.user.id)) {

    logger.info(`recieved message : ${message.content}`);
    logger.trace(message);

    // TODO
    return
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
