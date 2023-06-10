import { TestDiscordMock } from "../common/test_discord_mock";

import { TestEntity } from '../common/test_entity';
import { DiscordCommon } from "../../logic/discord_common";
import { ModalSubmitGameMasterController } from "../../controller/modal_submit_game_master_controller";
import { GameMasterRepository } from "../../db/game_master";

const controller = new ModalSubmitGameMasterController();

describe('regist', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [
            "DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_custom_id", "test_server_id", "test_user_id", "test_input_precense_name",
            true, true, 1, 0, true
        ],
        [
            "DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_custom_id", "test_server_id", "test_user_id", "test_input_precense_name",
            true, false, 0, 1, true
        ],
        [
            "DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_custom_id", "test_server_id", "test_user_id", "test_input_precense_name",
            true, true, 0, 0, false
        ],
        [
            "DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_custom_id", "test_server_id", "test_user_id", "",
            true, true, 1, 0, true
        ],
        [
            "DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_custom_id", "test_server_id", "test_user_id", "test_input_precense_name",
            false, true, 1, 0, false
        ],
    ])("test for regist, (%s, %s, %s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, input_value: any,
        privilegge_result: boolean, is_game_master_insert: boolean,
        ins_count: number, upd_count: number,
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        jest.spyOn(DiscordCommon, 'check_privillege')
            .mockImplementationOnce(() => { return privilegge_result; });
        jest.spyOn(DiscordCommon, 'get_game_master_from_list')
            .mockImplementationOnce(() => { return TestEntity.get_test_game_master_info(); });

        if (is_game_master_insert) {
            jest.spyOn(GameMasterRepository.prototype, 'get_m_game_master')
                .mockImplementationOnce(async () => { throw `exception!` });
        } else {
            jest.spyOn(GameMasterRepository.prototype, 'get_m_game_master')
                .mockImplementationOnce(async () => { return TestEntity.get_test_game_master_info(); });
        }

        jest.spyOn(GameMasterRepository.prototype, 'insert_m_game_master')
            .mockImplementationOnce(async () => { return ins_count; });
        jest.spyOn(GameMasterRepository.prototype, 'update_m_game_master')
            .mockImplementationOnce(async () => { return upd_count; });

        jest.spyOn(DiscordCommon, 'get_game_master_from_guild')
            .mockImplementationOnce(() => { return [] });

        // expect
        let result = await controller.regist(interaction, false);
        expect(result).toEqual(expected);
    });
});