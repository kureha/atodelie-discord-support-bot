// create logger
const logger = require('./common/logger');

// import discord modules
const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

// import constants
const Constants = require('./common/constants');
const constants = new Constants();

// import modules
const DiscordAnalyzer = require('./logic/discord_analyzer');
const DiscordInteraction = require('./logic/discord_interaction');
const Recruitment = require('./db/recruitement');

const MessageManager = require('./logic/discord_message_manager');
const messageManager = new MessageManager();

client.on('ready', () => {
  client.user.setPresence(
    { activity: { name: constants.DISCORD_ACTIVITY_NAME }, status: 'online' }
  );
  logger.info(`logged on discord server.`);
})

// message is sended event
client.on('messageCreate', message => {
  if (message.mentions.users.has(client.user.id)) {

    logger.info(`recieved message : ${message.content}`);
    logger.trace(message);

    // メッセージを解析する
    let analyzer = new DiscordAnalyzer(message.content, message.channel.id, message.author.id, client.user.id);
    logger.trace(analyzer);
    let recruitment = new Recruitment();
    let recruitment_data = undefined;
    let recruitment_target_role = '';

    switch (analyzer.type) {
      case constants.TYPE_RECRUITEMENT:
        // get token function for retry
        const token_function = recruitment.get_m_recruitment_token();
        // get token first with retry
        token_function
          .then((token) => {
            analyzer.token = token;
            // get registration id
            return recruitment.get_m_recruitment_id();
          })
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
            // get target role
            return recruitment.get_m_channel_info(message.channel.id);
          })
          .then((channel_info) => {
            // get target role
            recruitment_target_role = channel_info.recruitment_target_role;

            // compete all tasks
            logger.trace(analyzer);
            logger.info(`registration complete. : id = ${analyzer.id}, token = ${analyzer.token}, recruitment_target_role = ${recruitment_target_role}`);

            // create join button
            let join_button = new Discord.MessageButton()
              .setCustomId(`${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}${analyzer.token}`)
              .setStyle("PRIMARY")
              .setLabel("参加");

            // create decline button
            let decline_button = new Discord.MessageButton()
              .setCustomId(`${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}${analyzer.token}`)
              .setStyle("DANGER")
              .setLabel("参加取り止め");

            // send success message
            message.channel.send({
              content: `${messageManager.get_new_recruitment_message(analyzer, recruitment_target_role)}${messageManager.get_new_recruitment_embed_message(analyzer)}`,
              components: [
                new Discord.MessageActionRow().addComponents(join_button, decline_button),
              ],
            });
          })
          .catch((err) => {
            // send error message
            message.channel.send(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
            logger.error(err);
          });
        break;
      default:
        // send error message
        message.channel.send(`${constants.DISCORD_MESSAGE_TYPE_INVALID} (Error : ${analyzer.error_messages.join(',')})`);
        break;
    }

    return
  }
});

// interaction event
client.on('interactionCreate', async (interaction) => {
  logger.info(`recirved interaction. customId = ${interaction.customId}`);
  logger.trace(interaction);

  // analyze message
  let analyzer = new DiscordInteraction(interaction.customId, interaction.user.id);
  logger.trace(analyzer);

  let recruitment = new Recruitment();
  let recruitment_data = undefined;
  let recruitment_target_role = '';

  switch (analyzer.type) {
    case constants.TYPE_JOIN:
      // join to target plan
      recruitment.insert_t_participate(analyzer)
        .catch((err) => {
          // failed to insert, try to update
          return recruitment.update_t_participate(analyzer);
        })
        .then(() => {
          // get target role
          return recruitment.get_m_channel_info(interaction.channelId);
        })
        .then((channel_info) => {
          // get target role
          recruitment_target_role = channel_info.recruitment_target_role;

          // update OK, send message
          return recruitment.get_m_recruitment(analyzer.token);
        })
        .then((data) => {
          recruitment_data = data;
          // get user list
          return recruitment.get_t_participate(recruitment_data.token);
        })
        .then((user_list) => {
          // get user information
          recruitment_data.user_list = [];
          user_list.forEach((v) => {
            recruitment_data.user_list.push(v.user_id);
          });

          // send message
          interaction.reply({
            content: messageManager.get_join_recruitment_embed_message(recruitment_data),
          });
        })
        .catch((err) => {
          // send error message
          interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
          logger.error(err);
        });
      break;

    case constants.TYPE_DECLINE:
      recruitment.update_t_participate(analyzer)
        .then(() => {
          // get target role
          return recruitment.get_m_channel_info(interaction.channelId);
        })
        .then((channel_info) => {
          // get target role
          recruitment_target_role = channel_info.recruitment_target_role;

          // success to delete, get master data
          return recruitment.get_m_recruitment(analyzer.token);
        })
        .then((data) => {
          recruitment_data = data;
          // get user list
          return recruitment.get_t_participate(recruitment_data.token);
        })
        .then((user_list) => {
          // get user information
          recruitment_data.user_list = [];
          user_list.forEach((v) => {
            recruitment_data.user_list.push(v.user_id);
          });

          // send message
          interaction.reply({
            content: messageManager.get_join_recruitment_embed_message(recruitment_data),
          });
        })
        .catch((err) => {
          // send error message
          interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
          logger.error(err);
        });
      break;
    default:
      // send error message
      interaction.reply(`${constants.DISCORD_MESSAGE_TYPE_INVALID} (Error : ${analyzer.error_messages.join(',')})`);
      break;
  }
});

client.login(process.env.DISCORD_BOT_TOKEN)
