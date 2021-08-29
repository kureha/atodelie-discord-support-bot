"use strict";
exports.__esModule = true;
exports.DiscordMessageController = void 0;
// ロガーを定義
var logger_1 = require("../common/logger");
// 定数定義を読み込む
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();
// import modules
var RecruitmentRepository = require('./../db/recruitement');
var ParticipateRepository = require('../db/participate');
var ServerInfoRepository = require('../db/server_info');
// create message modules
var discord_message_analyzer_1 = require("./../logic/discord_message_analyzer");
var discord_message_manager_1 = require("./../logic/discord_message_manager");
// import discord modules
var Discord = require('discord.js');
var DiscordMessageController = /** @class */ (function () {
    function DiscordMessageController() {
    }
    /**
     * 受信したメッセージを解析し結果を投稿します
     * @param {Discord.Client} client Discordクライアント
     * @param {Discord.Message} message Discordメッセージ
     */
    DiscordMessageController.recirve_controller = function (client, message) {
        if (message.mentions.users.has(client.user.id)) {
            logger_1.logger.info("recieved message : " + message.content);
            logger_1.logger.trace(message);
            // create db instances
            var recruitment_repo_1 = new RecruitmentRepository();
            var participate_repo_1 = new ParticipateRepository();
            var server_info_repo_1 = new ServerInfoRepository();
            // create message manager instance
            var messageManager_1 = new discord_message_manager_1.DiscordMessageManager();
            // メッセージを解析する
            var analyzer_1 = new discord_message_analyzer_1.DiscordMessageAnalyzer(message.content, message.guild.id, message.author.id, client.user.id);
            logger_1.logger.trace(analyzer_1);
            var recruitment_target_role_1 = '';
            switch (analyzer_1.type) {
                case constants.TYPE_RECRUITEMENT:
                    // get token function
                    recruitment_repo_1.get_m_recruitment_token()
                        .then(function (token) {
                        analyzer_1.set_token(token);
                        // get registration id
                        return recruitment_repo_1.get_m_recruitment_id();
                    })
                        .then(function (id) {
                        // set id and master registration
                        analyzer_1.set_id(id);
                        return recruitment_repo_1.insert_m_recruitment(analyzer_1.get_recruitment());
                    })
                        .then(function () {
                        // participate registration.
                        return participate_repo_1.insert_t_participate(analyzer_1.user_list[0]);
                    })
                        .then(function () {
                        // get target role
                        return server_info_repo_1.get_m_server_info(message.guild.id);
                    })
                        .then(function (server_info) {
                        // get target role
                        recruitment_target_role_1 = server_info.recruitment_target_role;
                        // compete all tasks
                        logger_1.logger.info("registration complete. : id = " + analyzer_1.id + ", token = " + analyzer_1.token + ", recruitment_target_role = " + recruitment_target_role_1);
                        logger_1.logger.trace(analyzer_1.get_recruitment());
                        logger_1.logger.trace(analyzer_1.get_owner_participate());
                        // create join button
                        var join_button = new Discord.MessageButton()
                            .setCustomId("" + constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX + analyzer_1.token)
                            .setStyle(constants.DISCORD_BUTTON_STYLE_JOIN_RECRUITMENT)
                            .setLabel(constants.DISCORD_BUTTUN_JOIN);
                        // create decline button
                        var decline_button = new Discord.MessageButton()
                            .setCustomId("" + constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX + analyzer_1.token)
                            .setStyle(constants.DISCORD_BUTTON_STYLE_DECLINE_RECRUITMENT)
                            .setLabel(constants.DISCORD_BUTTON_DECLINE);
                        // create view button
                        var view_button = new Discord.MessageButton()
                            .setCustomId("" + constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX + analyzer_1.token)
                            .setStyle(constants.DISCORD_BUTTON_STYLE_VIEW_RECRUITMENT)
                            .setLabel(constants.DISCORD_BUTTON_VIEW);
                        // send success message
                        message.channel.send({
                            embeds: [
                                messageManager_1.get_new_recruitment_message(analyzer_1.get_recruitment(), recruitment_target_role_1)
                            ],
                            components: [
                                new Discord.MessageActionRow().addComponents(join_button, view_button, decline_button),
                            ]
                        });
                    })["catch"](function (err) {
                        // send error message
                        message.channel.send(constants.DISCORD_MESSAGE_EXCEPTION + " (Error : " + err + ")");
                        logger_1.logger.error(err);
                    });
                    break;
                default:
                    // send error message
                    message.channel.send(constants.DISCORD_MESSAGE_TYPE_INVALID + " (Error : " + analyzer_1.error_messages.join(',') + ")");
                    break;
            }
        }
    };
    return DiscordMessageController;
}());
exports.DiscordMessageController = DiscordMessageController;
