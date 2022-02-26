"use strict";
exports.__esModule = true;
exports.SqliteUtils = void 0;
var SqliteUtils = /** @class */ (function () {
    function SqliteUtils() {
    }
    /**
     * Get string for sqlite now datetime
     */
    SqliteUtils.get_now = function () {
        return this.get_now_with_extend(undefined);
    };
    /**
     * Get string for sqlite now datetime with extend time
     * @param extend
     */
    SqliteUtils.get_now_with_extend = function (extend) {
        var arr = ['\'now\'', '\'localtime\''];
        // if extend is enabled, add extend to array
        if (extend !== undefined) {
            arr.push('\'' + extend + '\'');
        }
        // join and retrun
        return "datetime(".concat(arr.join(', '), ")");
    };
    return SqliteUtils;
}());
exports.SqliteUtils = SqliteUtils;
