"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipateRepository = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import utils
const sqlite_utils_1 = require("../common/sqlite_utils");
// import entities
const participate_1 = require("../entity/participate");
class ParticipateRepository {
    /**
     * constructor
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
     * create table
     * @param db sqlite3 database instance
     */
    create_all_database(db) {
        return new Promise((resolve, reject) => {
            db.serialize(function () {
                // run serialize
                db.run(ParticipateRepository.SQL_CREATE_T_PARTICIPATE, [], ((err) => {
                    if (err) {
                        logger_1.logger.error(`sql exception occured when create table. sql = ${ParticipateRepository.SQL_CREATE_T_PARTICIPATE}`);
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
     * insert data
     * @param data
     * @returns
     */
    insert_t_participate(data) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${ParticipateRepository.SQL_INSERT_T_PARTICIPATE}`;
                logger_1.logger.info(`sql = ${sql}, token = ${data.token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $token: data.token,
                    $status: data.status,
                    $user_id: data.user_id,
                    $description: data.description,
                }, (err) => {
                    if (err) {
                        logger_1.logger.error(err);
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
    /**
     * update data
     * @param data key is [data.token] and [data.user_id]
     * @returns
     */
    update_t_participate(data) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${ParticipateRepository.SQL_UPDATE_T_PARTICIPATE} where [id] = (select [id] from [m_recruitment] where [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= ${sqlite_utils_1.SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL)}) AND [user_id] = $user_id `;
                logger_1.logger.info(`sql = ${sql}, token = ${data.token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $token: data.token,
                    $user_id: data.user_id,
                    $status: data.status,
                    $description: data.description,
                    $delete: data.delete,
                }, (err) => {
                    if (err) {
                        logger_1.logger.error(err);
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
    /**
     * delete data by token
     * @param token
     * @returns
     */
    delete_t_participate(token) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${ParticipateRepository.SQL_DELETE_T_PARTICIPATE} WHERE [id] = (SELECT [id] FROM [m_recruitment] WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= ${sqlite_utils_1.SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL)}) `;
                logger_1.logger.info(`sql = ${sql}, token = ${token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $token: token,
                }, (err) => {
                    if (err) {
                        logger_1.logger.error(err);
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
    /**
     * select data list by token
     * @param token
     * @returns participate data list
     */
    get_t_participate(token) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                const sql = `${ParticipateRepository.SQL_SELECT_T_PARTICIPATE} inner join [m_recruitment] m1 on t1.[id] = m1.[id] where m1.[token] = $token and m1.[delete] = false and t1.[delete] = false and datetime(m1.[limit_time], \'localtime\') >= ${sqlite_utils_1.SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL)} order by t1.[update_time] `;
                logger_1.logger.info(`sql = ${sql}, token = ${token}`);
                db.all(sql, [token], ((err, rows) => {
                    if (err) {
                        logger_1.logger.error(`select t_participate failed. sql = ${sql}, key = ${token}`);
                        reject(err);
                    }
                    else if (rows === undefined || rows === null || rows.length === 0) {
                        logger_1.logger.info(`data not found on t_participate. sql = ${sql}, key = ${token}`);
                        resolve([]);
                    }
                    else {
                        // return value list
                        const participate_list = [];
                        rows.forEach(v => {
                            participate_list.push(participate_1.Participate.parse_from_db(v));
                        });
                        logger_1.logger.info(`selected t_participate successed. : key = ${token}`);
                        logger_1.logger.trace(rows);
                        resolve(participate_list);
                    }
                }));
            });
            db.close();
        });
    }
}
exports.ParticipateRepository = ParticipateRepository;
/**
 * create SQL
 */
ParticipateRepository.SQL_CREATE_T_PARTICIPATE = 'CREATE TABLE IF NOT EXISTS [t_participate] ( [id] INTEGER NOT NULL, [status] INTEGER NOT NULL, [user_id] TEXT NOT NULL, [description] TEXT, [regist_time] DATETIME NOT NULL, [update_time] DATETIME NOT NULL, [delete] BOOLEAN NOT NULL, PRIMARY KEY([id],[user_id]) )';
/**
 * select SQL
 */
ParticipateRepository.SQL_SELECT_T_PARTICIPATE = 'SELECT t1.[id], t1.[status], t1.[user_id], t1.[description], t1.[regist_time], t1.[update_time], t1.[delete] FROM [t_participate] t1 ';
/**
 * insert SQL
 */
ParticipateRepository.SQL_INSERT_T_PARTICIPATE = 'INSERT INTO [t_participate] ([id], [status], [user_id], [description], [regist_time], [update_time], [delete]) SELECT [id], $status, $user_id, $description, ' + sqlite_utils_1.SqliteUtils.get_now() + ', ' + sqlite_utils_1.SqliteUtils.get_now() + ', false FROM [m_recruitment] WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= ' + sqlite_utils_1.SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL) + ' ';
/**
 * update SQL
 */
ParticipateRepository.SQL_UPDATE_T_PARTICIPATE = 'UPDATE [t_participate] SET [status] = $status, [description] = $description, [update_time] = ' + sqlite_utils_1.SqliteUtils.get_now() + ', [delete] = $delete ';
/**
 * delete SQL
 */
ParticipateRepository.SQL_DELETE_T_PARTICIPATE = 'DELETE FROM [t_participate] ';
//# sourceMappingURL=participate.js.map