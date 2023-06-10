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
const test_entity_1 = require("../common/test_entity");
const server_info_1 = require("../../db/server_info");
const controller = new select_interaction_server_controller_1.SelectInteractionServerController();
describe('regist_server_master', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", ["test_role_id"],
            true,
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", ["test_role_id"],
            false,
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", [undefined],
            false,
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", [],
            true,
            false
        ],
    ])("test for regist_server_master, (%s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, interaction_value_arr, is_insert_successed, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, interaction_value_arr);
        const interaction = new Mock();
        if (is_insert_successed) {
            jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'insert_m_server_info')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
            jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'update_m_server_info')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { throw `exception!`; }));
        }
        else {
            jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'insert_m_server_info')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { throw `exception!`; }));
            jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'update_m_server_info')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
        }
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return test_entity_1.TestEntity.get_test_server_info(); }));
        // expect
        let result = yield controller.regist_server_master(interaction, false);
        expect(result).toEqual(expected);
    }));
    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", ["test_role_id"],
            true,
            false
        ],
    ])("test for regist_server_master for exception unprivillege access, (%s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, interaction_value_arr, is_insert_successed, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, interaction_value_arr);
        const interaction = new Mock();
        // expect
        let result = yield controller.regist_server_master(interaction);
        expect(result).toEqual(expected);
    }));
    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", ["test_role_id"],
            true,
            false
        ],
    ])("test for regist_server_master for exception, (%s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, interaction_value_arr, is_insert_successed, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, interaction_value_arr);
        const interaction = new Mock();
        interaction.guild = undefined;
        // expect
        let result = yield controller.regist_server_master(interaction, false);
        expect(result).toEqual(expected);
    }));
});
//# sourceMappingURL=controller.select_interaction_server_controller.test.js.map