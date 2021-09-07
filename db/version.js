"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionRepository = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
const version_1 = require("../entity/version");
class VersionRepository {
    /**
     * constructor
     * @constructor
     */
    constructor() {
        const db = this.get_db_instance(constants.SQLITE_FILE);
        logger_1.logger.info(`database open successed. db = ${db}`);
    }
    /**
     * get sqlite3 database instance
     * @param file_path sqlite3 file path
     * @returns sqlite3 database instance
     */
    get_db_instance(file_path) {
        // initialize SQLite instance
        const sqlite = require(constants.REQUIRE_NAME_SQLITE3).verbose();
        var db = new sqlite.Database(file_path);
        // detect SQLite error from instance
        if (db === undefined || db === null) {
            logger_1.logger.error(`database instance is undefined or null.`);
            throw `database instance is undefined or null.`;
        }
        else {
            // return SQLite instance if status is good
            return db;
        }
    }
    /**
     * get data by server id
     * @param server_id
     * @returns data
     */
    get_m_server_info() {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                const sql = `${VersionRepository.SQL_SELECT_M_VERSION} `;
                logger_1.logger.info(`sql = ${sql}`);
                db.get(sql, [], ((err, row) => {
                    if (err) {
                        logger_1.logger.error(`select m_version failed. please setting m_version. sql = ${sql} `);
                        // return blank data
                        reject(`select m_version failed. please setting m_version. sql = ${sql} `);
                    }
                    else if (row === undefined || row === null || row.length === 0) {
                        logger_1.logger.error(`data not found on m_version. please setting m_version. sql = ${sql} `);
                        // return blank data
                        reject(`data not found on m_version. please setting m_version. sql = ${sql} `);
                    }
                    else {
                        // return correct data
                        logger_1.logger.info(`selected m_version successed. `);
                        logger_1.logger.trace(row);
                        resolve(version_1.Version.parse_from_db(row));
                    }
                }));
            });
            db.close();
        });
    }
}
exports.VersionRepository = VersionRepository;
/**
 * create table SQL
 */
VersionRepository.SQL_CREATE_M_VERSION = 'CREATE TABLE IF NOT EXISTS [m_version] ( [app_version] TEXT NOT NULL, [database_version] TEXT NOT NULL) ';
/**
 * select SQL
 */
VersionRepository.SQL_SELECT_M_VERSION = 'SELECT m1.[app_version], m1.[database_version] from [m_version] m1 ';
//# sourceMappingURL=version.js.map