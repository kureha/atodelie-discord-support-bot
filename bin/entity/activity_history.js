"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityHistory = void 0;
// import constants
const constants_1 = require("../common/constants");
// import sqlite utils
const sqlite_utils_1 = require("../logic/sqlite_utils");
/**
 * Activity class
 */
class ActivityHistory {
    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.server_id = constants_1.Constants.STRING_EMPTY;
        this.channel_id = constants_1.Constants.STRING_EMPTY;
        this.game_name = constants_1.Constants.STRING_EMPTY;
        this.member_count = 0;
        this.total_member_count = 0;
        this.change_time = constants_1.Constants.get_default_date();
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
        let v = new ActivityHistory();
        try {
            v.server_id = sqlite_utils_1.SqliteUtils.get_value(row.server_id);
            v.channel_id = sqlite_utils_1.SqliteUtils.get_value(row.channel_id);
            v.game_name = sqlite_utils_1.SqliteUtils.get_value(row.game_name);
            v.member_count = sqlite_utils_1.SqliteUtils.get_value(row.member_count);
            v.total_member_count = sqlite_utils_1.SqliteUtils.get_value(row.total_member_count);
            try {
                v.change_time = new Date(row.change_time);
            }
            catch (e) {
                v.change_time = constants_1.Constants.get_default_date();
            }
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
            v = new ActivityHistory();
        }
        return v;
    }
}
exports.ActivityHistory = ActivityHistory;
//# sourceMappingURL=activity_history.js.map