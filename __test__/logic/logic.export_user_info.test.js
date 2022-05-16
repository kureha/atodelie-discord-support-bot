"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const export_user_info_1 = require("../../logic/export_user_info");
test("test for get non-escaped characters", () => {
    let export_user_info = new export_user_info_1.ExportUserInfo();
    expect(export_user_info.parse_escaped_characters("test1\\ttest2")).toEqual("test1\ttest2");
    expect(export_user_info.parse_escaped_characters("test1\\rtest2")).toEqual("test1\rtest2");
    expect(export_user_info.parse_escaped_characters("test1\\ntest2")).toEqual("test1\ntest2");
    expect(export_user_info.parse_escaped_characters("test1\\r\\ntest2")).toEqual("test1\r\ntest2");
    expect(export_user_info.parse_escaped_characters("test1test2")).toEqual("test1test2");
});
//# sourceMappingURL=logic.export_user_info.test.js.map