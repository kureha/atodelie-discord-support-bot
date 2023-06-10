// import discord modules
import * as Discord from 'discord.js';
import { ServerInfoRepository } from "../../db/server_info";
import { TestEntity } from "../common/test_entity";
import { DiscordCommon } from "../../logic/discord_common";
import { GameMaster } from "../../entity/game_master";
import { GameMasterRepository } from "../../db/game_master";
import { ActivityHistoryRepository } from "../../db/activity_history";
import { CronActivityRecordController } from "../../controller/cron_activity_controller";
import { ActivityHistory } from '../../entity/activity_history';
import { ServerInfo } from '../../entity/server_info';

const controller = new CronActivityRecordController();

/**
 * mockup test function
 * @param user_id 
 * @param channel_id 
 * @returns 
 */
function get_test_member(user_id: string, channel_id: string | null): any {
    return {
        id: user_id,
        voice: {
            channel: {
                id: channel_id,
            },
        },
    };
}

/**
 * mockup test function
 * @param input_type 
 * @param input_name 
 * @returns 
 */
function get_activity(input_type: number, input_name: string): any {
    return {
        type: input_type,
        name: input_name
    };
}

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

describe('activity_history_regist', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [[TestEntity.get_test_server_info(), TestEntity.get_test_server_info()], [true, true], true],
        [[TestEntity.get_test_server_info(), TestEntity.get_test_server_info()], [false, true], false],
        [[], [], false],
    ])('test for activity_history_regist, (%s, %s) -> %s', async (
        server_list: ServerInfo[], main_logic_result_list: boolean[], expected: boolean
    ) => {
        // setup mocks
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info_all')
            .mockImplementationOnce(async () => { return server_list; });
        main_logic_result_list.forEach((v) => {
            jest.spyOn(CronActivityRecordController.prototype, 'execute_logic_for_guild')
                .mockImplementationOnce(async () => { return v; });
        });
        const client_mock: Discord.Client = get_guild_mock({});

        // execute
        const result = await controller.activity_history_regist(client_mock);
        expect(result).toBe(expected);
    });

    test('test for activity_history_regist for null', async () => {
        // setup mocks
        jest.spyOn(CronActivityRecordController.prototype, 'execute_logic_for_guild')
            .mockImplementationOnce(async () => { return true; });
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info_all').mockImplementationOnce(async () => {
            return [TestEntity.get_test_server_info()];
        });
        const client_mock: Discord.Client = get_guild_mock(null);

        // execute
        const result = await controller.activity_history_regist(client_mock);
        expect(result).toBe(false);
    });

    test('test for activity_history_regist for exception', async () => {
        // setup mocks
        jest.spyOn(CronActivityRecordController.prototype, 'execute_logic_for_guild')
            .mockImplementationOnce(async () => { throw `exception!`; });
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info_all').mockImplementationOnce(async () => {
            return [TestEntity.get_test_server_info()];
        });
        const client_mock: Discord.Client = get_guild_mock({});

        // execute
        const result = await controller.activity_history_regist(client_mock);
        expect(result).toBe(false);
    });
});

describe('execute_logic_for_guild', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [["test1", "test2"], [true, true], true],
        [["test1", "test2"], [false, true], false],
        [[], [], true],
    ])('test for execute_logic_for_guild, (%s, %s) -> %s', async (
        vc_id_list: string[], main_logic_result_list: boolean[], expected: boolean
    ) => {
        // setup mocks
        jest.spyOn(DiscordCommon, 'get_voice_channel_id_list')
            .mockImplementationOnce(() => { return vc_id_list; });
        main_logic_result_list.forEach((v) => {
            jest.spyOn(CronActivityRecordController.prototype, 'execute_logic_for_channel')
                .mockImplementationOnce(async () => { return v; });
        });

        // execute
        const result = await controller.execute_logic_for_guild({} as Discord.Guild);
        expect(result).toBe(expected);
    });
});

describe('regist_activity_history', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test-guild-id", "test-channel-id", "test-game-name", 1, 2],
        ["", "", "", 0, 0],
    ])('test for regist_activity_history, (%s, %s, %s, %s, %s) -> %s', async (
        guild_id: string, channel_id: string, most_playing_game_name: string, most_playing_game_member_count: number, total_member_count: number
    ) => {
        // setup mocks
        jest.spyOn(ActivityHistoryRepository.prototype, 'insert_t_activity_history')
            .mockImplementationOnce(async () => { return 1; });

        // execute
        const result = await controller.regist_activity_history(guild_id, channel_id, most_playing_game_name, most_playing_game_member_count, total_member_count);
        expect(result.server_id).toEqual(guild_id);
        expect(result.channel_id).toEqual(channel_id);
        expect(result.game_name).toEqual(most_playing_game_name);
        expect(result.member_count).toEqual(most_playing_game_member_count);
        expect(result.total_member_count).toEqual(total_member_count);
        expect(result.delete).toEqual(false);
    });

    test.each([
        ["test-guild-id", "test-channel-id", "test-game-name", 1, 2],
    ])('test for regist_activity_history for exception, (%s, %s, %s, %s, %s) -> %s', async (
        guild_id: string, channel_id: string, most_playing_game_name: string, most_playing_game_member_count: number, total_member_count: number
    ) => {
        // setup mocks
        jest.spyOn(ActivityHistoryRepository.prototype, 'insert_t_activity_history')
            .mockImplementationOnce(async () => { return 0; });

        // execute
        expect(async () => {
            await controller.regist_activity_history(guild_id, channel_id, most_playing_game_name, most_playing_game_member_count, total_member_count);
        }).rejects.toThrowError(`activity history regist failed.`);
    });
});

describe('delete_activity_history', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test-guild-id", 1, 2],
        ["test-guild-id", 1, 0],
    ])('test for delete_activity_history, (%s, %s) -> %s', async (
        guild_id: string, month_limit: number, expected: number
    ) => {
        // setup mocks
        jest.spyOn(ActivityHistoryRepository.prototype, 'delete_t_activity_history')
            .mockImplementationOnce(async () => { return expected; });

        // execute
        const result = await controller.delete_activity_history(guild_id, month_limit);
        expect(result).toEqual(expected);
    });
});

describe('execute_logic_for_channel', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ['test-game', 1, 3, TestEntity.get_test_activity(new Date()), 1, true],
    ])('test for execute_logic_for_channel, (%s, %s, %s, %s, %s) -> %s', async (
        most_play_game_name: string, player_count: number, total_member_count: number, regist_result: ActivityHistory, delete_count: number, expected: boolean
    ) => {
        // setup mocks
        jest.spyOn(CronActivityRecordController.prototype, 'get_playing_game_list')
            .mockImplementationOnce(async () => { return [] });
        jest.spyOn(CronActivityRecordController.prototype, 'get_most_playing_game_name')
            .mockImplementationOnce(() => { return most_play_game_name });
        jest.spyOn(CronActivityRecordController.prototype, 'get_game_player_count')
            .mockImplementationOnce(() => { return player_count });
        jest.spyOn(CronActivityRecordController.prototype, 'get_channel_joined_member_count')
            .mockImplementationOnce(async () => { return total_member_count })
        jest.spyOn(CronActivityRecordController.prototype, 'regist_activity_history')
            .mockImplementationOnce(async () => { return regist_result; });
        jest.spyOn(CronActivityRecordController.prototype, 'delete_activity_history')
            .mockImplementationOnce(async () => { return delete_count });
        const guild = get_guild_mock({});

        // execute
        const result = await controller.execute_logic_for_channel(guild, "test-channel-id");
        expect(result).toBe(expected);
    });

    test.each([
        ['test-game', 1, 3, TestEntity.get_test_activity(new Date()), 1, false],
    ])('test for execute_logic_for_channel in exception, (%s, %s, %s, %s, %s) -> %s', async (
        most_play_game_name: string, player_count: number, total_member_count: number, regist_result: ActivityHistory, delete_count: number, expected: boolean
    ) => {
        // setup mocks
        jest.spyOn(CronActivityRecordController.prototype, 'get_playing_game_list')
            .mockImplementationOnce(async () => { throw `exception!` });
        const guild = get_guild_mock({});

        // execute
        const result = await controller.execute_logic_for_channel(guild, "test-channel-id");
        expect(result).toBe(expected);
    });
});

describe('get_most_playeing_game_name', () => {
    test.each([
        [['c', 'b', 'a', 'b', 'a', 'a'], 'a'],
        [['c', 'b', 'a', 'b', 'a'], 'a'],
        [[], ''],
    ])("test for get_most_playeing_game_name, (%s => %s)", (input: string[], expected: string) => {
        expect(controller.get_most_playing_game_name(input)).toEqual(expected);
    });
});

describe('get_game_player_count', () => {
    test.each([
        ['a', ['c', 'b', 'a', 'b', 'a', 'a'], 3],
        ['b', ['c', 'b', 'a', 'b', 'a'], 2],
        ['d', ['c', 'b', 'a', 'b', 'a'], 0],
        ['a', [], 0],
    ])("test for get_game_player_count, (%s, %s => %s)", (target_game_name: string, input: string[], expected: number) => {
        expect(controller.get_game_player_count(target_game_name, input)).toEqual(expected);
    });
});

describe('get_channel_joined_member_count', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ['test-ch', [], 0],
        ['test-ch', ['test-ch', 'test-ch-a', 'test-ch', 'test-ch', null], 3],
        ['test-ch-a', ['test-ch', 'test-ch-a', 'test-ch', 'test-ch', null], 1],
    ])('test for get_channel_joined_member_count, (%s, %s) -> %s', async (
        target_channel_id: string, test_channel_id_list: (string | null)[], expected: number
    ) => {
        // setup mock
        const mock_member_list = new Map<string, any>();
        test_channel_id_list.forEach((v, idx) => {
            const id = `test-id-${idx}`;
            mock_member_list.set(id, get_test_member(id, v));
        });

        // execute
        const result = await controller.get_channel_joined_member_count(target_channel_id, mock_member_list as Discord.Collection<string, Discord.GuildMember>);
        expect(result).toEqual(expected);
    });
});

describe('get_playing_game_list', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ['test-ch', [], [], []],
        ['test-ch',
            ['test-ch', 'test-ch-a', 'test-ch', 'test-ch', 'test-ch'],
            ['a', 'a', 'b', 'c', 'a'],
            ['a', 'a', 'b', 'c']],
        ['test-ch-b',
            ['test-ch', 'test-ch-a', 'test-ch', 'test-ch', 'test-ch'],
            ['a', 'a', 'b', 'c', 'a'],
            []],
    ])('test for get_playing_game_list, (%s, %s, %s) -> %s', async (
        target_channel_id: string,
        test_channel_id_list: string[],
        playing_activity_list: string[],
        expected_activity_list: string[]
    ) => {
        // setup mock
        const mock_member_list = new Map<string, any>();
        test_channel_id_list.forEach((v, idx) => {
            const id = `test-id-${idx}`;
            mock_member_list.set(id, get_test_member(id, v));
        });

        playing_activity_list.forEach((v) => {
            jest.spyOn(CronActivityRecordController.prototype, 'get_playing_game_name')
                .mockImplementationOnce(() => { return v; });
        });

        // main logic called
        const result = await controller.get_playing_game_list(target_channel_id, mock_member_list as Discord.Collection<string, Discord.GuildMember>);
        expect(result.sort()).toStrictEqual(expected_activity_list);
    });
});

describe('get_playing_game_name', () => {
    test.each([
        ["test_presence_01", Discord.ActivityType.Playing, "test_presence_01"],
        ["test_presence_01", Discord.ActivityType.Streaming, "test_presence_01"],
        ["", Discord.ActivityType.Playing, ""],
        ["test_presence_01", Discord.ActivityType.Custom, ""],
    ])('test for get_playing_game_name (%s, %s -> %s)', (name: string, type: number, exp: string) => {
        const presence_mock = {
            activities: [
                get_activity(type, name)
            ],
        };
        expect(controller.get_playing_game_name(presence_mock as Discord.Presence)).toBe(exp);
    });

    test.each([
        ["test_presence_01", Discord.ActivityType.Playing, [], "test_presence_01"],
        ["test_presence_01", Discord.ActivityType.Playing, ["another_precense"], "test_presence_01"],
        ["test_presence_01", Discord.ActivityType.Playing, ["test_presence_01"], ""],
    ])('test for get_playing_game_name with ignore list (%s, %s -> %s)', (name: string, type: number, ignore_list: string[], exp: string) => {
        const presence_mock = {
            activities: [
                get_activity(type, name)
            ],
        };
        expect(controller.get_playing_game_name(presence_mock as Discord.Presence, ignore_list)).toBe(exp);
    });

    test('test for get_playing_game_name for blank', () => {
        const presence_mock = {
            activities: [],
        };
        expect(controller.get_playing_game_name(presence_mock as unknown as Discord.Presence)).toBe('');
    });

    test('test for get_playing_game_name for null', () => {
        expect(controller.get_playing_game_name(null)).toBe('');
    });
});

describe('get_game_master_alias_name', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ['testing_precense_name', 'test_getted_game_name', 'test_getted_game_name'],
        ['testing_precense_name', '', 'testing_precense_name'],
        ['', '', ''],
    ])('test for get_game_master_alias_name (%s, %s -> %s)', async (presence_name: string, game_name: string, expected: string) => {
        jest.spyOn(GameMasterRepository.prototype, 'get_m_game_master_by_presence_name').mockImplementationOnce((server_id: string, presence_name: string): Promise<GameMaster[]> => {
            return new Promise<GameMaster[]>((resolve, reject) => {
                const game_master = TestEntity.get_test_game_master_info();
                game_master.game_name = game_name;
                game_master.presence_name = presence_name;
                resolve([game_master]);
            });
        });

        const server_id = "server_id";
        const result = await controller.get_game_master_alias_name(server_id, presence_name);
        expect(result).toBe(expected);
    });

    test.each([
        ['testing_precense_name', '', 'testing_precense_name'],
    ])('test for get_game_master_alias_name select blank (%s, %s -> %s)', async (presence_name: string, game_name: string, expected: string) => {
        jest.spyOn(GameMasterRepository.prototype, 'get_m_game_master_by_presence_name').mockImplementationOnce((server_id: string, presence_name: string): Promise<GameMaster[]> => {
            return new Promise<GameMaster[]>((resolve, reject) => {
                resolve([]);
            });
        });

        const server_id = "server_id";
        const result = await controller.get_game_master_alias_name(server_id, presence_name);
        expect(result).toBe(expected);
    });
});