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

            // get activity history list from database
            const activity_list: ActivityHistory[] = await this.activity_history_rep.get_t_activity_history(guild.id, channel_id, 1);
            logger.info(`get latest activity history list completed. result count = ${activity_list.length}`);
            if (activity_list.length == 0 || activity_list[0] == undefined) {
                logger.warn(`activity history is not found, skip.`);
                return false;
            }

            // fetch channel
            const voice_channel: Discord.VoiceChannel = await DiscordCommon.get_voice_channel(guild, channel_id);

            // get target activity history
            const activity_history: ActivityHistory = activity_list[0];

            // get game name
            let most_playing_game_name: string = activity_history.game_name;

            // try to get in-channel name
            if (most_playing_game_name.length > 0) {
                logger.info(`get game name alias from master : ${most_playing_game_name}`);
                most_playing_game_name = await this.get_game_master_alias_name(guild.id, most_playing_game_name);
                logger.info(`get game name alias succeed : ${most_playing_game_name}`);
            }

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