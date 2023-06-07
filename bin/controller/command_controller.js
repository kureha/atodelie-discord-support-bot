"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandController = void 0;
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import logger
const logger_1 = require("../common/logger");
// import child controllers
const command_recruitment_controller_1 = require("./command_recruitment_controller");
const command_friend_code_controller_1 = require("./command_friend_code_controller");
const command_server_controller_1 = require("./command_server_controller");
const command_export_controller_1 = require("./command_export_controller");
class CommandController {
    /**
     * Controller main method.
     * @param interaction
     */
    static recieve(interaction) {
        try {
            if (interaction.commandName == constants.DISCORD_COMMAND_NEW_RECRUITMENT) {
                command_recruitment_controller_1.CommandRecruitmentController.new_recruitment_input_modal(interaction);
            }
            else if (interaction.commandName == constants.DISCORD_COMMAND_EDIT_RECRUITMENT) {
                command_recruitment_controller_1.CommandRecruitmentController.edit_recruitment_input_modal(interaction);
            }
            else if (interaction.commandName == constants.DISCORD_COMMAND_DELETE_RECRUITMENT) {
                command_recruitment_controller_1.CommandRecruitmentController.delete_recruitment(interaction);
            }
            else if (interaction.commandName == constants.DISCORD_COMMAND_USER_INFO_LIST_GET) {
                command_export_controller_1.CommandExportController.export_user_info(interaction);
            }
            else if (interaction.commandName == constants.DISCORD_COMMAND_REGIST_MASTER) {
                command_server_controller_1.CommandServerController.regist_server_master(interaction);
            }
            else if (interaction.commandName == constants.DISCORD_COMMAND_SEARCH_FRIEND_CODE) {
                command_friend_code_controller_1.CommandFriendCodeController.search_friend_code(interaction);
            }
            else if (interaction.commandName == constants.DISCORD_COMMAND_REGIST_FRIEND_CODE) {
                command_friend_code_controller_1.CommandFriendCodeController.regist_friend_code(interaction);
            }
            else if (interaction.commandName == constants.DISCORD_COMMAND_DELETE_FRIEND_CODE) {
                command_friend_code_controller_1.CommandFriendCodeController.delete_friend_code(interaction);
            }
            else {
                logger_1.logger.error(`Interaction recieved, but command is invalid. command = ${interaction.commandName}`);
                interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);
            }
        }
        catch (err) {
            logger_1.logger.error(err);
            interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
        }
    }
}
exports.CommandController = CommandController;
//# sourceMappingURL=command_controller.js.map