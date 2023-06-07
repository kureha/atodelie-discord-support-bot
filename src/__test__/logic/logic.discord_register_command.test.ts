import { REST } from '@discordjs/rest';
import { DiscordRegisterCommand } from '../../logic/discord_register_command';
import { ServerInfo } from '../../entity/server_info';
import { ServerInfoRepository } from '../../db/server_info';
import { TestEntity } from '../common/test_entity';

// mock all objects
jest.mock('@discordjs/rest');

const RestMock = REST as unknown as jest.Mock;

function mock_discord_rest() {
    RestMock.mockReset();
    RestMock.mockImplementation(() => {
        return {
            put: (v: any): Promise<any> => {
                return new Promise<any>((resolve, reject) => {
                    resolve(true);
                });
            },
            setToken: (v: any): any => {
                return new RestMock();
            },
        }
    });

    jest.spyOn(DiscordRegisterCommand, 'get_url_for_guild_based_command').mockImplementation((client_id: string, guild_id: string): any => {
        return `/test`;
    });

    jest.spyOn(DiscordRegisterCommand, 'get_slash_command').mockImplementation((name: string, desc: string): any => {
        return {};
    });

    jest.spyOn(DiscordRegisterCommand, 'get_regist_slash_command_body').mockImplementation((command_list: any[]): any => {
        return 'test_body';
    });
}

describe("regist_command test.", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("test for regist_command.", async () => {
        // setup mock
        mock_discord_rest();

        // set test data
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info_all').mockImplementation((): Promise<ServerInfo[]> => {
            return new Promise<ServerInfo[]>((resolve, reject) => {
                resolve([TestEntity.get_test_server_info()]);
            });
        });

        const result: ServerInfo[] = await DiscordRegisterCommand.regist_command('test_client_id');
        expect(result.length).toEqual(1);
        expect(result[0]).toStrictEqual(TestEntity.get_test_server_info());
    });

    test("test for regist_command.", async () => {
        // setup mock
        mock_discord_rest();

        // set blank test data
        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info_all').mockImplementation((): Promise<ServerInfo[]> => {
            return new Promise<ServerInfo[]>((resolve, reject) => {
                resolve([]);
            });
        });

        const result: ServerInfo[] = await DiscordRegisterCommand.regist_command('test_client_id');
        expect(result.length).toEqual(0);
    });
});