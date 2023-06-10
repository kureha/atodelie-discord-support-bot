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

describe('update_voice_channel_name', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [[TestEntity.get_test_server_info(), TestEntity.get_test_server_info()], [true, true], true],
        [[TestEntity.get_test_server_info(), TestEntity.get_test_server_info()], [false, true], false],
        [[], [], false],
    ])('test for update_voice_channel_name, (%s, %s) -> %s', async (
        server_list: ServerInfo[], main_logic_result_list: boolean[], expected: boolean
    ) => {
        // setup mocks
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info_all')
            .mockImplementationOnce(async () => { return server_list; });
        main_logic_result_list.forEach((v) => {
            jest.spyOn(CronVoiceChannelRenameController.prototype, 'execute_logic_for_guild')
                .mockImplementationOnce(async () => { return v; });
        });
        const client_mock: Discord.Client = get_guild_mock({});

        // execute
        const result = await controller.update_voice_channel_name(client_mock);
        expect(result).toBe(expected);
    });

    test('test for update_voice_channel_name for null', async () => {
        // setup mocks
        jest.spyOn(CronVoiceChannelRenameController.prototype, 'execute_logic_for_guild')
            .mockImplementationOnce(async () => { return true; });
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info_all').mockImplementationOnce(async () => {
            return [TestEntity.get_test_server_info()];
        });
        const client_mock: Discord.Client = get_guild_mock(null);

        // execute
        const result = await controller.update_voice_channel_name(client_mock);
        expect(result).toBe(false);
    });

    test('test for update_voice_channel_name for exception', async () => {
        // setup mocks
        jest.spyOn(CronVoiceChannelRenameController.prototype, 'execute_logic_for_guild')
            .mockImplementationOnce(async () => { throw `exception!`; });
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info_all').mockImplementationOnce(async () => {
            return [TestEntity.get_test_server_info()];
        });
        const client_mock: Discord.Client = get_guild_mock({});

        // execute
        const result = await controller.update_voice_channel_name(client_mock);
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
            jest.spyOn(CronVoiceChannelRenameController.prototype, 'execute_logic_for_channel')
                .mockImplementationOnce(async () => { return v; });
        });

        // execute
        const result = await controller.execute_logic_for_guild({} as Discord.Guild);
        expect(result).toBe(expected);
    });
});

describe('execute_logic_for_channel', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [[TestEntity.get_test_activity(new Date)], 'ailas-name', 'b-name', 'a-name', true],
        [[TestEntity.get_test_activity(new Date)], 'ailas-name', 'a-name', 'a-name', true],
        [[TestEntity.get_test_activity(new Date)], '', 'a-name', 'a-name', true],
        [[], '', 'a-name', 'a-name', false],
        [[undefined], '', 'a-name', 'a-name', false],
    ])('test for execute_logic_for_channel, (%s, %s, %s, %s) -> %s', async (
        act_his_list: (ActivityHistory | undefined)[],
        alias_name: string,
        before_ch_name: string,
        after_ch_name: string,
        expected: boolean) => {
        // setup mocks
        jest.spyOn(ActivityHistoryRepository.prototype, 'get_t_activity_history')
            .mockImplementationOnce(async () => { return act_his_list as ActivityHistory[]; });
        jest.spyOn(DiscordCommon, 'get_voice_channel')
            .mockImplementationOnce(async () => { return { name: before_ch_name, setName: (v: any) => { } } as Discord.VoiceChannel; });
        jest.spyOn(CronVoiceChannelRenameController.prototype, 'get_game_master_alias_name')
            .mockImplementationOnce(async () => { return alias_name; });
        jest.spyOn(CronVoiceChannelRenameController.prototype, 'get_update_channel_name')
            .mockImplementationOnce(() => { return after_ch_name; });
        const mock_guild = { id: "test_id" };

        // execute
        const result = await controller.execute_logic_for_channel(mock_guild as unknown as Discord.Guild, 'test-ch-id');
        expect(result).toBe(expected);
    });



    test.each([
        [[TestEntity.get_test_activity(new Date)], 'ailas-name', 'b-name', 'a-name', false],
        [[TestEntity.get_test_activity(new Date)], 'ailas-name', 'a-name', 'a-name', false],
    ])('test for execute_logic_for_channel for exception, (%s, %s, %s, %s) -> %s', async (
        act_his_list: (ActivityHistory | undefined)[],
        alias_name: string,
        before_ch_name: string,
        after_ch_name: string,
        expected: boolean) => {
        // setup mocks
        jest.spyOn(ActivityHistoryRepository.prototype, 'get_t_activity_history')
            .mockImplementationOnce(async () => { throw `exception!`; });
        const mock_guild = { id: "test_id" };

        // execute
        const result = await controller.execute_logic_for_channel(mock_guild as unknown as Discord.Guild, 'test-ch-id');
        expect(result).toBe(expected);
    });
});

describe("update_channel_name", () => {
    test.each([
        ["aaa", "[bbb] テストチャンネル", '[%%GAME_NAME%%] %%CHANNEL_NAME%%', /^\[[^\]]+\] /, "[aaa] テストチャンネル"],
        ["更新ゲーム", "[テストゲーム] テストチャンネル", '[%%GAME_NAME%%] %%CHANNEL_NAME%%', /^\[[^\]]+\] /, "[更新ゲーム] テストチャンネル"],
        ["", "[bbb] テストチャンネル", '[%%GAME_NAME%%] %%CHANNEL_NAME%%', /^\[[^\]]+\] /, "テストチャンネル"],
    ])("test for update_channel_name (%s, %s, %s, %s => %s)", (game_name: string, now_channel_name: string, prefix_format: string, prefix_regexp: RegExp, expected: string) => {
        expect(controller.get_update_channel_name(game_name, now_channel_name, prefix_format, prefix_regexp)).toEqual(expected);
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
        jest.spyOn(GameMasterRepository.prototype, 'get_m_game_master_by_presence_name')
            .mockImplementationOnce(async (server_id: string, presence_name: string): Promise<GameMaster[]> => {
                const game_master = TestEntity.get_test_game_master_info();
                game_master.game_name = game_name;
                game_master.presence_name = presence_name;
                return [game_master];
            });

        const server_id = "server_id";
        const result = await controller.get_game_master_alias_name(server_id, presence_name);
        expect(result).toBe(expected);
    });

    test.each([
        ['testing_precense_name', '', 'testing_precense_name'],
    ])('test for get_game_master_alias_name select blank (%s, %s -> %s)', async (presence_name: string, game_name: string, expected: string) => {
        jest.spyOn(GameMasterRepository.prototype, 'get_m_game_master_by_presence_name')
            .mockImplementationOnce(async () => { return []; });

        const server_id = "server_id";
        const result = await controller.get_game_master_alias_name(server_id, presence_name);
        expect(result).toBe(expected);
    });
});