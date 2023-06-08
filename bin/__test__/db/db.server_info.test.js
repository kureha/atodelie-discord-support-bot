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
const server_info_1 = require("../../db/server_info");
// import test entities
const test_entity_1 = require("../common/test_entity");
// create rep
const rep = new server_info_1.ServerInfoRepository();
describe("db.server_info test.", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield rep.delete_m_server_info_all();
    }));
    test("select recruitment test: empty result", () => __awaiter(void 0, void 0, void 0, function* () {
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
        let cnt = yield rep.update_m_server_info(test_entity_1.TestEntity.get_test_server_info());
        expect(cnt).toEqual(0);
        cnt = yield rep.update_m_server_info_follow_time(test_entity_1.TestEntity.get_test_server_info().server_id, test_entity_1.TestEntity.get_test_server_info().follow_time);
        expect(cnt).toEqual(0);
        cnt = yield rep.delete_m_server_info(test_entity_1.TestEntity.get_test_server_info().server_id);
        expect(cnt).toEqual(0);
    }));
});
//# sourceMappingURL=db.server_info.test.js.map