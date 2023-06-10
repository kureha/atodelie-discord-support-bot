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
const modal_submit_friend_code_controller_1 = require("../../controller/modal_submit_friend_code_controller");
const test_entity_1 = require("../common/test_entity");
const friend_code_1 = require("../../db/friend_code");
const friend_code_2 = require("../../entity/friend_code");
const friend_code_history_1 = require("../../db/friend_code_history");
const discord_common_1 = require("../../logic/discord_common");
const controller = new modal_submit_friend_code_controller_1.ModalSubmitFriendCodeController();
describe('regist', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [
            "DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE-test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            true, false, true
        ],
        [
            "DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE-test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            false, true, true
        ],
        [
            "DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE-test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            false, false, false
        ],
    ])("test for regist insert (%s, %s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, input_value, can_get_friend_code, is_insert_successed, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();
        // set extra mock
        jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'get_t_friend_code')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return [test_entity_1.TestEntity.get_test_friend_code()]; }));
        if (can_get_friend_code) {
            jest.spyOn(friend_code_2.FriendCode, 'search')
                .mockImplementationOnce(() => { return test_entity_1.TestEntity.get_test_friend_code(); });
        }
        else {
            jest.spyOn(friend_code_2.FriendCode, 'search')
                .mockImplementationOnce(() => { throw `exception!`; });
        }
        if (is_insert_successed) {
            jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'insert_t_friend_code')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
            jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'update_t_friend_code')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 0; }));
        }
        else {
            jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'insert_t_friend_code')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 0; }));
            jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'update_t_friend_code')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
        }
        jest.spyOn(friend_code_history_1.FriendCodeHistoryRepository.prototype, 'insert_t_friend_code')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
        // set discord common mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild')
            .mockImplementationOnce(() => { return [test_entity_1.TestEntity.get_test_game_master_info()]; });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_list')
            .mockImplementationOnce(() => { return test_entity_1.TestEntity.get_test_game_master_info(); });
        // expect
        let result = yield controller.regist(interaction);
        expect(result).toEqual(expected);
    }));
});
//# sourceMappingURL=controller.modal_submit_friend_code_controller.test.js.map