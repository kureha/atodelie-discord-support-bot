import { TestDiscordMock } from "../common/test_discord_mock";

// import discord modules
import * as Discord from 'discord.js';

import { SelectInteractionFriendCodeController } from "../../controller/select_interaction_friend_code_controller";
import { DiscordCommon } from "../../logic/discord_common";
import { TestEntity } from "../common/test_entity";
import { FriendCodeRepository } from "../../db/friend_code";
import { FriendCode } from "../../entity/friend_code";
import { FriendCodeHistoryRepository } from "../../db/friend_code_history";

const controller = new SelectInteractionFriendCodeController();

describe('search_friend_code', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    function exclude_friend_code(v: FriendCode): FriendCode {
        v.friend_code = '';
        return v;
    }

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            [TestEntity.get_test_friend_code()], true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            [exclude_friend_code(TestEntity.get_test_friend_code())], false
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            [TestEntity.get_test_friend_code(), exclude_friend_code(TestEntity.get_test_friend_code())], true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            [], false
        ],
    ])("test for search_friend_code, (%s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, game_id: any,
        matched_friend_code_list: FriendCode[],
        expected: boolean) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        TestDiscordMock.embed_mock();

        jest.spyOn(DiscordCommon, 'get_interaction_value_by_idx')
            .mockImplementationOnce(() => { return game_id; });
        jest.spyOn(DiscordCommon, 'get_game_master_from_list')
            .mockImplementationOnce(() => { return TestEntity.get_test_game_master_info(); });
        jest.spyOn(DiscordCommon, 'get_game_master_from_guild')
            .mockImplementationOnce(() => { return []; });
        jest.spyOn(FriendCodeRepository.prototype, 'get_t_friend_code_from_game_id')
            .mockImplementationOnce(async () => { return matched_friend_code_list; });

        // expect
        let result = await controller.search_friend_code(interaction);
        expect(result).toEqual(expected);
    });

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            [TestEntity.get_test_friend_code()], false
        ],
    ])("test for search_friend_code exception, (%s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, game_id: any,
        matched_friend_code_list: FriendCode[],
        expected: boolean) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        TestDiscordMock.embed_mock();

        interaction.guild = undefined;

        // expect
        let result = await controller.search_friend_code(interaction);
        expect(result).toEqual(expected);
    });
});

describe('regist_friend_code', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            [TestEntity.get_test_friend_code()],
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            [],
            true
        ],
    ])("test for regist_friend_code, (%s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, game_id: any,
        matched_friend_code_list: FriendCode[],
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();

        TestDiscordMock.embed_mock();
        TestDiscordMock.text_input_builder_mock();
        TestDiscordMock.modal_builder_mock();

        jest.spyOn(DiscordCommon, 'get_interaction_value_by_idx')
            .mockImplementationOnce(() => { return game_id; });
        jest.spyOn(DiscordCommon, 'get_game_master_from_list')
            .mockImplementationOnce(() => { return TestEntity.get_test_game_master_info(); });
        jest.spyOn(DiscordCommon, 'get_game_master_from_guild')
            .mockImplementationOnce(() => { return []; });
        jest.spyOn(DiscordCommon, 'get_text_input')
            .mockImplementation(() => { return { setValue: () => { } } as unknown as Discord.TextInputBuilder });
        jest.spyOn(FriendCodeRepository.prototype, 'get_t_friend_code')
            .mockImplementationOnce(async () => { return matched_friend_code_list; });

        // expect
        let result = await controller.regist_friend_code(interaction);
        expect(result).toEqual(expected);
    });

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            [TestEntity.get_test_friend_code()],
            false
        ],
    ])("test for regist_friend_code exception, (%s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, game_id: any,
        matched_friend_code_list: FriendCode[],
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        interaction.guild = undefined;

        // expect
        let result = await controller.regist_friend_code(interaction);
        expect(result).toEqual(expected);
    });
});

describe('delete_friend_code', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            [TestEntity.get_test_friend_code()], true,
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            [TestEntity.get_test_friend_code()], false,
            false
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            [], true,
            false
        ],
    ])("test for delete_friend_code, (%s, %s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, game_id: any,
        matched_friend_code_list: FriendCode[], is_delete_successed: boolean,
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        TestDiscordMock.embed_mock();

        jest.spyOn(DiscordCommon, 'get_interaction_value_by_idx')
            .mockImplementationOnce(() => { return game_id; });
        jest.spyOn(DiscordCommon, 'get_game_master_from_list')
            .mockImplementationOnce(() => { return TestEntity.get_test_game_master_info(); });
        jest.spyOn(DiscordCommon, 'get_game_master_from_guild')
            .mockImplementationOnce(() => { return []; });
        jest.spyOn(FriendCodeRepository.prototype, 'get_t_friend_code')
            .mockImplementationOnce(async () => { return matched_friend_code_list; });
        if (is_delete_successed) {
            jest.spyOn(FriendCodeRepository.prototype, 'delete_t_friend_code')
                .mockImplementationOnce(async () => { return 1; });
            jest.spyOn(FriendCodeHistoryRepository.prototype, 'insert_t_friend_code')
                .mockImplementationOnce(async () => { return 1; });
        } else {
            jest.spyOn(FriendCodeRepository.prototype, 'delete_t_friend_code')
                .mockImplementationOnce(async () => { return 0; });
            jest.spyOn(FriendCodeHistoryRepository.prototype, 'insert_t_friend_code')
                .mockImplementationOnce(async () => { return 0; });
        }

        // expect
        let result = await controller.delete_friend_code(interaction);
        expect(result).toEqual(expected);
    });

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_game_id",
            [TestEntity.get_test_friend_code()], true,
            false
        ],
    ])("test for delete_friend_code for exception, (%s, %s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, game_id: any,
        matched_friend_code_list: FriendCode[], is_delete_successed: boolean,
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.select_menu_interaction_mock(custom_id, guild_id, user_id, [game_id]);
        const interaction = new Mock();
        TestDiscordMock.embed_mock();
        interaction.guild = undefined;

        // expect
        let result = await controller.delete_friend_code(interaction);
        expect(result).toEqual(expected);
    });
});