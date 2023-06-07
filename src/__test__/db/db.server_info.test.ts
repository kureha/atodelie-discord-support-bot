
import { ServerInfoRepository } from '../../db/server_info';

// import constants
import { Constants } from '../../common/constants';
const constants = new Constants();

// import test entities
import { TestEntity } from '../common/test_entity';

import * as fs from 'fs';

const sqlite_file: string = './.data/db.server_info.test.sqlite';

describe("db.server_info intialize test", () => {
    test("test for initialize", async () => {
        const rep = new ServerInfoRepository(":memory:");
        await expect(rep.create_all_database(rep.get_db_instance(":memory:"))).resolves;
    });
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
        const rep = new ServerInfoRepository(sqlite_file);
        expect(fs.existsSync(rep.get_sqlite_file_path())).toBeTruthy();
        expect(fs.existsSync(rep.get_sqlite_file_path() + ".notfound")).toBeFalsy();
    });

    test("select recruitment test: empty result", async () => {
        const rep = new ServerInfoRepository(sqlite_file);

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
        const rep = new ServerInfoRepository(sqlite_file);

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
        const rep = new ServerInfoRepository(sqlite_file);

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
        const rep = new ServerInfoRepository(sqlite_file);
        let cnt = await rep.update_m_server_info(TestEntity.get_test_server_info());
        expect(cnt).toEqual(0);
        cnt = await rep.update_m_server_info_follow_time(TestEntity.get_test_server_info().server_id, TestEntity.get_test_server_info().follow_time);
        expect(cnt).toEqual(0);
        cnt = await rep.delete_m_server_info(TestEntity.get_test_server_info().server_id);
        expect(cnt).toEqual(0);
    });
});