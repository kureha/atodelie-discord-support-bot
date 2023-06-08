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
const command_game_master_controller_1 = require("./command_game_master_controller");
class CommandController {
    /**
     * Controller main method.
     * @param interaction
     */
    static recieve(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.commandName == constants.DISCORD_COMMAND_NEW_RECRUITMENT) {
                const controller = new command_recruitment_controller_1.CommandRecruitmentController();
                yield controller.new_recruitment_input_modal(interaction);
            }
            else if (interaction.commandName == constants.DISCORD_COMMAND_EDIT_RECRUITMENT) {
                const controller = new command_recruitment_controller_1.CommandRecruitmentController();
                yield controller.edit_recruitment_input_modal(interaction);
            }
            else if (interaction.commandName == constants.DISCORD_COMMAND_DELETE_RECRUITMENT) {
                const controller = new command_recruitment_controller_1.CommandRecruitmentController();
                yield controller.delete_recruitment(interaction);
            }
            else if (interaction.commandName == constants.DISCORD_COMMAND_USER_INFO_LIST_GET) {
                const controller = new command_export_controller_1.CommandExportController();
                yield controller.export_user_info(interaction);
            }
            else if (interaction.commandName == constants.DISCORD_COMMAND_REGIST_MASTER) {
                const controller = new command_server_controller_1.CommandServerController();
                yield controller.regist_server_master(interaction);
            }
            else if (interaction.commandName == constants.DISCORD_COMMAND_SEARCH_FRIEND_CODE) {
                const controller = new command_friend_code_controller_1.CommandFriendCodeController();
                yield controller.search_friend_code(interaction);
            }
            else if (interaction.commandName == constants.DISCORD_COMMAND_REGIST_FRIEND_CODE) {
                const controller = new command_friend_code_controller_1.CommandFriendCodeController();
                yield controller.regist_friend_code(interaction);
            }
            else if (interaction.commandName == constants.DISCORD_COMMAND_DELETE_FRIEND_CODE) {
                const controller = new command_friend_code_controller_1.CommandFriendCodeController();
                yield controller.delete_friend_code(interaction);
            }
            else if (interaction.commandName == constants.DISCORD_COMMAND_EDIT_GAME_MASTER) {
                const controller = new command_game_master_controller_1.CommandGameMasterController();
                yield controller.select_game_master(interaction);
            }
            else {
                logger_1.logger.error(`Interaction recieved, but command is invalid. command = ${interaction.commandName}`);
                yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);
            }
        });
    }
}
exports.CommandController = CommandController;
//# sourceMappingURL=command_controller.js.map