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

    public recruitment_repo = new RecruitmentRepository();
    public participate_repo = new ParticipateRepository();
    public server_info_repo = new ServerInfoRepository();

    /**
     * check follow recruitment and send message
     * @param client discord client
     */
    async follow_recruitment_member(client: Discord.Client): Promise<boolean> {
        try {
            // follow to date
            const to_datetime = new Date();
            to_datetime.setMinutes(to_datetime.getMinutes() + constants.DISCORD_FOLLOW_MINUTE);
            logger.info(`follow recruitment cron start. : to_datetime = ${to_datetime.toISOString()}`);

            // loop for guild id
            const server_info_list: ServerInfo[] = await this.server_info_repo.get_m_server_info_all();
            logger.info(`follow server length = ${server_info_list}`);

            // if length is 0, return
            if (server_info_list.length == 0) {
                // resolve
                return false;
            }

            // execute for loop
            for (const server_info of server_info_list) {
                await this.execute_logic_for_guild(client, server_info, to_datetime);
            }
        } catch (err) {
            // send error message
            logger.error(`cron command error.`, err);

            return false;
        }

        logger.info(`follow one server completed.`);
        return true;
    }

    /**
     * follor for guild
     * @param client 
     * @param server_info 
     * @param to_datetime 
     */
    async execute_logic_for_guild(client: Discord.Client, server_info: ServerInfo, to_datetime: Date): Promise<boolean> {
        try {
            // get follow lists
            const recruitment_data_list: Recruitment[] = await this.recruitment_repo.get_m_recruitment_for_follow(server_info.server_id, server_info.follow_time, to_datetime);
            logger.info(`select follow data list completed.`);
            logger.trace(recruitment_data_list);

            // get join data and send message
            recruitment_data_list.forEach(async (recruitment_data) => {
                logger.info(`follow target : name = ${recruitment_data.name}`);

                // load participate from db
                recruitment_data.user_list = await this.participate_repo.get_t_participate(recruitment_data.token);
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
            await this.server_info_repo.update_m_server_info_follow_time(server_info.server_id, to_datetime);
            logger.info(`follow recruitment cron completed.`);
        } catch (err) {
            // send error message
            logger.error(`cron command failed for error.`, err);

            return false;
        };

        return true;
    }
};