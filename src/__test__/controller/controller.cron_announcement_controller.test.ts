import { Constants } from "../../common/constants";
import { CronAnnouncementController } from "../../controller/cron_announcement_controller";
import { ActivityHistoryRepository } from "../../db/activity_history";
import { AnnouncementHistoryRepository } from "../../db/announcement_history";
import { ServerInfoRepository } from "../../db/server_info";
import { ActivityHistory } from "../../entity/activity_history";
import { AnnouncementHistory } from "../../entity/announcement_history";
import { AnnouncementInfo } from "../../entity/announcement_info";
import { ServerInfo } from "../../entity/server_info";
import { DiscordCommon } from "../../logic/discord_common";
import { TestEntity } from "../common/test_entity";


// import discord modules
import * as Discord from 'discord.js';

const controller = new CronAnnouncementController();

function get_test_activity(date: Date, member_count: number | undefined, total_member_count: number | undefined, g_name: string | undefined): ActivityHistory {
    let v = TestEntity.get_test_activity(date);
    v.member_count = member_count || 0;
    v.total_member_count = total_member_count || 0;
    v.game_name = g_name || '';
    return v;
}

describe('cron announcement test', () => {
    test.each([
        [
            [2, 3, 0, 5], [3, 4, 0, 6], ["a", "c", "", "b"], {
                current_game_member_count: 2,
                max_total_member_count: 4,
                g_name: "a",
                start_idx: 1,
            }
        ],
        [
            [2, 3, 0, 5], [5, 4, 0, 6], ["a", "c", "", "b"], {
                current_game_member_count: 2,
                max_total_member_count: 5,
                g_name: "a",
                start_idx: 1,
            }
        ],
        [
            [2, 3, 1, 5, 4, 3], [3, 4, 2, 6, 5, 4], ["a", "c", "", "b", "b", "d"], {
                current_game_member_count: 2,
                max_total_member_count: 6,
                g_name: "a",
                start_idx: 5,
            }
        ],
        [
            [0, 3, 0], [0, 4, 0], ["", "a", ""], {
                current_game_member_count: 0,
                max_total_member_count: 0,
                g_name: "",
                start_idx: -1,
            }
        ],
        [
            [], [], [], {
                current_game_member_count: 0,
                max_total_member_count: 0,
                g_name: "",
                start_idx: -1,
            }
        ],
    ])('test for extract_announcement, (%s, %s, %s) => %s', (
        current_game_member_count_list: number[],
        max_total_member_count_list: number[],
        g_name_list: string[],
        expected: {
            current_game_member_count: number,
            max_total_member_count: number,
            g_name: string,
            start_idx: number,
        }
    ) => {
        // create data
        let list: ActivityHistory[] = [];
        current_game_member_count_list.forEach((v, idx) => {
            let change_time: Date = new Date('2099-02-03T12:34:56.789+09:00');
            change_time.setMinutes(change_time.getMinutes() + idx);
            list.push(get_test_activity(
                change_time,
                current_game_member_count_list[idx],
                max_total_member_count_list[idx],
                g_name_list[idx]
            ));
        });

        // get result
        const result = controller.extract_announcement(list);

        // create assert object
        const expected_info: AnnouncementInfo = new AnnouncementInfo();

        // start time
        let game_start_time: Date = new Date('2099-02-03T12:34:56.789+09:00');
        if (expected.start_idx >= 0) {
            game_start_time.setMinutes(game_start_time.getMinutes() + expected.start_idx);
        } else {
            game_start_time = Constants.get_default_date()
        }

        // basic server info
        if (current_game_member_count_list.length > 0) {
            expected_info.server_id = "test-server-id";
            expected_info.channel_id = "test-channel-id";
        }

        // input variables set to expected info
        expected_info.current_game_member_count = expected.current_game_member_count;
        expected_info.max_total_member_count = expected.max_total_member_count;
        expected_info.game_name = expected.g_name;
        expected_info.game_start_time = game_start_time;

        // assert!
        expect(result).toStrictEqual(expected_info);
    });

    test.each([
        [new Date('2099-02-03T12:34:56.789+09:00'), new Date('2099-02-03T12:34:56.789+09:00'), false],
        [new Date('2099-02-03T12:34:56.788+09:00'), new Date('2099-02-03T12:34:56.789+09:00'), true],
        [new Date('2099-02-03T12:34:56.790+09:00'), new Date('2099-02-03T12:34:56.789+09:00'), false],
    ])('test for is_exec_announcement, (announce : %s vs activity start : %s -> is announce : %s)', (
        announcement_time: Date, activity_start_time: Date, expected: boolean
    ) => {
        const his: AnnouncementHistory = TestEntity.get_test_announcement_history(announcement_time);
        const history_list: AnnouncementHistory[] = [his];
        const info: AnnouncementInfo = TestEntity.get_test_announcement_info(activity_start_time);

        // threshold 0
        let result = controller.is_exec_announcement(info, history_list, 0);
        expect(result).toEqual(expected);

        // threshold 1
        result = controller.is_exec_announcement(info, history_list, 1);
        expect(result).toEqual(expected);

        // threshold 2
        result = controller.is_exec_announcement(info, history_list, 2);
        expect(result).toEqual(false);
    });

    test('test for is_exec_announcement blank', () => {
        const info: AnnouncementInfo = TestEntity.get_test_announcement_info(new Date('2099-02-03T12:34:56.789+09:00'));
        const result = controller.is_exec_announcement(info, [], 1);
        expect(result).toEqual(true);
    });

    test('test for is_exec_announcement undefined', () => {
        const info: AnnouncementInfo = TestEntity.get_test_announcement_info(new Date('2099-02-03T12:34:56.789+09:00'));
        const result = controller.is_exec_announcement(info, [undefined as unknown as AnnouncementHistory], 1);
        expect(result).toEqual(true);
    });

    test('test for is_exec_announcement announce info\'s gamen name is blank', () => {
        const info: AnnouncementInfo = TestEntity.get_test_announcement_info(new Date('2099-02-03T12:34:56.789+09:00'));
        info.game_name = '';
        const result = controller.is_exec_announcement(info, [undefined as unknown as AnnouncementHistory], 1);
        expect(result).toEqual(false);
    });
});

/**
 * mockup for voice channel
 * @param id 
 * @param name 
 * @returns 
 */
function mock_get_voice_channel(id: string, name: string): any {
    return {
        id: id,
        name: name,
        setName: (v: string): void => { },
    };
}

/**
 * mockup for text channel
 * @returns 
 */
function mock_get_text_channel(): any {
    return {
        send: (v: string): Promise<void> => {
            return new Promise<void>((resolve) => { resolve() });
        }
    }
}

/**
 * mockup create function for update_voice_channel_name
 */
function setup_update_voice_channel_name_mock(server_info_list: ServerInfo[]) {
    jest.spyOn(CronAnnouncementController.prototype, 'execute_logic_for_guild').mockImplementation(() => {
        return new Promise<boolean>((resolve, reject) => {
            resolve(true);
        });
    });
    jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info_all').mockImplementation(() => {
        return new Promise<ServerInfo[]>((resolve, reject) => {
            resolve(server_info_list);
        });
    });
}

/**
 * mockup for guid
 * @returns 
 */
function get_guild_mock_update_voice_channel_name(ret: any): any {
    return {
        guilds: {
            resolve: (): any => {
                return ret;
            },
        },
    };
}

describe('update_voice_channel_name', () => {
    beforeEach(() => {
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test('test for annoucement for blank', async () => {
        // setup mocks
        setup_update_voice_channel_name_mock([]);
        const client_mock: Discord.Client = get_guild_mock_update_voice_channel_name({});

        // expect assertions
        expect.assertions(1);

        // execute
        const result = await controller.auto_annoucement(client_mock);
        expect(result).toBe(false);
    });

    test('test for annoucement', async () => {
        // setup mocks
        setup_update_voice_channel_name_mock([TestEntity.get_test_server_info()]);
        const client_mock: Discord.Client = get_guild_mock_update_voice_channel_name({});

        // expect assertions
        expect.assertions(1);

        // execute
        const result = await controller.auto_annoucement(client_mock);
        expect(result).toBe(true);
    });
});

describe('execute_logic_for_guild', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [["test_game_id_1", "test_game_id_1", "test_game_id_2"], ["test_server_1"]],
    ])('execute_logic_for_guild', async (game_id_list: string[], voice_channel_id_list: string[]) => {
        // setup mocks
        jest.spyOn(DiscordCommon, 'get_voice_channel_id_list').mockImplementationOnce(() => {
            return voice_channel_id_list;
        });
        jest.spyOn(DiscordCommon, 'get_voice_channel').mockImplementationOnce(() => {
            return mock_get_voice_channel("test_channel_id", "test_channel_name");
        });
        jest.spyOn(DiscordCommon, 'get_text_channel').mockImplementationOnce((c: any, id: any) => {
            return mock_get_text_channel();
        });
        jest.spyOn(ActivityHistoryRepository.prototype, 'get_t_activity_history').mockImplementationOnce((g: string, c: string, l: number): Promise<ActivityHistory[]> => {
            return new Promise<ActivityHistory[]>((resolve, reject) => {
                resolve([TestEntity.get_test_activity(new Date())]);
            });
        });
        jest.spyOn(AnnouncementHistoryRepository.prototype, 'get_t_announcement').mockImplementationOnce((g: string, c: string, l: number): Promise<AnnouncementHistory[]> => {
            return new Promise<AnnouncementHistory[]>((resolve, reject) => {
                resolve([TestEntity.get_test_announcement_history(new Date())]);
            });
        });
        jest.spyOn(AnnouncementHistoryRepository.prototype, 'insert_t_announcement').mockImplementationOnce((v: AnnouncementHistory): Promise<number> => {
            return new Promise<number>((resolve, reject) => {
                resolve(1);
            });
        });
        jest.spyOn(CronAnnouncementController.prototype, 'extract_announcement').mockImplementation((list: ActivityHistory[]): AnnouncementInfo => {
            return TestEntity.get_test_announcement_info(new Date());
        });
        jest.spyOn(CronAnnouncementController.prototype, 'is_exec_announcement').mockImplementation((v: AnnouncementInfo, list: AnnouncementHistory[], n: number): boolean => {
            return true;
        });

        const mock_guild = {
            id: "test_id",
            members: {
                cache: [],
            },
        };

        // expect assertions
        expect.assertions(1);

        // execute
        const result = await controller.execute_logic_for_guild(mock_guild as unknown as Discord.Guild, 'test_ch_id', 'test_role');
        expect(result).toBe(true);
    });

    test.each([
        [["test_game_id_1", "test_game_id_1", "test_game_id_2"], ["test_server_1"]],
    ])('execute_logic_for_guild for no need announce', async (game_id_list: string[], voice_channel_id_list: string[]) => {
        // setup mocks
        jest.spyOn(DiscordCommon, 'get_voice_channel_id_list').mockImplementationOnce(() => {
            return voice_channel_id_list;
        });
        jest.spyOn(DiscordCommon, 'get_voice_channel').mockImplementationOnce(() => {
            return mock_get_voice_channel("test_channel_id", "test_channel_name");
        });
        jest.spyOn(DiscordCommon, 'get_text_channel').mockImplementationOnce((c: any, id: any) => {
            return mock_get_text_channel();
        });
        jest.spyOn(ActivityHistoryRepository.prototype, 'get_t_activity_history').mockImplementationOnce((g: string, c: string, l: number): Promise<ActivityHistory[]> => {
            return new Promise<ActivityHistory[]>((resolve, reject) => {
                resolve([TestEntity.get_test_activity(new Date())]);
            });
        });
        jest.spyOn(AnnouncementHistoryRepository.prototype, 'get_t_announcement').mockImplementationOnce((g: string, c: string, l: number): Promise<AnnouncementHistory[]> => {
            return new Promise<AnnouncementHistory[]>((resolve, reject) => {
                resolve([TestEntity.get_test_announcement_history(new Date())]);
            });
        });
        jest.spyOn(AnnouncementHistoryRepository.prototype, 'insert_t_announcement').mockImplementationOnce((v: AnnouncementHistory): Promise<number> => {
            return new Promise<number>((resolve, reject) => {
                resolve(1);
            });
        });
        jest.spyOn(CronAnnouncementController.prototype, 'extract_announcement').mockImplementation((list: ActivityHistory[]): AnnouncementInfo => {
            return TestEntity.get_test_announcement_info(new Date());
        });
        jest.spyOn(CronAnnouncementController.prototype, 'is_exec_announcement').mockImplementation((v: AnnouncementInfo, list: AnnouncementHistory[], n: number): boolean => {
            return false;
        });

        const mock_guild = {
            id: "test_id",
            members: {
                cache: [],
            },
        };

        // expect assertions
        expect.assertions(1);

        // execute
        const result = await controller.execute_logic_for_guild(mock_guild as unknown as Discord.Guild, 'test_ch_id', 'test_role');
        expect(result).toBe(true);
    });

    test.each([
        [["test_game_id_1", "test_game_id_1", "test_game_id_2"], ["test_server_1"]],
    ])('execute_logic_for_guild for history insert failed', async (game_id_list: string[], voice_channel_id_list: string[]) => {
        // setup mocks
        jest.spyOn(DiscordCommon, 'get_voice_channel_id_list').mockImplementationOnce(() => {
            return voice_channel_id_list;
        });
        jest.spyOn(DiscordCommon, 'get_voice_channel').mockImplementationOnce(() => {
            return mock_get_voice_channel("test_channel_id", "test_channel_name");
        });
        jest.spyOn(DiscordCommon, 'get_text_channel').mockImplementationOnce((c: any, id: any) => {
            return mock_get_text_channel();
        });
        jest.spyOn(ActivityHistoryRepository.prototype, 'get_t_activity_history').mockImplementationOnce((g: string, c: string, l: number): Promise<ActivityHistory[]> => {
            return new Promise<ActivityHistory[]>((resolve, reject) => {
                resolve([TestEntity.get_test_activity(new Date())]);
            });
        });
        jest.spyOn(AnnouncementHistoryRepository.prototype, 'get_t_announcement').mockImplementationOnce((g: string, c: string, l: number): Promise<AnnouncementHistory[]> => {
            return new Promise<AnnouncementHistory[]>((resolve, reject) => {
                resolve([TestEntity.get_test_announcement_history(new Date())]);
            });
        });
        jest.spyOn(AnnouncementHistoryRepository.prototype, 'insert_t_announcement').mockImplementationOnce((v: AnnouncementHistory): Promise<number> => {
            return new Promise<number>((resolve, reject) => {
                resolve(0);
            });
        });
        jest.spyOn(CronAnnouncementController.prototype, 'extract_announcement').mockImplementation((list: ActivityHistory[]): AnnouncementInfo => {
            return TestEntity.get_test_announcement_info(new Date());
        });
        jest.spyOn(CronAnnouncementController.prototype, 'is_exec_announcement').mockImplementation((v: AnnouncementInfo, list: AnnouncementHistory[], n: number): boolean => {
            return true;
        });

        const mock_guild = {
            id: "test_id",
            members: {
                cache: [],
            },
        };

        // expect assertions
        expect.assertions(1);

        // execute
        const result = await controller.execute_logic_for_guild(mock_guild as unknown as Discord.Guild, 'test_ch_id', 'test_role');
        expect(result).toBe(true);
    });

    test.each([
        [["test_game_id_1", "test_game_id_1", "test_game_id_2"], ["test_server_1"]],
    ])('execute_logic_for_guild for exception', async (game_id_list: string[], voice_channel_id_list: string[]) => {
        // setup mocks
        jest.spyOn(DiscordCommon, 'get_voice_channel_id_list').mockImplementationOnce(() => {
            return null as unknown as string[];
        });

        // expect assertions
        expect.assertions(1);

        // execute
        try {
            await controller.execute_logic_for_guild({} as unknown as Discord.Guild, 'test_ch_id', 'test_role');
        } catch (err) {
            expect(true).toBe(true);
        }
    });
});