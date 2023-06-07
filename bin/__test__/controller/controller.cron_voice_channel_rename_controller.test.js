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
const cron_voice_channel_rename_controller_1 = require("../../controller/cron_voice_channel_rename_controller");
// import discord modules
const Discord = __importStar(require("discord.js"));
const server_info_1 = require("../../db/server_info");
const test_entity_1 = require("../common/test_entity");
const discord_common_1 = require("../../logic/discord_common");
/**
 * mockup test function
 * @param user_id
 * @param channel_id
 * @returns
 */
function get_test_member(user_id, channel_id) {
    return {
        id: user_id,
        voice: {
            channel: {
                id: channel_id,
            },
        },
    };
}
/**
 * mockup test function
 * @param input_type
 * @param input_name
 * @returns
 */
function get_activity(input_type, input_name) {
    return {
        type: input_type,
        name: input_name
    };
}
/**
 * mockup create function for update_voice_channel_name
 */
function setup_update_voice_channel_name_mock(server_info_list) {
    jest.spyOn(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController, 'execute_logic_for_guild').mockImplementation(() => {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    });
    jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info_all').mockImplementation(() => {
        return new Promise((resolve, reject) => {
            resolve(server_info_list);
        });
    });
}
/**
 * mockup for voice channel
 * @param id
 * @param name
 * @returns
 */
function mock_get_voice_channel(id, name) {
    return {
        id: id,
        name: name,
        setName: (v) => { },
    };
}
/**
 * mockup for guid
 * @returns
 */
function get_guild_mock_update_voice_channel_name(ret) {
    return {
        guilds: {
            resolve: () => {
                return ret;
            },
        },
    };
}
describe("update_channel_name", () => {
    test.each([
        ["aaa", "[bbb] テストチャンネル", '[%%GAME_NAME%%] %%CHANNEL_NAME%%', /^\[[^\]]+\] /, "[aaa] テストチャンネル"],
        ["更新ゲーム", "[テストゲーム] テストチャンネル", '[%%GAME_NAME%%] %%CHANNEL_NAME%%', /^\[[^\]]+\] /, "[更新ゲーム] テストチャンネル"],
        ["", "[bbb] テストチャンネル", '[%%GAME_NAME%%] %%CHANNEL_NAME%%', /^\[[^\]]+\] /, "テストチャンネル"],
    ])("test for update_channel_name (%s, %s, %s, %s => %s)", (game_name, now_channel_name, prefix_format, prefix_regexp, expected) => {
        expect(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.get_update_channel_name(game_name, now_channel_name, prefix_format, prefix_regexp)).toEqual(expected);
    });
});
describe('get_most_played_sort_game_list', () => {
    test.each([
        [[], []],
        [['ccc', 'bbb', 'aaa', 'bbb', 'aaa', 'aaa'], ['aaa', 'bbb', 'ccc']],
        [['aaa', 'aaa'], ['aaa']],
        [['', 'bbb', 'aaa', 'bbb', 'aaa', 'aaa'], ['aaa', 'bbb', '']],
        [['bbb', 'aaa', 'bbb', 'aaa'], ['aaa', 'bbb']],
    ])("get_most_played_sort_game_list test (%s => %s)", (input, expected) => {
        expect(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.get_sorted_game_list(input)).toEqual(expected);
    });
});
describe('get_playing_game_list', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test('test for get_playing_game_list.', () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mock
        const mock_member_list = new Map();
        let channel_id = 'test_channel_id_1';
        // data 1
        let id = 'test_user_id_1';
        mock_member_list.set(id, get_test_member(id, channel_id));
        // data 2
        id = 'test_user_id_2';
        mock_member_list.set(id, get_test_member(id, channel_id + "_another"));
        // data 3
        id = 'test_user_id_3';
        mock_member_list.set(id, get_test_member(id, channel_id));
        // data 4
        id = 'test_user_id_4';
        mock_member_list.set(id, get_test_member(id, channel_id));
        // data 5
        id = 'test_user_id_5';
        mock_member_list.set(id, get_test_member(id, null));
        // mockup presence (presence is called for valid channel)
        jest.spyOn(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController, 'get_playing_game_name')
            .mockImplementationOnce(() => { return "test_game_001"; })
            .mockImplementationOnce(() => { return "test_game_002"; })
            .mockImplementationOnce(() => { return "test_game_001"; })
            .mockImplementationOnce(() => { return "test_game_003"; }); // 3 is not include for result
        // main logic called
        const result = yield cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.get_playing_game_list(channel_id, mock_member_list);
        expect(result.sort()).toStrictEqual(["test_game_001", "test_game_001", "test_game_002"]);
    }));
    test('test for get_playing_game_list blank.', () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mock
        const mock_member_list = new Map();
        let channel_id = 'test_channel_id_1';
        // main logic called
        const result = yield cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.get_playing_game_list(channel_id, mock_member_list);
        expect(result.sort()).toStrictEqual([]);
    }));
});
describe('get_playing_game_name', () => {
    test.each([
        ["test_presence_01", Discord.ActivityType.Playing, "test_presence_01"],
        ["", Discord.ActivityType.Playing, ""],
        ["test_presence_01", Discord.ActivityType.Custom, ""],
    ])('test for get_playing_game_name (%s, %s -> %s)', (name, type, exp) => {
        const presence_mock = {
            activities: [
                get_activity(type, name)
            ],
        };
        expect(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.get_playing_game_name(presence_mock)).toBe(exp);
    });
    test('test for get_playing_game_name for blank', () => {
        const presence_mock = {
            activities: [],
        };
        expect(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.get_playing_game_name(presence_mock)).toBe('');
    });
    test('test for get_playing_game_name for null', () => {
        expect(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.get_playing_game_name(null)).toBe('');
    });
});
describe('update_voice_channel_name', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test('test for update_voice_channel_name for blank', () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        setup_update_voice_channel_name_mock([]);
        const client_mock = get_guild_mock_update_voice_channel_name({});
        // expect assertions
        expect.assertions(1);
        // execute
        const result = yield cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.update_voice_channel_name(client_mock);
        expect(result).toBe(false);
    }));
    test('test for update_voice_channel_name', () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        setup_update_voice_channel_name_mock([test_entity_1.TestEntity.get_test_server_info()]);
        const client_mock = get_guild_mock_update_voice_channel_name({});
        // expect assertions
        expect.assertions(1);
        // execute
        const result = yield cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.update_voice_channel_name(client_mock);
        expect(result).toBe(true);
    }));
    test('test for update_voice_channel_name for null', () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        setup_update_voice_channel_name_mock([test_entity_1.TestEntity.get_test_server_info()]);
        const client_mock = get_guild_mock_update_voice_channel_name(null);
        // expect assertions
        expect.assertions(1);
        // execute
        const result = yield cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.update_voice_channel_name(client_mock);
        expect(result).toBe(true);
    }));
});
describe('execute_logic_for_guild', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [["test_game_id_1", "test_game_id_1", "test_game_id_2"], ["test_server_1"]],
    ])('execute_logic_for_guild', (game_id_list, voice_channel_id_list) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(discord_common_1.DiscordCommon, 'get_voice_channel_id_list').mockImplementationOnce(() => {
            return voice_channel_id_list;
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_voice_channel').mockImplementationOnce(() => {
            return mock_get_voice_channel("test_channel_id", "test_channel_name");
        });
        jest.spyOn(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController, 'get_playing_game_list').mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(game_id_list);
            });
        });
        const mock_guild = {
            id: "test_id",
            members: {
                cache: [],
            },
        };
        // expect assertions
        expect.assertions(1);
        // execute
        const result = yield cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.execute_logic_for_guild(mock_guild);
        expect(result).toBe(true);
    }));
    test.each([
        [["test_game_id_1", "test_game_id_1", "test_game_id_2"], ["test_server_1"]],
    ])('execute_logic_for_guild for execption', (game_id_list, voice_channel_id_list) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(discord_common_1.DiscordCommon, 'get_voice_channel_id_list').mockImplementationOnce(() => {
            return voice_channel_id_list;
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_voice_channel').mockImplementationOnce(() => {
            return mock_get_voice_channel("test_channel_id", "test_channel_name");
        });
        jest.spyOn(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController, 'get_playing_game_list').mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(game_id_list);
            });
        });
        // invalid guild - for execption
        const mock_guild = {
            id: "test_id",
        };
        // expect assertions
        expect.assertions(1);
        // execute
        const result = yield cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.execute_logic_for_guild(mock_guild);
        expect(result).toBe(true);
    }));
    test.each([
        [["test_game_id_1", "test_game_id_1", "test_game_id_2"], ["test_server_1"]],
    ])('execute_logic_for_guild for exception', (game_id_list, voice_channel_id_list) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(discord_common_1.DiscordCommon, 'get_voice_channel_id_list').mockImplementationOnce(() => {
            return null;
        });
        // expect assertions
        expect.assertions(1);
        // execute
        try {
            yield cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.execute_logic_for_guild({});
        }
        catch (err) {
            expect(true).toBe(true);
        }
    }));
});
//# sourceMappingURL=controller.cron_voice_channel_rename_controller.test.js.map