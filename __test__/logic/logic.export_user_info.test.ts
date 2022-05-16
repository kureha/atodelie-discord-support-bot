import { Constants } from '../../common/constants';
const constants = new Constants();

import { ExportUserInfo } from '../../logic/export_user_info';

test("test for get non-escaped characters", () => {
    let export_user_info: ExportUserInfo = new ExportUserInfo();

    expect(export_user_info.parse_escaped_characters("test1\\ttest2")).toEqual("test1\ttest2");
    expect(export_user_info.parse_escaped_characters("test1\\rtest2")).toEqual("test1\rtest2");
    expect(export_user_info.parse_escaped_characters("test1\\ntest2")).toEqual("test1\ntest2");
    expect(export_user_info.parse_escaped_characters("test1\\r\\ntest2")).toEqual("test1\r\ntest2");

    expect(export_user_info.parse_escaped_characters("test1test2")).toEqual("test1test2");
});