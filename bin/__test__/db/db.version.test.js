"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// import constants
const constants_1 = require("../../common/constants");
const constants = new constants_1.Constants();
// import test entities
const test_entity_1 = require("../common/test_entity");
const fs = __importStar(require("fs"));
const sqlite_file = './.data/db.version.test.sqlite';
const initial_version = '1.0.0.0';
describe("db.version intialize test", () => {
    test("test for initialize", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new version_1.VersionRepository(":memory:");
        yield expect(rep.create_all_database(rep.get_db_instance(":memory:"))).resolves;
    }));
});
describe("db.version test.", () => {
    // copy test file for test
    beforeEach(() => {
        // delete file if exists
        if (fs.existsSync(sqlite_file)) {
            fs.rmSync(sqlite_file);
        }
        // copy file
        fs.copyFileSync(constants.SQLITE_TEMPLATE_FILE, sqlite_file);
    });
    // delete test file alter all
    afterAll(() => {
        // delete file if exists
        if (fs.existsSync(sqlite_file)) {
            fs.rmSync(sqlite_file);
        }
    });
    test("constructor test", () => {
        const rep = new version_1.VersionRepository(sqlite_file);
        expect(fs.existsSync(rep.get_sqlite_file_path())).toBeTruthy();
        expect(fs.existsSync(rep.get_sqlite_file_path() + ".notfound")).toBeFalsy();
    });
    test("select recruitment test: initial master values", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new version_1.VersionRepository(sqlite_file);
        // select initial value
        let ver = yield rep.get_m_version();
        expect(ver).toEqual({
            app_version: initial_version,
            database_version: initial_version,
        });
    }));
    test("insert and delete recruitment test: insert -> select(error) -> delete -> select(ok)", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new version_1.VersionRepository(sqlite_file);
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
        // delete initial version
        cnt = yield rep.delete_m_version(ver);
        expect(cnt).toEqual(1);
        // select
        yield expect(rep.get_m_version()).resolves.toStrictEqual(test_ver);
    }));
});
//# sourceMappingURL=db.version.test.js.map