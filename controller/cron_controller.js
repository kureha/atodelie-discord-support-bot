"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronController = void 0;
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
const discord_message_manager_1 = require("./../logic/discord_message_manager");
const server_info_2 = require("../entity/server_info");
class CronController {
    /**
     * Get Text Channel from Discord
     * @param client
     * @param channel_id
     * @returns discord channel. if error, throw error
     */
    static get_text_channel(client, channel_id) {
        var _a;
        if (client.channels.cache.get(channel_id) == undefined) {
            // check channel exists
            throw new Error(`Target channel is not exists.`);
        }
        else if (((_a = client.channels.cache.get(channel_id)) === null || _a === void 0 ? void 0 : _a.isText()) != false) {
            // check target channel is text channel
            throw new Error(`Target channel is not text channel.`);
        }
        // return values
        return client.channels.cache.get(channel_id);
    }
    /**
     * check follow recruitment and send message
     * @param client discord client
     */
    static follow_recruitment_member(client) {
        // follow to date
        const to_datetime = new Date();
        to_datetime.setMinutes(to_datetime.getMinutes() + constants.DISCORD_FOLLOW_MINUTE);
        logger_1.logger.info(`follow recruitment cron start. : to_datetime = ${to_datetime.toISOString()}`);
        // create db instances
        const recruitment_repo = new recruitement_1.RecruitmentRepository();
        const participate_repo = new participate_1.ParticipateRepository();
        const server_info_repo = new server_info_1.ServerInfoRepository();
        // create message manager instance
        const messageManager = new discord_message_manager_1.DiscordMessageManager();
        // loop for guild id
        client.guilds.cache.forEach((guild) => {
            let server_info_data = new server_info_2.ServerInfo();
            // get server info (send target channel, get latest follow_time)
            server_info_repo.get_m_server_info(guild.id)
                .then((temp_server_info_data) => {
                server_info_data = temp_server_info_data;
                logger_1.logger.info(`cron message sended guild info : server_id = ${server_info_data.server_id}, channel_id = ${server_info_data.channel_id}, from_time = ${server_info_data.follow_time.toLocaleString()}, to_time = ${to_datetime.toLocaleString()}`);
                // get follow lists
                return recruitment_repo.get_m_recruitment_for_follow(server_info_data.server_id, server_info_data.follow_time, to_datetime);
            })
                .then((recruitment_data_list) => {
                logger_1.logger.info(`select follow data list completed.`);
                logger_1.logger.trace(recruitment_data_list);
                // get join data and send message
                recruitment_data_list.forEach((recruitment_data) => {
                    logger_1.logger.info(`follow target : name = ${recruitment_data.name}`);
                    participate_repo.get_t_participate(recruitment_data.token)
                        .then((user_list) => {
                        logger_1.logger.info(`follow target select user list completed. : name = ${recruitment_data.name}, user_list_length = ${user_list.length}`);
                        // get user list
                        recruitment_data.user_list = user_list;
                        // if user more than 0 member, followup executed.
                        if (recruitment_data.user_list.length > 0) {
                            // search channel
                            const text_channel = CronController.get_text_channel(client, server_info_data.channel_id);
                            text_channel.send({
                                embeds: [
                                    messageManager.get_join_recruitment_follow_message(recruitment_data, server_info_data.recruitment_target_role),
                                ]
                            });
                        }
                    });
                });
            })
                .then(() => {
                // update master
                server_info_repo.update_m_server_info_follow_time(server_info_data.server_id, to_datetime);
                logger_1.logger.info(`follow recruitment cron completed.`);
            })
                .catch((err) => {
                // send error message
                logger_1.logger.error(`cron command failed for error.`);
                logger_1.logger.error(err);
            });
        });
    }
}
exports.CronController = CronController;
;
//# sourceMappingURL=cron_controller.js.map