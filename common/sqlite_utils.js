"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqliteUtils = void 0;
class SqliteUtils {
    /**
     * Get string for sqlite now datetime
     */
    static get_now() {
        return this.get_now_with_extend(undefined);
    }
    /**
     * Get string for sqlite now datetime with extend time
     * @param extend
     */
    static get_now_with_extend(extend) {
        const arr = ['\'now\'', '\'localtime\''];
        // if extend is enabled, add extend to array
        if (extend !== undefined) {
            arr.push('\'' + extend + '\'');
        }
        // join and retrun
        return `datetime(${arr.join(', ')})`;
    }
}
exports.SqliteUtils = SqliteUtils;
//# sourceMappingURL=sqlite_utils.js.map