"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSuggestRecruitmentController = void 0;
// import constants
const constants_1 = require("./../common/constants");
const constants = new constants_1.Constants();
class MessageSuggestRecruitmentController {
    /**
     * Judge message is suggest
     * @param client_id
     * @param message
     * @returns
     */
    is_suggest_command(client_id, message) {
        let result = false;
        return result;
    }
    /**
     * Judge contains time string
     * @param message
     * @returns
     */
    is_contain_timestring(message) {
        // define ret
        let result = false;
        // time regexp
        const time_re = /([01][0-9]|2[0-3])[:]{0,1}([0-5][0-9])/;
        // execution match
        const match_result = message.match(time_re);
        if (match_result !== null && match_result.length > 0) {
            result = true;
        }
        // return result
        return result;
    }
}
exports.MessageSuggestRecruitmentController = MessageSuggestRecruitmentController;
//# sourceMappingURL=message_suggest_recruitment_coontroller.js.map