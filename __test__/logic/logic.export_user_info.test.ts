import { ExportUserInfo } from '../../logic/export_user_info';

test.each(
    [["test1\\ttest2", "test1\ttest2"], ["test1\\rtest2", "test1\rtest2"], ["test1\\ntest2", "test1\ntest2"], ["test1\\r\\ntest2", "test1\r\ntest2"], ["test1test2", "test1test2"], ["", ""]]
)("test for get non-escaped characters, %s -> %s", (input: string, exp: string) => {
    let export_user_info: ExportUserInfo = new ExportUserInfo();
    expect(export_user_info.parse_escaped_characters(input)).toEqual(exp);
});