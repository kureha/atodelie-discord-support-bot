"use strict";
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
class SelectInteractionController {
    /**
     * analyze discord interaction and send result message
     * @param interaction discord interaction
     */
    static recieve(interaction) {
        try {
            if (interaction.customId == constants.DISCORD_SELECT_MENU_CUSTOM_ID_REGIST_SERVER_MASTER) {
                select_interaction_server_controller_1.SelectInteractionServerController.regist_server_master(interaction);
            }
            else if (interaction.customId.indexOf(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_REGIST_FRIEND_CODE_BY_GAME_NAME_LIST) >= 0) {
                select_interaction_friend_code_controller_1.SelectInteractionFriendCodeController.regist_friend_code(interaction);
            }
            else if (interaction.customId.indexOf(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_SEARCH_FRIEND_CODE_BY_GAME_NAME_LIST) >= 0) {
                select_interaction_friend_code_controller_1.SelectInteractionFriendCodeController.search_friend_code(interaction);
            }
            else if (interaction.customId.indexOf(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_DELETE_FRIEND_CODE_BY_GAME_NAME_LIST) == 0) {
                select_interaction_friend_code_controller_1.SelectInteractionFriendCodeController.delete_friend_code(interaction);
            }
            else {
                logger_1.logger.error(`Interaction recieved, but command is invalid. command = ${interaction.customId}`);
                interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);
            }
        }
        catch (err) {
            // send error message
            logger_1.logger.error(err);
            interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
        }
    }
}
exports.SelectInteractionController = SelectInteractionController;
//# sourceMappingURL=select_interaction_controller.js.map