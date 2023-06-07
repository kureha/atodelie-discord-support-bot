"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMasterRepository = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import entities
const game_master_1 = require("../entity/game_master");
// import utils
const sqlite_utils_1 = require("../logic/sqlite_utils");
class GameMasterRepository {
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
            // get execute sql lists
            const execute_sql_list = [GameMasterRepository.SQL_CREATE_m_game_master];
            execute_sql_list.forEach((sql, idx) => {
                const stmt = db.prepare(sql);
                stmt.run({}, (err) => {
                    if (err) {
                        logger_1.logger.error(`sql exception occured when create table. sql = ${sql}`);
                        logger_1.logger.error(err);
                        reject(err);
                    }
                    // if list is ended, resolve
                    if (idx + 1 == execute_sql_list.length) {
                        resolve();
                    }
                });
                stmt.finalize();
            });
            db.close();
        });
    }
    /**
     * insert data
     * @param data
     * @returns
     */
    insert_m_game_master(data) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // get prepared statement
                const sql = `${GameMasterRepository.SQL_INSERT_m_game_master}`;
                logger_1.logger.info(`sql = ${sql}, server_id = ${data.server_id}, game_id = ${data.game_id}, game_name = ${data.game_name}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: data.server_id,
                    $game_id: data.game_id,
                    $game_name: data.game_name,
                    $regist_time: data.regist_time,
                    $update_time: data.update_time,
                    $delete: data.delete,
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
    /**
     * update data
     * @param data key is [data.server_id] and [data.game_id]
     * @returns
     */
    update_m_game_master(data) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // get prepared statement
                const sql = `${GameMasterRepository.SQL_UPDATE_m_game_master} WHERE [server_id] = $server_id AND [game_id] = $game_id`;
                logger_1.logger.info(`sql = ${sql}, server_id = ${data.server_id}, game_id = ${data.game_id}, game_id = ${data.game_id}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: data.server_id,
                    $game_id: data.game_id,
                    $game_name: data.game_name,
                    $regist_time: data.regist_time,
                    $update_time: data.update_time,
                    $delete: data.delete,
                }, (err) => {
                    if (err) {
                        logger_1.logger.error(`update m_game_master error. detail = ${err}`);
                        reject(`update m_game_master error. detail = ${err}`);
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
    /**
     * delete data by server_id and game_id
     * @param server_id
     * @param game_id
     * @returns
     */
    delete_m_game_master(server_id, game_id) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // get prepared statement
                const sql = `${GameMasterRepository.SQL_DELETE_m_game_master} WHERE [server_id] = $server_id AND [game_id] = $game_id `;
                logger_1.logger.info(`sql = ${sql}, server_id = ${server_id}, game_id = ${game_id}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: server_id,
                    $game_id: game_id,
                }, (err) => {
                    if (err) {
                        logger_1.logger.error(`delete m_game_master error. detail = ${err}`);
                        reject(`delete m_game_master error. detail = ${err}`);
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
    /**
     * get data by game master
     * @returns data
     */
    get_m_game_master_all(server_id) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // run serialize
                const sql = `${GameMasterRepository.SQL_SELECT_m_game_master} WHERE m1.[server_id] = $server_id AND m1.[delete] = false ORDER BY m1.[game_id]`;
                logger_1.logger.info(`sql = ${sql}`);
                db.all(sql, [server_id], ((err, rows) => {
                    if (err) {
                        logger_1.logger.error(`select m_game_master failed. sql = ${sql}`);
                        // return blank data
                        resolve(err);
                    }
                    else if (rows === undefined || rows === null || rows.length === 0) {
                        logger_1.logger.info(`data not found on m_game_master. sql = ${sql}`);
                        // return blank data
                        resolve([]);
                    }
                    else {
                        // return value list
                        const friend_code_list = [];
                        rows.forEach((v) => {
                            friend_code_list.push(game_master_1.GameMaster.parse_from_db(v));
                        });
                        // return correct data
                        logger_1.logger.info(`selected m_game_master successed.`);
                        logger_1.logger.trace(rows);
                        resolve(friend_code_list);
                    }
                }));
            });
            db.close();
        });
    }
    /**
     * get data by game master
     * @returns data
     */
    get_m_game_master(server_id, game_id) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // run serialize
                const sql = `${GameMasterRepository.SQL_SELECT_m_game_master} WHERE m1.[server_id] = $server_id AND m1.[game_id] = $game_id AND m1.[delete] = false ORDER BY m1.[game_id]`;
                logger_1.logger.info(`sql = ${sql}`);
                db.get(sql, [server_id, game_id], ((err, row) => {
                    if (err) {
                        logger_1.logger.error(`select m_game_master failed. sql = ${sql}`);
                        // return blank data
                        reject(err);
                    }
                    else if (row === undefined) {
                        logger_1.logger.info(`data not found on m_game_master. sql = ${sql}`);
                        // return blank data
                        reject(`data not found on m_game_master. sql = ${sql}`);
                    }
                    else {
                        // return correct data
                        logger_1.logger.info(`selected m_game_master successed.`);
                        logger_1.logger.trace(row);
                        resolve(game_master_1.GameMaster.parse_from_db(row));
                    }
                }));
            });
            db.close();
        });
    }
}
exports.GameMasterRepository = GameMasterRepository;
/**
 * create master table SQL
 */
GameMasterRepository.SQL_CREATE_m_game_master = 'CREATE TABLE IF NOT EXISTS [m_game_master] ( [server_id]	TEXT NOT NULL, [game_id] TEXT NOT NULL, [game_name] TEXT NOT NULL, [regist_time] DATETIME NOT NULL, [update_time] DATETIME NOT NULL, [delete] BOOLEAN NOT NULL, PRIMARY KEY([server_id], [game_id]))';
/**
 * insert SQL
 */
GameMasterRepository.SQL_INSERT_m_game_master = 'INSERT INTO [m_game_master] ([server_id], [game_id], [game_name], [regist_time], [update_time], [delete]) VALUES ($server_id, $game_id, $game_name, $regist_time, $update_time, $delete) ';
/**
 * update SQL
 */
GameMasterRepository.SQL_UPDATE_m_game_master = 'UPDATE [m_game_master] SET [server_id] = $server_id, [game_id] = $game_id, [game_name] = $game_name, [regist_time] = $regist_time, [update_time] = $update_time, [delete] = $delete ';
/**
 * delete SQL
 */
GameMasterRepository.SQL_DELETE_m_game_master = 'DELETE FROM [m_game_master] ';
/**
 * select SQL
 */
GameMasterRepository.SQL_SELECT_m_game_master = 'SELECT m1.[server_id], m1.[game_id], m1.[game_name], m1.[regist_time], m1.[update_time], m1.[delete] FROM [m_game_master] m1 ';
//# sourceMappingURL=game_master.js.map