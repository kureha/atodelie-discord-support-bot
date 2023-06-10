// import discord modules
import * as Discord from 'discord.js';

import { TestDiscordMock } from "../common/test_discord_mock";

import { CommandRecruitmentController } from "../../controller/command_recruitment_controller";
import { RecruitmentRepository } from '../../db/recruitement';

import { TestEntity } from '../common/test_entity';
import { Recruitment } from '../../entity/recruitment';
import { ParticipateRepository } from '../../db/participate';
import { ServerInfoRepository } from '../../db/server_info';
import { DiscordCommon } from "../../logic/discord_common";

const controller = new CommandRecruitmentController();

describe('new_recruitment_input_modal', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("test for new_recruitment_input_modal, (%s, %s, %s) -> %s", async (custom_id: any, guild_id: any, user_id: any) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        jest.spyOn(CommandRecruitmentController.prototype, 'show_recruitment_input_modal')
            .mockImplementationOnce(async () => { return true; });

        // get modal builder mock
        TestDiscordMock.modal_builder_mock();

        let result = await controller.new_recruitment_input_modal(interaction);
        expect(result).toEqual(true);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("new recruitment modal exception test. (%s, %s %s)", async (custom_id: any, guild_id: any, user_id: any) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        jest.spyOn(CommandRecruitmentController.prototype, 'show_recruitment_input_modal')
            .mockImplementationOnce(async () => { throw `exception!` });

        // get modal builder mock
        TestDiscordMock.modal_builder_mock();

        let result = await controller.new_recruitment_input_modal(interaction);
        expect(result).toEqual(false);
    });
});

describe('edit_recruitment_input_modal', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", [TestEntity.get_test_recruitment()], true],
    ])("test for edit_recruitment_input_modal, (%s, %s, %s, %s) -> %s", async (
        custom_id: any,
        guild_id: any,
        user_id: any,
        rec_list: Recruitment[],
        expected: boolean) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment_for_user')
            .mockImplementationOnce(async () => { return rec_list; });
        jest.spyOn(CommandRecruitmentController.prototype, 'show_recruitment_input_modal')
            .mockImplementationOnce(async () => { return true; });

        // get modal builder mock
        TestDiscordMock.modal_builder_mock();

        let result = await controller.edit_recruitment_input_modal(interaction);
        expect(result).toEqual(expected);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", [], false],
    ])("test for edit_recruitment_input_modal error, (%s, %s, %s, %s) -> %s", async (
        custom_id: any,
        guild_id: any,
        user_id: any,
        rec_list: Recruitment[],
        expected: boolean) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment_for_user')
            .mockImplementationOnce(async () => { return rec_list; });
        jest.spyOn(CommandRecruitmentController.prototype, 'show_recruitment_input_modal')
            .mockImplementationOnce(async () => { return true; });

        // get modal builder mock
        TestDiscordMock.modal_builder_mock();

        let result = await controller.edit_recruitment_input_modal(interaction);
        expect(result).toEqual(expected);
    });
});

describe('delete_recruitment', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", [TestEntity.get_test_recruitment()], true],
    ])("test for delete_recruitment, (%s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, rec_list: Recruitment[], expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment_for_user')
            .mockImplementationOnce(async () => { return rec_list; });
        jest.spyOn(RecruitmentRepository.prototype, 'delete_m_recruitment')
            .mockImplementationOnce(async () => { return 1; });
        jest.spyOn(ParticipateRepository.prototype, 'get_t_participate')
            .mockImplementationOnce(async () => { return [] });
        jest.spyOn(ParticipateRepository.prototype, 'delete_t_participate')
            .mockImplementationOnce(async () => { return 2; });
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info')
            .mockImplementationOnce(async () => { return TestEntity.get_test_server_info() });

        // get modal builder mock
        TestDiscordMock.modal_builder_mock();

        let result = await controller.delete_recruitment(interaction);
        expect(result).toEqual(expected);
    });


    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", [], false],
    ])("test for delete_recruitment error, (%s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, rec_list: Recruitment[], expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment_for_user')
            .mockImplementationOnce(async () => { return rec_list; });
        jest.spyOn(RecruitmentRepository.prototype, 'delete_m_recruitment')
            .mockImplementationOnce(async () => { return 1; });
        jest.spyOn(ParticipateRepository.prototype, 'get_t_participate')
            .mockImplementationOnce(async () => { return [] });
        jest.spyOn(ParticipateRepository.prototype, 'delete_t_participate')
            .mockImplementationOnce(async () => { return 2; });
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info')
            .mockImplementationOnce(async () => { return TestEntity.get_test_server_info() });

        // get modal builder mock
        TestDiscordMock.modal_builder_mock();

        let result = await controller.delete_recruitment(interaction);
        expect(result).toEqual(expected);
    });
});

describe('show_recruitment_input_modal', () => {
    test('test for show_recruitment_input_modal', async () => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock('test-c-id', 'test-g-id', 'test-u-id');
        const interaction = new Mock();

        jest.spyOn(DiscordCommon, 'get_text_input')
            .mockImplementation(() => {
                return {
                    setValue: () => { },
                } as unknown as Discord.TextInputBuilder
            });

        const result = await controller.show_recruitment_input_modal(
            interaction,
            { addComponents: () => { } } as unknown as Discord.ModalBuilder,
            new Date(), '')
        expect(result).toBe(true);
    });

    test('test for show_recruitment_input_modal error', async () => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock('test-c-id', 'test-g-id', 'test-u-id');
        const interaction = new Mock();

        jest.spyOn(DiscordCommon, 'get_text_input')
            .mockImplementation(() => { throw `exception!` });

        let result = await controller.show_recruitment_input_modal(
            interaction,
            { addComponents: () => { } } as unknown as Discord.ModalBuilder,
            new Date(), '');
        expect(result).toEqual(false);
    });
});