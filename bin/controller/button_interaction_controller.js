"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonInteractionController = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import controllers
const button_interaction_recruitment_controller_1 = require("./button_interaction_recruitment_controller");
// create message modules
const discord_message_1 = require("../logic/discord_message");
class ButtonInteractionController {
    /**
     * analyze discord interaction and send result message
     * @param interaction discord interaction
     */
    static recieve(interaction) {
        try {
            if (this.check_recruitment_interaction(interaction.customId)) {
                button_interaction_recruitment_controller_1.ButtonInteractionRecruitmentController.recruitment_interaction(interaction);
            }
            else {
                logger_1.logger.error(`Interaction recieved, but custom_id is invalid. custom_id = ${interaction.customId}`);
                interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);
            }
        }
        catch (err) {
            // send error message
            interaction.reply({
                content: `${discord_message_1.DiscordMessage.get_no_recruitment()} (Error: ${err})`,
                ephemeral: true,
            });
        }
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