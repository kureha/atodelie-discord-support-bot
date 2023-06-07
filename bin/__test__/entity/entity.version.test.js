"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import constants
const constants_1 = require("../../common/constants");
// import entity
const version_1 = require("../../entity/version");
describe("entity.version test.", () => {
    test("test for constructor version", () => {
        expect(new version_1.Version()).toEqual({
            app_version: constants_1.Constants.STRING_EMPTY,
            database_version: constants_1.Constants.STRING_EMPTY,
        });
    });
    test.each([
        ["", ""],
        ["test_app_version", "test_db_version"],
    ])("test for parse version, id = %s", (app_version, database_version) => {
        expect(version_1.Version.parse_from_db({
            app_version: app_version,
            database_version: database_version,
        })).toEqual({
            app_version: app_version,
            database_version: database_version,
        });
    });
    test.each([
        [undefined, "test_db_version"],
        ["test_app_version", undefined],
    ])("test for parse error version, {%s, %s}", (app_version, database_version) => {
        expect(version_1.Version.parse_from_db({
            app_version: app_version,
            database_version: database_version,
        })).toEqual(new version_1.Version());
    });
});
//# sourceMappingURL=entity.version.test.js.map