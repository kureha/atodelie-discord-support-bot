"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordInteractionController = void 0;
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
const discord_interaction_analyzer_1 = require("./../logic/discord_interaction_analyzer");
const discord_message_manager_1 = require("./../logic/discord_message_manager");
// import entities
const recruitment_1 = require("../entity/recruitment");
// import discord modules
const Discord = require('discord.js');
class DiscordInteractionController {
    /**
     * インタラクションメッセージを作成し投稿します
     * @param {Discord.Client} client Discordクライアント
     * @param {Discord.Interaction} interaction インタラクション情報
     */
    static recirve_controller(client, interaction) {
        logger_1.logger.info(`recirved interaction. customId = ${interaction.customId}`);
        logger_1.logger.trace(interaction);
        // create db instances
        const recruitment_repo = new recruitement_1.RecruitmentRepository();
        const participate_repo = new participate_1.ParticipateRepository();
        const server_info_repo = new server_info_1.ServerInfoRepository();
        // create message manager instance
        const messageManager = new discord_message_manager_1.DiscordMessageManager();
        // analyze message
        let analyzer = new discord_interaction_analyzer_1.DiscordInteractionAnalyzer(interaction.customId, interaction.user.id);
        logger_1.logger.trace(analyzer);
        let recruitment_data = new recruitment_1.Recruitment();
        let recruitment_target_role = '';
        // join/view/decline to target plan
        participate_repo.insert_t_participate(analyzer.get_join_participate())
            .catch((err) => {
            // failed to insert, try to update
            return participate_repo.update_t_participate(analyzer.get_join_participate());
        })
            .then(() => {
            // get target role
            return server_info_repo.get_m_server_info(interaction.guildId);
        })
            .then((server_info_data) => {
            // get target role
            recruitment_target_role = server_info_data.recruitment_target_role;
            // update OK, send message
            return recruitment_repo.get_m_recruitment(analyzer.token);
        })
            .then((data) => {
            recruitment_data = data;
            // set id to analyzer
            analyzer.set_id(recruitment_data.id);
            // get user list
            return participate_repo.get_t_participate(recruitment_data.token);
        })
            .then((user_list) => {
            // get user information
            recruitment_data.user_list = user_list;
            // create message
            let message_by_interaction = new Discord.MessageEmbed();
            switch (analyzer.type) {
                case constants.TYPE_JOIN:
                    message_by_interaction = messageManager.get_join_recruitment(recruitment_data, recruitment_target_role);
                    break;
                case constants.TYPE_VIEW:
                    message_by_interaction = messageManager.get_view_recruitment(recruitment_data, recruitment_target_role);
                    break;
                case constants.TYPE_DECLINE:
                    message_by_interaction = messageManager.get_decline_recruitment(recruitment_data, recruitment_target_role);
                    break;
                default:
                    logger_1.logger.error(`this is not valid type. : ${analyzer.type}`);
                    break;
            }
            // send message
            interaction.reply({
                embeds: [
                    message_by_interaction
                ],
            });
        })
            .catch((err) => {
            // send error message
            interaction.reply(`${messageManager.get_no_recruitment()}`);
            logger_1.logger.error(err);
        });
    }
}
exports.DiscordInteractionController = DiscordInteractionController;
//# sourceMappingURL=discord_interaction_controller.js.map