// import discord modules
import * as Discord from 'discord.js';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import logger
import { logger } from '../common/logger';

// import entity
import { GameMaster } from '../entity/game_master';

// import logic
import { DiscordCommon } from '../logic/discord_common';
import { DiscordMessage } from '../logic/discord_message';

export class CommandGameMasterController {
    /**
     * list role list for administrator. return game list
     */
    async select_game_master(interaction: Discord.ChatInputCommandInteraction, is_check_privillege: boolean = true): Promise<boolean> {
        try {
            // get obejct from discord.
            if (interaction.guild == undefined) {
                throw new Error(`Discord interaction guild is undefined.`);
            }

            // check privilleges
            if (DiscordCommon.check_privillege(constants.DISCORD_BOT_ADMIN_USER_ID, interaction.user.id, is_check_privillege) == true) {
                logger.info(`request select game master privillege check ok. user id = ${interaction.user.id}`);
            } else {
                logger.error(`request select game master failed to privillege check. user id = ${interaction.user.id}`);
                await interaction.reply(constants.DISCORD_MESSAGE_NO_PERMISSION);

                // resolve (no permissions)
                return false;
            }

            logger.info(`request select game master.`);

            // game master list
            const game_master_list: GameMaster[] = DiscordCommon.get_game_master_from_guild(
                interaction.guild,
                constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST,
                0);

            // get select game master action row list
            const select_game_master_action_row_list: Discord.ActionRowBuilder<Discord.StringSelectMenuBuilder>[] =
                DiscordCommon.get_game_master_list_select_menu(
                    constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_EDIT_GAME_MASTER_BY_GAME_NAME_LIST,
                    game_master_list,
                    constants.DiSCORD_SELECT_MENU_LIMIT_LENGTH);

            logger.info(`create game master list completed. length = ${game_master_list.length}`);

            // show select
            await interaction.reply({
                content: DiscordMessage.get_friend_code_message(
                    Constants.STRING_EMPTY,
                    Constants.STRING_EMPTY,
                    Constants.STRING_EMPTY,
                    Constants.STRING_EMPTY,
                    Constants.STRING_EMPTY,
                    Constants.STRING_EMPTY
                ),
                components: select_game_master_action_row_list,
                ephemeral: true,
            });
        } catch (err) {
            logger.error(`get select menu for request select game master code error.`, err);
            await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

            return false;
        }

        logger.info(`get select menu for request select game master code completed.`);
        return true;
    }
}