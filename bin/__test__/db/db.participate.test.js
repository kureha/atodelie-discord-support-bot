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
const participate_1 = require("../../db/participate");
// import constants
const constants_1 = require("../../common/constants");
const constants = new constants_1.Constants();
// import test entities
const test_entity_1 = require("../common/test_entity");
const fs = __importStar(require("fs"));
const sqlite_file = './.data/db.participate.test.sqlite';
describe("db.participate intialize test", () => {
    test("test for initialize", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new participate_1.ParticipateRepository(":memory:");
        yield expect(rep.create_all_database(rep.get_db_instance(":memory:"))).resolves;
    }));
});
describe("db.participate test.", () => {
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
        const rep = new participate_1.ParticipateRepository(sqlite_file);
        expect(fs.existsSync(rep.get_sqlite_file_path())).toBeTruthy();
        expect(fs.existsSync(rep.get_sqlite_file_path() + ".notfound")).toBeFalsy();
    });
    test("select participate test: empty result", () => __awaiter(void 0, void 0, void 0, function* () {
        const rec_rep = new recruitement_1.RecruitmentRepository(sqlite_file);
        const par_rep = new participate_1.ParticipateRepository(sqlite_file);
        // select empty
        let result = yield par_rep.get_t_participate('');
        expect(result.length).toEqual(0);
        // create recruitment
        let test_rec = test_entity_1.TestEntity.get_test_recruitment();
        yield rec_rep.insert_m_recruitment(test_rec);
        // select empty
        result = yield par_rep.get_t_participate('');
        expect(result.length).toEqual(0);
    }));
    test("select participate test: insert(multi) -> select(multi) -> insert(single) -> select(single)", () => __awaiter(void 0, void 0, void 0, function* () {
        const rec_rep = new recruitement_1.RecruitmentRepository(sqlite_file);
        const par_rep = new participate_1.ParticipateRepository(sqlite_file);
        // create recruitment
        let test_rec = test_entity_1.TestEntity.get_test_recruitment();
        yield rec_rep.insert_m_recruitment(test_rec);
        // insert participates
        let test_par_list = [test_entity_1.TestEntity.get_test_participate(), test_entity_1.TestEntity.get_test_participate()];
        if (test_par_list[1] != undefined) {
            test_par_list[1].user_id = "user_id_another";
        }
        let cnt = yield par_rep.insert_t_participate_list(test_par_list);
        expect(cnt).toEqual(2);
        // create another recruitment
        let test_rec_another = test_entity_1.TestEntity.get_test_recruitment();
        test_rec_another.id = 2;
        test_rec_another.token = "test_token_another";
        test_rec_another.message_id = "test_message_id_another";
        yield rec_rep.insert_m_recruitment(test_rec_another);
        // insert participate
        let test_par_another = test_entity_1.TestEntity.get_test_participate();
        test_par_another.id = 2;
        test_par_another.token = "test_token_another";
        cnt = yield par_rep.insert_t_participate(test_par_another);
        expect(cnt).toEqual(1);
        // select multi result
        let result = yield par_rep.get_t_participate(test_rec.token);
        expect(result.length).toEqual(2);
        expect(result).toContainEqual(test_par_list[0]);
        expect(result).toContainEqual(test_par_list[1]);
        // select single result
        result = yield par_rep.get_t_participate(test_rec_another.token);
        expect(result.length).toEqual(1);
        expect(result).toContainEqual(test_par_another);
    }));
    test("select participate test: expire select result", () => __awaiter(void 0, void 0, void 0, function* () {
        const rec_rep = new recruitement_1.RecruitmentRepository(sqlite_file);
        const par_rep = new participate_1.ParticipateRepository(sqlite_file);
        // create expire recruitment
        let test_rec = test_entity_1.TestEntity.get_test_recruitment();
        test_rec.limit_time = new Date("2000-12-31T11:59:59.000Z");
        yield rec_rep.insert_m_recruitment(test_rec);
        // insert participates for expire
        let test_par_list = [test_entity_1.TestEntity.get_test_participate(), test_entity_1.TestEntity.get_test_participate()];
        if (test_par_list[1] != undefined) {
            test_par_list[1].user_id = "user_id_another";
        }
        let cnt = yield par_rep.insert_t_participate_list(test_par_list);
        expect(cnt).toEqual(0);
        // select empty (expire, result is 0)
        let result = yield par_rep.get_t_participate(test_rec.token);
        expect(result.length).toEqual(0);
    }));
    test("update and delete test: insert -> select -> update -> select -> delete -> select", () => __awaiter(void 0, void 0, void 0, function* () {
        const rec_rep = new recruitement_1.RecruitmentRepository(sqlite_file);
        const par_rep = new participate_1.ParticipateRepository(sqlite_file);
        // create recruitment
        let test_rec = test_entity_1.TestEntity.get_test_recruitment();
        yield rec_rep.insert_m_recruitment(test_rec);
        // insert participates
        let test_par_list = [test_entity_1.TestEntity.get_test_participate(), test_entity_1.TestEntity.get_test_participate()];
        if (test_par_list[1] != undefined) {
            test_par_list[1].user_id = "user_id_another";
        }
        let cnt = yield par_rep.insert_t_participate_list(test_par_list);
        expect(cnt).toEqual(2);
        // create another recruitment
        let test_rec_expire = test_entity_1.TestEntity.get_test_recruitment();
        test_rec_expire.id = 2;
        test_rec_expire.token = "test_token_expire";
        test_rec_expire.message_id = "test_message_id_another";
        test_rec_expire.limit_time = new Date("2000-12-31T11:59:59.000Z");
        yield rec_rep.insert_m_recruitment(test_rec_expire);
        // insert participate
        let test_par_expire = test_entity_1.TestEntity.get_test_participate();
        test_par_expire.id = 2;
        test_par_expire.token = "test_token_expire";
        cnt = yield par_rep.insert_t_participate(test_par_expire);
        expect(cnt).toEqual(0);
        // update participate
        let test_par_update = test_entity_1.TestEntity.get_test_participate();
        test_par_update.status = 3;
        test_par_update.description = "description_updated";
        test_par_update.user_id = "user_id_another";
        cnt = yield par_rep.update_t_participate(test_par_update);
        expect(cnt).toEqual(1);
        // select updated info
        let result = yield par_rep.get_t_participate(test_rec.token);
        expect(result.length).toEqual(2);
        expect(result).toContainEqual(test_par_list[0]);
        expect(result).toContainEqual(test_par_update);
        // update expire participate - ignore
        cnt = yield par_rep.update_t_participate(test_par_expire);
        expect(cnt).toEqual(0);
        // select updated expire info
        result = yield par_rep.get_t_participate(test_par_expire.token);
        expect(result.length).toEqual(0);
        // delete participate info
        cnt = yield par_rep.delete_t_participate(test_rec.token);
        expect(cnt).toEqual(2);
        result = yield par_rep.get_t_participate(test_rec.token);
        expect(result.length).toEqual(0);
    }));
    test("update or delete non-found participate test", () => __awaiter(void 0, void 0, void 0, function* () {
        const par_rep = new participate_1.ParticipateRepository(sqlite_file);
        let cnt = yield par_rep.insert_t_participate(test_entity_1.TestEntity.get_test_participate());
        expect(cnt).toEqual(0);
        cnt = yield par_rep.update_t_participate(test_entity_1.TestEntity.get_test_participate());
        expect(cnt).toEqual(0);
        cnt = yield par_rep.delete_t_participate(test_entity_1.TestEntity.get_test_participate().token);
        expect(cnt).toEqual(0);
    }));
});
//# sourceMappingURL=db.participate.test.js.map