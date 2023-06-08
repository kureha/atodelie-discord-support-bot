"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalSubmitGameMasterController = void 0;
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import logger
const logger_1 = require("../common/logger");
// import repository
const game_master_1 = require("../db/game_master");
// import entity
const game_master_2 = require("../entity/game_master");
// import logic
const discord_common_1 = require("../logic/discord_common");
class ModalSubmitGameMasterController {
    constructor() {
        this.game_master_repo = new game_master_1.GameMasterRepository();
    }
    /**
     * Regist game master
     * @param interaction
     */
    regist(interaction, is_check_privillege = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check privilleges
                if (discord_common_1.DiscordCommon.check_privillege(constants.DISCORD_BOT_ADMIN_USER_ID, interaction.user.id, is_check_privillege) == true) {
                    logger_1.logger.info(`request edit game master privillege check ok. user id = ${interaction.user.id}`);
                }
                else {
                    logger_1.logger.error(`request edit game master failed to privillege check. user id = ${interaction.user.id}`);
                    interaction.reply(constants.DISCORD_MESSAGE_NO_PERMISSION);
                    // resolve (no permissions)
                    return false;
                }
                logger_1.logger.info(`registration game master start.`);
                // get game id
                const target_game_id = interaction.customId.replace(`${constants.DISCORD_MODAL_CUSTOM_ID_EDIT_GAME_MASTER}-`, constants_1.Constants.STRING_EMPTY);
                // get game name
                const target_game_name = discord_common_1.DiscordCommon.get_game_master_from_list(target_game_id, discord_common_1.DiscordCommon.get_game_master_from_guild(interaction.guild, constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, constants.DISCORD_FRIEND_CODE_OTHER_COUNT)).game_name;
                logger_1.logger.info(`target game found. game_name = ${target_game_name}`);
                // get game master precense name
                let input_precense_name = interaction.fields.getTextInputValue(constants.DISCORD_MODAL_GAME_MASTER_PRESENCE_NAME_ID);
                // if blank space, data delete
                if (input_precense_name.trim().length == 0) {
                    input_precense_name = constants_1.Constants.STRING_EMPTY;
                }
                logger_1.logger.info(`get target info completed. game id = ${target_game_id}, precense name = ${input_precense_name}`);
                // try to get game master from db
                logger_1.logger.info(`try to get registed game master from database.`);
                let game_master = new game_master_2.GameMaster();
                let is_data_insert = false;
                try {
                    // try to get game master
                    game_master = yield this.game_master_repo.get_m_game_master(discord_common_1.DiscordCommon.get_guild_id_from_guild(interaction.guild), target_game_id);
                    logger_1.logger.info(`regist data is update.`);
                    is_data_insert = false;
                }
                catch (err) {
                    // can't catched
                    logger_1.logger.info(`regist data is insert.`);
                    is_data_insert = true;
                }
                // insert or update
                let affected_data_cnt = -1;
                // check is db registed (get data existe)
                if (is_data_insert == true) {
                    // insert
                    logger_1.logger.info(`insert game master`);
                    // set value to object
                    game_master.server_id = discord_common_1.DiscordCommon.get_guild_id_from_guild(interaction.guild);
                    game_master.game_id = target_game_id;
                    game_master.game_name = target_game_name;
                    game_master.presence_name = input_precense_name;
                    game_master.regist_time = new Date();
                    game_master.update_time = new Date();
                    game_master.delete = false;
                    // execute insert
                    affected_data_cnt = yield this.game_master_repo.insert_m_game_master(game_master);
                    logger_1.logger.info(`insert completed. count = ${affected_data_cnt}`);
                }
                else {
                    // update
                    logger_1.logger.info(`update game master.`);
                    // set value to object
                    game_master.presence_name = input_precense_name;
                    game_master.update_time = new Date();
                    // execute update
                    affected_data_cnt = yield this.game_master_repo.update_m_game_master(game_master);
                    logger_1.logger.info(`update completed. count = ${affected_data_cnt}`);
                }
                // send result message
                if (affected_data_cnt > 0) {
                    logger_1.logger.info(`registration compoleted.`);
                    yield interaction.reply(constants.DISCORD_MESSAGE_EDIT_GAME_MASTER
                        .replace('%%GAME_NAME%%', target_game_name)
                        .replace('%%PRESENCE_NAME%%', input_precense_name));
                }
                else {
                    // if update row count is low, failed to regist
                    throw new Error(`data is not affected. game_id = ${game_master.game_id}, precense_name = ${game_master.presence_name}, count = ${affected_data_cnt}`);
                }
            }
            catch (err) {
                logger_1.logger.error(`regist game master error.`, err);
                yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                return false;
            }
            logger_1.logger.info(`regist game master completed.`);
            return true;
        });
    }
}
exports.ModalSubmitGameMasterController = ModalSubmitGameMasterController;
//# sourceMappingURL=modal_submit_game_master_controller.js.map