// import constants
import { Constants } from "../../common/constants";

// import entity
import { AnnouncementHistory } from "../../entity/announcement_history";

describe("entity.announcement_history test.", () => {
    test("test for constructor announcement_history", () => {
        expect(new AnnouncementHistory()).toEqual({
            server_id: Constants.STRING_EMPTY,
            channel_id: Constants.STRING_EMPTY,
            game_name: Constants.STRING_EMPTY,
            announcement_time: Constants.get_default_date()
        });
    });

    test.each(
        [
            ["", "", "", new Date('1970-01-01T00:00:00.000+09:00')],
            ["test_server_id", "test_channel_id", "test_game_id", new Date('1970-01-01T00:00:00.000+09:00')],
        ]
    )("test for parse announcement history, {%s, %s, %s, %s}", (server_id: string,
        channel_id: string,
        game_name: string,
        announcement_time: Date,
    ) => {
        expect(AnnouncementHistory.parse_from_db({
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


    test.each(
        [
            [undefined, "test_channel_id", "test_game_id", new Date('1970-01-01T00:00:00.000+09:00')],
            ["test_server_id", undefined, "test_game_id", new Date('1970-01-01T00:00:00.000+09:00')],
            ["test_server_id", "test_channel_id", undefined, new Date('1970-01-01T00:00:00.000+09:00')],
        ]
    )("test for parse error announcement history, {%s, %s, %s, %s, %s, %s, %s}", (server_id: any,
        channel_id: any,
        game_name: any,
        announcement_time: any,
    ) => {
        expect(AnnouncementHistory.parse_from_db({
            server_id: server_id,
            channel_id: channel_id,
            game_name: game_name,
            announcement_time: announcement_time,
        })).toEqual(new AnnouncementHistory());
    });
});