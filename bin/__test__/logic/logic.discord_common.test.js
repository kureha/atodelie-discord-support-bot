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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// setup for mock
const Discord = __importStar(require("discord.js"));
const constants_1 = require("../../common/constants");
const constants = new constants_1.Constants();
const user_info_1 = require("../../entity/user_info");
const discord_common_1 = require("../../logic/discord_common");
const test_discord_mock_1 = require("../common/test_discord_mock");
// setup for mock
const test_entity_1 = require("../common/test_entity");
function get_role_info_list() {
    let role_info_list = [];
    let v = new user_info_1.RoleInfo();
    v.id = "12345";
    v.name = "Test";
    role_info_list.push(v);
    v = new user_info_1.RoleInfo();
    v.id = "56789";
    v.name = "Sample";
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
    ])("test for check privilleges, (%s, %s, %s) -> %s", (admin_user_id, check_user_id, is_check_privillege, exp) => {
        expect(discord_common_1.DiscordCommon.check_privillege(admin_user_id, check_user_id, is_check_privillege)).toEqual(exp);
    });
});
describe("get_text_channel", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test("test for get_text_channel", () => {
        // setup mocks
        const Mock = test_discord_mock_1.TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();
        expect(discord_common_1.DiscordCommon.get_text_channel(client, "test")).not.toBe(undefined);
    });
    test("test for get_text_channel error (undefined)", () => {
        // setup mocks
        const Mock = test_discord_mock_1.TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();
        // hack mock
        client.channels.cache.get = (k) => {
            return undefined;
        };
        // expect
        expect.assertions(1);
        expect(() => {
            discord_common_1.DiscordCommon.get_text_channel(client, "test");
        }).toThrow("Target channel is not exists.");
    });
    test("test for get_text_channel error (channel is not tex tbased)", () => {
        // setup mocks
        const Mock = test_discord_mock_1.TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();
        // hack mock
        client.channels.cache.get = (k) => {
            return {
                isTextBased: () => {
                    return false;
                }
            };
        };
        // expect
        expect.assertions(1);
        expect(() => {
            discord_common_1.DiscordCommon.get_text_channel(client, "test");
        }).toThrow(`Target channel is not text channel.`);
    });
});
describe("get_voice_channel_id_list", () => {
    test("test for get_voice_channel_id_list", () => {
        // setup mocks
        const channelsMock = new Map();
        // test param set
        let channel_id = "test_ch_1";
        channelsMock.set(channel_id, {
            id: channel_id,
            isVoiceBased: () => { return false; },
        });
        channel_id = "test_ch_2";
        channelsMock.set(channel_id, {
            id: channel_id,
            isVoiceBased: () => { return true; },
        });
        channel_id = "test_ch_3";
        channelsMock.set(channel_id, {
            id: channel_id,
            isVoiceBased: () => { return false; },
        });
        channel_id = "test_ch_4";
        channelsMock.set(channel_id, {
            id: channel_id,
            isVoiceBased: () => { return true; },
        });
        const guildMock = {
            channels: {
                cache: channelsMock,
            },
        };
        const result = discord_common_1.DiscordCommon.get_voice_channel_id_list(guildMock);
        expect(result).toEqual(["test_ch_2", "test_ch_4"]);
    });
    test("test for get_voice_channel_id_list blank", () => {
        // setup mocks
        const channelsMock = new Map();
        const guildMock = {
            channels: {
                cache: channelsMock,
            },
        };
        const result = discord_common_1.DiscordCommon.get_voice_channel_id_list(guildMock);
        expect(result).toEqual([]);
    });
});
describe("get_voice_channel", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test("test for get_voice_channel", () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        const Mock = test_discord_mock_1.TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();
        // hack mock
        client.channels.fetch = (k) => {
            return {
                isTextBased: () => {
                    return false;
                },
                isVoiceBased: () => {
                    return true;
                }
            };
        };
        const channel = yield discord_common_1.DiscordCommon.get_voice_channel(client, "test");
        expect(channel).not.toBe(undefined);
    }));
    test("test for get_voice_channel error (undefined)", () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        const Mock = test_discord_mock_1.TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();
        // hack mock
        client.channels.fetch = (k) => {
            return undefined;
        };
        // expect
        expect.assertions(1);
        try {
            yield discord_common_1.DiscordCommon.get_voice_channel(client, "test");
        }
        catch (e) {
            expect(e).toContain("Target channel is not exists.");
        }
    }));
    test("test for get_voice_channel error (channel is not tex tbased)", () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        const Mock = test_discord_mock_1.TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();
        // expect
        expect.assertions(1);
        try {
            yield discord_common_1.DiscordCommon.get_voice_channel(client, "test");
        }
        catch (e) {
            expect(e).toContain("Target channel is not voice channel.");
        }
    }));
});
describe("get_guild_id_from_guild", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test("test for get_guild_id_from_guild", () => {
        // setup mocks
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock("test_custom_id", "test_guild_id", "test_user_id", []);
        const client = new Mock();
        expect(discord_common_1.DiscordCommon.get_guild_id_from_guild(client.guild)).toEqual("test_guild_id");
    });
    test.each([
        [undefined], [null]
    ])("test for get_guild_id_from_guild error (undefined | null)", (v) => {
        // expect
        expect.assertions(1);
        expect(() => {
            discord_common_1.DiscordCommon.get_guild_id_from_guild(v);
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
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock("test_custom_id", "test_guild_id", "test_user_id", []);
        const client = new Mock();
        expect(discord_common_1.DiscordCommon.get_guild_id_from_guild(client.user)).toEqual("test_user_id");
    });
    test.each([
        [undefined], [null]
    ])("test for get_user_id_from_user error (undefined | null)", (v) => {
        // expect
        expect.assertions(1);
        expect(() => {
            discord_common_1.DiscordCommon.get_user_id_from_user(v);
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
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock("test_custom_id", "test_guild_id", "test_user_id", []);
        const client = new Mock();
        expect(discord_common_1.DiscordCommon.get_user_name_from_user(client.user)).toEqual("test_user_id");
    });
    test.each([
        [undefined], [null]
    ])("test for get_user_name_from_user error (undefined | null)", (v) => {
        // expect
        expect.assertions(1);
        expect(() => {
            discord_common_1.DiscordCommon.get_user_name_from_user(v);
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
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock("test_custom_id", "test_guild_id", "test_user_id", []);
        const client = new Mock();
        expect(discord_common_1.DiscordCommon.get_guild_id_from_guild(client.user)).toEqual("test_user_id");
    });
    test.each([
        [undefined], [null]
    ])("test for get_user_id_from_user error (undefined | null)", (v) => {
        // expect
        expect.assertions(1);
        expect(() => {
            discord_common_1.DiscordCommon.get_user_id_from_user(v);
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
    ])("test for replace_intaraction_description_roles. (%s -> %s)", (desc, exp) => {
        let role_info_list = test_entity_1.TestEntity.get_test_role_info(10);
        expect(discord_common_1.DiscordCommon.replace_intaraction_description_roles(desc, role_info_list)).toEqual(exp);
    });
    test.each([
        ["", ""],
        ["@Test 募集します", "<@&12345> 募集します"],
        ["募集します @Sample", "募集します <@&56789>"],
        ["@Test 募集します @Sample", "<@&12345> 募集します <@&56789>"],
        ["@Test 募集します \r\n@Sample", "<@&12345> 募集します \r\n<@&56789>"],
        ["<@&Test> 募集します", "<@&Test> 募集します"],
    ])('test for replace interaction test (%s, %s)', (input, exp) => {
        expect(discord_common_1.DiscordCommon.replace_intaraction_description_roles(input, get_role_info_list())).toEqual(exp);
    });
});
describe("get_interaction_value_by_idx", () => {
    test.each([
        [["test1", "test2", "test3"], 0, "test1"],
        [["test1", "test2", "test3"], 1, "test2"],
        [["test1", "test2", "test3"], 2, "test3"],
        [["test3"], 0, "test3"],
        [[""], 0, ""],
    ])("test for replace_intaraction_description_roles. (%s[%s] -> %s)", (values, idx, exp) => {
        expect(discord_common_1.DiscordCommon.get_interaction_value_by_idx(values, idx)).toEqual(exp);
    });
    test.each([
        [[], 0, `target index value is not exists.`],
        [["test1", "test2", "test3"], -1, "target idx is out of range."],
        [["test1", "test2", "test3"], 3, "target idx is out of range."],
        [["test1", "test2", undefined], 2, "target idx is undefined."],
    ])("test for error replace_intaraction_description_roles. (%s[%s] -> %s)", (values, idx, exp) => {
        expect(() => { discord_common_1.DiscordCommon.get_interaction_value_by_idx(values, idx); }).toThrow(exp);
    });
});
describe("get_single_user_info", () => {
    test.each([
        ["test_user_id_0", 0],
        ["test_user_id_5", 5],
        ["test_user_id_9", 9],
    ])("test for get_single_user_info. (%s -> %s)", (user_id, exp) => {
        let user_info_list = [];
        for (let i = 0; i < 10; i++) {
            user_info_list.push(test_entity_1.TestEntity.get_test_user_info(i, i * 2));
        }
        expect(discord_common_1.DiscordCommon.get_single_user_info(user_id, user_info_list)).toEqual(user_info_list[exp]);
    });
    test.each([
        ["test_user_id_11"],
    ])("test for get_single_user_info error. (%s -> %s)", (user_id) => {
        let user_info_list = [];
        for (let i = 0; i < 10; i++) {
            user_info_list.push(test_entity_1.TestEntity.get_test_user_info(i, i * 2));
        }
        expect(() => { discord_common_1.DiscordCommon.get_single_user_info(user_id, user_info_list); }).toThrow("target user info is not found.");
    });
});
describe("get_game_master_from_list", () => {
    test.each([
        ["test_game_id", 0],
        ["test_game_id_second", 1],
        ["test_game_id_third", 2],
    ])("test for get_game_master_from_list.", (game_id, exp) => {
        let game_master_list = [test_entity_1.TestEntity.get_test_game_master_info()];
        let val_1 = test_entity_1.TestEntity.get_test_game_master_info();
        val_1.game_id = val_1.game_id + "_second";
        game_master_list.push(val_1);
        let val_2 = test_entity_1.TestEntity.get_test_game_master_info();
        val_2.game_id = val_2.game_id + "_third";
        game_master_list.push(val_2);
        expect(discord_common_1.DiscordCommon.get_game_master_from_list(game_id, game_master_list)).toEqual(game_master_list[exp]);
    });
    test.each([
        ["test_game_id_not_foud", "target game not found. "],
    ])("test for get_game_master_from_list.", (game_id, exp) => {
        let game_master_list = [test_entity_1.TestEntity.get_test_game_master_info()];
        let val_1 = test_entity_1.TestEntity.get_test_game_master_info();
        val_1.game_id = val_1.game_id + "_second";
        game_master_list.push(val_1);
        let val_2 = test_entity_1.TestEntity.get_test_game_master_info();
        val_2.game_id = val_2.game_id + "_third";
        game_master_list.push(val_2);
        expect(() => { discord_common_1.DiscordCommon.get_game_master_from_list(game_id, game_master_list); }).toThrow(exp);
    });
});
describe("get_role_info_from_guild", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test("test for get_role_info_from_guild.", () => {
        // setup mocks
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock("test_custom_id", "test_guild_id", "test_user_id", []);
        const guild = new Mock().guild;
        const role_info_list = test_entity_1.TestEntity.get_test_role_info(5);
        jest.spyOn(user_info_1.RoleInfo, "parse_list_from_discordjs").mockImplementation((guild) => {
            return role_info_list;
        });
        // expect
        const result = discord_common_1.DiscordCommon.get_role_info_from_guild(guild);
        expect(result.length).toEqual(5);
        expect(result).toStrictEqual(role_info_list);
    });
    test.each([
        [undefined], [null]
    ])("test for get_role_info_from_guild error. (%s)", (v) => {
        // expect
        const result = discord_common_1.DiscordCommon.get_role_info_from_guild(v);
        expect(result.length).toEqual(0);
    });
});
describe("get_game_master_from_guild", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test("test for get_game_master_from_guild.", () => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        // setup mocks
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock("test_custom_id", "test_guild_id", "test_user_id", []);
        const guild = new Mock().guild;
        const role_info_list = test_entity_1.TestEntity.get_test_role_info(3);
        const other_role_count = 3;
        jest.spyOn(user_info_1.RoleInfo, "parse_list_from_discordjs").mockImplementation((guild) => {
            return role_info_list;
        });
        // expect
        const result = discord_common_1.DiscordCommon.get_game_master_from_guild(guild, [((_a = role_info_list[1]) === null || _a === void 0 ? void 0 : _a.name) || constants_1.Constants.STRING_EMPTY], other_role_count);
        expect(result.length).toEqual(2 + other_role_count);
        expect((_b = result[0]) === null || _b === void 0 ? void 0 : _b.game_id).toEqual((_c = role_info_list[0]) === null || _c === void 0 ? void 0 : _c.id);
        expect((_d = result[0]) === null || _d === void 0 ? void 0 : _d.game_name).toEqual((_e = role_info_list[0]) === null || _e === void 0 ? void 0 : _e.name);
        expect((_f = result[1]) === null || _f === void 0 ? void 0 : _f.game_id).toEqual((_g = role_info_list[2]) === null || _g === void 0 ? void 0 : _g.id);
        expect((_h = result[1]) === null || _h === void 0 ? void 0 : _h.game_name).toEqual((_j = role_info_list[2]) === null || _j === void 0 ? void 0 : _j.name);
        expect((_k = result[2]) === null || _k === void 0 ? void 0 : _k.game_id).toEqual("-1000");
        expect((_l = result[2]) === null || _l === void 0 ? void 0 : _l.game_name).toEqual(constants.DISCORD_FRIEND_CODE_OTHER_NAME_FORMAT.replace('%%DISCORD_FRIEND_CODE_OTHER_COUNT%%', "1"));
        expect((_m = result[3]) === null || _m === void 0 ? void 0 : _m.game_id).toEqual("-1001");
        expect((_o = result[3]) === null || _o === void 0 ? void 0 : _o.game_name).toEqual(constants.DISCORD_FRIEND_CODE_OTHER_NAME_FORMAT.replace('%%DISCORD_FRIEND_CODE_OTHER_COUNT%%', "2"));
        expect((_p = result[4]) === null || _p === void 0 ? void 0 : _p.game_id).toEqual("-1002");
        expect((_q = result[4]) === null || _q === void 0 ? void 0 : _q.game_name).toEqual(constants.DISCORD_FRIEND_CODE_OTHER_NAME_FORMAT.replace('%%DISCORD_FRIEND_CODE_OTHER_COUNT%%', "3"));
    });
    test("test for get_game_master_from_guild (reverse).", () => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        // setup mocks
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock("test_custom_id", "test_guild_id", "test_user_id", []);
        const guild = new Mock().guild;
        const role_info_list = test_entity_1.TestEntity.get_test_role_info(3).reverse();
        const other_role_count = 3;
        jest.spyOn(user_info_1.RoleInfo, "parse_list_from_discordjs").mockImplementation((guild) => {
            return role_info_list;
        });
        // expect
        const result = discord_common_1.DiscordCommon.get_game_master_from_guild(guild, [((_a = role_info_list[1]) === null || _a === void 0 ? void 0 : _a.name) || constants_1.Constants.STRING_EMPTY], other_role_count);
        expect(result.length).toEqual(2 + other_role_count);
        expect((_b = result[0]) === null || _b === void 0 ? void 0 : _b.game_id).toEqual((_c = role_info_list[2]) === null || _c === void 0 ? void 0 : _c.id);
        expect((_d = result[0]) === null || _d === void 0 ? void 0 : _d.game_name).toEqual((_e = role_info_list[2]) === null || _e === void 0 ? void 0 : _e.name);
        expect((_f = result[1]) === null || _f === void 0 ? void 0 : _f.game_id).toEqual((_g = role_info_list[0]) === null || _g === void 0 ? void 0 : _g.id);
        expect((_h = result[1]) === null || _h === void 0 ? void 0 : _h.game_name).toEqual((_j = role_info_list[0]) === null || _j === void 0 ? void 0 : _j.name);
        expect((_k = result[2]) === null || _k === void 0 ? void 0 : _k.game_id).toEqual("-1000");
        expect((_l = result[2]) === null || _l === void 0 ? void 0 : _l.game_name).toEqual(constants.DISCORD_FRIEND_CODE_OTHER_NAME_FORMAT.replace('%%DISCORD_FRIEND_CODE_OTHER_COUNT%%', "1"));
        expect((_m = result[3]) === null || _m === void 0 ? void 0 : _m.game_id).toEqual("-1001");
        expect((_o = result[3]) === null || _o === void 0 ? void 0 : _o.game_name).toEqual(constants.DISCORD_FRIEND_CODE_OTHER_NAME_FORMAT.replace('%%DISCORD_FRIEND_CODE_OTHER_COUNT%%', "2"));
        expect((_p = result[4]) === null || _p === void 0 ? void 0 : _p.game_id).toEqual("-1002");
        expect((_q = result[4]) === null || _q === void 0 ? void 0 : _q.game_name).toEqual(constants.DISCORD_FRIEND_CODE_OTHER_NAME_FORMAT.replace('%%DISCORD_FRIEND_CODE_OTHER_COUNT%%', "3"));
    });
    test.each([
        [undefined], [null]
    ])("test for get_game_master_from_guild error. (%s)", (v) => {
        // expect
        const result = discord_common_1.DiscordCommon.get_game_master_from_guild(v, [], 0);
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
        const set_custom_id = jest.fn((v) => { return new Discord.StringSelectMenuBuilder(); });
        const add_options = jest.fn(() => { });
        const set_placeholder = jest.fn((v) => { });
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "setCustomId").mockImplementation(set_custom_id);
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "addOptions").mockImplementation(add_options);
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "setPlaceholder").mockImplementation(set_placeholder);
        // custom mock
        const add_components = jest.fn(() => { return true; });
        jest.spyOn(Discord.ActionRowBuilder.prototype, "addComponents").mockImplementation(add_components);
        const result = discord_common_1.DiscordCommon.get_game_master_list_select_menu("test_custom_id", [], 25);
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
        const set_custom_id = jest.fn((v) => { return new Discord.StringSelectMenuBuilder(); });
        const add_options = jest.fn(() => { });
        const set_placeholder = jest.fn((v) => { return new Discord.StringSelectMenuBuilder(); });
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "setCustomId").mockImplementation(set_custom_id);
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "addOptions").mockImplementation(add_options);
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "setPlaceholder").mockImplementation(set_placeholder);
        // custom mock
        const add_components = jest.fn(() => { return true; });
        jest.spyOn(Discord.ActionRowBuilder.prototype, "addComponents").mockImplementation(add_components);
        const result = discord_common_1.DiscordCommon.get_game_master_list_select_menu("test_custom_id", [test_entity_1.TestEntity.get_test_game_master_info()], 25);
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
        const set_custom_id = jest.fn((v) => { return new Discord.StringSelectMenuBuilder(); });
        const add_options = jest.fn(() => { });
        const set_placeholder = jest.fn((v) => { return new Discord.StringSelectMenuBuilder(); });
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "setCustomId").mockImplementation(set_custom_id);
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "addOptions").mockImplementation(add_options);
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "setPlaceholder").mockImplementation(set_placeholder);
        // custom mock
        const add_components = jest.fn(() => { return true; });
        jest.spyOn(Discord.ActionRowBuilder.prototype, "addComponents").mockImplementation(add_components);
        // create argument
        const gm_list = [];
        const option_num = 23;
        const split_num = 5;
        for (let i = 0; i < option_num; i++) {
            const v = test_entity_1.TestEntity.get_test_game_master_info();
            v.game_id = `${v.game_id}-${i}`;
            v.game_name = `${v.game_name}-${i}`;
            gm_list.push(v);
        }
        const result = discord_common_1.DiscordCommon.get_game_master_list_select_menu("test_custom_id", gm_list, split_num);
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
        const set_custom_id = jest.fn((v) => { return new Discord.StringSelectMenuBuilder(); });
        const add_options = jest.fn(() => { });
        const set_placeholder = jest.fn((v) => { return new Discord.StringSelectMenuBuilder(); });
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "setCustomId").mockImplementation(set_custom_id);
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "addOptions").mockImplementation(add_options);
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "setPlaceholder").mockImplementation(set_placeholder);
        // custom mock
        const add_components = jest.fn(() => { return true; });
        jest.spyOn(Discord.ActionRowBuilder.prototype, "addComponents").mockImplementation(add_components);
        // create argument
        const gm_list = [];
        const option_num = 23;
        const split_num = 23;
        for (let i = 0; i < option_num; i++) {
            const v = test_entity_1.TestEntity.get_test_game_master_info();
            v.game_id = `${v.game_id}-${i}`;
            v.game_name = `${v.game_name}-${i}`;
            gm_list.push(v);
        }
        const result = discord_common_1.DiscordCommon.get_game_master_list_select_menu("test_custom_id", gm_list, split_num);
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
    ])("test for get_game_master_list_select_menu error. (%s)", (split_num) => {
        expect(() => { discord_common_1.DiscordCommon.get_game_master_list_select_menu("test_custom_id", [], split_num); }).toThrow("split length can't be under 1.");
    });
});
describe("get_role_list_select_menu", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test("test for get_role_list_select_menu blank.", () => {
        // create test data
        const guild = {
            roles: {
                cache: []
            }
        };
        // setup mock
        const set_custom_id = jest.fn((v) => { return new Discord.StringSelectMenuBuilder(); });
        const add_options = jest.fn(() => { });
        const set_placeholder = jest.fn((v) => { return new Discord.StringSelectMenuBuilder(); });
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "setCustomId").mockImplementation(set_custom_id);
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "addOptions").mockImplementation(add_options);
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "setPlaceholder").mockImplementation(set_placeholder);
        // custom mock
        const add_components = jest.fn(() => { return true; });
        jest.spyOn(Discord.ActionRowBuilder.prototype, "addComponents").mockImplementation(add_components);
        // execute
        discord_common_1.DiscordCommon.get_role_list_select_menu("test_custom_id", "test_placeholder", guild);
        // expect jest fn
        expect(set_custom_id.mock.calls[0]).toEqual(["test_custom_id"]);
        expect(add_options).toBeCalledTimes(0);
        expect(set_placeholder.mock.calls[0]).toEqual(["test_placeholder"]);
        // expect jest fn
        expect(add_components).toBeCalledTimes(1);
    });
    test("test for get_role_list_select_menu.", () => {
        // create test data
        const guild = {
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
        const set_custom_id = jest.fn((v) => { return new Discord.StringSelectMenuBuilder(); });
        const add_options = jest.fn(() => { });
        const set_placeholder = jest.fn((v) => { return new Discord.StringSelectMenuBuilder(); });
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "setCustomId").mockImplementation(set_custom_id);
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "addOptions").mockImplementation(add_options);
        jest.spyOn(Discord.StringSelectMenuBuilder.prototype, "setPlaceholder").mockImplementation(set_placeholder);
        // custom mock
        const add_components = jest.fn(() => { return true; });
        jest.spyOn(Discord.ActionRowBuilder.prototype, "addComponents").mockImplementation(add_components);
        // execute
        discord_common_1.DiscordCommon.get_role_list_select_menu("test_custom_id", "test_placeholder", guild);
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
    ])("test for get_limit_time_str. (%s -> %s)", (date, exp) => {
        expect(discord_common_1.DiscordCommon.get_limit_time_str(date)).toEqual(exp);
    });
});
describe("get_button", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test("test for get_button.", () => {
        test_discord_mock_1.TestDiscordMock.button_builder_mock();
        discord_common_1.DiscordCommon.get_button("test_custom_id", "test_label", 1);
    });
});
describe("get_text_input", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test("test for get_text_input.", () => {
        test_discord_mock_1.TestDiscordMock.text_input_builder_mock();
        discord_common_1.DiscordCommon.get_text_input("test_custom_id", "test_label", 1);
    });
});
//# sourceMappingURL=logic.discord_common.test.js.map