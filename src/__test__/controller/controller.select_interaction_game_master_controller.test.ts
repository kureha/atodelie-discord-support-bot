import { TestDiscordMock } from "../common/test_discord_mock";

// import discord modules
import * as Discord from 'discord.js';

import { DiscordCommon } from "../../logic/discord_common";
import { GameMaster } from "../../entity/game_master";
import { TestEntity } from "../common/test_entity";
import { SelectInteractionGameMasterController } from "../../controller/select_interaction_game_master_controller";
import { GameMasterRepository } from "../../db/game_master";

const controller = new SelectInteractionGameMasterController();

describe('select menu regist friend codetest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_game_id"],
    ])("select menu friend code test (regist open). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();

        TestDiscordMock.embed_mock();
        TestDiscordMock.text_input_builder_mock();
        TestDiscordMock.modal_builder_mock();

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
        jest.spyOn(GameMasterRepository.prototype, 'get_m_game_master').mockImplementationOnce((server_id: string, game_id: string): Promise<GameMaster> => {
            return new Promise<GameMaster>((resolve, reject) => {
                resolve(TestEntity.get_test_game_master_info());
            });
        });

        // expect
        let result = await controller.edit_game_master(interaction, false);
        expect(result).toEqual(true);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_game_id"],
    ])("select menu friend code test blank (regist open). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();

        TestDiscordMock.embed_mock();
        TestDiscordMock.text_input_builder_mock();
        TestDiscordMock.modal_builder_mock();

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
        jest.spyOn(GameMasterRepository.prototype, 'get_m_game_master').mockImplementationOnce((server_id: string, game_id: string): Promise<GameMaster> => {
            return new Promise<GameMaster>((resolve, reject) => {
                // not found record
                reject();
            });
        });

        // expect
        let result = await controller.edit_game_master(interaction, false);
        expect(result).toEqual(true);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_game_id"],
    ])("select menu friend code error test (regist open). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();

        // hack mock
        interaction.guild = undefined;

        // expect
        const result = await controller.edit_game_master(interaction, false);
        expect(result).toEqual(false);
    });
});
