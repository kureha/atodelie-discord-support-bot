
import { ServerInfoRepository } from '../../db/server_info';

// import test entities
import { TestEntity } from '../common/test_entity';

// create rep
const rep = new ServerInfoRepository();

describe("db.server_info test.", () => {
    beforeEach(async () => {
        await rep.delete_m_server_info_all();
    });

    test("select recruitment test: empty result", async () => {
        // select blank list
        let svr_list = await rep.get_m_server_info_all();
        expect(svr_list.length).toEqual(0);

        // select blank data
        try {
            await rep.get_m_server_info(TestEntity.get_test_server_info().server_id);
            expect(true).not.toBeTruthy;
        } catch (e) {
            expect(e).toMatch(/^data not found on m_server_info. please setting m_server_info\./);
        }
    });

    test("insert-select test: insert -> select", async () => {
        // insert server info
        let test_svr = TestEntity.get_test_server_info();
        let cnt = await rep.insert_m_server_info(test_svr);
        expect(cnt).toEqual(1);

        // insert another server info
        let test_svr_another = TestEntity.get_test_server_info();
        test_svr_another.server_id = "server_id_another";
        cnt = await rep.insert_m_server_info(test_svr_another);
        expect(cnt).toEqual(1);

        // select list
        let result_list = await rep.get_m_server_info_all();
        expect(result_list.length).toEqual(2);
        expect(result_list).toContainEqual(test_svr);
        expect(result_list).toContainEqual(test_svr_another);

        // select blank data
        let result = await rep.get_m_server_info(TestEntity.get_test_server_info().server_id);
        expect(result).toStrictEqual(test_svr);
    });

    test("update-delete test: insert -> update -> delete", async () => {
        // insert server info
        let test_svr = TestEntity.get_test_server_info();
        let cnt = await rep.insert_m_server_info(test_svr);
        expect(cnt).toEqual(1);

        // insert another server info
        let test_svr_another = TestEntity.get_test_server_info();
        test_svr_another.server_id = "server_id_another";
        cnt = await rep.insert_m_server_info(test_svr_another);
        expect(cnt).toEqual(1);

        // select list
        let result_list = await rep.get_m_server_info_all();
        expect(result_list.length).toEqual(2);
        expect(result_list).toContainEqual(test_svr);
        expect(result_list).toContainEqual(test_svr_another);

        // update server info
        test_svr.recruitment_target_role = "target_role_upd";
        test_svr.follow_time = new Date("2010-01-01T12:00:00.000Z");
        cnt = await rep.update_m_server_info(test_svr);
        expect(cnt).toEqual(1);

        // select to check
        let result = await rep.get_m_server_info(test_svr.server_id);
        expect(result).toStrictEqual(test_svr);

        // update follow time
        let follow_time_upd = new Date("2020-01-01T12:00:00.000Z");
        test_svr.follow_time = follow_time_upd;
        cnt = await rep.update_m_server_info_follow_time(test_svr.server_id, follow_time_upd);
        expect(cnt).toEqual(1);

        result = await rep.get_m_server_info(test_svr.server_id);
        expect(result).toStrictEqual(test_svr);

        // delete
        cnt = await rep.delete_m_server_info(test_svr.server_id);
        expect(cnt).toEqual(1);

        // select blank data
        try {
            await rep.get_m_server_info(test_svr.server_id);
            expect(true).not.toBeTruthy;
        } catch (e) {
            expect(e).toMatch(/^data not found on m_server_info. please setting m_server_info\./);
        }
    });

    test("update or delete non-found server_info test", async () => {
        let cnt = await rep.update_m_server_info(TestEntity.get_test_server_info());
        expect(cnt).toEqual(0);
        cnt = await rep.update_m_server_info_follow_time(TestEntity.get_test_server_info().server_id, TestEntity.get_test_server_info().follow_time);
        expect(cnt).toEqual(0);
        cnt = await rep.delete_m_server_info(TestEntity.get_test_server_info().server_id);
        expect(cnt).toEqual(0);
    });
});