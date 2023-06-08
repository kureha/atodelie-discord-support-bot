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
const modal_submit_recruitment_controller_1 = require("../../controller/modal_submit_recruitment_controller");
const test_entity_1 = require("../common/test_entity");
const discord_common_1 = require("../../logic/discord_common");
const recruitement_1 = require("../../db/recruitement");
const participate_1 = require("../../db/participate");
const server_info_1 = require("../../db/server_info");
const controller = new modal_submit_recruitment_controller_1.ModalSubmitRecruitmentController();
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
describe('modal submit friend codetest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])("modal submit friend code test (insert). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();
        // set extra mock
        set_test_repositories();
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'insert_m_recruitment').mockImplementationOnce((v) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'insert_t_participate_list').mockImplementationOnce((v) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        // set discord common mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild, ignore_role_name_list) => {
            return [test_entity_1.TestEntity.get_test_game_master_info()];
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id, game_master_list) => {
            return test_entity_1.TestEntity.get_test_game_master_info();
        });
        // set discord common mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_role_info_from_guild').mockImplementationOnce((guild) => {
            return test_entity_1.TestEntity.get_test_role_info(5);
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_button').mockImplementation((custom_id, label, button_style) => {
            return {};
        });
        // expect
        let result = yield controller.regist(interaction);
        expect(result).toEqual(true);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])("modal submit friend code test (update). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();
        // set extra mock
        set_test_repositories();
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'insert_m_recruitment').mockImplementationOnce((v) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment_token').mockImplementationOnce(() => {
            return new Promise((resolve, reject) => { resolve("test_token_update"); });
        });
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'insert_t_participate_list').mockImplementationOnce((v) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        // set discord common mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild, ignore_role_name_list) => {
            return [test_entity_1.TestEntity.get_test_game_master_info()];
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id, game_master_list) => {
            return test_entity_1.TestEntity.get_test_game_master_info();
        });
        // set discord common mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_role_info_from_guild').mockImplementationOnce((guild) => {
            return test_entity_1.TestEntity.get_test_role_info(5);
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_button').mockImplementation((custom_id, label, button_style) => {
            return {};
        });
        // expect
        let result = yield controller.edit(interaction);
        expect(result).toEqual(true);
    }));
});
//# sourceMappingURL=controller.modal_submit_recruitment_controller.test.js.map