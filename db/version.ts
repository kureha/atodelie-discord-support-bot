// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

import { Version } from '../entity/version';

export class VersionRepository {
    /**
     * create table SQL
     */
    static SQL_CREATE_M_VERSION = 'CREATE TABLE IF NOT EXISTS [m_version] ( [app_version] TEXT NOT NULL, [database_version] TEXT NOT NULL) ';

    /**
     * select SQL
     */
    static SQL_SELECT_M_VERSION = 'SELECT m1.[app_version], m1.[database_version] from [m_version] m1 ';

    /**
     * constructor
     * @constructor
     */
    constructor() {
        const db = this.get_db_instance(constants.SQLITE_FILE);
        logger.info(`database open successed. db = ${db}`);
    }

    /**
     * get sqlite3 database instance
     * @param file_path sqlite3 file path
     * @returns sqlite3 database instance
     */
    get_db_instance(file_path: string): any {
        // initialize SQLite instance
        const sqlite = require(constants.REQUIRE_NAME_SQLITE3).verbose();
        var db = new sqlite.Database(file_path);

        // detect SQLite error from instance
        if (db === undefined || db === null) {
            logger.error(`database instance is undefined or null.`);
            throw `database instance is undefined or null.`;
        } else {
            // return SQLite instance if status is good
            return db;
        }
    }

    /**
     * get data by server id
     * @param server_id 
     * @returns data
     */
    get_m_server_info(): Promise<Version> {
        // return promise
        return new Promise<Version>((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);

            db.serialize(function () {
                // run serialize
                const sql = `${VersionRepository.SQL_SELECT_M_VERSION} `;
                logger.info(`sql = ${sql}`);
                db.get(sql, [], ((err: any, row: any) => {
                    if (err) {
                        logger.error(`select m_version failed. please setting m_version. sql = ${sql} `);
                        // return blank data
                        reject(`select m_version failed. please setting m_version. sql = ${sql} `);
                    }
                    else if (row === undefined || row === null || row.length === 0) {
                        logger.error(`data not found on m_version. please setting m_version. sql = ${sql} `);
                        // return blank data
                        reject(`data not found on m_version. please setting m_version. sql = ${sql} `);
                    } else {
                        // return correct data
                        logger.info(`selected m_version successed. `);
                        logger.trace(row);
                        resolve(Version.parse_from_db(row));
                    }
                }));
            });

            db.close();
        });
    }
}