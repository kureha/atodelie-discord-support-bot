"use strict";
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
const server_info_1 = require("../../db/server_info");
const test_entity_1 = require("../common/test_entity");
const discord_common_1 = require("../../logic/discord_common");
const game_master_1 = require("../../db/game_master");
const activity_history_1 = require("../../db/activity_history");
const controller = new cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController();
/**
 * mockup create function for update_voice_channel_name
 */
function setup_update_voice_channel_name_mock(server_info_list) {
    jest.spyOn(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.prototype, 'execute_logic_for_guild').mockImplementation(() => {
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
        expect(controller.get_update_channel_name(game_name, now_channel_name, prefix_format, prefix_regexp)).toEqual(expected);
    });
});
describe('update_voice_channel_name', () => {
    beforeEach(() => {
        jest.spyOn(activity_history_1.ActivityHistoryRepository.prototype, 'insert_t_activity_history').mockImplementationOnce((v) => {
            return new Promise((resolve) => {
                resolve(1);
            });
        });
    });
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
        const result = yield controller.update_voice_channel_name(client_mock);
        expect(result).toBe(false);
    }));
    test('test for update_voice_channel_name', () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        setup_update_voice_channel_name_mock([test_entity_1.TestEntity.get_test_server_info()]);
        const client_mock = get_guild_mock_update_voice_channel_name({});
        // expect assertions
        expect.assertions(1);
        // execute
        const result = yield controller.update_voice_channel_name(client_mock);
        expect(result).toBe(true);
    }));
    test('test for update_voice_channel_name for null', () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        setup_update_voice_channel_name_mock([test_entity_1.TestEntity.get_test_server_info()]);
        const client_mock = get_guild_mock_update_voice_channel_name(null);
        // expect assertions
        expect.assertions(1);
        // execute
        const result = yield controller.update_voice_channel_name(client_mock);
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
        jest.spyOn(activity_history_1.ActivityHistoryRepository.prototype, 'get_t_activity_history').mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_activity(new Date('1970-01-01T00:00:00.000+09:00'))]);
            });
        });
        jest.spyOn(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.prototype, 'get_game_master_alias_name').mockImplementation((v, p) => {
            return new Promise((resolve, reject) => {
                resolve('most-playing-game');
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
        const result = yield controller.execute_logic_for_guild(mock_guild);
        expect(result).toBe(true);
    }));
    test.each([
        [["test_game_id_1", "test_game_id_1", "test_game_id_2"], ["test_server_1"]],
    ])('execute_logic_for_guild for not update', (game_id_list, voice_channel_id_list) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(discord_common_1.DiscordCommon, 'get_voice_channel_id_list').mockImplementationOnce(() => {
            return voice_channel_id_list;
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_voice_channel').mockImplementationOnce(() => {
            return mock_get_voice_channel("test_channel_id", "test_channel_name");
        });
        jest.spyOn(activity_history_1.ActivityHistoryRepository.prototype, 'get_t_activity_history').mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_activity(new Date('1970-01-01T00:00:00.000+09:00'))]);
            });
        });
        jest.spyOn(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.prototype, 'get_game_master_alias_name').mockImplementation((v, p) => {
            return new Promise((resolve, reject) => {
                resolve('');
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
        const result = yield controller.execute_logic_for_guild(mock_guild);
        expect(result).toBe(true);
    }));
    test.each([
        [["test_game_id_1", "test_game_id_1", "test_game_id_2"], ["test_server_1"]],
    ])('execute_logic_for_guild for undefined activity', (game_id_list, voice_channel_id_list) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(discord_common_1.DiscordCommon, 'get_voice_channel_id_list').mockImplementationOnce(() => {
            return voice_channel_id_list;
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_voice_channel').mockImplementationOnce(() => {
            return mock_get_voice_channel("test_channel_id", "test_channel_name");
        });
        jest.spyOn(activity_history_1.ActivityHistoryRepository.prototype, 'get_t_activity_history').mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve([undefined]);
            });
        });
        jest.spyOn(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.prototype, 'get_game_master_alias_name').mockImplementation((v, p) => {
            return new Promise((resolve, reject) => {
                resolve('most-playing-game');
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
        const result = yield controller.execute_logic_for_guild(mock_guild);
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
        jest.spyOn(activity_history_1.ActivityHistoryRepository.prototype, 'get_t_activity_history').mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_activity(new Date('1970-01-01T00:00:00.000+09:00'))]);
            });
        });
        jest.spyOn(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.prototype, 'get_game_master_alias_name').mockImplementation((v, p) => {
            return new Promise((resolve, reject) => {
                resolve('most-playing-game');
            });
        });
        // invalid guild - for execption
        const mock_guild = {
            id: "test_id",
        };
        // expect assertions
        expect.assertions(1);
        // execute
        const result = yield controller.execute_logic_for_guild(mock_guild);
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
            yield controller.execute_logic_for_guild({});
        }
        catch (err) {
            expect(true).toBe(true);
        }
    }));
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
//# sourceMappingURL=controller.cron_voice_channel_rename_controller.test.js.map