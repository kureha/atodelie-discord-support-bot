import { TestDiscordMock } from "../common/test_discord_mock";

import { CommandFriendCodeController } from "../../controller/command_friend_code_controller";

// import discord modules
import * as Discord from 'discord.js';

// setup discord common mock
import { DiscordCommon } from '../../logic/discord_common';
import { GameMaster } from "../../entity/game_master";

// import test entity
import { TestEntity } from '../common/test_entity';

const controller = new CommandFriendCodeController();

function get_discord_common_mock() {
    const get_game_master_from_guild = jest.spyOn(DiscordCommon, 'get_game_master_from_guild');
    get_game_master_from_guild.mockImplementationOnce((guild: Discord.Guild | null | undefined, ignore_role_name_list: string[]): GameMaster[] => {
        return [TestEntity.get_test_game_master_info()];
    });

    const get_game_master_list_select_menu = jest.spyOn(DiscordCommon, 'get_game_master_list_select_menu');
    get_game_master_list_select_menu.mockImplementationOnce((custom_id: string, game_master_list: GameMaster[], split_length: number): Discord.ActionRowBuilder<Discord.StringSelectMenuBuilder>[] => {
        return [];
    });
}

describe('search_friend_code', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", true],
    ])("test for search_friend_code, (%s, %s , %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // setup extra mock
        get_discord_common_mock();

        let result = await controller.search_friend_code(interaction);
        expect(result).toEqual(expected);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", false],
    ])("test for search_friend_code exception, (%s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // hack mock
        interaction.guild = undefined;

        // setup extra mock
        get_discord_common_mock();

        const result = await controller.search_friend_code(interaction);
        expect(result).toEqual(expected);
    });
});

describe('regist_friend_code', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", true],
    ])("test for regist_friend_code, (%s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // setup extra mock
        get_discord_common_mock();

        let result = await controller.regist_friend_code(interaction);
        expect(result).toEqual(expected);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", false],
    ])("test for regist_friend_code exception (%s, %s %s)", async (
        custom_id: any, guild_id: any, user_id: any, expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // hack mock
        interaction.guild = undefined;

        // setup extra mock
        get_discord_common_mock();

        const result = await controller.regist_friend_code(interaction);
        expect(result).toEqual(expected);
    });
});

describe('delete_friend_code', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", true],
    ])("test for delete_friend_code, (%s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // setup extra mock
        get_discord_common_mock();

        let result = await controller.delete_friend_code(interaction);
        expect(result).toEqual(expected);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", false],
    ])("test for delete_friend_code error, (%s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // hack mock
        interaction.guild = undefined;

        // setup extra mock
        get_discord_common_mock();

        const result = await controller.delete_friend_code(interaction);
        expect(result).toEqual(expected);
    });
});