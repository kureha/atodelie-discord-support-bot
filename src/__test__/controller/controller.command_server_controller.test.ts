import { TestDiscordMock } from "../common/test_discord_mock";

// import discord modules
import * as Discord from 'discord.js';

// setup discord common mock
import { DiscordCommon } from '../../logic/discord_common';
import { CommandServerController } from "../../controller/command_server_controller";

const controller = new CommandServerController();

describe('regist_server_master', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", true],
    ])("test for regist_server_master, (%s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // set special mock
        jest.spyOn(DiscordCommon, 'get_role_list_select_menu').mockImplementationOnce((custom_id: string, placeholder: string, guild: Discord.Guild): any => {
            return {};
        });

        let result = await controller.regist_server_master(interaction, false);
        expect(result).toEqual(expected);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", false],
    ])("test for regist_server_master error, (%s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // hack mock
        interaction.guild = undefined;

        // set special mock
        jest.spyOn(DiscordCommon, 'get_role_list_select_menu').mockImplementationOnce((custom_id: string, placeholder: string, guild: Discord.Guild): any => {
            return {};
        });

        const result = await controller.regist_server_master(interaction, false);
        expect(result).toEqual(expected);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", false],
    ])("test for regist_server_master error (%s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // set special mock
        jest.spyOn(DiscordCommon, 'get_role_list_select_menu').mockImplementationOnce((custom_id: string, placeholder: string, guild: Discord.Guild): any => {
            return {};
        });

        let result = await controller.regist_server_master(interaction);
        expect(result).toEqual(expected);
    });
});