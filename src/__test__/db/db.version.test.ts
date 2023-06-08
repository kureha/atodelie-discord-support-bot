import { VersionRepository } from '../../db/version';

// import test entities
import { TestEntity } from '../common/test_entity';

// create rep
const rep = new VersionRepository();

const initial_version: string = '1.0.0.0';

describe("db.version test.", () => {
    beforeEach(async () => {
        await rep.delete_m_version_all();
    });

    test("select recruitment test: initial master values", async () => {
        // select initial value
        let ver = await rep.get_m_version();
        expect(ver).toEqual({
            app_version: initial_version,
            database_version: initial_version,
        });
    });

    test("insert and delete recruitment test: insert -> select(error) -> select(ok) -> delete", async () => {
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

        // select
        await expect(rep.get_m_version()).resolves.toStrictEqual(test_ver);

        // delete initial version
        cnt = await rep.delete_m_version(test_ver);
        expect(cnt).toEqual(1);
    });
});