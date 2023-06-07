"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendCodeRepository = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import entities
const friend_code_1 = require("../entity/friend_code");
// import utils
const sqlite_utils_1 = require("../logic/sqlite_utils");
class FriendCodeRepository {
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
            const execute_sql_list = [FriendCodeRepository.SQL_CREATE_T_FRIEND_CODE];
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
    insert_t_friend_code(data) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // get prepared statement
                const sql = `${FriendCodeRepository.SQL_INSERT_T_FRIEND_CODE}`;
                logger_1.logger.info(`sql = ${sql}, server_id = ${data.server_id}, user_name = ${data.user_name}, game_name = ${data.game_name}, friend_code = ${data.friend_code}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: data.server_id,
                    $user_id: data.user_id,
                    $user_name: data.user_name,
                    $game_id: data.game_id,
                    $game_name: data.game_name,
                    $friend_code: data.friend_code,
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
     * @param data key is [data.user_id] and [data.game_id]
     * @returns
     */
    update_t_friend_code(data) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // get prepared statement
                const sql = `${FriendCodeRepository.SQL_UPDATE_T_FRIEND_CODE} WHERE [server_id] = $server_id AND [user_id] = $user_id AND [game_id] = $game_id`;
                logger_1.logger.info(`sql = ${sql}, server_id = ${data.server_id}, user_id = ${data.user_id}, game_id = ${data.game_id}, friend_code = ${data.friend_code}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: data.server_id,
                    $user_id: data.user_id,
                    $user_name: data.user_name,
                    $game_id: data.game_id,
                    $game_name: data.game_name,
                    $friend_code: data.friend_code,
                    $regist_time: data.regist_time,
                    $update_time: data.update_time,
                    $delete: data.delete,
                }, (err) => {
                    if (err) {
                        logger_1.logger.error(`update t_friend_code error. detail = ${err}`);
                        reject(`update t_friend_code error. detail = ${err}`);
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
     * delete data by user_id and game_id
     * @param server_id
     * @param user_id
     * @param game_id
     * @returns
     */
    delete_t_friend_code(server_id, user_id, game_id) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // get prepared statement
                const sql = `${FriendCodeRepository.SQL_DELETE_T_FRIEND_CODE} WHERE [server_id] = $server_id AND [user_id] = $user_id AND [game_id] = $game_id `;
                logger_1.logger.info(`sql = ${sql}, user_id = ${user_id}, game_id = ${game_id}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: server_id,
                    $user_id: user_id,
                    $game_id: game_id,
                }, (err) => {
                    if (err) {
                        logger_1.logger.error(`delete t_friend_code error. detail = ${err}`);
                        reject(`delete t_friend_code error. detail = ${err}`);
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
     * get data by game friend_code info
     * @param server_id
     * @returns data
     */
    get_t_friend_code_all(server_id) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // run serialize
                const sql = `${FriendCodeRepository.SQL_SELECT_T_FRIEND_CODE} WHERE t1.[server_id] = $server_id AND t1.[delete] = false ORDER BY t1.[user_id], t1.[game_id]`;
                logger_1.logger.info(`sql = ${sql}`);
                db.all(sql, [server_id], ((err, rows) => {
                    if (err) {
                        logger_1.logger.error(`select t_friend_code failed. sql = ${sql}`);
                        // return blank data
                        resolve(err);
                    }
                    else if (rows === undefined || rows === null || rows.length === 0) {
                        logger_1.logger.info(`data not found on t_friend_code. sql = ${sql}`);
                        // return blank data
                        resolve([]);
                    }
                    else {
                        // return value list
                        const game_friend_code_list = [];
                        rows.forEach((v) => {
                            game_friend_code_list.push(friend_code_1.FriendCode.parse_from_db(v));
                        });
                        // return correct data
                        logger_1.logger.info(`selected t_friend_code successed.`);
                        logger_1.logger.trace(rows);
                        resolve(game_friend_code_list);
                    }
                }));
            });
            db.close();
        });
    }
    /**
     * get data by game friend_code info
     * @param server_id
     * @param user_id
     * @returns data
     */
    get_t_friend_code(server_id, user_id) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // run serialize
                const sql = `${FriendCodeRepository.SQL_SELECT_T_FRIEND_CODE} WHERE t1.[server_id] = $server_id AND t1.[user_id] = $user_id AND t1.[delete] = false ORDER BY t1.[user_name], t1.[game_id]`;
                logger_1.logger.info(`sql = ${sql}`);
                db.all(sql, [server_id, user_id], ((err, rows) => {
                    if (err) {
                        logger_1.logger.error(`select t_friend_code failed. sql = ${sql}`);
                        // return blank data
                        resolve(err);
                    }
                    else if (rows === undefined || rows === null || rows.length === 0) {
                        logger_1.logger.info(`data not found on t_friend_code. sql = ${sql}`);
                        // return blank data
                        resolve([]);
                    }
                    else {
                        // return value list
                        const game_friend_code_list = [];
                        rows.forEach((v) => {
                            game_friend_code_list.push(friend_code_1.FriendCode.parse_from_db(v));
                        });
                        // return correct data
                        logger_1.logger.info(`selected t_friend_code successed.`);
                        logger_1.logger.trace(rows);
                        resolve(game_friend_code_list);
                    }
                }));
            });
            db.close();
        });
    }
    /**
     * get data by game friend_code info
     * @param server_id
     * @param game_id
     * @returns data
     */
    get_t_friend_code_from_game_id(server_id, game_id) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // run serialize
                const sql = `${FriendCodeRepository.SQL_SELECT_T_FRIEND_CODE} WHERE t1.[server_id] = $server_id AND t1.[game_id] = $game_id AND t1.[delete] = false ORDER BY t1.[user_id], t1.[game_id]`;
                logger_1.logger.info(`sql = ${sql}`);
                db.all(sql, [server_id, game_id], ((err, rows) => {
                    if (err) {
                        logger_1.logger.error(`select t_friend_code failed. sql = ${sql}`);
                        // return blank data
                        resolve(err);
                    }
                    else if (rows === undefined || rows === null || rows.length === 0) {
                        logger_1.logger.info(`data not found on t_friend_code. sql = ${sql}`);
                        // return blank data
                        resolve([]);
                    }
                    else {
                        // return value list
                        const game_friend_code_list = [];
                        rows.forEach((v) => {
                            game_friend_code_list.push(friend_code_1.FriendCode.parse_from_db(v));
                        });
                        // return correct data
                        logger_1.logger.info(`selected t_friend_code successed.`);
                        logger_1.logger.trace(rows);
                        resolve(game_friend_code_list);
                    }
                }));
            });
            db.close();
        });
    }
}
exports.FriendCodeRepository = FriendCodeRepository;
/**
 * create data table SQL
 */
FriendCodeRepository.SQL_CREATE_T_FRIEND_CODE = 'CREATE TABLE IF NOT EXISTS [t_friend_code] ( [server_id] TEXT NOT NULL, [user_id] TEXT NOT NULL, [user_name] TEXT NOT NULL, [game_id] TEXT NOT NULL, [game_name] TEXT NOT NULL, [friend_code] TEXT NOT NULL, [regist_time] DATETIME NOT NULL, [update_time] DATETIME NOT NULL, [delete] BOOLEAN NOT NULL )';
/**
 * insert SQL
 */
FriendCodeRepository.SQL_INSERT_T_FRIEND_CODE = 'INSERT INTO [t_friend_code] ([server_id], [user_id], [user_name], [game_id], [game_name], [friend_code], [regist_time], [update_time], [delete]) values ($server_id, $user_id, $user_name, $game_id, $game_name, $friend_code, $regist_time, $update_time, $delete) ';
/**
 * update SQL
 */
FriendCodeRepository.SQL_UPDATE_T_FRIEND_CODE = 'UPDATE [t_friend_code] SET [server_id] = $server_id, [user_id] = $user_id, [user_name] = $user_name, [game_id] = $game_id, [game_name] = $game_name, [friend_code] = $friend_code, [regist_time] = $regist_time, [update_time] = $update_time, [delete] = $delete ';
/**
 * select SQL
 */
FriendCodeRepository.SQL_SELECT_T_FRIEND_CODE = 'SELECT t1.[server_id], t1.[user_id], t1.[user_name], t1.[game_id], t1.[game_name], t1.[friend_code], t1.[regist_time], t1.[update_time], t1.[delete] FROM [t_friend_code] t1 ';
/**
 * delete SQL
 */
FriendCodeRepository.SQL_DELETE_T_FRIEND_CODE = 'DELETE FROM [t_friend_code] ';
//# sourceMappingURL=friend_code.js.map