import { TestDiscordMock } from "../common/test_discord_mock";

// import discord modules
import * as Discord from 'discord.js';

import { SelectInteractionServerController } from "../../controller/select_interaction_server_controller";
import { DiscordCommon } from "../../logic/discord_common";
import { GameMaster } from "../../entity/game_master";
import { TestEntity } from "../common/test_entity";
import { ServerInfoRepository } from "../../db/server_info";
import { ServerInfo } from "../../entity/server_info";

const controller = new SelectInteractionServerController();

describe('select menu server regist master codetest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_role_id"],
    ])("select menu server regist master test (regist ok). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: string) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();

        // set special mock
        jest.spyOn(DiscordCommon, 'get_interaction_value_by_idx').mockImplementationOnce((list: string[], idx: number): string => {
            return input_value;
        });
        jest.spyOn(DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id: string, game_master_list: GameMaster[]): GameMaster => {
            return TestEntity.get_test_game_master_info();
        });
        jest.spyOn(DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild: Discord.Guild | null | undefined, ignore_role_name_list: string[]): GameMaster[] => {
            return [TestEntity.get_test_game_master_info()];
        });

        jest.spyOn(ServerInfoRepository.prototype, 'insert_m_server_info').mockImplementationOnce((v: ServerInfo): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(ServerInfoRepository.prototype, 'update_m_server_info').mockImplementationOnce((v: ServerInfo): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info').mockImplementationOnce((v: string): Promise<ServerInfo> => {
            return new Promise<ServerInfo>((resolve, reject) => {
                resolve(TestEntity.get_test_server_info());
            });
        });

        // expect
        let result = await controller.regist_server_master(interaction, false);
        expect(result).toEqual(true);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_role_id"],
    ])("select menu server regist master test (regist ng). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: string) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, []);
        const interaction = new Mock();

        // set special mock
        jest.spyOn(DiscordCommon, 'get_interaction_value_by_idx').mockImplementationOnce((list: string[], idx: number): string => {
            return 'test_role_id_undefined';
        });
        jest.spyOn(DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id: string, game_master_list: GameMaster[]): GameMaster => {
            return TestEntity.get_test_game_master_info();
        });
        jest.spyOn(DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild: Discord.Guild | null | undefined, ignore_role_name_list: string[]): GameMaster[] => {
            return [TestEntity.get_test_game_master_info()];
        });

        jest.spyOn(ServerInfoRepository.prototype, 'insert_m_server_info').mockImplementationOnce((v: ServerInfo): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(ServerInfoRepository.prototype, 'update_m_server_info').mockImplementationOnce((v: ServerInfo): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info').mockImplementationOnce((v: string): Promise<ServerInfo> => {
            return new Promise<ServerInfo>((resolve, reject) => {
                resolve(TestEntity.get_test_server_info());
            });
        });

        // expect
        let result = await controller.regist_server_master(interaction, false);
        expect(result).toEqual(false);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_role_id"],
    ])("select menu server regist master error test (falls privileges). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: string) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();

        // expect
        let result = await controller.regist_server_master(interaction);
        expect(result).toEqual(false);
    });
});