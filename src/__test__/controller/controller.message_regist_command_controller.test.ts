import { TestDiscordMock } from "../common/test_discord_mock";

import { MessageRegistCommandController } from "../../controller/message_regist_command_controller";

import { DiscordRegisterCommand } from "../../logic/discord_register_command";

import { Constants } from '../../common/constants';
import { ServerInfo } from "../../entity/server_info";

const controller = new MessageRegistCommandController();

describe('regist commandtest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_client_id"],
    ])("regist command test. (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, client_id: any) => {
        // get mock
        const Mock = TestDiscordMock.message_mock(user_id, Constants.STRING_EMPTY);
        const message = new Mock();

        jest.spyOn(DiscordRegisterCommand.prototype, 'regist_command').mockImplementationOnce((client_id: string): Promise<ServerInfo[]> => {
            return new Promise<ServerInfo[]>((resolve, reject) => { resolve([]) });
        });

        let result = await controller.regist_command(message, client_id, false);
        expect(result).toEqual(true);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_client_id"],
    ])("regist command error test. (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, client_id: any) => {
        // get mock
        const Mock = TestDiscordMock.message_mock(user_id, Constants.STRING_EMPTY);
        const message = new Mock();

        jest.spyOn(DiscordRegisterCommand.prototype, 'regist_command').mockImplementationOnce((client_id: string): Promise<ServerInfo[]> => {
            return new Promise<ServerInfo[]>((resolve, reject) => { resolve([]) });
        });

        let result = await controller.regist_command(message, client_id);
        expect(result).toEqual(false);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_client_id"],
    ])("regist command exception test. (%s, %s, %s, %s)", async (custom_id: any, guild_id: any, user_id: any, client_id: any) => {
        // get mock
        const Mock = TestDiscordMock.message_mock(user_id, Constants.STRING_EMPTY);
        const message = new Mock();

        jest.spyOn(DiscordRegisterCommand.prototype, 'regist_command').mockImplementationOnce((client_id: string) => {
            throw new Error(`test exception`);
        });

        const result = await controller.regist_command(message, client_id, false);
        expect(result).toEqual(false);
    });
});

describe('regist commandtest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_user_id", "@test_user_id regist_slash_command", true],
        ["test_user_id", "regist_slash_command", false],
        ["test_user_id", "", false],
    ])('regist command test', (user_id: any, contents: any, exp: boolean) => {
        // get mock
        const Mock = TestDiscordMock.message_mock(user_id, contents);
        const message = new Mock();

        expect(controller.is_regist_command(user_id, message)).toEqual(exp);
    });
});