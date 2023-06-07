import { SqliteUtils } from '../../logic/sqlite_utils';

describe("check_open_database test.", () => {
    test.each([
        [":memory:", true],
        ["initial.sqlite", true],
        ["notfound.sqlite", false],
        ["", false],
    ])("test for check_open_database(%s -> %s)", (input: string, exp: boolean) => {
        expect(SqliteUtils.check_open_database(input)).toEqual(exp);
    });
});

describe("get_now_with_extend test.", () => {
    test("test for get_now", () => {
        const result = SqliteUtils.get_now();
        expect(result).toBe("datetime('now', 'localtime')");
    });
    test.each(
        [
            ['+30 minutes', "datetime('now', 'localtime', '+30 minutes')"],
            ['-30 minutes', "datetime('now', 'localtime', '-30 minutes')"],
            ['', "datetime('now', 'localtime')"],
            [' ', "datetime('now', 'localtime')"],
        ]
    )("test for get_now_with_extend, %s -> %s", (input: string, exp: string) => {
        expect(SqliteUtils.get_now_with_extend(input)).toBe(exp);
    });
});

describe("get_value test.", () => {
    test.each([
        ["a", "a"],
        ["", ""],
        [" ", " "],
        ["undefined", "undefined"],
    ])("test for get string value. input = %s", (input: string, exp: string) => {
        expect(SqliteUtils.get_value(input)).toEqual(exp);
    });

    test.each([undefined, null])("test for get undefined or null value, expect exception. input = %s", (input: string | undefined | null) => {
        expect(() => { SqliteUtils.get_value(input) }).toThrowError(/^value is undefined or null\./);
    });
});