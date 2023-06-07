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
            delete: false,
        });
    });
    test.each([
        [0, "", 0, "", "", false],
        [12345, "test_token", -3, "test_user_id", "test_description", true],
    ])("test for parse participate, id = %s", (id, token, status, user_id, description, deleted) => {
        expect(participate_1.Participate.parse_from_db({
            id: id,
            token: token,
            status: status,
            user_id: user_id,
            description: description,
            delete: deleted
        }, token)).toEqual({
            id: id,
            token: token,
            status: status,
            user_id: user_id,
            description: description,
            delete: deleted,
        });
    });
    test.each([
        [undefined, "test_token", -3, "test_user_id", "test_description", true],
        [12345, undefined, -3, "test_user_id", "test_description", true],
        [12345, "test_token", undefined, "test_user_id", "test_description", true],
        [12345, "test_token", -3, undefined, "test_description", true],
        [12345, "test_token", -3, "test_user_id", undefined, true],
    ])("test for parse error participate, {%s, %s, %s, %s, %s, %s}", (id, token, status, user_id, description, deleted) => {
        expect(participate_1.Participate.parse_from_db({
            id: id,
            token: token,
            status: status,
            user_id: user_id,
            description: description,
            delete: deleted
        }, token)).toEqual(new participate_1.Participate());
    });
});
//# sourceMappingURL=entity.participate.test.js.map