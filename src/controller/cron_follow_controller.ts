// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import databace access modules
import { RecruitmentRepository } from '../db/recruitement';
import { ParticipateRepository } from '../db/participate';
import { ServerInfoRepository } from '../db/server_info';

// create message modules
import { DiscordMessage } from '../logic/discord_message';

// import entities
import { Recruitment } from '../entity/recruitment';
import { ServerInfo } from '../entity/server_info';

// import discord modules
import * as Discord from 'discord.js';

// import logics
import { DiscordCommon } from '../logic/discord_common';

export class CronFollowController {
    /**
     * check follow recruitment and send message
     * @param client discord client
     */
    static async follow_recruitment_member(client: Discord.Client): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                // follow to date
                const to_datetime = new Date();
                to_datetime.setMinutes(to_datetime.getMinutes() + constants.DISCORD_FOLLOW_MINUTE);
                logger.info(`follow recruitment cron start. : to_datetime = ${to_datetime.toISOString()}`);

                // create db instances
                const recruitment_repo = new RecruitmentRepository();
                const participate_repo = new ParticipateRepository();
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
                        // get follow lists
                        const recruitment_data_list: Recruitment[] = await recruitment_repo.get_m_recruitment_for_follow(server_info.server_id, server_info.follow_time, to_datetime);
                        logger.info(`select follow data list completed.`);
                        logger.trace(recruitment_data_list);

                        // get join data and send message
                        recruitment_data_list.forEach(async (recruitment_data) => {
                            logger.info(`follow target : name = ${recruitment_data.name}`);

                            // load participate from db
                            recruitment_data.user_list = await participate_repo.get_t_participate(recruitment_data.token);
                            logger.info(`follow target select user list completed. : name = ${recruitment_data.name}, user_list_length = ${recruitment_data.user_list.length}`)

                            // if user more than 0 member, followup executed.
                            if (recruitment_data.user_list.length > 0) {
                                // search channel
                                const text_channel: Discord.TextChannel = DiscordCommon.get_text_channel(client, server_info.channel_id);
                                await text_channel.send({
                                    embeds: [
                                        DiscordMessage.get_join_recruitment_follow_message(recruitment_data, server_info.recruitment_target_role),
                                    ]
                                });
                            }
                        });

                        // update master
                        await server_info_repo.update_m_server_info_follow_time(server_info.server_id, to_datetime);
                        logger.info(`follow recruitment cron completed.`);
                    } catch (err) {
                        // send error message
                        logger.error(`cron command failed for error.`);
                        logger.error(err);
                    } finally {
                        complete_follow_server_length = complete_follow_server_length + 1;
                        logger.info(`follow one server completed. now = ${complete_follow_server_length}, task total = ${server_info_list.length}`);

                        // check could be resolve
                        if (complete_follow_server_length == server_info_list.length) {
                            logger.info(`complete all follow server. resolve.`);
                            // resolve
                            resolve(true);
                        }
                    }
                });
            } catch (err) {
                // send error message
                logger.error(err);

                // reject
                reject(`cron command error. error = ${err}`);
            }
        });
    }
};