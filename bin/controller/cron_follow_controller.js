"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronFollowController = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import databace access modules
const recruitement_1 = require("../db/recruitement");
const participate_1 = require("../db/participate");
const server_info_1 = require("../db/server_info");
// create message modules
const discord_message_1 = require("../logic/discord_message");
// import logics
const discord_common_1 = require("../logic/discord_common");
class CronFollowController {
    /**
     * check follow recruitment and send message
     * @param client discord client
     */
    static follow_recruitment_member(client) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // follow to date
                    const to_datetime = new Date();
                    to_datetime.setMinutes(to_datetime.getMinutes() + constants.DISCORD_FOLLOW_MINUTE);
                    logger_1.logger.info(`follow recruitment cron start. : to_datetime = ${to_datetime.toISOString()}`);
                    // create db instances
                    const recruitment_repo = new recruitement_1.RecruitmentRepository();
                    const participate_repo = new participate_1.ParticipateRepository();
                    const server_info_repo = new server_info_1.ServerInfoRepository();
                    // loop for guild id
                    const server_info_list = yield server_info_repo.get_m_server_info_all();
                    logger_1.logger.info(`follow server length = ${server_info_list}`);
                    // if length is 0, return
                    if (server_info_list.length == 0) {
                        // resolve
                        resolve(false);
                    }
                    let complete_follow_server_length = 0;
                    server_info_list.forEach((server_info) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            // get follow lists
                            const recruitment_data_list = yield recruitment_repo.get_m_recruitment_for_follow(server_info.server_id, server_info.follow_time, to_datetime);
                            logger_1.logger.info(`select follow data list completed.`);
                            logger_1.logger.trace(recruitment_data_list);
                            // get join data and send message
                            recruitment_data_list.forEach((recruitment_data) => __awaiter(this, void 0, void 0, function* () {
                                logger_1.logger.info(`follow target : name = ${recruitment_data.name}`);
                                // load participate from db
                                recruitment_data.user_list = yield participate_repo.get_t_participate(recruitment_data.token);
                                logger_1.logger.info(`follow target select user list completed. : name = ${recruitment_data.name}, user_list_length = ${recruitment_data.user_list.length}`);
                                // if user more than 0 member, followup executed.
                                if (recruitment_data.user_list.length > 0) {
                                    // search channel
                                    const text_channel = discord_common_1.DiscordCommon.get_text_channel(client, server_info.channel_id);
                                    yield text_channel.send({
                                        embeds: [
                                            discord_message_1.DiscordMessage.get_join_recruitment_follow_message(recruitment_data, server_info.recruitment_target_role),
                                        ]
                                    });
                                }
                            }));
                            // update master
                            yield server_info_repo.update_m_server_info_follow_time(server_info.server_id, to_datetime);
                            logger_1.logger.info(`follow recruitment cron completed.`);
                        }
                        catch (err) {
                            // send error message
                            logger_1.logger.error(`cron command failed for error.`);
                            logger_1.logger.error(err);
                        }
                        finally {
                            complete_follow_server_length = complete_follow_server_length + 1;
                            logger_1.logger.info(`follow one server completed. now = ${complete_follow_server_length}, task total = ${server_info_list.length}`);
                            // check could be resolve
                            if (complete_follow_server_length == server_info_list.length) {
                                logger_1.logger.info(`complete all follow server. resolve.`);
                                // resolve
                                resolve(true);
                            }
                        }
                    }));
                }
                catch (err) {
                    // send error message
                    logger_1.logger.error(err);
                    // reject
                    reject(`cron command error. error = ${err}`);
                }
            }));
        });
    }
}
exports.CronFollowController = CronFollowController;
;
//# sourceMappingURL=cron_follow_controller.js.map