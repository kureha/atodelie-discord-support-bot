// import discord modules
import * as Discord from 'discord.js';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import logger
import { logger } from '../common/logger';

// import repository
import { GameMasterRepository } from '../db/game_master';

// import entity
import { GameMaster } from '../entity/game_master';

// import logic
import { DiscordCommon } from '../logic/discord_common';

export class ModalSubmitGameMasterController {

    public game_master_repo: GameMasterRepository = new GameMasterRepository();

    /**
     * Regist game master
     * @param interaction 
     */
    async regist(interaction: Discord.ModalSubmitInteraction, is_check_privillege: boolean = true): Promise<boolean> {
        try {
            // check privilleges
            if (DiscordCommon.check_privillege(constants.DISCORD_BOT_ADMIN_USER_ID, interaction.user.id, is_check_privillege) == true) {
                logger.info(`request edit game master privillege check ok. user id = ${interaction.user.id}`);
            } else {
                logger.error(`request edit game master failed to privillege check. user id = ${interaction.user.id}`);
                interaction.reply(constants.DISCORD_MESSAGE_NO_PERMISSION);

                // resolve (no permissions)
                return false;
            }

            logger.info(`registration game master start.`);

            // get game id
            const target_game_id: string = interaction.customId.replace(`${constants.DISCORD_MODAL_CUSTOM_ID_EDIT_GAME_MASTER}-`, Constants.STRING_EMPTY);

            // get game name
            const target_game_name = DiscordCommon.get_game_master_from_list(
                target_game_id,
                DiscordCommon.get_game_master_from_guild(
                    interaction.guild,
                    constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST,
                    constants.DISCORD_FRIEND_CODE_OTHER_COUNT)
            ).game_name;
            logger.info(`target game found. game_name = ${target_game_name}`);

            // get game master precense name
            let input_precense_name: string = interaction.fields.getTextInputValue(constants.DISCORD_MODAL_GAME_MASTER_PRESENCE_NAME_ID);
            // if blank space, data delete
            if (input_precense_name.trim().length == 0) {
                input_precense_name = Constants.STRING_EMPTY;
            }
            logger.info(`get target info completed. game id = ${target_game_id}, precense name = ${input_precense_name}`);

            // try to get game master from db
            logger.info(`try to get registed game master from database.`);

            let game_master: GameMaster = new GameMaster();

            let is_data_insert: boolean = false;
            try {
                // try to get game master
                game_master = await this.game_master_repo.get_m_game_master(
                    DiscordCommon.get_guild_id_from_guild(interaction.guild),
                    target_game_id
                );
                logger.info(`regist data is update.`);
                is_data_insert = false;
            } catch (err) {
                // can't catched
                logger.info(`regist data is insert.`);
                is_data_insert = true;
            }

            // insert or update
            let affected_data_cnt: number = -1;

            // check is db registed (get data existe)
            if (is_data_insert == true) {
                // insert
                logger.info(`insert game master`);

                // set value to object
                game_master.server_id = DiscordCommon.get_guild_id_from_guild(interaction.guild);
                game_master.game_id = target_game_id;
                game_master.game_name = target_game_name;
                game_master.presence_name = input_precense_name;
                game_master.regist_time = new Date();
                game_master.update_time = new Date();
                game_master.delete = false;

                // execute insert
                affected_data_cnt = await this.game_master_repo.insert_m_game_master(game_master);
                logger.info(`insert completed. count = ${affected_data_cnt}`);
            } else {
                // update
                logger.info(`update game master.`);

                // set value to object
                game_master.presence_name = input_precense_name;
                game_master.update_time = new Date();

                // execute update
                affected_data_cnt = await this.game_master_repo.update_m_game_master(game_master);
                logger.info(`update completed. count = ${affected_data_cnt}`);
            }

            // send result message
            if (affected_data_cnt > 0) {
                logger.info(`registration compoleted.`);
                await interaction.reply(
                    constants.DISCORD_MESSAGE_EDIT_GAME_MASTER
                        .replace('%%GAME_NAME%%', target_game_name)
                        .replace('%%PRESENCE_NAME%%', input_precense_name)
                );
            } else {
                // if update row count is low, failed to regist
                throw new Error(`data is not affected. game_id = ${game_master.game_id}, precense_name = ${game_master.presence_name}, count = ${affected_data_cnt}`);
            }
        } catch (err) {
            logger.error(`regist game master error.`, err);
            await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

            return false;
        }

        logger.info(`regist game master completed.`);
        return true;
    }
}