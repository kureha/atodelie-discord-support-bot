"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Participate = void 0;
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import sqlite utils
const sqlite_utils_1 = require("../logic/sqlite_utils");
class Participate {
    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.id = constants.ID_INVALID;
        this.token = '';
        this.status = constants.STATUS_DISABLED;
        this.user_id = '';
        this.description = '';
        this.delete = false;
    }
    /**
     * convert database select data to instance
     * @param row t_participate table single row
     * @param token token because participate table has not token column
     * @returns participate instance, return blank instance if error occuered
     */
    static parse_from_db(row, token) {
        let v = new Participate();
        try {
            v.id = sqlite_utils_1.SqliteUtils.get_value(row.id);
            v.token = sqlite_utils_1.SqliteUtils.get_value(token);
            v.status = sqlite_utils_1.SqliteUtils.get_value(row.status);
            v.user_id = sqlite_utils_1.SqliteUtils.get_value(row.user_id);
            v.description = sqlite_utils_1.SqliteUtils.get_value(row.description);
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
            v = new Participate();
        }
        return v;
    }
}
exports.Participate = Participate;
//# sourceMappingURL=participate.js.map