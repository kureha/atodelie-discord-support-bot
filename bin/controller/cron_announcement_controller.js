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
exports.CronAnnouncementController = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import entites
const server_info_1 = require("../db/server_info");
// import logic
const discord_common_1 = require("../logic/discord_common");
const activity_history_1 = require("../db/activity_history");
const announcement_history_1 = require("../db/announcement_history");
const announcement_info_1 = require("../entity/announcement_info");
const discord_message_1 = require("../logic/discord_message");
const game_master_1 = require("../db/game_master");
class CronAnnouncementController {
    constructor() {
        this.server_info_repo = new server_info_1.ServerInfoRepository();
        this.activity_history_rep = new activity_history_1.ActivityHistoryRepository();
        this.announcement_rep = new announcement_history_1.AnnouncementHistoryRepository();
        this.game_master_repo = new game_master_1.GameMasterRepository();
    }
    /**
     * auto announcement activity for registed server
     * @param client
     * @returns
     */
    auto_annoucement(client) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`annoucement with cron start.`);
            // loop for guild id
            const server_info_list = yield this.server_info_repo.get_m_server_info_all();
            logger_1.logger.info(`follow server length = ${server_info_list}`);
            // if length is 0, return
            if (server_info_list.length == 0) {
                return false;
            }
            // total result
            let total_result = true;
            for (const server_info of server_info_list) {
                try {
                    // get guild
                    const guild = client.guilds.resolve(server_info.server_id);
                    if (guild == null) {
                        logger_1.logger.warn(`guild is null, can't regist history.`);
                        total_result = false;
                        continue;
                    }
                    // execute main logics
                    if ((yield this.execute_logic_for_guild(guild, server_info.channel_id, server_info.recruitment_target_role)) == false) {
                        total_result = false;
                    }
                }
                catch (err) {
                    logger_1.logger.error(`annoucement failed for error.`, err);
                    total_result = false;
                }
                ;
            }
            ;
            logger_1.logger.info(`annoucement with cron completed. result = ${total_result}`);
            return total_result;
        });
    }
    /**
     * auto announcement activity for guild
     * @param guild
     * @param announce_channel_id
     * @returns
     */
    execute_logic_for_guild(guild, announce_channel_id, announce_target_role) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`annoucement with playing game activity start. server id = ${guild.id}`);
            // get voice channel id list
            const voice_channel_id_list = discord_common_1.DiscordCommon.get_voice_channel_id_list(guild);
            logger_1.logger.trace(`target voice channel id list : ${voice_channel_id_list}`);
            // total result
            let total_result = true;
            // check channel member's game name
            for (const channel_id of voice_channel_id_list) {
                if ((yield this.execute_logic_for_channel(guild, announce_channel_id, announce_target_role, channel_id)) == false) {
                    total_result = false;
                }
            }
            ;
            logger_1.logger.info(`annoucement with cron completed. server id = ${guild.id}, result = ${total_result}`);
            return total_result;
        });
    }
    /**
     * auto announcement activity for channel
     * @param guild
     * @param announce_channel_id
     * @param announce_target_role
     * @param channel_id
     */
    execute_logic_for_channel(guild, announce_channel_id, announce_target_role, channel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info(`check need announcet start. voice channel id = ${channel_id}`);
                // get activity history (constants length select)
                const activity_list = yield this.activity_history_rep.get_t_activity_history(guild.id, channel_id, constants.DISCORD_AUTO_RE_ANNOUNCEMENT_COUNT_THRESHOLD);
                logger_1.logger.info(`get activity history list completed. result count = ${activity_list.length}, thresould = ${constants.DISCORD_AUTO_RE_ANNOUNCEMENT_COUNT_THRESHOLD}`);
                // get announcement history (single select)
                const announcement_history = yield this.announcement_rep.get_t_announcement(guild.id, channel_id, 1);
                logger_1.logger.info(`get announcement history list completed. result count = ${announcement_history.length}`);
                // extract announcement information
                const announcement_info = this.extract_announcement(activity_list);
                logger_1.logger.info(`check announcement info. announcement_info = ${JSON.stringify(announcement_info)}, member_threshold = ${constants.DISCORD_AUTO_ANNOUNCEMENT_MEMBER_THRESHOLD}`);
                // judge need announcement
                const need_announcement = this.is_exec_announcement(announcement_info, announcement_history, constants.DISCORD_AUTO_ANNOUNCEMENT_MEMBER_THRESHOLD);
                logger_1.logger.info(`judge for need announcement completed. result = ${need_announcement}`);
                if (need_announcement == true) {
                    // execute announcement
                    logger_1.logger.info(`announcement is NEEDED.`);
                    // insert history
                    const count = yield this.announcement_rep.insert_t_announcement(announcement_info.to_history());
                    if (count == 1) {
                        logger_1.logger.info(`announcement history insert completed. result count = ${count}`);
                    }
                    else {
                        throw new Error(`announcement history insert failed. result count = ${count}`);
                    }
                    // get game master and get alias name
                    const game_info_list = yield this.game_master_repo.get_m_game_master_by_presence_name(guild.id, announcement_info.game_name);
                    let game_name = '';
                    if (game_info_list.length > 0 && game_info_list[0] != undefined) {
                        const game_info = game_info_list[0];
                        game_name = game_info.game_name;
                    }
                    // if can't get alias name, set announcement info's game name
                    if (game_name.length == 0) {
                        game_name = announcement_info.game_name;
                    }
                    // send auto announcement message
                    const text_channel = discord_common_1.DiscordCommon.get_text_channel(guild.client, announce_channel_id);
                    logger_1.logger.info(discord_message_1.DiscordMessage.get_auto_announcement_message(constants.DISCORD_MESSAGE_SELECT_AUTO_ANNOUNCEMENT, announce_target_role, channel_id, game_name));
                    yield text_channel.send(discord_message_1.DiscordMessage.get_auto_announcement_message(constants.DISCORD_MESSAGE_SELECT_AUTO_ANNOUNCEMENT, announce_target_role, channel_id, game_name));
                }
                else {
                    // no announcement
                    logger_1.logger.info(`announcement is NOT needed.`);
                }
            }
            catch (err) {
                // send error message
                logger_1.logger.error(`annoucement failed for error. server id = ${guild.id}`, err);
                return false;
            }
            ;
            logger_1.logger.error(`annoucement completed. server id = ${guild.id}`);
            return true;
        });
    }
    /**
     * extract announcement information
     * @param activity_list
     * @returns
     */
    extract_announcement(activity_list) {
        var _a, _b;
        let announcement_info = new announcement_info_1.AnnouncementInfo();
        if (activity_list.length > 0) {
            announcement_info.server_id = ((_a = activity_list[0]) === null || _a === void 0 ? void 0 : _a.server_id) || '';
            announcement_info.channel_id = ((_b = activity_list[0]) === null || _b === void 0 ? void 0 : _b.channel_id) || '';
        }
        // loop and judge
        let skip_flag = false;
        activity_list.forEach((activity, idx) => {
            // skip flag judge
            if (skip_flag == true) {
                return;
            }
            // total member count is 0, no action older history.
            if (activity.total_member_count == 0) {
                skip_flag = true;
                return;
            }
            // if first, get name, member count
            if (idx == 0) {
                announcement_info.game_name = activity.game_name;
                announcement_info.current_game_member_count = activity.member_count;
            }
            // get max member count
            if (activity.total_member_count > announcement_info.max_total_member_count) {
                announcement_info.max_total_member_count = activity.total_member_count;
            }
            announcement_info.game_start_time = activity.change_time;
        });
        // return info
        return announcement_info;
    }
    /**
     * judge needs announcement
     * @param announcement_info
     * @param history_list
     */
    is_exec_announcement(announcement_info, history_list, current_game_member_count_threshold) {
        // check announcement, no game name is no needs announcement.
        if (announcement_info.game_name.length == 0) {
            logger_1.logger.debug(`annoucement game name is blank, skip execute announcement.`);
            return false;
        }
        // check current member count threshold, under count is no needs announcement.npx
        if (announcement_info.current_game_member_count < current_game_member_count_threshold) {
            logger_1.logger.debug(`annoucement game member count under threshold, skip execute announcement. threshold = ${current_game_member_count_threshold}, member count = ${announcement_info.current_game_member_count}`);
            return false;
        }
        // no history, return true
        if (history_list.length == 0 || history_list[0] == undefined) {
            logger_1.logger.info(`annoucenment history not exists, execute announcement.`);
            return true;
        }
        else {
            // get latest history
            const latest_history = history_list[0];
            // check history vs announce time
            if (latest_history.announcement_time >= announcement_info.game_start_time) {
                logger_1.logger.info(`annoucenment history exists already execution, skip execute announcement. final announce time = ${latest_history.announcement_time.toISOString()}, activity start time = ${announcement_info.game_start_time}`);
                return false;
            }
            else {
                return true;
            }
        }
    }
}
exports.CronAnnouncementController = CronAnnouncementController;
//# sourceMappingURL=cron_announcement_controller.js.map