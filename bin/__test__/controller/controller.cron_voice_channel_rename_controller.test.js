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
describe('update_voice_channel_name', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [[test_entity_1.TestEntity.get_test_server_info(), test_entity_1.TestEntity.get_test_server_info()], [true, true], true],
        [[test_entity_1.TestEntity.get_test_server_info(), test_entity_1.TestEntity.get_test_server_info()], [false, true], false],
        [[], [], false],
    ])('test for update_voice_channel_name, (%s, %s) -> %s', (server_list, main_logic_result_list, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info_all')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return server_list; }));
        main_logic_result_list.forEach((v) => {
            jest.spyOn(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.prototype, 'execute_logic_for_guild')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return v; }));
        });
        const client_mock = get_guild_mock({});
        // execute
        const result = yield controller.update_voice_channel_name(client_mock);
        expect(result).toBe(expected);
    }));
    test('test for update_voice_channel_name for null', () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.prototype, 'execute_logic_for_guild')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return true; }));
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info_all').mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () {
            return [test_entity_1.TestEntity.get_test_server_info()];
        }));
        const client_mock = get_guild_mock(null);
        // execute
        const result = yield controller.update_voice_channel_name(client_mock);
        expect(result).toBe(false);
    }));
    test('test for update_voice_channel_name for exception', () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.prototype, 'execute_logic_for_guild')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { throw `exception!`; }));
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info_all').mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () {
            return [test_entity_1.TestEntity.get_test_server_info()];
        }));
        const client_mock = get_guild_mock({});
        // execute
        const result = yield controller.update_voice_channel_name(client_mock);
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
            jest.spyOn(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.prototype, 'execute_logic_for_channel')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return v; }));
        });
        // execute
        const result = yield controller.execute_logic_for_guild({});
        expect(result).toBe(expected);
    }));
});
describe('execute_logic_for_channel', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [[test_entity_1.TestEntity.get_test_activity(new Date)], 'ailas-name', 'b-name', 'a-name', true],
        [[test_entity_1.TestEntity.get_test_activity(new Date)], 'ailas-name', 'a-name', 'a-name', true],
        [[test_entity_1.TestEntity.get_test_activity(new Date)], '', 'a-name', 'a-name', true],
        [[], '', 'a-name', 'a-name', false],
        [[undefined], '', 'a-name', 'a-name', false],
    ])('test for execute_logic_for_channel, (%s, %s, %s, %s) -> %s', (act_his_list, alias_name, before_ch_name, after_ch_name, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(activity_history_1.ActivityHistoryRepository.prototype, 'get_t_activity_history')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return act_his_list; }));
        jest.spyOn(discord_common_1.DiscordCommon, 'get_voice_channel')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return { name: before_ch_name, setName: (v) => { } }; }));
        jest.spyOn(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.prototype, 'get_game_master_alias_name')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return alias_name; }));
        jest.spyOn(cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.prototype, 'get_update_channel_name')
            .mockImplementationOnce(() => { return after_ch_name; });
        const mock_guild = { id: "test_id" };
        // execute
        const result = yield controller.execute_logic_for_channel(mock_guild, 'test-ch-id');
        expect(result).toBe(expected);
    }));
    test.each([
        [[test_entity_1.TestEntity.get_test_activity(new Date)], 'ailas-name', 'b-name', 'a-name', false],
        [[test_entity_1.TestEntity.get_test_activity(new Date)], 'ailas-name', 'a-name', 'a-name', false],
    ])('test for execute_logic_for_channel for exception, (%s, %s, %s, %s) -> %s', (act_his_list, alias_name, before_ch_name, after_ch_name, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(activity_history_1.ActivityHistoryRepository.prototype, 'get_t_activity_history')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { throw `exception!`; }));
        const mock_guild = { id: "test_id" };
        // execute
        const result = yield controller.execute_logic_for_channel(mock_guild, 'test-ch-id');
        expect(result).toBe(expected);
    }));
});
describe("update_channel_name", () => {
    test.each([
        ["aaa", "[bbb] テストチャンネル", '[%%GAME_NAME%%] %%CHANNEL_NAME%%', /^\[[^\]]+\] /, "[aaa] テストチャンネル"],
        ["更新ゲーム", "[テストゲーム] テストチャンネル", '[%%GAME_NAME%%] %%CHANNEL_NAME%%', /^\[[^\]]+\] /, "[更新ゲーム] テストチャンネル"],
        ["", "[bbb] テストチャンネル", '[%%GAME_NAME%%] %%CHANNEL_NAME%%', /^\[[^\]]+\] /, "テストチャンネル"],
    ])("test for update_channel_name (%s, %s, %s, %s => %s)", (game_name, now_channel_name, prefix_format, prefix_regexp, expected) => {
        expect(controller.get_update_channel_name(game_name, now_channel_name, prefix_format, prefix_regexp)).toEqual(expected);
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
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'get_m_game_master_by_presence_name')
            .mockImplementationOnce((server_id, presence_name) => __awaiter(void 0, void 0, void 0, function* () {
            const game_master = test_entity_1.TestEntity.get_test_game_master_info();
            game_master.game_name = game_name;
            game_master.presence_name = presence_name;
            return [game_master];
        }));
        const server_id = "server_id";
        const result = yield controller.get_game_master_alias_name(server_id, presence_name);
        expect(result).toBe(expected);
    }));
    test.each([
        ['testing_precense_name', '', 'testing_precense_name'],
    ])('test for get_game_master_alias_name select blank (%s, %s -> %s)', (presence_name, game_name, expected) => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'get_m_game_master_by_presence_name')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return []; }));
        const server_id = "server_id";
        const result = yield controller.get_game_master_alias_name(server_id, presence_name);
        expect(result).toBe(expected);
    }));
});
//# sourceMappingURL=controller.cron_voice_channel_rename_controller.test.js.map