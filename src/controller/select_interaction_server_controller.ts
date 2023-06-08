// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import databace access modules
import { ServerInfoRepository } from '../db/server_info';

// create message modules
import { DiscordMessage } from '../logic/discord_message';

// import entities
import { ServerInfo } from '../entity/server_info';

// import discord modules
import * as Discord from 'discord.js';

// import logic
import { DiscordCommon } from '../logic/discord_common';

export class SelectInteractionServerController {

    public server_info_repo = new ServerInfoRepository();

    /**
     * regist server master
     * @param interaction
     */
    async regist_server_master(interaction: Discord.SelectMenuInteraction, is_check_privillege: boolean = true): Promise<boolean> {
        try {
            // check values
            if (interaction.guild == undefined) {
                throw new Error(`Discord interaction guild is undefined.`);
            }

            logger.info(`request regist server master by selected role.`);

            // check privilleges
            if (DiscordCommon.check_privillege(constants.DISCORD_BOT_ADMIN_USER_ID, interaction.user.id, is_check_privillege) == true) {
                logger.info(`privillege check ok. user id = ${interaction.user.id}`);
            } else {
                logger.error(`failed to privillege check. user id = ${interaction.user.id}`);
                await interaction.reply(constants.DISCORD_MESSAGE_NO_PERMISSION);

                // resolve (no permissions)
                return false;
            }

            // get objects from discord.
            const guild: Discord.Guild = interaction.guild;

            // recruitment role string
            let server_info: ServerInfo = new ServerInfo();

            // get value from interaction
            let target_role: string = Constants.STRING_EMPTY;
            if (interaction.values.length == 0) {
                logger.error(`selected value is not exists.`);
                interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);

                // resolve
                return false;
            } else {
                target_role = interaction.values[0] || Constants.STRING_EMPTY;
                logger.info(`announcement target role = ${target_role}`);
            }

            // create server info instance
            server_info.server_id = interaction.guild.id;
            server_info.channel_id = interaction.channelId;
            server_info.recruitment_target_role = target_role;
            server_info.follow_time = Constants.get_default_date();

            // registration start.
            try {
                // try to insert
                const affected_data_cnt: number = await this.server_info_repo.insert_m_server_info(server_info);
                logger.info(`insert m_server_info completed. affected_data_cnt = ${affected_data_cnt}`);
            } catch (err) {
                // if error, try to update
                logger.info(`insert m_server_info failed, try to update. err = (${err})`);
                const affected_data_cnt: number = await this.server_info_repo.update_m_server_info(server_info);
                logger.info(`update m_server_info completed. affected_data_cnt = ${affected_data_cnt}`);
            }

            // get server info
            server_info = await this.server_info_repo.get_m_server_info(guild.id);
            logger.trace(server_info);

            // send success message
            await interaction.reply({
                content: DiscordMessage.get_regist_server_info(server_info.recruitment_target_role),
                ephemeral: true
            });
        } catch (err) {
            // send error message
            logger.error(`regist server master error.`, err);
            await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

            return false;
        }

        logger.info(`regist server master completed.`);
        return true;
    }
}