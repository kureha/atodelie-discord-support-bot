import { TestDiscordMock } from "../common/test_discord_mock";

import { SelectInteractionServerController } from "../../controller/select_interaction_server_controller";
import { TestEntity } from "../common/test_entity";
import { ServerInfoRepository } from "../../db/server_info";

const controller = new SelectInteractionServerController();

describe('regist_server_master', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", ["test_role_id"],
            true,
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", ["test_role_id"],
            false,
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", [undefined as unknown as string],
            false,
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", [],
            true,
            false
        ],
    ])("test for regist_server_master, (%s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, interaction_value_arr: string[],
        is_insert_successed: boolean,
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, interaction_value_arr);
        const interaction = new Mock();

        if (is_insert_successed) {
            jest.spyOn(ServerInfoRepository.prototype, 'insert_m_server_info')
                .mockImplementationOnce(async () => { return 1; });
            jest.spyOn(ServerInfoRepository.prototype, 'update_m_server_info')
                .mockImplementationOnce(async () => { throw `exception!` });
        } else {
            jest.spyOn(ServerInfoRepository.prototype, 'insert_m_server_info')
                .mockImplementationOnce(async () => { throw `exception!` });
            jest.spyOn(ServerInfoRepository.prototype, 'update_m_server_info')
                .mockImplementationOnce(async () => { return 1 });
        }
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info')
            .mockImplementationOnce(async () => { return TestEntity.get_test_server_info(); });

        // expect
        let result = await controller.regist_server_master(interaction, false);
        expect(result).toEqual(expected);
    });

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", ["test_role_id"],
            true,
            false
        ],
    ])("test for regist_server_master for exception unprivillege access, (%s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, interaction_value_arr: string[],
        is_insert_successed: boolean,
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, interaction_value_arr);
        const interaction = new Mock();

        // expect
        let result = await controller.regist_server_master(interaction);
        expect(result).toEqual(expected);
    });

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", ["test_role_id"],
            true,
            false
        ],
    ])("test for regist_server_master for exception, (%s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, interaction_value_arr: string[],
        is_insert_successed: boolean,
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, interaction_value_arr);
        const interaction = new Mock();
        interaction.guild = undefined;

        // expect
        let result = await controller.regist_server_master(interaction, false);
        expect(result).toEqual(expected);
    });
});