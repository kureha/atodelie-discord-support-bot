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
const discord_common_1 = require("../../logic/discord_common");
const test_entity_1 = require("../common/test_entity");
const select_interaction_game_master_controller_1 = require("../../controller/select_interaction_game_master_controller");
const game_master_1 = require("../../db/game_master");
const controller = new select_interaction_game_master_controller_1.SelectInteractionGameMasterController();
describe('edit_game_master', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            true,
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            false,
            true
        ],
    ])("test for edit_game_master, (%s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, game_id, is_game_master_exists, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
        test_discord_mock_1.TestDiscordMock.text_input_builder_mock();
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        // set special mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_interaction_value_by_idx')
            .mockImplementationOnce(() => { return game_id; });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_list')
            .mockImplementationOnce(() => { return test_entity_1.TestEntity.get_test_game_master_info(); });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_text_input')
            .mockImplementation(() => { return { setValue: () => { } }; });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild')
            .mockImplementationOnce(() => { return []; });
        if (is_game_master_exists) {
            jest.spyOn(game_master_1.GameMasterRepository.prototype, 'get_m_game_master')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return test_entity_1.TestEntity.get_test_game_master_info(); }));
        }
        else {
            jest.spyOn(game_master_1.GameMasterRepository.prototype, 'get_m_game_master')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { throw `exception!`; }));
        }
        // expect
        let result = yield controller.edit_game_master(interaction, false);
        expect(result).toEqual(expected);
    }));
    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            true,
            false
        ],
    ])("test for edit_game_master for exception unprivillege access, (%s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, game_id, is_game_master_exists, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
        test_discord_mock_1.TestDiscordMock.text_input_builder_mock();
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        // expect
        let result = yield controller.edit_game_master(interaction);
        expect(result).toEqual(expected);
    }));
    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            true,
            false
        ],
    ])("test for edit_game_master for exception, (%s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, game_id, is_game_master_exists, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
        test_discord_mock_1.TestDiscordMock.text_input_builder_mock();
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        interaction.guild = undefined;
        // expect
        let result = yield controller.edit_game_master(interaction, false);
        expect(result).toEqual(expected);
    }));
});
describe('reset_game_master', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            true,
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            false,
            false // if delete, no game master is ERROR
        ],
    ])("test for reset_game_master, (%s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, game_id, is_game_master_exists, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
        test_discord_mock_1.TestDiscordMock.text_input_builder_mock();
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        // set special mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_interaction_value_by_idx')
            .mockImplementationOnce(() => { return game_id; });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_list')
            .mockImplementationOnce(() => { return test_entity_1.TestEntity.get_test_game_master_info(); });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_text_input')
            .mockImplementation(() => { return { setValue: () => { } }; });
        jest.spyOn(discord_common_1.DiscordCommon, 'get_game_master_from_guild')
            .mockImplementationOnce(() => { return []; });
        if (is_game_master_exists) {
            jest.spyOn(game_master_1.GameMasterRepository.prototype, 'delete_m_game_master')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
        }
        else {
            jest.spyOn(game_master_1.GameMasterRepository.prototype, 'delete_m_game_master')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 0; }));
        }
        // expect
        let result = yield controller.reset_game_master(interaction, false);
        expect(result).toEqual(expected);
    }));
    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            true,
            false
        ],
    ])("test for reset_game_master for exception unprivillege access, (%s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, game_id, is_game_master_exists, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
        test_discord_mock_1.TestDiscordMock.text_input_builder_mock();
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        // expect
        let result = yield controller.reset_game_master(interaction);
        expect(result).toEqual(expected);
    }));
    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            true,
            false
        ],
    ])("test for reset_game_master for exception, (%s, %s, %s, %s, %s) -> %s", (custom_id, guild_id, user_id, game_id, is_game_master_exists, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        test_discord_mock_1.TestDiscordMock.embed_mock();
        test_discord_mock_1.TestDiscordMock.text_input_builder_mock();
        test_discord_mock_1.TestDiscordMock.modal_builder_mock();
        interaction.guild = undefined;
        // expect
        let result = yield controller.reset_game_master(interaction, false);
        expect(result).toEqual(expected);
    }));
});
//# sourceMappingURL=controller.select_interaction_game_master_controller.test.js.map