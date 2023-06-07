// import constants
import { Constants } from '../../common/constants';

// import entity
import { ServerInfo } from '../../entity/server_info';

describe("entity.server_info test.", () => {
    test("test for constructor server_info", () => {
        expect(new ServerInfo()).toEqual({
            server_id: Constants.STRING_EMPTY,
            channel_id: Constants.STRING_EMPTY,
            recruitment_target_role: Constants.STRING_EMPTY,
            follow_time: new Date('2000-01-01T00:00:00.000+09:00'),
        });
    });

    test.each(
        [
            ["", "", "", new Date('2000-01-01T00:00:00.000+09:00')],
            ["test_server_id", "test_channel_id", "test_role", new Date('2099-12-31T23:59:00.000+09:00')],
        ]
    )("test for parse server_info, id = %s", (
        server_id: string,
        channel_id: string,
        recruitment_target_role: string,
        follow_time: Date,
    ) => {
        expect(ServerInfo.parse_from_db({
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

    test.each(
        [
            [undefined, "test_channel_id", "test_role", new Date('2099-12-31T23:59:00.000+09:00')],
            ["test_server_id", undefined, "test_role", new Date('2099-12-31T23:59:00.000+09:00')],
            ["test_server_id", "test_channel_id", undefined, new Date('2099-12-31T23:59:00.000+09:00')],
        ]
    )("test for parse error server_info, {%s, %s, %s, %s}", (
        server_id: any,
        channel_id: any,
        recruitment_target_role: any,
        follow_time: any,
    ) => {
        expect(ServerInfo.parse_from_db({
            server_id: server_id,
            channel_id: channel_id,
            recruitment_target_role: recruitment_target_role,
            follow_time: follow_time,
        })).toEqual(new ServerInfo());
    });
});