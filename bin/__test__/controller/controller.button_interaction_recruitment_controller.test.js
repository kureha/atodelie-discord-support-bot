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
const button_interaction_recruitment_controller_1 = require("../../controller/button_interaction_recruitment_controller");
// setup for mock
const test_discord_mock_1 = require("../common/test_discord_mock");
const recruitement_1 = require("../../db/recruitement");
const participate_1 = require("../../db/participate");
const constants_1 = require("../../common/constants");
const constants = new constants_1.Constants;
const test_entity_1 = require("../common/test_entity");
const server_info_1 = require("../../db/server_info");
const controller = new button_interaction_recruitment_controller_1.ButtonInteractionRecruitmentController();
describe('button interaction recruitment controllertest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["error_custom_id", "test_server_id", "test_user_id", "button interaction recruitment error."],
        ["join-recruite-token=test_token", undefined, "test_user_id", "interaction's guild id is undefined."],
        ["join-recruite-token=test_token_not_found", "test_server_id", "test_user_id", "target m_recruitment is not found."],
    ])('recruitment interaction error test. ((%s, %s, %s) -> %s)', (custom_id, guild_id, user_id, error_message) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.button_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // setup mocks
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment').mockImplementationOnce(() => {
            throw new Error(`target m_recruitment is not found. token = 12345`);
        });
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info').mockImplementationOnce(() => {
            return new Promise((resolve) => {
                resolve(test_entity_1.TestEntity.get_test_server_info());
            });
        });
        // expect
        const result = yield controller.recruitment_interaction(interaction);
        expect(result).toEqual(false);
    }));
    test.each([
        ["join-recruite-token=test_token", "test_server_id", "test_user_id", constants.STATUS_ENABLED],
        ["view-recruite-token=test_token", "test_server_id", "test_user_id", constants.STATUS_VIEW],
    ])('button interaction recruitment insert test. ((%s, %s, %s) -> participate status = %s)', (customId, guildId, userId, expected_status) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.button_interaction_mock(customId, guildId, userId);
        const interaction = new Mock();
        // setup test entityes
        const test_rec = test_entity_1.TestEntity.get_test_recruitment();
        const test_par_another = test_entity_1.TestEntity.get_test_participate();
        test_par_another.user_id = "test_user_id_another";
        // setup mocks
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment').mockImplementationOnce(() => {
            return new Promise((resolve) => {
                resolve(test_rec);
            });
        });
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'insert_t_participate').mockImplementationOnce(() => {
            return new Promise((resolve) => {
                resolve(1);
            });
        });
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'update_t_participate').mockImplementationOnce(() => {
            return new Promise((resolve) => {
                resolve(1);
            });
        });
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info').mockImplementationOnce(() => {
            return new Promise((resolve) => {
                resolve(test_entity_1.TestEntity.get_test_server_info());
            });
        });
        // update recruitment
        let result = yield controller.recruitment_interaction(interaction);
        expect(result).toEqual(true);
    }));
    test.each([
        ["join-recruite-token=test_token", "test_server_id", "test_user_id", constants.STATUS_ENABLED],
        ["view-recruite-token=test_token", "test_server_id", "test_user_id", constants.STATUS_VIEW],
    ])('button interaction recruitment update test. ((%s, %s, %s) -> participate status = %s)', (custom_id, guild_id, user_id, expected_status) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.button_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // setup test entityes
        const test_rec = test_entity_1.TestEntity.get_test_recruitment();
        // setup mocks
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment').mockImplementationOnce(() => {
            return new Promise((resolve) => {
                resolve(test_rec);
            });
        });
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'insert_t_participate').mockImplementationOnce(() => {
            return new Promise((_resolve, reject) => {
                reject(`record exists`);
            });
        });
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'update_t_participate').mockImplementationOnce(() => {
            return new Promise((resolve) => {
                resolve(1);
            });
        });
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info').mockImplementationOnce(() => {
            return new Promise((resolve) => {
                resolve(test_entity_1.TestEntity.get_test_server_info());
            });
        });
        // update recruitment
        let result = yield controller.recruitment_interaction(interaction);
        expect(result).toEqual(true);
    }));
    test.each([
        ["decline-recruite-token=test_token", "test_server_id", "test_user_id"],
    ])('button interaction recruitment delete test. ((%s, %s, %s) -> participate status = %s)', (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.button_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // setup test entityes
        const test_rec = test_entity_1.TestEntity.get_test_recruitment();
        // setup mocks
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment').mockImplementationOnce(() => {
            return new Promise((resolve) => {
                resolve(test_rec);
            });
        });
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'insert_t_participate').mockImplementationOnce(() => {
            return new Promise((_resolve, reject) => {
                reject(`record exists`);
            });
        });
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'update_t_participate').mockImplementationOnce(() => {
            return new Promise((resolve) => {
                resolve(1);
            });
        });
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info').mockImplementationOnce(() => {
            return new Promise((resolve) => {
                resolve(test_entity_1.TestEntity.get_test_server_info());
            });
        });
        // update recruitment
        let result = yield controller.recruitment_interaction(interaction);
        expect(result).toEqual(true);
    }));
});
//# sourceMappingURL=controller.button_interaction_recruitment_controller.test.js.map