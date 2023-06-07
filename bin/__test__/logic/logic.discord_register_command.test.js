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
const rest_1 = require("@discordjs/rest");
const discord_register_command_1 = require("../../logic/discord_register_command");
const server_info_1 = require("../../db/server_info");
const test_entity_1 = require("../common/test_entity");
// mock all objects
jest.mock('@discordjs/rest');
const RestMock = rest_1.REST;
function mock_discord_rest() {
    RestMock.mockReset();
    RestMock.mockImplementation(() => {
        return {
            put: (v) => {
                return new Promise((resolve, reject) => {
                    resolve(true);
                });
            },
            setToken: (v) => {
                return new RestMock();
            },
        };
    });
    jest.spyOn(discord_register_command_1.DiscordRegisterCommand, 'get_url_for_guild_based_command').mockImplementation((client_id, guild_id) => {
        return `/test`;
    });
    jest.spyOn(discord_register_command_1.DiscordRegisterCommand, 'get_slash_command').mockImplementation((name, desc) => {
        return {};
    });
    jest.spyOn(discord_register_command_1.DiscordRegisterCommand, 'get_regist_slash_command_body').mockImplementation((command_list) => {
        return 'test_body';
    });
}
describe("regist_command test.", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test("test for regist_command.", () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mock
        mock_discord_rest();
        // set test data
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info_all').mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve([test_entity_1.TestEntity.get_test_server_info()]);
            });
        });
        const result = yield discord_register_command_1.DiscordRegisterCommand.regist_command('test_client_id');
        expect(result.length).toEqual(1);
        expect(result[0]).toStrictEqual(test_entity_1.TestEntity.get_test_server_info());
    }));
    test("test for regist_command.", () => __awaiter(void 0, void 0, void 0, function* () {
        // setup mock
        mock_discord_rest();
        // set blank test data
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info_all').mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        });
        const result = yield discord_register_command_1.DiscordRegisterCommand.regist_command('test_client_id');
        expect(result.length).toEqual(0);
    }));
});
//# sourceMappingURL=logic.discord_register_command.test.js.map