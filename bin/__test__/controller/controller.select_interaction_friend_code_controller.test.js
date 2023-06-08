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
describe('select menu search friend codetest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])("select menu friend code test (search ok). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
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
        jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'get_t_friend_code_from_game_id').mockImplementationOnce((server_id, game_id) => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_friend_code()]);
            });
        });
        // expect
        let result = yield controller.search_friend_code(interaction);
        expect(result).toEqual(true);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])("select menu friend code test (search ng). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
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
        jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'get_t_friend_code_from_game_id').mockImplementationOnce((server_id, game_id) => {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        });
        // expect
        let result = yield controller.search_friend_code(interaction);
        expect(result).toEqual(false);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])("select menu friend code error test (search). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();
        // hack mock
        interaction.guild = undefined;
        // expect
        const result = yield controller.search_friend_code(interaction);
        expect(result).toEqual(false);
    }));
});
describe('select menu regist friend codetest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_game_id"],
    ])("select menu friend code test (regist open). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
        test_discord_mock_1.TestDiscordMock.text_input_builder_mock();
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
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
        jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'get_t_friend_code').mockImplementationOnce((server_id, game_id) => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_friend_code()]);
            });
        });
        // expect
        let result = yield controller.regist_friend_code(interaction);
        expect(result).toEqual(true);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_game_id"],
    ])("select menu friend code error test (regist open). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();
        // hack mock
        interaction.guild = undefined;
        // expect
        const result = yield controller.regist_friend_code(interaction);
        expect(result).toEqual(false);
    }));
});
describe('select menu delete friend codetest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_game_id"],
    ])("select menu friend code test (delete ok). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
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
        jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'get_t_friend_code').mockImplementationOnce((server_id, game_id) => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_friend_code()]);
            });
        });
        jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'delete_t_friend_code').mockImplementationOnce((server_id, user_id, game_id) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(friend_code_history_1.FriendCodeHistoryRepository.prototype, 'insert_t_friend_code').mockImplementation((fc) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        // expect
        let result = yield controller.delete_friend_code(interaction);
        expect(result).toEqual(true);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_game_id"],
    ])("select menu friend code test (delete ng). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
        // set special mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_interaction_value_by_idx').mockImplementationOnce((list, idx) => {
            return 'test_game_id_notfound';
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id, game_master_list) => {
            return test_entity_1.TestEntity.get_test_game_master_info();
        });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild, ignore_role_name_list) => {
            return [test_entity_1.TestEntity.get_test_game_master_info()];
        });
        jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'get_t_friend_code').mockImplementationOnce((server_id, game_id) => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_friend_code()]);
            });
        });
        jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'delete_t_friend_code').mockImplementationOnce((server_id, user_id, game_id) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(friend_code_history_1.FriendCodeHistoryRepository.prototype, 'insert_t_friend_code').mockImplementation((fc) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        // expect
        let result = yield controller.delete_friend_code(interaction);
        expect(result).toEqual(false);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_game_id"],
    ])("select menu friend code test (delete ng). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
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
        jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'get_t_friend_code').mockImplementationOnce((server_id, game_id) => {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        });
        // expect
        let result = yield controller.delete_friend_code(interaction);
        expect(result).toEqual(false);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_game_id"],
    ])("select menu friend code error test (delete). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();
        // hack mock
        interaction.guild = undefined;
        // expect
        const result = yield controller.delete_friend_code(interaction);
        expect(result).toEqual(false);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_game_id"],
    ])("select menu friend code error test (exception for delete record). (%s, %s, %s, %s)", (custom_id, guild_id, user_id, input_value) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
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
        jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'get_t_friend_code').mockImplementationOnce((server_id, game_id) => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_friend_code()]);
            });
        });
        jest.spyOn(friend_code_1.FriendCodeRepository.prototype, 'delete_t_friend_code').mockImplementationOnce((server_id, user_id, game_id) => {
            return new Promise((resolve, reject) => { resolve(0); });
        });
        jest.spyOn(friend_code_history_1.FriendCodeHistoryRepository.prototype, 'insert_t_friend_code').mockImplementation((fc) => {
            return new Promise((resolve, reject) => { resolve(1); });
        });
        // expect
        const result = yield controller.delete_friend_code(interaction);
        expect(result).toEqual(false);
    }));
});
//# sourceMappingURL=controller.select_interaction_friend_code_controller.test.js.map