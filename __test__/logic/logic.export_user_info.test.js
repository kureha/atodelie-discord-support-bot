"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const export_user_info_1 = require("../../logic/export_user_info");
test.each([["test1\\ttest2", "test1\ttest2"], ["test1\\rtest2", "test1\rtest2"], ["test1\\ntest2", "test1\ntest2"], ["test1\\r\\ntest2", "test1\r\ntest2"], ["test1test2", "test1test2"], ["", ""]])("test for get non-escaped characters, %s -> %s", (input, exp) => {
    let export_user_info = new export_user_info_1.ExportUserInfo();
    expect(export_user_info.parse_escaped_characters(input)).toEqual(exp);
});
//# sourceMappingURL=logic.export_user_info.test.js.map