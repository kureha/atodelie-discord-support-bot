import { TestDiscordMock } from "../common/test_discord_mock";

// import discord modules
import * as Discord from 'discord.js';

import { DiscordCommon } from "../../logic/discord_common";
import { TestEntity } from "../common/test_entity";
import { SelectInteractionGameMasterController } from "../../controller/select_interaction_game_master_controller";
import { GameMasterRepository } from "../../db/game_master";

const controller = new SelectInteractionGameMasterController();

describe('edit_game_master', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            true,
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            false,
            true
        ],
    ])("test for edit_game_master, (%s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, game_id: any,
        is_game_master_exists: boolean,
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();

        TestDiscordMock.embed_mock();
        TestDiscordMock.text_input_builder_mock();
        TestDiscordMock.modal_builder_mock();

        // set special mock
        jest.spyOn(DiscordCommon, 'get_interaction_value_by_idx')
            .mockImplementationOnce(() => { return game_id; });
        jest.spyOn(DiscordCommon, 'get_game_master_from_list')
            .mockImplementationOnce(() => { return TestEntity.get_test_game_master_info(); });
        jest.spyOn(DiscordCommon, 'get_text_input')
            .mockImplementation(() => { return { setValue: () => { } } as unknown as Discord.TextInputBuilder });
        jest.spyOn(DiscordCommon, 'get_game_master_from_guild')
            .mockImplementationOnce(() => { return []; });

        if (is_game_master_exists) {
            jest.spyOn(GameMasterRepository.prototype, 'get_m_game_master')
                .mockImplementationOnce(async () => { return TestEntity.get_test_game_master_info(); });
        } else {
            jest.spyOn(GameMasterRepository.prototype, 'get_m_game_master')
                .mockImplementationOnce(async () => { throw `exception!` });
        }

        // expect
        let result = await controller.edit_game_master(interaction, false);
        expect(result).toEqual(expected);
    });

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            true,
            false
        ],
    ])("test for edit_game_master for exception unprivillege access, (%s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, game_id: any,
        is_game_master_exists: boolean,
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();

        TestDiscordMock.embed_mock();
        TestDiscordMock.text_input_builder_mock();
        TestDiscordMock.modal_builder_mock();

        // expect
        let result = await controller.edit_game_master(interaction);
        expect(result).toEqual(expected);
    });

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            true,
            false
        ],
    ])("test for edit_game_master for exception, (%s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, game_id: any,
        is_game_master_exists: boolean,
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();

        TestDiscordMock.embed_mock();
        TestDiscordMock.text_input_builder_mock();
        TestDiscordMock.modal_builder_mock();

        interaction.guild = undefined;

        // expect
        let result = await controller.edit_game_master(interaction, false);
        expect(result).toEqual(expected);
    });
});

describe('reset_game_master', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            true,
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            false,
            false // if delete, no game master is ERROR
        ],
    ])("test for reset_game_master, (%s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, game_id: any,
        is_game_master_exists: boolean,
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();

        TestDiscordMock.embed_mock();
        TestDiscordMock.text_input_builder_mock();
        TestDiscordMock.modal_builder_mock();

        // set special mock
        jest.spyOn(DiscordCommon, 'get_interaction_value_by_idx')
            .mockImplementationOnce(() => { return game_id; });
        jest.spyOn(DiscordCommon, 'get_game_master_from_list')
            .mockImplementationOnce(() => { return TestEntity.get_test_game_master_info(); });
        jest.spyOn(DiscordCommon, 'get_text_input')
            .mockImplementation(() => { return { setValue: () => { } } as unknown as Discord.TextInputBuilder });
        jest.spyOn(DiscordCommon, 'get_game_master_from_guild')
            .mockImplementationOnce(() => { return []; });

        if (is_game_master_exists) {
            jest.spyOn(GameMasterRepository.prototype, 'delete_m_game_master')
                .mockImplementationOnce(async () => { return 1; });
        } else {
            jest.spyOn(GameMasterRepository.prototype, 'delete_m_game_master')
                .mockImplementationOnce(async () => { return 0; });
        }

        // expect
        let result = await controller.reset_game_master(interaction, false);
        expect(result).toEqual(expected);
    });

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            true,
            false
        ],
    ])("test for reset_game_master for exception unprivillege access, (%s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, game_id: any,
        is_game_master_exists: boolean,
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();

        TestDiscordMock.embed_mock();
        TestDiscordMock.text_input_builder_mock();
        TestDiscordMock.modal_builder_mock();

        // expect
        let result = await controller.reset_game_master(interaction);
        expect(result).toEqual(expected);
    });

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            true,
            false
        ],
    ])("test for reset_game_master for exception, (%s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, game_id: any,
        is_game_master_exists: boolean,
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();

        TestDiscordMock.embed_mock();
        TestDiscordMock.text_input_builder_mock();
        TestDiscordMock.modal_builder_mock();

        interaction.guild = undefined;

        // expect
        let result = await controller.reset_game_master(interaction, false);
        expect(result).toEqual(expected);
    });
});
