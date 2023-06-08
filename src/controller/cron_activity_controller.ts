// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import discord modules
import * as Discord from 'discord.js';

// import entites
import { ServerInfoRepository } from '../db/server_info';
import { ServerInfo } from '../entity/server_info';

// import logic
import { DiscordCommon } from '../logic/discord_common';
import { GameMasterRepository } from '../db/game_master';
import { GameMaster } from '../entity/game_master';
import { ActivityHistory } from '../entity/activity_history';
import { ActivityHistoryRepository } from '../db/activity_history';

export class CronActivityRecordController {

    public server_info_repo = new ServerInfoRepository();
    public activity_history_rep = new ActivityHistoryRepository();
    public game_master_repo = new GameMasterRepository();

    /**
     * activity history regist for registed server
     * @param client 
     * @returns 
     */
    async activity_history_regist(client: Discord.Client): Promise<boolean> {
        logger.info(`activity history regist with cron start.`);

        // loop for guild id
        const server_info_list: ServerInfo[] = await this.server_info_repo.get_m_server_info_all();
        logger.info(`follow server length = ${server_info_list}`);

        // if length is 0, return
        if (server_info_list.length == 0) {
            // resolve
            return false;
        }

        for (const server_info of server_info_list) {
            try {
                // get guild
                const guild: Discord.Guild | null = client.guilds.resolve(server_info.server_id);
                if (guild == null) {
                    continue;
                }

                // execute main logics
                await this.execute_logic_for_guild(guild);
            } catch (err) {
                // send error message
                logger.error(`activity history regist failed for error.`, err);
            }
        }

        logger.info(`activity history regist with cron completed.`);
        return true;
    }

    /**
     * activity history regist for guild
     * @param guild 
     * @returns 
     */
    async execute_logic_for_guild(guild: Discord.Guild): Promise<boolean> {
        logger.info(`activity history regist with playing game activity start. server id = ${guild.id}`);

        // get voice channel id list
        const voice_channel_id_list: string[] = DiscordCommon.get_voice_channel_id_list(guild);
        logger.trace(`target voice channel id list : ${voice_channel_id_list}`);

        // check channel member's game name
        for (const channel_id of voice_channel_id_list) {
            await this.execute_logic_for_channel(guild, channel_id);
        }

        logger.info(`activity history regist with cron completed. server id = ${guild.id}`);
        return true;
    }

    /**
     * activity history regist for channel
     * @param guild 
     * @param channel_id 
     */
    async execute_logic_for_channel(guild: Discord.Guild, channel_id: string): Promise<boolean> {
        try {
            logger.info(`activity history regist for channel name start. voice channel id = ${channel_id}`);

            // game name lists
            const playing_game_list: string[] = await this.get_playing_game_list(channel_id, guild.members.cache, constants.DISCORD_PRESENCE_IGNORE_NAME_LIST);

            // get most playing game name and player count
            const most_playing_game_name = this.get_most_playing_game_name(playing_game_list);
            const player_count = this.get_game_player_count(most_playing_game_name, playing_game_list);

            // get total member count
            const total_member_count: number = await this.get_channel_joined_member_count(channel_id, guild.members.cache);

            // regist history
            const result = await this.regist_activity_history(guild.id, channel_id, most_playing_game_name, player_count, total_member_count);
            logger.info(`insert activity history completed. data = ${JSON.stringify(result)}`);

            // delete history before setting month
            const result_count = await this.delete_activity_history(guild.id, constants.DISCORD_ACTIVITY_HISTORY_SAVE_LIMIT_MONTH);
            logger.info(`cleanup old activity history completed. affected rows count = ${result_count}, before month = ${constants.DISCORD_ACTIVITY_HISTORY_SAVE_LIMIT_MONTH}`);

            logger.info(`activity history regist completed. voice channel id = ${channel_id}`);
        } catch (err) {
            // send error message
            logger.error(`activity history regist failed for error. server id = ${guild.id}`, err);

            return false;
        }

        return true;
    }

    /**
     * regist activity history
     * @param activity_history_rep 
     * @param guild_id 
     * @param channel_id 
     * @param most_playing_game_name 
     * @param most_playing_game_member_count 
     * @param total_member_count
     */
    async regist_activity_history(guild_id: string, channel_id: string, most_playing_game_name: string, most_playing_game_member_count: number, total_member_count: number): Promise<ActivityHistory> {
        // create activity history and regist
        let activity_history: ActivityHistory = new ActivityHistory();
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
        const result = await this.activity_history_rep.insert_t_activity_history(activity_history);

        // check and return
        if (result == 1) {
            return activity_history;
        } else {
            throw new Error(`activity history regist failed.`);
        }
    }

    /**
     * delete activity history 
     * @param activity_history_rep 
     * @param guild_id 
     * @param month_limit 
     * @returns 
     */
    async delete_activity_history(guild_id: string, month_limit: number): Promise<number> {
        // delete history before 1 month
        let delete_date_from = new Date();
        delete_date_from.setMonth(delete_date_from.getMonth() - 1);
        return await this.activity_history_rep.delete_t_activity_history(guild_id, delete_date_from);
    }

    /**
     * update channel name using game name
     * @param now_channel_name 
     * @param prefix_regexp 
     * @returns 
     */
    get_update_channel_name(game_name: string, now_channel_name: string, prefix_format: string, prefix_regexp: RegExp): string {
        // get default channel name
        let channel_name: string = now_channel_name.replace(prefix_regexp, Constants.STRING_EMPTY);

        // update channel name if new game name is exists
        if (game_name.length > 0) {
            channel_name = prefix_format.replace('%%GAME_NAME%%', game_name).replace('%%CHANNEL_NAME%%', channel_name);
        }

        // return channel name
        return channel_name;
    }

    /**
     * get most playing game name
     * @param playing_game_list playing game list (not unique!)
     * @returns most playing game. if not get, return blank
     */
    get_most_playing_game_name(playing_game_list: string[]): string {
        let game_name: string = '';

        // get unique game list
        let most_play_count: number = 0;
        const unique_game_list: string[] = [...new Set(playing_game_list)].sort();

        // loop logic
        unique_game_list.forEach((unique_game_name: string) => {
            // get playing count
            const play_count = this.get_game_player_count(unique_game_name, playing_game_list);

            // compare playing count
            if (play_count > most_play_count) {
                // if most played, get game name and play count
                game_name = unique_game_name;
                most_play_count = play_count;
            } else if (play_count == most_play_count) {
                // if equal, game name compare and get name
                game_name = [game_name, unique_game_name].sort()[0] || '';
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
    get_game_player_count(target_game_name: string, playing_game_list: string[]) {
        return playing_game_list.filter((game_name: string) => {
            return target_game_name == game_name;
        }).length;
    }

    /**
     * get chgannel joined member count
     * @param channel_id 
     * @param member_list
     * @returns playing game list
     */
    async get_channel_joined_member_count(channel_id: string, member_list: Discord.Collection<string, Discord.GuildMember>): Promise<number> {
        // define return value
        let ret: number = 0;

        // scanned member list
        member_list.forEach((member: Discord.GuildMember) => {
            // get joined voice channel
            const voice_channel: Discord.VoiceBasedChannel | null = member.voice.channel;
            if (voice_channel == null || voice_channel.id != channel_id) {
                return;
            }

            // countup member
            ret = ret + 1;
        });

        // return value
        return ret;
    }

    /**
     * get playing game list from channel
     * @param channel_id 
     * @param member_list
     * @returns playing game list
     */
    async get_playing_game_list(channel_id: string, member_list: Discord.Collection<string, Discord.GuildMember>, ignore_list: string[] = []): Promise<string[]> {
        // define return value
        const game_list: string[] = [];

        // scanned member list
        member_list.forEach((member: Discord.GuildMember) => {
            // get joined voice channel
            const voice_channel: Discord.VoiceBasedChannel | null = member.voice.channel;
            if (voice_channel == null || voice_channel.id != channel_id) {
                return;
            }

            // get game name and push to list
            const activity_name: string = this.get_playing_game_name(member.presence, ignore_list);
            if (activity_name.length > 0) {
                game_list.push(activity_name);
            }
        });

        // return value
        return game_list;
    }

    /**
     * get playing game name from guild member's presence
     * @param presence 
     * @returns game name. if can't get game name, return blank string
     */
    get_playing_game_name(presence: Discord.Presence | null, ignore_list: string[] = []): string {
        // ret value
        let game_name: string = '';

        // check member presence
        if (presence == null) {
            // if null, return blank string.
            return game_name;
        }

        // get activity list
        const activitie_list: Discord.Activity[] = presence.activities;

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
    async get_game_master_alias_name(server_id: string, presence_name: string): Promise<string> {
        // ret value
        let ret: string = presence_name;

        // serach game master
        const game_master_list: GameMaster[] = await this.game_master_repo.get_m_game_master_by_presence_name(server_id, presence_name);
        game_master_list.forEach((v: GameMaster) => {
            if (v.game_name.length > 0) {
                // if value is enable, input
                ret = v.game_name;
            }
        });

        // return value
        return ret;
    }
}