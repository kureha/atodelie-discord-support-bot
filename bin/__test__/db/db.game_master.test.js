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
const game_master_1 = require("../../db/game_master");
// import constants
const constants_1 = require("../../common/constants");
const constants = new constants_1.Constants();
// import test entities
const test_entity_1 = require("../common/test_entity");
const fs = __importStar(require("fs"));
const sqlite_file = './.data/db.game_master.test.sqlite';
describe("db.game_master intialize test", () => {
    test("test for initialize", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new game_master_1.GameMasterRepository(":memory:");
        yield expect(rep.create_all_database(rep.get_db_instance(":memory:"))).resolves;
    }));
});
describe("db.game_master test.", () => {
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
        const rep = new game_master_1.GameMasterRepository(sqlite_file);
        expect(fs.existsSync(rep.get_sqlite_file_path())).toBeTruthy();
        expect(fs.existsSync(rep.get_sqlite_file_path() + ".notfound")).toBeFalsy();
    });
    test("select game master info test: empty result", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new game_master_1.GameMasterRepository(sqlite_file);
        // expect assertion 1
        expect.assertions(1);
        // select and assertions
        try {
            return yield rep.get_m_game_master("dummy_server_id", "-999");
        }
        catch (e) {
            return expect(e).toMatch(/^data not found on m_game_master\./);
        }
    }));
    test("select game master info test: insert -> select(normal)", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new game_master_1.GameMasterRepository(sqlite_file);
        // expect assertion 9
        expect.assertions(9);
        // test insert object 1
        let test_gm_info = test_entity_1.TestEntity.get_test_game_master_info();
        let cnt = yield rep.insert_m_game_master(test_gm_info);
        expect(cnt).toEqual(1);
        // test insert object 2
        let test_gm_info_another_game = test_entity_1.TestEntity.get_test_game_master_info();
        test_gm_info_another_game.game_id = "test_server_id_another";
        test_gm_info_another_game.game_name = "test_game_another";
        cnt = yield rep.insert_m_game_master(test_gm_info_another_game);
        expect(cnt).toEqual(1);
        // test insert object 3 (deleted)
        let test_gm_info_deleted = test_entity_1.TestEntity.get_test_game_master_info();
        test_gm_info_deleted.game_id = "test_server_id_deleted";
        test_gm_info_deleted.game_name = "test_game_name_deleted";
        test_gm_info_deleted.delete = true;
        cnt = yield rep.insert_m_game_master(test_gm_info_deleted);
        expect(cnt).toEqual(1);
        // test insert object 4 (deleted)
        let test_gm_info_other_server = test_entity_1.TestEntity.get_test_game_master_info();
        test_gm_info_other_server.server_id = "test_server_id_other";
        cnt = yield rep.insert_m_game_master(test_gm_info_other_server);
        expect(cnt).toEqual(1);
        // select nothing
        try {
            yield rep.get_m_game_master(test_gm_info.server_id, "-999");
        }
        catch (e) {
            expect(e).toMatch(/^data not found on m_game_master\./);
        }
        // select correct
        let result = yield rep.get_m_game_master(test_gm_info.server_id, test_gm_info.game_id);
        expect(result).toStrictEqual(test_gm_info);
        // select all
        let result_list = yield rep.get_m_game_master_all(test_gm_info.server_id);
        expect(result_list.length).toEqual(2);
        expect(result_list).toContainEqual(test_gm_info);
        expect(result_list).toContainEqual(test_gm_info_another_game);
    }));
    test("insert and update test: insert -> select -> update -> select", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new game_master_1.GameMasterRepository(sqlite_file);
        // test insert onject 1
        let test_gm_info = test_entity_1.TestEntity.get_test_game_master_info();
        let cnt = yield rep.insert_m_game_master(test_gm_info);
        expect(cnt).toEqual(1);
        // select correct
        let result = yield rep.get_m_game_master(test_gm_info.server_id, test_gm_info.game_id);
        expect(result).toStrictEqual(test_gm_info);
        // test update object 2 (updated)
        let test_gm_info_updated = test_entity_1.TestEntity.get_test_game_master_info();
        test_gm_info_updated.game_name = "test_game_name_updated";
        test_gm_info_updated.regist_time = new Date("2099-03-04T05:06:07.000Z");
        test_gm_info_updated.update_time = new Date("2099-11-30T10:58:57.000Z");
        test_gm_info_updated.delete = false;
        cnt = yield rep.update_m_game_master(test_gm_info_updated);
        expect(cnt).toEqual(1);
        // select correct
        result = yield rep.get_m_game_master(test_gm_info.server_id, test_gm_info_updated.game_id);
        expect(result).toStrictEqual(test_gm_info_updated);
        // test update object 2 (other server, update)
        let test_gm_info_updated_other = test_entity_1.TestEntity.get_test_game_master_info();
        test_gm_info_updated_other.server_id = "test_server_id_other";
        test_gm_info_updated_other.game_name = "test_game_name_updated";
        test_gm_info_updated_other.regist_time = new Date("2099-03-04T05:06:07.000Z");
        test_gm_info_updated_other.update_time = new Date("2099-11-30T10:58:57.000Z");
        test_gm_info_updated_other.delete = false;
        cnt = yield rep.update_m_game_master(test_gm_info_updated_other);
        expect(cnt).toEqual(0);
    }));
    test("insert and delete test: insert -> select -> delete -> select", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new game_master_1.GameMasterRepository(sqlite_file);
        // expect assertion 4
        expect.assertions(5);
        // test insert onject 1
        let test_gm_info = test_entity_1.TestEntity.get_test_game_master_info();
        let cnt = yield rep.insert_m_game_master(test_gm_info);
        expect(cnt).toEqual(1);
        // test insert onject 1
        let test_gm_info_other_server = test_entity_1.TestEntity.get_test_game_master_info();
        test_gm_info_other_server.server_id = "test_server_other";
        cnt = yield rep.insert_m_game_master(test_gm_info_other_server);
        expect(cnt).toEqual(1);
        // select correct
        let result = yield rep.get_m_game_master(test_gm_info.server_id, test_gm_info.game_id);
        expect(result).toStrictEqual(test_gm_info);
        // delete
        cnt = yield rep.delete_m_game_master(test_gm_info.server_id, test_gm_info.game_id);
        expect(cnt).toEqual(1);
        // select deleted
        try {
            return yield rep.get_m_game_master(test_gm_info.server_id, test_gm_info.game_id);
        }
        catch (e) {
            return expect(e).toMatch(/^data not found on m_game_master\./);
        }
    }));
    test("update or delete non-found game master info test", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new game_master_1.GameMasterRepository(sqlite_file);
        let cnt = yield rep.update_m_game_master(test_entity_1.TestEntity.get_test_game_master_info());
        expect(cnt).toEqual(0);
        cnt = yield rep.delete_m_game_master(test_entity_1.TestEntity.get_test_game_master_info().server_id, test_entity_1.TestEntity.get_test_game_master_info().game_id);
        expect(cnt).toEqual(0);
    }));
});
//# sourceMappingURL=db.game_master.test.js.map