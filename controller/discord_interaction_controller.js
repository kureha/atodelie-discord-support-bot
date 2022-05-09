"use strict";
exports.__esModule = true;
exports.DiscordInteractionController = void 0;
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
var discord_interaction_analyzer_1 = require("./../logic/discord_interaction_analyzer");
var discord_message_manager_1 = require("./../logic/discord_message_manager");
// import entities
var recruitment_1 = require("../entity/recruitment");
// import discord modules
var Discord = require('discord.js');
var DiscordInteractionController = /** @class */ (function () {
    function DiscordInteractionController() {
    }
    /**
     * analyze discord interaction and send result message
     * @param client discord client
     * @param interaction discord interaction
     */
    DiscordInteractionController.recieve_controller = function (client, interaction) {
        logger_1.logger.info("recirved interaction. customId = ".concat(interaction.customId));
        logger_1.logger.trace(interaction);
        // create db instances
        var recruitment_repo = new recruitement_1.RecruitmentRepository();
        var participate_repo = new participate_1.ParticipateRepository();
        var server_info_repo = new server_info_1.ServerInfoRepository();
        // create message manager instance
        var messageManager = new discord_message_manager_1.DiscordMessageManager();
        // analyze message
        var analyzer = new discord_interaction_analyzer_1.DiscordInteractionAnalyzer();
        analyzer.analyze(interaction.customId, interaction.user.id)
            .then(function () {
            logger_1.logger.trace(analyzer);
            var recruitment_data = new recruitment_1.Recruitment();
            var recruitment_target_role = '';
            // join/view/decline to target plan
            participate_repo.insert_t_participate(analyzer.get_join_participate())["catch"](function (err) {
                // failed to insert, try to update
                return participate_repo.update_t_participate(analyzer.get_join_participate());
            })
                .then(function () {
                // get target role
                return server_info_repo.get_m_server_info(interaction.guildId);
            })
                .then(function (server_info_data) {
                // get target role
                recruitment_target_role = server_info_data.recruitment_target_role;
                // update OK, send message
                return recruitment_repo.get_m_recruitment(analyzer.token);
            })
                .then(function (data) {
                recruitment_data = data;
                // set id to analyzer
                analyzer.set_id(recruitment_data.id);
                // get user list
                return participate_repo.get_t_participate(recruitment_data.token);
            })
                .then(function (user_list) {
                // get user information
                recruitment_data.user_list = user_list;
                // create message
                var message_by_interaction = new Discord.MessageEmbed();
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
                        logger_1.logger.error("this is not valid type. : ".concat(analyzer.type));
                        break;
                }
                // send message
                interaction.reply({
                    embeds: [
                        message_by_interaction
                    ]
                });
            })["catch"](function (err) {
                // send error message
                interaction.reply("".concat(messageManager.get_no_recruitment()));
                logger_1.logger.error(err);
            });
        })["catch"](function () {
            // send error message
            interaction.reply("".concat(messageManager.get_no_recruitment()));
        });
    };
    return DiscordInteractionController;
}());
exports.DiscordInteractionController = DiscordInteractionController;
