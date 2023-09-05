"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import constants
const constants_1 = require("../../common/constants");
// import entity
const game_master_1 = require("../../entity/game_master");
describe("entity.game_master test.", () => {
    test("test for constructor game master info", () => {
        expect(new game_master_1.GameMaster()).toEqual({
            server_id: constants_1.Constants.STRING_EMPTY,
            game_id: constants_1.Constants.STRING_EMPTY,
            game_name: constants_1.Constants.STRING_EMPTY,
            presence_name: constants_1.Constants.STRING_EMPTY,
            regist_time: constants_1.Constants.get_default_date(),
            update_time: constants_1.Constants.get_default_date(),
            delete: false,
        });
    });
    test.each([
        ["", 0, "", "", new Date('1970-01-01T00:00:00.000+09:00'), new Date('1970-01-01T00:00:00.000+09:00'), false],
        ["test_server_id", 999, "test_game_id", "test_presence_name", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), true],
    ])("test for parse game master info, id = %s", (server_id, game_id, game_name, presence_name, regist_time, update_time, deleted) => {
        expect(game_master_1.GameMaster.parse_from_db({
            server_id: server_id,
            game_id: game_id,
            game_name: game_name,
            presence_name: presence_name,
            regist_time: regist_time,
            update_time: update_time,
            delete: deleted,
        })).toEqual({
            server_id: server_id,
            game_id: game_id,
            game_name: game_name,
            presence_name: presence_name,
            regist_time: regist_time,
            update_time: update_time,
            delete: deleted,
        });
    });
    test.each([
        [undefined, 999, "test_game_id", "test_presence_name", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
        ["test_server_id", undefined, "test_game_id", "test_presence_name", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
        ["test_server_id", 999, undefined, "test_presence_name", new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
        ["test_server_id", 999, "test_game_id", undefined, new Date('2020-12-23T12:34:56.000+09:00'), new Date('2021-02-03T01:02:03.000+09:00'), false],
    ])("test for parse error game master info, {%s, %s, %s, %s, %s, %s}", (server_id, game_id, game_name, presence_name, regist_time, update_time, deleted) => {
        expect(game_master_1.GameMaster.parse_from_db({
            server_id: server_id,
            game_id: game_id,
            game_name: game_name,
            presence_name: presence_name,
            regist_time: regist_time,
            update_time: update_time,
            delete: deleted,
        })).toEqual(new game_master_1.GameMaster());
    });
});
//# sourceMappingURL=entity.game_master.test.js.map