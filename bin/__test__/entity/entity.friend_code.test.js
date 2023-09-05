"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import constants
const constants_1 = require("../../common/constants");
// import entity
const friend_code_1 = require("../../entity/friend_code");
const test_entity_1 = require("../common/test_entity");
describe("entity.friend_code test.", () => {
    test("test for constructor friend code", () => {
        expect(new friend_code_1.FriendCode()).toEqual({
            server_id: constants_1.Constants.STRING_EMPTY,
            user_id: constants_1.Constants.STRING_EMPTY,
            user_name: constants_1.Constants.STRING_EMPTY,
            game_id: constants_1.Constants.STRING_EMPTY,
            game_name: constants_1.Constants.STRING_EMPTY,
            friend_code: constants_1.Constants.STRING_EMPTY,
            regist_time: constants_1.Constants.get_default_date(),
            update_time: constants_1.Constants.get_default_date(),
            delete: false,
        });
    });
    test.each([
        ["", "", "", 0, "", "", new Date('1970-01-01T00:00:00.000+09:00'), new Date('1970-01-01T00:00:00.000+09:00'), false],
        ["test_server_id", "test_user_id", "test_user_name", 999, "test_game_id", "test_friend_code", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), true],
    ])("test for parse friend code, id = %s", (server_id, user_id, user_name, game_id, game_name, friend_code, regist_time, update_time, deleted) => {
        expect(friend_code_1.FriendCode.parse_from_db({
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
    test.each([
        [undefined, "test_user_id", "test_user_name", 999, "test_game_id", "test_friend_code", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
        ["test_server_id", undefined, "test_user_name", 999, "test_game_id", "test_friend_code", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
        ["test_server_id", "test_user_id", undefined, 999, "test_game_id", "test_friend_code", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
        ["test_server_id", "test_user_id", "test_user_name", undefined, "test_game_id", "test_friend_code", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
        ["test_server_id", "test_user_id", "test_user_name", 999, undefined, "test_friend_code", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
        ["test_server_id", "test_user_id", "test_user_name", 999, "test_game_id", undefined, new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
    ])("test for parse error friend code, {%s, %s, %s, %s, %s, %s, %s, %s, %s}", (server_id, user_id, user_name, game_id, game_name, friend_code, regist_time, update_time, deleted) => {
        expect(friend_code_1.FriendCode.parse_from_db({
            server_id: server_id,
            user_id: user_id,
            user_name: user_name,
            game_id: game_id,
            game_name: game_name,
            friend_code: friend_code,
            regist_time: regist_time,
            update_time: update_time,
            delete: deleted,
        })).toEqual(new friend_code_1.FriendCode());
    });
});
describe("entity.friend_code function test.", () => {
    test("test for search friend code by game id", () => {
        // create list
        let fc = test_entity_1.TestEntity.get_test_friend_code();
        const fc_list = [];
        for (let i = 1; i < 11; i++) {
            fc = test_entity_1.TestEntity.get_test_friend_code();
            fc.game_id = i.toString();
            ;
            fc.friend_code = `test_friend_code_${i}`;
            fc_list.push(fc);
        }
        // check - search top
        let result = friend_code_1.FriendCode.search(fc_list, "1");
        expect(result.game_id).toEqual("1");
        expect(result.friend_code).toMatch("test_friend_code_1");
        // search end
        result = friend_code_1.FriendCode.search(fc_list, "10");
        expect(result.game_id).toEqual("10");
        expect(result.friend_code).toMatch("test_friend_code_10");
        // search middle
        result = friend_code_1.FriendCode.search(fc_list, "5");
        expect(result.game_id).toEqual("5");
        expect(result.friend_code).toMatch("test_friend_code_5");
    });
    test("test for search friend code error by game id", () => {
        expect(() => { friend_code_1.FriendCode.search([], "1"); }).toThrowError(/^data not found from list\./);
        expect(() => { friend_code_1.FriendCode.search([test_entity_1.TestEntity.get_test_friend_code()], "notfound"); }).toThrowError(/^data not found from list\./);
    });
});
//# sourceMappingURL=entity.friend_code.test.js.map