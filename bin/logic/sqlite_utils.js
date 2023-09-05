"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqliteUtils = void 0;
const constants_1 = require("../common/constants");
class SqliteUtils {
    /**
     * get value from object. if undefined, throw new error.
     * @param v
     */
    static get_value(v) {
        if (v == undefined) {
            throw new Error(`value is undefined or null.`);
        }
        else {
            return v;
        }
    }
    /**
     * get date value from object. if undefined, return default value.
     * @param v
     * @returns
     */
    static get_date_value(v) {
        let result = new Date(v);
        if (Number.isNaN(result.getTime())) {
            return constants_1.Constants.get_default_date();
        }
        else {
            return result;
        }
    }
}
exports.SqliteUtils = SqliteUtils;
//# sourceMappingURL=sqlite_utils.js.map