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
exports.ModalSubmitController = void 0;
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import logger
const logger_1 = require("../common/logger");
// import controllers
const modal_submit_recruitment_controller_1 = require("./modal_submit_recruitment_controller");
const modal_submit_friend_code_controller_1 = require("./modal_submit_friend_code_controller");
const modal_submit_game_master_controller_1 = require("./modal_submit_game_master_controller");
class ModalSubmitController {
    /**
     * Controller main method.
     * @param interaction
     */
    static recieve(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.customId == constants.DISCORD_MODAL_CUSTOM_ID_NEW_RECRUITMENT) {
                const controller = new modal_submit_recruitment_controller_1.ModalSubmitRecruitmentController();
                yield controller.regist(interaction);
            }
            else if (interaction.customId == constants.DISCORD_MODAL_CUSTOM_ID_EDIT_RECRUITMENT) {
                const controller = new modal_submit_recruitment_controller_1.ModalSubmitRecruitmentController();
                yield controller.edit(interaction);
            }
            else if (interaction.customId.indexOf(constants.DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE) >= 0) {
                const controller = new modal_submit_friend_code_controller_1.ModalSubmitFriendCodeController();
                yield controller.regist(interaction);
            }
            else if (interaction.customId.indexOf(constants.DISCORD_MODAL_CUSTOM_ID_EDIT_GAME_MASTER) >= 0) {
                const controller = new modal_submit_game_master_controller_1.ModalSubmitGameMasterController();
                yield controller.regist(interaction);
            }
            else {
                logger_1.logger.error(`Modal submit recieved, but custom id is invalid. custom id = ${interaction.customId}`);
                yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);
            }
        });
    }
}
exports.ModalSubmitController = ModalSubmitController;
//# sourceMappingURL=modal_submit_controller.js.map