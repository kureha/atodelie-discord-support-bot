import { TestDiscordMock } from "../common/test_discord_mock";

import { CommandExportController } from "../../controller/command_export_controller"
import { UserInfo } from "../../entity/user_info";

// import test entity
import { TestEntity } from "../common/test_entity";

// setup export user info mock
import { ExportUserInfo } from "../../logic/export_user_info";

jest.mock("../../logic/export_user_info");
const ExportUserInfoMock = ExportUserInfo as jest.Mock;

const controller = new CommandExportController();

/**
 * export user info mock
 * @param data_list 
 */
function get_export_user_info_mock(data_list: UserInfo[]) {
    ExportUserInfoMock.mockReset();
    ExportUserInfoMock.mockImplementationOnce(() => {
        return {
            parse_user_info: (): UserInfo[] => {
                return data_list;
            },
            get_output_string: (user_info_list: UserInfo[]): string => {
                // nothing to do
                return "output_string";
            },
            export_to_file(file_path: string, buf: string) {
                // nothing to do
            },
        }
    });
}

describe('export_user_info', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id",
            -1,
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id",
            1,
            true
        ],
    ])("test for export_user_info, (%s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any,
        member_limit: number,
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // get export user info mock
        get_export_user_info_mock(
            [
                TestEntity.get_test_user_info(1, 5),
                TestEntity.get_test_user_info(2, 10),
                TestEntity.get_test_user_info(3, 2),
            ]
        );

        // expect
        await expect(controller.export_user_info(interaction, false, member_limit)).resolves.toEqual(expected);
        await expect(controller.export_user_info(interaction)).resolves.toEqual(false);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", false],
    ])("test for export_user_info blank, (%s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // mock hacked - guild is undefined
        interaction.guild = undefined;

        // get export user info mock
        get_export_user_info_mock([]);

        // expect
        const result = await controller.export_user_info(interaction);
        expect(result).toEqual(expected);
    });
});