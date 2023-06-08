// import discord modules
import * as Discord from 'discord.js';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import logger
import { logger } from '../common/logger';

// import repository
import { FriendCodeRepository } from '../db/friend_code';
import { FriendCodeHistoryRepository } from '../db/friend_code_history';

// import entity
import { FriendCode } from '../entity/friend_code';

// import logic
import { DiscordCommon } from '../logic/discord_common';
import { DiscordMessage } from '../logic/discord_message';
export class ModalSubmitFriendCodeController {

    public fc_repo = new FriendCodeRepository();
    public fc_history_repo = new FriendCodeHistoryRepository();

    /**
     * Regist friend code
     * @param interaction 
     */
    async regist(interaction: Discord.ModalSubmitInteraction): Promise<boolean> {
        try {
            logger.info(`registration friend code start.`);

            // get game id
            const target_game_id: string = interaction.customId.replace(`${constants.DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE}-`, Constants.STRING_EMPTY);

            // get friend code
            const input_friend_code: string = interaction.fields.getTextInputValue(constants.DISCORD_MODAL_FRIEND_CODE_ID);
            logger.info(`get target info completed. game id = ${target_game_id}, friend code = ${input_friend_code}`);

            // try to get friend code from db
            logger.info(`try to get registed friend code from database.`);

            const friend_code_list = await this.fc_repo.get_t_friend_code(
                DiscordCommon.get_guild_id_from_guild(interaction.guild),
                DiscordCommon.get_user_id_from_user(interaction.user)
            );

            // friend code object
            let friend_code: FriendCode = new FriendCode();
            let is_data_insert: boolean = false;
            try {
                // if search ok, this data is update.
                friend_code = FriendCode.search(friend_code_list, target_game_id);
                logger.info(`regist data is update.`);
            } catch (e) {
                // if search is ng, this data is insert.
                logger.info(`regist data is insert.`);
                is_data_insert = true;
            }

            // insert or update
            let affected_data_cnt: number = -1;

            // check is db registed (get data existe)
            if (is_data_insert == true) {
                // insert
                logger.info(`insert friend code.`);

                // set value to object
                friend_code = this.get_insert_data(interaction, target_game_id, input_friend_code);

                // execute insert
                affected_data_cnt = await this.fc_repo.insert_t_friend_code(friend_code);
                logger.info(`insert completed. count = ${affected_data_cnt}`);
            } else {
                // update
                logger.info(`update friend code.`);

                // set value to object
                friend_code = this.get_update_data(interaction, target_game_id, input_friend_code, friend_code);

                // execute update
                affected_data_cnt = await this.fc_repo.update_t_friend_code(friend_code);
                logger.info(`update completed. count = ${affected_data_cnt}`);
            }

            // send result message
            if (affected_data_cnt > 0) {
                // insert to history
                affected_data_cnt = await this.fc_history_repo.insert_t_friend_code(friend_code);
                logger.info(`insert history completed. affected_data_cnt = ${affected_data_cnt}`);

                logger.info(`registration compoleted.`);
                await interaction.reply(
                    DiscordMessage.get_friend_code_message(
                        constants.DISCORD_MESSAGE_REGIST_FRIEND_CODE,
                        friend_code.friend_code,
                        friend_code.user_name,
                        friend_code.user_id,
                        friend_code.game_name,
                        friend_code.game_id
                    )
                );
            } else {
                // if update row count is low, failed to regist
                throw new Error(`data is not affected. user_id = ${friend_code.user_id}, game_id = ${friend_code.game_id}, friend_code = ${friend_code.friend_code}, count = ${affected_data_cnt}`);
            }
        } catch (err) {
            logger.error(`regist friend code error.`, err);
            await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

            return false;
        }

        logger.info(`regist friend code completed.`);
        return true;
    }

    /**
     * get database insert friend code data
     * @param interaction discord interaction object
     * @param target_game_id target game id
     * @param input_friend_code user input friend code
     * @returns 
     */
    get_insert_data(interaction: Discord.ModalSubmitInteraction, target_game_id: string, input_friend_code: string): FriendCode {
        // create instance
        const friend_code: FriendCode = new FriendCode();

        // set value to object
        friend_code.server_id = DiscordCommon.get_guild_id_from_guild(interaction.guild);
        friend_code.game_id = target_game_id;
        friend_code.game_name = DiscordCommon.get_game_master_from_list(
            target_game_id,
            DiscordCommon.get_game_master_from_guild(
                interaction.guild,
                constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST,
                constants.DISCORD_FRIEND_CODE_OTHER_COUNT
            )).game_name;
        friend_code.user_id = DiscordCommon.get_user_id_from_user(interaction.user);
        friend_code.user_name = DiscordCommon.get_user_name_from_user(interaction.user);
        friend_code.regist_time = new Date();
        friend_code.update_time = new Date();
        friend_code.friend_code = input_friend_code;
        friend_code.delete = false;

        // return value
        return friend_code;
    }

    /**
     * get database update friend code data
     * @param interaction discord interaction object
     * @param target_game_id target game id
     * @param input_friend_code user input friend code
     * @param friend_code base object
     * @returns 
     */
    get_update_data(interaction: Discord.ModalSubmitInteraction, target_game_id: string, input_friend_code: string, friend_code: FriendCode): FriendCode {
        // set value to object
        friend_code.game_name = DiscordCommon.get_game_master_from_list(
            target_game_id,
            DiscordCommon.get_game_master_from_guild(
                interaction.guild,
                constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST,
                constants.DISCORD_FRIEND_CODE_OTHER_COUNT
            )).game_name;
        friend_code.user_name = DiscordCommon.get_user_name_from_user(interaction.user);
        friend_code.update_time = new Date();
        friend_code.friend_code = input_friend_code;

        return friend_code;
    }
}