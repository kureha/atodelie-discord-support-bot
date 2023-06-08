"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import constants
const constants_1 = require("../../common/constants");
// import entity
const announcement_history_1 = require("../../entity/announcement_history");
describe("entity.announcement_history test.", () => {
    test("test for constructor announcement_history", () => {
        expect(new announcement_history_1.AnnouncementHistory()).toEqual({
            server_id: constants_1.Constants.STRING_EMPTY,
            channel_id: constants_1.Constants.STRING_EMPTY,
            game_name: constants_1.Constants.STRING_EMPTY,
            announcement_time: constants_1.Constants.get_default_date()
        });
    });
    test.each([
        ["", "", "", new Date('1970-01-01T00:00:00.000+09:00')],
        ["test_server_id", "test_channel_id", "test_game_id", new Date('1970-01-01T00:00:00.000+09:00')],
    ])("test for parse announcement history, {%s, %s, %s, %s}", (server_id, channel_id, game_name, announcement_time) => {
        expect(announcement_history_1.AnnouncementHistory.parse_from_db({
            server_id: server_id,
            channel_id: channel_id,
            game_name: game_name,
            announcement_time: announcement_time,
        })).toEqual({
            server_id: server_id,
            channel_id: channel_id,
            game_name: game_name,
            announcement_time: announcement_time,
        });
    });
    test.each([
        [undefined, "test_channel_id", "test_game_id", new Date('1970-01-01T00:00:00.000+09:00')],
        ["test_server_id", undefined, "test_game_id", new Date('1970-01-01T00:00:00.000+09:00')],
        ["test_server_id", "test_channel_id", undefined, new Date('1970-01-01T00:00:00.000+09:00')],
    ])("test for parse error announcement history, {%s, %s, %s, %s, %s, %s, %s}", (server_id, channel_id, game_name, announcement_time) => {
        expect(announcement_history_1.AnnouncementHistory.parse_from_db({
            server_id: server_id,
            channel_id: channel_id,
            game_name: game_name,
            announcement_time: announcement_time,
        })).toEqual(new announcement_history_1.AnnouncementHistory());
    });
});
//# sourceMappingURL=entity.announcement_history.test.js.map