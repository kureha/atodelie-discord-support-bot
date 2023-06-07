import { TestDiscordMock } from "../common/test_discord_mock";

// import discord modules
import * as Discord from 'discord.js';

import { SelectInteractionFriendCodeController } from "../../controller/select_interaction_friend_code_controller";
import { DiscordCommon } from "../../logic/discord_common";
import { GameMaster } from "../../entity/game_master";
import { TestEntity } from "../common/test_entity";
import { FriendCodeRepository } from "../../db/friend_code";
import { FriendCode } from "../../entity/friend_code";
import { FriendCodeHistoryRepository } from "../../db/friend_code_history";

describe('select menu search friend codetest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])("select menu friend code test (search ok). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();

        TestDiscordMock.embed_mock();

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
        jest.spyOn(FriendCodeRepository.prototype, 'get_t_friend_code_from_game_id').mockImplementationOnce((server_id: string, game_id: string): Promise<FriendCode[]> => {
            return new Promise<FriendCode[]>((resolve, reject) => {
                resolve([TestEntity.get_test_friend_code()]);
            });
        });

        // expect
        let result = await SelectInteractionFriendCodeController.search_friend_code(interaction);
        expect(result).toEqual(true);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])("select menu friend code test (search ng). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();

        TestDiscordMock.embed_mock();

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
        jest.spyOn(FriendCodeRepository.prototype, 'get_t_friend_code_from_game_id').mockImplementationOnce((server_id: string, game_id: string): Promise<FriendCode[]> => {
            return new Promise<FriendCode[]>((resolve, reject) => {
                resolve([]);
            });
        });

        // expect
        let result = await SelectInteractionFriendCodeController.search_friend_code(interaction);
        expect(result).toEqual(false);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])("select menu friend code error test (search). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();

        // hack mock
        interaction.guild = undefined;

        // expect
        expect.assertions(1);

        try {
            await SelectInteractionFriendCodeController.search_friend_code(interaction);
        } catch (e) {
            expect(e).toContain(`Discord interaction guild is undefined.`);
        }
    });
});

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
        jest.spyOn(FriendCodeRepository.prototype, 'get_t_friend_code').mockImplementationOnce((server_id: string, game_id: string): Promise<FriendCode[]> => {
            return new Promise<FriendCode[]>((resolve, reject) => {
                resolve([TestEntity.get_test_friend_code()]);
            });
        });

        // expect
        let result = await SelectInteractionFriendCodeController.regist_friend_code(interaction);
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
        expect.assertions(1);
        try {
            await SelectInteractionFriendCodeController.regist_friend_code(interaction);
        } catch (e) {
            expect(e).toContain(`Discord interaction guild is undefined.`);
        }
    });
});

describe('select menu delete friend codetest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_game_id"],
    ])("select menu friend code test (delete ok). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();

        TestDiscordMock.embed_mock();

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

        jest.spyOn(FriendCodeRepository.prototype, 'get_t_friend_code').mockImplementationOnce((server_id: string, game_id: string): Promise<FriendCode[]> => {
            return new Promise<FriendCode[]>((resolve, reject) => {
                resolve([TestEntity.get_test_friend_code()]);
            });
        });
        jest.spyOn(FriendCodeRepository.prototype, 'delete_t_friend_code').mockImplementationOnce((server_id: string, user_id: string, game_id: string): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(FriendCodeHistoryRepository.prototype, 'insert_t_friend_code').mockImplementation((fc: FriendCode): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });

        // expect
        let result = await SelectInteractionFriendCodeController.delete_friend_code(interaction);
        expect(result).toEqual(true);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_game_id"],
    ])("select menu friend code test (delete ng). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();

        TestDiscordMock.embed_mock();

        // set special mock
        jest.spyOn(DiscordCommon, 'get_interaction_value_by_idx').mockImplementationOnce((list: string[], idx: number): string => {
            return 'test_game_id_notfound';
        });
        jest.spyOn(DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id: string, game_master_list: GameMaster[]): GameMaster => {
            return TestEntity.get_test_game_master_info();
        });
        jest.spyOn(DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild: Discord.Guild | null | undefined, ignore_role_name_list: string[]): GameMaster[] => {
            return [TestEntity.get_test_game_master_info()];
        });

        jest.spyOn(FriendCodeRepository.prototype, 'get_t_friend_code').mockImplementationOnce((server_id: string, game_id: string): Promise<FriendCode[]> => {
            return new Promise<FriendCode[]>((resolve, reject) => {
                resolve([TestEntity.get_test_friend_code()]);
            });
        });
        jest.spyOn(FriendCodeRepository.prototype, 'delete_t_friend_code').mockImplementationOnce((server_id: string, user_id: string, game_id: string): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(FriendCodeHistoryRepository.prototype, 'insert_t_friend_code').mockImplementation((fc: FriendCode): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });

        // expect
        let result = await SelectInteractionFriendCodeController.delete_friend_code(interaction);
        expect(result).toEqual(false);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_game_id"],
    ])("select menu friend code test (delete ng). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();

        TestDiscordMock.embed_mock();

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
        jest.spyOn(FriendCodeRepository.prototype, 'get_t_friend_code').mockImplementationOnce((server_id: string, game_id: string): Promise<FriendCode[]> => {
            return new Promise<FriendCode[]>((resolve, reject) => {
                resolve([]);
            });
        });

        // expect
        let result = await SelectInteractionFriendCodeController.delete_friend_code(interaction);
        expect(result).toEqual(false);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_game_id"],
    ])("select menu friend code error test (delete). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();

        // hack mock
        interaction.guild = undefined;

        // expect
        expect.assertions(1);
        try {
            await SelectInteractionFriendCodeController.delete_friend_code(interaction);
        } catch (e) {
            expect(e).toContain(`Discord interaction guild is undefined.`);
        }
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_game_id"],
    ])("select menu friend code error test (exception for delete record). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [input_value]);
        const interaction = new Mock();

        TestDiscordMock.embed_mock();

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

        jest.spyOn(FriendCodeRepository.prototype, 'get_t_friend_code').mockImplementationOnce((server_id: string, game_id: string): Promise<FriendCode[]> => {
            return new Promise<FriendCode[]>((resolve, reject) => {
                resolve([TestEntity.get_test_friend_code()]);
            });
        });
        jest.spyOn(FriendCodeRepository.prototype, 'delete_t_friend_code').mockImplementationOnce((server_id: string, user_id: string, game_id: string): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(0); });
        });
        jest.spyOn(FriendCodeHistoryRepository.prototype, 'insert_t_friend_code').mockImplementation((fc: FriendCode): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });

        // expect
        expect.assertions(1);
        try {
            await SelectInteractionFriendCodeController.delete_friend_code(interaction);
        } catch (e) {
            expect(e).toContain(`data is not affected.`);
        }
    });
});