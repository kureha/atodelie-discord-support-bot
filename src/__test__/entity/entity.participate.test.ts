// import constants
import { Constants } from '../../common/constants';
const constants = new Constants();

// import entity
import { Participate } from "../../entity/participate";

describe("entity.participate test.", () => {
    test("test for constructor participate", () => {
        expect(new Participate()).toEqual({
            id: constants.ID_INVALID,
            token: Constants.STRING_EMPTY,
            status: constants.STATUS_DISABLED,
            user_id: Constants.STRING_EMPTY,
            description: Constants.STRING_EMPTY,
            regist_time: new Date('2000-01-01T00:00:00.000+09:00'),
            update_time: new Date('2000-01-01T00:00:00.000+09:00'),
            delete: false,
        });
    });

    test.each(
        [
            [0, "", 0, "", "", false, new Date('1970-01-01T00:00:00.000+09:00'), new Date('1970-01-01T00:00:00.000+09:00')],
            [12345, "test_token", -3, "test_user_id", "test_description", true, new Date('1970-01-01T00:00:00.000+09:00'), new Date('1970-01-01T00:00:00.000+09:00')],
        ]
    )("test for parse participate, id = %s", (id: number, token: string, status: number, user_id: string, description: string, deleted: boolean, regist_time: Date, update_time: Date) => {
        expect(Participate.parse_from_db({
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

    test.each(
        [
            [undefined, "test_token", -3, "test_user_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00')],
            [12345, undefined, -3, "test_user_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00')],
            [12345, "test_token", undefined, "test_user_id", "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00')],
            [12345, "test_token", -3, undefined, "test_description", true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00')],
            [12345, "test_token", -3, "test_user_id", undefined, true, new Date('2099-12-31T12:59:00.000+09:00'), new Date('2099-12-30T12:59:00.000+09:00')],
        ]
    )("test for parse error participate, {%s, %s, %s, %s, %s, %s, %s, %s}", (id: any, token: any, status: any, user_id: any, description: any, deleted: any, regist_time: any, update_time: any) => {
        expect(Participate.parse_from_db({
            id: id,
            token: token,
            status: status,
            user_id: user_id,
            description: description,
            delete: deleted,
            regist_time: regist_time,
            update_time: update_time,
        }, token)).toEqual(new Participate());
    });
});