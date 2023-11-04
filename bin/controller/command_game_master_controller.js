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
exports.CommandGameMasterController = void 0;
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import logger
const logger_1 = require("../common/logger");
// import logic
const discord_common_1 = require("../logic/discord_common");
const discord_message_1 = require("../logic/discord_message");
class CommandGameMasterController {
    /**
     * list role list for reset game master for administrator. return game list
     */
    select_game_master_for_reset_game_master(interaction, is_check_privillege = true) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.select_game_master(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_RESET_GAME_MASTER_BY_GAME_NAME_LIST, interaction, is_check_privillege);
        });
    }
    /**
     * list role list for edit game master for administrator. return game list
     */
    select_game_master_for_edit_game_master(interaction, is_check_privillege = true) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.select_game_master(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_EDIT_GAME_MASTER_BY_GAME_NAME_LIST, interaction, is_check_privillege);
        });
    }
    /**
     * list role list for administrator. return game list
     */
    select_game_master(interaction_mode, interaction, is_check_privillege = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get obejct from discord.
                if (interaction.guild == undefined) {
                    throw new Error(`Discord interaction guild is undefined.`);
                }
                // check privilleges
                if (discord_common_1.DiscordCommon.check_privillege(constants.DISCORD_BOT_ADMIN_USER_ID, interaction.user.id, is_check_privillege) == true) {
                    logger_1.logger.info(`request select game master privillege check ok. user id = ${interaction.user.id}`);
                }
                else {
                    logger_1.logger.error(`request select game master failed to privillege check. user id = ${interaction.user.id}`);
                    yield interaction.reply(constants.DISCORD_MESSAGE_NO_PERMISSION);
                    // resolve (no permissions)
                    return false;
                }
                logger_1.logger.info(`request select game master.`);
                // game master list
                const game_master_list = discord_common_1.DiscordCommon.get_game_master_from_guild(interaction.guild, constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, 0);
                // get select game master action row list
                const select_game_master_action_row_list = discord_common_1.DiscordCommon.get_game_master_list_select_menu(interaction_mode, game_master_list, constants.DiSCORD_SELECT_MENU_LIMIT_LENGTH);
                logger_1.logger.info(`create game master list completed. length = ${game_master_list.length}`);
                // show select
                yield interaction.reply({
                    content: discord_message_1.DiscordMessage.get_friend_code_message(constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY),
                    components: select_game_master_action_row_list,
                    ephemeral: true,
                });
            }
            catch (err) {
                logger_1.logger.error(`get select menu for request select game master code error.`, err);
                yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                return false;
            }
            logger_1.logger.info(`get select menu for request select game master code completed.`);
            return true;
        });
    }
}
exports.CommandGameMasterController = CommandGameMasterController;
//# sourceMappingURL=command_game_master_controller.js.map