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
exports.MessageRegistCommandController = void 0;
// define logger
const logger_1 = require("./../common/logger");
// import constants
const constants_1 = require("./../common/constants");
const constants = new constants_1.Constants();
// import logic
const discord_register_command_1 = require("../logic/discord_register_command");
const discord_common_1 = require("../logic/discord_common");
class MessageRegistCommandController {
    /**
     * regist slash command to server.
     * @param message
     * @param client_id
     */
    regist_command(message, client_id, is_check_privillege = true) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check privilleges
                if (discord_common_1.DiscordCommon.check_privillege(constants.DISCORD_BOT_ADMIN_USER_ID, (_a = message.client.user) === null || _a === void 0 ? void 0 : _a.id, is_check_privillege) == true) {
                    logger_1.logger.info(`regist command privillege check ok. user id = ${(_b = message.client.user) === null || _b === void 0 ? void 0 : _b.id}`);
                }
                else {
                    logger_1.logger.error(`regist command failed to privillege check. user id = ${(_c = message.client.user) === null || _c === void 0 ? void 0 : _c.id}`);
                    message.reply(constants.DISCORD_MESSAGE_NO_PERMISSION);
                    // resolve (no permissions)
                    return false;
                }
                // call regist slash command logic
                const register_command = new discord_register_command_1.DiscordRegisterCommand();
                const success_server_info = yield register_command.regist_command(client_id);
                logger_1.logger.info(`regist slash command successed. server info count = ${success_server_info.length}`);
                // reply message
                yield message.reply(constants.DISCORD_MESSAGE_COMMAND_IS_REGIST);
            }
            catch (err) {
                logger_1.logger.error(`regist slash command error.`, err);
                yield message.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                return false;
            }
            logger_1.logger.info(`regist slash command completed.`);
            return true;
        });
    }
    /**
     * Check message is regist command.
     * @param client_id
     * @param message
     * @returns
     */
    is_regist_command(client_id, message) {
        // define result value
        let result = false;
        // check values
        if (message.mentions.users.has(client_id) && message.content.indexOf(constants.DISCORD_COMMAND_REGIST_COMMAND) > 0) {
            logger_1.logger.info(`recieved message is regist command. message = ${message.content}`);
            result = true;
        }
        // return result
        return result;
    }
}
exports.MessageRegistCommandController = MessageRegistCommandController;
//# sourceMappingURL=message_regist_command_controller.js.map