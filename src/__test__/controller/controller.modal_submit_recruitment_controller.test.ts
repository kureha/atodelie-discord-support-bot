import { TestDiscordMock } from "../common/test_discord_mock";

// import discord modules
import * as Discord from 'discord.js';

// import constants
import { Constants } from '../../common/constants';
const constants = new Constants();

import { ModalSubmitRecruitmentController } from "../../controller/modal_submit_recruitment_controller";

import { TestEntity } from '../common/test_entity';
import { DiscordCommon } from "../../logic/discord_common";
import { RecruitmentRepository } from "../../db/recruitement";
import { Recruitment } from "../../entity/recruitment";
import { ParticipateRepository } from "../../db/participate";
import { ServerInfoRepository } from "../../db/server_info";
import { DiscordInteractionAnalyzer } from "../../logic/discord_interaction_analyzer";

const controller = new ModalSubmitRecruitmentController();

describe('regist', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code", "test-ch-id", true],
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code", constants.RECRUITMENT_INVALID_CHANNEL_ID, true],
    ])('test for regist, (%s, %s, %s, %s, %s) -> %s', async (
        custom_id: any, guild_id: any, user_id: any, input_value: any,
        test_channel_id: string,
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        jest.spyOn(ModalSubmitRecruitmentController.prototype, 'get_recruitment')
            .mockImplementationOnce(() => { return TestEntity.get_test_recruitment(); });
        jest.spyOn(ModalSubmitRecruitmentController.prototype, 'get_owner_participate')
            .mockImplementationOnce(() => { return TestEntity.get_test_participate(); });
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment_token')
            .mockImplementationOnce(async () => { return 'test-tkn'; });
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment_id')
            .mockImplementationOnce(async () => { return 1; });
        jest.spyOn(RecruitmentRepository.prototype, 'insert_m_recruitment')
            .mockImplementationOnce(async () => { return 1; });
        jest.spyOn(ParticipateRepository.prototype, 'insert_t_participate')
            .mockImplementationOnce(async () => { return 1; });
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info')
            .mockImplementationOnce(async () => {
                const v = TestEntity.get_test_server_info();
                v.channel_id = test_channel_id;
                return v;
            });

        jest.spyOn(DiscordCommon, 'get_button')
            .mockImplementation(() => { return {} as unknown as Discord.ButtonBuilder; });

        const result = await controller.regist(interaction);
        expect(result).toBe(expected);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code", "test-ch-id", false],
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code", constants.RECRUITMENT_INVALID_CHANNEL_ID, false],
    ])('test for regist, (%s, %s, %s, %s, %s) -> %s', async (
        custom_id: any, guild_id: any, user_id: any, input_value: any,
        test_channel_id: string,
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        jest.spyOn(ModalSubmitRecruitmentController.prototype, 'get_recruitment')
            .mockImplementationOnce(() => { throw `exception!` });

        const result = await controller.regist(interaction);
        expect(result).toBe(expected);
    });
});

describe('edit', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            "test-ch-id",
            [TestEntity.get_test_recruitment()],
            true
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            "test-ch-id",
            [],
            false
        ],
        [
            "test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            constants.RECRUITMENT_INVALID_CHANNEL_ID,
            [TestEntity.get_test_recruitment()],
            true
        ],
    ])('test for edit, (%s, %s, %s, %s, %s) -> %s', async (
        custom_id: any, guild_id: any, user_id: any, input_value: any,
        test_channel_id: string,
        rec_list: Recruitment[],
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment_for_user')
            .mockImplementationOnce(async () => { return rec_list; });
        jest.spyOn(ParticipateRepository.prototype, 'get_t_participate')
            .mockImplementationOnce(async () => { return [TestEntity.get_test_participate()]; });
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info')
            .mockImplementationOnce(async () => {
                const v = TestEntity.get_test_server_info();
                v.channel_id = test_channel_id;
                return v;
            });
        jest.spyOn(ParticipateRepository.prototype, 'delete_t_participate')
            .mockImplementationOnce(async () => { return 1; });
        jest.spyOn(RecruitmentRepository.prototype, 'delete_m_recruitment')
            .mockImplementationOnce(async () => { return 1; });
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment_token')
            .mockImplementationOnce(async () => { return 'test-tkn'; });
        jest.spyOn(DiscordCommon, 'get_role_info_from_guild')
            .mockImplementationOnce(() => { return []; });
        jest.spyOn(RecruitmentRepository.prototype, 'insert_m_recruitment')
            .mockImplementationOnce(async () => { return 1; });
        jest.spyOn(ParticipateRepository.prototype, 'insert_t_participate')
            .mockImplementationOnce(async () => { return 1; });
        jest.spyOn(DiscordCommon, 'get_button')
            .mockImplementation(() => { return {} as unknown as Discord.ButtonBuilder; });

        const result = await controller.edit(interaction);
        expect(result).toBe(expected);
    });
});

describe('get_recruitment', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])('test for get_recruitment, (%s, %s, %s, %s)', (
        custom_id: any, guild_id: any, user_id: any, input_value: any
    ) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        jest.spyOn(DiscordCommon, 'replace_intaraction_description_roles')
            .mockImplementationOnce(() => { return 'test-nm'; });
        jest.spyOn(DiscordInteractionAnalyzer, 'get_recruitment_time')
            .mockImplementationOnce(() => { return new Date(); });

        const result = controller.get_recruitment(interaction);
        expect(result.name).toEqual('test-nm');
        expect(result.token).toEqual('');
        expect(result.status).toEqual(constants.STATUS_ENABLED);
        expect(result.description).toEqual('');
        expect(result.delete).toEqual(false);
    });
});

describe('get_owner_participate', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])('test for get_owner_participate, (%s, %s, %s, %s)', (
        custom_id: any, guild_id: any, user_id: any, input_value: any
    ) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        const result = controller.get_owner_participate(interaction);
        expect(result.token).toEqual('');
        expect(result.status).toEqual(constants.STATUS_ENABLED);
        expect(result.delete).toEqual(false);
    });
});