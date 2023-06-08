"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import constants
const constants_1 = require("../../common/constants");
// import entity
const announcement_info_1 = require("../../entity/announcement_info");
const test_entity_1 = require("../common/test_entity");
describe("entity.announcement_info test.", () => {
    test("test for constructor announcement_info", () => {
        expect(new announcement_info_1.AnnouncementInfo()).toEqual({
            server_id: constants_1.Constants.STRING_EMPTY,
            channel_id: constants_1.Constants.STRING_EMPTY,
            current_game_member_count: 0,
            max_total_member_count: 0,
            game_name: constants_1.Constants.STRING_EMPTY,
            game_start_time: constants_1.Constants.get_default_date()
        });
    });
    test.each([
        ["", "", 0, 0, "", new Date('1970-01-01T00:00:00.000+09:00')],
        ["test_server_id", "test_channel_id", 1, 2, "test_game_id", new Date('1970-01-01T00:00:00.000+09:00')],
    ])("test for parse announcement info, {%s, %s, %s, %s, %s, %s}", (server_id, channel_id, current_game_member_count, max_total_member_count, game_name, game_start_time) => {
        expect(announcement_info_1.AnnouncementInfo.parse_from_db({
            server_id: server_id,
            channel_id: channel_id,
            current_game_member_count: current_game_member_count,
            max_total_member_count: max_total_member_count,
            game_name: game_name,
            game_start_time: game_start_time,
        })).toEqual({
            server_id: server_id,
            channel_id: channel_id,
            current_game_member_count: current_game_member_count,
            max_total_member_count: max_total_member_count,
            game_name: game_name,
            game_start_time: game_start_time,
        });
    });
    test.each([
        [undefined, "test_channel_id", 1, 2, "test_game_id", new Date('1970-01-01T00:00:00.000+09:00')],
        ["test_server_id", undefined, 1, 2, "test_game_id", new Date('1970-01-01T00:00:00.000+09:00')],
        ["test_server_id", "test_channel_id", 1, 2, undefined, new Date('1970-01-01T00:00:00.000+09:00')],
    ])("test for parse error announcement info, {%s, %s, %s, %s, %s, %s}", (server_id, channel_id, current_game_member_count, max_total_member_count, game_name, game_start_time) => {
        expect(announcement_info_1.AnnouncementInfo.parse_from_db({
            server_id: server_id,
            channel_id: channel_id,
            current_game_member_count: current_game_member_count,
            max_total_member_count: max_total_member_count,
            game_name: game_name,
            game_start_time: game_start_time,
        })).toEqual(new announcement_info_1.AnnouncementInfo());
    });
    test('test for announcement info to_history', () => {
        // get test entity
        const d = new Date('1970-01-01T00:00:00.000+09:00');
        const v = test_entity_1.TestEntity.get_test_announcement_info(d);
        // to history
        const result = v.to_history();
        // assertions
        expect(v.server_id).toEqual(result.server_id);
        expect(v.channel_id).toEqual(result.channel_id);
        expect(v.game_name).toEqual(result.game_name);
        expect(v.game_start_time).not.toEqual(result.announcement_time);
    });
});
//# sourceMappingURL=entity.announcement_info.test.js.map