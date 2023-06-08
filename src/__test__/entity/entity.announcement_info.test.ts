// import constants
import { Constants } from "../../common/constants";

// import entity
import { AnnouncementInfo } from "../../entity/announcement_info";
import { TestEntity } from "../common/test_entity";

describe("entity.announcement_info test.", () => {
    test("test for constructor announcement_info", () => {
        expect(new AnnouncementInfo()).toEqual({
            server_id: Constants.STRING_EMPTY,
            channel_id: Constants.STRING_EMPTY,
            current_game_member_count: 0,
            max_total_member_count: 0,
            game_name: Constants.STRING_EMPTY,
            game_start_time: Constants.get_default_date()
        });
    });

    test.each(
        [
            ["", "", 0, 0, "", new Date('1970-01-01T00:00:00.000+09:00')],
            ["test_server_id", "test_channel_id", 1, 2, "test_game_id", new Date('1970-01-01T00:00:00.000+09:00')],
        ]
    )("test for parse announcement info, {%s, %s, %s, %s, %s, %s}", (server_id: string,
        channel_id: string,
        current_game_member_count: number,
        max_total_member_count: number,
        game_name: string,
        game_start_time: Date
    ) => {
        expect(AnnouncementInfo.parse_from_db({
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


    test.each(
        [
            [undefined, "test_channel_id", 1, 2, "test_game_id", new Date('1970-01-01T00:00:00.000+09:00')],
            ["test_server_id", undefined, 1, 2, "test_game_id", new Date('1970-01-01T00:00:00.000+09:00')],
            ["test_server_id", "test_channel_id", 1, 2, undefined, new Date('1970-01-01T00:00:00.000+09:00')],
        ]
    )("test for parse error announcement info, {%s, %s, %s, %s, %s, %s}", (server_id: any,
        channel_id: any,
        current_game_member_count: any,
        max_total_member_count: any,
        game_name: any,
        game_start_time: any
    ) => {
        expect(AnnouncementInfo.parse_from_db({
            server_id: server_id,
            channel_id: channel_id,
            current_game_member_count: current_game_member_count,
            max_total_member_count: max_total_member_count,
            game_name: game_name,
            game_start_time: game_start_time,
        })).toEqual(new AnnouncementInfo());
    });

    test('test for announcement info to_history', () => {
        // get test entity
        const d = new Date('1970-01-01T00:00:00.000+09:00');
        const v = TestEntity.get_test_announcement_info(d);

        // to history
        const result = v.to_history();

        // assertions
        expect(v.server_id).toEqual(result.server_id);
        expect(v.channel_id).toEqual(result.channel_id);
        expect(v.game_name).toEqual(result.game_name);
        expect(v.game_start_time).not.toEqual(result.announcement_time);
    });
});