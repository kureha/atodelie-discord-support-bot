// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import databace access modules
import { FriendCodeRepository } from '../db/friend_code';

// create message modules
import { DiscordMessage } from '../logic/discord_message';

// import entities
import { FriendCode } from '../entity/friend_code';

// import discord modules
import * as Discord from 'discord.js';

// import logic
import { DiscordCommon } from '../logic/discord_common';
import { FriendCodeHistoryRepository } from '../db/friend_code_history';

export class SelectInteractionFriendCodeController {
    /**
     * search friend code
     * @param interaction 
     */
    static async search_friend_code(interaction: Discord.SelectMenuInteraction): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                // check values
                if (interaction.guild == undefined) {
                    throw new Error(`Discord interaction guild is undefined.`);
                }

                logger.info(`request search friend code modal by selected game.`);

                // get value from interaction
                const target_game_id: string = DiscordCommon.get_interaction_value_by_idx(interaction.values, 0);

                // get game name
                const target_game_name = DiscordCommon.get_game_master_from_list(
                    target_game_id,
                    DiscordCommon.get_game_master_from_guild(
                        interaction.guild,
                        constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, 
                        constants.DISCORD_FRIEND_CODE_OTHER_COUNT
                    )).game_name;
                logger.info(`target game found. game_name = ${target_game_name}`);

                // search master
                const repo = new FriendCodeRepository();
                const friend_code_list = await repo.get_t_friend_code_from_game_id(
                    DiscordCommon.get_guild_id_from_guild(interaction.guild),
                    target_game_id);

                // struct embed message
                const embed_message = new Discord.EmbedBuilder({
                    description: DiscordMessage.get_friend_code_message(
                        constants.DISCORD_MESSAGE_SEARCH_FRIEND_CODE,
                        Constants.STRING_EMPTY,
                        Constants.STRING_EMPTY,
                        Constants.STRING_EMPTY,
                        target_game_name,
                        target_game_id
                    ),
                    timestamp: new Date(),
                    fields: [],
                });

                // push friend codes to embed message field
                let cnt_valid_friend_code: number = 0;
                friend_code_list.forEach((fc: FriendCode) => {
                    if (fc.friend_code.length > 0) {
                        embed_message.addFields({
                            name: fc.user_name,
                            value: fc.friend_code,
                            inline: true,
                        });
                        cnt_valid_friend_code = cnt_valid_friend_code + 1;
                    } else {
                        logger.trace(`target friend code is blank, skipped. server_id = ${fc.server_id}, user_name = ${fc.user_name}, game_name = ${fc.game_name}`);
                    }
                });

                // if friend code is not registed, reply special message
                if (cnt_valid_friend_code == 0) {
                    // reply for not registed
                    await interaction.reply(
                        DiscordMessage.get_friend_code_message(
                            constants.DISCORD_MESSAGE_SEARCH_FRIEND_CODE_NOT_FOUND,
                            Constants.STRING_EMPTY,
                            Constants.STRING_EMPTY,
                            Constants.STRING_EMPTY,
                            target_game_name,
                            target_game_id,
                        )
                    );

                    // resolve
                    resolve(false);
                } else {
                    // reply friend code
                    await interaction.reply({ embeds: [embed_message] });

                    // resolve
                    resolve(true);
                }
            } catch (err) {
                // send error message
                logger.error(err);
                await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

                reject(`select game for search friend code error. error = ${err}`);
            }
        });
    }

    /**
     * regist friend code
     * @param interaction 
     */
    static async regist_friend_code(interaction: Discord.SelectMenuInteraction): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                // check values
                if (interaction.guild == undefined) {
                    throw new Error(`Discord interaction guild is undefined.`);
                }

                logger.info(`request regist friend code modal by selected game.`);

                // get value from interaction
                const target_game_id: string = DiscordCommon.get_interaction_value_by_idx(interaction.values, 0);

                // get game name
                const target_game_name = DiscordCommon.get_game_master_from_list(
                    target_game_id,
                    DiscordCommon.get_game_master_from_guild(
                        interaction.guild,
                        constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, 
                        constants.DISCORD_FRIEND_CODE_OTHER_COUNT)
                ).game_name;
                logger.info(`target game found. game_name = ${target_game_name}`);

                // input component
                const custom_id_text_input: string = constants.DISCORD_MODAL_FRIEND_CODE_ID;
                const custom_id_modal: string = `${constants.DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE}-${target_game_id}`;
                logger.info(`create modal from custom id. custom_id_modal = ${custom_id_modal}, custom_id_text_input = ${custom_id_text_input}`);

                // build text input
                const friend_code_text = DiscordCommon.get_text_input(
                    custom_id_text_input,
                    DiscordMessage.get_friend_code_message(
                        constants.DISCORD_FRIEND_CODE_MODAL_FRIEND_CODE,
                        Constants.STRING_EMPTY,
                        Constants.STRING_EMPTY,
                        Constants.STRING_EMPTY,
                        target_game_name,
                        target_game_id
                    ),
                    DiscordCommon.TEXT_INPUT_STYLE_PHARAGRAPH);

                // try to load registed info
                const fc_repo = new FriendCodeRepository();
                const friend_code_list = await fc_repo.get_t_friend_code(interaction.guild.id, interaction.user.id);

                // try to get registed data
                friend_code_list.forEach((fc: FriendCode) => {
                    if (fc.game_id == target_game_id) {
                        // if matched, set value
                        logger.info(`registed data is matched. game_id = ${fc.game_id}, friend code = ${fc.friend_code}`);
                        friend_code_text.setValue(fc.friend_code);
                        return;
                    }
                });

                // create action row and modal
                const input_friend_code_action_row = new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(friend_code_text);

                const modal = new Discord.ModalBuilder()
                    .setCustomId(custom_id_modal)
                    .setTitle(constants.DISCORD_COMMAND_DESCRIPTION_REGIST_FRIEND_CODE)
                    .addComponents(input_friend_code_action_row);

                // show modal
                await interaction.showModal(modal);

                // resolve
                resolve(true);
            } catch (err) {
                // send error message
                logger.error(err);
                await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

                reject(`select game for regist friend code error. error = ${err}`);
            }
        });
    }

    /**
     * delete friend code
     * @param interaction 
     */
    static async delete_friend_code(interaction: Discord.SelectMenuInteraction): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                // check values
                if (interaction.guild == undefined) {
                    throw new Error(`Discord interaction guild is undefined.`);
                }

                logger.info(`request regist friend code modal by selected game.`);

                // get value from interaction
                const target_game_id: string = DiscordCommon.get_interaction_value_by_idx(interaction.values, 0);

                // get game name
                const target_game_name = DiscordCommon.get_game_master_from_list(
                    target_game_id,
                    DiscordCommon.get_game_master_from_guild(
                        interaction.guild,
                        constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, 
                        constants.DISCORD_FRIEND_CODE_OTHER_COUNT)
                ).game_name;
                logger.info(`target game found. game_name = ${target_game_name}`);

                // try to load registed info
                const fc_repo = new FriendCodeRepository();
                const fc_history_repo = new FriendCodeHistoryRepository();
                const friend_code_list = await fc_repo.get_t_friend_code(interaction.guild.id, interaction.user.id);

                // define friend code values
                let friend_code: FriendCode = new FriendCode();
                let is_registed_data: boolean = false;

                // try to get registed data
                friend_code_list.forEach((fc: FriendCode) => {
                    if (fc.game_id == target_game_id) {
                        // if matched, set value
                        logger.info(`registed data is matched. game_id = ${fc.game_id}, friend code = ${fc.friend_code}`);
                        friend_code = fc;
                        is_registed_data = true;
                    }
                });

                // check data is registed
                if (is_registed_data) {
                    // update
                    logger.info(`delete friend code.`);

                    // delete data
                    friend_code.delete = true;
                    let affected_data_cnt: number = await fc_repo.delete_t_friend_code(interaction.guild.id, interaction.user.id, target_game_id);
                    logger.info(`delete completed. count = ${affected_data_cnt}`);

                    if (affected_data_cnt > 0) {
                        // insert to hisotry
                        affected_data_cnt = await fc_history_repo.insert_t_friend_code(friend_code);
                        logger.info(`insert history completed. affected_data_cnt = ${affected_data_cnt}`);

                        // reply for deleted
                        await interaction.reply(
                            DiscordMessage.get_friend_code_message(
                                constants.DISCORD_MESSAGE_DELETE_FRIEND_CODE,
                                friend_code.friend_code,
                                DiscordCommon.get_user_name_from_user(interaction.user),
                                DiscordCommon.get_user_id_from_user(interaction.user),
                                target_game_name,
                                target_game_id,
                            )
                        );

                        // resolve
                        resolve(true);
                    } else {
                        // if delete is 0, failed to regist
                        throw new Error(`data is not affected. user_id = ${friend_code.user_id}, game_id = ${friend_code.game_id}, friend_code = ${friend_code.friend_code}, count = ${affected_data_cnt}`);
                    }
                } else {
                    // reply for not found
                    await interaction.reply(
                        DiscordMessage.get_friend_code_message(
                            constants.DISCORD_MESSAGE_DELETE_FRIEND_CODE_NOT_FOUND,
                            Constants.STRING_EMPTY,
                            DiscordCommon.get_user_name_from_user(interaction.user),
                            DiscordCommon.get_user_id_from_user(interaction.user),
                            target_game_name,
                            target_game_id,
                        )
                    );

                    // resolve
                    resolve(false);
                }
            } catch (err) {
                // send error message
                logger.error(err);
                await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

                reject(`select game for delete friend code error. error = ${err}`);
            }
        });
    }
}