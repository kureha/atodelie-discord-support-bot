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
     * insert SQL
     */
    static SQL_INSERT_M_VERSION = 'INSERT INTO [m_version] ([app_version], [database_version]) values ($app_version, $database_version) ';

    /**
     * select SQL
     */
    static SQL_SELECT_M_VERSION = 'SELECT m1.[app_version], m1.[database_version] from [m_version] m1 ';

    /**
     * delete SQL
     */
    static SQL_DELETE_M_VERSION = 'DELETE FROM [m_version] ';

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
     * get data
     * @param  
     * @returns single data
     */
    get_m_version(): Promise<Version> {
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
                        // no data error
                        reject(`select m_version failed. please setting m_version. sql = ${sql} `);
                    }
                    else if (row === undefined || row === null || row.length === 0) {
                        logger.error(`data not found on m_version. please setting m_version. sql = ${sql} `);
                        // no data error
                        reject(`data not found on m_version. please setting m_version. sql = ${sql} `);
                    } else if (row.length > 1) {
                        logger.error(`more than 2 datas found on m_version. please setting m_version. sql = ${sql} `);
                        // duplicate data error
                        reject(`more than 2 datas found on m_version. please setting m_version. sql = ${sql} `);
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

    /**
     * insert data
     * @param version_data 
     * @returns
     */
    insert_m_version(version_data: Version): Promise<any> {
        // return promise
        return new Promise<void>((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);

            db.serialize(function () {
                // run serialize
                const sql = VersionRepository.SQL_INSERT_M_VERSION;
                logger.info(`sql = ${sql}, app_version = ${version_data.app_version}, database_version = ${version_data.database_version}`);
                db.run(sql, {
                    $app_version: version_data.app_version,
                    $database_version: version_data.database_version,
                }, ((err: any) => {
                    if (err) {
                        logger.error(`insert m_version failed. err = ${err}`);
                        reject(err);
                    }

                    logger.info(`insert m_version successed. : app_version = ${version_data.app_version}, database_version = ${version_data.database_version}`);
                    resolve();
                }));
            });

            db.close();
        });
    }

    /**
     * delete data
     * @param token 
     * @returns 
     */
    delete_m_version(version_data: Version): Promise<any> {
        // return promise
        return new Promise<void>((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${VersionRepository.SQL_DELETE_M_VERSION} WHERE [app_version] = $app_version and [database_version] = $database_version `;
                logger.info(`sql = ${sql}, app_version = ${version_data.app_version} and database_version = ${version_data.database_version}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $app_version: version_data.app_version,
                    $database_version: version_data.database_version,
                }, (err: any) => {
                    if (err) {
                        logger.error(err);
                        reject(err);
                    }
                    // resolve ended this sql
                    resolve();
                });
                stmt.finalize();
            });
            db.close();
        });
    }
}