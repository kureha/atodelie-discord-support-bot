// import entity
import { ActivityHistoryRepository } from '../../db/activity_history';
import { TestEntity } from '../common/test_entity';

// create rep
const rep = new ActivityHistoryRepository();

describe("db.activity_history test.", () => {
    beforeEach(async () => {
        await rep.delete_t_activity_history_all(TestEntity.get_test_activity(new Date("2099-02-03T01:02:03.000Z")).server_id);
        await rep.delete_t_activity_history_all(TestEntity.get_test_activity(new Date("2099-02-03T01:02:03.000Z")).server_id + "_updated");
    });

    test("select activity history test: empty result", async () => {
        // select and assertions
        await expect(rep.get_t_activity_history_all("dummy_server_id")).resolves.toEqual([]);
    });

    test("select activity history test: insert -> select(normal)", async () => {
        // test insert object 1
        let test_activity_history = TestEntity.get_test_activity(new Date("2099-02-03T01:02:03.000Z"));
        let cnt = await rep.insert_t_activity_history(test_activity_history);
        expect(cnt).toEqual(1);

        // test insert object 2
        let test_activity_history_another = TestEntity.get_test_activity(new Date("2099-02-03T01:02:03.000Z"));
        test_activity_history_another.server_id = test_activity_history_another.server_id + "_updated";
        cnt = await rep.insert_t_activity_history(test_activity_history_another);
        expect(cnt).toEqual(1);

        // test insert object 3
        let test_activity_history_other = TestEntity.get_test_activity(new Date("2099-02-03T01:02:02.999Z"));
        test_activity_history_other.server_id = test_activity_history_other.server_id;
        cnt = await rep.insert_t_activity_history(test_activity_history_other);
        expect(cnt).toEqual(1);

        // select test 1
        let result = await rep.get_t_activity_history(test_activity_history.server_id, test_activity_history.channel_id, 10);
        expect(result.length).toEqual(2);
        expect(result).toContainEqual(test_activity_history);
        expect(result).toContainEqual(test_activity_history_other);

        // select test 2
        result = await rep.get_t_activity_history(test_activity_history_another.server_id, test_activity_history_another.channel_id, 1);
        expect(result.length).toEqual(1);

        // select test 3
        result = await rep.get_t_activity_history_all(test_activity_history.server_id);
        expect(result.length).toEqual(2);
        expect(result).toContainEqual(test_activity_history);
        expect(result).toContainEqual(test_activity_history_other);

        // select test 4
        result = await rep.get_t_activity_history(test_activity_history.server_id, test_activity_history.channel_id, 0);
        expect(result.length).toEqual(0);
    });

    test("delete activity history test: insert -> delete", async () => {
        // test insert object 1
        let test_activity_history = TestEntity.get_test_activity(new Date("2099-02-03T01:02:03.000Z"));
        let cnt = await rep.insert_t_activity_history(test_activity_history);
        expect(cnt).toEqual(1);

        // test insert object 2
        let test_activity_history_another = TestEntity.get_test_activity(new Date("2099-02-03T01:02:03.001Z"));
        cnt = await rep.insert_t_activity_history(test_activity_history_another);
        expect(cnt).toEqual(1);

        // select test 1
        let result = await rep.delete_t_activity_history(test_activity_history.server_id, new Date("2099-02-03T01:02:03.000Z"));
        expect(result).toEqual(1);
    });
});