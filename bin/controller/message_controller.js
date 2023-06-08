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
exports.MessageController = void 0;
// import constants
const constants_1 = require("./../common/constants");
// import controller
const message_regist_command_controller_1 = require("./message_regist_command_controller");
class MessageController {
    /**
     * Controller main method.
     * @param message
     * @param client_id
     */
    static recirve(message, client_id = constants_1.Constants.STRING_EMPTY) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new message_regist_command_controller_1.MessageRegistCommandController();
            if (controller.is_regist_command(client_id, message)) {
                yield controller.regist_command(message, client_id);
            }
        });
    }
}
exports.MessageController = MessageController;
//# sourceMappingURL=message_controller.js.map