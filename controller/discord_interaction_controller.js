// create logger
const logger = require('./../common/logger');

// import constants
const Constants = require('./../common/constants');
const constants = new Constants();

// import modules
const DiscordInteraction = require('./../logic/discord_interaction');

// import modules
const Recruitment = require('./../db/recruitement');
const Participate = require('../db/participate')
const ServerInfo = require('../db/server_info');

// create message modules
const MessageManager = require('./../logic/discord_message_manager');

module.exports = class DiscordInteractionController {
    static recirve_controller(client, interaction) {
        logger.info(`recirved interaction. customId = ${interaction.customId}`);
        logger.trace(interaction);

        // create db instances
        const recruitment = new Recruitment();
        const participate = new Participate();
        const server_info = new ServerInfo();

        // create message manager instance
        const messageManager = new MessageManager();

        // analyze message
        let analyzer = new DiscordInteraction(interaction.customId, interaction.user.id);
        logger.trace(analyzer);

        let recruitment_data = undefined;
        let recruitment_target_role = '';

        switch (analyzer.type) {
            case constants.TYPE_JOIN:
                // join to target plan
                participate.insert_t_participate(analyzer)
                    .catch((err) => {
                        // failed to insert, try to update
                        return participate.update_t_participate(analyzer);
                    })
                    .then(() => {
                        // get target role
                        return server_info.get_m_server_info(interaction.guildId);
                    })
                    .then((server_info_data) => {
                        // get target role
                        recruitment_target_role = server_info_data.recruitment_target_role;

                        // update OK, send message
                        return recruitment.get_m_recruitment(analyzer.token);
                    })
                    .then((data) => {
                        recruitment_data = data;
                        // get user list
                        return participate.get_t_participate(recruitment_data.token);
                    })
                    .then((user_list) => {
                        // get user information
                        recruitment_data.user_list = user_list;

                        // send message
                        interaction.reply({
                            embeds: [
                                messageManager.get_join_recruitment(recruitment_data, recruitment_target_role)
                            ],
                        });
                    })
                    .catch((err) => {
                        // send error message
                        interaction.reply(`${messageManager.get_no_recruitment()}`);
                        logger.error(err);
                    });
                break;

            case constants.TYPE_DECLINE:
                participate.update_t_participate(analyzer)
                    .then(() => {
                        // get target role
                        return server_info.get_m_server_info(interaction.guildId);
                    })
                    .then((server_info_data) => {
                        // get target role
                        recruitment_target_role = server_info_data.recruitment_target_role;

                        // success to delete, get master data
                        return recruitment.get_m_recruitment(analyzer.token);
                    })
                    .then((data) => {
                        recruitment_data = data;
                        // get user list
                        return participate.get_t_participate(recruitment_data.token);
                    })
                    .then((user_list) => {
                        // get user information
                        recruitment_data.user_list = user_list;

                        // send message
                        interaction.reply({
                            embeds: [
                                messageManager.get_decline_recruitment(recruitment_data, recruitment_target_role)
                            ],
                        });
                    })
                    .catch((err) => {
                        // send error message
                        interaction.reply(`${messageManager.get_no_recruitment()}`);
                        logger.error(err);
                    });
                break;
            default:
                // send error message
                interaction.reply(`${constants.DISCORD_MESSAGE_TYPE_INVALID} (Error : ${analyzer.error_messages.join(',')})`);
                break;
        }
    }
}