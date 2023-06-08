"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqliteUtils = void 0;
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
}
exports.SqliteUtils = SqliteUtils;
//# sourceMappingURL=sqlite_utils.js.map