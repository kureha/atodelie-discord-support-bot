"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionRepository = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
const version_1 = require("../entity/version");
// import utils
const sqlite_utils_1 = require("../logic/sqlite_utils");
class VersionRepository {
    /**
     * constructor
     */
    constructor(file_path = constants.SQLITE_FILE) {
        /**
         * SQLITE FILE PATH
         */
        this.sqlite_file_path = constants_1.Constants.STRING_EMPTY;
        // check database file path / memory
        if (sqlite_utils_1.SqliteUtils.check_open_database(file_path) == false) {
            logger_1.logger.error(`database file is not found. file_path = ${file_path}`);
            throw new Error(`database file is not found. file_path = ${file_path}`);
        }
        // try to open
        const db = this.get_db_instance(file_path);
        logger_1.logger.info(`database open successed. db = ${db}`);
        // set file path to instance
        this.sqlite_file_path = file_path;
        logger_1.logger.info(`database file path is set to ${this.sqlite_file_path}. `);
    }
    /**
     * get using sqlite file path for this instance.
     * @returns sqlite file path
     */
    get_sqlite_file_path() {
        return this.sqlite_file_path;
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
     * create table
     * @param db sqlite3 database instance
     */
    create_all_database(db) {
        return new Promise((resolve, reject) => {
            db.serialize(function () {
                // run serialize
                db.run(VersionRepository.SQL_CREATE_M_VERSION, [], ((err) => {
                    if (err) {
                        logger_1.logger.error(`sql exception occured when create table. sql = ${VersionRepository.SQL_CREATE_M_VERSION}`);
                        reject(err);
                    }
                    // resolve after all sql completed
                    resolve();
                }));
            });
            db.close();
        });
    }
    /**
     * get data
     * @param
     * @returns single data
     */
    get_m_version() {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // run serialize
                const sql = `${VersionRepository.SQL_SELECT_M_VERSION} `;
                logger_1.logger.info(`sql = ${sql}`);
                db.get(sql, [], ((err, row) => {
                    if (err) {
                        logger_1.logger.error(`select m_version failed. please setting m_version. sql = ${sql} `);
                        // no data error
                        reject(`select m_version failed. please setting m_version. sql = ${sql} `);
                    }
                    else if (row === undefined || row === null || row.length === 0) {
                        logger_1.logger.error(`data not found on m_version. please setting m_version. sql = ${sql} `);
                        // no data error
                        reject(`data not found on m_version. please setting m_version. sql = ${sql} `);
                    }
                    else if (row.length > 1) {
                        logger_1.logger.error(`more than 2 datas found on m_version. please setting m_version. sql = ${sql} `);
                        // duplicate data error
                        reject(`more than 2 datas found on m_version. please setting m_version. sql = ${sql} `);
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
    /**
     * insert data
     * @param version_data
     * @returns
     */
    insert_m_version(version_data) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // run serialize
                const sql = VersionRepository.SQL_INSERT_M_VERSION;
                logger_1.logger.info(`sql = ${sql}, app_version = ${version_data.app_version}, database_version = ${version_data.database_version}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $app_version: version_data.app_version,
                    $database_version: version_data.database_version,
                }, (err) => {
                    if (err) {
                        logger_1.logger.error(`insert m_version failed. err = ${err}`);
                        reject(err);
                    }
                    logger_1.logger.info(`insert m_version successed. : app_version = ${version_data.app_version}, database_version = ${version_data.database_version}`);
                    // affected row numbers
                    let changes = 0;
                    // get affected row numbers from db object
                    if (stmt.changes != undefined) {
                        changes = stmt.changes;
                    }
                    // resolve ended this sql
                    resolve(changes);
                });
                stmt.finalize();
            });
            db.close();
        });
    }
    /**
     * delete data
     * @param token
     * @returns
     */
    delete_m_version(version_data) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // get prepared statement
                const sql = `${VersionRepository.SQL_DELETE_M_VERSION} WHERE [app_version] = $app_version and [database_version] = $database_version `;
                logger_1.logger.info(`sql = ${sql}, app_version = ${version_data.app_version} and database_version = ${version_data.database_version}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $app_version: version_data.app_version,
                    $database_version: version_data.database_version,
                }, (err) => {
                    if (err) {
                        logger_1.logger.error(err);
                        reject(err);
                    }
                    // affected row numbers
                    let changes = 0;
                    // get affected row numbers from db object
                    if (stmt.changes != undefined) {
                        changes = stmt.changes;
                    }
                    // resolve ended this sql
                    resolve(changes);
                });
                stmt.finalize();
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
 * insert SQL
 */
VersionRepository.SQL_INSERT_M_VERSION = 'INSERT INTO [m_version] ([app_version], [database_version]) values ($app_version, $database_version) ';
/**
 * select SQL
 */
VersionRepository.SQL_SELECT_M_VERSION = 'SELECT m1.[app_version], m1.[database_version] from [m_version] m1 ';
/**
 * delete SQL
 */
VersionRepository.SQL_DELETE_M_VERSION = 'DELETE FROM [m_version] ';
//# sourceMappingURL=version.js.map