// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import modules
import { RecruitmentRepository } from './../db/recruitement';
import { ParticipateRepository } from '../db/participate';
import { ServerInfoRepository } from '../db/server_info';

// create message modules
import { DiscordMessageManager } from './../logic/discord_message_manager';

// import entities
import { Recruitment } from '../entity/recruitment';
import { Participate } from '../entity/participate';
import { ServerInfo } from '../entity/server_info';

// import discord modules
import * as Discord from 'discord.js';

export class CronController {
    /**
     * Get Text Channel from Discord
     * @param client 
     * @param channel_id 
     * @returns discord channel. if error, throw error
     */
    static get_text_channel(client: Discord.Client, channel_id: string): Discord.TextChannel {
        if (client.channels.cache.get(channel_id) == undefined) {
            // check channel exists
            throw new Error(`Target channel is not exists.`);
        } else if (client.channels.cache.get(channel_id)?.isText() != false) {
            // check target channel is text channel
            throw new Error(`Target channel is not text channel.`);
        }

        // return values
        return client.channels.cache.get(channel_id) as Discord.TextChannel;
    }

    /**
     * check follow recruitment and send message
     * @param client discord client
     */
    static follow_recruitment_member(client: Discord.Client) {
        // follow to date
        const to_datetime = new Date();
        to_datetime.setMinutes(to_datetime.getMinutes() + constants.DISCORD_FOLLOW_MINUTE);
        logger.info(`follow recruitment cron start. : to_datetime = ${to_datetime.toISOString()}`);

        // create db instances
        const recruitment_repo = new RecruitmentRepository();
        const participate_repo = new ParticipateRepository();
        const server_info_repo = new ServerInfoRepository();

        // create message manager instance
        const messageManager = new DiscordMessageManager();

        // loop for guild id
        client.guilds.cache.forEach((guild: Discord.Guild) => {
            let server_info_data = new ServerInfo();

            // get server info (send target channel, get latest follow_time)
            server_info_repo.get_m_server_info(guild.id)
                .then((temp_server_info_data: ServerInfo) => {
                    server_info_data = temp_server_info_data;
                    logger.info(`cron message sended guild info : server_id = ${server_info_data.server_id}, channel_id = ${server_info_data.channel_id}, from_time = ${server_info_data.follow_time.toLocaleString()}, to_time = ${to_datetime.toLocaleString()}`)

                    // get follow lists
                    return recruitment_repo.get_m_recruitment_for_follow(server_info_data.server_id, server_info_data.follow_time, to_datetime);
                })
                .then((recruitment_data_list: Recruitment[]) => {
                    logger.info(`select follow data list completed.`)
                    logger.trace(recruitment_data_list);

                    // get join data and send message
                    recruitment_data_list.forEach((recruitment_data) => {
                        logger.info(`follow target : name = ${recruitment_data.name}`)
                        participate_repo.get_t_participate(recruitment_data.token)
                            .then((user_list: Participate[]) => {
                                logger.info(`follow target select user list completed. : name = ${recruitment_data.name}, user_list_length = ${user_list.length}`)
                                // get user list
                                recruitment_data.user_list = user_list;
                                // if user more than 0 member, followup executed.
                                if (recruitment_data.user_list.length > 0) {
                                    // search channel
                                    const text_channel: Discord.TextChannel = CronController.get_text_channel(client, server_info_data.channel_id);
                                    text_channel.send({
                                        embeds: [
                                            messageManager.get_join_recruitment_follow_message(recruitment_data, server_info_data.recruitment_target_role),
                                        ]
                                    });
                                }
                            })
                    })
                })
                .then(() => {
                    // update master
                    server_info_repo.update_m_server_info_follow_time(server_info_data.server_id, to_datetime);
                    logger.info(`follow recruitment cron completed.`);
                })
                .catch((err: any) => {
                    // send error message
                    logger.error(`cron command failed for error.`);
                    logger.error(err);
                });
        });
    }
};