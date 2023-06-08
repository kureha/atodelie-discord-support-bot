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
const game_master_1 = require("../../db/game_master");
// import test entities
const test_entity_1 = require("../common/test_entity");
// create rep
const rep = new game_master_1.GameMasterRepository();
describe("db.game_master test.", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield rep.delete_m_game_master_all();
    }));
    test("select game master info test: empty result", () => __awaiter(void 0, void 0, void 0, function* () {
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
        // expect assertion 12
        expect.assertions(12);
        // test insert object 1
        let test_gm_info = test_entity_1.TestEntity.get_test_game_master_info();
        let cnt = yield rep.insert_m_game_master(test_gm_info);
        expect(cnt).toEqual(1);
        // test insert object 2
        let test_gm_info_another_game = test_entity_1.TestEntity.get_test_game_master_info();
        test_gm_info_another_game.game_id = "test_server_id_another";
        test_gm_info_another_game.game_name = "test_game_another";
        test_gm_info_another_game.presence_name = "test_presence_name_another";
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
        // select correct by presence name
        let result_list = yield rep.get_m_game_master_by_presence_name(test_gm_info_another_game.server_id, test_gm_info_another_game.presence_name);
        expect(result_list.length).toEqual(1);
        expect(result_list).toContainEqual(test_gm_info_another_game);
        // select correct by presence name blank
        result_list = yield rep.get_m_game_master_by_presence_name(test_gm_info_another_game.server_id, test_gm_info_another_game.presence_name + "_notfound");
        expect(result_list.length).toEqual(0);
        // select all
        result_list = yield rep.get_m_game_master_all(test_gm_info.server_id);
        expect(result_list.length).toEqual(2);
        expect(result_list).toContainEqual(test_gm_info);
        expect(result_list).toContainEqual(test_gm_info_another_game);
    }));
    test("insert and update test: insert -> select -> update -> select", () => __awaiter(void 0, void 0, void 0, function* () {
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
        let cnt = yield rep.update_m_game_master(test_entity_1.TestEntity.get_test_game_master_info());
        expect(cnt).toEqual(0);
        cnt = yield rep.delete_m_game_master(test_entity_1.TestEntity.get_test_game_master_info().server_id, test_entity_1.TestEntity.get_test_game_master_info().game_id);
        expect(cnt).toEqual(0);
    }));
});
//# sourceMappingURL=db.game_master.test.js.map