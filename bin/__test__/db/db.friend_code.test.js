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
const friend_code_1 = require("../../db/friend_code");
// import constants
const constants_1 = require("../../common/constants");
const constants = new constants_1.Constants();
// import test entities
const test_entity_1 = require("../common/test_entity");
const fs = __importStar(require("fs"));
const sqlite_file = './.data/db.friend_code.test.sqlite';
describe("db.friend_code intialize test", () => {
    test("test for initialize", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new friend_code_1.FriendCodeRepository(":memory:");
        yield expect(rep.create_all_database(rep.get_db_instance(":memory:"))).resolves;
    }));
});
describe("db.friend_code test.", () => {
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
        const rep = new friend_code_1.FriendCodeRepository(sqlite_file);
        expect(fs.existsSync(rep.get_sqlite_file_path())).toBeTruthy();
        expect(fs.existsSync(rep.get_sqlite_file_path() + ".notfound")).toBeFalsy();
    });
    test("select friend code test: empty result", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new friend_code_1.FriendCodeRepository(sqlite_file);
        // select and assertions
        yield expect(rep.get_t_friend_code_all("dummy_server_id")).resolves.toEqual([]);
        yield expect(rep.get_t_friend_code("dummy_server_id", 'target_key')).resolves.toEqual([]);
    }));
    test("select friend code test: insert -> select(normal)", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new friend_code_1.FriendCodeRepository(sqlite_file);
        // test insert object 1
        let test_frc_info = test_entity_1.TestEntity.get_test_friend_code();
        let cnt = yield rep.insert_t_friend_code(test_frc_info);
        expect(cnt).toEqual(1);
        // test insert object 2
        let test_frc_info_another_game = test_entity_1.TestEntity.get_test_friend_code();
        test_frc_info_another_game.game_id = "test_game_id_another";
        test_frc_info_another_game.game_name = "test_game_another";
        cnt = yield rep.insert_t_friend_code(test_frc_info_another_game);
        expect(cnt).toEqual(1);
        // test insert object 3 (deleted)
        let test_frc_info_deleted = test_entity_1.TestEntity.get_test_friend_code();
        test_frc_info_deleted.game_id = "test_game_id_deleted";
        test_frc_info_deleted.game_name = "test_game_name_deleted";
        test_frc_info_deleted.delete = true;
        cnt = yield rep.insert_t_friend_code(test_frc_info_deleted);
        expect(cnt).toEqual(1);
        // test insert object 4 (another user)
        let test_frc_info_another_user = test_entity_1.TestEntity.get_test_friend_code();
        test_frc_info_another_user.user_id = "test_user_name_id_another";
        test_frc_info_another_user.user_name = "test_user_name_another";
        test_frc_info_another_user.game_id = "test_game_id_another";
        test_frc_info_another_user.game_name = "test_game_another";
        test_frc_info_another_user.friend_code = "test_friend_code_another";
        cnt = yield rep.insert_t_friend_code(test_frc_info_another_user);
        expect(cnt).toEqual(1);
        // test insert object 5 (other server)
        let test_frc_info_other_server = test_entity_1.TestEntity.get_test_friend_code();
        test_frc_info_other_server.server_id = "test_server_other";
        cnt = yield rep.insert_t_friend_code(test_frc_info_other_server);
        expect(cnt).toEqual(1);
        // select nothing
        yield expect(rep.get_t_friend_code(test_frc_info.server_id, 'target_key')).resolves.toEqual([]);
        // select correct another game group by user
        let result = yield rep.get_t_friend_code(test_frc_info.server_id, test_frc_info.user_id);
        expect(result.length).toEqual(2);
        expect(result).toContainEqual(test_frc_info);
        expect(result).toContainEqual(test_frc_info_another_game);
        // select correct another user group by game
        result = yield rep.get_t_friend_code_from_game_id(test_frc_info_another_game.server_id, test_frc_info_another_game.game_id);
        expect(result.length).toEqual(2);
        expect(result).toContainEqual(test_frc_info_another_game);
        expect(result).toContainEqual(test_frc_info_another_user);
        // select all
        result = yield rep.get_t_friend_code_all(test_frc_info.server_id);
        expect(result.length).toEqual(3);
        expect(result).toContainEqual(test_frc_info);
        expect(result).toContainEqual(test_frc_info_another_game);
        expect(result).toContainEqual(test_frc_info_another_user);
    }));
    test("insert and update test: insert -> select -> update -> select", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new friend_code_1.FriendCodeRepository(sqlite_file);
        // test insert onject 1
        let test_frc_info = test_entity_1.TestEntity.get_test_friend_code();
        let cnt = yield rep.insert_t_friend_code(test_frc_info);
        expect(cnt).toEqual(1);
        // select correct
        let result = yield rep.get_t_friend_code(test_frc_info.server_id, test_frc_info.user_id);
        expect(result.length).toEqual(1);
        expect(result).toContainEqual(test_frc_info);
        // test update object 2 (updated)
        let test_frc_info_updated = test_entity_1.TestEntity.get_test_friend_code();
        test_frc_info_updated.user_name = "test_user_name_updated";
        test_frc_info_updated.friend_code = "test_token_updated";
        test_frc_info_updated.regist_time = new Date("2099-03-04T05:06:07.000Z");
        test_frc_info_updated.update_time = new Date("2099-11-30T10:58:57.000Z");
        test_frc_info_updated.delete = false;
        cnt = yield rep.update_t_friend_code(test_frc_info_updated);
        expect(cnt).toEqual(1);
        // select correct
        result = yield rep.get_t_friend_code(test_frc_info_updated.server_id, test_frc_info_updated.user_id);
        expect(result.length).toEqual(1);
        expect(result).toContainEqual(test_frc_info_updated);
        // test update invalid object 2 (updated)
        test_frc_info_updated.server_id = "test_server_other";
        test_frc_info_updated.user_name = "test_user_name_updated";
        test_frc_info_updated.friend_code = "test_token_updated";
        test_frc_info_updated.regist_time = new Date("2099-03-04T05:06:07.000Z");
        test_frc_info_updated.update_time = new Date("2099-11-30T10:58:57.000Z");
        test_frc_info_updated.delete = false;
        cnt = yield rep.update_t_friend_code(test_frc_info_updated);
        expect(cnt).toEqual(0);
    }));
    test("insert and delete test: insert -> select -> delete -> select", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new friend_code_1.FriendCodeRepository(sqlite_file);
        // test insert onject 1
        let test_frc_info = test_entity_1.TestEntity.get_test_friend_code();
        let cnt = yield rep.insert_t_friend_code(test_frc_info);
        expect(cnt).toEqual(1);
        // test insert object 2 to other server
        let test_frc_info_other_server = test_entity_1.TestEntity.get_test_friend_code();
        test_frc_info_other_server.server_id = "test_server_id_other";
        cnt = yield rep.insert_t_friend_code(test_frc_info_other_server);
        expect(cnt).toEqual(1);
        // select correct
        let result = yield rep.get_t_friend_code(test_frc_info.server_id, test_frc_info.user_id);
        expect(result.length).toEqual(1);
        expect(result).toContainEqual(test_frc_info);
        // delete
        cnt = yield rep.delete_t_friend_code(test_frc_info.server_id, test_frc_info.user_id, test_frc_info.game_id);
        expect(cnt).toEqual(1);
        // select deleted
        yield expect(rep.get_t_friend_code(test_frc_info.server_id, test_frc_info.user_id)).resolves.toEqual([]);
    }));
    test("update or delete non-found friend code test", () => __awaiter(void 0, void 0, void 0, function* () {
        const rep = new friend_code_1.FriendCodeRepository(sqlite_file);
        let cnt = yield rep.update_t_friend_code(test_entity_1.TestEntity.get_test_friend_code());
        expect(cnt).toEqual(0);
        cnt = yield rep.delete_t_friend_code(test_entity_1.TestEntity.get_test_friend_code().server_id, test_entity_1.TestEntity.get_test_friend_code().user_id, test_entity_1.TestEntity.get_test_friend_code().game_id);
        expect(cnt).toEqual(0);
    }));
});
//# sourceMappingURL=db.friend_code.test.js.map