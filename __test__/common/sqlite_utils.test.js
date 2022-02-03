"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_utils_1 = require("../../common/sqlite_utils");
test("test for get_now_with_extend", () => {
    const add_time = '+30 minutes';
    const result = sqlite_utils_1.SqliteUtils.get_now_with_extend(add_time);
    expect(result).toBe("datetime('now', 'localtime', '" + add_time + "')");
});
test("test for get_now", () => {
    const result = sqlite_utils_1.SqliteUtils.get_now();
    expect(result).toBe("datetime('now', 'localtime')");
});
//# sourceMappingURL=sqlite_utils.test.js.map