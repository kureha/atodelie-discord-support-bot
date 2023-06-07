import { GameMasterRepository } from '../../db/game_master';

// import constants
import { Constants } from '../../common/constants';
const constants = new Constants();

// import test entities
import { TestEntity } from '../common/test_entity';

import * as fs from 'fs';

const sqlite_file: string = './.data/db.game_master.test.sqlite';

describe("db.game_master intialize test", () => {
    test("test for initialize", async () => {
        const rep = new GameMasterRepository(":memory:");
        await expect(rep.create_all_database(rep.get_db_instance(":memory:"))).resolves;
    });
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
        const rep = new GameMasterRepository(sqlite_file);
        expect(fs.existsSync(rep.get_sqlite_file_path())).toBeTruthy();
        expect(fs.existsSync(rep.get_sqlite_file_path() + ".notfound")).toBeFalsy();
    });

    test("select game master info test: empty result", async () => {
        const rep = new GameMasterRepository(sqlite_file);

        // expect assertion 1
        expect.assertions(1);

        // select and assertions
        try {
            return await rep.get_m_game_master("dummy_server_id", "-999");
        } catch (e) {
            return expect(e).toMatch(/^data not found on m_game_master\./);
        }
    });

    test("select game master info test: insert -> select(normal)", async () => {
        const rep = new GameMasterRepository(sqlite_file);

        // expect assertion 9
        expect.assertions(9);

        // test insert object 1
        let test_gm_info = TestEntity.get_test_game_master_info();
        let cnt = await rep.insert_m_game_master(test_gm_info);
        expect(cnt).toEqual(1);

        // test insert object 2
        let test_gm_info_another_game = TestEntity.get_test_game_master_info();
        test_gm_info_another_game.game_id = "test_server_id_another";
        test_gm_info_another_game.game_name = "test_game_another";
        cnt = await rep.insert_m_game_master(test_gm_info_another_game);
        expect(cnt).toEqual(1);

        // test insert object 3 (deleted)
        let test_gm_info_deleted = TestEntity.get_test_game_master_info();
        test_gm_info_deleted.game_id = "test_server_id_deleted";
        test_gm_info_deleted.game_name = "test_game_name_deleted";
        test_gm_info_deleted.delete = true;
        cnt = await rep.insert_m_game_master(test_gm_info_deleted);
        expect(cnt).toEqual(1);

        // test insert object 4 (deleted)
        let test_gm_info_other_server = TestEntity.get_test_game_master_info();
        test_gm_info_other_server.server_id = "test_server_id_other";
        cnt = await rep.insert_m_game_master(test_gm_info_other_server);
        expect(cnt).toEqual(1);

        // select nothing
        try {
            await rep.get_m_game_master(test_gm_info.server_id, "-999");
        } catch (e) {
            expect(e).toMatch(/^data not found on m_game_master\./);
        }

        // select correct
        let result = await rep.get_m_game_master(test_gm_info.server_id, test_gm_info.game_id);
        expect(result).toStrictEqual(test_gm_info);

        // select all
        let result_list = await rep.get_m_game_master_all(test_gm_info.server_id);
        expect(result_list.length).toEqual(2);
        expect(result_list).toContainEqual(test_gm_info);
        expect(result_list).toContainEqual(test_gm_info_another_game);
    });

    test("insert and update test: insert -> select -> update -> select", async () => {
        const rep = new GameMasterRepository(sqlite_file);

        // test insert onject 1
        let test_gm_info = TestEntity.get_test_game_master_info();
        let cnt = await rep.insert_m_game_master(test_gm_info);
        expect(cnt).toEqual(1);

        // select correct
        let result = await rep.get_m_game_master(test_gm_info.server_id, test_gm_info.game_id);
        expect(result).toStrictEqual(test_gm_info);

        // test update object 2 (updated)
        let test_gm_info_updated = TestEntity.get_test_game_master_info();
        test_gm_info_updated.game_name = "test_game_name_updated";
        test_gm_info_updated.regist_time = new Date("2099-03-04T05:06:07.000Z");
        test_gm_info_updated.update_time = new Date("2099-11-30T10:58:57.000Z");
        test_gm_info_updated.delete = false;
        cnt = await rep.update_m_game_master(test_gm_info_updated);
        expect(cnt).toEqual(1);

        // select correct
        result = await rep.get_m_game_master(test_gm_info.server_id, test_gm_info_updated.game_id);
        expect(result).toStrictEqual(test_gm_info_updated);

        // test update object 2 (other server, update)
        let test_gm_info_updated_other = TestEntity.get_test_game_master_info();
        test_gm_info_updated_other.server_id = "test_server_id_other";
        test_gm_info_updated_other.game_name = "test_game_name_updated";
        test_gm_info_updated_other.regist_time = new Date("2099-03-04T05:06:07.000Z");
        test_gm_info_updated_other.update_time = new Date("2099-11-30T10:58:57.000Z");
        test_gm_info_updated_other.delete = false;
        cnt = await rep.update_m_game_master(test_gm_info_updated_other);
        expect(cnt).toEqual(0);
    });

    test("insert and delete test: insert -> select -> delete -> select", async () => {
        const rep = new GameMasterRepository(sqlite_file);

        // expect assertion 4
        expect.assertions(5);

        // test insert onject 1
        let test_gm_info = TestEntity.get_test_game_master_info();
        let cnt = await rep.insert_m_game_master(test_gm_info);
        expect(cnt).toEqual(1);

        // test insert onject 1
        let test_gm_info_other_server = TestEntity.get_test_game_master_info();
        test_gm_info_other_server.server_id = "test_server_other";
        cnt = await rep.insert_m_game_master(test_gm_info_other_server);
        expect(cnt).toEqual(1);

        // select correct
        let result = await rep.get_m_game_master(test_gm_info.server_id, test_gm_info.game_id);
        expect(result).toStrictEqual(test_gm_info);

        // delete
        cnt = await rep.delete_m_game_master(test_gm_info.server_id, test_gm_info.game_id);
        expect(cnt).toEqual(1);

        // select deleted
        try {
            return await rep.get_m_game_master(test_gm_info.server_id, test_gm_info.game_id);
        } catch (e) {
            return expect(e).toMatch(/^data not found on m_game_master\./);
        }
    });

    test("update or delete non-found game master info test", async () => {
        const rep = new GameMasterRepository(sqlite_file);
        let cnt = await rep.update_m_game_master(TestEntity.get_test_game_master_info());
        expect(cnt).toEqual(0);
        cnt = await rep.delete_m_game_master(TestEntity.get_test_game_master_info().server_id, TestEntity.get_test_game_master_info().game_id);
        expect(cnt).toEqual(0);
    });
});