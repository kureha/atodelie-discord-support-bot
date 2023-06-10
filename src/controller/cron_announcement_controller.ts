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
import { ActivityHistory } from '../entity/activity_history';
import { ActivityHistoryRepository } from '../db/activity_history';
import { AnnouncementHistory } from '../entity/announcement_history';
import { AnnouncementHistoryRepository } from '../db/announcement_history';
import { AnnouncementInfo } from '../entity/announcement_info';
import { DiscordMessage } from '../logic/discord_message';
import { GameMaster } from '../entity/game_master';
import { GameMasterRepository } from '../db/game_master';

export class CronAnnouncementController {

    public server_info_repo = new ServerInfoRepository();
    public activity_history_rep = new ActivityHistoryRepository();
    public announcement_rep = new AnnouncementHistoryRepository();
    public game_master_repo = new GameMasterRepository();

    /**
     * auto announcement activity for registed server
     * @param client 
     * @returns 
     */
    async auto_annoucement(client: Discord.Client): Promise<boolean> {
        logger.info(`annoucement with cron start.`);

        // loop for guild id
        const server_info_list: ServerInfo[] = await this.server_info_repo.get_m_server_info_all();
        logger.info(`follow server length = ${server_info_list}`);

        // if length is 0, return
        if (server_info_list.length == 0) {
            return false;
        }

        // total result
        let total_result: boolean = true;
        for (const server_info of server_info_list) {
            try {
                // get guild
                const guild: Discord.Guild | null = client.guilds.resolve(server_info.server_id);
                if (guild == null) {
                    logger.warn(`guild is null, can't regist history.`);
                    total_result = false;
                    continue;
                }

                // execute main logics
                if (await this.execute_logic_for_guild(guild, server_info.channel_id, server_info.recruitment_target_role) == false) {
                    total_result = false;
                }
            } catch (err) {
                logger.error(`annoucement failed for error.`, err);
                total_result = false;
            };
        };

        logger.info(`annoucement with cron completed. result = ${total_result}`);
        return total_result;
    }

    /**
     * auto announcement activity for guild
     * @param guild 
     * @param announce_channel_id
     * @returns 
     */
    async execute_logic_for_guild(guild: Discord.Guild, announce_channel_id: string, announce_target_role: string): Promise<boolean> {
        logger.info(`annoucement with playing game activity start. server id = ${guild.id}`);

        // get voice channel id list
        const voice_channel_id_list: string[] = DiscordCommon.get_voice_channel_id_list(guild);
        logger.trace(`target voice channel id list : ${voice_channel_id_list}`);

        // total result
        let total_result: boolean = true;

        // check channel member's game name
        for (const channel_id of voice_channel_id_list) {
            if (await this.execute_logic_for_channel(guild, announce_channel_id, announce_target_role, channel_id) == false) {
                total_result = false;
            }
        };

        logger.info(`annoucement with cron completed. server id = ${guild.id}, result = ${total_result}`);
        return total_result;
    }

    /**
     * auto announcement activity for channel
     * @param guild 
     * @param announce_channel_id 
     * @param announce_target_role 
     * @param channel_id 
     */
    async execute_logic_for_channel(guild: Discord.Guild, announce_channel_id: string, announce_target_role: string, channel_id: string): Promise<boolean> {
        try {
            logger.info(`check need announcet start. voice channel id = ${channel_id}`);

            // get activity history (constants length select)
            const activity_list: ActivityHistory[] = await this.activity_history_rep.get_t_activity_history(guild.id, channel_id, constants.DISCORD_AUTO_RE_ANNOUNCEMENT_COUNT_THRESHOLD);
            logger.info(`get activity history list completed. result count = ${activity_list.length}, thresould = ${constants.DISCORD_AUTO_RE_ANNOUNCEMENT_COUNT_THRESHOLD}`);

            // get announcement history (single select)
            const announcement_history: AnnouncementHistory[] = await this.announcement_rep.get_t_announcement(guild.id, channel_id, 1);
            logger.info(`get announcement history list completed. result count = ${announcement_history.length}`);

            // extract announcement information
            const announcement_info: AnnouncementInfo = this.extract_announcement(activity_list);
            logger.info(`check announcement info. announcement_info = ${JSON.stringify(announcement_info)}, member_threshold = ${constants.DISCORD_AUTO_ANNOUNCEMENT_MEMBER_THRESHOLD}`);

            // judge need announcement
            const need_announcement: boolean = this.is_exec_announcement(announcement_info, announcement_history, constants.DISCORD_AUTO_ANNOUNCEMENT_MEMBER_THRESHOLD);
            logger.info(`judge for need announcement completed. result = ${need_announcement}`);

            if (need_announcement == true) {
                // execute announcement
                logger.info(`announcement is NEEDED.`);

                // insert history
                const count = await this.announcement_rep.insert_t_announcement(announcement_info.to_history());
                if (count == 1) {
                    logger.info(`announcement history insert completed. result count = ${count}`);
                } else {
                    throw new Error(`announcement history insert failed. result count = ${count}`);
                }

                // get game master and get alias name
                const game_info_list: GameMaster[] = await this.game_master_repo.get_m_game_master_by_presence_name(guild.id, announcement_info.game_name);
                let game_name: string = '';
                if (game_info_list.length > 0 && game_info_list[0] != undefined) {
                    const game_info: GameMaster = game_info_list[0];
                    game_name = game_info.game_name;
                }
                // if can't get alias name, set announcement info's game name
                if (game_name.length == 0) {
                    game_name = announcement_info.game_name;
                }

                // send auto announcement message
                const text_channel: Discord.TextChannel = DiscordCommon.get_text_channel(guild.client, announce_channel_id);
                logger.info(DiscordMessage.get_auto_announcement_message(constants.DISCORD_MESSAGE_SELECT_AUTO_ANNOUNCEMENT, announce_target_role, channel_id, game_name));
                await text_channel.send(
                    DiscordMessage.get_auto_announcement_message(constants.DISCORD_MESSAGE_SELECT_AUTO_ANNOUNCEMENT, announce_target_role, channel_id, game_name)
                );
            } else {
                // no announcement
                logger.info(`announcement is NOT needed.`);
            }
        } catch (err) {
            // send error message
            logger.error(`annoucement failed for error. server id = ${guild.id}`, err);
            return false;
        };

        logger.error(`annoucement completed. server id = ${guild.id}`);
        return true;
    }

    /**
     * extract announcement information
     * @param activity_list 
     * @returns 
     */
    extract_announcement(activity_list: ActivityHistory[]): AnnouncementInfo {
        let announcement_info = new AnnouncementInfo();

        if (activity_list.length > 0) {
            announcement_info.server_id = activity_list[0]?.server_id || '';
            announcement_info.channel_id = activity_list[0]?.channel_id || '';
        }

        // loop and judge
        let skip_flag = false;
        activity_list.forEach((activity: ActivityHistory, idx: number) => {
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
    is_exec_announcement(announcement_info: AnnouncementInfo, history_list: AnnouncementHistory[], current_game_member_count_threshold: number): boolean {
        // check announcement, no game name is no needs announcement.
        if (announcement_info.game_name.length == 0) {
            logger.debug(`annoucement game name is blank, skip execute announcement.`);
            return false;
        }

        // check current member count threshold, under count is no needs announcement.npx
        if (announcement_info.current_game_member_count < current_game_member_count_threshold) {
            logger.debug(`annoucement game member count under threshold, skip execute announcement. threshold = ${current_game_member_count_threshold}, member count = ${announcement_info.current_game_member_count}`);
            return false;
        }

        // no history, return true
        if (history_list.length == 0 || history_list[0] == undefined) {
            logger.info(`annoucenment history not exists, execute announcement.`);
            return true;
        } else {
            // get latest history
            const latest_history: AnnouncementHistory = history_list[0];

            // check history vs announce time
            if (latest_history.announcement_time >= announcement_info.game_start_time) {
                logger.info(`annoucenment history exists already execution, skip execute announcement. final announce time = ${latest_history.announcement_time.toISOString()}, activity start time = ${announcement_info.game_start_time}`);
                return false;
            } else {
                return true;
            }
        }
    }
}