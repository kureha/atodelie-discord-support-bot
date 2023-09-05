// import constants
import { Constants } from '../../common/constants';

// import entity
import { FriendCode } from '../../entity/friend_code';
import { TestEntity } from '../common/test_entity';

describe("entity.friend_code test.", () => {
    test("test for constructor friend code", () => {
        expect(new FriendCode()).toEqual({
            server_id: Constants.STRING_EMPTY,
            user_id: Constants.STRING_EMPTY,
            user_name: Constants.STRING_EMPTY,
            game_id: Constants.STRING_EMPTY,
            game_name: Constants.STRING_EMPTY,
            friend_code: Constants.STRING_EMPTY,
            regist_time: Constants.get_default_date(),
            update_time: Constants.get_default_date(),
            delete: false,
        });
    });

    test.each(
        [
            ["", "", "", 0, "", "", new Date('1970-01-01T00:00:00.000+09:00'), new Date('1970-01-01T00:00:00.000+09:00'), false],
            ["test_server_id", "test_user_id", "test_user_name", 999, "test_game_id", "test_friend_code", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), true],
        ]
    )("test for parse friend code, id = %s", (
        server_id: string,
        user_id: string,
        user_name: string,
        game_id: number,
        game_name: string,
        friend_code: string,
        regist_time: Date,
        update_time: Date,
        deleted: boolean,
    ) => {
        expect(FriendCode.parse_from_db({
            server_id: server_id,
            user_id: user_id,
            user_name: user_name,
            game_id: game_id,
            game_name: game_name,
            friend_code: friend_code,
            regist_time: regist_time,
            update_time: update_time,
            delete: deleted,
        })).toEqual({
            server_id: server_id,
            user_id: user_id,
            user_name: user_name,
            game_id: game_id,
            game_name: game_name,
            friend_code: friend_code,
            regist_time: regist_time,
            update_time: update_time,
            delete: deleted,
        });
    });

    test.each(
        [
            [undefined, "test_user_id", "test_user_name", 999, "test_game_id", "test_friend_code", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
            ["test_server_id", undefined, "test_user_name", 999, "test_game_id", "test_friend_code", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
            ["test_server_id", "test_user_id", undefined, 999, "test_game_id", "test_friend_code", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
            ["test_server_id", "test_user_id", "test_user_name", undefined, "test_game_id", "test_friend_code", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
            ["test_server_id", "test_user_id", "test_user_name", 999, undefined, "test_friend_code", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
            ["test_server_id", "test_user_id", "test_user_name", 999, "test_game_id", undefined, new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
        ]
    )("test for parse error friend code, {%s, %s, %s, %s, %s, %s, %s, %s, %s}", (
        server_id: any,
        user_id: any,
        user_name: any,
        game_id: any,
        game_name: any,
        friend_code: any,
        regist_time: any,
        update_time: any,
        deleted: any,
    ) => {
        expect(FriendCode.parse_from_db({
            server_id: server_id,
            user_id: user_id,
            user_name: user_name,
            game_id: game_id,
            game_name: game_name,
            friend_code: friend_code,
            regist_time: regist_time,
            update_time: update_time,
            delete: deleted,
        })).toEqual(new FriendCode());
    });
});

describe("entity.friend_code function test.", () => {
    test("test for search friend code by game id", () => {
        // create list
        let fc = TestEntity.get_test_friend_code();
        const fc_list: FriendCode[] = [];
        for (let i = 1; i < 11; i++) {
            fc = TestEntity.get_test_friend_code();
            fc.game_id = i.toString();;
            fc.friend_code = `test_friend_code_${i}`;
            fc_list.push(fc);
        }

        // check - search top
        let result = FriendCode.search(fc_list, "1");
        expect(result.game_id).toEqual("1")
        expect(result.friend_code).toMatch("test_friend_code_1");

        // search end
        result = FriendCode.search(fc_list, "10");
        expect(result.game_id).toEqual("10")
        expect(result.friend_code).toMatch("test_friend_code_10");

        // search middle
        result = FriendCode.search(fc_list, "5");
        expect(result.game_id).toEqual("5")
        expect(result.friend_code).toMatch("test_friend_code_5");
    });

    test("test for search friend code error by game id", () => {
        expect(() => { FriendCode.search([], "1") }).toThrowError(/^data not found from list\./);
        expect(() => { FriendCode.search([TestEntity.get_test_friend_code()], "notfound") }).toThrowError(/^data not found from list\./);
    });
});