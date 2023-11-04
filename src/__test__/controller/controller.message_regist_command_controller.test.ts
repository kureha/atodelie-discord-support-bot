import { TestDiscordMock } from "../common/test_discord_mock";

import { MessageRegistCommandController } from "../../controller/message_regist_command_controller";

import { DiscordRegisterCommand } from "../../logic/discord_register_command";

import { Constants } from '../../common/constants';

const controller = new MessageRegistCommandController();

describe('regist_command', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_client_id", true],
    ])("test for regist_command, (%s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, client_id: any, expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.message_mock(user_id, Constants.STRING_EMPTY);
        const message = new Mock();
        jest.spyOn(DiscordRegisterCommand.prototype, 'regist_command')
            .mockImplementationOnce(async () => { return []; });

        let result = await controller.regist_command(message, client_id);
        expect(result).toEqual(expected);
    });

    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_client_id", false],
    ])("test for regist_command exception, (%s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, client_id: any, expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.message_mock(user_id, Constants.STRING_EMPTY);
        const message = new Mock();
        jest.spyOn(DiscordRegisterCommand.prototype, 'regist_command')
            .mockImplementationOnce(async () => { throw `exception!` });

        const result = await controller.regist_command(message, client_id);
        expect(result).toEqual(expected);
    });
});

describe('is_regist_command.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["test_user_id", "@test_user_id regist_slash_command", true],
        ["test_user_id", "regist_slash_command", false],
        ["test_user_id", "", false],
    ])('test for is_regist_command, (%s, %s) -> %s', (user_id: any, contents: any, exp: boolean) => {
        // get mock
        const Mock = TestDiscordMock.message_mock(user_id, contents);
        const message = new Mock();

        expect(controller.is_regist_command(user_id, message)).toEqual(exp);
    });
});