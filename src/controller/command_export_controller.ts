// import discord modules
import * as Discord from 'discord.js';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import logger
import { logger } from '../common/logger';

// import entities
import { UserInfo } from '../entity/user_info';

// import logics
import { DiscordCommon } from '../logic/discord_common';
import { DiscordMessage } from '../logic/discord_message';
import { ExportUserInfo } from '../logic/export_user_info';

export class CommandExportController {
    /**
     * user info list export
     * @param interaction
     */
    async export_user_info(interaction: Discord.ChatInputCommandInteraction, is_check_privillege: boolean = true, member_limit: number = -1): Promise<boolean> {
        try {
            // get objects from discord.
            if (interaction.guild == undefined) {
                throw new Error(`Discord interaction guild is undefined.`);
            }
            logger.info(`request export user info.`);

            // check privilleges
            if (DiscordCommon.check_privillege(constants.DISCORD_BOT_ADMIN_USER_ID, interaction.user.id, is_check_privillege) == true) {
                logger.info(`export user info privillege check ok. user id = ${interaction.user.id}`);
            } else {
                logger.error(`failed to export user info privillege check. user id = ${interaction.user.id}`);
                interaction.reply(constants.DISCORD_MESSAGE_NO_PERMISSION);

                // resolve (no permissions)
                return false;
            }

            // get member limit
            if (member_limit == -1) {
                member_limit = constants.USER_INFO_LIST_LIMIT_NUMBER;
            }

            // get guild object
            const guild: Discord.Guild = interaction.guild;

            // create export user info instance
            const export_user_info = new ExportUserInfo();

            // get export file path from .env file
            const export_file_path = constants.EXPORT_USER_INFO_PATH;

            // get server info
            const member_info_list: Discord.Collection<string, Discord.GuildMember> = await guild.members.list({ limit: constants.USER_INFO_LIST_LIMIT_NUMBER, cache: false });
            logger.info(`get user info from server completed.`);

            // parse discord's data to internal object
            const user_info_list: UserInfo[] = export_user_info.parse_user_info(member_info_list);
            logger.info(`parsed user info data. count = ${user_info_list.length}`);

            // write user info list to file and get message
            const output_buffer = export_user_info.get_output_string(user_info_list);
            logger.info(`output buffer created. length = ${output_buffer.length}`);

            // write buffer to file
            export_user_info.export_to_file(export_file_path, output_buffer);
            logger.info(`output user info to file completed. path = ${export_file_path}`);

            // check member count is exceeded limit
            let message_string = constants.DISCORD_MESSAGE_EXPORT_USER_INFO;
            if (guild.memberCount > member_limit) {
                logger.info(`user info list count is exceeded discord's limit number ${constants.DISCORD_MESSAGE_EXPORT_USER_INFO_LIMIT_EXCEEDED}.`);
                message_string = constants.DISCORD_MESSAGE_EXPORT_USER_INFO_LIMIT_EXCEEDED;
            }

            // send message
            logger.info(`ready to sending message.`);
            await interaction.reply({
                embeds: [
                    DiscordMessage.get_export_user_info_embed_message(message_string)
                ],
                files: [export_file_path]
            });
        } catch (err) {
            // send error message
            logger.error(`export user info error.`, err);

            // send error message
            await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

            return false;
        };

        logger.info(`export user info completed.`);
        return true;
    }
}