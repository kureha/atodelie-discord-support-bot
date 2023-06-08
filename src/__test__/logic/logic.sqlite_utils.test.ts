import { SqliteUtils } from '../../logic/sqlite_utils';

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