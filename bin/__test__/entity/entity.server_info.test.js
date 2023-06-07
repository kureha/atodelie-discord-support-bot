"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import constants
const constants_1 = require("../../common/constants");
// import entity
const server_info_1 = require("../../entity/server_info");
describe("entity.server_info test.", () => {
    test("test for constructor server_info", () => {
        expect(new server_info_1.ServerInfo()).toEqual({
            server_id: constants_1.Constants.STRING_EMPTY,
            channel_id: constants_1.Constants.STRING_EMPTY,
            recruitment_target_role: constants_1.Constants.STRING_EMPTY,
            follow_time: new Date('2000-01-01T00:00:00.000+09:00'),
        });
    });
    test.each([
        ["", "", "", new Date('2000-01-01T00:00:00.000+09:00')],
        ["test_server_id", "test_channel_id", "test_role", new Date('2099-12-31T23:59:00.000+09:00')],
    ])("test for parse server_info, id = %s", (server_id, channel_id, recruitment_target_role, follow_time) => {
        expect(server_info_1.ServerInfo.parse_from_db({
            server_id: server_id,
            channel_id: channel_id,
            recruitment_target_role: recruitment_target_role,
            follow_time: follow_time,
        })).toEqual({
            server_id: server_id,
            channel_id: channel_id,
            recruitment_target_role: recruitment_target_role,
            follow_time: follow_time,
        });
    });
    test.each([
        [undefined, "test_channel_id", "test_role", new Date('2099-12-31T23:59:00.000+09:00')],
        ["test_server_id", undefined, "test_role", new Date('2099-12-31T23:59:00.000+09:00')],
        ["test_server_id", "test_channel_id", undefined, new Date('2099-12-31T23:59:00.000+09:00')],
    ])("test for parse error server_info, {%s, %s, %s, %s}", (server_id, channel_id, recruitment_target_role, follow_time) => {
        expect(server_info_1.ServerInfo.parse_from_db({
            server_id: server_id,
            channel_id: channel_id,
            recruitment_target_role: recruitment_target_role,
            follow_time: follow_time,
        })).toEqual(new server_info_1.ServerInfo());
    });
});
//# sourceMappingURL=entity.server_info.test.js.map