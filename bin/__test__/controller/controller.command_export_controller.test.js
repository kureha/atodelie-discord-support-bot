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
const command_export_controller_1 = require("../../controller/command_export_controller");
// import test entity
const test_entity_1 = require("../common/test_entity");
// setup export user info mock
const export_user_info_1 = require("../../logic/export_user_info");
jest.mock("../../logic/export_user_info");
const ExportUserInfoMock = export_user_info_1.ExportUserInfo;
const controller = new command_export_controller_1.CommandExportController();
/**
 * export user info mock
 * @param data_list
 */
function get_export_user_info_mock(data_list) {
    ExportUserInfoMock.mockReset();
    ExportUserInfoMock.mockImplementationOnce(() => {
        return {
            parse_user_info: () => {
                return data_list;
            },
            get_output_string: (user_info_list) => {
                // nothing to do
                return "output_string";
            },
            export_to_file(file_path, buf) {
                // nothing to do
            },
        };
    });
}
describe('export user infotest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("export user info test. (%s, %s %s)", (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // get export user info mock
        get_export_user_info_mock([
            test_entity_1.TestEntity.get_test_user_info(1, 5),
            test_entity_1.TestEntity.get_test_user_info(2, 10),
            test_entity_1.TestEntity.get_test_user_info(3, 2),
        ]);
        // expect
        yield expect(controller.export_user_info(interaction, false)).resolves.toEqual(true);
        yield expect(controller.export_user_info(interaction)).resolves.toEqual(false);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("export user info error test. (%s, %s %s)", (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // mock hacked - guild is undefined
        interaction.guild = undefined;
        // get export user info mock
        get_export_user_info_mock([]);
        // expect
        const result = yield controller.export_user_info(interaction);
        expect(result).toEqual(false);
    }));
});
//# sourceMappingURL=controller.command_export_controller.test.js.map