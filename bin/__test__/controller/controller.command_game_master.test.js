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
const command_game_master_controller_1 = require("../../controller/command_game_master_controller");
// setup discord common mock
const discord_common_1 = require("../../logic/discord_common");
// import test entity
const test_entity_1 = require("../common/test_entity");
const controller = new command_game_master_controller_1.CommandGameMasterController();
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
describe('select_game_master for edit', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", true],
    ])("test for select_game_master, (%s, %s, %s) -> %s", (custom_id, guild_id, user_id, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // setup extra mock
        get_discord_common_mock();
        let result = yield controller.select_game_master_for_edit_game_master(interaction, false);
        expect(result).toEqual(expected);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", false],
    ])("test for select_game_master error, (%s, %s, %s) -> %s", (custom_id, guild_id, user_id, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // hack mock
        interaction.guild = undefined;
        // setup extra mock
        get_discord_common_mock();
        const result = yield controller.select_game_master_for_edit_game_master(interaction);
        expect(result).toEqual(expected);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", false],
    ])("test for select_game_master check privilege error, (%s, %s, %s) -> %s", (custom_id, guild_id, user_id, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        jest.spyOn(discord_common_1.DiscordCommon, 'check_privillege')
            .mockImplementationOnce(() => { return false; });
        // setup extra mock
        get_discord_common_mock();
        const result = yield controller.select_game_master_for_edit_game_master(interaction);
        expect(result).toEqual(expected);
    }));
});
describe('select_game_master for reset', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", true],
    ])("test for select_game_master (for reset), (%s, %s, %s) -> %s", (custom_id, guild_id, user_id, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // setup extra mock
        get_discord_common_mock();
        let result = yield controller.select_game_master_for_reset_game_master(interaction, false);
        expect(result).toEqual(expected);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", false],
    ])("test for select_game_master error (for reset), (%s, %s, %s) -> %s", (custom_id, guild_id, user_id, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // hack mock
        interaction.guild = undefined;
        // setup extra mock
        get_discord_common_mock();
        const result = yield controller.select_game_master_for_reset_game_master(interaction);
        expect(result).toEqual(expected);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", false],
    ])("test for select_game_master check privilege error (for reset), (%s, %s, %s) -> %s", (custom_id, guild_id, user_id, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        jest.spyOn(discord_common_1.DiscordCommon, 'check_privillege')
            .mockImplementationOnce(() => { return false; });
        // setup extra mock
        get_discord_common_mock();
        const result = yield controller.select_game_master_for_reset_game_master(interaction);
        expect(result).toEqual(expected);
    }));
});
//# sourceMappingURL=controller.command_game_master.test.js.map