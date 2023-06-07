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
const select_interaction_server_controller_1 = require("../../controller/select_interaction_server_controller");
const discord_common_1 = require("../../logic/discord_common");
const test_entity_1 = require("../common/test_entity");
const server_info_1 = require("../../db/server_info");
describe('select menu server regist master codetest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_role_id"],
    ])("select menu server regist master test (regist ok). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();
        // set special mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_interaction_value_by_idx').mockImplementationOnce((list, idx) => {
            return input_value;
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id, game_master_list) => {
            return test_entity_1.TestEntity.get_test_game_master_info();
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild, ignore_role_name_list) => {
            return [test_entity_1.TestEntity.get_test_game_master_info()];
        });
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'insert_m_server_info').mockImplementationOnce((v) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'update_m_server_info').mockImplementationOnce((v) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info').mockImplementationOnce((v) => {
            return new Promise((resolve, reject) => {
                resolve(test_entity_1.TestEntity.get_test_server_info());
            });
        });
        // expect
        let result = yield select_interaction_server_controller_1.SelectInteractionServerController.regist_server_master(interaction, false);
        expect(result).toEqual(true);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_role_id"],
    ])("select menu server regist master test (regist ng). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, []);
        const interaction = new Mock();
        // set special mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_interaction_value_by_idx').mockImplementationOnce((list, idx) => {
            return 'test_role_id_undefined';
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id, game_master_list) => {
            return test_entity_1.TestEntity.get_test_game_master_info();
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild, ignore_role_name_list) => {
            return [test_entity_1.TestEntity.get_test_game_master_info()];
        });
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'insert_m_server_info').mockImplementationOnce((v) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'update_m_server_info').mockImplementationOnce((v) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info').mockImplementationOnce((v) => {
            return new Promise((resolve, reject) => {
                resolve(test_entity_1.TestEntity.get_test_server_info());
            });
        });
        // expect
        let result = yield select_interaction_server_controller_1.SelectInteractionServerController.regist_server_master(interaction, false);
        expect(result).toEqual(false);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_role_id"],
    ])("select menu server regist master error test (falls privileges). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();
        // expect
        let result = yield select_interaction_server_controller_1.SelectInteractionServerController.regist_server_master(interaction);
        expect(result).toEqual(false);
    }));
});
//# sourceMappingURL=controller.select_interaction_server_controller.test.js.map