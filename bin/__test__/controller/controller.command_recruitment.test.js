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
function set_show_recruitment_input_modal_mock() {
    const show_recruitment_input_modal = jest.spyOn(command_recruitment_controller_1.CommandRecruitmentController, 'show_recruitment_input_modal');
    show_recruitment_input_modal.mockImplementationOnce((interaction, modal, limit_time, description) => {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    });
}
function set_test_repositories() {
    // get repository mock
    jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment_for_user')
        .mockImplementationOnce((server_id, user_id) => {
        return new Promise((resolve, reject) => {
            resolve([test_entity_1.TestEntity.get_test_recruitment()]);
        });
    });
    jest.spyOn(participate_1.ParticipateRepository.prototype, 'get_t_participate')
        .mockImplementationOnce((token) => {
        return new Promise((resolve, reject) => {
            resolve([test_entity_1.TestEntity.get_test_participate()]);
        });
    });
    jest.spyOn(participate_1.ParticipateRepository.prototype, 'delete_t_participate')
        .mockImplementationOnce((token) => {
        return new Promise((resolve, reject) => {
            resolve(1);
        });
    });
    jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'delete_m_recruitment')
        .mockImplementationOnce((token) => {
        return new Promise((resolve, reject) => {
            resolve(1);
        });
    });
    jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info')
        .mockImplementationOnce((token) => {
        return new Promise((resolve, reject) => {
            resolve(test_entity_1.TestEntity.get_test_server_info());
        });
    });
}
describe('new recruitment commandtest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("new recruitment modal test. (%s, %s %s)", (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // get modal builder mock
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        // set extra mock
        set_show_recruitment_input_modal_mock();
        let result = yield command_recruitment_controller_1.CommandRecruitmentController.new_recruitment_input_modal(interaction);
        expect(result).toEqual(true);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("new recruitment modal error test. (%s, %s %s)", (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // get modal builder mock
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        expect.assertions(1);
        try {
            yield command_recruitment_controller_1.CommandRecruitmentController.new_recruitment_input_modal(interaction);
        }
        catch (e) {
            expect(e).toContain(`show modal for new recruitment error.`);
        }
    }));
});
describe('edit recruitment commandtest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("edit recruitment modal test. (%s, %s %s)", (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // get modal builder mock
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        // set extra mock
        set_show_recruitment_input_modal_mock();
        // set repository mock
        set_test_repositories();
        expect.assertions(1);
        let result = yield command_recruitment_controller_1.CommandRecruitmentController.edit_recruitment_input_modal(interaction);
        expect(result).toEqual(true);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("edit recruitment modal error test. (%s, %s %s)", (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // get modal builder mock
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        // set sp repository mock
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment_for_user')
            .mockImplementationOnce((server_id, user_id) => {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        });
        expect.assertions(1);
        try {
            yield command_recruitment_controller_1.CommandRecruitmentController.edit_recruitment_input_modal(interaction);
        }
        catch (e) {
            expect(e).toContain(`target user's recruitment is null or 0.`);
        }
    }));
});
describe('delete recruitment commandtest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("delete recruitment modal test. (%s, %s %s)", (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // get modal builder mock
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        // set repository mock
        set_test_repositories();
        // set extra mock
        set_show_recruitment_input_modal_mock();
        expect.assertions(1);
        let result = yield command_recruitment_controller_1.CommandRecruitmentController.delete_recruitment(interaction);
        expect(result).toEqual(true);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("delete recruitment modal error test. (%s, %s %s)", (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // get modal builder mock
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        // set sp repository mock
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment_for_user')
            .mockImplementationOnce((server_id, user_id) => {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        });
        expect.assertions(1);
        try {
            yield command_recruitment_controller_1.CommandRecruitmentController.delete_recruitment(interaction);
        }
        catch (e) {
            expect(e).toContain(`target user's recruitment is null or 0.`);
        }
    }));
});
//# sourceMappingURL=controller.command_recruitment.test.js.map