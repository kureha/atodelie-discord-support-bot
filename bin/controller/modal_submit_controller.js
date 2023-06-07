"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalSubmitController = void 0;
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import logger
const logger_1 = require("../common/logger");
// import controllers
const modal_submit_recruitment_controller_1 = require("./modal_submit_recruitment_controller");
const modal_submit_friend_code_controller_1 = require("./modal_submit_friend_code_controller");
class ModalSubmitController {
    /**
     * Controller main method.
     * @param interaction
     */
    static recieve(interaction) {
        try {
            if (interaction.customId == constants.DISCORD_MODAL_CUSTOM_ID_NEW_RECRUITMENT) {
                modal_submit_recruitment_controller_1.ModalSubmitRecruitmentController.regist(interaction);
            }
            else if (interaction.customId == constants.DISCORD_MODAL_CUSTOM_ID_EDIT_RECRUITMENT) {
                modal_submit_recruitment_controller_1.ModalSubmitRecruitmentController.edit(interaction);
            }
            else if (interaction.customId.indexOf(constants.DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE) >= 0) {
                modal_submit_friend_code_controller_1.ModalSubmitFriendCodeController.regist(interaction);
            }
            else {
                logger_1.logger.error(`Modal submit recieved, but custom id is invalid. custom id = ${interaction.customId}`);
                interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);
            }
        }
        catch (err) {
            logger_1.logger.error(err);
            interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
        }
    }
}
exports.ModalSubmitController = ModalSubmitController;
//# sourceMappingURL=modal_submit_controller.js.map