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
describe('regist', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [
            "DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_custom_id", "test_server_id", "test_user_id", "test_input_precense_name",
            true, true, 1, 0, true
        ],
        [
            "DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_custom_id", "test_server_id", "test_user_id", "test_input_precense_name",
            true, false, 0, 1, true
        ],
        [
            "DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_custom_id", "test_server_id", "test_user_id", "test_input_precense_name",
            true, true, 0, 0, false
        ],
        [
            "DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_custom_id", "test_server_id", "test_user_id", "",
            true, true, 1, 0, true
        ],
        [
            "DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_custom_id", "test_server_id", "test_user_id", "test_input_precense_name",
            false, true, 1, 0, false
        ],
    ])("test for regist, (%s, %s, %s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, input_value, privilegge_result, is_game_master_insert, ins_count, upd_count, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();
        jest.spyOn(discord_common_1.DiscordCommon, 'check_privillege')
            .mockImplementationOnce(() => { return privilegge_result; });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_list')
            .mockImplementationOnce(() => { return test_entity_1.TestEntity.get_test_game_master_info(); });
        if (is_game_master_insert) {
            jest.spyOn(game_master_1.GameMasterRepository.prototype, 'get_m_game_master')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { throw `exception!`; }));
        }
        else {
            jest.spyOn(game_master_1.GameMasterRepository.prototype, 'get_m_game_master')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return test_entity_1.TestEntity.get_test_game_master_info(); }));
        }
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'insert_m_game_master')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return ins_count; }));
        jest.spyOn(game_master_1.GameMasterRepository.prototype, 'update_m_game_master')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return upd_count; }));
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild')
            .mockImplementationOnce(() => { return []; });
        // expect
        let result = yield controller.regist(interaction, false);
        expect(result).toEqual(expected);
    }));
});
//# sourceMappingURL=controller.modal_submit_game_master_controller.test.js.map