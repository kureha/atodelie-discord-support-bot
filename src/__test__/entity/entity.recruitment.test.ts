// import constants
import { Constants } from '../../common/constants';
const constants = new Constants();

// import entity
import { Recruitment } from '../../entity/recruitment';

describe("entity.recruitment test.", () => {
    test("test for constructor recruitment", () => {
        expect(new Recruitment()).toEqual({
            id: constants.ID_INVALID,
            server_id: Constants.STRING_EMPTY,
            message_id: Constants.STRING_EMPTY,
            thread_id: Constants.STRING_EMPTY,
            token: Constants.STRING_EMPTY,
            limit_time: new Date('2000-01-01T00:00:00.000+09:00'),
            status: constants.STATUS_DISABLED,
            name: Constants.STRING_EMPTY,
            owner_id: Constants.STRING_EMPTY,
            description: Constants.STRING_EMPTY,
            regist_time: new Date('2000-01-01T00:00:00.000+09:00'),
            update_time: new Date('2000-01-01T00:00:00.000+09:00'),
            delete: false,
            user_list: [],
        });
    });

    test.each(
        [
            [0, "", "", "", "", 0, "", "", "", false, new Date('1970-01-01T00:00:00.000+09:00'), new Date('1970-01-01T00:00:00.000+09:00'), new Date('1970-01-01T00:00:00.000+09:00')],
            [3, "test_server_id", "test_message_id", "test_thread_id", "test_token", 2, "test_name", "test_owner_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('1970-01-01T00:00:00.000+09:00'), new Date('1970-01-01T00:00:00.000+09:00')],
        ]
    )("test for parse recruitment, id = %s", (
        id: number,
        server_id: string,
        message_id: string,
        thread_id: string,
        token: string,
        status: number,
        name: string,
        owner_id: string,
        description: string,
        deleted: boolean,
        limit_time: Date,
        regist_time: Date,
        update_time: Date
    ) => {
        expect(Recruitment.parse_from_db({
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
            regist_time: regist_time,
            update_time: update_time,
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
            regist_time: regist_time,
            update_time: update_time,
            user_list: [],
        });
    });


    test.each(
        [
            [undefined, "test_server_id", "test_message_id", "test_thread_id", "test_token", 2, "test_name", "test_owner_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00'), new Date('2099-12-29T12:59:00.000+09:00')],
            [3, undefined, "test_message_id", "test_thread_id", "test_token", 2, "test_name", "test_owner_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00'), new Date('2099-12-29T12:59:00.000+09:00')],
            [3, "test_server_id", undefined, "test_thread_id", "test_token", 2, "test_name", "test_owner_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00'), new Date('2099-12-29T12:59:00.000+09:00')],
            [3, "test_server_id", "test_message_id", undefined, "test_token", 2, "test_name", "test_owner_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00'), new Date('2099-12-29T12:59:00.000+09:00')],
            [3, "test_server_id", "test_message_id", "test_thread_id", undefined, 2, "test_name", "test_owner_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00'), new Date('2099-12-29T12:59:00.000+09:00')],
            [3, "test_server_id", "test_message_id", "test_thread_id", "test_token", undefined, "test_name", "test_owner_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00'), new Date('2099-12-29T12:59:00.000+09:00')],
            [3, "test_server_id", "test_message_id", "test_thread_id", "test_token", 2, undefined, "test_owner_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00'), new Date('2099-12-29T12:59:00.000+09:00')],
            [3, "test_server_id", "test_message_id", "test_thread_id", "test_token", 2, "test_name", undefined, "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00'), new Date('2099-12-29T12:59:00.000+09:00')],
            [3, "test_server_id", "test_message_id", "test_thread_id", "test_token", 2, "test_name", "test_owner_id", undefined, true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00'), new Date('2099-12-29T12:59:00.000+09:00')],
        ]
    )("test for parse error recruitment, {%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s}", (
        id: any,
        server_id: any,
        message_id: any,
        thread_id: any,
        token: any,
        status: any,
        name: any,
        owner_id: any,
        description: any,
        deleted: any,
        limit_time: any,
        regist_time: any,
        update_time: any,
    ) => {
        expect(Recruitment.parse_from_db({
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
            regist_time: regist_time,
            update_time: update_time,
        })).toEqual(new Recruitment());
    });
});