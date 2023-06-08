import { CronVoiceChannelRenameController } from "../../controller/cron_voice_channel_rename_controller";

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

const controller = new CronVoiceChannelRenameController();

/**
 * mockup create function for update_voice_channel_name
 */
function setup_update_voice_channel_name_mock(server_info_list: ServerInfo[]) {
    jest.spyOn(CronVoiceChannelRenameController.prototype, 'execute_logic_for_guild').mockImplementation(() => {
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
function get_guild_mock_update_voice_channel_name(ret: any): any {
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

describe('update_voice_channel_name', () => {
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

    test('test for update_voice_channel_name for blank', async () => {
        // setup mocks
        setup_update_voice_channel_name_mock([]);
        const client_mock: Discord.Client = get_guild_mock_update_voice_channel_name({});

        // expect assertions
        expect.assertions(1);

        // execute
        const result = await controller.update_voice_channel_name(client_mock);
        expect(result).toBe(false);
    });

    test('test for update_voice_channel_name', async () => {
        // setup mocks
        setup_update_voice_channel_name_mock([TestEntity.get_test_server_info()]);
        const client_mock: Discord.Client = get_guild_mock_update_voice_channel_name({});

        // expect assertions
        expect.assertions(1);

        // execute
        const result = await controller.update_voice_channel_name(client_mock);
        expect(result).toBe(true);
    });

    test('test for update_voice_channel_name for null', async () => {
        // setup mocks
        setup_update_voice_channel_name_mock([TestEntity.get_test_server_info()]);
        const client_mock: Discord.Client = get_guild_mock_update_voice_channel_name(null);

        // expect assertions
        expect.assertions(1);

        // execute
        const result = await controller.update_voice_channel_name(client_mock);
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
        jest.spyOn(ActivityHistoryRepository.prototype, 'get_t_activity_history').mockImplementationOnce(() => {
            return new Promise<ActivityHistory[]>((resolve, reject) => {
                resolve([TestEntity.get_test_activity(new Date('1970-01-01T00:00:00.000+09:00'))]);
            });
        });
        jest.spyOn(CronVoiceChannelRenameController.prototype, 'get_game_master_alias_name').mockImplementation((v: string, p: string): Promise<string> => {
            return new Promise<string>((resolve, reject) => {
                resolve('most-playing-game');
            });
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
        const result = await controller.execute_logic_for_guild(mock_guild as unknown as Discord.Guild)
        expect(result).toBe(true);
    });

    test.each([
        [["test_game_id_1", "test_game_id_1", "test_game_id_2"], ["test_server_1"]],
    ])('execute_logic_for_guild for not update', async (game_id_list: string[], voice_channel_id_list: string[]) => {
        // setup mocks
        jest.spyOn(DiscordCommon, 'get_voice_channel_id_list').mockImplementationOnce(() => {
            return voice_channel_id_list;
        });
        jest.spyOn(DiscordCommon, 'get_voice_channel').mockImplementationOnce(() => {
            return mock_get_voice_channel("test_channel_id", "test_channel_name");
        });
        jest.spyOn(ActivityHistoryRepository.prototype, 'get_t_activity_history').mockImplementationOnce(() => {
            return new Promise<ActivityHistory[]>((resolve, reject) => {
                resolve([TestEntity.get_test_activity(new Date('1970-01-01T00:00:00.000+09:00'))]);
            });
        });
        jest.spyOn(CronVoiceChannelRenameController.prototype, 'get_game_master_alias_name').mockImplementation((v: string, p: string): Promise<string> => {
            return new Promise<string>((resolve, reject) => {
                resolve('');
            });
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
        const result = await controller.execute_logic_for_guild(mock_guild as unknown as Discord.Guild)
        expect(result).toBe(true);
    });

    test.each([
        [["test_game_id_1", "test_game_id_1", "test_game_id_2"], ["test_server_1"]],
    ])('execute_logic_for_guild for undefined activity', async (game_id_list: string[], voice_channel_id_list: string[]) => {
        // setup mocks
        jest.spyOn(DiscordCommon, 'get_voice_channel_id_list').mockImplementationOnce(() => {
            return voice_channel_id_list;
        });
        jest.spyOn(DiscordCommon, 'get_voice_channel').mockImplementationOnce(() => {
            return mock_get_voice_channel("test_channel_id", "test_channel_name");
        });
        jest.spyOn(ActivityHistoryRepository.prototype, 'get_t_activity_history').mockImplementationOnce(() => {
            return new Promise<ActivityHistory[]>((resolve, reject) => {
                resolve([undefined as unknown as ActivityHistory]);
            });
        });
        jest.spyOn(CronVoiceChannelRenameController.prototype, 'get_game_master_alias_name').mockImplementation((v: string, p: string): Promise<string> => {
            return new Promise<string>((resolve, reject) => {
                resolve('most-playing-game');
            });
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
        jest.spyOn(ActivityHistoryRepository.prototype, 'get_t_activity_history').mockImplementationOnce(() => {
            return new Promise<ActivityHistory[]>((resolve, reject) => {
                resolve([TestEntity.get_test_activity(new Date('1970-01-01T00:00:00.000+09:00'))]);
            });
        });
        jest.spyOn(CronVoiceChannelRenameController.prototype, 'get_game_master_alias_name').mockImplementation((v: string, p: string): Promise<string> => {
            return new Promise<string>((resolve, reject) => {
                resolve('most-playing-game');
            });
        });
        // invalid guild - for execption
        const mock_guild = {
            id: "test_id",
        };

        // expect assertions
        expect.assertions(1);

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

        // expect assertions
        expect.assertions(1);

        // execute
        try {
            await controller.execute_logic_for_guild({} as unknown as Discord.Guild);
        } catch (err) {
            expect(true).toBe(true);
        }
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