"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_info_1 = require("../../entity/user_info");
const export_user_info_1 = require("../../logic/export_user_info");
const test_entity_1 = require("../common/test_entity");
// import fs module
const fs = __importStar(require("fs"));
describe("parse_user_info", () => {
    function get_test_user_info(user_idx, role_num) {
        const user_info = {
            user: {
                id: `test_user_id_${user_idx}`,
                username: `test_user_name_${user_idx}`,
            },
            roles: {
                cache: new Map(),
            },
        };
        for (let i = 1; i <= role_num; i++) {
            user_info.roles.cache.set(`test_role_id_${i}`, {
                id: `test_role_id_${i}`,
                name: `test_role_name_${i}`,
            });
        }
        return user_info;
    }
    test("test for parse_user_info single.", () => {
        const discord_user_info_list = [get_test_user_info(2, 3)];
        const export_user_info = new export_user_info_1.ExportUserInfo();
        const user_info_list = export_user_info.parse_user_info(discord_user_info_list);
        // expects
        expect(user_info_list.length).toEqual(1);
        let u = user_info_list[0] || new user_info_1.UserInfo();
        expect(u.id).toEqual(`test_user_id_2`);
        expect(u.name).toEqual(`test_user_name_2`);
        expect(u.roles.length).toEqual(3);
        let r = u.roles[0] || new user_info_1.RoleInfo();
        ;
        expect(r.id).toEqual(`test_role_id_1`);
        expect(r.name).toEqual(`test_role_name_1`);
        r = u.roles[2] || new user_info_1.RoleInfo();
        ;
        expect(r.id).toEqual(`test_role_id_3`);
        expect(r.name).toEqual(`test_role_name_3`);
    });
    test("test for parse_user_info multi.", () => {
        var _a, _b;
        const discord_user_info_list = [
            get_test_user_info(1, 1),
            get_test_user_info(2, 3)
        ];
        const v = new export_user_info_1.ExportUserInfo();
        const user_info_list = v.parse_user_info(discord_user_info_list);
        // expects
        expect(user_info_list.length).toEqual(2);
        expect((_a = user_info_list[0]) === null || _a === void 0 ? void 0 : _a.roles.length).toEqual(1);
        expect((_b = user_info_list[1]) === null || _b === void 0 ? void 0 : _b.roles.length).toEqual(3);
    });
});
describe("get_output_string test.", () => {
    test("test for get output string from user info lists.", () => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const export_user_info = new export_user_info_1.ExportUserInfo();
        // test user 1
        const test_user_1 = test_entity_1.TestEntity.get_test_user_info(1, 2);
        // test role 2 is add role
        const test_user_2 = test_entity_1.TestEntity.get_test_user_info(2, 0);
        const add_role = new user_info_1.RoleInfo();
        add_role.id = `test_role_id_3`;
        add_role.name = `test_role_name_3`;
        test_user_2.add(add_role);
        const test_user_list = [test_user_1, test_user_2];
        const result = export_user_info.get_output_string(test_user_list);
        // split
        const result_arr = result.split(`\r\n`);
        // line is 4, header = 1, user = 2, eof = 1
        expect(result_arr.length).toEqual(4);
        // check header
        const header = result_arr[0] || '';
        expect(header.length).toBeGreaterThan(0);
        expect(header.split(`\t`).length).toEqual(5);
        expect(header.split(`\t`)[2]).toEqual(`${(_a = test_user_1.roles[0]) === null || _a === void 0 ? void 0 : _a.name}(${(_b = test_user_1.roles[0]) === null || _b === void 0 ? void 0 : _b.id})`);
        expect(header.split(`\t`)[3]).toEqual(`${(_c = test_user_1.roles[1]) === null || _c === void 0 ? void 0 : _c.name}(${(_d = test_user_1.roles[1]) === null || _d === void 0 ? void 0 : _d.id})`);
        expect(header.split(`\t`)[4]).toEqual(`${add_role.name}(${add_role.id})`);
        // check data 1
        const user_1 = result_arr[1] || '';
        expect(user_1.length).toBeGreaterThan(0);
        expect(user_1.split(`\t`)[0]).toEqual(test_user_1.name);
        expect(user_1.split(`\t`)[1]).toEqual(test_user_1.id);
        expect((_e = user_1.split(`\t`)[2]) === null || _e === void 0 ? void 0 : _e.length).toBeGreaterThan(0);
        expect((_f = user_1.split(`\t`)[3]) === null || _f === void 0 ? void 0 : _f.length).toBeGreaterThan(0);
        expect((_g = user_1.split(`\t`)[4]) === null || _g === void 0 ? void 0 : _g.length).toEqual(0);
        // check data 2
        const user_2 = result_arr[2] || '';
        expect(user_2.length).toBeGreaterThan(0);
        expect(user_2.split(`\t`)[0]).toEqual(test_user_2.name);
        expect(user_2.split(`\t`)[1]).toEqual(test_user_2.id);
        expect((_h = user_2.split(`\t`)[2]) === null || _h === void 0 ? void 0 : _h.length).toEqual(0);
        expect((_j = user_2.split(`\t`)[3]) === null || _j === void 0 ? void 0 : _j.length).toEqual(0);
        expect((_k = user_2.split(`\t`)[4]) === null || _k === void 0 ? void 0 : _k.length).toBeGreaterThan(0);
        // check eof is blank
        expect((_l = result_arr[3]) === null || _l === void 0 ? void 0 : _l.length).toEqual(0);
    });
});
describe("export_to_file test.", () => {
    test("test for export to file test.", () => {
        const export_user_info = new export_user_info_1.ExportUserInfo();
        const output_filename = `./.data/test.csv`;
        const output_data = `test1, test2`;
        export_user_info.export_to_file(output_filename, output_data);
        expect(fs.existsSync(output_filename)).toEqual(true);
        expect(fs.readFileSync(output_filename, { encoding: 'utf-8' }).toString()).toEqual(output_data);
    });
    test("test for export to file error test.", () => {
        const export_user_info = new export_user_info_1.ExportUserInfo();
        const output_filename = ``;
        const output_data = `test1, test2`;
        // expected assertions is 1
        expect(() => {
            export_user_info.export_to_file(output_filename, output_data);
        }).toThrowError(/^ENOENT: no such file or directory, open/);
    });
});
describe("parse_escaped_characters test.", () => {
    test.each([["test1\\ttest2", "test1\ttest2"], ["test1\\rtest2", "test1\rtest2"], ["test1\\ntest2", "test1\ntest2"], ["test1\\r\\ntest2", "test1\r\ntest2"], ["test1test2", "test1test2"], ["", ""]])("test for get non-escaped characters, %s -> %s", (input, exp) => {
        let export_user_info = new export_user_info_1.ExportUserInfo();
        expect(export_user_info.parse_escaped_characters(input)).toEqual(exp);
    });
});
//# sourceMappingURL=logic.export_user_info.test.js.map