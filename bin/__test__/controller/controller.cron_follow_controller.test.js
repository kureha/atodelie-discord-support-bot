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
const test_discord_mock_1 = require("../common/test_discord_mock");
const cron_follow_controller_1 = require("../../controller/cron_follow_controller");
const recruitement_1 = require("../../db/recruitement");
const test_entity_1 = require("../common/test_entity");
const participate_1 = require("../../db/participate");
const server_info_1 = require("../../db/server_info");
const discord_common_1 = require("../../logic/discord_common");
const controller = new cron_follow_controller_1.CronFollowController();
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
describe('follow_recruitment_member', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [[test_entity_1.TestEntity.get_test_server_info(), test_entity_1.TestEntity.get_test_server_info()], [true, true], true],
        [[test_entity_1.TestEntity.get_test_server_info(), test_entity_1.TestEntity.get_test_server_info()], [false, true], false],
        [[], [], false],
    ])('test for follow_recruitment_member, (%s, %s) -> %s', (server_list, main_logic_result_list, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info_all')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return server_list; }));
        main_logic_result_list.forEach((v) => {
            jest.spyOn(cron_follow_controller_1.CronFollowController.prototype, 'execute_logic_for_guild')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return v; }));
        });
        const client_mock = get_guild_mock({});
        // execute
        const result = yield controller.follow_recruitment_member(client_mock);
        expect(result).toBe(expected);
    }));
    test.each([
        [[test_entity_1.TestEntity.get_test_server_info(), test_entity_1.TestEntity.get_test_server_info()], [true, true], false],
        [[test_entity_1.TestEntity.get_test_server_info(), test_entity_1.TestEntity.get_test_server_info()], [false, true], false],
        [[], [], false],
    ])('test for follow_recruitment_member for exception, (%s, %s) -> %s', (server_list, main_logic_result_list, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // setup mocks
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info_all')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { throw `exception!`; }));
        const client_mock = get_guild_mock({});
        // execute
        const result = yield controller.follow_recruitment_member(client_mock);
        expect(result).toBe(expected);
    }));
});
describe('execute_logic_for_guild', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [[], [], 0, true],
        [[test_entity_1.TestEntity.get_test_recruitment()], [test_entity_1.TestEntity.get_test_participate()], 0, true],
        [[test_entity_1.TestEntity.get_test_recruitment()], [test_entity_1.TestEntity.get_test_participate()], 1, true],
    ])("test for execute_logic_for_guild, (%s, %s, %s) -> %s", (rec_list, par_list, upd_cnt, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();
        // set special mock
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment_for_follow')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return rec_list; }));
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'get_t_participate')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return par_list; }));
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'update_m_server_info_follow_time')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return upd_cnt; }));
        jest.spyOn(discord_common_1.DiscordCommon, 'get_text_channel').mockImplementationOnce(() => {
            return {
                send: () => {
                    return new Promise((resolve, reject) => { resolve(true); });
                },
            };
        });
        // expect
        let result = yield controller.execute_logic_for_guild(client, test_entity_1.TestEntity.get_test_server_info(), new Date());
        expect(result).toEqual(expected);
    }));
    test.each([
        [[], [], 0, false],
        [[test_entity_1.TestEntity.get_test_recruitment()], [test_entity_1.TestEntity.get_test_participate()], 0, false],
        [[test_entity_1.TestEntity.get_test_recruitment()], [test_entity_1.TestEntity.get_test_participate()], 1, false],
    ])("test for execute_logic_for_guild for exception, (%s, %s, %s) -> %s", (rec_list, par_list, upd_cnt, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();
        // set special mock
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment_for_follow')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { throw `exception!`; }));
        // expect
        let result = yield controller.execute_logic_for_guild(client, test_entity_1.TestEntity.get_test_server_info(), new Date());
        expect(result).toEqual(expected);
    }));
});
//# sourceMappingURL=controller.cron_follow_controller.test.js.map