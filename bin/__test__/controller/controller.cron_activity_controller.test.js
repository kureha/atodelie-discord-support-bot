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
// import discord modules
const Discord = __importStar(require("discord.js"));
const server_info_1 = require("../../db/server_info");
const test_entity_1 = require("../common/test_entity");
const discord_common_1 = require("../../logic/discord_common");
const game_master_1 = require("../../db/game_master");
const activity_history_1 = require("../../db/activity_history");
const cron_activity_controller_1 = require("../../controller/cron_activity_controller");
const controller = new cron_activity_controller_1.CronActivityRecordController();
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
 * mockup for guild
 * @returns
 */
function get_guild_mock(ret) {
    return {
        guilds: {
            resolve: () => {
                return ret;
            },
        },
        members: {
            cache: [],
        }
    };
}
describe('activity_history_regist', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [[test_entity_1.TestEntity.get_test_server_info(), test_entity_1.TestEntity.get_test_server_info()], [true, true], true],
        [[test_entity_1.TestEntity.get_test_server_info(), test_entity_1.TestEntity.get_test_server_info()], [false, true], false],
        [[], [], false],
    ])('test for activity_history_regist, (%s, %s) -> %s', (server_list, main_logic_result_list, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info_all')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return server_list; }));
        main_logic_result_list.forEach((v) => {
            jest.spyOn(cron_activity_controller_1.CronActivityRecordController.prototype, 'execute_logic_for_guild')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return v; }));
        });
        const client_mock = get_guild_mock({});
        // execute
        const result = yield controller.activity_history_regist(client_mock);
        expect(result).toBe(expected);
    }));
    test('test for activity_history_regist for null', () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(cron_activity_controller_1.CronActivityRecordController.prototype, 'execute_logic_for_guild')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return true; }));
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info_all').mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () {
            return [test_entity_1.TestEntity.get_test_server_info()];
        }));
        const client_mock = get_guild_mock(null);
        // execute
        const result = yield controller.activity_history_regist(client_mock);
        expect(result).toBe(false);
    }));
    test('test for activity_history_regist for exception', () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(cron_activity_controller_1.CronActivityRecordController.prototype, 'execute_logic_for_guild')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { throw `exception!`; }));
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info_all').mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () {
            return [test_entity_1.TestEntity.get_test_server_info()];
        }));
        const client_mock = get_guild_mock({});
        // execute
        const result = yield controller.activity_history_regist(client_mock);
        expect(result).toBe(false);
    }));
});
describe('execute_logic_for_guild', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [["test1", "test2"], [true, true], true],
        [["test1", "test2"], [false, true], false],
        [[], [], true],
    ])('test for execute_logic_for_guild, (%s, %s) -> %s', (vc_id_list, main_logic_result_list, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(discord_common_1.DiscordCommon, 'get_voice_channel_id_list')
            .mockImplementationOnce(() => { return vc_id_list; });
        main_logic_result_list.forEach((v) => {
            jest.spyOn(cron_activity_controller_1.CronActivityRecordController.prototype, 'execute_logic_for_channel')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return v; }));
        });
        // execute
        const result = yield controller.execute_logic_for_guild({});
        expect(result).toBe(expected);
    }));
});
describe('regist_activity_history', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test-guild-id", "test-channel-id", "test-game-name", 1, 2],
        ["", "", "", 0, 0],
    ])('test for regist_activity_history, (%s, %s, %s, %s, %s) -> %s', (guild_id, channel_id, most_playing_game_name, most_playing_game_member_count, total_member_count) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(activity_history_1.ActivityHistoryRepository.prototype, 'insert_t_activity_history')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
        // execute
        const result = yield controller.regist_activity_history(guild_id, channel_id, most_playing_game_name, most_playing_game_member_count, total_member_count);
        expect(result.server_id).toEqual(guild_id);
        expect(result.channel_id).toEqual(channel_id);
        expect(result.game_name).toEqual(most_playing_game_name);
        expect(result.member_count).toEqual(most_playing_game_member_count);
        expect(result.total_member_count).toEqual(total_member_count);
        expect(result.delete).toEqual(false);
    }));
    test.each([
        ["test-guild-id", "test-channel-id", "test-game-name", 1, 2],
    ])('test for regist_activity_history for exception, (%s, %s, %s, %s, %s) -> %s', (guild_id, channel_id, most_playing_game_name, most_playing_game_member_count, total_member_count) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(activity_history_1.ActivityHistoryRepository.prototype, 'insert_t_activity_history')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 0; }));
        // execute
        expect(() => __awaiter(void 0, void 0, void 0, function* () {
            yield controller.regist_activity_history(guild_id, channel_id, most_playing_game_name, most_playing_game_member_count, total_member_count);
        })).rejects.toThrowError(`activity history regist failed.`);
    }));
});
describe('delete_activity_history', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test-guild-id", 1, 2],
        ["test-guild-id", 1, 0],
    ])('test for delete_activity_history, (%s, %s) -> %s', (guild_id, month_limit, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(activity_history_1.ActivityHistoryRepository.prototype, 'delete_t_activity_history')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return expected; }));
        // execute
        const result = yield controller.delete_activity_history(guild_id, month_limit);
        expect(result).toEqual(expected);
    }));
});
describe('execute_logic_for_channel', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ['test-game', 1, 3, test_entity_1.TestEntity.get_test_activity(new Date()), 1, true],
    ])('test for execute_logic_for_channel, (%s, %s, %s, %s, %s) -> %s', (most_play_game_name, player_count, total_member_count, regist_result, delete_count, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(cron_activity_controller_1.CronActivityRecordController.prototype, 'get_playing_game_list')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return []; }));
        jest.spyOn(cron_activity_controller_1.CronActivityRecordController.prototype, 'get_most_playing_game_name')
            .mockImplementationOnce(() => { return most_play_game_name; });
        jest.spyOn(cron_activity_controller_1.CronActivityRecordController.prototype, 'get_game_player_count')
            .mockImplementationOnce(() => { return player_count; });
        jest.spyOn(cron_activity_controller_1.CronActivityRecordController.prototype, 'get_channel_joined_member_count')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return total_member_count; }));
        jest.spyOn(cron_activity_controller_1.CronActivityRecordController.prototype, 'regist_activity_history')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return regist_result; }));
        jest.spyOn(cron_activity_controller_1.CronActivityRecordController.prototype, 'delete_activity_history')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return delete_count; }));
        const guild = get_guild_mock({});
        // execute
        const result = yield controller.execute_logic_for_channel(guild, "test-channel-id");
        expect(result).toBe(expected);
    }));
    test.each([
        ['test-game', 1, 3, test_entity_1.TestEntity.get_test_activity(new Date()), 1, false],
    ])('test for execute_logic_for_channel in exception, (%s, %s, %s, %s, %s) -> %s', (most_play_game_name, player_count, total_member_count, regist_result, delete_count, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(cron_activity_controller_1.CronActivityRecordController.prototype, 'get_playing_game_list')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { throw `exception!`; }));
        const guild = get_guild_mock({});
        // execute
        const result = yield controller.execute_logic_for_channel(guild, "test-channel-id");
        expect(result).toBe(expected);
    }));
});
describe('get_most_playeing_game_name', () => {
    test.each([
        [['c', 'b', 'a', 'b', 'a', 'a'], 'a'],
        [['c', 'b', 'a', 'b', 'a'], 'a'],
        [[], ''],
    ])("test for get_most_playeing_game_name, (%s => %s)", (input, expected) => {
        expect(controller.get_most_playing_game_name(input)).toEqual(expected);
    });
});
describe('get_game_player_count', () => {
    test.each([
        ['a', ['c', 'b', 'a', 'b', 'a', 'a'], 3],
        ['b', ['c', 'b', 'a', 'b', 'a'], 2],
        ['d', ['c', 'b', 'a', 'b', 'a'], 0],
        ['a', [], 0],
    ])("test for get_game_player_count, (%s, %s => %s)", (target_game_name, input, expected) => {
        expect(controller.get_game_player_count(target_game_name, input)).toEqual(expected);
    });
});
describe('get_channel_joined_member_count', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ['test-ch', [], 0],
        ['test-ch', ['test-ch', 'test-ch-a', 'test-ch', 'test-ch', null], 3],
        ['test-ch-a', ['test-ch', 'test-ch-a', 'test-ch', 'test-ch', null], 1],
    ])('test for get_channel_joined_member_count, (%s, %s) -> %s', (target_channel_id, test_channel_id_list, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mock
        const mock_member_list = new Map();
        test_channel_id_list.forEach((v, idx) => {
            const id = `test-id-${idx}`;
            mock_member_list.set(id, get_test_member(id, v));
        });
        // execute
        const result = yield controller.get_channel_joined_member_count(target_channel_id, mock_member_list);
        expect(result).toEqual(expected);
    }));
});
describe('get_playing_game_list', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ['test-ch', [], [], []],
        ['test-ch',
            ['test-ch', 'test-ch-a', 'test-ch', 'test-ch', 'test-ch'],
            ['a', 'a', 'b', 'c', 'a'],
            ['a', 'a', 'b', 'c']],
        ['test-ch-b',
            ['test-ch', 'test-ch-a', 'test-ch', 'test-ch', 'test-ch'],
            ['a', 'a', 'b', 'c', 'a'],
            []],
    ])('test for get_playing_game_list, (%s, %s, %s) -> %s', (target_channel_id, test_channel_id_list, playing_activity_list, expected_activity_list) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mock
        const mock_member_list = new Map();
        test_channel_id_list.forEach((v, idx) => {
            const id = `test-id-${idx}`;
            mock_member_list.set(id, get_test_member(id, v));
        });
        playing_activity_list.forEach((v) => {
            jest.spyOn(cron_activity_controller_1.CronActivityRecordController.prototype, 'get_playing_game_name')
                .mockImplementationOnce(() => { return v; });
        });
        // main logic called
        const result = yield controller.get_playing_game_list(target_channel_id, mock_member_list);
        expect(result.sort()).toStrictEqual(expected_activity_list);
    }));
});
describe('get_playing_game_name', () => {
    test.each([
        ["test_presence_01", Discord.ActivityType.Playing, "test_presence_01"],
        ["test_presence_01", Discord.ActivityType.Streaming, "test_presence_01"],
        ["", Discord.ActivityType.Playing, ""],
        ["test_presence_01", Discord.ActivityType.Custom, ""],
    ])('test for get_playing_game_name (%s, %s -> %s)', (name, type, exp) => {
        const presence_mock = {
            activities: [
                get_activity(type, name)
            ],
        };
        expect(controller.get_playing_game_name(presence_mock)).toBe(exp);
    });
    test.each([
        ["test_presence_01", Discord.ActivityType.Playing, [], "test_presence_01"],
        ["test_presence_01", Discord.ActivityType.Playing, ["another_precense"], "test_presence_01"],
        ["test_presence_01", Discord.ActivityType.Playing, ["test_presence_01"], ""],
    ])('test for get_playing_game_name with ignore list (%s, %s -> %s)', (name, type, ignore_list, exp) => {
        const presence_mock = {
            activities: [
                get_activity(type, name)
            ],
        };
        expect(controller.get_playing_game_name(presence_mock, ignore_list)).toBe(exp);
    });
    test('test for get_playing_game_name for blank', () => {
        const presence_mock = {
            activities: [],
        };
        expect(controller.get_playing_game_name(presence_mock)).toBe('');
    });
    test('test for get_playing_game_name for null', () => {
        expect(controller.get_playing_game_name(null)).toBe('');
    });
});
describe('get_game_master_alias_name', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ['testing_precense_name', 'test_getted_game_name', 'test_getted_game_name'],
        ['testing_precense_name', '', 'testing_precense_name'],
        ['', '', ''],
    ])('test for get_game_master_alias_name (%s, %s -> %s)', (presence_name, game_name, expected) => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'get_m_game_master_by_presence_name').mockImplementationOnce((server_id, presence_name) => {
            return new Promise((resolve, reject) => {
                const game_master = test_entity_1.TestEntity.get_test_game_master_info();
                game_master.game_name = game_name;
                game_master.presence_name = presence_name;
                resolve([game_master]);
            });
        });
        const server_id = "server_id";
        const result = yield controller.get_game_master_alias_name(server_id, presence_name);
        expect(result).toBe(expected);
    }));
    test.each([
        ['testing_precense_name', '', 'testing_precense_name'],
    ])('test for get_game_master_alias_name select blank (%s, %s -> %s)', (presence_name, game_name, expected) => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'get_m_game_master_by_presence_name').mockImplementationOnce((server_id, presence_name) => {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        });
        const server_id = "server_id";
        const result = yield controller.get_game_master_alias_name(server_id, presence_name);
        expect(result).toBe(expected);
    }));
});
//# sourceMappingURL=controller.cron_activity_controller.test.js.map