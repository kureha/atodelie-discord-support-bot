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
exports.ButtonInteractionController = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import controllers
const button_interaction_recruitment_controller_1 = require("./button_interaction_recruitment_controller");
class ButtonInteractionController {
    /**
     * analyze discord interaction and send result message
     * @param interaction discord interaction
     */
    static recieve(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.check_recruitment_interaction(interaction.customId)) {
                const controller = new button_interaction_recruitment_controller_1.ButtonInteractionRecruitmentController();
                yield controller.recruitment_interaction(interaction);
            }
            else {
                logger_1.logger.error(`Interaction recieved, but custom_id is invalid. custom_id = ${interaction.customId}`);
                yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);
            }
        });
    }
    /**
     * check interaction is recruitment button interaction.
     * @param custom_id interaction custum id
     * @returns
     */
    static check_recruitment_interaction(custom_id) {
        // is recruitment interaction button
        if (custom_id.indexOf(constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX) == 0 ||
            custom_id.indexOf(constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX) == 0 ||
            custom_id.indexOf(constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX) == 0) {
            return true;
        }
        // is not recruitment interaction
        return false;
    }
}
exports.ButtonInteractionController = ButtonInteractionController;
//# sourceMappingURL=button_interaction_controller.js.map