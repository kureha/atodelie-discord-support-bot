import { VersionRepository } from '../../db/version';

// import constants
import { Constants } from '../../common/constants';
const constants = new Constants();

// import test entities
import { TestEntity } from '../common/test_entity';

import * as fs from 'fs';

const sqlite_file: string = './.data/db.version.test.sqlite';

const initial_version: string = '1.0.0.0';

describe("db.version intialize test", () => {
    test("test for initialize", async () => {
        const rep = new VersionRepository(":memory:");
        await expect(rep.create_all_database(rep.get_db_instance(":memory:"))).resolves;
    });
});

describe("db.version test.", () => {
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
        const rep = new VersionRepository(sqlite_file);
        expect(fs.existsSync(rep.get_sqlite_file_path())).toBeTruthy();
        expect(fs.existsSync(rep.get_sqlite_file_path() + ".notfound")).toBeFalsy();
    });

    test("select recruitment test: initial master values", async () => {
        const rep = new VersionRepository(sqlite_file);

        // select initial value
        let ver = await rep.get_m_version();
        expect(ver).toEqual({
            app_version: initial_version,
            database_version: initial_version,
        });
    });

    test("insert and delete recruitment test: insert -> select(error) -> delete -> select(ok)", async () => {
        const rep = new VersionRepository(sqlite_file);

        // select initial value
        let ver = await rep.get_m_version();
        expect(ver).toEqual({
            app_version: initial_version,
            database_version: initial_version,
        });

        // insert (double value)
        let test_ver = TestEntity.get_test_version();
        let cnt = await rep.insert_m_version(test_ver);
        expect(cnt).toEqual(1);

        // error for select
        try {
            await rep.get_m_version();
            expect(true).toBeFalsy;
        } catch (e) {
            expect(e).toMatch(/^more than 2 datas found on m_version\./);
        }

        // delete initial version
        cnt = await rep.delete_m_version(ver);
        expect(cnt).toEqual(1);

        // select
        await expect(rep.get_m_version()).resolves.toStrictEqual(test_ver);
    });
});