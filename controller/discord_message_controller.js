// create logger
const logger = require('./../common/logger');

// import discord modules
const Discord = require('discord.js');

// import constants
const Constants = require('./../common/constants');
const constants = new Constants();

// import modules
const DiscordAnalyzer = require('./../logic/discord_analyzer');
const Recruitment = require('./../db/recruitement');

// create message modules
const MessageManager = require('./../logic/discord_message_manager');

module.exports = class DiscordMessageController {
    static recirve_controller(client, message) {
        if (message.mentions.users.has(client.user.id)) {
            logger.info(`recieved message : ${message.content}`);
            logger.trace(message);

            const recruitment = new Recruitment();
            const messageManager = new MessageManager();

            // メッセージを解析する
            let analyzer = new DiscordAnalyzer(message.content, message.guild.id, message.author.id, client.user.id);
            logger.trace(analyzer);
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
                            return recruitment.get_m_server_info(message.guild.id);
                        })
                        .then((server_info) => {
                            // get target role
                            recruitment_target_role = server_info.recruitment_target_role;

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
                                //content: `${messageManager.get_new_recruitment_message(analyzer, recruitment_target_role)}${messageManager.get_new_recruitment_embed_message(analyzer)}`,
                                embeds: [
                                    messageManager.get_new_recruitment_message(analyzer, recruitment_target_role)
                                ],
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
    }
}