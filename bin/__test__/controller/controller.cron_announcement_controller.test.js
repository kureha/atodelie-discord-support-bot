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
const constants_1 = require("../../common/constants");
const cron_announcement_controller_1 = require("../../controller/cron_announcement_controller");
const activity_history_1 = require("../../db/activity_history");
const announcement_history_1 = require("../../db/announcement_history");
const server_info_1 = require("../../db/server_info");
const announcement_info_1 = require("../../entity/announcement_info");
const discord_common_1 = require("../../logic/discord_common");
const test_entity_1 = require("../common/test_entity");
const controller = new cron_announcement_controller_1.CronAnnouncementController();
function get_test_activity(date, member_count, total_member_count, g_name) {
    let v = test_entity_1.TestEntity.get_test_activity(date);
    v.member_count = member_count || 0;
    v.total_member_count = total_member_count || 0;
    v.game_name = g_name || '';
    return v;
}
describe('cron announcement test', () => {
    test.each([
        [
            [2, 3, 0, 5], [3, 4, 0, 6], ["a", "c", "", "b"], {
                current_game_member_count: 2,
                max_total_member_count: 4,
                g_name: "a",
                start_idx: 1,
            }
        ],
        [
            [2, 3, 0, 5], [5, 4, 0, 6], ["a", "c", "", "b"], {
                current_game_member_count: 2,
                max_total_member_count: 5,
                g_name: "a",
                start_idx: 1,
            }
        ],
        [
            [2, 3, 1, 5, 4, 3], [3, 4, 2, 6, 5, 4], ["a", "c", "", "b", "b", "d"], {
                current_game_member_count: 2,
                max_total_member_count: 6,
                g_name: "a",
                start_idx: 5,
            }
        ],
        [
            [0, 3, 0], [0, 4, 0], ["", "a", ""], {
                current_game_member_count: 0,
                max_total_member_count: 0,
                g_name: "",
                start_idx: -1,
            }
        ],
        [
            [], [], [], {
                current_game_member_count: 0,
                max_total_member_count: 0,
                g_name: "",
                start_idx: -1,
            }
        ],
    ])('test for extract_announcement, (%s, %s, %s) => %s', (current_game_member_count_list, max_total_member_count_list, g_name_list, expected) => {
        // create data
        let list = [];
        current_game_member_count_list.forEach((v, idx) => {
            let change_time = new Date('2099-02-03T12:34:56.789+09:00');
            change_time.setMinutes(change_time.getMinutes() + idx);
            list.push(get_test_activity(change_time, current_game_member_count_list[idx], max_total_member_count_list[idx], g_name_list[idx]));
        });
        // get result
        const result = controller.extract_announcement(list);
        // create assert object
        const expected_info = new announcement_info_1.AnnouncementInfo();
        // start time
        let game_start_time = new Date('2099-02-03T12:34:56.789+09:00');
        if (expected.start_idx >= 0) {
            game_start_time.setMinutes(game_start_time.getMinutes() + expected.start_idx);
        }
        else {
            game_start_time = constants_1.Constants.get_default_date();
        }
        // basic server info
        if (current_game_member_count_list.length > 0) {
            expected_info.server_id = "test-server-id";
            expected_info.channel_id = "test-channel-id";
        }
        // input variables set to expected info
        expected_info.current_game_member_count = expected.current_game_member_count;
        expected_info.max_total_member_count = expected.max_total_member_count;
        expected_info.game_name = expected.g_name;
        expected_info.game_start_time = game_start_time;
        // assert!
        expect(result).toStrictEqual(expected_info);
    });
    test.each([
        [new Date('2099-02-03T12:34:56.789+09:00'), new Date('2099-02-03T12:34:56.789+09:00'), false],
        [new Date('2099-02-03T12:34:56.788+09:00'), new Date('2099-02-03T12:34:56.789+09:00'), true],
        [new Date('2099-02-03T12:34:56.790+09:00'), new Date('2099-02-03T12:34:56.789+09:00'), false],
    ])('test for is_exec_announcement, (announce : %s vs activity start : %s -> is announce : %s)', (announcement_time, activity_start_time, expected) => {
        const his = test_entity_1.TestEntity.get_test_announcement_history(announcement_time);
        const history_list = [his];
        const info = test_entity_1.TestEntity.get_test_announcement_info(activity_start_time);
        // threshold 0
        let result = controller.is_exec_announcement(info, history_list, 0);
        expect(result).toEqual(expected);
        // threshold 1
        result = controller.is_exec_announcement(info, history_list, 1);
        expect(result).toEqual(expected);
        // threshold 2
        result = controller.is_exec_announcement(info, history_list, 2);
        expect(result).toEqual(false);
    });
    test('test for is_exec_announcement blank', () => {
        const info = test_entity_1.TestEntity.get_test_announcement_info(new Date('2099-02-03T12:34:56.789+09:00'));
        const result = controller.is_exec_announcement(info, [], 1);
        expect(result).toEqual(true);
    });
    test('test for is_exec_announcement undefined', () => {
        const info = test_entity_1.TestEntity.get_test_announcement_info(new Date('2099-02-03T12:34:56.789+09:00'));
        const result = controller.is_exec_announcement(info, [undefined], 1);
        expect(result).toEqual(true);
    });
    test('test for is_exec_announcement announce info\'s gamen name is blank', () => {
        const info = test_entity_1.TestEntity.get_test_announcement_info(new Date('2099-02-03T12:34:56.789+09:00'));
        info.game_name = '';
        const result = controller.is_exec_announcement(info, [undefined], 1);
        expect(result).toEqual(false);
    });
});
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
 * mockup for text channel
 * @returns
 */
function mock_get_text_channel() {
    return {
        send: (v) => {
            return new Promise((resolve) => { resolve(); });
        }
    };
}
/**
 * mockup create function for update_voice_channel_name
 */
function setup_update_voice_channel_name_mock(server_info_list) {
    jest.spyOn(cron_announcement_controller_1.CronAnnouncementController.prototype, 'execute_logic_for_guild').mockImplementation(() => {
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
describe('update_voice_channel_name', () => {
    beforeEach(() => {
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test('test for annoucement for blank', () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        setup_update_voice_channel_name_mock([]);
        const client_mock = get_guild_mock_update_voice_channel_name({});
        // expect assertions
        expect.assertions(1);
        // execute
        const result = yield controller.auto_annoucement(client_mock);
        expect(result).toBe(false);
    }));
    test('test for annoucement', () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        setup_update_voice_channel_name_mock([test_entity_1.TestEntity.get_test_server_info()]);
        const client_mock = get_guild_mock_update_voice_channel_name({});
        // expect assertions
        expect.assertions(1);
        // execute
        const result = yield controller.auto_annoucement(client_mock);
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
        jest.spyOn(discord_common_1.DiscordCommon, 'get_text_channel').mockImplementationOnce((c, id) => {
            return mock_get_text_channel();
        });
        jest.spyOn(activity_history_1.ActivityHistoryRepository.prototype, 'get_t_activity_history').mockImplementationOnce((g, c, l) => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_activity(new Date())]);
            });
        });
        jest.spyOn(announcement_history_1.AnnouncementHistoryRepository.prototype, 'get_t_announcement').mockImplementationOnce((g, c, l) => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_announcement_history(new Date())]);
            });
        });
        jest.spyOn(announcement_history_1.AnnouncementHistoryRepository.prototype, 'insert_t_announcement').mockImplementationOnce((v) => {
            return new Promise((resolve, reject) => {
                resolve(1);
            });
        });
        jest.spyOn(cron_announcement_controller_1.CronAnnouncementController.prototype, 'extract_announcement').mockImplementation((list) => {
            return test_entity_1.TestEntity.get_test_announcement_info(new Date());
        });
        jest.spyOn(cron_announcement_controller_1.CronAnnouncementController.prototype, 'is_exec_announcement').mockImplementation((v, list, n) => {
            return true;
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
        const result = yield controller.execute_logic_for_guild(mock_guild, 'test_ch_id', 'test_role');
        expect(result).toBe(true);
    }));
    test.each([
        [["test_game_id_1", "test_game_id_1", "test_game_id_2"], ["test_server_1"]],
    ])('execute_logic_for_guild for no need announce', (game_id_list, voice_channel_id_list) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(discord_common_1.DiscordCommon, 'get_voice_channel_id_list').mockImplementationOnce(() => {
            return voice_channel_id_list;
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_voice_channel').mockImplementationOnce(() => {
            return mock_get_voice_channel("test_channel_id", "test_channel_name");
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_text_channel').mockImplementationOnce((c, id) => {
            return mock_get_text_channel();
        });
        jest.spyOn(activity_history_1.ActivityHistoryRepository.prototype, 'get_t_activity_history').mockImplementationOnce((g, c, l) => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_activity(new Date())]);
            });
        });
        jest.spyOn(announcement_history_1.AnnouncementHistoryRepository.prototype, 'get_t_announcement').mockImplementationOnce((g, c, l) => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_announcement_history(new Date())]);
            });
        });
        jest.spyOn(announcement_history_1.AnnouncementHistoryRepository.prototype, 'insert_t_announcement').mockImplementationOnce((v) => {
            return new Promise((resolve, reject) => {
                resolve(1);
            });
        });
        jest.spyOn(cron_announcement_controller_1.CronAnnouncementController.prototype, 'extract_announcement').mockImplementation((list) => {
            return test_entity_1.TestEntity.get_test_announcement_info(new Date());
        });
        jest.spyOn(cron_announcement_controller_1.CronAnnouncementController.prototype, 'is_exec_announcement').mockImplementation((v, list, n) => {
            return false;
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
        const result = yield controller.execute_logic_for_guild(mock_guild, 'test_ch_id', 'test_role');
        expect(result).toBe(true);
    }));
    test.each([
        [["test_game_id_1", "test_game_id_1", "test_game_id_2"], ["test_server_1"]],
    ])('execute_logic_for_guild for history insert failed', (game_id_list, voice_channel_id_list) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(discord_common_1.DiscordCommon, 'get_voice_channel_id_list').mockImplementationOnce(() => {
            return voice_channel_id_list;
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_voice_channel').mockImplementationOnce(() => {
            return mock_get_voice_channel("test_channel_id", "test_channel_name");
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_text_channel').mockImplementationOnce((c, id) => {
            return mock_get_text_channel();
        });
        jest.spyOn(activity_history_1.ActivityHistoryRepository.prototype, 'get_t_activity_history').mockImplementationOnce((g, c, l) => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_activity(new Date())]);
            });
        });
        jest.spyOn(announcement_history_1.AnnouncementHistoryRepository.prototype, 'get_t_announcement').mockImplementationOnce((g, c, l) => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_announcement_history(new Date())]);
            });
        });
        jest.spyOn(announcement_history_1.AnnouncementHistoryRepository.prototype, 'insert_t_announcement').mockImplementationOnce((v) => {
            return new Promise((resolve, reject) => {
                resolve(0);
            });
        });
        jest.spyOn(cron_announcement_controller_1.CronAnnouncementController.prototype, 'extract_announcement').mockImplementation((list) => {
            return test_entity_1.TestEntity.get_test_announcement_info(new Date());
        });
        jest.spyOn(cron_announcement_controller_1.CronAnnouncementController.prototype, 'is_exec_announcement').mockImplementation((v, list, n) => {
            return true;
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
        const result = yield controller.execute_logic_for_guild(mock_guild, 'test_ch_id', 'test_role');
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
            yield controller.execute_logic_for_guild({}, 'test_ch_id', 'test_role');
        }
        catch (err) {
            expect(true).toBe(true);
        }
    }));
});
//# sourceMappingURL=controller.cron_announcement_controller.test.js.map