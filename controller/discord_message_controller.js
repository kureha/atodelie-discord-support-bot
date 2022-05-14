"use strict";
exports.__esModule = true;
exports.DiscordMessageController = void 0;
// define logger
var logger_1 = require("../common/logger");
// import constants
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();
// import modules
var recruitement_1 = require("./../db/recruitement");
var participate_1 = require("../db/participate");
var server_info_1 = require("../db/server_info");
// create message modules
var discord_message_analyzer_1 = require("./../logic/discord_message_analyzer");
var discord_message_manager_1 = require("./../logic/discord_message_manager");
// import entities
var server_info_2 = require("../entity/server_info");
var reference_1 = require("../entity/reference");
var user_info_1 = require("../entity/user_info");
// import discord modules
var Discord = require('discord.js');
var DiscordMessageController = /** @class */ (function () {
    function DiscordMessageController() {
    }
    /**
     * analyze discord message and send result message
     * @param client discord client
     * @param message discord message
     */
    DiscordMessageController.recieve_controller = function (client, message) {
        if (message.mentions.users.has(client.user.id)) {
            logger_1.logger.info("recieved message : ".concat(message.content));
            logger_1.logger.trace(message);
            // analyze message
            var analyzer_1 = new discord_message_analyzer_1.DiscordMessageAnalyzer();
            analyzer_1.analyze(message.content, message.guild.id, message.author.id, client.user.id, new reference_1.Reference(message.reference))
                .then(function () {
                logger_1.logger.trace(analyzer_1);
                // call function by type
                switch (analyzer_1.type) {
                    case constants.TYPE_RECRUITEMENT:
                        // create recruitment
                        DiscordMessageController.create_new_recruitment(client, message, analyzer_1);
                        break;
                    case constants.TYPE_EDIT:
                        // update recruitment
                        DiscordMessageController.update_recruitment(client, message, analyzer_1);
                        break;
                    case constants.TYPE_DELETE:
                        // delete recruitment
                        DiscordMessageController.delete_recruitment(client, message, analyzer_1);
                        break;
                    case constants.TYPE_REGIST_MAETER:
                        // regist master
                        DiscordMessageController.regist_master(client, message, analyzer_1);
                        break;
                    case constants.TYPE_USER_INFO_LIST_GET:
                        // user info list gert
                        DiscordMessageController.user_info_list_get(client, message, analyzer_1);
                        break;
                    default:
                        // send error message
                        message.channel.send("".concat(constants.DISCORD_MESSAGE_TYPE_INVALID, " (Error : ").concat(analyzer_1.error_messages.join(','), ")"));
                        break;
                }
            })["catch"](function () {
                // send error message
                message.channel.send("".concat(constants.DISCORD_MESSAGE_TYPE_INVALID, " (Error : ").concat(analyzer_1.error_messages.join(','), ")"));
            });
        }
    };
    /**
     * create new recruitment
     * @param message
     * @param analyzer
     */
    DiscordMessageController.create_new_recruitment = function (client, message, analyzer) {
        // create db instances
        var recruitment_repo = new recruitement_1.RecruitmentRepository();
        var participate_repo = new participate_1.ParticipateRepository();
        var server_info_repo = new server_info_1.ServerInfoRepository();
        // create message manager instance
        var message_manager = new discord_message_manager_1.DiscordMessageManager();
        // recruitment role string
        var server_info;
        // get token function
        recruitment_repo.get_m_recruitment_token()
            .then(function (token) {
            analyzer.set_token(token);
            // get registration id
            return recruitment_repo.get_m_recruitment_id();
        })
            .then(function (id) {
            // set id and master registration
            analyzer.set_id(id);
            return recruitment_repo.insert_m_recruitment(analyzer.get_recruitment());
        })
            .then(function () {
            // participate registration.
            return participate_repo.insert_t_participate(analyzer.get_owner_participate());
        })
            .then(function () {
            // get target role
            return server_info_repo.get_m_server_info(message.guild.id);
        })
            .then(function (server_info_data) {
            // get server info data
            server_info = server_info_data;
            // check server info registed
            if (server_info.channel_id == constants.RECRUITMENT_INVALID_CHANNEL_ID) {
                logger_1.logger.warn("not regist server info, send warning message.");
                message.channel.send(message_manager.get_setting_is_not_ready(constants.DISCORD_BOT_ADMIN_USER_ID));
                // input temprary values to server info
                server_info.server_id = message.guildId;
                server_info.channel_id = message.channelId;
            }
            // compete all tasks
            logger_1.logger.info("registration complete. : id = ".concat(analyzer.id, ", token = ").concat(analyzer.token, ", channel_id = ").concat(server_info.channel_id, ", recruitment_target_role = ").concat(server_info.recruitment_target_role));
            logger_1.logger.trace(analyzer.get_recruitment());
            logger_1.logger.trace(analyzer.get_owner_participate());
            // create join button
            var join_button = new Discord.MessageButton()
                .setCustomId("".concat(constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX).concat(analyzer.token))
                .setStyle(constants.DISCORD_BUTTON_STYLE_JOIN_RECRUITMENT)
                .setLabel(constants.DISCORD_BUTTUN_JOIN);
            // create decline button
            var decline_button = new Discord.MessageButton()
                .setCustomId("".concat(constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX).concat(analyzer.token))
                .setStyle(constants.DISCORD_BUTTON_STYLE_DECLINE_RECRUITMENT)
                .setLabel(constants.DISCORD_BUTTON_DECLINE);
            // create view button
            var view_button = new Discord.MessageButton()
                .setCustomId("".concat(constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX).concat(analyzer.token))
                .setStyle(constants.DISCORD_BUTTON_STYLE_VIEW_RECRUITMENT)
                .setLabel(constants.DISCORD_BUTTON_VIEW);
            // send success message
            return client.channels.cache.get(server_info.channel_id).send({
                embeds: [
                    message_manager.get_new_recruitment_message(analyzer.get_recruitment(), server_info.recruitment_target_role)
                ],
                components: [
                    new Discord.MessageActionRow().addComponents(join_button, view_button, decline_button),
                ]
            });
        })
            .then(function (sended_message) {
            // set recirve message id
            logger_1.logger.info("send message completed. update message id to recruitment. : message_id = ".concat(sended_message.id));
            analyzer.set_message_id(sended_message.id);
            // final phase : update recruitment
            return recruitment_repo.update_m_recruitment(analyzer.get_recruitment());
        })["catch"](function (err) {
            // send error message
            message.channel.send("".concat(constants.DISCORD_MESSAGE_EXCEPTION, " (Error : ").concat(err, ")"));
            logger_1.logger.error(err);
        });
    };
    /**
     * update recruitment
     * @param message
     * @param analyzer
     */
    DiscordMessageController.update_recruitment = function (client, message, analyzer) {
        // create db instances
        var recruitment_repo = new recruitement_1.RecruitmentRepository();
        var server_info_repo = new server_info_1.ServerInfoRepository();
        // create message manager instance
        var message_manager = new discord_message_manager_1.DiscordMessageManager();
        // recruitment role string
        var server_info;
        // update recruitment
        recruitment_repo.update_m_recruitment(analyzer.get_recruitment())
            .then(function () {
            // get target role
            return server_info_repo.get_m_server_info(message.guild.id);
        })
            .then(function (server_info_data) {
            // get target role
            server_info = server_info_data;
            // compete all tasks
            logger_1.logger.info("registration complete. : id = ".concat(analyzer.id, ", token = ").concat(analyzer.token, ", channel_id = ").concat(server_info.channel_id, ", recruitment_target_role = ").concat(server_info.recruitment_target_role));
            logger_1.logger.trace(analyzer.get_recruitment());
            logger_1.logger.trace(analyzer.get_owner_participate());
            // create join button
            var join_button = new Discord.MessageButton()
                .setCustomId("".concat(constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX).concat(analyzer.token))
                .setStyle(constants.DISCORD_BUTTON_STYLE_JOIN_RECRUITMENT)
                .setLabel(constants.DISCORD_BUTTUN_JOIN);
            // create decline button
            var decline_button = new Discord.MessageButton()
                .setCustomId("".concat(constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX).concat(analyzer.token))
                .setStyle(constants.DISCORD_BUTTON_STYLE_DECLINE_RECRUITMENT)
                .setLabel(constants.DISCORD_BUTTON_DECLINE);
            // create view button
            var view_button = new Discord.MessageButton()
                .setCustomId("".concat(constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX).concat(analyzer.token))
                .setStyle(constants.DISCORD_BUTTON_STYLE_VIEW_RECRUITMENT)
                .setLabel(constants.DISCORD_BUTTON_VIEW);
            // send success message
            return client.channels.cache.get(server_info.channel_id).send({
                embeds: [
                    message_manager.get_edit_recruitment_message(analyzer.get_recruitment(), server_info.recruitment_target_role)
                ],
                components: [
                    new Discord.MessageActionRow().addComponents(join_button, view_button, decline_button),
                ]
            });
        })
            .then(function (sended_message) {
            // recirve message id
            logger_1.logger.info("send message completed. update message id to recruitment. : message_id = ".concat(sended_message.id));
            analyzer.set_message_id(sended_message.id);
            // update recruitment
            return recruitment_repo.update_m_recruitment(analyzer.get_recruitment());
        })["catch"](function (err) {
            // send error message
            message.channel.send("".concat(constants.DISCORD_MESSAGE_EXCEPTION, " (Error : ").concat(err, ")"));
            logger_1.logger.error(err);
        });
    };
    /**
     * delete recruitment
     * @param message
     * @param analyzer
     */
    DiscordMessageController.delete_recruitment = function (client, message, analyzer) {
        // create db instances
        var recruitment_repo = new recruitement_1.RecruitmentRepository();
        var server_info_repo = new server_info_1.ServerInfoRepository();
        // create message manager instance
        var message_manager = new discord_message_manager_1.DiscordMessageManager();
        // recruitment role string
        var server_info;
        recruitment_repo.update_m_recruitment(analyzer.get_recruitment())
            .then(function () {
            // get target role
            return server_info_repo.get_m_server_info(message.guild.id);
        })
            .then(function (server_info_data) {
            // get target role
            server_info = server_info_data;
            // compete all tasks
            logger_1.logger.info("registration complete. : id = ".concat(analyzer.id, ", token = ").concat(analyzer.token, ", channel_id = ").concat(server_info.channel_id, ", recruitment_target_role = ").concat(server_info.recruitment_target_role));
            logger_1.logger.trace(analyzer.get_recruitment());
            logger_1.logger.trace(analyzer.get_owner_participate());
            // send success message
            return client.channels.cache.get(server_info.channel_id).send({
                embeds: [
                    message_manager.get_delete_recruitment_message(analyzer.get_recruitment(), server_info.recruitment_target_role)
                ]
            });
        })["catch"](function (err) {
            // send error message
            message.channel.send("".concat(constants.DISCORD_MESSAGE_EXCEPTION, " (Error : ").concat(err, ")"));
            logger_1.logger.error(err);
        });
    };
    /**
     * regist master
     * @param message
     * @param analyzer
     */
    DiscordMessageController.regist_master = function (client, message, analyzer) {
        // create db instances
        var server_info_repo = new server_info_1.ServerInfoRepository();
        // create message manager instance
        var message_manager = new discord_message_manager_1.DiscordMessageManager();
        // recruitment role string
        var server_info = new server_info_2.ServerInfo();
        // create server info instance
        server_info.server_id = message.guildId;
        server_info.channel_id = message.channelId;
        server_info.recruitment_target_role = analyzer.owner_id;
        server_info.follow_time = constants_1.Constants.get_default_date();
        // try to insert
        server_info_repo.insert_m_server_info(server_info)["catch"](function () {
            // insert failed - try to update
            logger_1.logger.info("insert server info failed, try to update.");
            return server_info_repo.update_m_server_info(server_info);
        })
            .then(function () {
            // get date for confirm
            return server_info_repo.get_m_server_info(message.guild.id);
        })
            .then(function (server_info_data) {
            // send success message
            logger_1.logger.info("server info registration successed.");
            logger_1.logger.trace(server_info_data);
            // send success message
            return client.channels.cache.get(server_info.channel_id).send(message_manager.get_regist_server_info(server_info.recruitment_target_role));
        })["catch"](function (err) {
            // send error message
            message.channel.send("".concat(constants.DISCORD_MESSAGE_EXCEPTION, " (Error : ").concat(err, ")"));
            logger_1.logger.error(err);
        });
    };
    /**
     * user info list get
     * @param client
     * @param message
     * @param analyzer
     */
    DiscordMessageController.user_info_list_get = function (client, message, analyzer) {
        // create db instances
        var server_info_repo = new server_info_1.ServerInfoRepository();
        // create message manager instance
        var message_manager = new discord_message_manager_1.DiscordMessageManager();
        // user info list
        var user_info_list = new Array(0);
        // get server info
        server_info_repo.get_m_server_info(message.guild.id).then(function (server_info_data) {
            // get guild's member info
            return client.channels.cache.get(server_info_data.channel_id).members;
        }).then(function (member_info_list) {
            // loop member list
            member_info_list.forEach(function (user_info, user_id) {
                // create user info temp valiable
                var user_info_temp = user_info_1.UserInfo.parse_from_discordjs(user_info);
                // loop role list
                user_info.roles.cache.forEach(function (role_info, role_id) {
                    var role_info_temp = user_info_1.RoleInfo.parse_from_discordjs(role_info);
                    // add role info to result list
                    user_info_temp.add(role_info_temp);
                });
                // add user info to result list
                user_info_list.push(user_info_temp);
            });
            // result
            var result_string = message_manager.get_user_info_list(user_info_list);
            // send message
            return message.channel.send(result_string);
        })["catch"](function (err) {
            // send error message
            message.channel.send("".concat(constants.DISCORD_MESSAGE_EXCEPTION, " (Error : ").concat(err, ")"));
            logger_1.logger.error(err);
        });
    };
    return DiscordMessageController;
}());
exports.DiscordMessageController = DiscordMessageController;
