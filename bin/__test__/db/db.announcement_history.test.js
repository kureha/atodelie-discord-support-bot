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
const announcement_history_1 = require("../../db/announcement_history");
const test_entity_1 = require("../common/test_entity");
// create rep
const rep = new announcement_history_1.AnnouncementHistoryRepository();
describe("db.announcement test.", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield rep.delete_t_announcement_all(test_entity_1.TestEntity.get_test_announcement_history(new Date("2099-02-03T01:02:03.000Z")).server_id);
        yield rep.delete_t_announcement_all(test_entity_1.TestEntity.get_test_announcement_history(new Date("2099-02-03T01:02:03.000Z")).server_id + "_updated");
    }));
    test("select friend code test: empty result", () => __awaiter(void 0, void 0, void 0, function* () {
        // select and assertions
        yield expect(rep.get_t_announcement_all("dummy_server_id")).resolves.toEqual([]);
    }));
    test("select announcement test: insert -> select(normal)", () => __awaiter(void 0, void 0, void 0, function* () {
        // test insert object 1
        let test_activity_history = test_entity_1.TestEntity.get_test_announcement_history(new Date("2099-02-03T01:02:03.000Z"));
        let cnt = yield rep.insert_t_announcement(test_activity_history);
        expect(cnt).toEqual(1);
        // test insert object 2
        let test_activity_history_another = test_entity_1.TestEntity.get_test_announcement_history(new Date("2099-02-03T01:02:03.000Z"));
        test_activity_history_another.server_id = test_activity_history_another.server_id + "_updated";
        cnt = yield rep.insert_t_announcement(test_activity_history_another);
        expect(cnt).toEqual(1);
        // test insert object 2
        let test_activity_history_other = test_entity_1.TestEntity.get_test_announcement_history(new Date("2099-02-03T01:02:02.999Z"));
        cnt = yield rep.insert_t_announcement(test_activity_history_other);
        expect(cnt).toEqual(1);
        // select test 1
        let result = yield rep.get_t_announcement(test_activity_history.server_id, test_activity_history.channel_id, 10);
        expect(result.length).toEqual(2);
        expect(result).toContainEqual(test_activity_history);
        expect(result).toContainEqual(test_activity_history_other);
        // select test 2
        result = yield rep.get_t_announcement(test_activity_history_another.server_id, test_activity_history_another.channel_id, 10);
        expect(result.length).toEqual(1);
        expect(result).toContainEqual(test_activity_history_another);
        // select test 3
        result = yield rep.get_t_announcement(test_activity_history.server_id, test_activity_history_another.channel_id, 1);
        expect(result.length).toEqual(1);
        // select test 4
        result = yield rep.get_t_announcement(test_activity_history.server_id, test_activity_history.channel_id, 0);
        expect(result.length).toEqual(0);
        // select test 5
        result = yield rep.get_t_announcement_all(test_activity_history.server_id);
        expect(result.length).toEqual(2);
        expect(result).toContainEqual(test_activity_history);
        expect(result).toContainEqual(test_activity_history_other);
    }));
    test("delete announcement test: insert -> delete", () => __awaiter(void 0, void 0, void 0, function* () {
        // test insert object 1
        let test_activity_history = test_entity_1.TestEntity.get_test_announcement_history(new Date("2099-02-03T01:02:03.001Z"));
        let cnt = yield rep.insert_t_announcement(test_activity_history);
        expect(cnt).toEqual(1);
        // test insert object 2
        let test_activity_history_another = test_entity_1.TestEntity.get_test_announcement_history(new Date("2099-02-03T01:02:03.000Z"));
        cnt = yield rep.insert_t_announcement(test_activity_history_another);
        expect(cnt).toEqual(1);
        // select test 1
        let result = yield rep.delete_t_announcement(test_activity_history.server_id, new Date("2099-02-03T01:02:03.000Z"));
        expect(result).toEqual(1);
    }));
});
//# sourceMappingURL=db.announcement_history.test.js.map