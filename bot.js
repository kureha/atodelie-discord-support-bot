// create logger
const logger = require('./common/logger');

// import discord modules
const Discord = require('discord.js');
const client = new Discord.Client();

// import constants
const Constants = require('./common/constants');
const constants = new Constants();

// import modules
const DiscordAnalyzer = require('./logic/discord_analyzer');
const Recruitment = require('./db/recruitement');

client.on('ready', () => {
  client.user.setPresence(
    { activity: { name: constants.DISCORD_ACTIVITY_NAME }, status: 'online' }
  );
  logger.info(`logged on discord server.`);
})

client.on('message', message => {
  if (message.mentions.users.has(client.user.id)) {

    logger.info(`recieved message : ${message.content}`);
    logger.trace(message);

    // TODO
    // メッセージを解析する
    const analyzer = new DiscordAnalyzer(message.content, message.channel.id, message.author.id, client.user.id);
    logger.trace(analyzer);
    const recruitment = new Recruitment();

    switch (analyzer.type) {
      case constants.TYPE_RECRUITEMENT:
        // get next id first
        recruitment.get_m_recruitment_id()
          .then((id) => { 
            // set id and master registration
            analyzer.id = id;
            return recruitment.insert_m_recruitment(analyzer);
          })
          .then(() => {
            // participate registration.
            return recruitment.insert_t_participate(analyzer);
          })
          .then(() => {
            // compete all tasks
            logger.info(`registration complete. : id = ${analyzer.id}, token = ${analyzer.token}`);
          })
          .catch((err) => {
            logger.error(err);
          });
        break;
      case constants.TYPE_JOIN:
        // join to target plan
        recruitment.insert_t_participate(analyzer)
        .then(() => {
          // OK
        })
        .catch((err) => {
          // failed to insert, try to update
          return recruitment.update_t_participate(analyzer);
        })
        .catch((err) => {
          logger.error(err);
        });
        break;
      case constants.TYPE_DECLINE:
        break;
    }

    return
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
