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
            delete: false,
        });
    });

    test.each(
        [
            [0, "", 0, "", "", false],
            [12345, "test_token", -3, "test_user_id", "test_description", true],
        ]
    )("test for parse participate, id = %s", (id: number, token: string, status: number, user_id: string, description: string, deleted: boolean) => {
        expect(Participate.parse_from_db({
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

    test.each(
        [
            [undefined, "test_token", -3, "test_user_id", "test_description", true],
            [12345, undefined, -3, "test_user_id", "test_description", true],
            [12345, "test_token", undefined, "test_user_id", "test_description", true],
            [12345, "test_token", -3, undefined, "test_description", true],
            [12345, "test_token", -3, "test_user_id", undefined, true],
        ]
    )("test for parse error participate, {%s, %s, %s, %s, %s, %s}", (id: any, token: any, status: any, user_id: any, description: any, deleted: any) => {
        expect(Participate.parse_from_db({
            id: id,
            token: token,
            status: status,
            user_id: user_id,
            description: description,
            delete: deleted
        }, token)).toEqual(new Participate());
    });
});