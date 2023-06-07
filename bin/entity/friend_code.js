"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendCode = void 0;
// import constants
const constants_1 = require("../common/constants");
// import logger
const logger_1 = require("../common/logger");
// import sqlite utils
const sqlite_utils_1 = require("../logic/sqlite_utils");
/**
 * Game friend code class
 */
class FriendCode {
    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.server_id = constants_1.Constants.STRING_EMPTY;
        this.user_id = constants_1.Constants.STRING_EMPTY;
        this.user_name = constants_1.Constants.STRING_EMPTY;
        this.game_id = constants_1.Constants.STRING_EMPTY;
        this.game_name = constants_1.Constants.STRING_EMPTY;
        this.friend_code = constants_1.Constants.STRING_EMPTY;
        this.regist_time = constants_1.Constants.get_default_date();
        this.update_time = constants_1.Constants.get_default_date();
        this.delete = false;
    }
    /**
     * convert database select data to instance
     * @param row t_friend_code table single row
     * @returns friend_code's instance, return blank instance if error occured
     */
    static parse_from_db(row) {
        let v = new FriendCode();
        try {
            v.server_id = sqlite_utils_1.SqliteUtils.get_value(row.server_id);
            v.user_id = sqlite_utils_1.SqliteUtils.get_value(row.user_id);
            v.user_name = sqlite_utils_1.SqliteUtils.get_value(row.user_name);
            v.game_id = sqlite_utils_1.SqliteUtils.get_value(row.game_id);
            v.game_name = sqlite_utils_1.SqliteUtils.get_value(row.game_name);
            v.friend_code = sqlite_utils_1.SqliteUtils.get_value(row.friend_code);
            // regist_time, update_time is nullable
            try {
                v.regist_time = new Date(row.regist_time);
            }
            catch (e) {
                v.regist_time = constants_1.Constants.get_default_date();
            }
            try {
                v.update_time = new Date(row.update_time);
            }
            catch (e) {
                v.update_time = constants_1.Constants.get_default_date();
            }
            // db delete is number, change boolean
            if (row.delete == true) {
                v.delete = true;
            }
            else {
                v.delete = false;
            }
        }
        catch (e) {
            // if error, re-create new instance
            v = new FriendCode();
        }
        return v;
    }
    /**
     * get friend code from list by game id.
     * if not found, throw error.
     * @param friend_code_list
     * @param game_id
     * @returns
     */
    static search(friend_code_list, game_id) {
        let friend_code = new FriendCode();
        // value use for exists or not exists
        const idx_friend_code_not_found = -1;
        let idx_friend_code_found = idx_friend_code_not_found;
        // search db result list and set
        friend_code_list.forEach((fc, idx) => {
            if (fc.game_id == game_id) {
                logger_1.logger.info(`data found. server_id = ${fc.server_id}, user_id = ${fc.user_id}, game_id = ${fc.game_id}, friend_code = ${fc.friend_code}`);
                friend_code = fc;
                // input founded idx
                idx_friend_code_found = idx;
            }
        });
        // check friend code is exists?
        if (idx_friend_code_found == idx_friend_code_not_found) {
            throw new Error(`data not found from list. game_id = ${game_id}`);
        }
        // return value
        return friend_code;
    }
}
exports.FriendCode = FriendCode;
//# sourceMappingURL=friend_code.js.map