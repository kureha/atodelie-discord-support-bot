"use strict";
exports.__esModule = true;
exports.CronController = void 0;
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
var discord_message_manager_1 = require("./../logic/discord_message_manager");
var server_info_2 = require("../entity/server_info");
var CronController = /** @class */ (function () {
    function CronController() {
    }
    /**
     * check follow recruitment and send message
     * @param client discord client
     */
    CronController.follow_recruitment_member = function (client) {
        // follow to date
        var to_datetime = new Date();
        to_datetime.setMinutes(to_datetime.getMinutes() + constants.DISCORD_FOLLOW_MINUTE);
        logger_1.logger.info("follow recruitment cron start. : to_datetime = ".concat(to_datetime.toISOString()));
        // create db instances
        var recruitment_repo = new recruitement_1.RecruitmentRepository();
        var participate_repo = new participate_1.ParticipateRepository();
        var server_info_repo = new server_info_1.ServerInfoRepository();
        // create message manager instance
        var messageManager = new discord_message_manager_1.DiscordMessageManager();
        // loop for guild id
        client.guilds.cache.forEach(function (guild) {
            var server_info_data = new server_info_2.ServerInfo();
            // get server info (send target channel, get latest follow_time)
            server_info_repo.get_m_server_info(guild.id)
                .then(function (temp_server_info_data) {
                server_info_data = temp_server_info_data;
                logger_1.logger.info("cron message sended guild info : server_id = ".concat(server_info_data.server_id, ", channel_id = ").concat(server_info_data.channel_id, ", from_time = ").concat(server_info_data.follow_time.toLocaleString(), ", to_time = ").concat(to_datetime.toLocaleString()));
                // get follow lists
                return recruitment_repo.get_m_recruitment_for_follow(server_info_data.server_id, server_info_data.follow_time, to_datetime);
            })
                .then(function (recruitment_data_list) {
                logger_1.logger.info("select follow data list completed.");
                logger_1.logger.trace(recruitment_data_list);
                // get join data and send message
                recruitment_data_list.forEach(function (recruitment_data) {
                    logger_1.logger.info("follow target : name = ".concat(recruitment_data.name));
                    participate_repo.get_t_participate(recruitment_data.token)
                        .then(function (user_list) {
                        logger_1.logger.info("follow target select user list completed. : name = ".concat(recruitment_data.name, ", user_list_length = ").concat(user_list.length));
                        // get user list
                        recruitment_data.user_list = user_list;
                        // if user more than 0 member, followup executed.
                        if (recruitment_data.user_list.length > 0) {
                            // search channel
                            client.channels.cache.get(server_info_data.channel_id).send({
                                embeds: [
                                    messageManager.get_join_recruitment_follow_message(recruitment_data, server_info_data.recruitment_target_role),
                                ]
                            });
                        }
                    });
                });
            })
                .then(function () {
                // update master
                server_info_repo.update_m_server_info_follow_time(server_info_data.server_id, to_datetime);
                logger_1.logger.info("follow recruitment cron completed.");
            })["catch"](function (err) {
                // send error message
                logger_1.logger.error("cron command failed for error.");
                logger_1.logger.error(err);
            });
        });
    };
    return CronController;
}());
exports.CronController = CronController;
;
