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
exports.SelectInteractionController = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import controllers
const select_interaction_friend_code_controller_1 = require("./select_interaction_friend_code_controller");
const select_interaction_server_controller_1 = require("./select_interaction_server_controller");
const select_interaction_game_master_controller_1 = require("./select_interaction_game_master_controller");
class SelectInteractionController {
    /**
     * analyze discord interaction and send result message
     * @param interaction discord interaction
     */
    static recieve(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.customId == constants.DISCORD_SELECT_MENU_CUSTOM_ID_REGIST_SERVER_MASTER) {
                const controller = new select_interaction_server_controller_1.SelectInteractionServerController();
                yield controller.regist_server_master(interaction);
            }
            else if (interaction.customId.indexOf(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_REGIST_FRIEND_CODE_BY_GAME_NAME_LIST) >= 0) {
                const controller = new select_interaction_friend_code_controller_1.SelectInteractionFriendCodeController();
                yield controller.regist_friend_code(interaction);
            }
            else if (interaction.customId.indexOf(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_SEARCH_FRIEND_CODE_BY_GAME_NAME_LIST) >= 0) {
                const controller = new select_interaction_friend_code_controller_1.SelectInteractionFriendCodeController();
                yield controller.search_friend_code(interaction);
            }
            else if (interaction.customId.indexOf(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_DELETE_FRIEND_CODE_BY_GAME_NAME_LIST) >= 0) {
                const controller = new select_interaction_friend_code_controller_1.SelectInteractionFriendCodeController();
                yield controller.delete_friend_code(interaction);
            }
            else if (interaction.customId.indexOf(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_EDIT_GAME_MASTER_BY_GAME_NAME_LIST) >= 0) {
                const controller = new select_interaction_game_master_controller_1.SelectInteractionGameMasterController();
                yield controller.edit_game_master(interaction);
            }
            else {
                logger_1.logger.error(`Interaction recieved, but command is invalid. command = ${interaction.customId}`);
                yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);
            }
        });
    }
}
exports.SelectInteractionController = SelectInteractionController;
//# sourceMappingURL=select_interaction_controller.js.map