import { ButtonInteractionRecruitmentController } from "../../controller/button_interaction_recruitment_controller";

// setup for mock
import { TestDiscordMock } from "../common/test_discord_mock";

import { RecruitmentRepository } from "../../db/recruitement";
import { ParticipateRepository } from "../../db/participate";

import { Constants } from "../../common/constants";
const constants = new Constants;

import { TestEntity } from "../common/test_entity";
import { Recruitment } from "../../entity/recruitment";
import { ServerInfoRepository } from "../../db/server_info";
import { ServerInfo } from "../../entity/server_info";

const controller = new ButtonInteractionRecruitmentController();

describe('button interaction recruitment controllertest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["error_custom_id", "test_server_id", "test_user_id", "button interaction recruitment error."],
        ["join-recruite-token=test_token", undefined, "test_user_id", "interaction's guild id is undefined."],
        ["join-recruite-token=test_token_not_found", "test_server_id", "test_user_id", "target m_recruitment is not found."],
    ])('recruitment interaction error test. ((%s, %s, %s) -> %s)', async (custom_id: any, guild_id: any, user_id: any, error_message: string) => {
        // get mock
        const Mock = TestDiscordMock.button_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // setup mocks
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment').mockImplementationOnce(() => {
            throw new Error(`target m_recruitment is not found. token = 12345`);
        });

        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info').mockImplementationOnce(() => {
            return new Promise<ServerInfo>((resolve) => {
                resolve(TestEntity.get_test_server_info());
            });
        });

        // expect
        const result = await controller.recruitment_interaction(interaction);
        expect(result).toEqual(false);
    });

    test.each([
        ["join-recruite-token=test_token", "test_server_id", "test_user_id", constants.STATUS_ENABLED],
        ["view-recruite-token=test_token", "test_server_id", "test_user_id", constants.STATUS_VIEW],
    ])('button interaction recruitment insert test. ((%s, %s, %s) -> participate status = %s)', async (customId: any, guildId: any, userId: any, expected_status: number) => {
        // get mock
        const Mock = TestDiscordMock.button_interaction_mock(customId, guildId, userId);
        const interaction = new Mock();

        // setup test entityes
        const test_rec = TestEntity.get_test_recruitment();
        const test_par_another = TestEntity.get_test_participate();
        test_par_another.user_id = "test_user_id_another";

        // setup mocks
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment').mockImplementationOnce(() => {
            return new Promise<Recruitment>((resolve) => {
                resolve(test_rec);
            });
        });

        jest.spyOn(ParticipateRepository.prototype, 'insert_t_participate').mockImplementationOnce(() => {
            return new Promise<number>((resolve) => {
                resolve(1);
            });
        });
        jest.spyOn(ParticipateRepository.prototype, 'update_t_participate').mockImplementationOnce(() => {
            return new Promise<number>((resolve) => {
                resolve(1);
            });
        });

        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info').mockImplementationOnce(() => {
            return new Promise<ServerInfo>((resolve) => {
                resolve(TestEntity.get_test_server_info());
            });
        });

        // update recruitment
        let result = await controller.recruitment_interaction(interaction);
        expect(result).toEqual(true);
    });

    test.each([
        ["join-recruite-token=test_token", "test_server_id", "test_user_id", constants.STATUS_ENABLED],
        ["view-recruite-token=test_token", "test_server_id", "test_user_id", constants.STATUS_VIEW],
    ])('button interaction recruitment update test. ((%s, %s, %s) -> participate status = %s)', async (custom_id: any, guild_id: any, user_id: any, expected_status: number) => {
        // get mock
        const Mock = TestDiscordMock.button_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // setup test entityes
        const test_rec = TestEntity.get_test_recruitment();

        // setup mocks
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment').mockImplementationOnce(() => {
            return new Promise<Recruitment>((resolve) => {
                resolve(test_rec);
            });
        });

        jest.spyOn(ParticipateRepository.prototype, 'insert_t_participate').mockImplementationOnce(() => {
            return new Promise<number>((_resolve, reject) => {
                reject(`record exists`);
            });
        });
        jest.spyOn(ParticipateRepository.prototype, 'update_t_participate').mockImplementationOnce(() => {
            return new Promise<number>((resolve) => {
                resolve(1);
            });
        });

        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info').mockImplementationOnce(() => {
            return new Promise<ServerInfo>((resolve) => {
                resolve(TestEntity.get_test_server_info());
            });
        });

        // update recruitment
        let result = await controller.recruitment_interaction(interaction);
        expect(result).toEqual(true);
    });

    test.each([
        ["decline-recruite-token=test_token", "test_server_id", "test_user_id"],
    ])('button interaction recruitment delete test. ((%s, %s, %s) -> participate status = %s)', async (custom_id: any, guild_id: any, user_id: any) => {
        // get mock
        const Mock = TestDiscordMock.button_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // setup test entityes
        const test_rec = TestEntity.get_test_recruitment();

        // setup mocks
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment').mockImplementationOnce(() => {
            return new Promise<Recruitment>((resolve) => {
                resolve(test_rec);
            });
        });

        jest.spyOn(ParticipateRepository.prototype, 'insert_t_participate').mockImplementationOnce(() => {
            return new Promise<number>((_resolve, reject) => {
                reject(`record exists`);
            });
        });
        jest.spyOn(ParticipateRepository.prototype, 'update_t_participate').mockImplementationOnce(() => {
            return new Promise<number>((resolve) => {
                resolve(1);
            });
        });

        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info').mockImplementationOnce(() => {
            return new Promise<ServerInfo>((resolve) => {
                resolve(TestEntity.get_test_server_info());
            });
        });

        // update recruitment
        let result = await controller.recruitment_interaction(interaction);
        expect(result).toEqual(true);
    });
});