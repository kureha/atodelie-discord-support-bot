"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_utils_1 = require("../../logic/sqlite_utils");
describe("get_value test.", () => {
    test.each([
        ["a", "a"],
        ["", ""],
        [" ", " "],
        ["undefined", "undefined"],
    ])("test for get string value. input = %s", (input, exp) => {
        expect(sqlite_utils_1.SqliteUtils.get_value(input)).toEqual(exp);
    });
    test.each([undefined, null])("test for get undefined or null value, expect exception. input = %s", (input) => {
        expect(() => { sqlite_utils_1.SqliteUtils.get_value(input); }).toThrowError(/^value is undefined or null\./);
    });
});
//# sourceMappingURL=logic.sqlite_utils.test.js.map