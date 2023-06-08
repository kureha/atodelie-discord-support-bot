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
describe('cron follow test.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [[], false],
        [[test_entity_1.TestEntity.get_test_server_info()], true],
        [[test_entity_1.TestEntity.get_test_server_info(), test_entity_1.TestEntity.get_test_server_info()], true],
    ])("cron follow test. (%s)", (server_info_list, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();
        // set special mock
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info_all').mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(server_info_list);
            });
        });
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment_for_follow').mockImplementationOnce((server_id, from_datetime, to_datetime) => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_recruitment()]);
            });
        });
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'get_t_participate').mockImplementationOnce((token) => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_participate()]);
            });
        });
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'update_m_server_info_follow_time').mockImplementationOnce((server_id, follow_time) => {
            return new Promise((resolve, reject) => {
                resolve(1);
            });
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_text_channel').mockImplementationOnce((client, channel_id) => {
            return {
                send: () => {
                    return new Promise((resolve, reject) => { resolve(true); });
                },
            };
        });
        let result = yield controller.follow_recruitment_member(client);
        expect(result).toEqual(expected);
    }));
});
//# sourceMappingURL=controller.cron_follow_controller.test.js.map