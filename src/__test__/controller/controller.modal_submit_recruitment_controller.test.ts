import { TestDiscordMock } from "../common/test_discord_mock";

// import discord modules
import * as Discord from 'discord.js';

import { ModalSubmitRecruitmentController } from "../../controller/modal_submit_recruitment_controller";

import { TestEntity } from '../common/test_entity';
import { DiscordCommon } from "../../logic/discord_common";
import { GameMaster } from "../../entity/game_master";
import { RecruitmentRepository } from "../../db/recruitement";
import { Recruitment } from "../../entity/recruitment";
import { Participate } from "../../entity/participate";
import { ParticipateRepository } from "../../db/participate";
import { ServerInfoRepository } from "../../db/server_info";
import { ServerInfo } from "../../entity/server_info";
import { RoleInfo } from "../../entity/user_info";

const controller = new ModalSubmitRecruitmentController();

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

describe('modal submit friend codetest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])("modal submit friend code test (insert). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        // set extra mock
        set_test_repositories();
        jest.spyOn(RecruitmentRepository.prototype, 'insert_m_recruitment').mockImplementationOnce((v: Recruitment): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(ParticipateRepository.prototype, 'insert_t_participate_list').mockImplementationOnce((v: Participate[]): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });

        // set discord common mock
        jest.spyOn(DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild: Discord.Guild | null | undefined, ignore_role_name_list: string[]): GameMaster[] => {
            return [TestEntity.get_test_game_master_info()];
        });
        jest.spyOn(DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id: string, game_master_list: GameMaster[]): GameMaster => {
            return TestEntity.get_test_game_master_info();
        });

        // set discord common mock
        jest.spyOn(DiscordCommon, 'get_role_info_from_guild').mockImplementationOnce((guild: Discord.Guild | null | undefined): RoleInfo[] => {
            return TestEntity.get_test_role_info(5);
        });
        jest.spyOn(DiscordCommon, 'get_button').mockImplementation((custom_id: string, label: string, button_style: number): any => {
            return {};
        });

        // expect
        let result = await controller.regist(interaction);
        expect(result).toEqual(true);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code"],
    ])("modal submit friend code test (update). (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, input_value: any) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        // set extra mock
        set_test_repositories();
        jest.spyOn(RecruitmentRepository.prototype, 'insert_m_recruitment').mockImplementationOnce((v: Recruitment): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment_token').mockImplementationOnce((): Promise<string> => {
            return new Promise<string>((resolve, reject) => { resolve("test_token_update"); });
        });
        jest.spyOn(ParticipateRepository.prototype, 'insert_t_participate_list').mockImplementationOnce((v: Participate[]): Promise<number> => {
            return new Promise<number>((resolve, reject) => { resolve(1); });
        });

        // set discord common mock
        jest.spyOn(DiscordCommon, 'get_game_master_from_guild').mockImplementationOnce((guild: Discord.Guild | null | undefined, ignore_role_name_list: string[]): GameMaster[] => {
            return [TestEntity.get_test_game_master_info()];
        });
        jest.spyOn(DiscordCommon, 'get_game_master_from_list').mockImplementationOnce((game_id: string, game_master_list: GameMaster[]): GameMaster => {
            return TestEntity.get_test_game_master_info();
        });

        // set discord common mock
        jest.spyOn(DiscordCommon, 'get_role_info_from_guild').mockImplementationOnce((guild: Discord.Guild | null | undefined): RoleInfo[] => {
            return TestEntity.get_test_role_info(5);
        });
        jest.spyOn(DiscordCommon, 'get_button').mockImplementation((custom_id: string, label: string, button_style: number): any => {
            return {};
        });

        // expect
        let result = await controller.edit(interaction);
        expect(result).toEqual(true);
    });
});