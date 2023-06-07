"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerInfo = void 0;
// import constants
const constants_1 = require("../common/constants");
// import sqlite utils
const sqlite_utils_1 = require("../logic/sqlite_utils");
class ServerInfo {
    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.server_id = '';
        this.channel_id = '';
        this.recruitment_target_role = '';
        this.follow_time = constants_1.Constants.get_default_date();
    }
    /**
     * convert database select data to instance
     * @param row m_server_info table single row
     * @returns server info instance, return blank instance if error occuered
     */
    static parse_from_db(row) {
        let v = new ServerInfo();
        try {
            v.server_id = sqlite_utils_1.SqliteUtils.get_value(row.server_id);
            v.channel_id = sqlite_utils_1.SqliteUtils.get_value(row.channel_id);
            v.recruitment_target_role = sqlite_utils_1.SqliteUtils.get_value(row.recruitment_target_role);
            // follow_time is nullable
            try {
                v.follow_time = new Date(row.follow_time);
            }
            catch (e) {
                v.follow_time = constants_1.Constants.get_default_date();
            }
        }
        catch (e) {
            v = new ServerInfo();
        }
        return v;
    }
}
exports.ServerInfo = ServerInfo;
//# sourceMappingURL=server_info.js.map