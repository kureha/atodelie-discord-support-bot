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
exports.ModalSubmitFriendCodeController = void 0;
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import logger
const logger_1 = require("../common/logger");
// import repository
const friend_code_1 = require("../db/friend_code");
const friend_code_history_1 = require("../db/friend_code_history");
// import entity
const friend_code_2 = require("../entity/friend_code");
// import logic
const discord_common_1 = require("../logic/discord_common");
const discord_message_1 = require("../logic/discord_message");
class ModalSubmitFriendCodeController {
    /**
     * Regist friend code
     * @param interaction
     */
    static regist(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    logger_1.logger.info(`registration friend code start.`);
                    // get game id
                    const target_game_id = interaction.customId.replace(`${constants.DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE}-`, constants_1.Constants.STRING_EMPTY);
                    // get friend code
                    const input_friend_code = interaction.fields.getTextInputValue(constants.DISCORD_MODAL_FRIEND_CODE_ID);
                    logger_1.logger.info(`get target info completed. game id = ${target_game_id}, friend code = ${input_friend_code}`);
                    // try to get friend code from db
                    logger_1.logger.info(`try to get registed friend code from database.`);
                    const fc_repo = new friend_code_1.FriendCodeRepository();
                    const fc_history_repo = new friend_code_history_1.FriendCodeHistoryRepository();
                    const friend_code_list = yield fc_repo.get_t_friend_code(discord_common_1.DiscordCommon.get_guild_id_from_guild(interaction.guild), discord_common_1.DiscordCommon.get_user_id_from_user(interaction.user));
                    // friend code object
                    let friend_code = new friend_code_2.FriendCode();
                    let is_data_insert = false;
                    try {
                        // if search ok, this data is update.
                        friend_code = friend_code_2.FriendCode.search(friend_code_list, target_game_id);
                        logger_1.logger.info(`regist data is update.`);
                    }
                    catch (e) {
                        // if search is ng, this data is insert.
                        logger_1.logger.info(`regist data is insert.`);
                        is_data_insert = true;
                    }
                    // insert or update
                    let affected_data_cnt = -1;
                    // check is db registed (get data existe)
                    if (is_data_insert == true) {
                        // insert
                        logger_1.logger.info(`insert friend code.`);
                        // set value to object
                        friend_code = this.get_insert_data(interaction, target_game_id, input_friend_code);
                        // execute insert
                        affected_data_cnt = yield fc_repo.insert_t_friend_code(friend_code);
                        logger_1.logger.info(`insert completed. count = ${affected_data_cnt}`);
                    }
                    else {
                        // update
                        logger_1.logger.info(`update friend code.`);
                        // set value to object
                        friend_code = this.get_update_data(interaction, target_game_id, input_friend_code, friend_code);
                        // execute update
                        affected_data_cnt = yield fc_repo.update_t_friend_code(friend_code);
                        logger_1.logger.info(`update completed. count = ${affected_data_cnt}`);
                    }
                    // send result message
                    if (affected_data_cnt > 0) {
                        // insert to history
                        affected_data_cnt = yield fc_history_repo.insert_t_friend_code(friend_code);
                        logger_1.logger.info(`insert history completed. affected_data_cnt = ${affected_data_cnt}`);
                        logger_1.logger.info(`registration compoleted.`);
                        yield interaction.reply(discord_message_1.DiscordMessage.get_friend_code_message(constants.DISCORD_MESSAGE_REGIST_FRIEND_CODE, friend_code.friend_code, friend_code.user_name, friend_code.user_id, friend_code.game_name, friend_code.game_id));
                        // resolve
                        resolve(true);
                    }
                    else {
                        // if update row count is low, failed to regist
                        throw new Error(`data is not affected. user_id = ${friend_code.user_id}, game_id = ${friend_code.game_id}, friend_code = ${friend_code.friend_code}, count = ${affected_data_cnt}`);
                    }
                }
                catch (err) {
                    logger_1.logger.error(err);
                    yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                    // reject
                    reject(`regist friend code error. error = ${err}`);
                }
            }));
        });
    }
    /**
     * get database insert friend code data
     * @param interaction discord interaction object
     * @param target_game_id target game id
     * @param input_friend_code user input friend code
     * @returns
     */
    static get_insert_data(interaction, target_game_id, input_friend_code) {
        // create instance
        const friend_code = new friend_code_2.FriendCode();
        // set value to object
        friend_code.server_id = discord_common_1.DiscordCommon.get_guild_id_from_guild(interaction.guild);
        friend_code.game_id = target_game_id;
        friend_code.game_name = discord_common_1.DiscordCommon.get_game_master_from_list(target_game_id, discord_common_1.DiscordCommon.get_game_master_from_guild(interaction.guild, constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, constants.DISCORD_FRIEND_CODE_OTHER_COUNT)).game_name;
        friend_code.user_id = discord_common_1.DiscordCommon.get_user_id_from_user(interaction.user);
        friend_code.user_name = discord_common_1.DiscordCommon.get_user_name_from_user(interaction.user);
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
    static get_update_data(interaction, target_game_id, input_friend_code, friend_code) {
        // set value to object
        friend_code.game_name = discord_common_1.DiscordCommon.get_game_master_from_list(target_game_id, discord_common_1.DiscordCommon.get_game_master_from_guild(interaction.guild, constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, constants.DISCORD_FRIEND_CODE_OTHER_COUNT)).game_name;
        friend_code.user_name = discord_common_1.DiscordCommon.get_user_name_from_user(interaction.user);
        friend_code.update_time = new Date();
        friend_code.friend_code = input_friend_code;
        return friend_code;
    }
}
exports.ModalSubmitFriendCodeController = ModalSubmitFriendCodeController;
//# sourceMappingURL=modal_submit_friend_code_controller.js.map