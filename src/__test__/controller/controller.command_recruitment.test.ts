// import discord modules
import * as Discord from 'discord.js';

import { TestDiscordMock } from "../common/test_discord_mock";

import { CommandRecruitmentController } from "../../controller/command_recruitment_controller";
import { RecruitmentRepository } from '../../db/recruitement';

import { TestEntity } from '../common/test_entity';
import { Recruitment } from '../../entity/recruitment';
import { ParticipateRepository } from '../../db/participate';
import { Participate } from '../../entity/participate';
import { ServerInfoRepository } from '../../db/server_info';
import { ServerInfo } from '../../entity/server_info';

const controller = new CommandRecruitmentController();

function set_show_recruitment_input_modal_mock() {
    const show_recruitment_input_modal = jest.spyOn(CommandRecruitmentController.prototype, 'show_recruitment_input_modal');
    show_recruitment_input_modal.mockImplementationOnce((interaction: Discord.ChatInputCommandInteraction, modal: Discord.ModalBuilder, limit_time: Date | undefined, description: string | undefined): Promise<boolean> => {
        return new Promise<boolean>((resolve, reject) => {
            resolve(true);
        })
    });
}

function set_test_repositories() {
    // get repository mock
    jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment_for_user')
        .mockImplementationOnce((server_id: string, user_id: string): Promise<Recruitment[]> => {
            return new Promise<Recruitment[]>((resolve, reject) => {
                resolve([TestEntity.get_test_recruitment()]);
            });
        });

    jest.spyOn(ParticipateRepository.prototype, 'get_t_participate')
        .mockImplementationOnce((token: string): Promise<Participate[]> => {
            return new Promise<Participate[]>((resolve, reject) => {
                resolve([TestEntity.get_test_participate()]);
            });
        });

    jest.spyOn(ParticipateRepository.prototype, 'delete_t_participate')
        .mockImplementationOnce((token: string): Promise<number> => {
            return new Promise<number>((resolve, reject) => {
                resolve(1);
            });
        });
    jest.spyOn(RecruitmentRepository.prototype, 'delete_m_recruitment')
        .mockImplementationOnce((token: string): Promise<number> => {
            return new Promise<number>((resolve, reject) => {
                resolve(1);
            });
        });

    jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info')
        .mockImplementationOnce((token: string): Promise<ServerInfo> => {
            return new Promise<ServerInfo>((resolve, reject) => {
                resolve(TestEntity.get_test_server_info());
            });
        });
}

describe('new recruitment commandtest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("new recruitment modal test. (%s, %s %s)", async (custom_id: any, guild_id: any, user_id: any) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // get modal builder mock
        TestDiscordMock.modal_builder_mock();

        // set extra mock
        set_show_recruitment_input_modal_mock();

        let result = await controller.new_recruitment_input_modal(interaction);
        expect(result).toEqual(true);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("new recruitment modal error test. (%s, %s %s)", async (custom_id: any, guild_id: any, user_id: any) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // get modal builder mock
        TestDiscordMock.modal_builder_mock();

        const result = await controller.new_recruitment_input_modal(interaction);
        expect(result).toEqual(false);
    });
});

describe('edit recruitment commandtest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("edit recruitment modal test. (%s, %s %s)", async (custom_id: any, guild_id: any, user_id: any) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // get modal builder mock
        TestDiscordMock.modal_builder_mock();

        // set extra mock
        set_show_recruitment_input_modal_mock();

        // set repository mock
        set_test_repositories();

        expect.assertions(1);
        let result = await controller.edit_recruitment_input_modal(interaction);
        expect(result).toEqual(true);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("edit recruitment modal error test. (%s, %s %s)", async (custom_id: any, guild_id: any, user_id: any) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // get modal builder mock
        TestDiscordMock.modal_builder_mock();

        // set sp repository mock
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment_for_user')
            .mockImplementationOnce((server_id: string, user_id: string): Promise<Recruitment[]> => {
                return new Promise<Recruitment[]>((resolve, reject) => {
                    resolve([]);
                });
            });

        const result = await controller.edit_recruitment_input_modal(interaction);
        expect(result).toEqual(false);
    });
});

describe('delete recruitment commandtest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("delete recruitment modal test. (%s, %s %s)", async (custom_id: any, guild_id: any, user_id: any) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // get modal builder mock
        TestDiscordMock.modal_builder_mock();

        // set repository mock
        set_test_repositories();

        // set extra mock
        set_show_recruitment_input_modal_mock();

        let result = await controller.delete_recruitment(interaction);
        expect(result).toEqual(true);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id"],
    ])("delete recruitment modal error test. (%s, %s %s)", async (custom_id: any, guild_id: any, user_id: any) => {
        // get mock
        const Mock = TestDiscordMock.chat_input_command_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // get modal builder mock
        TestDiscordMock.modal_builder_mock();

        // set sp repository mock
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment_for_user')
            .mockImplementationOnce((server_id: string, user_id: string): Promise<Recruitment[]> => {
                return new Promise<Recruitment[]>((resolve, reject) => {
                    resolve([]);
                });
            });

        const result = await controller.delete_recruitment(interaction);
        expect(result).toEqual(false);
    });
});