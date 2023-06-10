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
const select_interaction_friend_code_controller_1 = require("../../controller/select_interaction_friend_code_controller");
const discord_common_1 = require("../../logic/discord_common");
const test_entity_1 = require("../common/test_entity");
const friend_code_1 = require("../../db/friend_code");
const friend_code_history_1 = require("../../db/friend_code_history");
const controller = new select_interaction_friend_code_controller_1.SelectInteractionFriendCodeController();
describe('search_friend_code', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    function exclude_friend_code(v) {
        v.friend_code = '';
        return v;
    }
    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            [test_entity_1.TestEntity.get_test_friend_code()], true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            [exclude_friend_code(test_entity_1.TestEntity.get_test_friend_code())], false
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            [test_entity_1.TestEntity.get_test_friend_code(), exclude_friend_code(test_entity_1.TestEntity.get_test_friend_code())], true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            [], false
        ],
    ])("test for search_friend_code, (%s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, game_id, matched_friend_code_list, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
        jest.spyOn(discord_common_1.DiscordCommon, 'get_interaction_value_by_idx')
            .mockImplementationOnce(() => { return game_id; });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_list')
            .mockImplementationOnce(() => { return test_entity_1.TestEntity.get_test_game_master_info(); });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild')
            .mockImplementationOnce(() => { return []; });
        jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'get_t_friend_code_from_game_id')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return matched_friend_code_list; }));
        // expect
        let result = yield controller.search_friend_code(interaction);
        expect(result).toEqual(expected);
    }));
    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            [test_entity_1.TestEntity.get_test_friend_code()], false
        ],
    ])("test for search_friend_code exception, (%s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, game_id, matched_friend_code_list, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
        interaction.guild = undefined;
        // expect
        let result = yield controller.search_friend_code(interaction);
        expect(result).toEqual(expected);
    }));
});
describe('regist_friend_code', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            [test_entity_1.TestEntity.get_test_friend_code()],
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            [],
            true
        ],
    ])("test for regist_friend_code, (%s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, game_id, matched_friend_code_list, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
        test_discord_mock_1.TestDiscordMock.text_input_builder_mock();
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        jest.spyOn(discord_common_1.DiscordCommon, 'get_interaction_value_by_idx')
            .mockImplementationOnce(() => { return game_id; });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_list')
            .mockImplementationOnce(() => { return test_entity_1.TestEntity.get_test_game_master_info(); });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild')
            .mockImplementationOnce(() => { return []; });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_text_input')
            .mockImplementation(() => { return { setValue: () => { } }; });
        jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'get_t_friend_code')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return matched_friend_code_list; }));
        // expect
        let result = yield controller.regist_friend_code(interaction);
        expect(result).toEqual(expected);
    }));
    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            [test_entity_1.TestEntity.get_test_friend_code()],
            false
        ],
    ])("test for regist_friend_code exception, (%s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, game_id, matched_friend_code_list, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        interaction.guild = undefined;
        // expect
        let result = yield controller.regist_friend_code(interaction);
        expect(result).toEqual(expected);
    }));
});
describe('delete_friend_code', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            [test_entity_1.TestEntity.get_test_friend_code()], true,
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            [test_entity_1.TestEntity.get_test_friend_code()], false,
            false
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            [], true,
            false
        ],
    ])("test for delete_friend_code, (%s, %s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, game_id, matched_friend_code_list, is_delete_successed, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
        jest.spyOn(discord_common_1.DiscordCommon, 'get_interaction_value_by_idx')
            .mockImplementationOnce(() => { return game_id; });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_list')
            .mockImplementationOnce(() => { return test_entity_1.TestEntity.get_test_game_master_info(); });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild')
            .mockImplementationOnce(() => { return []; });
        jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'get_t_friend_code')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return matched_friend_code_list; }));
        if (is_delete_successed) {
            jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'delete_t_friend_code')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
            jest.spyOn(friend_code_history_1.FriendCodeHistoryRepository.prototype, 'insert_t_friend_code')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
        }
        else {
            jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'delete_t_friend_code')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 0; }));
            jest.spyOn(friend_code_history_1.FriendCodeHistoryRepository.prototype, 'insert_t_friend_code')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 0; }));
        }
        // expect
        let result = yield controller.delete_friend_code(interaction);
        expect(result).toEqual(expected);
    }));
    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            [test_entity_1.TestEntity.get_test_friend_code()], true,
            false
        ],
    ])("test for delete_friend_code for exception, (%s, %s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, game_id, matched_friend_code_list, is_delete_successed, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
        interaction.guild = undefined;
        // expect
        let result = yield controller.delete_friend_code(interaction);
        expect(result).toEqual(expected);
    }));
});
//# sourceMappingURL=controller.select_interaction_friend_code_controller.test.js.map