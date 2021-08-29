"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordMessageController = void 0;
// ロガーを定義
const logger_1 = require("../common/logger");
// 定数定義を読み込む
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import modules
const recruitement_1 = require("./../db/recruitement");
const participate_1 = require("../db/participate");
const server_info_1 = require("../db/server_info");
// create message modules
const discord_message_analyzer_1 = require("./../logic/discord_message_analyzer");
const discord_message_manager_1 = require("./../logic/discord_message_manager");
// import discord modules
const Discord = require('discord.js');
class DiscordMessageController {
    /**
     * 受信したメッセージを解析し結果を投稿します
     * @param {Discord.Client} client Discordクライアント
     * @param {Discord.Message} message Discordメッセージ
     */
    static recirve_controller(client, message) {
        if (message.mentions.users.has(client.user.id)) {
            logger_1.logger.info(`recieved message : ${message.content}`);
            logger_1.logger.trace(message);
            // create db instances
            const recruitment_repo = new recruitement_1.RecruitmentRepository();
            const participate_repo = new participate_1.ParticipateRepository();
            const server_info_repo = new server_info_1.ServerInfoRepository();
            // create message manager instance
            const messageManager = new discord_message_manager_1.DiscordMessageManager();
            // メッセージを解析する
            let analyzer = new discord_message_analyzer_1.DiscordMessageAnalyzer(message.content, message.guild.id, message.author.id, client.user.id);
            logger_1.logger.trace(analyzer);
            let recruitment_target_role = '';
            switch (analyzer.type) {
                case constants.TYPE_RECRUITEMENT:
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
                        return participate_repo.insert_t_participate(analyzer.user_list[0]);
                    })
                        .then(() => {
                        // get target role
                        return server_info_repo.get_m_server_info(message.guild.id);
                    })
                        .then((server_info) => {
                        // get target role
                        recruitment_target_role = server_info.recruitment_target_role;
                        // compete all tasks
                        logger_1.logger.info(`registration complete. : id = ${analyzer.id}, token = ${analyzer.token}, recruitment_target_role = ${recruitment_target_role}`);
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
                        message.channel.send({
                            embeds: [
                                messageManager.get_new_recruitment_message(analyzer.get_recruitment(), recruitment_target_role)
                            ],
                            components: [
                                new Discord.MessageActionRow().addComponents(join_button, view_button, decline_button),
                            ],
                        });
                    })
                        .catch((err) => {
                        // send error message
                        message.channel.send(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                        logger_1.logger.error(err);
                    });
                    break;
                default:
                    // send error message
                    message.channel.send(`${constants.DISCORD_MESSAGE_TYPE_INVALID} (Error : ${analyzer.error_messages.join(',')})`);
                    break;
            }
        }
    }
}
exports.DiscordMessageController = DiscordMessageController;
//# sourceMappingURL=discord_message_controller.js.map