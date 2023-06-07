"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import constants
const constants_1 = require("../../common/constants");
const user_info_1 = require("../../entity/user_info");
describe("entity.user_info test.", () => {
    test("test for constructor user info", () => {
        expect(new user_info_1.UserInfo()).toEqual({
            id: constants_1.Constants.STRING_EMPTY,
            name: constants_1.Constants.STRING_EMPTY,
            roles: [],
        });
    });
    test("test for constructor role info", () => {
        expect(new user_info_1.RoleInfo()).toEqual({
            id: constants_1.Constants.STRING_EMPTY,
            name: constants_1.Constants.STRING_EMPTY,
        });
    });
    test.each([
        ["", ""],
        ["test_id_1", "test_id_2"],
    ])("user info parse from discord object test. %s, %s", (id, name) => {
        // create exp object
        const u = new user_info_1.UserInfo();
        u.id = id;
        u.name = name;
        // expect
        expect(user_info_1.UserInfo.parse_from_discordjs({ user: { id: id, username: name } })).toStrictEqual(u);
    });
    test.each([
        ["", ""],
        ["test_id_1", "test_id_2"],
    ])("role info parse from discord object test. %s, %s", (id, name) => {
        // create exp object
        const r = new user_info_1.RoleInfo();
        r.id = id;
        r.name = name;
        // expect
        expect(user_info_1.RoleInfo.parse_from_discordjs({ id: id, name: name })).toStrictEqual(r);
    });
});
describe("entity.user_info function test.", () => {
    test("test add role to user", () => {
        // create test data
        const u = new user_info_1.UserInfo();
        const r1 = new user_info_1.RoleInfo();
        r1.id = "test_id_1";
        r1.name = "test_name_1";
        const r2 = new user_info_1.RoleInfo();
        r2.id = "test_id_2";
        r2.name = "test_name_2";
        // check blank status
        expect(u.roles.length).toEqual(0);
        // add roles
        u.add(r1);
        u.add(r2);
        expect(u.roles.length).toEqual(2);
        expect(u.roles).toContainEqual(r1);
        expect(u.roles).toContainEqual(r2);
        // add double role
        u.add(r1);
        expect(u.roles.length).toEqual(3);
    });
});
describe("parse_list_from_discordjs test.", () => {
    var _a, _b, _c, _d, _e, _f;
    // setup stab
    const guild = {
        roles: {
            cache: [
                { id: "test_id_1", name: "test_name_1" },
                { id: "test_id_2", name: "test_name_2" },
                { id: "test_id_3", name: "test_name_3" },
            ]
        }
    };
    const reuslt = user_info_1.RoleInfo.parse_list_from_discordjs(guild);
    expect(reuslt.length).toEqual(3);
    expect((_a = reuslt[0]) === null || _a === void 0 ? void 0 : _a.id).toEqual("test_id_1");
    expect((_b = reuslt[0]) === null || _b === void 0 ? void 0 : _b.name).toEqual("test_name_1");
    expect((_c = reuslt[1]) === null || _c === void 0 ? void 0 : _c.id).toEqual("test_id_2");
    expect((_d = reuslt[1]) === null || _d === void 0 ? void 0 : _d.name).toEqual("test_name_2");
    expect((_e = reuslt[2]) === null || _e === void 0 ? void 0 : _e.id).toEqual("test_id_3");
    expect((_f = reuslt[2]) === null || _f === void 0 ? void 0 : _f.name).toEqual("test_name_3");
});
//# sourceMappingURL=entity.user_info.test.js.map