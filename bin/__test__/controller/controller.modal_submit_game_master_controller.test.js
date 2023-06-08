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
const test_entity_1 = require("../common/test_entity");
const discord_common_1 = require("../../logic/discord_common");
const modal_submit_game_master_controller_1 = require("../../controller/modal_submit_game_master_controller");
const game_master_1 = require("../../db/game_master");
const controller = new modal_submit_game_master_controller_1.ModalSubmitGameMasterController();
describe('modal submit game master test.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_custom_id", "test_server_id", "test_user_id", "test_input_precense_name"],
    ])("modal submit game master test (insert). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();
        // set extra mock
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'get_m_game_master').mockImplementationOnce((server_id, user_id) => {
            return new Promise((resolve, reject) => {
                reject();
            });
        });
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'insert_m_game_master').mockImplementationOnce((data) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'update_m_game_master').mockImplementationOnce((data) => {
            return new Promise((resolve, reject) => { resolve(0); });
        });
        // set discord common mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild, ignore_role_name_list) => {
            return [test_entity_1.TestEntity.get_test_game_master_info()];
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id, game_master_list) => {
            return test_entity_1.TestEntity.get_test_game_master_info();
        });
        // expect
        let result = yield controller.regist(interaction, false);
        expect(result).toEqual(true);
    }));
    test.each([
        ["DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_game_id", "test_server_id", "test_user_id", "test_input_precense_name"],
        ["test_game_id", "test_server_id", "test_user_id", "test_input_precense_name"],
    ])("modal submit game master test (update). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();
        // set extra mock
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'get_m_game_master').mockImplementationOnce((server_id, user_id) => {
            return new Promise((resolve, reject) => {
                resolve(test_entity_1.TestEntity.get_test_game_master_info());
            });
        });
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'insert_m_game_master').mockImplementationOnce((data) => {
            return new Promise((resolve, reject) => { resolve(0); });
        });
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'update_m_game_master').mockImplementationOnce((data) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        // set discord common mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild, ignore_role_name_list) => {
            return [test_entity_1.TestEntity.get_test_game_master_info()];
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id, game_master_list) => {
            return test_entity_1.TestEntity.get_test_game_master_info();
        });
        // expect
        let result = yield controller.regist(interaction, false);
        expect(result).toEqual(true);
    }));
    test.each([
        ["DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_custom_id", "test_server_id", "test_user_id", "test_input_precense_name"],
    ])("modal submit game master error test (insert). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();
        // set extra mock
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'get_m_game_master').mockImplementationOnce((server_id, user_id) => {
            return new Promise((resolve, reject) => {
                reject();
            });
        });
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'insert_m_game_master').mockImplementationOnce((data) => {
            return new Promise((resolve, reject) => { resolve(0); });
        });
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'update_m_game_master').mockImplementationOnce((data) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        // set discord common mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild, ignore_role_name_list) => {
            return [test_entity_1.TestEntity.get_test_game_master_info()];
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id, game_master_list) => {
            return test_entity_1.TestEntity.get_test_game_master_info();
        });
        // expect
        const result = yield controller.regist(interaction, false);
        expect(result).toEqual(false);
    }));
    test.each([
        ["DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_game_id", "test_server_id", "test_user_id", "test_input_precense_name"],
        ["test_game_id", "test_server_id", "test_user_id", "test_input_precense_name"],
    ])("modal submit game master error test (update). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();
        // set extra mock
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'get_m_game_master').mockImplementationOnce((server_id, user_id) => {
            return new Promise((resolve, reject) => {
                resolve(test_entity_1.TestEntity.get_test_game_master_info());
            });
        });
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'insert_m_game_master').mockImplementationOnce((data) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'update_m_game_master').mockImplementationOnce((data) => {
            return new Promise((resolve, reject) => { resolve(0); });
        });
        // set discord common mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild, ignore_role_name_list) => {
            return [test_entity_1.TestEntity.get_test_game_master_info()];
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id, game_master_list) => {
            return test_entity_1.TestEntity.get_test_game_master_info();
        });
        // expect
        const result = yield controller.regist(interaction, false);
        expect(result).toEqual(false);
    }));
    test.each([
        ["DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_game_id", "test_server_id", "test_user_id", "test_input_precense_name"],
    ])("modal submit game master exception test. (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();
        // set extra mock
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'get_m_game_master').mockImplementationOnce((server_id, user_id) => {
            return new Promise((resolve, reject) => {
                resolve(test_entity_1.TestEntity.get_test_game_master_info());
            });
        });
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'insert_m_game_master').mockImplementationOnce((data) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'update_m_game_master').mockImplementationOnce((data) => {
            return new Promise((resolve, reject) => { resolve(0); });
        });
        // no mock for discord common - for system exception
        // expect
        const result = yield controller.regist(interaction, false);
        expect(result).toEqual(false);
    }));
});
//# sourceMappingURL=controller.modal_submit_game_master_controller.test.js.map