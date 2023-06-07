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

export class CronVoiceChannelRenameController {
    /**
     * update voice channel name for registed server
     * @param client 
     * @returns 
     */
    static async update_voice_channel_name(client: Discord.Client): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            logger.info(`rename voice channel with cron start.`);

            // create db instances
            const server_info_repo = new ServerInfoRepository();

            // loop for guild id
            const server_info_list: ServerInfo[] = await server_info_repo.get_m_server_info_all();
            logger.info(`follow server length = ${server_info_list}`);

            // if length is 0, return
            if (server_info_list.length == 0) {
                // resolve
                resolve(false);
            }

            let complete_follow_server_length: number = 0;
            server_info_list.forEach(async (server_info: ServerInfo) => {
                try {
                    // get guild
                    const guild: Discord.Guild | null = client.guilds.resolve(server_info.server_id);
                    if (guild == null) {
                        return;
                    }

                    // execute main logics
                    await this.execute_logic_for_guild(guild);
                } catch (err) {
                    // send error message
                    logger.error(`change channel name failed for error.`);
                    logger.error(err);
                } finally {
                    complete_follow_server_length = complete_follow_server_length + 1;
                    logger.info(`rename voice channel with cron completed.`);

                    // check could be resolve
                    if (complete_follow_server_length == server_info_list.length) {
                        // resolve
                        resolve(true);
                    }
                }
            });
        });
    }

    /**
     * rename channel for guild
     * @param guild 
     * @returns 
     */
    static async execute_logic_for_guild(guild: Discord.Guild): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            logger.info(`rename voice channel with playing game activity start. server id = ${guild.id}`);

            try {
                // get voice channel id list
                const voice_channel_id_list: string[] = DiscordCommon.get_voice_channel_id_list(guild);
                logger.trace(`target voice channel id list : ${voice_channel_id_list}`);

                // check channel member's game name
                let complete_voice_channel_id_length: number = 0;
                voice_channel_id_list.forEach(async (channel_id: string) => {
                    try {
                        logger.info(`check need to update channel name start. voice channel id = ${channel_id}`);

                        // fetch channel
                        const voice_channel: Discord.VoiceChannel = await DiscordCommon.get_voice_channel(guild, channel_id);

                        // game name lists
                        const playing_game_list: string[] = await this.get_playing_game_list(channel_id, guild.members.cache);

                        // sort and create list
                        const sort_game_list: string[] = this.get_sorted_game_list(playing_game_list);
                        logger.info(`channel's playing game list (sorted) : ${voice_channel.id}: ${sort_game_list}`);

                        // get game name
                        const most_playing_game_name: string = sort_game_list[0] || Constants.STRING_EMPTY;

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
                        logger.error(`change channel name failed for error. server id = ${guild.id}`);
                        logger.error(err);
                    } finally {
                        complete_voice_channel_id_length = complete_voice_channel_id_length + 1;
                        logger.info(`rename voice channel with cron completed. server id = ${guild.id}`);

                        // check could be resolve
                        if (complete_voice_channel_id_length == voice_channel_id_list.length) {
                            // resolve
                            resolve(true);
                        }
                    }
                });
            } catch (err) {
                // send error message
                logger.error(`change channel name failed for error. server id = ${guild.id}`);
                logger.error(err);
                reject(err);
            }
        });
    }

    /**
     * update channel name using game name
     * @param now_channel_name 
     * @param prefix_regexp 
     * @returns 
     */
    static get_update_channel_name(game_name: string, now_channel_name: string, prefix_format: string, prefix_regexp: RegExp): string {
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
    static get_sorted_game_list(playing_game_list: string[]): string[] {
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
     * get playing game list from channel
     * @param channel_id 
     * @param member_list
     * @returns playing game list
     */
    static async get_playing_game_list(channel_id: string, member_list: Discord.Collection<string, Discord.GuildMember>): Promise<string[]> {
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
            const activity_name: string = this.get_playing_game_name(member.presence);
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
    static get_playing_game_name(presence: Discord.Presence | null): string {
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
        // check type - get only 'playing'
        if (activity.type == Discord.ActivityType.Playing) {
            // get game name
            game_name = activity.name;
        }

        // return value
        return game_name;
    }
}