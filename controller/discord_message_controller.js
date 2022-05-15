"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordMessageController = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import modules
const recruitement_1 = require("./../db/recruitement");
const participate_1 = require("../db/participate");
const server_info_1 = require("../db/server_info");
// create message modules
const discord_message_analyzer_1 = require("./../logic/discord_message_analyzer");
const discord_message_manager_1 = require("./../logic/discord_message_manager");
const export_user_info_1 = require("./../logic/export_user_info");
// import entities
const server_info_2 = require("../entity/server_info");
const reference_1 = require("../entity/reference");
// import discord modules
const Discord = require('discord.js');
class DiscordMessageController {
    /**
     * analyze discord message and send result message
     * @param client discord client
     * @param message discord message
     */
    static recieve_controller(client, message) {
        if (message.mentions.users.has(client.user.id)) {
            logger_1.logger.info(`recieved message : ${message.content}`);
            logger_1.logger.trace(message);
            // analyze message
            const analyzer = new discord_message_analyzer_1.DiscordMessageAnalyzer();
            analyzer.analyze(message.content, message.guild.id, message.author.id, client.user.id, new reference_1.Reference(message.reference))
                .then(() => {
                logger_1.logger.trace(analyzer);
                // call function by type
                switch (analyzer.type) {
                    case constants.TYPE_RECRUITEMENT:
                        // create recruitment
                        DiscordMessageController.create_new_recruitment(client, message, analyzer);
                        break;
                    case constants.TYPE_EDIT:
                        // update recruitment
                        DiscordMessageController.update_recruitment(client, message, analyzer);
                        break;
                    case constants.TYPE_DELETE:
                        // delete recruitment
                        DiscordMessageController.delete_recruitment(client, message, analyzer);
                        break;
                    case constants.TYPE_REGIST_MAETER:
                        // regist master
                        DiscordMessageController.regist_master(client, message, analyzer);
                        break;
                    case constants.TYPE_USER_INFO_LIST_GET:
                        // user info list gert
                        DiscordMessageController.export_user_info(client, message, analyzer);
                        break;
                    default:
                        // send error message
                        message.channel.send(`${constants.DISCORD_MESSAGE_TYPE_INVALID} (Error : ${analyzer.error_messages.join(',')})`);
                        break;
                }
            })
                .catch(() => {
                // send error message
                message.channel.send(`${constants.DISCORD_MESSAGE_TYPE_INVALID} (Error : ${analyzer.error_messages.join(',')})`);
            });
        }
    }
    /**
     * create new recruitment
     * @param message
     * @param analyzer
     */
    static create_new_recruitment(client, message, analyzer) {
        // create db instances
        const recruitment_repo = new recruitement_1.RecruitmentRepository();
        const participate_repo = new participate_1.ParticipateRepository();
        const server_info_repo = new server_info_1.ServerInfoRepository();
        // create message manager instance
        const message_manager = new discord_message_manager_1.DiscordMessageManager();
        // recruitment role string
        let server_info;
        // get token function
        recruitment_repo.get_m_recruitment_token()
            .then((token) => {
            analyzer.set_token(token);
            // get registration id
            return recruitment_repo.get_m_recruitment_id();
        })
            .then((id) => {
            // set id and master registration
            analyzer.set_id(id);
            return recruitment_repo.insert_m_recruitment(analyzer.get_recruitment());
        })
            .then(() => {
            // participate registration.
            return participate_repo.insert_t_participate(analyzer.get_owner_participate());
        })
            .then(() => {
            // get target role
            return server_info_repo.get_m_server_info(message.guild.id);
        })
            .then((server_info_data) => {
            // get server info data
            server_info = server_info_data;
            // check server info registed
            if (server_info.channel_id == constants.RECRUITMENT_INVALID_CHANNEL_ID) {
                logger_1.logger.warn(`not regist server info, send warning message.`);
                message.channel.send(message_manager.get_setting_is_not_ready(constants.DISCORD_BOT_ADMIN_USER_ID));
                // input temprary values to server info
                server_info.server_id = message.guildId;
                server_info.channel_id = message.channelId;
            }
            // compete all tasks
            logger_1.logger.info(`registration complete. : id = ${analyzer.id}, token = ${analyzer.token}, channel_id = ${server_info.channel_id}, recruitment_target_role = ${server_info.recruitment_target_role}`);
            logger_1.logger.trace(analyzer.get_recruitment());
            logger_1.logger.trace(analyzer.get_owner_participate());
            // create join button
            let join_button = new Discord.MessageButton()
                .setCustomId(`${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}${analyzer.token}`)
                .setStyle(constants.DISCORD_BUTTON_STYLE_JOIN_RECRUITMENT)
                .setLabel(constants.DISCORD_BUTTUN_JOIN);
            // create decline button
            let decline_button = new Discord.MessageButton()
                .setCustomId(`${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}${analyzer.token}`)
                .setStyle(constants.DISCORD_BUTTON_STYLE_DECLINE_RECRUITMENT)
                .setLabel(constants.DISCORD_BUTTON_DECLINE);
            // create view button
            let view_button = new Discord.MessageButton()
                .setCustomId(`${constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX}${analyzer.token}`)
                .setStyle(constants.DISCORD_BUTTON_STYLE_VIEW_RECRUITMENT)
                .setLabel(constants.DISCORD_BUTTON_VIEW);
            // send success message
            return client.channels.cache.get(server_info.channel_id).send({
                embeds: [
                    message_manager.get_new_recruitment_message(analyzer.get_recruitment(), server_info.recruitment_target_role)
                ],
                components: [
                    new Discord.MessageActionRow().addComponents(join_button, view_button, decline_button),
                ],
            });
        })
            .then((sended_message) => {
            // set recirve message id
            logger_1.logger.info(`send message completed. update message id to recruitment. : message_id = ${sended_message.id}`);
            analyzer.set_message_id(sended_message.id);
            // final phase : update recruitment
            return recruitment_repo.update_m_recruitment(analyzer.get_recruitment());
        })
            .catch((err) => {
            // send error message
            message.channel.send(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
            logger_1.logger.error(err);
        });
    }
    /**
     * update recruitment
     * @param message
     * @param analyzer
     */
    static update_recruitment(client, message, analyzer) {
        // create db instances
        const recruitment_repo = new recruitement_1.RecruitmentRepository();
        const server_info_repo = new server_info_1.ServerInfoRepository();
        // create message manager instance
        const message_manager = new discord_message_manager_1.DiscordMessageManager();
        // recruitment role string
        let server_info;
        // update recruitment
        recruitment_repo.update_m_recruitment(analyzer.get_recruitment())
            .then(() => {
            // get target role
            return server_info_repo.get_m_server_info(message.guild.id);
        })
            .then((server_info_data) => {
            // get target role
            server_info = server_info_data;
            // compete all tasks
            logger_1.logger.info(`registration complete. : id = ${analyzer.id}, token = ${analyzer.token}, channel_id = ${server_info.channel_id}, recruitment_target_role = ${server_info.recruitment_target_role}`);
            logger_1.logger.trace(analyzer.get_recruitment());
            logger_1.logger.trace(analyzer.get_owner_participate());
            // create join button
            let join_button = new Discord.MessageButton()
                .setCustomId(`${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}${analyzer.token}`)
                .setStyle(constants.DISCORD_BUTTON_STYLE_JOIN_RECRUITMENT)
                .setLabel(constants.DISCORD_BUTTUN_JOIN);
            // create decline button
            let decline_button = new Discord.MessageButton()
                .setCustomId(`${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}${analyzer.token}`)
                .setStyle(constants.DISCORD_BUTTON_STYLE_DECLINE_RECRUITMENT)
                .setLabel(constants.DISCORD_BUTTON_DECLINE);
            // create view button
            let view_button = new Discord.MessageButton()
                .setCustomId(`${constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX}${analyzer.token}`)
                .setStyle(constants.DISCORD_BUTTON_STYLE_VIEW_RECRUITMENT)
                .setLabel(constants.DISCORD_BUTTON_VIEW);
            // send success message
            return client.channels.cache.get(server_info.channel_id).send({
                embeds: [
                    message_manager.get_edit_recruitment_message(analyzer.get_recruitment(), server_info.recruitment_target_role)
                ],
                components: [
                    new Discord.MessageActionRow().addComponents(join_button, view_button, decline_button),
                ],
            });
        })
            .then((sended_message) => {
            // recirve message id
            logger_1.logger.info(`send message completed. update message id to recruitment. : message_id = ${sended_message.id}`);
            analyzer.set_message_id(sended_message.id);
            // update recruitment
            return recruitment_repo.update_m_recruitment(analyzer.get_recruitment());
        })
            .catch((err) => {
            // send error message
            message.channel.send(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
            logger_1.logger.error(err);
        });
    }
    /**
     * delete recruitment
     * @param message
     * @param analyzer
     */
    static delete_recruitment(client, message, analyzer) {
        // create db instances
        const recruitment_repo = new recruitement_1.RecruitmentRepository();
        const server_info_repo = new server_info_1.ServerInfoRepository();
        // create message manager instance
        const message_manager = new discord_message_manager_1.DiscordMessageManager();
        // recruitment role string
        let server_info;
        recruitment_repo.update_m_recruitment(analyzer.get_recruitment())
            .then(() => {
            // get target role
            return server_info_repo.get_m_server_info(message.guild.id);
        })
            .then((server_info_data) => {
            // get target role
            server_info = server_info_data;
            // compete all tasks
            logger_1.logger.info(`registration complete. : id = ${analyzer.id}, token = ${analyzer.token}, channel_id = ${server_info.channel_id}, recruitment_target_role = ${server_info.recruitment_target_role}`);
            logger_1.logger.trace(analyzer.get_recruitment());
            logger_1.logger.trace(analyzer.get_owner_participate());
            // send success message
            return client.channels.cache.get(server_info.channel_id).send({
                embeds: [
                    message_manager.get_delete_recruitment_message(analyzer.get_recruitment(), server_info.recruitment_target_role)
                ]
            });
        })
            .catch((err) => {
            // send error message
            message.channel.send(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
            logger_1.logger.error(err);
        });
    }
    /**
     * regist master
     * @param message
     * @param analyzer
     */
    static regist_master(client, message, analyzer) {
        // create db instances
        const server_info_repo = new server_info_1.ServerInfoRepository();
        // create message manager instance
        const message_manager = new discord_message_manager_1.DiscordMessageManager();
        // recruitment role string
        let server_info = new server_info_2.ServerInfo();
        // create server info instance
        server_info.server_id = message.guildId;
        server_info.channel_id = message.channelId;
        server_info.recruitment_target_role = analyzer.owner_id;
        server_info.follow_time = constants_1.Constants.get_default_date();
        // try to insert
        server_info_repo.insert_m_server_info(server_info)
            .catch(() => {
            // insert failed - try to update
            logger_1.logger.info(`insert server info failed, try to update.`);
            return server_info_repo.update_m_server_info(server_info);
        })
            .then(() => {
            // get date for confirm
            return server_info_repo.get_m_server_info(message.guild.id);
        })
            .then((server_info_data) => {
            // send success message
            logger_1.logger.info(`server info registration successed.`);
            logger_1.logger.trace(server_info_data);
            // send success message
            return client.channels.cache.get(server_info.channel_id).send(message_manager.get_regist_server_info(server_info.recruitment_target_role));
        })
            .catch((err) => {
            // send error message
            message.channel.send(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
            logger_1.logger.error(err);
        });
    }
    /**
     * user info list get
     * @param client
     * @param message
     * @param analyzer
     */
    static export_user_info(client, message, analyzer) {
        // create message manager instance
        const message_manager = new discord_message_manager_1.DiscordMessageManager;
        const export_user_info = new export_user_info_1.ExportUserInfo();
        // get export file path from .env file
        const export_file_path = constants.EXPORT_USER_INFO_PATH;
        // get server info
        message.guild.members.list({ limit: constants.USER_INFO_LIST_LIMIT_NUMBER, cache: false })
            .then((member_info_list) => {
            // parse discord's data to internal object
            const user_info_list = export_user_info.parse_user_info(member_info_list);
            // write user info list to file and get message
            export_user_info.output_user_info_to_file(user_info_list, export_file_path);
            // check member count is exceeded limit
            let exceeded_limit = false;
            if (message.guild.memberCount > constants.USER_INFO_LIST_LIMIT_NUMBER) {
                exceeded_limit = true;
            }
            // create message
            let message_string = constants.DISCORD_MESSAGE_EXPORT_USER_INFO;
            if (exceeded_limit == true) {
                message_string = constants.DISCORD_MESSAGE_EXPORT_USER_INFO_LIMIT_EXCEEDED;
            }
            // send message
            return message.channel.send({
                embeds: [
                    message_manager.get_export_user_info_embed_message(message_string)
                ],
                files: [export_file_path]
            });
        }).catch((err) => {
            // send error message
            message.channel.send(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
            logger_1.logger.error(err);
        });
    }
}
exports.DiscordMessageController = DiscordMessageController;
//# sourceMappingURL=discord_message_controller.js.map