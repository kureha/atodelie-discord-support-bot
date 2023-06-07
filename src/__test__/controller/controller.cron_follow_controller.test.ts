import { TestDiscordMock } from "../common/test_discord_mock";

// setup for mock
import * as Discord from 'discord.js';

import { CronFollowController } from '../../controller/cron_follow_controller';
import { RecruitmentRepository } from "../../db/recruitement";
import { TestEntity } from "../common/test_entity";
import { Recruitment } from "../../entity/recruitment";
import { ParticipateRepository } from "../../db/participate";
import { Participate } from "../../entity/participate";
import { ServerInfoRepository } from "../../db/server_info";
import { DiscordCommon } from "../../logic/discord_common";
import { ServerInfo } from "../../entity/server_info";

describe('cron follow test.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [[], false],
        [[TestEntity.get_test_server_info()], true],
        [[TestEntity.get_test_server_info(), TestEntity.get_test_server_info()], true],
    ])("cron follow test. (%s)", async (server_info_list: ServerInfo[], expected: boolean) => {
        // get mock
        const Mock = TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();

        // set special mock
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info_all').mockImplementationOnce((): Promise<ServerInfo[]> => {
            return new Promise<ServerInfo[]>((resolve, reject) => {
                resolve(server_info_list)
            });
        });
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment_for_follow').mockImplementationOnce((server_id: string, from_datetime: Date, to_datetime: Date): Promise<Recruitment[]> => {
            return new Promise<Recruitment[]>((resolve, reject) => {
                resolve([TestEntity.get_test_recruitment()]);
            });
        });
        jest.spyOn(ParticipateRepository.prototype, 'get_t_participate').mockImplementationOnce((token: string): Promise<Participate[]> => {
            return new Promise<Participate[]>((resolve, reject) => {
                resolve([TestEntity.get_test_participate()]);
            });
        });
        jest.spyOn(ServerInfoRepository.prototype, 'update_m_server_info_follow_time').mockImplementationOnce((server_id: string, follow_time: Date): Promise<number> => {
            return new Promise<number>((resolve, reject) => {
                resolve(1);
            });
        });
        jest.spyOn(DiscordCommon, 'get_text_channel').mockImplementationOnce((client: Discord.Client, channel_id: string): any => {
            return {
                send: (): Promise<any> => {
                    return new Promise<boolean>((resolve, reject) => { resolve(true) });
                },
            };
        });

        let result = await CronFollowController.follow_recruitment_member(client);
        expect(result).toEqual(expected);
    });
});