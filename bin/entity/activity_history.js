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
            v.change_time = sqlite_utils_1.SqliteUtils.get_date_value(row.change_time);
            v.regist_time = sqlite_utils_1.SqliteUtils.get_date_value(row.regist_time);
            v.update_time = sqlite_utils_1.SqliteUtils.get_date_value(row.update_time);
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