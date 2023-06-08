import { TestDiscordMock } from "../common/test_discord_mock";

// import discord modules
import * as Discord from 'discord.js';

import { ModalSubmitFriendCodeController } from '../../controller/modal_submit_friend_code_controller';

import { TestEntity } from '../common/test_entity';
import { FriendCodeRepository } from '../../db/friend_code';
import { FriendCode } from '../../entity/friend_code';
import { FriendCodeHistoryRepository } from '../../db/friend_code_history';
import { DiscordCommon } from "../../logic/discord_common";
import { GameMaster } from "../../entity/game_master";

const controller = new ModalSubmitFriendCodeController();

describe('modal submit friend codetest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE-test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])("modal submit friend code test (insert). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        // set extra mock
        jest.spyOn(FriendCodeRepository.prototype, 'get_t_friend_code').mockImplementationOnce((server_id: string, user_id: string): Promise<FriendCode[]> => {
            return new Promise<FriendCode[]>((resolve, reject) => {
                resolve([TestEntity.get_test_friend_code()]);
            });
        });

        jest.spyOn(FriendCodeRepository.prototype, 'insert_t_friend_code').mockImplementationOnce((data: FriendCode): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(FriendCodeRepository.prototype, 'update_t_friend_code').mockImplementationOnce((data: FriendCode): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(0); });
        });
        jest.spyOn(FriendCodeHistoryRepository.prototype, 'insert_t_friend_code').mockImplementationOnce((data: FriendCode): Promise<number> => {
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
        let result = await controller.regist(interaction);
        expect(result).toEqual(true);
    });

    test.each([
        ["DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE-test_game_id", "test_server_id", "test_user_id", "test_input_friend_code"],
        ["test_game_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])("modal submit friend code test (update). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        // set extra mock
        jest.spyOn(FriendCodeRepository.prototype, 'get_t_friend_code').mockImplementationOnce((server_id: string, user_id: string): Promise<FriendCode[]> => {
            return new Promise<FriendCode[]>((resolve, reject) => {
                resolve([TestEntity.get_test_friend_code()]);
            });
        });

        jest.spyOn(FriendCodeRepository.prototype, 'insert_t_friend_code').mockImplementationOnce((data: FriendCode): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(0); });
        });
        jest.spyOn(FriendCodeRepository.prototype, 'update_t_friend_code').mockImplementationOnce((data: FriendCode): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(FriendCodeHistoryRepository.prototype, 'insert_t_friend_code').mockImplementationOnce((data: FriendCode): Promise<number> => {
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
        let result = await controller.regist(interaction);
        expect(result).toEqual(true);
    });


    test.each([
        ["DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE-test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])("modal submit friend code error test (insert). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        // set extra mock
        jest.spyOn(FriendCodeRepository.prototype, 'get_t_friend_code').mockImplementationOnce((server_id: string, user_id: string): Promise<FriendCode[]> => {
            return new Promise<FriendCode[]>((resolve, reject) => {
                resolve([TestEntity.get_test_friend_code()]);
            });
        });

        jest.spyOn(FriendCodeRepository.prototype, 'insert_t_friend_code').mockImplementationOnce((data: FriendCode): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(0); });
        });
        jest.spyOn(FriendCodeRepository.prototype, 'update_t_friend_code').mockImplementationOnce((data: FriendCode): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(FriendCodeHistoryRepository.prototype, 'insert_t_friend_code').mockImplementationOnce((data: FriendCode): Promise<number> => {
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
        const result = await controller.regist(interaction);
        expect(result).toEqual(false);
    });

    test.each([
        ["DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE-test_game_id", "test_server_id", "test_user_id", "test_input_friend_code"],
        ["test_game_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])("modal submit friend code error test (update). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        // set extra mock
        jest.spyOn(FriendCodeRepository.prototype, 'get_t_friend_code').mockImplementationOnce((server_id: string, user_id: string): Promise<FriendCode[]> => {
            return new Promise<FriendCode[]>((resolve, reject) => {
                resolve([TestEntity.get_test_friend_code()]);
            });
        });

        jest.spyOn(FriendCodeRepository.prototype, 'insert_t_friend_code').mockImplementationOnce((data: FriendCode): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(FriendCodeRepository.prototype, 'update_t_friend_code').mockImplementationOnce((data: FriendCode): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(0); });
        });
        jest.spyOn(FriendCodeHistoryRepository.prototype, 'insert_t_friend_code').mockImplementationOnce((data: FriendCode): Promise<number> => {
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
        const result = await controller.regist(interaction);
        expect(result).toEqual(false);
    });

    test.each([
        ["DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE-test_game_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])("modal submit friend code exception test. (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        // set extra mock
        jest.spyOn(FriendCodeRepository.prototype, 'get_t_friend_code').mockImplementationOnce((server_id: string, user_id: string): Promise<FriendCode[]> => {
            return new Promise<FriendCode[]>((resolve, reject) => {
                resolve([TestEntity.get_test_friend_code()]);
            });
        });

        jest.spyOn(FriendCodeRepository.prototype, 'insert_t_friend_code').mockImplementationOnce((data: FriendCode): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(FriendCodeRepository.prototype, 'update_t_friend_code').mockImplementationOnce((data: FriendCode): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(0); });
        });
        jest.spyOn(FriendCodeHistoryRepository.prototype, 'insert_t_friend_code').mockImplementationOnce((data: FriendCode): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });

        // no mock for discord common - for system exception
        // expect
        const result = await controller.regist(interaction);
        expect(result).toEqual(false);
    });
});