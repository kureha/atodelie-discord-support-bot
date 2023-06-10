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
    constructor() {
        this.recruitment_repo = new recruitement_1.RecruitmentRepository();
        this.participate_repo = new participate_1.ParticipateRepository();
        this.server_info_repo = new server_info_1.ServerInfoRepository();
    }
    /**
     * check follow recruitment and send message
     * @param client discord client
     */
    follow_recruitment_member(client) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // follow to date
                const to_datetime = new Date();
                to_datetime.setMinutes(to_datetime.getMinutes() + constants.DISCORD_FOLLOW_MINUTE);
                logger_1.logger.info(`follow recruitment cron start. : to_datetime = ${to_datetime.toISOString()}`);
                // loop for guild id
                const server_info_list = yield this.server_info_repo.get_m_server_info_all();
                logger_1.logger.info(`follow server length = ${server_info_list.length}`);
                // if length is 0, return
                if (server_info_list.length == 0) {
                    // resolve
                    return false;
                }
                // total result
                let total_result = true;
                for (const server_info of server_info_list) {
                    if ((yield this.execute_logic_for_guild(client, server_info, to_datetime)) == false) {
                        total_result = false;
                    }
                }
                logger_1.logger.info(`follow one server completed. result = ${total_result}`);
                return total_result;
            }
            catch (err) {
                // send error message
                logger_1.logger.error(`follow recruitment cron error.`, err);
                return false;
            }
        });
    }
    /**
     * follor for guild
     * @param client
     * @param server_info
     * @param to_datetime
     */
    execute_logic_for_guild(client, server_info, to_datetime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get follow lists
                const recruitment_data_list = yield this.recruitment_repo.get_m_recruitment_for_follow(server_info.server_id, server_info.follow_time, to_datetime);
                logger_1.logger.info(`select follow data list completed.`);
                logger_1.logger.trace(recruitment_data_list);
                // get join data and send message
                recruitment_data_list.forEach((recruitment_data) => __awaiter(this, void 0, void 0, function* () {
                    logger_1.logger.info(`follow target : name = ${recruitment_data.name}`);
                    // load participate from db
                    recruitment_data.user_list = yield this.participate_repo.get_t_participate(recruitment_data.token);
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
                yield this.server_info_repo.update_m_server_info_follow_time(server_info.server_id, to_datetime);
                logger_1.logger.info(`follow recruitment cron completed.`);
            }
            catch (err) {
                // send error message
                logger_1.logger.error(`cron command failed for error.`, err);
                return false;
            }
            ;
            return true;
        });
    }
}
exports.CronFollowController = CronFollowController;
;
//# sourceMappingURL=cron_follow_controller.js.map