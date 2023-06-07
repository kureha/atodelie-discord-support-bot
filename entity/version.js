"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Version = void 0;
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
            v.app_version = row.app_version;
            v.database_version = row.database_version;
        }
        catch (e) {
            v = new Version();
        }
        return v;
    }
}
exports.Version = Version;
//# sourceMappingURL=version.js.map