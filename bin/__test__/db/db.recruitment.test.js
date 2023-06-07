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
const recruitement_1 = require("../../db/recruitement");
// import constants
const constants_1 = require("../../common/constants");
const constants = new constants_1.Constants();
// import test entities
const test_entity_1 = require("../common/test_entity");
const fs = __importStar(require("fs"));
const sqlite_file = './.data/db.recruitment.test.sqlite';
describe("db.recruitment intialize test", () => {
    test("test for initialize", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new recruitement_1.RecruitmentRepository(":memory:");
        yield expect(rep.create_all_database(rep.get_db_instance(":memory:"))).resolves;
    }));
});
describe("db.recruitment test.", () => {
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
        const rep = new recruitement_1.RecruitmentRepository(sqlite_file);
        expect(fs.existsSync(rep.get_sqlite_file_path())).toBeTruthy();
        expect(fs.existsSync(rep.get_sqlite_file_path() + ".notfound")).toBeFalsy();
    });
    test("select recruitment test: empty result", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new recruitement_1.RecruitmentRepository(sqlite_file);
        // expect assertion 1
        expect.assertions(1);
        // select and assertions
        try {
            return yield rep.get_m_recruitment('');
        }
        catch (e) {
            return expect(e).toMatch(/^data not found on m_recruitment\./);
        }
    }));
    test("get max recruitment id test", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new recruitement_1.RecruitmentRepository(sqlite_file);
        // initial number is 1
        yield expect(rep.get_m_recruitment_id()).resolves.toEqual(1);
        // insert
        let test_rec = test_entity_1.TestEntity.get_test_recruitment();
        test_rec.id = 1;
        let cnt = yield rep.insert_m_recruitment(test_rec);
        expect(cnt).toEqual(1);
        // next number is 2
        yield expect(rep.get_m_recruitment_id()).resolves.toEqual(2);
    }));
    test("get recruitment token test", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new recruitement_1.RecruitmentRepository(sqlite_file);
        // get instance
        let test_rec = test_entity_1.TestEntity.get_test_recruitment();
        // check token for init
        yield expect(rep.get_m_recruitment_token(test_rec.token)).resolves.toEqual(test_rec.token);
        // check token automatic generated
        const generated_token = yield rep.get_m_recruitment_token();
        expect(generated_token.length).toBeGreaterThan(1);
        // insert
        let cnt = yield rep.insert_m_recruitment(test_rec);
        expect(cnt).toEqual(1);
        // check token for doubling
        try {
            yield rep.get_m_recruitment_token(test_rec.token);
            // always false - expects exception
            expect(true).toBeFalsy();
        }
        catch (e) {
            expect(e).toMatch(/^generated token is not unique, rejected\.$/);
        }
    }));
    test("select recruitment test: insert -> select(normal)", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new recruitement_1.RecruitmentRepository(sqlite_file);
        // test insert onject 1
        let test_rec = test_entity_1.TestEntity.get_test_recruitment();
        let cnt = yield rep.insert_m_recruitment(test_rec);
        expect(cnt).toEqual(1);
        // test insert object 2 (deleted)
        let test_rec_deleted = test_entity_1.TestEntity.get_test_recruitment();
        test_rec_deleted.id = 2;
        test_rec_deleted.message_id = "test_message_id_deleted";
        test_rec_deleted.token = "test_token_deleted";
        test_rec_deleted.delete = true;
        cnt = yield rep.insert_m_recruitment(test_rec_deleted);
        expect(cnt).toEqual(1);
        // test insert object 3 (expired)
        let test_rec_expired = test_entity_1.TestEntity.get_test_recruitment();
        test_rec_expired.id = 3;
        test_rec_expired.message_id = "test_message_id_expired";
        test_rec_expired.token = "test_token_expired";
        test_rec_expired.limit_time = new Date("2000-12-31T11:59:59.000Z");
        cnt = yield rep.insert_m_recruitment(test_rec_expired);
        expect(cnt).toEqual(1);
        // select nothing
        try {
            yield rep.get_m_recruitment('test_token_notfound');
            // always false - expects exception
            expect(true).toBeFalsy();
        }
        catch (e) {
            expect(e).toMatch(/^data not found on m_recruitment\./);
        }
        // select correct
        let result = yield rep.get_m_recruitment(test_rec.token);
        expect(result).toStrictEqual(test_rec);
        // select deleted
        try {
            yield rep.get_m_recruitment(test_rec_deleted.token);
            // always false - expects exception
            expect(true).toBeFalsy();
        }
        catch (e) {
            expect(e).toMatch(/^data not found on m_recruitment\./);
        }
        // select expired
        try {
            yield rep.get_m_recruitment(test_rec_expired.token);
            // always false - expects exception
            expect(true).toBeFalsy();
        }
        catch (e) {
            expect(e).toMatch(/^data not found on m_recruitment\./);
        }
    }));
    test("insert and update test: insert -> select -> update -> select", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new recruitement_1.RecruitmentRepository(sqlite_file);
        // test insert onject 1
        let test_rec = test_entity_1.TestEntity.get_test_recruitment();
        let cnt = yield rep.insert_m_recruitment(test_rec);
        expect(cnt).toEqual(1);
        // select correct
        let result = yield rep.get_m_recruitment(test_rec.token);
        expect(result).toStrictEqual(test_rec);
        // test insert object 2 (updated)
        let test_rec_updated = test_entity_1.TestEntity.get_test_recruitment();
        test_rec_updated.server_id = "test_server_id_upd";
        test_rec_updated.message_id = "test_message_id_upd";
        test_rec_updated.limit_time = new Date("2099-01-31T11:59:59.000Z");
        test_rec_updated.name = "my_name_upd";
        test_rec_updated.owner_id = "owenr_id_upd";
        test_rec_updated.description = "description_upd";
        cnt = yield rep.update_m_recruitment(test_rec_updated);
        expect(cnt).toEqual(1);
        // select correct
        result = yield rep.get_m_recruitment(test_rec_updated.token);
        expect(result).toStrictEqual(test_rec_updated);
    }));
    test("insert and delete test: insert -> select -> delete -> select", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new recruitement_1.RecruitmentRepository(sqlite_file);
        // test insert onject 1
        let test_rec = test_entity_1.TestEntity.get_test_recruitment();
        let cnt = yield rep.insert_m_recruitment(test_rec);
        expect(cnt).toEqual(1);
        // select correct
        let result = yield rep.get_m_recruitment(test_rec.token);
        expect(result).toStrictEqual(test_rec);
        // delete
        cnt = yield rep.delete_m_recruitment(test_rec.token);
        expect(cnt).toEqual(1);
        // select deleted
        try {
            yield rep.get_m_recruitment(test_rec.token);
            // always false - expects exception
            expect(true).toBeFalsy();
        }
        catch (e) {
            expect(e).toMatch(/^data not found on m_recruitment\./);
        }
    }));
    test("select for user, follow, message_id, latests test", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new recruitement_1.RecruitmentRepository(sqlite_file);
        // test insert onject 1
        let test_rec_1 = test_entity_1.TestEntity.get_test_recruitment();
        let cnt = yield rep.insert_m_recruitment(test_rec_1);
        expect(cnt).toEqual(1);
        // test insert onject 2
        let test_rec_2 = test_entity_1.TestEntity.get_test_recruitment();
        test_rec_2.id = 2;
        test_rec_2.message_id = "test_message_id_2";
        test_rec_2.token = "test_token_2";
        cnt = yield rep.insert_m_recruitment(test_rec_2);
        expect(cnt).toEqual(1);
        // test insert onject 3 (is not owned)
        let test_rec_isnot_owned = test_entity_1.TestEntity.get_test_recruitment();
        test_rec_isnot_owned.id = 3;
        test_rec_isnot_owned.message_id = "test_message_id_3";
        test_rec_isnot_owned.token = "test_token_3";
        test_rec_isnot_owned.owner_id = "owner_id_another";
        cnt = yield rep.insert_m_recruitment(test_rec_isnot_owned);
        expect(cnt).toEqual(1);
        // test insert onject 4 (expired)
        let test_rec_expired = test_entity_1.TestEntity.get_test_recruitment();
        test_rec_expired.id = 4;
        test_rec_expired.message_id = "test_message_id_4";
        test_rec_expired.token = "test_token_4";
        test_rec_expired.limit_time = new Date("2000-01-31T11:59:59.000Z");
        cnt = yield rep.insert_m_recruitment(test_rec_expired);
        expect(cnt).toEqual(1);
        // test insert onject 5 (deleted)
        let test_rec_deleted = test_entity_1.TestEntity.get_test_recruitment();
        test_rec_deleted.id = 5;
        test_rec_deleted.message_id = "test_message_id_5";
        test_rec_deleted.token = "test_token_5";
        test_rec_deleted.delete = true;
        cnt = yield rep.insert_m_recruitment(test_rec_deleted);
        expect(cnt).toEqual(1);
        // test insert onject 6 (another server)
        let test_rec_another_server = test_entity_1.TestEntity.get_test_recruitment();
        test_rec_another_server.id = 6;
        test_rec_another_server.server_id = "test_server_id_another";
        test_rec_another_server.message_id = "test_message_id_6";
        test_rec_another_server.token = "test_token_6";
        cnt = yield rep.insert_m_recruitment(test_rec_another_server);
        expect(cnt).toEqual(1);
        // select user data
        let multi_result = yield rep.get_m_recruitment_for_user(test_rec_1.server_id, test_rec_1.owner_id);
        expect(multi_result.length).toEqual(2);
        expect(multi_result).toContainEqual(test_rec_1);
        expect(multi_result).toContainEqual(test_rec_2);
        // select follow data
        multi_result = yield rep.get_m_recruitment_for_follow(test_rec_1.server_id, new Date("2099-12-31T11:59:58.999Z"), new Date("2099-12-31T11:59:59.999Z"));
        expect(multi_result.length).toEqual(3);
        expect(multi_result).toContainEqual(test_rec_1);
        expect(multi_result).toContainEqual(test_rec_2);
        expect(multi_result).toContainEqual(test_rec_isnot_owned);
        // select follow data (another server)
        multi_result = yield rep.get_m_recruitment_for_follow(test_rec_another_server.server_id, new Date("2099-12-31T11:59:58.999Z"), new Date("2099-12-31T11:59:59.999Z"));
        expect(multi_result.length).toEqual(1);
        expect(multi_result).toContainEqual(test_rec_another_server);
        // select follow data (expired)
        multi_result = yield rep.get_m_recruitment_for_follow(test_rec_another_server.server_id, new Date("2099-12-31T12:00:00.999Z"), new Date("2099-12-31T12:00:00.999Z"));
        expect(multi_result.length).toEqual(0);
        // select message data
        let single_result = yield rep.get_m_recruitment_by_message_id(test_rec_1.message_id, test_rec_1.owner_id);
        expect(single_result).toStrictEqual(test_rec_1);
        // select message data (message id not matched)
        try {
            yield rep.get_m_recruitment_by_message_id(test_rec_1.message_id + "_err", test_rec_1.owner_id);
            // always false - expects exception
            expect(true).toBeFalsy();
        }
        catch (e) {
            expect(e).toMatch(/^data not found on m_recruitment\./);
        }
        // select message data (owner not matched)
        try {
            yield rep.get_m_recruitment_by_message_id(test_rec_1.message_id, test_rec_1.owner_id + "_err");
            // always false - expects exception
            expect(true).toBeFalsy();
        }
        catch (e) {
            expect(e).toMatch(/^data not found on m_recruitment\./);
        }
        // select message data (expired)
        try {
            yield rep.get_m_recruitment_by_message_id(test_rec_expired.message_id, test_rec_expired.owner_id);
            // always false - expects exception
            expect(true).toBeFalsy();
        }
        catch (e) {
            expect(e).toMatch(/^data not found on m_recruitment\./);
        }
        // select message data (deleted)
        try {
            yield rep.get_m_recruitment_by_message_id(test_rec_deleted.message_id, test_rec_deleted.owner_id);
            // always false - expects exception
            expect(true).toBeFalsy();
        }
        catch (e) {
            expect(e).toMatch(/^data not found on m_recruitment\./);
        }
        // select latest data
        multi_result = yield rep.get_m_recruitment_latests(test_rec_1.server_id, 5);
        expect(multi_result.length).toEqual(3);
        expect(multi_result[0]).toStrictEqual(test_rec_1);
        expect(multi_result[1]).toStrictEqual(test_rec_2);
        expect(multi_result[2]).toStrictEqual(test_rec_isnot_owned);
        // update for latest data sort test
        test_rec_2.limit_time = new Date("2099-12-31T11:58:59.000Z");
        cnt = yield rep.update_m_recruitment(test_rec_2);
        expect(cnt).toEqual(1);
        // select changed latest data
        multi_result = yield rep.get_m_recruitment_latests(test_rec_1.server_id, 5);
        expect(multi_result.length).toEqual(3);
        expect(multi_result[0]).toStrictEqual(test_rec_1);
        expect(multi_result[1]).toStrictEqual(test_rec_isnot_owned);
        expect(multi_result[2]).toStrictEqual(test_rec_2);
    }));
    test("update or delete non-found recruitment test", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new recruitement_1.RecruitmentRepository(sqlite_file);
        let cnt = yield rep.update_m_recruitment(test_entity_1.TestEntity.get_test_recruitment());
        expect(cnt).toEqual(0);
        cnt = yield rep.delete_m_recruitment(test_entity_1.TestEntity.get_test_recruitment().token);
        expect(cnt).toEqual(0);
    }));
});
//# sourceMappingURL=db.recruitment.test.js.map