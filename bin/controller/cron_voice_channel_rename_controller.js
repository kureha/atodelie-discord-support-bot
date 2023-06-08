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
exports.CronVoiceChannelRenameController = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import entites
const server_info_1 = require("../db/server_info");
// import logic
const discord_common_1 = require("../logic/discord_common");
const game_master_1 = require("../db/game_master");
const activity_history_1 = require("../db/activity_history");
class CronVoiceChannelRenameController {
    constructor() {
        this.server_info_repo = new server_info_1.ServerInfoRepository();
        this.activity_history_rep = new activity_history_1.ActivityHistoryRepository();
        this.game_master_repo = new game_master_1.GameMasterRepository();
    }
    /**
     * update voice channel name for registed server
     * @param client
     * @returns
     */
    update_voice_channel_name(client) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`rename voice channel with cron start.`);
            // loop for guild id
            const server_info_list = yield this.server_info_repo.get_m_server_info_all();
            logger_1.logger.info(`follow server length = ${server_info_list}`);
            // if length is 0, return
            if (server_info_list.length == 0) {
                // resolve
                return false;
            }
            for (const server_info of server_info_list) {
                try {
                    // get guild
                    const guild = client.guilds.resolve(server_info.server_id);
                    if (guild == null) {
                        continue;
                    }
                    // execute main logics
                    yield this.execute_logic_for_guild(guild);
                }
                catch (err) {
                    // send error message
                    logger_1.logger.error(`change channel name failed for error.`, err);
                }
            }
            logger_1.logger.info(`rename voice channel with cron completed.`);
            return true;
        });
    }
    /**
     * rename channel for guild
     * @param guild
     * @returns
     */
    execute_logic_for_guild(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`rename voice channel with playing game activity start. server id = ${guild.id}`);
            // get voice channel id list
            const voice_channel_id_list = discord_common_1.DiscordCommon.get_voice_channel_id_list(guild);
            logger_1.logger.trace(`target voice channel id list : ${voice_channel_id_list}`);
            // check channel member's game name
            for (const channel_id of voice_channel_id_list) {
                yield this.execute_logic_for_channel(guild, channel_id);
            }
            logger_1.logger.info(`rename voice channel with cron completed. server id = ${guild.id}`);
            return true;
        });
    }
    /**
     * rename channel for channel
     * @param guild
     * @param channel_id
     */
    execute_logic_for_channel(guild, channel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info(`check need to update channel name start. voice channel id = ${channel_id}`);
                // get activity history list from database
                const activity_list = yield this.activity_history_rep.get_t_activity_history(guild.id, channel_id, 1);
                logger_1.logger.info(`get latest activity history list completed. result count = ${activity_list.length}`);
                if (activity_list.length == 0 || activity_list[0] == undefined) {
                    logger_1.logger.warn(`activity history is not found, skip.`);
                    return false;
                }
                // fetch channel
                const voice_channel = yield discord_common_1.DiscordCommon.get_voice_channel(guild, channel_id);
                // get target activity history
                const activity_history = activity_list[0];
                // get game name
                let most_playing_game_name = activity_history.game_name;
                // try to get in-channel name
                if (most_playing_game_name.length > 0) {
                    logger_1.logger.info(`get game name alias from master : ${most_playing_game_name}`);
                    most_playing_game_name = yield this.get_game_master_alias_name(guild.id, most_playing_game_name);
                    logger_1.logger.info(`get game name alias succeed : ${most_playing_game_name}`);
                }
                // update change channel name
                const before_channel_name = voice_channel.name;
                logger_1.logger.info(`before update channel name : ${before_channel_name}`);
                // get updated channel name
                const after_channel_name = this.get_update_channel_name(most_playing_game_name, before_channel_name, constants.DISOCRD_UPDATE_CHANNEL_NAME_FORMAT, new RegExp(constants.DISOCRD_UPDATE_CHANNEL_NAME_FORMAT_REGEXP, "m"));
                // update channel name
                logger_1.logger.info(`after update channel name : ${after_channel_name}`);
                // check need to update
                if (before_channel_name == after_channel_name) {
                    logger_1.logger.info(`channel name not changed, not updated.`);
                }
                else {
                    logger_1.logger.info(`channel name *changed*, need to updated. ${before_channel_name} -> ${after_channel_name}`);
                    voice_channel.setName(after_channel_name);
                }
                logger_1.logger.info(`check need to update channel name completed. voice channel id = ${channel_id}`);
            }
            catch (err) {
                // send error message
                logger_1.logger.error(`change channel name failed for error. server id = ${guild.id}`, err);
                return false;
            }
            return true;
        });
    }
    /**
     * update channel name using game name
     * @param now_channel_name
     * @param prefix_regexp
     * @returns
     */
    get_update_channel_name(game_name, now_channel_name, prefix_format, prefix_regexp) {
        // get default channel name
        let channel_name = now_channel_name.replace(prefix_regexp, constants_1.Constants.STRING_EMPTY);
        // update channel name if new game name is exists
        if (game_name.length > 0) {
            channel_name = prefix_format.replace('%%GAME_NAME%%', game_name).replace('%%CHANNEL_NAME%%', channel_name);
        }
        // return channel name
        return channel_name;
    }
    /**
     * get game master setting name by presence name
     * @param server_id
     * @param presence_name
     * @returns
     */
    get_game_master_alias_name(server_id, presence_name) {
        return __awaiter(this, void 0, void 0, function* () {
            // ret value
            let ret = presence_name;
            // serach game master
            const game_master_list = yield this.game_master_repo.get_m_game_master_by_presence_name(server_id, presence_name);
            game_master_list.forEach((v) => {
                if (v.game_name.length > 0) {
                    // if value is enable, input
                    ret = v.game_name;
                }
            });
            // return value
            return ret;
        });
    }
}
exports.CronVoiceChannelRenameController = CronVoiceChannelRenameController;
//# sourceMappingURL=cron_voice_channel_rename_controller.js.map