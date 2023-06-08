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

export class CronVoiceChannelRenameController {

    public server_info_repo = new ServerInfoRepository();
    public activity_history_rep = new ActivityHistoryRepository();
    public game_master_repo = new GameMasterRepository();

    /**
     * update voice channel name for registed server
     * @param client 
     * @returns 
     */
    async update_voice_channel_name(client: Discord.Client): Promise<boolean> {
        logger.info(`rename voice channel with cron start.`);

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
                logger.error(`change channel name failed for error.`, err);
            }
        }

        logger.info(`rename voice channel with cron completed.`);
        return true;
    }

    /**
     * rename channel for guild
     * @param guild 
     * @returns 
     */
    async execute_logic_for_guild(guild: Discord.Guild): Promise<boolean> {
        logger.info(`rename voice channel with playing game activity start. server id = ${guild.id}`);

        // get voice channel id list
        const voice_channel_id_list: string[] = DiscordCommon.get_voice_channel_id_list(guild);
        logger.trace(`target voice channel id list : ${voice_channel_id_list}`);

        // check channel member's game name
        for (const channel_id of voice_channel_id_list) {
            await this.execute_logic_for_channel(guild, channel_id);
        }

        logger.info(`rename voice channel with cron completed. server id = ${guild.id}`);
        return true;
    }

    /**
     * rename channel for channel
     * @param guild 
     * @param channel_id 
     */
    async execute_logic_for_channel(guild: Discord.Guild, channel_id: string): Promise<boolean> {
        try {
            logger.info(`check need to update channel name start. voice channel id = ${channel_id}`);

            // fetch channel
            const voice_channel: Discord.VoiceChannel = await DiscordCommon.get_voice_channel(guild, channel_id);

            // game name lists
            const playing_game_list: string[] = await this.get_playing_game_list(channel_id, guild.members.cache, constants.DISCORD_PRESENCE_IGNORE_NAME_LIST);

            // sort and create list
            const sort_game_list: string[] = this.get_sorted_game_list(playing_game_list);
            logger.info(`channel's playing game list (sorted) : ${voice_channel.id}: ${sort_game_list}`);

            // get game name
            let most_playing_game_name: string = sort_game_list[0] || Constants.STRING_EMPTY;

            // get game count
            let most_playing_game_member_count: number = playing_game_list.filter((game_name: string) => {
                return most_playing_game_name === game_name;
            }).length;

            // try to get in-channel name
            if (most_playing_game_name.length > 0) {
                logger.info(`get game name alias from master : ${most_playing_game_name}`);
                most_playing_game_name = await this.get_game_master_alias_name(guild.id, most_playing_game_name);
                logger.info(`get game name alias succeed : ${most_playing_game_name}`);
            }

            // create activity history and regist
            const total_member_count: number = await this.get_channel_joined_member_count(channel_id, guild.members.cache);
            await this.regist_activity_history(guild.id, channel_id, most_playing_game_name, most_playing_game_member_count, total_member_count);

            // delete history before setting month
            await this.delete_activity_history(guild.id, constants.DISCORD_ACTIVITY_HISTORY_SAVE_LIMIT_MONTH);

            // update change channel name
            const before_channel_name: string = voice_channel.name;
            logger.info(`before update channel name : ${before_channel_name}`);

            // get updated channel name
            const after_channel_name: string = this.get_update_channel_name(
                most_playing_game_name,
                before_channel_name,
                constants.DISOCRD_UPDATE_CHANNEL_NAME_FORMAT,
                new RegExp(constants.DISOCRD_UPDATE_CHANNEL_NAME_FORMAT_REGEXP, "m"));

            // update channel name
            logger.info(`after update channel name : ${after_channel_name}`);

            // check need to update
            if (before_channel_name == after_channel_name) {
                logger.info(`channel name not changed, not updated.`);
            } else {
                logger.info(`channel name *changed*, need to updated. ${before_channel_name} -> ${after_channel_name}`);
                voice_channel.setName(after_channel_name);
            }

            logger.info(`check need to update channel name completed. voice channel id = ${channel_id}`);
        } catch (err) {
            // send error message
            logger.error(`change channel name failed for error. server id = ${guild.id}`, err);

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
    async regist_activity_history(guild_id: string, channel_id: string, most_playing_game_name: string, most_playing_game_member_count: number, total_member_count: number): Promise<number> {
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
        return await this.activity_history_rep.insert_t_activity_history(activity_history);
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
     * get sorted and uniked list
     * @param playing_game_list 
     * @returns 
     */
    get_sorted_game_list(playing_game_list: string[]): string[] {
        // get unique list
        const unique_game_list: string[] = [...new Set(playing_game_list)].sort();

        // sort and return
        unique_game_list.sort((a: string, b: string) => {
            const count_a = playing_game_list.filter((v: string) => { return v == a }).length;
            const count_b = playing_game_list.filter((v: string) => { return v == b }).length;
            return count_b - count_a;
        });

        // return list
        return unique_game_list;
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