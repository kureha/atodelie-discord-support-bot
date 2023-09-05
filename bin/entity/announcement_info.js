"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementInfo = void 0;
// import constants
const constants_1 = require("../common/constants");
// import sqlite utils
const sqlite_utils_1 = require("../logic/sqlite_utils");
const announcement_history_1 = require("./announcement_history");
/**
 * Announcement Information
 */
class AnnouncementInfo {
    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.server_id = '';
        this.channel_id = '';
        this.current_game_member_count = 0;
        this.max_total_member_count = 0;
        this.game_name = '';
        this.game_start_time = constants_1.Constants.get_default_date();
    }
    /**
     * returns announcement history from this object
     * @returns
     */
    to_history() {
        let v = new announcement_history_1.AnnouncementHistory();
        v.server_id = this.server_id;
        v.channel_id = this.channel_id;
        v.game_name = this.game_name;
        v.announcement_time = new Date();
        return v;
    }
    /**
     * convert database select data to instance
     * @param row t_friend_code table single row
     * @returns friend_code's instance, return blank instance if error occured
     */
    static parse_from_db(row) {
        let v = new AnnouncementInfo();
        try {
            v.server_id = sqlite_utils_1.SqliteUtils.get_value(row.server_id);
            v.channel_id = sqlite_utils_1.SqliteUtils.get_value(row.channel_id);
            v.current_game_member_count = sqlite_utils_1.SqliteUtils.get_value(row.current_game_member_count);
            v.max_total_member_count = sqlite_utils_1.SqliteUtils.get_value(row.max_total_member_count);
            v.game_name = sqlite_utils_1.SqliteUtils.get_value(row.game_name);
            v.game_start_time = sqlite_utils_1.SqliteUtils.get_date_value(row.game_start_time);
        }
        catch (e) {
            // if error, re-create new instance
            v = new AnnouncementInfo();
        }
        return v;
    }
}
exports.AnnouncementInfo = AnnouncementInfo;
//# sourceMappingURL=announcement_info.js.map