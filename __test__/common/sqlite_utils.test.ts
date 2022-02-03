import { SqliteUtils } from '../../common/sqlite_utils';

test("test for get_now_with_extend", () => {
    const add_time = '+30 minutes';
    const result = SqliteUtils.get_now_with_extend(add_time);
    expect(result).toBe("datetime('now', 'localtime', '" + add_time + "')");
});

test("test for get_now", () => {
    const result = SqliteUtils.get_now();
    expect(result).toBe("datetime('now', 'localtime')");
});