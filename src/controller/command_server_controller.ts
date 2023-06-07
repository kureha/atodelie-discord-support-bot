// import discord modules
import * as Discord from 'discord.js';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import logger
import { logger } from '../common/logger';

// import logics
import { DiscordCommon } from '../logic/discord_common';

export class CommandServerController {
    /**
     * regist server master
     * @param interaction 
     */
    static async regist_server_master(interaction: Discord.ChatInputCommandInteraction, is_check_privillege: boolean = true): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                // get objects from discord.
                if (interaction.guild == undefined) {
                    throw new Error(`Discord interaction guild is undefined.`);
                }

                logger.info(`request regist server master.`);

                // check privilleges
                if (DiscordCommon.check_privillege(constants.DISCORD_BOT_ADMIN_USER_ID, interaction.user.id, is_check_privillege) == true) {
                    logger.info(`regist server master privillege check ok. user id = ${interaction.user.id}`);
                } else {
                    logger.error(`failed to regist server master privillege check. user id = ${interaction.user.id}`);
                    interaction.reply(constants.DISCORD_MESSAGE_NO_PERMISSION);

                    // resolve (no permissions)
                    resolve(false);
                    return;
                }

                // get role select menu action row
                const role_select_action_row: Discord.ActionRowBuilder<Discord.SelectMenuBuilder> = DiscordCommon.get_role_list_select_menu(
                    constants.DISCORD_SELECT_MENU_CUSTOM_ID_REGIST_SERVER_MASTER,
                    constants.DISCORD_MESSAGE_SETTING_ROLE_SELECT,
                    interaction.guild
                );

                // show (ephemeral)
                await interaction.reply({
                    content: constants.DISCORD_MESSAGE_SETTING_ROLE_SELECT,
                    components: [role_select_action_row],
                    ephemeral: true,
                });

                resolve(true);
            } catch (err) {
                logger.error(err);
                await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

                reject(`regist server master error. error = ${err}`);
            }
        });
    }
}