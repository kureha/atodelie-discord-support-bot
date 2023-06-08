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
exports.CommandFriendCodeController = void 0;
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import logger
const logger_1 = require("../common/logger");
// import logic
const discord_common_1 = require("../logic/discord_common");
const discord_message_1 = require("../logic/discord_message");
class CommandFriendCodeController {
    /**
     * list friend code for user. return user list select menu.
     * @param interaction
     */
    search_friend_code(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get obejct from discord.
                if (interaction.guild == undefined) {
                    throw new Error(`Discord interaction guild is undefined.`);
                }
                logger_1.logger.info(`request search friend code.`);
                // game master list
                const game_master_list = discord_common_1.DiscordCommon.get_game_master_from_guild(interaction.guild, constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, constants.DISCORD_FRIEND_CODE_OTHER_COUNT);
                // get select game master action row list
                const select_game_master_action_row_list = discord_common_1.DiscordCommon.get_game_master_list_select_menu(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_SEARCH_FRIEND_CODE_BY_GAME_NAME_LIST, game_master_list, constants.DiSCORD_SELECT_MENU_LIMIT_LENGTH);
                logger_1.logger.info(`create game master list completed. length = ${game_master_list.length}`);
                // show select
                yield interaction.reply({
                    content: discord_message_1.DiscordMessage.get_friend_code_message(constants.DISCORD_MESSAGE_SELECT_GAME_MASTER_FOR_SEARCH_FRIEND_CODE, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY),
                    components: select_game_master_action_row_list,
                    ephemeral: true,
                });
            }
            catch (err) {
                logger_1.logger.error(`get select menu for search friend code error.`, err);
                yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                return false;
            }
            logger_1.logger.info(`get select menu for search friend code completed.`);
            return true;
        });
    }
    /**
     * regist friend code. return game list select menu.
     * @param interaction
     */
    regist_friend_code(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get obejct from discord.
                if (interaction.guild == undefined) {
                    throw new Error(`Discord interaction guild is undefined.`);
                }
                logger_1.logger.info(`request select game list for regist friend code.`);
                // game master list
                const game_master_list = discord_common_1.DiscordCommon.get_game_master_from_guild(interaction.guild, constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, constants.DISCORD_FRIEND_CODE_OTHER_COUNT);
                // get select game master action row list
                const select_game_master_action_row_list = discord_common_1.DiscordCommon.get_game_master_list_select_menu(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_REGIST_FRIEND_CODE_BY_GAME_NAME_LIST, game_master_list, constants.DiSCORD_SELECT_MENU_LIMIT_LENGTH);
                logger_1.logger.info(`create game master list completed. length = ${game_master_list.length}`);
                // show select
                yield interaction.reply({
                    content: discord_message_1.DiscordMessage.get_friend_code_message(constants.DISCORD_MESSAGE_SELECT_GAME_MASTER_FOR_REGIST_FRIEND_CODE, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY),
                    components: select_game_master_action_row_list,
                    ephemeral: true,
                });
            }
            catch (err) {
                logger_1.logger.error(`get select menu for regist friend code error.`, err);
                yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                return false;
            }
            logger_1.logger.info(`get select menu for regist friend code completed.`);
            return true;
        });
    }
    /**
     * delete friend code. return game list select menu.
     * @param interaction
     */
    delete_friend_code(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get obejct from discord.
                if (interaction.guild == undefined) {
                    throw new Error(`Discord interaction guild is undefined.`);
                }
                logger_1.logger.info(`request select game list for delete friend code.`);
                // game master list
                const game_master_list = discord_common_1.DiscordCommon.get_game_master_from_guild(interaction.guild, constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, constants.DISCORD_FRIEND_CODE_OTHER_COUNT);
                // get select game master action row list
                const select_game_master_action_row_list = discord_common_1.DiscordCommon.get_game_master_list_select_menu(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_DELETE_FRIEND_CODE_BY_GAME_NAME_LIST, game_master_list, constants.DiSCORD_SELECT_MENU_LIMIT_LENGTH);
                logger_1.logger.info(`create game master list completed. length = ${game_master_list.length}`);
                // show select
                yield interaction.reply({
                    content: discord_message_1.DiscordMessage.get_friend_code_message(constants.DISCORD_MESSAGE_SELECT_GAME_MASTER_FOR_DELETE_FRIEND_CODE, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY),
                    components: select_game_master_action_row_list,
                    ephemeral: true,
                });
            }
            catch (err) {
                logger_1.logger.error(`get select menu for delete friend code error.`, err);
                yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                return false;
            }
            logger_1.logger.info(`get select menu for delete friend code completed.`);
            return true;
        });
    }
}
exports.CommandFriendCodeController = CommandFriendCodeController;
//# sourceMappingURL=command_friend_code_controller.js.map