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
const command_recruitment_controller_1 = require("../../controller/command_recruitment_controller");
const recruitement_1 = require("../../db/recruitement");
const test_entity_1 = require("../common/test_entity");
const participate_1 = require("../../db/participate");
const server_info_1 = require("../../db/server_info");
const discord_common_1 = require("../../logic/discord_common");
const controller = new command_recruitment_controller_1.CommandRecruitmentController();
describe('new_recruitment_input_modal', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("test for new_recruitment_input_modal, (%s, %s, %s) -> %s", (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        jest.spyOn(command_recruitment_controller_1.CommandRecruitmentController.prototype, 'show_recruitment_input_modal')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return true; }));
        // get modal builder mock
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        let result = yield controller.new_recruitment_input_modal(interaction);
        expect(result).toEqual(true);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("new recruitment modal exception test. (%s, %s %s)", (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        jest.spyOn(command_recruitment_controller_1.CommandRecruitmentController.prototype, 'show_recruitment_input_modal')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { throw `exception!`; }));
        // get modal builder mock
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        let result = yield controller.new_recruitment_input_modal(interaction);
        expect(result).toEqual(false);
    }));
});
describe('edit_recruitment_input_modal', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", [test_entity_1.TestEntity.get_test_recruitment()], true],
    ])("test for edit_recruitment_input_modal, (%s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, rec_list, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment_for_user')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return rec_list; }));
        jest.spyOn(command_recruitment_controller_1.CommandRecruitmentController.prototype, 'show_recruitment_input_modal')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return true; }));
        // get modal builder mock
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        let result = yield controller.edit_recruitment_input_modal(interaction);
        expect(result).toEqual(expected);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", [], false],
    ])("test for edit_recruitment_input_modal error, (%s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, rec_list, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment_for_user')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return rec_list; }));
        jest.spyOn(command_recruitment_controller_1.CommandRecruitmentController.prototype, 'show_recruitment_input_modal')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return true; }));
        // get modal builder mock
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        let result = yield controller.edit_recruitment_input_modal(interaction);
        expect(result).toEqual(expected);
    }));
});
describe('delete_recruitment', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", [test_entity_1.TestEntity.get_test_recruitment()], true],
    ])("test for delete_recruitment, (%s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, rec_list, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment_for_user')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return rec_list; }));
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'delete_m_recruitment')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'get_t_participate')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return []; }));
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'delete_t_participate')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 2; }));
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return test_entity_1.TestEntity.get_test_server_info(); }));
        // get modal builder mock
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        let result = yield controller.delete_recruitment(interaction);
        expect(result).toEqual(expected);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", [], false],
    ])("test for delete_recruitment error, (%s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, rec_list, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment_for_user')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return rec_list; }));
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'delete_m_recruitment')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'get_t_participate')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return []; }));
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'delete_t_participate')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 2; }));
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return test_entity_1.TestEntity.get_test_server_info(); }));
        // get modal builder mock
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        let result = yield controller.delete_recruitment(interaction);
        expect(result).toEqual(expected);
    }));
});
describe('show_recruitment_input_modal', () => {
    test('test for show_recruitment_input_modal', () => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock('test-c-id', 'test-g-id', 'test-u-id');
        const interaction = new Mock();
        jest.spyOn(discord_common_1.DiscordCommon, 'get_text_input')
            .mockImplementation(() => {
            return {
                setValue: () => { },
            };
        });
        const result = yield controller.show_recruitment_input_modal(interaction, { addComponents: () => { } }, new Date(), '');
        expect(result).toBe(true);
    }));
    test('test for show_recruitment_input_modal error', () => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock('test-c-id', 'test-g-id', 'test-u-id');
        const interaction = new Mock();
        jest.spyOn(discord_common_1.DiscordCommon, 'get_text_input')
            .mockImplementation(() => { throw `exception!`; });
        let result = yield controller.show_recruitment_input_modal(interaction, { addComponents: () => { } }, new Date(), '');
        expect(result).toEqual(false);
    }));
});
//# sourceMappingURL=controller.command_recruitment.test.js.map