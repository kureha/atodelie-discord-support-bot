import { FriendCodeRepository } from '../../db/friend_code';

// import constants
import { Constants } from '../../common/constants';
const constants = new Constants();

// import test entities
import { TestEntity } from '../common/test_entity';

import * as fs from 'fs';

const sqlite_file: string = './.data/db.friend_code.test.sqlite';

describe("db.friend_code intialize test", () => {
    test("test for initialize", async () => {
        const rep = new FriendCodeRepository(":memory:");
        await expect(rep.create_all_database(rep.get_db_instance(":memory:"))).resolves;
    });
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
        const rep = new FriendCodeRepository(sqlite_file);
        expect(fs.existsSync(rep.get_sqlite_file_path())).toBeTruthy();
        expect(fs.existsSync(rep.get_sqlite_file_path() + ".notfound")).toBeFalsy();
    });

    test("select friend code test: empty result", async () => {
        const rep = new FriendCodeRepository(sqlite_file);

        // select and assertions
        await expect(rep.get_t_friend_code_all("dummy_server_id")).resolves.toEqual([]);
        await expect(rep.get_t_friend_code("dummy_server_id", 'target_key')).resolves.toEqual([]);
    });

    test("select friend code test: insert -> select(normal)", async () => {
        const rep = new FriendCodeRepository(sqlite_file);

        // test insert object 1
        let test_frc_info = TestEntity.get_test_friend_code();
        let cnt = await rep.insert_t_friend_code(test_frc_info);
        expect(cnt).toEqual(1);

        // test insert object 2
        let test_frc_info_another_game = TestEntity.get_test_friend_code();
        test_frc_info_another_game.game_id = "test_game_id_another";
        test_frc_info_another_game.game_name = "test_game_another";
        cnt = await rep.insert_t_friend_code(test_frc_info_another_game);
        expect(cnt).toEqual(1);

        // test insert object 3 (deleted)
        let test_frc_info_deleted = TestEntity.get_test_friend_code();
        test_frc_info_deleted.game_id = "test_game_id_deleted";
        test_frc_info_deleted.game_name = "test_game_name_deleted";
        test_frc_info_deleted.delete = true;
        cnt = await rep.insert_t_friend_code(test_frc_info_deleted);
        expect(cnt).toEqual(1);

        // test insert object 4 (another user)
        let test_frc_info_another_user = TestEntity.get_test_friend_code();
        test_frc_info_another_user.user_id = "test_user_name_id_another";
        test_frc_info_another_user.user_name = "test_user_name_another";
        test_frc_info_another_user.game_id = "test_game_id_another";
        test_frc_info_another_user.game_name = "test_game_another";
        test_frc_info_another_user.friend_code = "test_friend_code_another";
        cnt = await rep.insert_t_friend_code(test_frc_info_another_user);
        expect(cnt).toEqual(1);

        // test insert object 5 (other server)
        let test_frc_info_other_server = TestEntity.get_test_friend_code();
        test_frc_info_other_server.server_id = "test_server_other";
        cnt = await rep.insert_t_friend_code(test_frc_info_other_server);
        expect(cnt).toEqual(1);

        // select nothing
        await expect(rep.get_t_friend_code(test_frc_info.server_id, 'target_key')).resolves.toEqual([]);

        // select correct another game group by user
        let result = await rep.get_t_friend_code(test_frc_info.server_id, test_frc_info.user_id);
        expect(result.length).toEqual(2);
        expect(result).toContainEqual(test_frc_info);
        expect(result).toContainEqual(test_frc_info_another_game);

        // select correct another user group by game
        result = await rep.get_t_friend_code_from_game_id(test_frc_info_another_game.server_id, test_frc_info_another_game.game_id);
        expect(result.length).toEqual(2);
        expect(result).toContainEqual(test_frc_info_another_game);
        expect(result).toContainEqual(test_frc_info_another_user);

        // select all
        result = await rep.get_t_friend_code_all(test_frc_info.server_id);
        expect(result.length).toEqual(3);
        expect(result).toContainEqual(test_frc_info);
        expect(result).toContainEqual(test_frc_info_another_game);
        expect(result).toContainEqual(test_frc_info_another_user);
    });

    test("insert and update test: insert -> select -> update -> select", async () => {
        const rep = new FriendCodeRepository(sqlite_file);

        // test insert onject 1
        let test_frc_info = TestEntity.get_test_friend_code();
        let cnt = await rep.insert_t_friend_code(test_frc_info);
        expect(cnt).toEqual(1);

        // select correct
        let result = await rep.get_t_friend_code(test_frc_info.server_id, test_frc_info.user_id);
        expect(result.length).toEqual(1);
        expect(result).toContainEqual(test_frc_info);

        // test update object 2 (updated)
        let test_frc_info_updated = TestEntity.get_test_friend_code();
        test_frc_info_updated.user_name = "test_user_name_updated";
        test_frc_info_updated.friend_code = "test_token_updated";
        test_frc_info_updated.regist_time = new Date("2099-03-04T05:06:07.000Z");
        test_frc_info_updated.update_time = new Date("2099-11-30T10:58:57.000Z");
        test_frc_info_updated.delete = false;
        cnt = await rep.update_t_friend_code(test_frc_info_updated);
        expect(cnt).toEqual(1);

        // select correct
        result = await rep.get_t_friend_code(test_frc_info_updated.server_id, test_frc_info_updated.user_id);
        expect(result.length).toEqual(1);
        expect(result).toContainEqual(test_frc_info_updated);

        // test update invalid object 2 (updated)
        test_frc_info_updated.server_id = "test_server_other";
        test_frc_info_updated.user_name = "test_user_name_updated";
        test_frc_info_updated.friend_code = "test_token_updated";
        test_frc_info_updated.regist_time = new Date("2099-03-04T05:06:07.000Z");
        test_frc_info_updated.update_time = new Date("2099-11-30T10:58:57.000Z");
        test_frc_info_updated.delete = false;
        cnt = await rep.update_t_friend_code(test_frc_info_updated);
        expect(cnt).toEqual(0);
    });

    test("insert and delete test: insert -> select -> delete -> select", async () => {
        const rep = new FriendCodeRepository(sqlite_file);

        // test insert onject 1
        let test_frc_info = TestEntity.get_test_friend_code();
        let cnt = await rep.insert_t_friend_code(test_frc_info);
        expect(cnt).toEqual(1);

        // test insert object 2 to other server
        let test_frc_info_other_server = TestEntity.get_test_friend_code();
        test_frc_info_other_server.server_id = "test_server_id_other";
        cnt = await rep.insert_t_friend_code(test_frc_info_other_server);
        expect(cnt).toEqual(1);

        // select correct
        let result = await rep.get_t_friend_code(test_frc_info.server_id, test_frc_info.user_id);
        expect(result.length).toEqual(1);
        expect(result).toContainEqual(test_frc_info);

        // delete
        cnt = await rep.delete_t_friend_code(test_frc_info.server_id, test_frc_info.user_id, test_frc_info.game_id);
        expect(cnt).toEqual(1);

        // select deleted
        await expect(rep.get_t_friend_code(test_frc_info.server_id, test_frc_info.user_id)).resolves.toEqual([]);
    });

    test("update or delete non-found friend code test", async () => {
        const rep = new FriendCodeRepository(sqlite_file);
        let cnt = await rep.update_t_friend_code(TestEntity.get_test_friend_code());
        expect(cnt).toEqual(0);
        cnt = await rep.delete_t_friend_code(TestEntity.get_test_friend_code().server_id, TestEntity.get_test_friend_code().user_id, TestEntity.get_test_friend_code().game_id);
        expect(cnt).toEqual(0);
    });
});