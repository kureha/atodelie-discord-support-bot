// import constants
import { Constants } from '../../common/constants';

// import entity
import { GameMaster } from '../../entity/game_master';

describe("entity.game_master test.", () => {
    test("test for constructor game master info", () => {
        expect(new GameMaster()).toEqual({
            server_id: Constants.STRING_EMPTY,
            game_id: Constants.STRING_EMPTY,
            game_name: Constants.STRING_EMPTY,
            regist_time: Constants.get_default_date(),
            update_time: Constants.get_default_date(),
            delete: false,
        });
    });

    test.each(
        [
            ["", 0, "", new Date('1970-01-01T00:00:00.000+09:00'), new Date('1970-01-01T00:00:00.000+09:00'), false],
            ["test_server_id", 999, "test_game_id", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
        ]
    )("test for parse game master info, id = %s", (
        server_id: string,
        game_id: number,
        game_name: string,
        regist_time: Date,
        update_time: Date,
        deleted: boolean,
    ) => {
        expect(GameMaster.parse_from_db({
            server_id: server_id,
            game_id: game_id,
            game_name: game_name,
            regist_time: regist_time,
            update_time: update_time,
            deleted: deleted,
        })).toEqual({
            server_id: server_id,
            game_id: game_id,
            game_name: game_name,
            regist_time: regist_time,
            update_time: update_time,
            delete: deleted,
        });
    });

    test.each(
        [
            [undefined, 999, "test_game_id", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
            ["test_server_id", undefined, "test_game_id", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
            ["test_server_id", 999, undefined, new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
        ]
    )("test for parse error game master info, {%s, %s, %s, %s, %s, %s}", (
        server_id: any,
        game_id: any,
        game_name: any,
        regist_time: any,
        update_time: any,
        deleted: any,
    ) => {
        expect(GameMaster.parse_from_db({
            server_id: server_id,
            game_id: game_id,
            game_name: game_name,
            regist_time: regist_time,
            update_time: update_time,
            delete: deleted,
        })).toEqual(new GameMaster());
    });
});