// setup for mock
import * as Discord from 'discord.js';

import { Constants } from "../../common/constants";
const constants = new Constants();

import { GameMaster } from "../../entity/game_master";
import { RoleInfo, UserInfo } from "../../entity/user_info";
import { DiscordCommon } from "../../logic/discord_common";
import { TestDiscordMock } from "../common/test_discord_mock";

// setup for mock
import { TestEntity } from "../common/test_entity";

function get_role_info_list(): RoleInfo[] {
    let role_info_list: RoleInfo[] = [];

    let v: RoleInfo = new RoleInfo();
    v.id = "12345";
    v.name = "Test"
    role_info_list.push(v);

    v = new RoleInfo();
    v.id = "56789";
    v.name = "Sample"
    role_info_list.push(v);

    return role_info_list;
}

describe("check_privillege", () => {
    test.each([
        ["test_admin_user_id", "test_admin_user_id", true, true],
        ["test_admin_user_id", "test_user_id", true, false],
        ["test_admin_user_id", undefined, true, false],
        ["test_admin_user_id", null, true, false],
        ["test_admin_user_id", "test_admin_user_id", false, true],
        ["test_admin_user_id", "test_user_id", false, true],
        ["test_admin_user_id", undefined, false, true],
        ["test_admin_user_id", null, false, true],
    ])
        ("test for check privilleges, (%s, %s, %s) -> %s", (admin_user_id: any, check_user_id: any, is_check_privillege: any, exp: boolean) => {
            expect(DiscordCommon.check_privillege(admin_user_id, check_user_id, is_check_privillege)).toEqual(exp);
        });
});

describe("get_text_channel", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("test for get_text_channel", () => {
        // setup mocks
        const Mock = TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();

        expect(DiscordCommon.get_text_channel(client, "test")).not.toBe(undefined);
    });

    test("test for get_text_channel error (undefined)", () => {
        // setup mocks
        const Mock = TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();

        // hack mock
        client.channels.cache.get = (k: string): any => {
            return undefined;
        }

        // expect
        expect.assertions(1);
        expect(() => {
            DiscordCommon.get_text_channel(client, "test");
        }).toThrow("Target channel is not exists.");
    });

    test("test for get_text_channel error (channel is not tex tbased)", () => {
        // setup mocks
        const Mock = TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();

        // hack mock
        client.channels.cache.get = (k: string): any => {
            return {
                isTextBased: (): boolean => {
                    return false;
                }
            };
        }

        // expect
        expect.assertions(1);
        expect(() => {
            DiscordCommon.get_text_channel(client, "test");
        }).toThrow(`Target channel is not text channel.`);
    });
});

describe("get_voice_channel_id_list", () => {
    test("test for get_voice_channel_id_list", () => {
        // setup mocks
        const channelsMock = new Map<string, any>();

        // test param set
        let channel_id: string = "test_ch_1";
        channelsMock.set(channel_id, {
            id: channel_id,
            isVoiceBased: (): boolean => { return false },
        });
        channel_id = "test_ch_2";
        channelsMock.set(channel_id, {
            id: channel_id,
            isVoiceBased: (): boolean => { return true },
        });
        channel_id = "test_ch_3";
        channelsMock.set(channel_id, {
            id: channel_id,
            isVoiceBased: (): boolean => { return false },
        });
        channel_id = "test_ch_4";
        channelsMock.set(channel_id, {
            id: channel_id,
            isVoiceBased: (): boolean => { return true },
        });

        const guildMock = {
            channels: {
                cache: channelsMock,
            },
        };

        const result: string[] = DiscordCommon.get_voice_channel_id_list(guildMock as Discord.Guild);
        expect(result).toEqual(["test_ch_2", "test_ch_4"]);
    });

    test("test for get_voice_channel_id_list blank", () => {
        // setup mocks
        const channelsMock = new Map<string, any>();
        const guildMock = {
            channels: {
                cache: channelsMock,
            },
        };

        const result: string[] = DiscordCommon.get_voice_channel_id_list(guildMock as Discord.Guild);
        expect(result).toEqual([]);
    });
});

describe("get_voice_channel", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("test for get_voice_channel", async () => {
        // setup mocks
        const Mock = TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();

        // hack mock
        client.channels.fetch = (k: string): any => {
            return {
                isTextBased: (): boolean => {
                    return false;
                },
                isVoiceBased: (): boolean => {
                    return true;
                }
            };
        }

        const channel = await DiscordCommon.get_voice_channel(client, "test");
        expect(channel).not.toBe(undefined);
    });

    test("test for get_voice_channel error (undefined)", async () => {
        // setup mocks
        const Mock = TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();

        // hack mock
        client.channels.fetch = (k: string): any => {
            return undefined;
        }

        // expect
        expect.assertions(1);
        try {
            await DiscordCommon.get_voice_channel(client, "test");
        } catch (e) {
            expect(e).toContain("Target channel is not exists.");
        }
    });

    test("test for get_voice_channel error (channel is not tex tbased)", async () => {
        // setup mocks
        const Mock = TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();

        // expect
        expect.assertions(1);
        try {
            await DiscordCommon.get_voice_channel(client, "test");
        } catch (e) {
            expect(e).toContain("Target channel is not voice channel.");
        }
    });
});


describe("get_guild_id_from_guild", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("test for get_guild_id_from_guild", () => {
        // setup mocks
        const Mock = TestDiscordMock.select_menu_interaction_mock("test_custom_id", "test_guild_id", "test_user_id", []);
        const client = new Mock();

        expect(DiscordCommon.get_guild_id_from_guild(client.guild)).toEqual("test_guild_id");
    });

    test.each([
        [undefined], [null]
    ])("test for get_guild_id_from_guild error (undefined | null)", (v: any) => {
        // expect
        expect.assertions(1);
        expect(() => {
            DiscordCommon.get_guild_id_from_guild(v);
        }).toThrow("guild id is undefined.");
    });
});

describe("get_user_id_from_user", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("test for get_user_id_from_user", () => {
        // setup mocks
        const Mock = TestDiscordMock.select_menu_interaction_mock("test_custom_id", "test_guild_id", "test_user_id", []);
        const client = new Mock();

        expect(DiscordCommon.get_guild_id_from_guild(client.user)).toEqual("test_user_id");
    });

    test.each([
        [undefined], [null]
    ])("test for get_user_id_from_user error (undefined | null)", (v: any) => {
        // expect
        expect.assertions(1);
        expect(() => {
            DiscordCommon.get_user_id_from_user(v);
        }).toThrow(`user id is undefined.`);
    });
});

describe("get_user_name_from_user", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("test for get_user_name_from_user", () => {
        // setup mocks
        const Mock = TestDiscordMock.select_menu_interaction_mock("test_custom_id", "test_guild_id", "test_user_id", []);
        const client = new Mock();

        expect(DiscordCommon.get_user_name_from_user(client.user)).toEqual("test_user_id");
    });

    test.each([
        [undefined], [null]
    ])("test for get_user_name_from_user error (undefined | null)", (v: any) => {
        // expect
        expect.assertions(1);
        expect(() => {
            DiscordCommon.get_user_name_from_user(v);
        }).toThrow(`user name is undefined.`);
    });
});

describe("get_user_id_from_user", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("test for get_user_id_from_user", () => {
        // setup mocks
        const Mock = TestDiscordMock.select_menu_interaction_mock("test_custom_id", "test_guild_id", "test_user_id", []);
        const client = new Mock();

        expect(DiscordCommon.get_guild_id_from_guild(client.user)).toEqual("test_user_id");
    });

    test.each([
        [undefined], [null]
    ])("test for get_user_id_from_user error (undefined | null)", (v: any) => {
        // expect
        expect.assertions(1);
        expect(() => {
            DiscordCommon.get_user_id_from_user(v);
        }).toThrow(`user id is undefined.`);
    });
});

describe("replace_intaraction_description_roles", () => {
    test.each([
        ["@test_role_name_1 @test_role_name_2 sample", "<@&test_role_id_1> <@&test_role_id_2> sample"],
        ["test @test_role_name_1 @test_role_name_2", "test <@&test_role_id_1> <@&test_role_id_2>"],
        ["test @test_role_name_1 @test_role_name_2 sample", "test <@&test_role_id_1> <@&test_role_id_2> sample"],
        ["test @test_role_name_1\n @test_role_name_2 sample", "test <@&test_role_id_1>\n <@&test_role_id_2> sample"],
        ["test @test_role_name_1\r\n @test_role_name_2 sample", "test <@&test_role_id_1>\r\n <@&test_role_id_2> sample"],
        ["test sample", "test sample"],
        ["", ""],
        ["test test_role_name_1 test_role_name_2 sample", "test test_role_name_1 test_role_name_2 sample"],
    ])("test for replace_intaraction_description_roles. (%s -> %s)", (desc: string, exp: string) => {
        let role_info_list: RoleInfo[] = TestEntity.get_test_role_info(10);
        expect(DiscordCommon.replace_intaraction_description_roles(desc, role_info_list)).toEqual(exp);
    });

    test.each([
        ["", ""],
        ["@Test 募集します", "<@&12345> 募集します"],
        ["募集します @Sample", "募集します <@&56789>"],
        ["@Test 募集します @Sample", "<@&12345> 募集します <@&56789>"],
        ["@Test 募集します \r\n@Sample", "<@&12345> 募集します \r\n<@&56789>"],
        ["<@&Test> 募集します", "<@&Test> 募集します"],
    ])('test for replace interaction test (%s, %s)', (input: string, exp: string) => {
        expect(DiscordCommon.replace_intaraction_description_roles(input, get_role_info_list())).toEqual(exp);
    });
});

describe("get_interaction_value_by_idx", () => {
    test.each([
        [["test1", "test2", "test3"], 0, "test1"],
        [["test1", "test2", "test3"], 1, "test2"],
        [["test1", "test2", "test3"], 2, "test3"],
        [["test3"], 0, "test3"],
        [[""], 0, ""],
    ])("test for replace_intaraction_description_roles. (%s[%s] -> %s)", (values: string[], idx: number, exp: string) => {
        expect(DiscordCommon.get_interaction_value_by_idx(values, idx)).toEqual(exp);
    });

    test.each([
        [[], 0, `target index value is not exists.`],
        [["test1", "test2", "test3"], -1, "target idx is out of range."],
        [["test1", "test2", "test3"], 3, "target idx is out of range."],
        [["test1", "test2", undefined], 2, "target idx is undefined."],
    ])("test for error replace_intaraction_description_roles. (%s[%s] -> %s)", (values: any[], idx: number, exp: string) => {
        expect(() => { DiscordCommon.get_interaction_value_by_idx(values, idx) }).toThrow(exp);
    });
});

describe("get_single_user_info", () => {
    test.each([
        ["test_user_id_0", 0],
        ["test_user_id_5", 5],
        ["test_user_id_9", 9],
    ])("test for get_single_user_info. (%s -> %s)", (user_id: string, exp: number) => {
        let user_info_list: UserInfo[] = [];
        for (let i = 0; i < 10; i++) {
            user_info_list.push(TestEntity.get_test_user_info(i, i * 2));
        }
        expect(DiscordCommon.get_single_user_info(user_id, user_info_list)).toEqual(user_info_list[exp]);
    });

    test.each([
        ["test_user_id_11"],
    ])("test for get_single_user_info error. (%s -> %s)", (user_id: string) => {
        let user_info_list: UserInfo[] = [];
        for (let i = 0; i < 10; i++) {
            user_info_list.push(TestEntity.get_test_user_info(i, i * 2));
        }
        expect(() => { DiscordCommon.get_single_user_info(user_id, user_info_list) }).toThrow("target user info is not found.");
    });
});

describe("get_game_master_from_list", () => {
    test.each([
        ["test_game_id", 0],
        ["test_game_id_second", 1],
        ["test_game_id_third", 2],
    ])("test for get_game_master_from_list.", (game_id: string, exp: number) => {
        let game_master_list: GameMaster[] = [TestEntity.get_test_game_master_info()];
        let val_1 = TestEntity.get_test_game_master_info();
        val_1.game_id = val_1.game_id + "_second";
        game_master_list.push(val_1);
        let val_2 = TestEntity.get_test_game_master_info();
        val_2.game_id = val_2.game_id + "_third";
        game_master_list.push(val_2);

        expect(DiscordCommon.get_game_master_from_list(game_id, game_master_list)).toEqual(game_master_list[exp]);
    });

    test.each([
        ["test_game_id_not_foud", "target game not found. "],
    ])("test for get_game_master_from_list.", (game_id: string, exp: string) => {
        let game_master_list: GameMaster[] = [TestEntity.get_test_game_master_info()];
        let val_1 = TestEntity.get_test_game_master_info();
        val_1.game_id = val_1.game_id + "_second";
        game_master_list.push(val_1);
        let val_2 = TestEntity.get_test_game_master_info();
        val_2.game_id = val_2.game_id + "_third";
        game_master_list.push(val_2);

        expect(() => { DiscordCommon.get_game_master_from_list(game_id, game_master_list) }).toThrow(exp);
    });
});

describe("get_role_info_from_guild", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("test for get_role_info_from_guild.", () => {
        // setup mocks
        const Mock = TestDiscordMock.select_menu_interaction_mock("test_custom_id", "test_guild_id", "test_user_id", []);
        const guild = new Mock().guild;
        const role_info_list = TestEntity.get_test_role_info(5);
        jest.spyOn(RoleInfo, "parse_list_from_discordjs").mockImplementation((guild: Discord.Guild): RoleInfo[] => {
            return role_info_list;
        });

        // expect
        const result = DiscordCommon.get_role_info_from_guild(guild);
        expect(result.length).toEqual(5);
        expect(result).toStrictEqual(role_info_list);
    });

    test.each([
        [undefined], [null]
    ])("test for get_role_info_from_guild error. (%s)", (v: any) => {
        // expect
        const result = DiscordCommon.get_role_info_from_guild(v);
        expect(result.length).toEqual(0);
    });
});

describe("get_game_master_from_guild", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("test for get_game_master_from_guild.", () => {
        // setup mocks
        const Mock = TestDiscordMock.select_menu_interaction_mock("test_custom_id", "test_guild_id", "test_user_id", []);
        const guild = new Mock().guild;
        const role_info_list = TestEntity.get_test_role_info(3).reverse();
        const other_role_count = 3;
        jest.spyOn(RoleInfo, "parse_list_from_discordjs").mockImplementation((guild: Discord.Guild): RoleInfo[] => {
            return role_info_list;
        });

        // expect
        const result = DiscordCommon.get_game_master_from_guild(guild, [role_info_list[1]?.name || Constants.STRING_EMPTY], other_role_count);
        expect(result.length).toEqual(2 + other_role_count);
        expect(result[0]?.game_id).toEqual(role_info_list[2]?.id);
        expect(result[0]?.game_name).toEqual(role_info_list[2]?.name);
        expect(result[1]?.game_id).toEqual(role_info_list[0]?.id);
        expect(result[1]?.game_name).toEqual(role_info_list[0]?.name);
        expect(result[2]?.game_id).toEqual("-1000");
        expect(result[2]?.game_name).toEqual(constants.DISCORD_FRIEND_CODE_OTHER_NAME_FORMAT.replace('%%DISCORD_FRIEND_CODE_OTHER_COUNT%%', "1"));
        expect(result[3]?.game_id).toEqual("-1001");
        expect(result[3]?.game_name).toEqual(constants.DISCORD_FRIEND_CODE_OTHER_NAME_FORMAT.replace('%%DISCORD_FRIEND_CODE_OTHER_COUNT%%', "2"));
        expect(result[4]?.game_id).toEqual("-1002");
        expect(result[4]?.game_name).toEqual(constants.DISCORD_FRIEND_CODE_OTHER_NAME_FORMAT.replace('%%DISCORD_FRIEND_CODE_OTHER_COUNT%%', "3"));
    });

    test.each([
        [undefined], [null]
    ])("test for get_game_master_from_guild error. (%s)", (v: any) => {
        // expect
        const result = DiscordCommon.get_game_master_from_guild(v, [], 0);
        expect(result.length).toEqual(0);
    });
});

describe("get_game_master_list_select_menu", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("test for get_game_master_list_select_menu blank.", () => {
        // setup mock
        const set_custom_id = jest.fn((v: string): Discord.SelectMenuBuilder => { return new Discord.SelectMenuBuilder() });
        const add_options = jest.fn((): any => { });
        const set_placeholder = jest.fn((v: string): any => { });
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "setCustomId").mockImplementation(set_custom_id);
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "addOptions").mockImplementation(add_options);
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "setPlaceholder").mockImplementation(set_placeholder);

        // custom mock
        const add_components = jest.fn((): any => { return true; });
        jest.spyOn(Discord.ActionRowBuilder.prototype, "addComponents").mockImplementation(add_components);

        const result = DiscordCommon.get_game_master_list_select_menu("test_custom_id", [], 25);
        expect(result.length).toEqual(0);

        // selectmenu
        expect(set_custom_id).toBeCalledTimes(0);
        expect(add_options).toBeCalledTimes(0);
        expect(set_placeholder).toBeCalledTimes(0);

        // actionrow
        expect(add_components).toBeCalledTimes(0);
    });

    test("test for get_game_master_list_select_menu single.", () => {
        // setup mock
        const set_custom_id = jest.fn((v: string): Discord.SelectMenuBuilder => { return new Discord.SelectMenuBuilder() });
        const add_options = jest.fn((): any => { });
        const set_placeholder = jest.fn((v: string): any => { return new Discord.SelectMenuBuilder() });
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "setCustomId").mockImplementation(set_custom_id);
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "addOptions").mockImplementation(add_options);
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "setPlaceholder").mockImplementation(set_placeholder);

        // custom mock
        const add_components = jest.fn((): any => { return true; });
        jest.spyOn(Discord.ActionRowBuilder.prototype, "addComponents").mockImplementation(add_components);

        const result = DiscordCommon.get_game_master_list_select_menu("test_custom_id", [TestEntity.get_test_game_master_info()], 25);
        expect(result.length).toEqual(1);

        // expect jest fn
        expect(set_custom_id.mock.calls[0]).toEqual(["test_custom_id-0"]);
        expect(add_options).toBeCalledTimes(1);
        expect(set_placeholder.mock.calls[0]).toEqual(["test_game_name ～ test_game_name"]);

        // expect jest fn
        expect(add_components).toBeCalledTimes(1);
    });

    test("test for get_game_master_list_select_menu multi.", () => {
        // setup mock
        const set_custom_id = jest.fn((v: string): Discord.SelectMenuBuilder => { return new Discord.SelectMenuBuilder() });
        const add_options = jest.fn((): any => { });
        const set_placeholder = jest.fn((v: string): any => { return new Discord.SelectMenuBuilder() });
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "setCustomId").mockImplementation(set_custom_id);
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "addOptions").mockImplementation(add_options);
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "setPlaceholder").mockImplementation(set_placeholder);

        // custom mock
        const add_components = jest.fn((): any => { return true; });
        jest.spyOn(Discord.ActionRowBuilder.prototype, "addComponents").mockImplementation(add_components);

        // create argument
        const gm_list: GameMaster[] = [];
        const option_num: number = 23;
        const split_num: number = 5;
        for (let i = 0; i < option_num; i++) {
            const v = TestEntity.get_test_game_master_info();
            v.game_id = `${v.game_id}-${i}`;
            v.game_name = `${v.game_name}-${i}`;
            gm_list.push(v);
        }

        const result = DiscordCommon.get_game_master_list_select_menu("test_custom_id", gm_list, split_num);
        expect(result.length).toEqual(5);

        // expect jest fn
        expect(set_custom_id.mock.calls).toEqual([["test_custom_id-0"], ["test_custom_id-1"], ["test_custom_id-2"], ["test_custom_id-3"], ["test_custom_id-4"]]);
        expect(add_options).toBeCalledTimes(option_num);
        expect(set_placeholder.mock.calls[0]).toEqual([`test_game_name-0 ～ test_game_name-4`]);
        expect(set_placeholder.mock.calls[1]).toEqual([`test_game_name-5 ～ test_game_name-9`]);
        expect(set_placeholder.mock.calls[2]).toEqual([`test_game_name-10 ～ test_game_name-14`]);
        expect(set_placeholder.mock.calls[3]).toEqual([`test_game_name-15 ～ test_game_name-19`]);
        expect(set_placeholder.mock.calls[4]).toEqual([`test_game_name-20 ～ test_game_name-22`]);

        // expect jest fn
        expect(add_components).toBeCalledTimes(5);
    });

    test("test for get_game_master_list_select_menu multi at single.", () => {
        // setup mock
        const set_custom_id = jest.fn((v: string): Discord.SelectMenuBuilder => { return new Discord.SelectMenuBuilder() });
        const add_options = jest.fn((): any => { });
        const set_placeholder = jest.fn((v: string): any => { return new Discord.SelectMenuBuilder() });
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "setCustomId").mockImplementation(set_custom_id);
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "addOptions").mockImplementation(add_options);
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "setPlaceholder").mockImplementation(set_placeholder);

        // custom mock
        const add_components = jest.fn((): any => { return true; });
        jest.spyOn(Discord.ActionRowBuilder.prototype, "addComponents").mockImplementation(add_components);

        // create argument
        const gm_list: GameMaster[] = [];
        const option_num: number = 23;
        const split_num: number = 23;
        for (let i = 0; i < option_num; i++) {
            const v = TestEntity.get_test_game_master_info();
            v.game_id = `${v.game_id}-${i}`;
            v.game_name = `${v.game_name}-${i}`;
            gm_list.push(v);
        }

        const result = DiscordCommon.get_game_master_list_select_menu("test_custom_id", gm_list, split_num);
        expect(result.length).toEqual(1);

        // expect jest fn
        expect(set_custom_id.mock.calls).toEqual([["test_custom_id-0"]]);
        expect(add_options).toBeCalledTimes(option_num);
        expect(set_placeholder.mock.calls[0]).toEqual([`test_game_name-0 ～ test_game_name-22`]);

        // expect jest fn
        expect(add_components).toBeCalledTimes(1);
    });

    test.each([
        [0], [-1]
    ])("test for get_game_master_list_select_menu error. (%s)", (split_num: number) => {
        expect(() => { DiscordCommon.get_game_master_list_select_menu("test_custom_id", [], split_num) }).toThrow("split length can't be under 1.");
    });
});


describe("get_role_list_select_menu", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("test for get_role_list_select_menu blank.", () => {
        // create test data
        const guild: any = {
            roles: {
                cache: []
            }
        };

        // setup mock
        const set_custom_id = jest.fn((v: string): Discord.SelectMenuBuilder => { return new Discord.SelectMenuBuilder() });
        const add_options = jest.fn((): any => { });
        const set_placeholder = jest.fn((v: string): any => { return new Discord.SelectMenuBuilder() });
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "setCustomId").mockImplementation(set_custom_id);
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "addOptions").mockImplementation(add_options);
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "setPlaceholder").mockImplementation(set_placeholder);

        // custom mock
        const add_components = jest.fn((): any => { return true; });
        jest.spyOn(Discord.ActionRowBuilder.prototype, "addComponents").mockImplementation(add_components);

        // execute
        DiscordCommon.get_role_list_select_menu("test_custom_id", "test_placeholder", guild);

        // expect jest fn
        expect(set_custom_id.mock.calls[0]).toEqual(["test_custom_id"]);
        expect(add_options).toBeCalledTimes(0);
        expect(set_placeholder.mock.calls[0]).toEqual(["test_placeholder"]);

        // expect jest fn
        expect(add_components).toBeCalledTimes(1);
    });

    test("test for get_role_list_select_menu.", () => {
        // create test data
        const guild: any = {
            roles: {
                cache: [
                    {
                        id: "test_role_id-0",
                        name: "test_role_name-0",
                    },
                    {
                        id: "test_role_id-1",
                        name: "test_role_name-1",
                    },
                    {
                        id: "test_role_id-2",
                        name: "test_role_name-2",
                    }
                ]
            }
        };

        // setup mock
        const set_custom_id = jest.fn((v: string): Discord.SelectMenuBuilder => { return new Discord.SelectMenuBuilder() });
        const add_options = jest.fn((): any => { });
        const set_placeholder = jest.fn((v: string): any => { return new Discord.SelectMenuBuilder() });
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "setCustomId").mockImplementation(set_custom_id);
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "addOptions").mockImplementation(add_options);
        jest.spyOn(Discord.SelectMenuBuilder.prototype, "setPlaceholder").mockImplementation(set_placeholder);

        // custom mock
        const add_components = jest.fn((): any => { return true; });
        jest.spyOn(Discord.ActionRowBuilder.prototype, "addComponents").mockImplementation(add_components);

        // execute
        DiscordCommon.get_role_list_select_menu("test_custom_id", "test_placeholder", guild);

        // expect jest fn
        expect(set_custom_id.mock.calls[0]).toEqual(["test_custom_id"]);
        expect(add_options).toBeCalledTimes(3);
        expect(set_placeholder.mock.calls[0]).toEqual(["test_placeholder"]);

        // expect jest fn
        expect(add_components).toBeCalledTimes(1);
    });
});

describe("get_limit_time_str", () => {
    test.each([
        [new Date('1970-01-01T00:00:00.000+09:00'), "00:00"],
        [new Date('2099-01-01T23:59:59.000+09:00'), "23:59"],
        [new Date('2099-01-01T01:01:59.000+09:00'), "01:01"],
        [new Date('2099-01-01T09:09:59.000+09:00'), "09:09"],
    ])("test for get_limit_time_str. (%s -> %s)", (date: Date, exp: string) => {
        expect(DiscordCommon.get_limit_time_str(date)).toEqual(exp);
    });
});

describe("get_button", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("test for get_button.", () => {
        TestDiscordMock.button_builder_mock();
        DiscordCommon.get_button("test_custom_id", "test_label", 1);
    });
});

describe("get_text_input", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("test for get_text_input.", () => {
        TestDiscordMock.text_input_builder_mock();
        DiscordCommon.get_text_input("test_custom_id", "test_label", 1);
    });
});