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
const server_info_1 = require("../../db/server_info");
// import constants
const constants_1 = require("../../common/constants");
const constants = new constants_1.Constants();
// import test entities
const test_entity_1 = require("../common/test_entity");
const fs = __importStar(require("fs"));
const sqlite_file = './.data/db.server_info.test.sqlite';
describe("db.server_info intialize test", () => {
    test("test for initialize", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new server_info_1.ServerInfoRepository(":memory:");
        yield expect(rep.create_all_database(rep.get_db_instance(":memory:"))).resolves;
    }));
});
describe("db.server_info test.", () => {
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
        const rep = new server_info_1.ServerInfoRepository(sqlite_file);
        expect(fs.existsSync(rep.get_sqlite_file_path())).toBeTruthy();
        expect(fs.existsSync(rep.get_sqlite_file_path() + ".notfound")).toBeFalsy();
    });
    test("select recruitment test: empty result", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new server_info_1.ServerInfoRepository(sqlite_file);
        // select blank list
        let svr_list = yield rep.get_m_server_info_all();
        expect(svr_list.length).toEqual(0);
        // select blank data
        try {
            yield rep.get_m_server_info(test_entity_1.TestEntity.get_test_server_info().server_id);
            expect(true).not.toBeTruthy;
        }
        catch (e) {
            expect(e).toMatch(/^data not found on m_server_info. please setting m_server_info\./);
        }
    }));
    test("insert-select test: insert -> select", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new server_info_1.ServerInfoRepository(sqlite_file);
        // insert server info
        let test_svr = test_entity_1.TestEntity.get_test_server_info();
        let cnt = yield rep.insert_m_server_info(test_svr);
        expect(cnt).toEqual(1);
        // insert another server info
        let test_svr_another = test_entity_1.TestEntity.get_test_server_info();
        test_svr_another.server_id = "server_id_another";
        cnt = yield rep.insert_m_server_info(test_svr_another);
        expect(cnt).toEqual(1);
        // select list
        let result_list = yield rep.get_m_server_info_all();
        expect(result_list.length).toEqual(2);
        expect(result_list).toContainEqual(test_svr);
        expect(result_list).toContainEqual(test_svr_another);
        // select blank data
        let result = yield rep.get_m_server_info(test_entity_1.TestEntity.get_test_server_info().server_id);
        expect(result).toStrictEqual(test_svr);
    }));
    test("update-delete test: insert -> update -> delete", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new server_info_1.ServerInfoRepository(sqlite_file);
        // insert server info
        let test_svr = test_entity_1.TestEntity.get_test_server_info();
        let cnt = yield rep.insert_m_server_info(test_svr);
        expect(cnt).toEqual(1);
        // insert another server info
        let test_svr_another = test_entity_1.TestEntity.get_test_server_info();
        test_svr_another.server_id = "server_id_another";
        cnt = yield rep.insert_m_server_info(test_svr_another);
        expect(cnt).toEqual(1);
        // select list
        let result_list = yield rep.get_m_server_info_all();
        expect(result_list.length).toEqual(2);
        expect(result_list).toContainEqual(test_svr);
        expect(result_list).toContainEqual(test_svr_another);
        // update server info
        test_svr.recruitment_target_role = "target_role_upd";
        test_svr.follow_time = new Date("2010-01-01T12:00:00.000Z");
        cnt = yield rep.update_m_server_info(test_svr);
        expect(cnt).toEqual(1);
        // select to check
        let result = yield rep.get_m_server_info(test_svr.server_id);
        expect(result).toStrictEqual(test_svr);
        // update follow time
        let follow_time_upd = new Date("2020-01-01T12:00:00.000Z");
        test_svr.follow_time = follow_time_upd;
        cnt = yield rep.update_m_server_info_follow_time(test_svr.server_id, follow_time_upd);
        expect(cnt).toEqual(1);
        result = yield rep.get_m_server_info(test_svr.server_id);
        expect(result).toStrictEqual(test_svr);
        // delete
        cnt = yield rep.delete_m_server_info(test_svr.server_id);
        expect(cnt).toEqual(1);
        // select blank data
        try {
            yield rep.get_m_server_info(test_svr.server_id);
            expect(true).not.toBeTruthy;
        }
        catch (e) {
            expect(e).toMatch(/^data not found on m_server_info. please setting m_server_info\./);
        }
    }));
    test("update or delete non-found server_info test", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new server_info_1.ServerInfoRepository(sqlite_file);
        let cnt = yield rep.update_m_server_info(test_entity_1.TestEntity.get_test_server_info());
        expect(cnt).toEqual(0);
        cnt = yield rep.update_m_server_info_follow_time(test_entity_1.TestEntity.get_test_server_info().server_id, test_entity_1.TestEntity.get_test_server_info().follow_time);
        expect(cnt).toEqual(0);
        cnt = yield rep.delete_m_server_info(test_entity_1.TestEntity.get_test_server_info().server_id);
        expect(cnt).toEqual(0);
    }));
});
//# sourceMappingURL=db.server_info.test.js.map