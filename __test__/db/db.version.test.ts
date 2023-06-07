import { VersionRepository } from '../../db/version';
import { Version } from '../../entity/version';

import { Version as CommonVersion } from '../../common/version';

test('test for version for c/r/d', () => {
    return new Promise<void>((resolve, reject) => {

        // define version test object
        const ver = new Version();
        ver.app_version = 'test_app_ver';
        ver.database_version = 'test_db_ver';

        const version_repo = new VersionRepository();

        version_repo.get_m_version()
            .catch((err) => {
                // zero data is ng
                console.log(err);
                expect(true).toBe(false);
                reject(err);
            })
            .then((data) => {
                // 1 data is ok
                // insert
                return version_repo.insert_m_version(ver);
            }).then(() => {
                return version_repo.get_m_version()
            })
            .then(() => {
                // insert error, db data is 1
                expect(true).toBe(false);
                reject();
            })
            .catch((err) => {
                // 2 data is chatch ok
                return version_repo.delete_m_version(ver);
            })
            .then(() => {
                // final check
                return version_repo.get_m_version();
            })
            .then(() => {
                // OK
                resolve();
            })
            .catch((err) => {
                console.log(err);
                expect(true).toBe(false);
                reject(err);
            });
    });
})

test('test for common version module get app version', () => {
    return new Promise<void>((resolve, reject) => {
        CommonVersion.get_app_version()
            .then((app_ver) => {
                expect(app_ver).not.toEqual('');
                resolve();
            })
            .catch((err) => {
                console.log(err);
                expect(true).toBe(false);
                reject(err);
            });
    })
});

test('test for common version module get db version', () => {
    return new Promise<void>((resolve, reject) => {
        CommonVersion.get_database_version()
            .then((db_ver) => {
                expect(db_ver).not.toEqual('');
                resolve();
            })
            .catch((err) => {
                console.log(err);
                expect(true).toBe(false);
                reject(err);
            });
    })
});