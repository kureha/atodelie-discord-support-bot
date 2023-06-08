"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Version = void 0;
// import sqlite utils
const sqlite_utils_1 = require("../logic/sqlite_utils");
class Version {
    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.app_version = '';
        this.database_version = '';
    }
    /**
     * convert database select data to instance
     * @param row m_version table single row
     * @returns version instance, return blank instance if error occuered
     */
    static parse_from_db(row) {
        let v = new Version();
        try {
            v.app_version = sqlite_utils_1.SqliteUtils.get_value(row.app_version);
            v.database_version = sqlite_utils_1.SqliteUtils.get_value(row.database_version);
        }
        catch (e) {
            v = new Version();
        }
        return v;
    }
}
exports.Version = Version;
//# sourceMappingURL=version.js.map