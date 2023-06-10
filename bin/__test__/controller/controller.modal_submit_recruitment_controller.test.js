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
// import constants
const constants_1 = require("../../common/constants");
const constants = new constants_1.Constants();
const modal_submit_recruitment_controller_1 = require("../../controller/modal_submit_recruitment_controller");
const test_entity_1 = require("../common/test_entity");
const discord_common_1 = require("../../logic/discord_common");
const recruitement_1 = require("../../db/recruitement");
const participate_1 = require("../../db/participate");
const server_info_1 = require("../../db/server_info");
const discord_interaction_analyzer_1 = require("../../logic/discord_interaction_analyzer");
const controller = new modal_submit_recruitment_controller_1.ModalSubmitRecruitmentController();
describe('regist', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code", "test-ch-id", true],
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code", constants.RECRUITMENT_INVALID_CHANNEL_ID, true],
    ])('test for regist, (%s, %s, %s, %s, %s) -> %s', (custom_id, guild_id, user_id, input_value, test_channel_id, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();
        jest.spyOn(modal_submit_recruitment_controller_1.ModalSubmitRecruitmentController.prototype, 'get_recruitment')
            .mockImplementationOnce(() => { return test_entity_1.TestEntity.get_test_recruitment(); });
        jest.spyOn(modal_submit_recruitment_controller_1.ModalSubmitRecruitmentController.prototype, 'get_owner_participate')
            .mockImplementationOnce(() => { return test_entity_1.TestEntity.get_test_participate(); });
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment_token')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 'test-tkn'; }));
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment_id')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'insert_m_recruitment')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'insert_t_participate')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () {
            const v = test_entity_1.TestEntity.get_test_server_info();
            v.channel_id = test_channel_id;
            return v;
        }));
        jest.spyOn(discord_common_1.DiscordCommon, 'get_button')
            .mockImplementation(() => { return {}; });
        const result = yield controller.regist(interaction);
        expect(result).toBe(expected);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code", "test-ch-id", false],
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code", constants.RECRUITMENT_INVALID_CHANNEL_ID, false],
    ])('test for regist, (%s, %s, %s, %s, %s) -> %s', (custom_id, guild_id, user_id, input_value, test_channel_id, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();
        jest.spyOn(modal_submit_recruitment_controller_1.ModalSubmitRecruitmentController.prototype, 'get_recruitment')
            .mockImplementationOnce(() => { throw `exception!`; });
        const result = yield controller.regist(interaction);
        expect(result).toBe(expected);
    }));
});
describe('edit', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            "test-ch-id",
            [test_entity_1.TestEntity.get_test_recruitment()],
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            "test-ch-id",
            [],
            false
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            constants.RECRUITMENT_INVALID_CHANNEL_ID,
            [test_entity_1.TestEntity.get_test_recruitment()],
            true
        ],
    ])('test for edit, (%s, %s, %s, %s, %s) -> %s', (custom_id, guild_id, user_id, input_value, test_channel_id, rec_list, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment_for_user')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return rec_list; }));
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'get_t_participate')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return [test_entity_1.TestEntity.get_test_participate()]; }));
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () {
            const v = test_entity_1.TestEntity.get_test_server_info();
            v.channel_id = test_channel_id;
            return v;
        }));
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'delete_t_participate')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'delete_m_recruitment')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment_token')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 'test-tkn'; }));
        jest.spyOn(discord_common_1.DiscordCommon, 'get_role_info_from_guild')
            .mockImplementationOnce(() => { return []; });
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'insert_m_recruitment')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'insert_t_participate')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
        jest.spyOn(discord_common_1.DiscordCommon, 'get_button')
            .mockImplementation(() => { return {}; });
        const result = yield controller.edit(interaction);
        expect(result).toBe(expected);
    }));
});
describe('get_recruitment', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])('test for get_recruitment, (%s, %s, %s, %s)', (custom_id, guild_id, user_id, input_value) => {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();
        jest.spyOn(discord_common_1.DiscordCommon, 'replace_intaraction_description_roles')
            .mockImplementationOnce(() => { return 'test-nm'; });
        jest.spyOn(discord_interaction_analyzer_1.DiscordInteractionAnalyzer, 'get_recruitment_time')
            .mockImplementationOnce(() => { return new Date(); });
        const result = controller.get_recruitment(interaction);
        expect(result.name).toEqual('test-nm');
        expect(result.token).toEqual('');
        expect(result.status).toEqual(constants.STATUS_ENABLED);
        expect(result.description).toEqual('');
        expect(result.delete).toEqual(false);
    });
});
describe('get_owner_participate', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])('test for get_owner_participate, (%s, %s, %s, %s)', (custom_id, guild_id, user_id, input_value) => {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();
        const result = controller.get_owner_participate(interaction);
        expect(result.token).toEqual('');
        expect(result.status).toEqual(constants.STATUS_ENABLED);
        expect(result.delete).toEqual(false);
    });
});
//# sourceMappingURL=controller.modal_submit_recruitment_controller.test.js.map