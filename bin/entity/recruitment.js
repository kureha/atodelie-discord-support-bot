"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recruitment = void 0;
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import sqlite utils
const sqlite_utils_1 = require("../logic/sqlite_utils");
class Recruitment {
    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.id = constants.ID_INVALID;
        this.server_id = '';
        this.message_id = '';
        this.thread_id = '';
        this.token = '';
        this.status = constants.STATUS_DISABLED;
        this.limit_time = constants_1.Constants.get_default_date();
        this.name = '';
        this.owner_id = '';
        this.description = '';
        this.regist_time = constants_1.Constants.get_default_date();
        this.update_time = constants_1.Constants.get_default_date();
        this.delete = false;
        // insert participate array
        this.user_list = [];
    }
    /**
     * convert database select data to instance
     * @param row m_recruitment table single row
     * @returns recruitment's instance, return blank instance if error occured
     */
    static parse_from_db(row) {
        let v = new Recruitment();
        try {
            v.id = sqlite_utils_1.SqliteUtils.get_value(row.id);
            v.server_id = sqlite_utils_1.SqliteUtils.get_value(row.server_id);
            v.message_id = sqlite_utils_1.SqliteUtils.get_value(row.message_id);
            v.thread_id = sqlite_utils_1.SqliteUtils.get_value(row.thread_id);
            v.token = sqlite_utils_1.SqliteUtils.get_value(row.token);
            v.status = sqlite_utils_1.SqliteUtils.get_value(row.status);
            v.limit_time = sqlite_utils_1.SqliteUtils.get_date_value(row.limit_time);
            v.name = sqlite_utils_1.SqliteUtils.get_value(row.name);
            v.owner_id = sqlite_utils_1.SqliteUtils.get_value(row.owner_id);
            v.description = sqlite_utils_1.SqliteUtils.get_value(row.description);
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
            v = new Recruitment();
        }
        return v;
    }
}
exports.Recruitment = Recruitment;
//# sourceMappingURL=recruitment.js.map