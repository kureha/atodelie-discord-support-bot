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
// setup discord common mock
const discord_common_1 = require("../../logic/discord_common");
const command_server_controller_1 = require("../../controller/command_server_controller");
const controller = new command_server_controller_1.CommandServerController();
describe('regist_server_master', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", true],
    ])("test for regist_server_master, (%s, %s, %s) -> %s", (custom_id, guild_id, user_id, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // set special mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_role_list_select_menu').mockImplementationOnce((custom_id, placeholder, guild) => {
            return {};
        });
        let result = yield controller.regist_server_master(interaction, false);
        expect(result).toEqual(expected);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", false],
    ])("test for regist_server_master error, (%s, %s, %s) -> %s", (custom_id, guild_id, user_id, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // hack mock
        interaction.guild = undefined;
        // set special mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_role_list_select_menu').mockImplementationOnce((custom_id, placeholder, guild) => {
            return {};
        });
        const result = yield controller.regist_server_master(interaction, false);
        expect(result).toEqual(expected);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", false],
    ])("test for regist_server_master error (%s, %s, %s) -> %s", (custom_id, guild_id, user_id, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // set special mock
        jest.spyOn(discord_common_1.DiscordCommon, 'get_role_list_select_menu').mockImplementationOnce((custom_id, placeholder, guild) => {
            return {};
        });
        let result = yield controller.regist_server_master(interaction);
        expect(result).toEqual(expected);
    }));
});
//# sourceMappingURL=controller.command_server_controller.test.js.map