// import constants
import { Constants } from "../../common/constants";

// import entity
import { ActivityHistory } from "../../entity/activity_history";

describe("entity.activity_history test.", () => {
    test("test for constructor activity history", () => {
        expect(new ActivityHistory()).toEqual({
            server_id: Constants.STRING_EMPTY,
            channel_id: Constants.STRING_EMPTY,
            game_name: Constants.STRING_EMPTY,
            member_count: 0,
            total_member_count: 0,
            change_time: Constants.get_default_date(),
            regist_time: Constants.get_default_date(),
            update_time: Constants.get_default_date(),
            delete: false,
        });
    });

    test.each(
        [
            ["", "", "", 0, 0, new Date('1970-01-01T00:00:00.000+09:00'), new Date('1970-01-01T00:00:00.000+09:00'), new Date('1970-01-01T00:00:00.000+09:00'), false],
            ["test_server_id", "test_channel_id", "test_game_id", 2, 3, new Date('1970-01-01T00:00:00.000+09:00'), new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-01-02T01:02:03.000+09:00'), false],
        ]
    )("test for parse activity history, {%s, %s, %s, %s, &s, %s, %s, %s, %s}", (server_id: string,
        channel_id: string,
        game_name: string,
        member_count: number,
        total_member_count: number,
        change_time: Date,
        regist_time: Date,
        update_time: Date,
        deleted: boolean
    ) => {
        expect(ActivityHistory.parse_from_db({
            server_id: server_id,
            channel_id: channel_id,
            game_name: game_name,
            member_count: member_count,
            total_member_count: total_member_count,
            change_time: change_time,
            regist_time: regist_time,
            update_time: update_time,
            delete: deleted,
        })).toEqual({
            server_id: server_id,
            channel_id: channel_id,
            game_name: game_name,
            member_count: member_count,
            total_member_count: total_member_count,
            change_time: change_time,
            regist_time: regist_time,
            update_time: update_time,
            delete: deleted,
        });
    });


    test.each(
        [
            [undefined, "test_channel_id", "test_game_id", 0, 1, new Date('1970-01-01T00:00:00.000+09:00'), new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-01-02T01:02:03.000+09:00'), false],
            ["test_server_id", undefined, "test_game_id", 0, 1, new Date('1970-01-01T00:00:00.000+09:00'), new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-01-02T01:02:03.000+09:00'), false],
            ["test_server_id", "test_channel_id", undefined, 0, 1, new Date('1970-01-01T00:00:00.000+09:00'), new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-01-02T01:02:03.000+09:00'), false],
        ]
    )("test for parse error activity history, {%s, %s, %s, %s, %s, %s, %s}", (server_id: any,
        channel_id: any,
        game_name: any,
        member_count: any,
        total_member_count: any,
        change_time: any,
        regist_time: any,
        update_time: any,
        deleted: any
    ) => {
        expect(ActivityHistory.parse_from_db({
            server_id: server_id,
            channel_id: channel_id,
            game_name: game_name,
            member_count: member_count,
            total_member_count: total_member_count,
            change_time: change_time,
            regist_time: regist_time,
            update_time: update_time,
            delete: deleted,
        })).toEqual(new ActivityHistory());
    });
});