// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import databace access modules
import { GameMasterRepository } from '../db/game_master';

// import discord modules
import * as Discord from 'discord.js';

// import logic
import { DiscordCommon } from '../logic/discord_common';
import { DiscordMessage } from '../logic/discord_message';

// import entity
import { GameMaster } from '../entity/game_master';

export class SelectInteractionGameMasterController {

    public game_master_repo: GameMasterRepository = new GameMasterRepository();

    /**
     * edit game master
     * @param interaction 
     */
    async edit_game_master(interaction: Discord.SelectMenuInteraction, is_check_privillege: boolean = true): Promise<boolean> {
        try {
            // check values
            if (interaction.guild == undefined) {
                throw new Error(`Discord interaction guild is undefined.`);
            }

            // check privilleges
            if (DiscordCommon.check_privillege(constants.DISCORD_BOT_ADMIN_USER_ID, interaction.user.id, is_check_privillege) == true) {
                logger.info(`request edit game master privillege check ok. user id = ${interaction.user.id}`);
            } else {
                logger.error(`request edit game master failed to privillege check. user id = ${interaction.user.id}`);
                interaction.reply(constants.DISCORD_MESSAGE_NO_PERMISSION);

                // resolve (no permissions)
                return false;
            }

            logger.info(`request edit game master modal by selected game.`);

            // get value from interaction
            const target_game_id: string = DiscordCommon.get_interaction_value_by_idx(interaction.values, 0);

            // get game name
            const target_game_name = DiscordCommon.get_game_master_from_list(
                target_game_id,
                DiscordCommon.get_game_master_from_guild(
                    interaction.guild,
                    constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST,
                    0)
            ).game_name;
            logger.info(`target game found. game_name = ${target_game_name}`);

            // input component
            const custom_id_text_input: string = constants.DISCORD_MODAL_GAME_MASTER_PRESENCE_NAME_ID;
            const custom_id_modal: string = `${constants.DISCORD_MODAL_CUSTOM_ID_EDIT_GAME_MASTER}-${target_game_id}`;
            logger.info(`create modal from custom id. custom_id_modal = ${custom_id_modal}, custom_id_text_input = ${custom_id_text_input}`);

            // build text input
            const precense_name_text = DiscordCommon.get_text_input(
                custom_id_text_input,
                DiscordMessage.get_friend_code_message(
                    constants.DISCORD_GAME_MASTER_MODAL_PRECENSE_NAME,
                    Constants.STRING_EMPTY,
                    Constants.STRING_EMPTY,
                    Constants.STRING_EMPTY,
                    target_game_name,
                    target_game_id
                ),
                DiscordCommon.TEXT_INPUT_STYLE_SHORT);

            // try to load registed info
            let game_master: GameMaster = new GameMaster();
            try {
                game_master = await this.game_master_repo.get_m_game_master(interaction.guild.id, target_game_id);
                // try to get registed data and set value
                logger.info(`registed data is matched. game_id = ${game_master.game_id}, precense_name = ${game_master.presence_name}`);
                precense_name_text.setValue(game_master.presence_name);
            } catch (err) {
                // do nothing
                logger.info(`registed data is not matched. create blank input text.`);
            }

            // create action row and modal
            const input_game_master_precense_action_row = new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(precense_name_text);

            const modal = new Discord.ModalBuilder()
                .setCustomId(custom_id_modal)
                .setTitle(constants.DISCORD_GAME_MASTER_MODAL_DESCRIPTION)
                .addComponents(input_game_master_precense_action_row);

            // show modal
            await interaction.showModal(modal);
        } catch (err) {
            // send error message
            logger.error(`edit game master error.`, err);
            await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

            return false;
        }

        logger.info(`edit game master completed.`);
        return true;
    }

    /**
     * reset game master
     * @param interaction 
     */
    async reset_game_master(interaction: Discord.SelectMenuInteraction, is_check_privillege: boolean = true): Promise<boolean> {
        try {
            // check values
            if (interaction.guild == undefined) {
                throw new Error(`Discord interaction guild is undefined.`);
            }

            // check privilleges
            if (DiscordCommon.check_privillege(constants.DISCORD_BOT_ADMIN_USER_ID, interaction.user.id, is_check_privillege) == true) {
                logger.info(`request reset game master privillege check ok. user id = ${interaction.user.id}`);
            } else {
                logger.error(`request reset game master failed to privillege check. user id = ${interaction.user.id}`);
                interaction.reply(constants.DISCORD_MESSAGE_NO_PERMISSION);

                // resolve (no permissions)
                return false;
            }

            logger.info(`request reset game master modal by selected game.`);

            // get value from interaction
            const target_game_id: string = DiscordCommon.get_interaction_value_by_idx(interaction.values, 0);

            // get game name
            const target_game_name = DiscordCommon.get_game_master_from_list(
                target_game_id,
                DiscordCommon.get_game_master_from_guild(
                    interaction.guild,
                    constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST,
                    0)
            ).game_name;
            logger.info(`target game found. game_name = ${target_game_name}`);

            // try to load registed info
            const affected_data_cnt: number = await this.game_master_repo.delete_m_game_master(interaction.guild.id, target_game_id);
            // try to get registed data and set value
            logger.info(`delete game master successed. delete count = ${affected_data_cnt}`);

            // send result message
            if (affected_data_cnt > 0) {
                logger.info(`registration compoleted.`);
                await interaction.reply(
                    constants.DISCORD_MESSAGE_RESET_GAME_MASTER
                        .replace('%%GAME_NAME%%', target_game_name)
                );
            } else {
                // if update row count is low, failed to regist
                throw new Error(`data is not affected. game_id = ${target_game_id}, game_name = ${target_game_name}, count = ${affected_data_cnt}`);
            }
        } catch (err) {
            // send error message
            logger.error(`select game for reset game master error.`, err);
            await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

            return false;
        }

        logger.info(`reset game master completed.`);
        return true;
    }
}