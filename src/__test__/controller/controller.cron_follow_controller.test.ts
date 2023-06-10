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

const controller = new CronFollowController();

/**
 * mockup for guild
 * @returns 
 */
function get_guild_mock(ret: any): any {
    return {
        guilds: {
            resolve: (): any => {
                return ret;
            },
        },
        members: {
            cache: [],
        }
    };
}

describe('follow_recruitment_member', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [[TestEntity.get_test_server_info(), TestEntity.get_test_server_info()], [true, true], true],
        [[TestEntity.get_test_server_info(), TestEntity.get_test_server_info()], [false, true], false],
        [[], [], false],
    ])('test for follow_recruitment_member, (%s, %s) -> %s', async (
        server_list: ServerInfo[],
        main_logic_result_list: boolean[],
        expected: boolean
    ) => {
        // setup mocks
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info_all')
            .mockImplementationOnce(async () => { return server_list; });
        main_logic_result_list.forEach((v) => {
            jest.spyOn(CronFollowController.prototype, 'execute_logic_for_guild')
                .mockImplementationOnce(async () => { return v; });
        });
        const client_mock: Discord.Client = get_guild_mock({});

        // execute
        const result = await controller.follow_recruitment_member(client_mock);
        expect(result).toBe(expected);
    });

    test.each([
        [[TestEntity.get_test_server_info(), TestEntity.get_test_server_info()], [true, true], false],
        [[TestEntity.get_test_server_info(), TestEntity.get_test_server_info()], [false, true], false],
        [[], [], false],
    ])('test for follow_recruitment_member for exception, (%s, %s) -> %s', async (
        server_list: ServerInfo[],
        main_logic_result_list: boolean[],
        expected: boolean
    ) => {
        // setup mocks
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info_all')
            .mockImplementationOnce(async () => { throw `exception!` });
        const client_mock: Discord.Client = get_guild_mock({});

        // execute
        const result = await controller.follow_recruitment_member(client_mock);
        expect(result).toBe(expected);
    });
});

describe('execute_logic_for_guild', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [[], [], 0, true],
        [[TestEntity.get_test_recruitment()], [TestEntity.get_test_participate()], 0, true],
        [[TestEntity.get_test_recruitment()], [TestEntity.get_test_participate()], 1, true],
    ])("test for execute_logic_for_guild, (%s, %s, %s) -> %s", async (
        rec_list: Recruitment[],
        par_list: Participate[],
        upd_cnt: number,
        expected: boolean) => {
        // get mock
        const Mock = TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();

        // set special mock
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment_for_follow')
            .mockImplementationOnce(async (): Promise<Recruitment[]> => { return rec_list; });
        jest.spyOn(ParticipateRepository.prototype, 'get_t_participate')
            .mockImplementationOnce(async (): Promise<Participate[]> => { return par_list; });
        jest.spyOn(ServerInfoRepository.prototype, 'update_m_server_info_follow_time')
            .mockImplementationOnce(async (): Promise<number> => { return upd_cnt; });
        jest.spyOn(DiscordCommon, 'get_text_channel').mockImplementationOnce(() => {
            return {
                send: (): Promise<any> => {
                    return new Promise<boolean>((resolve, reject) => { resolve(true) });
                },
            } as unknown as Discord.TextChannel;
        });

        // expect
        let result = await controller.execute_logic_for_guild(client, TestEntity.get_test_server_info(), new Date());
        expect(result).toEqual(expected);
    });

    test.each([
        [[], [], 0, false],
        [[TestEntity.get_test_recruitment()], [TestEntity.get_test_participate()], 0, false],
        [[TestEntity.get_test_recruitment()], [TestEntity.get_test_participate()], 1, false],
    ])("test for execute_logic_for_guild for exception, (%s, %s, %s) -> %s", async (
        rec_list: Recruitment[],
        par_list: Participate[],
        upd_cnt: number,
        expected: boolean) => {
        // get mock
        const Mock = TestDiscordMock.client_mock([{ id: "test_server_id" }]);
        const client = new Mock();

        // set special mock
        jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment_for_follow')
            .mockImplementationOnce(async (): Promise<Recruitment[]> => { throw `exception!` });

        // expect
        let result = await controller.execute_logic_for_guild(client, TestEntity.get_test_server_info(), new Date());
        expect(result).toEqual(expected);
    });
});