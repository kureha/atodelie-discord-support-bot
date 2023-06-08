// import discord modules
import * as Discord from 'discord.js';
import { ServerInfoRepository } from "../../db/server_info";
import { ServerInfo } from "../../entity/server_info";
import { TestEntity } from "../common/test_entity";
import { DiscordCommon } from "../../logic/discord_common";
import { GameMaster } from "../../entity/game_master";
import { GameMasterRepository } from "../../db/game_master";
import { ActivityHistoryRepository } from "../../db/activity_history";
import { ActivityHistory } from "../../entity/activity_history";
import { CronActivityRecordController } from "../../controller/cron_activity_controller";

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
 * mockup create function for update_voice_channel_name
 */
function setup_update_voice_channel_name_mock(server_info_list: ServerInfo[]) {
    jest.spyOn(CronActivityRecordController.prototype, 'execute_logic_for_guild').mockImplementation(() => {
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
 * mockup for guid
 * @returns 
 */
function get_guild_mock_activity_history_regist_name(ret: any): any {
    return {
        guilds: {
            resolve: (): any => {
                return ret;
            },
        },
    };
}

describe("update_channel_name", () => {
    test.each([
        ["aaa", "[bbb] テストチャンネル", '[%%GAME_NAME%%] %%CHANNEL_NAME%%', /^\[[^\]]+\] /, "[aaa] テストチャンネル"],
        ["更新ゲーム", "[テストゲーム] テストチャンネル", '[%%GAME_NAME%%] %%CHANNEL_NAME%%', /^\[[^\]]+\] /, "[更新ゲーム] テストチャンネル"],
        ["", "[bbb] テストチャンネル", '[%%GAME_NAME%%] %%CHANNEL_NAME%%', /^\[[^\]]+\] /, "テストチャンネル"],
    ])("test for update_channel_name (%s, %s, %s, %s => %s)", (game_name: string, now_channel_name: string, prefix_format: string, prefix_regexp: RegExp, expected: string) => {
        expect(controller.get_update_channel_name(game_name, now_channel_name, prefix_format, prefix_regexp)).toEqual(expected);
    });
});

describe('get_game_player_count', () => {
    test.each([
        ['a', ['c', 'b', 'a', 'b', 'a', 'a'], 3],
        ['b', ['c', 'b', 'a', 'b', 'a'], 2],
        ['d', ['c', 'b', 'a', 'b', 'a'], 0],
        ['a', [], 0],
    ])("get_most_playeing_game_name test (%s, %s => %s)", (target_game_name: string, input: string[], expected: number) => {
        expect(controller.get_game_player_count(target_game_name, input)).toEqual(expected);
    });
});

describe('get_most_playeing_game_name', () => {
    test.each([
        [['c', 'b', 'a', 'b', 'a', 'a'], 'a'],
        [['c', 'b', 'a', 'b', 'a'], 'a'],
        [[], ''],
    ])("get_most_playeing_game_name test (%s => %s)", (input: string[], expected: string) => {
        expect(controller.get_most_playing_game_name(input)).toEqual(expected);
    });
});

describe('get_channel_joined_member_count', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test('test for get_channel_joined_member_count.', async () => {
        // setup mock
        const mock_member_list = new Map<string, any>();
        let channel_id = 'test_channel_id_1';
        // data 1
        let id = 'test_user_id_1';
        mock_member_list.set(id, get_test_member(id, channel_id));
        // data 2
        id = 'test_user_id_2';
        mock_member_list.set(id, get_test_member(id, channel_id + "_another"));
        // data 3
        id = 'test_user_id_3';
        mock_member_list.set(id, get_test_member(id, channel_id));
        // data 4
        id = 'test_user_id_4';
        mock_member_list.set(id, get_test_member(id, channel_id));
        // data 5
        id = 'test_user_id_5';
        mock_member_list.set(id, get_test_member(id, null));

        // main logic called
        const result = await controller.get_channel_joined_member_count(channel_id, mock_member_list as Discord.Collection<string, Discord.GuildMember>);
        expect(result).toEqual(3);
    });

    test('test for get_playing_game_list blank.', async () => {
        // setup mock
        const mock_member_list = new Map<string, any>();
        let channel_id = 'test_channel_id_1';

        // main logic called
        const result = await controller.get_channel_joined_member_count(channel_id, mock_member_list as Discord.Collection<string, Discord.GuildMember>);
        expect(result).toEqual(0);
    });
});

describe('get_playing_game_list', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test('test for get_playing_game_list.', async () => {
        // setup mock
        const mock_member_list = new Map<string, any>();
        let channel_id = 'test_channel_id_1';
        // data 1
        let id = 'test_user_id_1';
        mock_member_list.set(id, get_test_member(id, channel_id));
        // data 2
        id = 'test_user_id_2';
        mock_member_list.set(id, get_test_member(id, channel_id + "_another"));
        // data 3
        id = 'test_user_id_3';
        mock_member_list.set(id, get_test_member(id, channel_id));
        // data 4
        id = 'test_user_id_4';
        mock_member_list.set(id, get_test_member(id, channel_id));
        // data 5
        id = 'test_user_id_5';
        mock_member_list.set(id, get_test_member(id, null));

        // mockup presence (presence is called for valid channel)
        jest.spyOn(CronActivityRecordController.prototype, 'get_playing_game_name')
            .mockImplementationOnce(() => { return "test_game_001"; })
            .mockImplementationOnce(() => { return "test_game_002"; })
            .mockImplementationOnce(() => { return "test_game_001"; })
            .mockImplementationOnce(() => { return "test_game_003"; }); // 3 is not include for result

        // main logic called
        const result = await controller.get_playing_game_list(channel_id, mock_member_list as Discord.Collection<string, Discord.GuildMember>);
        expect(result.sort()).toStrictEqual(["test_game_001", "test_game_001", "test_game_002"]);
    });

    test('test for get_playing_game_list blank.', async () => {
        // setup mock
        const mock_member_list = new Map<string, any>();
        let channel_id = 'test_channel_id_1';

        // main logic called
        const result = await controller.get_playing_game_list(channel_id, mock_member_list as Discord.Collection<string, Discord.GuildMember>);
        expect(result.sort()).toStrictEqual([]);
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

describe('activity_history_regist', () => {
    beforeEach(() => {
        jest.spyOn(ActivityHistoryRepository.prototype, 'insert_t_activity_history').mockImplementationOnce((v: ActivityHistory) => {
            return new Promise<number>((resolve) => {
                resolve(1);
            });
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test('test for activity_history_regist for blank', async () => {
        // setup mocks
        setup_update_voice_channel_name_mock([]);
        const client_mock: Discord.Client = get_guild_mock_activity_history_regist_name({});

        // expect assertions
        expect.assertions(1);

        // execute
        const result = await controller.activity_history_regist(client_mock);
        expect(result).toBe(false);
    });

    test('test for activity_history_regist', async () => {
        // setup mocks
        setup_update_voice_channel_name_mock([TestEntity.get_test_server_info()]);
        const client_mock: Discord.Client = get_guild_mock_activity_history_regist_name({});

        // expect assertions
        expect.assertions(1);

        // execute
        const result = await controller.activity_history_regist(client_mock);
        expect(result).toBe(true);
    });

    test('test for activity_history_regist for null', async () => {
        // setup mocks
        setup_update_voice_channel_name_mock([TestEntity.get_test_server_info()]);
        const client_mock: Discord.Client = get_guild_mock_activity_history_regist_name(null);

        // expect assertions
        expect.assertions(1);

        // execute
        const result = await controller.activity_history_regist(client_mock);
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
        jest.spyOn(CronActivityRecordController.prototype, 'get_playing_game_list').mockImplementationOnce(() => {
            return new Promise<string[]>((resolve, reject) => {
                resolve(game_id_list);
            });
        });
        jest.spyOn(CronActivityRecordController.prototype, 'get_game_master_alias_name').mockImplementation((v: string, p: string): Promise<string> => {
            return new Promise<string>((resolve, reject) => {
                resolve('');
            });
        });
        jest.spyOn(ActivityHistoryRepository.prototype, 'insert_t_activity_history').mockImplementation(() => {
            return new Promise<number>((resolve) => { resolve(1) });
        });
        jest.spyOn(ActivityHistoryRepository.prototype, 'delete_t_activity_history').mockImplementation(() => {
            return new Promise<number>((resolve) => { resolve(2) });
        });
        const mock_guild = {
            id: "test_id",
            members: {
                cache: [],
            },
        };

        // execute
        const result = await controller.execute_logic_for_guild(mock_guild as unknown as Discord.Guild)
        expect(result).toBe(true);
    });

    test.each([
        [["test_game_id_1", "test_game_id_1", "test_game_id_2"], ["test_server_1"]],
    ])('execute_logic_for_guild for execption', async (game_id_list: string[], voice_channel_id_list: string[]) => {
        // setup mocks
        jest.spyOn(DiscordCommon, 'get_voice_channel_id_list').mockImplementationOnce(() => {
            return voice_channel_id_list;
        });
        jest.spyOn(DiscordCommon, 'get_voice_channel').mockImplementationOnce(() => {
            return mock_get_voice_channel("test_channel_id", "test_channel_name");
        });
        jest.spyOn(CronActivityRecordController.prototype, 'get_playing_game_list').mockImplementationOnce(() => {
            return new Promise<string[]>((resolve, reject) => {
                resolve(game_id_list);
            });
        });
        jest.spyOn(CronActivityRecordController.prototype, 'get_game_master_alias_name').mockImplementation((v: string, p: string): Promise<string> => {
            return new Promise<string>((resolve, reject) => {
                resolve('');
            });
        });
        jest.spyOn(ActivityHistoryRepository.prototype, 'insert_t_activity_history').mockImplementation(() => {
            return new Promise<number>((resolve) => { resolve(1) });
        });
        jest.spyOn(ActivityHistoryRepository.prototype, 'delete_t_activity_history').mockImplementation(() => {
            return new Promise<number>((resolve) => { resolve(2) });
        });
        // invalid guild - for execption
        const mock_guild = {
            id: "test_id",
        };

        // execute
        const result = await controller.execute_logic_for_guild(mock_guild as unknown as Discord.Guild)
        expect(result).toBe(true);
    });

    test.each([
        [["test_game_id_1", "test_game_id_1", "test_game_id_2"], ["test_server_1"]],
    ])('execute_logic_for_guild for cant insert history', async (game_id_list: string[], voice_channel_id_list: string[]) => {
        // setup mocks
        jest.spyOn(DiscordCommon, 'get_voice_channel_id_list').mockImplementationOnce(() => {
            return voice_channel_id_list;
        });
        jest.spyOn(DiscordCommon, 'get_voice_channel').mockImplementationOnce(() => {
            return mock_get_voice_channel("test_channel_id", "test_channel_name");
        });
        jest.spyOn(CronActivityRecordController.prototype, 'get_playing_game_list').mockImplementationOnce(() => {
            return new Promise<string[]>((resolve, reject) => {
                resolve(game_id_list);
            });
        });
        jest.spyOn(CronActivityRecordController.prototype, 'get_game_master_alias_name').mockImplementation((v: string, p: string): Promise<string> => {
            return new Promise<string>((resolve, reject) => {
                resolve('');
            });
        });
        jest.spyOn(ActivityHistoryRepository.prototype, 'insert_t_activity_history').mockImplementation(() => {
            // for test
            return new Promise<number>((resolve) => { resolve(0) });
        });
        jest.spyOn(ActivityHistoryRepository.prototype, 'delete_t_activity_history').mockImplementation(() => {
            return new Promise<number>((resolve) => { resolve(2) });
        });
        const mock_guild = {
            id: "test_id",
            members: {
                cache: [],
            },
        };

        // execute
        const result = await controller.execute_logic_for_guild(mock_guild as unknown as Discord.Guild)
        expect(result).toBe(true);
    });

    test.each([
        [["test_game_id_1", "test_game_id_1", "test_game_id_2"], ["test_server_1"]],
    ])('execute_logic_for_guild for exception', async (game_id_list: string[], voice_channel_id_list: string[]) => {
        // setup mocks
        jest.spyOn(DiscordCommon, 'get_voice_channel_id_list').mockImplementationOnce(() => {
            return null as unknown as string[];
        });

        // execute
        expect(async () => {
            await controller.execute_logic_for_guild({} as unknown as Discord.Guild)
        }).rejects;
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