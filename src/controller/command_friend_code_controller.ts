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

export class CommandFriendCodeController {
    /**
     * list friend code for user. return user list select menu.
     * @param interaction 
     */
    static async search_friend_code(interaction: Discord.ChatInputCommandInteraction): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                // get obejct from discord.
                if (interaction.guild == undefined) {
                    throw new Error(`Discord interaction guild is undefined.`);
                }
                logger.info(`request search friend code.`);

                // game master list
                const game_master_list: GameMaster[] = DiscordCommon.get_game_master_from_guild(
                    interaction.guild,
                    constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, 
                    constants.DISCORD_FRIEND_CODE_OTHER_COUNT);

                // get select game master action row list
                const select_game_master_action_row_list: Discord.ActionRowBuilder<Discord.SelectMenuBuilder>[] =
                    DiscordCommon.get_game_master_list_select_menu(
                        constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_SEARCH_FRIEND_CODE_BY_GAME_NAME_LIST,
                        game_master_list,
                        constants.DiSCORD_SELECT_MENU_LIMIT_LENGTH);

                logger.info(`create game master list completed. length = ${game_master_list.length}`);

                // show select
                await interaction.reply({
                    content: DiscordMessage.get_friend_code_message(
                        constants.DISCORD_MESSAGE_SELECT_GAME_MASTER_FOR_SEARCH_FRIEND_CODE,
                        Constants.STRING_EMPTY,
                        Constants.STRING_EMPTY,
                        Constants.STRING_EMPTY,
                        Constants.STRING_EMPTY,
                        Constants.STRING_EMPTY
                    ),
                    components: select_game_master_action_row_list,
                    ephemeral: true,
                });

                resolve(true);
            } catch (err) {
                logger.error(err);
                await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

                reject(`get select menu for search friend code error. error = ${err}`);
            }
        });
    }

    /**
     * regist friend code. return game list select menu.
     * @param interaction 
     */
    static async regist_friend_code(interaction: Discord.ChatInputCommandInteraction): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                // get obejct from discord.
                if (interaction.guild == undefined) {
                    throw new Error(`Discord interaction guild is undefined.`);
                }
                logger.info(`request select game list for regist friend code.`);

                // game master list
                const game_master_list: GameMaster[] = DiscordCommon.get_game_master_from_guild(
                    interaction.guild,
                    constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, 
                    constants.DISCORD_FRIEND_CODE_OTHER_COUNT);

                // get select game master action row list
                const select_game_master_action_row_list: Discord.ActionRowBuilder<Discord.SelectMenuBuilder>[] =
                    DiscordCommon.get_game_master_list_select_menu(
                        constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_REGIST_FRIEND_CODE_BY_GAME_NAME_LIST,
                        game_master_list,
                        constants.DiSCORD_SELECT_MENU_LIMIT_LENGTH);

                logger.info(`create game master list completed. length = ${game_master_list.length}`);

                // show select
                await interaction.reply({
                    content: DiscordMessage.get_friend_code_message(
                        constants.DISCORD_MESSAGE_SELECT_GAME_MASTER_FOR_REGIST_FRIEND_CODE,
                        Constants.STRING_EMPTY,
                        Constants.STRING_EMPTY,
                        Constants.STRING_EMPTY,
                        Constants.STRING_EMPTY,
                        Constants.STRING_EMPTY
                    ),
                    components: select_game_master_action_row_list,
                    ephemeral: true,
                });

                resolve(true);
            } catch (err) {
                logger.error(err);
                await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

                reject(`get select menu for regist friend code error. error = ${err}`);
            }
        });
    }

    /**
     * delete friend code. return game list select menu.
     * @param interaction 
     */
    static async delete_friend_code(interaction: Discord.ChatInputCommandInteraction): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                // get obejct from discord.
                if (interaction.guild == undefined) {
                    throw new Error(`Discord interaction guild is undefined.`);
                }
                logger.info(`request select game list for delete friend code.`);

                // game master list
                const game_master_list: GameMaster[] = DiscordCommon.get_game_master_from_guild(
                    interaction.guild,
                    constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, 
                    constants.DISCORD_FRIEND_CODE_OTHER_COUNT);

                // get select game master action row list
                const select_game_master_action_row_list: Discord.ActionRowBuilder<Discord.SelectMenuBuilder>[] =
                    DiscordCommon.get_game_master_list_select_menu(
                        constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_DELETE_FRIEND_CODE_BY_GAME_NAME_LIST,
                        game_master_list,
                        constants.DiSCORD_SELECT_MENU_LIMIT_LENGTH);

                logger.info(`create game master list completed. length = ${game_master_list.length}`);

                // show select
                await interaction.reply({
                    content: DiscordMessage.get_friend_code_message(
                        constants.DISCORD_MESSAGE_SELECT_GAME_MASTER_FOR_DELETE_FRIEND_CODE,
                        Constants.STRING_EMPTY,
                        Constants.STRING_EMPTY,
                        Constants.STRING_EMPTY,
                        Constants.STRING_EMPTY,
                        Constants.STRING_EMPTY
                    ),
                    components: select_game_master_action_row_list,
                    ephemeral: true,
                });

                resolve(true);
            } catch (err) {
                logger.error(err);
                await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

                reject(`get select menu for delete friend code error. error = ${err}`);
            }
        });
    }
}