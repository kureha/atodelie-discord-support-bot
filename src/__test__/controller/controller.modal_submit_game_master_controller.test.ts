import { TestDiscordMock } from "../common/test_discord_mock";

// import discord modules
import * as Discord from 'discord.js';

import { TestEntity } from '../common/test_entity';
import { DiscordCommon } from "../../logic/discord_common";
import { GameMaster } from "../../entity/game_master";
import { ModalSubmitGameMasterController } from "../../controller/modal_submit_game_master_controller";
import { GameMasterRepository } from "../../db/game_master";

const controller = new ModalSubmitGameMasterController();

describe('modal submit game master test.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_custom_id", "test_server_id", "test_user_id", "test_input_precense_name"],
    ])("modal submit game master test (insert). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        // set extra mock
        jest.spyOn(GameMasterRepository.prototype, 'get_m_game_master').mockImplementationOnce((server_id: string, user_id: string): Promise<GameMaster> => {
            return new Promise<GameMaster>((resolve, reject) => {
                reject();
            });
        });

        jest.spyOn(GameMasterRepository.prototype, 'insert_m_game_master').mockImplementationOnce((data: GameMaster): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(GameMasterRepository.prototype, 'update_m_game_master').mockImplementationOnce((data: GameMaster): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(0); });
        });

        // set discord common mock
        jest.spyOn(DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild: Discord.Guild | null | undefined, ignore_role_name_list: string[]): GameMaster[] => {
            return [TestEntity.get_test_game_master_info()];
        });
        jest.spyOn(DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id: string, game_master_list: GameMaster[]): GameMaster => {
            return TestEntity.get_test_game_master_info();
        });

        // expect
        let result = await controller.regist(interaction, false);
        expect(result).toEqual(true);
    });

    test.each([
        ["DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_game_id", "test_server_id", "test_user_id", "test_input_precense_name"],
        ["test_game_id", "test_server_id", "test_user_id", "test_input_precense_name"],
    ])("modal submit game master test (update). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        // set extra mock
        jest.spyOn(GameMasterRepository.prototype, 'get_m_game_master').mockImplementationOnce((server_id: string, user_id: string): Promise<GameMaster> => {
            return new Promise<GameMaster>((resolve, reject) => {
                resolve(TestEntity.get_test_game_master_info());
            });
        });

        jest.spyOn(GameMasterRepository.prototype, 'insert_m_game_master').mockImplementationOnce((data: GameMaster): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(0); });
        });
        jest.spyOn(GameMasterRepository.prototype, 'update_m_game_master').mockImplementationOnce((data: GameMaster): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });

        // set discord common mock
        jest.spyOn(DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild: Discord.Guild | null | undefined, ignore_role_name_list: string[]): GameMaster[] => {
            return [TestEntity.get_test_game_master_info()];
        });
        jest.spyOn(DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id: string, game_master_list: GameMaster[]): GameMaster => {
            return TestEntity.get_test_game_master_info();
        });

        // expect
        let result = await controller.regist(interaction, false);
        expect(result).toEqual(true);
    });

    test.each([
        ["DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_custom_id", "test_server_id", "test_user_id", "test_input_precense_name"],
    ])("modal submit game master error test (insert). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        // set extra mock
        jest.spyOn(GameMasterRepository.prototype, 'get_m_game_master').mockImplementationOnce((server_id: string, user_id: string): Promise<GameMaster> => {
            return new Promise<GameMaster>((resolve, reject) => {
                reject();
            });
        });

        jest.spyOn(GameMasterRepository.prototype, 'insert_m_game_master').mockImplementationOnce((data: GameMaster): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(0); });
        });
        jest.spyOn(GameMasterRepository.prototype, 'update_m_game_master').mockImplementationOnce((data: GameMaster): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });

        // set discord common mock
        jest.spyOn(DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild: Discord.Guild | null | undefined, ignore_role_name_list: string[]): GameMaster[] => {
            return [TestEntity.get_test_game_master_info()];
        });
        jest.spyOn(DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id: string, game_master_list: GameMaster[]): GameMaster => {
            return TestEntity.get_test_game_master_info();
        });

        // expect
        const result = await controller.regist(interaction, false);
        expect(result).toEqual(false);
    });

    test.each([
        ["DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_game_id", "test_server_id", "test_user_id", "test_input_precense_name"],
        ["test_game_id", "test_server_id", "test_user_id", "test_input_precense_name"],
    ])("modal submit game master error test (update). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        // set extra mock
        jest.spyOn(GameMasterRepository.prototype, 'get_m_game_master').mockImplementationOnce((server_id: string, user_id: string): Promise<GameMaster> => {
            return new Promise<GameMaster>((resolve, reject) => {
                resolve(TestEntity.get_test_game_master_info());
            });
        });

        jest.spyOn(GameMasterRepository.prototype, 'insert_m_game_master').mockImplementationOnce((data: GameMaster): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(GameMasterRepository.prototype, 'update_m_game_master').mockImplementationOnce((data: GameMaster): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(0); });
        });

        // set discord common mock
        jest.spyOn(DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild: Discord.Guild | null | undefined, ignore_role_name_list: string[]): GameMaster[] => {
            return [TestEntity.get_test_game_master_info()];
        });
        jest.spyOn(DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id: string, game_master_list: GameMaster[]): GameMaster => {
            return TestEntity.get_test_game_master_info();
        });

        // expect
        const result = await controller.regist(interaction, false);
        expect(result).toEqual(false);
    });

    test.each([
        ["DISCORD_MODAL_CUSTOM_ID_REGIST_GAME_MASTER-test_game_id", "test_server_id", "test_user_id", "test_input_precense_name"],
    ])("modal submit game master exception test. (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        // set extra mock
        jest.spyOn(GameMasterRepository.prototype, 'get_m_game_master').mockImplementationOnce((server_id: string, user_id: string): Promise<GameMaster> => {
            return new Promise<GameMaster>((resolve, reject) => {
                resolve(TestEntity.get_test_game_master_info());
            });
        });

        jest.spyOn(GameMasterRepository.prototype, 'insert_m_game_master').mockImplementationOnce((data: GameMaster): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(GameMasterRepository.prototype, 'update_m_game_master').mockImplementationOnce((data: GameMaster): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(0); });
        });

        // no mock for discord common - for system exception
        // expect
        const result = await controller.regist(interaction, false);
        expect(result).toEqual(false);
    });
});