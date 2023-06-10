"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.CronActivityRecordController = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import discord modules
const Discord = __importStar(require("discord.js"));
// import entites
const server_info_1 = require("../db/server_info");
// import logic
const discord_common_1 = require("../logic/discord_common");
const game_master_1 = require("../db/game_master");
const activity_history_1 = require("../entity/activity_history");
const activity_history_2 = require("../db/activity_history");
class CronActivityRecordController {
    constructor() {
        this.server_info_repo = new server_info_1.ServerInfoRepository();
        this.activity_history_rep = new activity_history_2.ActivityHistoryRepository();
        this.game_master_repo = new game_master_1.GameMasterRepository();
    }
    /**
     * activity history regist for registed server
     * @param client
     * @returns
     */
    activity_history_regist(client) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`activity history regist with cron start.`);
            // loop for guild id
            const server_info_list = yield this.server_info_repo.get_m_server_info_all();
            logger_1.logger.info(`follow server length = ${server_info_list}`);
            // if length is 0, return
            if (server_info_list.length == 0) {
                // resolve
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
                    if ((yield this.execute_logic_for_guild(guild)) == false) {
                        total_result = false;
                    }
                }
                catch (err) {
                    logger_1.logger.error(`activity history regist failed for error.`, err);
                    total_result = false;
                }
            }
            logger_1.logger.info(`activity history regist with cron completed. result = ${total_result}`);
            return total_result;
        });
    }
    /**
     * activity history regist for guild
     * @param guild
     * @returns
     */
    execute_logic_for_guild(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`activity history regist with playing game activity start. server id = ${guild.id}`);
            // get voice channel id list
            const voice_channel_id_list = discord_common_1.DiscordCommon.get_voice_channel_id_list(guild);
            logger_1.logger.trace(`target voice channel id list : ${voice_channel_id_list}`);
            // total result
            let total_result = true;
            // check channel member's game name
            for (const channel_id of voice_channel_id_list) {
                if ((yield this.execute_logic_for_channel(guild, channel_id)) == false) {
                    total_result = false;
                }
            }
            logger_1.logger.info(`activity history regist with cron completed. server id = ${guild.id}, result = ${total_result}`);
            return total_result;
        });
    }
    /**
     * activity history regist for channel
     * @param guild
     * @param channel_id
     */
    execute_logic_for_channel(guild, channel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info(`activity history regist for channel name start. voice channel id = ${channel_id}`);
                // game name lists
                const playing_game_list = yield this.get_playing_game_list(channel_id, guild.members.cache, constants.DISCORD_PRESENCE_IGNORE_NAME_LIST);
                // get most playing game name and player count
                const most_playing_game_name = this.get_most_playing_game_name(playing_game_list);
                const player_count = this.get_game_player_count(most_playing_game_name, playing_game_list);
                // get total member count
                const total_member_count = yield this.get_channel_joined_member_count(channel_id, guild.members.cache);
                // regist history
                const result = yield this.regist_activity_history(guild.id, channel_id, most_playing_game_name, player_count, total_member_count);
                logger_1.logger.info(`insert activity history completed. data = ${JSON.stringify(result)}`);
                // delete history before setting month
                const result_count = yield this.delete_activity_history(guild.id, constants.DISCORD_ACTIVITY_HISTORY_SAVE_LIMIT_MONTH);
                logger_1.logger.info(`cleanup old activity history completed. affected rows count = ${result_count}, before month = ${constants.DISCORD_ACTIVITY_HISTORY_SAVE_LIMIT_MONTH}`);
                logger_1.logger.info(`activity history regist completed. voice channel id = ${channel_id}`);
            }
            catch (err) {
                // send error message
                logger_1.logger.error(`activity history regist failed for error. server id = ${guild.id}`, err);
                return false;
            }
            return true;
        });
    }
    /**
     * regist activity history
     * @param guild_id
     * @param channel_id
     * @param most_playing_game_name
     * @param most_playing_game_member_count
     * @param total_member_count
     */
    regist_activity_history(guild_id, channel_id, most_playing_game_name, most_playing_game_member_count, total_member_count) {
        return __awaiter(this, void 0, void 0, function* () {
            // create activity history and regist
            let activity_history = new activity_history_1.ActivityHistory();
            activity_history.server_id = guild_id;
            activity_history.channel_id = channel_id;
            activity_history.game_name = most_playing_game_name;
            activity_history.member_count = most_playing_game_member_count;
            activity_history.total_member_count = total_member_count;
            activity_history.change_time = new Date();
            activity_history.regist_time = new Date();
            activity_history.update_time = new Date();
            activity_history.delete = false;
            // insert to table
            const result = yield this.activity_history_rep.insert_t_activity_history(activity_history);
            // check and return
            if (result == 1) {
                return activity_history;
            }
            else {
                throw new Error(`activity history regist failed.`);
            }
        });
    }
    /**
     * delete activity history
     * @param guild_id
     * @param month_limit
     * @returns
     */
    delete_activity_history(guild_id, month_limit) {
        return __awaiter(this, void 0, void 0, function* () {
            // delete history before 1 month
            let delete_date_from = new Date();
            delete_date_from.setMonth(delete_date_from.getMonth() - month_limit);
            return yield this.activity_history_rep.delete_t_activity_history(guild_id, delete_date_from);
        });
    }
    /**
     * get most playing game name
     * @param playing_game_list playing game list (not unique!)
     * @returns most playing game. if not get, return blank
     */
    get_most_playing_game_name(playing_game_list) {
        let game_name = '';
        // get unique game list
        let most_play_count = 0;
        const unique_game_list = [...new Set(playing_game_list)].sort();
        // loop logic
        unique_game_list.forEach((unique_game_name) => {
            // get playing count
            const play_count = this.get_game_player_count(unique_game_name, playing_game_list);
            // compare playing count
            if (play_count > most_play_count) {
                // if most played, get game name and play count
                game_name = unique_game_name;
                most_play_count = play_count;
            }
            else if (play_count == most_play_count) {
                // if equal, game name compare and get name
                game_name = [game_name, unique_game_name].sort()[0];
            }
        });
        return game_name;
    }
    /**
     * get game player count
     * @param target_game_name target game name
     * @param playing_game_list playing list
     * @returns number
     */
    get_game_player_count(target_game_name, playing_game_list) {
        return playing_game_list.filter((game_name) => {
            return target_game_name == game_name;
        }).length;
    }
    /**
     * get chgannel joined member count
     * @param channel_id
     * @param member_list
     * @returns playing game list
     */
    get_channel_joined_member_count(channel_id, member_list) {
        return __awaiter(this, void 0, void 0, function* () {
            // define return value
            let ret = 0;
            // scanned member list
            member_list.forEach((member) => {
                // get joined voice channel
                const voice_channel = member.voice.channel;
                if (voice_channel == null || voice_channel.id != channel_id) {
                    return;
                }
                // countup member
                ret = ret + 1;
            });
            // return value
            return ret;
        });
    }
    /**
     * get playing game list from channel
     * @param channel_id
     * @param member_list
     * @returns playing game list
     */
    get_playing_game_list(channel_id, member_list, ignore_list = []) {
        return __awaiter(this, void 0, void 0, function* () {
            // define return value
            const game_list = [];
            // scanned member list
            member_list.forEach((member) => {
                // get joined voice channel
                const voice_channel = member.voice.channel;
                if (voice_channel == null || voice_channel.id != channel_id) {
                    return;
                }
                // get game name and push to list
                const activity_name = this.get_playing_game_name(member.presence, ignore_list);
                if (activity_name.length > 0) {
                    game_list.push(activity_name);
                }
            });
            // return value
            return game_list;
        });
    }
    /**
     * get playing game name from guild member's presence
     * @param presence
     * @returns game name. if can't get game name, return blank string
     */
    get_playing_game_name(presence, ignore_list = []) {
        // ret value
        let game_name = '';
        // check member presence
        if (presence == null) {
            // if null, return blank string.
            return game_name;
        }
        // get activity list
        const activitie_list = presence.activities;
        // checn activity list length
        if (activitie_list.length == 0 || presence.activities[0] == null) {
            // if activity is blank or null, return blank string.
            return game_name;
        }
        // get actucal activity
        const activity = presence.activities[0];
        // check type - get 'playing' or 'streaming'
        if (activity.type == Discord.ActivityType.Playing || activity.type == Discord.ActivityType.Streaming) {
            // check in ignore list
            if (ignore_list.includes(activity.name) == false) {
                // get game name
                game_name = activity.name;
            }
        }
        // return value
        return game_name;
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
exports.CronActivityRecordController = CronActivityRecordController;
//# sourceMappingURL=cron_activity_controller.js.map