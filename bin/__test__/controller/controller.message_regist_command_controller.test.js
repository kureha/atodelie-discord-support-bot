"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_discord_mock_1 = require("../common/test_discord_mock");
const message_regist_command_controller_1 = require("../../controller/message_regist_command_controller");
const discord_register_command_1 = require("../../logic/discord_register_command");
const constants_1 = require("../../common/constants");
const controller = new message_regist_command_controller_1.MessageRegistCommandController();
describe('regist commandtest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_client_id"],
    ])("regist command test. (%s, %s, %s, %s)", (custom_id, guild_id, user_id, client_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.message_mock(user_id, constants_1.Constants.STRING_EMPTY);
        const message = new Mock();
        jest.spyOn(discord_register_command_1.DiscordRegisterCommand.prototype, 'regist_command').mockImplementationOnce((client_id) => {
            return new Promise((resolve, reject) => { resolve([]); });
        });
        let result = yield controller.regist_command(message, client_id, false);
        expect(result).toEqual(true);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_client_id"],
    ])("regist command error test. (%s, %s, %s, %s)", (custom_id, guild_id, user_id, client_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.message_mock(user_id, constants_1.Constants.STRING_EMPTY);
        const message = new Mock();
        jest.spyOn(discord_register_command_1.DiscordRegisterCommand.prototype, 'regist_command').mockImplementationOnce((client_id) => {
            return new Promise((resolve, reject) => { resolve([]); });
        });
        let result = yield controller.regist_command(message, client_id);
        expect(result).toEqual(false);
    }));
    test.each([
        ["test_custom_id", "test_server_id", "test_user_id", "test_client_id"],
    ])("regist command exception test. (%s, %s, %s, %s)", (custom_id, guild_id, user_id, client_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.message_mock(user_id, constants_1.Constants.STRING_EMPTY);
        const message = new Mock();
        jest.spyOn(discord_register_command_1.DiscordRegisterCommand.prototype, 'regist_command').mockImplementationOnce((client_id) => {
            throw new Error(`test exception`);
        });
        const result = yield controller.regist_command(message, client_id, false);
        expect(result).toEqual(false);
    }));
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
    ])('regist command test', (user_id, contents, exp) => {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.message_mock(user_id, contents);
        const message = new Mock();
        expect(controller.is_regist_command(user_id, message)).toEqual(exp);
    });
});
//# sourceMappingURL=controller.message_regist_command_controller.test.js.map