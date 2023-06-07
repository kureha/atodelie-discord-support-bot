"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import constants
const constants_1 = require("../../common/constants");
const constants = new constants_1.Constants();
// import entity
const recruitment_1 = require("../../entity/recruitment");
describe("entity.recruitment test.", () => {
    test("test for constructor recruitment", () => {
        expect(new recruitment_1.Recruitment()).toEqual({
            id: constants.ID_INVALID,
            server_id: constants_1.Constants.STRING_EMPTY,
            message_id: constants_1.Constants.STRING_EMPTY,
            thread_id: constants_1.Constants.STRING_EMPTY,
            token: constants_1.Constants.STRING_EMPTY,
            status: constants.STATUS_DISABLED,
            name: constants_1.Constants.STRING_EMPTY,
            owner_id: constants_1.Constants.STRING_EMPTY,
            description: constants_1.Constants.STRING_EMPTY,
            delete: false,
            limit_time: new Date('2000-01-01T00:00:00.000+09:00'),
            user_list: [],
        });
    });
    test.each([
        [0, "", "", "", "", 0, "", "", "", false, new Date('1970-01-01T00:00:00.000+09:00')],
        [3, "test_server_id", "test_message_id", "test_thread_id", "test_token", 2, "test_name", "test_owner_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00')],
    ])("test for parse recruitment, id = %s", (id, server_id, message_id, thread_id, token, status, name, owner_id, description, deleted, limit_time) => {
        expect(recruitment_1.Recruitment.parse_from_db({
            id: id,
            server_id: server_id,
            message_id: message_id,
            thread_id: thread_id,
            token: token,
            status: status,
            name: name,
            owner_id: owner_id,
            description: description,
            delete: deleted,
            limit_time: limit_time,
        })).toEqual({
            id: id,
            server_id: server_id,
            message_id: message_id,
            thread_id: thread_id,
            token: token,
            status: status,
            name: name,
            owner_id: owner_id,
            description: description,
            delete: deleted,
            limit_time: limit_time,
            user_list: [],
        });
    });
    test.each([
        [undefined, "test_server_id", "test_message_id", "test_thread_id", "test_token", 2, "test_name", "test_owner_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00')],
        [3, undefined, "test_message_id", "test_thread_id", "test_token", 2, "test_name", "test_owner_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00')],
        [3, "test_server_id", undefined, "test_thread_id", "test_token", 2, "test_name", "test_owner_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00')],
        [3, "test_server_id", "test_message_id", undefined, "test_token", 2, "test_name", "test_owner_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00')],
        [3, "test_server_id", "test_message_id", "test_thread_id", undefined, 2, "test_name", "test_owner_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00')],
        [3, "test_server_id", "test_message_id", "test_thread_id", "test_token", undefined, "test_name", "test_owner_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00')],
        [3, "test_server_id", "test_message_id", "test_thread_id", "test_token", 2, undefined, "test_owner_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00')],
        [3, "test_server_id", "test_message_id", "test_thread_id", "test_token", 2, "test_name", undefined, "test_description", true, new Date('2099-12-31T12:59:00.000+09:00')],
        [3, "test_server_id", "test_message_id", "test_thread_id", "test_token", 2, "test_name", "test_owner_id", undefined, true, new Date('2099-12-31T12:59:00.000+09:00')],
    ])("test for parse error recruitment, {%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s}", (id, server_id, message_id, thread_id, token, status, name, owner_id, description, deleted, limit_time) => {
        expect(recruitment_1.Recruitment.parse_from_db({
            id: id,
            server_id: server_id,
            message_id: message_id,
            thread_id: thread_id,
            token: token,
            status: status,
            name: name,
            owner_id: owner_id,
            description: description,
            delete: deleted,
            limit_time: limit_time,
        })).toEqual(new recruitment_1.Recruitment());
    });
});
//# sourceMappingURL=entity.recruitment.test.js.map