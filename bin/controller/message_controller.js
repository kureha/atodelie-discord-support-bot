"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
// define logger
const logger_1 = require("./../common/logger");
// import constants
const constants_1 = require("./../common/constants");
const constants = new constants_1.Constants();
// import controller
const message_regist_command_controller_1 = require("./message_regist_command_controller");
class MessageController {
    /**
     * Controller main method.
     * @param message
     * @param client_id
     */
    static recirve(message, client_id = constants_1.Constants.STRING_EMPTY) {
        try {
            if (message_regist_command_controller_1.MessageRegistCommandController.is_regist_command(client_id, message)) {
                message_regist_command_controller_1.MessageRegistCommandController.regist_command(message, client_id);
            }
        }
        catch (err) {
            logger_1.logger.error(err);
            message.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
        }
    }
}
exports.MessageController = MessageController;
//# sourceMappingURL=message_controller.js.map