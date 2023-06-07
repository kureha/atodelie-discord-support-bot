// import constants
import { Constants } from '../../common/constants';

// import entity
import { Version } from '../../entity/version'

describe("entity.version test.", () => {
    test("test for constructor version", () => {
        expect(new Version()).toEqual({
            app_version: Constants.STRING_EMPTY,
            database_version: Constants.STRING_EMPTY,
        });
    });

    test.each(
        [
            ["", ""],
            ["test_app_version", "test_db_version"],
        ]
    )("test for parse version, id = %s", (
        app_version: string,
        database_version: string,
    ) => {
        expect(Version.parse_from_db({
            app_version: app_version,
            database_version: database_version,
        })).toEqual({
            app_version: app_version,
            database_version: database_version,
        });
    });

    test.each(
        [
            [undefined, "test_db_version"],
            ["test_app_version", undefined],
        ]
    )("test for parse error version, {%s, %s}", (
        app_version: any,
        database_version: any,
    ) => {
        expect(Version.parse_from_db({
            app_version: app_version,
            database_version: database_version,
        })).toEqual(new Version());
    });
});