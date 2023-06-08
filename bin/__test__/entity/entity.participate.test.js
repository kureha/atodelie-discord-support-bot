"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import constants
const constants_1 = require("../../common/constants");
const constants = new constants_1.Constants();
// import entity
const participate_1 = require("../../entity/participate");
describe("entity.participate test.", () => {
    test("test for constructor participate", () => {
        expect(new participate_1.Participate()).toEqual({
            id: constants.ID_INVALID,
            token: constants_1.Constants.STRING_EMPTY,
            status: constants.STATUS_DISABLED,
            user_id: constants_1.Constants.STRING_EMPTY,
            description: constants_1.Constants.STRING_EMPTY,
            regist_time: new Date('2000-01-01T00:00:00.000+09:00'),
            update_time: new Date('2000-01-01T00:00:00.000+09:00'),
            delete: false,
        });
    });
    test.each([
        [0, "", 0, "", "", false, new Date('1970-01-01T00:00:00.000+09:00'), new Date('1970-01-01T00:00:00.000+09:00')],
        [12345, "test_token", -3, "test_user_id", "test_description", true, new Date('1970-01-01T00:00:00.000+09:00'), new Date('1970-01-01T00:00:00.000+09:00')],
    ])("test for parse participate, id = %s", (id, token, status, user_id, description, deleted, regist_time, update_time) => {
        expect(participate_1.Participate.parse_from_db({
            id: id,
            token: token,
            status: status,
            user_id: user_id,
            description: description,
            delete: deleted,
            regist_time: regist_time,
            update_time: update_time,
        }, token)).toEqual({
            id: id,
            token: token,
            status: status,
            user_id: user_id,
            description: description,
            delete: deleted,
            regist_time: regist_time,
            update_time: update_time,
        });
    });
    test.each([
        [undefined, "test_token", -3, "test_user_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00')],
        [12345, undefined, -3, "test_user_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00')],
        [12345, "test_token", undefined, "test_user_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00')],
        [12345, "test_token", -3, undefined, "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00')],
        [12345, "test_token", -3, "test_user_id", undefined, true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00')],
    ])("test for parse error participate, {%s, %s, %s, %s, %s, %s, %s, %s}", (id, token, status, user_id, description, deleted, regist_time, update_time) => {
        expect(participate_1.Participate.parse_from_db({
            id: id,
            token: token,
            status: status,
            user_id: user_id,
            description: description,
            delete: deleted,
            regist_time: regist_time,
            update_time: update_time,
        }, token)).toEqual(new participate_1.Participate());
    });
});
//# sourceMappingURL=entity.participate.test.js.map