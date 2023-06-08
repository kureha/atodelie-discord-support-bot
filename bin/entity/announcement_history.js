"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementHistory = void 0;
// import constants
const constants_1 = require("../common/constants");
// import sqlite utils
const sqlite_utils_1 = require("../logic/sqlite_utils");
/**
 * Activity class
 */
class AnnouncementHistory {
    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.server_id = constants_1.Constants.STRING_EMPTY;
        this.channel_id = constants_1.Constants.STRING_EMPTY;
        this.game_name = constants_1.Constants.STRING_EMPTY;
        this.announcement_time = constants_1.Constants.get_default_date();
    }
    /**
     * convert database select data to instance
     * @param row t_friend_code table single row
     * @returns friend_code's instance, return blank instance if error occured
     */
    static parse_from_db(row) {
        let v = new AnnouncementHistory();
        try {
            v.server_id = sqlite_utils_1.SqliteUtils.get_value(row.server_id);
            v.channel_id = sqlite_utils_1.SqliteUtils.get_value(row.channel_id);
            v.game_name = sqlite_utils_1.SqliteUtils.get_value(row.game_name);
            try {
                v.announcement_time = new Date(row.announcement_time);
            }
            catch (e) {
                v.announcement_time = constants_1.Constants.get_default_date();
            }
        }
        catch (e) {
            // if error, re-create new instance
            v = new AnnouncementHistory();
        }
        return v;
    }
}
exports.AnnouncementHistory = AnnouncementHistory;
//# sourceMappingURL=announcement_history.js.map