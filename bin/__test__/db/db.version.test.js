"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const version_1 = require("../../db/version");
// import test entities
const test_entity_1 = require("../common/test_entity");
// create rep
const rep = new version_1.VersionRepository();
const initial_version = '1.0.0.0';
describe("db.version test.", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield rep.delete_m_version_all();
    }));
    test("select recruitment test: initial master values", () => __awaiter(void 0, void 0, void 0, function* () {
        // select initial value
        let ver = yield rep.get_m_version();
        expect(ver).toEqual({
            app_version: initial_version,
            database_version: initial_version,
        });
    }));
    test("insert and delete recruitment test: insert -> select(error) -> select(ok) -> delete", () => __awaiter(void 0, void 0, void 0, function* () {
        // select initial value
        let ver = yield rep.get_m_version();
        expect(ver).toEqual({
            app_version: initial_version,
            database_version: initial_version,
        });
        // insert (double value)
        let test_ver = test_entity_1.TestEntity.get_test_version();
        let cnt = yield rep.insert_m_version(test_ver);
        expect(cnt).toEqual(1);
        // error for select
        try {
            yield rep.get_m_version();
            expect(true).toBeFalsy;
        }
        catch (e) {
            expect(e).toMatch(/^more than 2 datas found on m_version\./);
        }
        // select
        yield expect(rep.get_m_version()).resolves.toStrictEqual(test_ver);
        // delete initial version
        cnt = yield rep.delete_m_version(test_ver);
        expect(cnt).toEqual(1);
    }));
});
//# sourceMappingURL=db.version.test.js.map