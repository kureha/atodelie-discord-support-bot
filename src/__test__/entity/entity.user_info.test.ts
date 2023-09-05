// import constants
import { Constants } from '../../common/constants';

// import discord modules
import * as Discord from 'discord.js';

import { UserInfo, RoleInfo } from '../../entity/user_info';

describe("entity.user_info test.", () => {
    test("test for constructor user info", () => {
        expect(new UserInfo()).toEqual({
            id: Constants.STRING_EMPTY,
            name: Constants.STRING_EMPTY,
            roles: [],
        });
    });

    test("test for constructor role info", () => {
        expect(new RoleInfo()).toEqual({
            id: Constants.STRING_EMPTY,
            name: Constants.STRING_EMPTY,
        });
    });

    test.each([
        ["", ""],
        ["test_id_1", "test_id_2"],
    ])("user info parse from discord object test. %s, %s", (
        id: string,
        name: string
    ) => {
        // create exp object
        const u = new UserInfo();
        u.id = id;
        u.name = name;

        // expect
        expect(UserInfo.parse_from_discordjs(
            { user: { id: id, username: name } } as Discord.GuildMember)).toStrictEqual(u);
    });

    test.each([
        ["", ""],
        ["test_id_1", "test_id_2"],
    ])("role info parse from discord object test. %s, %s", (
        id: string,
        name: string
    ) => {
        // create exp object
        const r = new RoleInfo();
        r.id = id;
        r.name = name;

        // expect
        expect(RoleInfo.parse_from_discordjs(
            { id: id, name: name } as Discord.Role)).toStrictEqual(r);
    });
});

describe("entity.user_info function test.", () => {
    test("test add role to user", () => {
        // create test data
        const u = new UserInfo();
        const r1 = new RoleInfo();
        r1.id = "test_id_1";
        r1.name = "test_name_1"
        const r2 = new RoleInfo();
        r2.id = "test_id_2";
        r2.name = "test_name_2"

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
    test('test for parse_list_from_discordjs', () => {
        // setup stab
        const guild: any = {
            roles: {
                cache: [
                    { id: "test_id_1", name: "test_name_1" },
                    { id: "test_id_2", name: "test_name_2" },
                    { id: "test_id_3", name: "test_name_3" },
                ]
            }
        };

        const reuslt = RoleInfo.parse_list_from_discordjs(guild);
        expect(reuslt.length).toEqual(3);
        expect(reuslt[0]?.id).toEqual("test_id_1");
        expect(reuslt[0]?.name).toEqual("test_name_1");
        expect(reuslt[1]?.id).toEqual("test_id_2");
        expect(reuslt[1]?.name).toEqual("test_name_2");
        expect(reuslt[2]?.id).toEqual("test_id_3");
        expect(reuslt[2]?.name).toEqual("test_name_3");
    });
});
