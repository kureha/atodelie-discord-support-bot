// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
import { VersionRepository } from '../db/version';
import { resolve } from 'path/posix';
const constants = new Constants();

export class Version {
    /**
     * return application version
     * @returns version string of hard coding
     */
    static get_app_version(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            resolve('1.0.0.0');
        });
    }

    /**
     * return database version
     * @returns version string of database (m_version)
     */
    static get_database_version(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const r = new VersionRepository();
            r.get_m_server_info()
                .then((data) => {
                    resolve(data.database_version);
                })
                .catch(() => {
                    reject();
                })
        });
    }
}