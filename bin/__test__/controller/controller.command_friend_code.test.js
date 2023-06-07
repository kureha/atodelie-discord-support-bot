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
const command_friend_code_controller_1 = require("../../controller/command_friend_code_controller");
// setup discord common mock
const discord_common_1 = require("../../logic/discord_common");
// import test entity
const test_entity_1 = require("../common/test_entity");
function get_discord_common_mock() {
    const get_game_master_from_guild = jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild');
    get_game_master_from_guild.mockImplementationOnce((guild, ignore_role_name_list) => {
        return [test_entity_1.TestEntity.get_test_game_master_info()];
    });
    const get_game_master_list_select_menu = jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_list_select_menu');
    get_game_master_list_select_menu.mockImplementationOnce((custom_id, game_master_list, split_length) => {
        return [];
    });
}
describe('slash command search friend codetest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("search friend code test. (%s, %s %s)", (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // setup extra mock
        get_discord_common_mock();
        let result = yield command_friend_code_controller_1.CommandFriendCodeController.search_friend_code(interaction);
        expect(result).toEqual(true);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("search friend code error test. (%s, %s %s)", (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // hack mock
        interaction.guild = undefined;
        // setup extra mock
        get_discord_common_mock();
        expect.assertions(1);
        try {
            yield command_friend_code_controller_1.CommandFriendCodeController.search_friend_code(interaction);
        }
        catch (e) {
            expect(e).toContain(`Discord interaction guild is undefined.`);
        }
    }));
});
describe('slash command regist friend codetest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("regist friend code test. (%s, %s %s)", (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // setup extra mock
        get_discord_common_mock();
        let result = yield command_friend_code_controller_1.CommandFriendCodeController.regist_friend_code(interaction);
        expect(result).toEqual(true);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("regist friend code error test. (%s, %s %s)", (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // hack mock
        interaction.guild = undefined;
        // setup extra mock
        get_discord_common_mock();
        expect.assertions(1);
        try {
            yield command_friend_code_controller_1.CommandFriendCodeController.regist_friend_code(interaction);
        }
        catch (e) {
            expect(e).toContain(`Discord interaction guild is undefined.`);
        }
    }));
});
describe('slash command delete friend codetest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("delete friend code test. (%s, %s %s)", (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // setup extra mock
        get_discord_common_mock();
        let result = yield command_friend_code_controller_1.CommandFriendCodeController.delete_friend_code(interaction);
        expect(result).toEqual(true);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("delete friend code error test. (%s, %s %s)", (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // hack mock
        interaction.guild = undefined;
        // setup extra mock
        get_discord_common_mock();
        expect.assertions(1);
        try {
            yield command_friend_code_controller_1.CommandFriendCodeController.delete_friend_code(interaction);
        }
        catch (e) {
            expect(e).toContain(`Discord interaction guild is undefined.`);
        }
    }));
});
//# sourceMappingURL=controller.command_friend_code.test.js.map