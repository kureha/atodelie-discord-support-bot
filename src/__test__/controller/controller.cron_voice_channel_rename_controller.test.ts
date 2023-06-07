import { CronVoiceChannelRenameController } from "../../controller/cron_voice_channel_rename_controller";

// import discord modules
import * as Discord from 'discord.js';
import { ServerInfoRepository } from "../../db/server_info";
import { ServerInfo } from "../../entity/server_info";
import { TestEntity } from "../common/test_entity";
import { DiscordCommon } from "../../logic/discord_common";

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
    jest.spyOn(CronVoiceChannelRenameController, 'execute_logic_for_guild').mockImplementation(() => {
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
        expect(CronVoiceChannelRenameController.get_update_channel_name(game_name, now_channel_name, prefix_format, prefix_regexp)).toEqual(expected);
    });
});

describe('get_most_played_sort_game_list', () => {
    test.each([
        [[], []],
        [['ccc', 'bbb', 'aaa', 'bbb', 'aaa', 'aaa'], ['aaa', 'bbb', 'ccc']],
        [['aaa', 'aaa'], ['aaa']],
        [['', 'bbb', 'aaa', 'bbb', 'aaa', 'aaa'], ['aaa', 'bbb', '']],
        [['bbb', 'aaa', 'bbb', 'aaa'], ['aaa', 'bbb']],
    ])("get_most_played_sort_game_list test (%s => %s)", (input: string[], expected: string[]) => {
        expect(CronVoiceChannelRenameController.get_sorted_game_list(input)).toEqual(expected);
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
        jest.spyOn(CronVoiceChannelRenameController, 'get_playing_game_name')
            .mockImplementationOnce(() => { return "test_game_001"; })
            .mockImplementationOnce(() => { return "test_game_002"; })
            .mockImplementationOnce(() => { return "test_game_001"; })
            .mockImplementationOnce(() => { return "test_game_003"; }); // 3 is not include for result

        // main logic called
        const result = await CronVoiceChannelRenameController.get_playing_game_list(channel_id, mock_member_list as Discord.Collection<string, Discord.GuildMember>);
        expect(result.sort()).toStrictEqual(["test_game_001", "test_game_001", "test_game_002"]);
    });

    test('test for get_playing_game_list blank.', async () => {
        // setup mock
        const mock_member_list = new Map<string, any>();
        let channel_id = 'test_channel_id_1';

        // main logic called
        const result = await CronVoiceChannelRenameController.get_playing_game_list(channel_id, mock_member_list as Discord.Collection<string, Discord.GuildMember>);
        expect(result.sort()).toStrictEqual([]);
    });
});

describe('get_playing_game_name', () => {
    test.each([
        ["test_presence_01", Discord.ActivityType.Playing, "test_presence_01"],
        ["", Discord.ActivityType.Playing, ""],
        ["test_presence_01", Discord.ActivityType.Custom, ""],
    ])('test for get_playing_game_name (%s, %s -> %s)', (name: string, type: number, exp: string) => {
        const presence_mock = {
            activities: [
                get_activity(type, name)
            ],
        };
        expect(CronVoiceChannelRenameController.get_playing_game_name(presence_mock as Discord.Presence)).toBe(exp);
    });

    test('test for get_playing_game_name for blank', () => {
        const presence_mock = {
            activities: [],
        };
        expect(CronVoiceChannelRenameController.get_playing_game_name(presence_mock as unknown as Discord.Presence)).toBe('');
    });

    test('test for get_playing_game_name for null', () => {
        expect(CronVoiceChannelRenameController.get_playing_game_name(null)).toBe('');
    });
});

describe('update_voice_channel_name', () => {
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
        const result = await CronVoiceChannelRenameController.update_voice_channel_name(client_mock);
        expect(result).toBe(false);
    });

    test('test for update_voice_channel_name', async () => {
        // setup mocks
        setup_update_voice_channel_name_mock([TestEntity.get_test_server_info()]);
        const client_mock: Discord.Client = get_guild_mock_update_voice_channel_name({});

        // expect assertions
        expect.assertions(1);

        // execute
        const result = await CronVoiceChannelRenameController.update_voice_channel_name(client_mock);
        expect(result).toBe(true);
    });

    test('test for update_voice_channel_name for null', async () => {
        // setup mocks
        setup_update_voice_channel_name_mock([TestEntity.get_test_server_info()]);
        const client_mock: Discord.Client = get_guild_mock_update_voice_channel_name(null);

        // expect assertions
        expect.assertions(1);

        // execute
        const result = await CronVoiceChannelRenameController.update_voice_channel_name(client_mock);
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
        jest.spyOn(CronVoiceChannelRenameController, 'get_playing_game_list').mockImplementationOnce(() => {
            return new Promise<string[]>((resolve, reject) => {
                resolve(game_id_list);
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
        const result = await CronVoiceChannelRenameController.execute_logic_for_guild(mock_guild as unknown as Discord.Guild)
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
        jest.spyOn(CronVoiceChannelRenameController, 'get_playing_game_list').mockImplementationOnce(() => {
            return new Promise<string[]>((resolve, reject) => {
                resolve(game_id_list);
            });
        });
        // invalid guild - for execption
        const mock_guild = {
            id: "test_id",
        };

        // expect assertions
        expect.assertions(1);

        // execute
        const result = await CronVoiceChannelRenameController.execute_logic_for_guild(mock_guild as unknown as Discord.Guild)
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
            await CronVoiceChannelRenameController.execute_logic_for_guild({} as unknown as Discord.Guild);
        } catch (err) {
            expect(true).toBe(true);
        }
    });
});