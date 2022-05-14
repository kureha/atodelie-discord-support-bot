"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruitmentRepository = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import utils
const sqlite_utils_1 = require("../common/sqlite_utils");
// import entities
const recruitment_1 = require("../entity/recruitment");
// import uuid modules
const uuid = __importStar(require("uuid"));
class RecruitmentRepository {
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
     * create table
     * @param db sqlite3 database instance
     */
    create_all_database(db) {
        return new Promise((resolve, reject) => {
            db.serialize(function () {
                // run serialize
                db.run(RecruitmentRepository.SQL_CREATE_M_RECRUITMENT, [], ((err) => {
                    if (err) {
                        logger_1.logger.error(`sql exception occured when create table. sql = ${RecruitmentRepository.SQL_CREATE_M_RECRUITMENT}`);
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
     * get UUID format token
     * @returns UUID
     */
    static create_uuid_token() {
        return uuid.v4();
    }
    /**
     * insert data
     * @param data
     * @returns
     */
    insert_m_recruitment(data) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${RecruitmentRepository.SQL_INSERT_M_RECRUITMENT}`;
                logger_1.logger.info(`sql = ${sql}, id = ${data.id}, token = ${data.token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $id: data.id,
                    $server_id: data.server_id,
                    $message_id: data.message_id,
                    $thread_id: data.thread_id,
                    $token: data.token,
                    $status: data.status,
                    $limit_time: data.limit_time.toISOString(),
                    $name: data.name,
                    $owner_id: data.owner_id,
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
     * @param data
     * @returns
     */
    update_m_recruitment(data) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${RecruitmentRepository.SQL_UPDATE_M_RECRUITMENT} WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= ${sqlite_utils_1.SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL)} `;
                logger_1.logger.info(`sql = ${sql}, token = ${data.token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: data.server_id,
                    $message_id: data.message_id,
                    $thread_id: data.thread_id,
                    $token: data.token,
                    $status: data.status,
                    $limit_time: data.limit_time.toISOString(),
                    $name: data.name,
                    $owner_id: data.owner_id,
                    $description: data.description,
                    $delete: data.delete
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
     * delete data
     * @param token
     * @returns
     */
    delete_m_recruitment(token) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${RecruitmentRepository.SQL_DELETE_M_RECRUITMENT} WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= ${sqlite_utils_1.SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL)} `;
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
     * get max id for m_recruitment
     * @returns max id number
     */
    get_m_recruitment_id() {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                const sql = `${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT_MAX_ID}`;
                logger_1.logger.info(`sql = ${sql}`);
                db.get(sql, [], ((err, row) => {
                    if (err) {
                        logger_1.logger.error(`sql exception occured when create table. sql = ${RecruitmentRepository.SQL_CREATE_M_RECRUITMENT}`);
                        reject(err);
                    }
                    logger_1.logger.info(`selected max m_reqruitement id successed. : result = ${row.id}`);
                    resolve(row.id);
                }));
            });
            db.close();
        });
    }
    /**
     * get data list for follow
     * @param server_id
     * @param from_datetime
     * @param to_datetime
     * @returns follow up data list
     */
    get_m_recruitment_for_follow(server_id, from_datetime, to_datetime) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                const sql = `${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT} WHERE m1.[server_id] = $server_id AND datetime(m1.[limit_time], 'utc') > datetime($from_datetime) AND datetime(m1.[limit_time], 'utc') <= datetime($to_datetime) ORDER BY m1.[limit_time], m1.[id]`;
                logger_1.logger.info(`sql = ${sql}, server_id = ${server_id}, from_time = ${from_datetime.toLocaleString()}, to_datetime = ${to_datetime.toLocaleString()}`);
                db.all(sql, {
                    $server_id: server_id,
                    $from_datetime: from_datetime.toISOString(),
                    $to_datetime: to_datetime.toISOString(),
                }, ((err, rows) => {
                    if (err) {
                        logger_1.logger.error(`sql exception occured when create table. sql = ${RecruitmentRepository.SQL_CREATE_M_RECRUITMENT}`);
                        reject(err);
                    }
                    // return valie list
                    const recruitment_list = [];
                    rows.forEach(v => {
                        recruitment_list.push(recruitment_1.Recruitment.parse_from_db(v));
                    });
                    logger_1.logger.info(`selected m_reqruitement followup list successed.`);
                    logger_1.logger.trace(rows);
                    resolve(recruitment_list);
                }));
            });
            db.close();
        });
    }
    /**
     * get token for m_recruitment
     * if token is already exists, this function will by reject, please retry
     * @returns token string
     */
    get_m_recruitment_token() {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get sample token
                let token = RecruitmentRepository.create_uuid_token();
                logger_1.logger.debug(`token : ${token}`);
                // run serialize
                const sql = `${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT_TOKEN_COUNT} `;
                logger_1.logger.info(`sql = ${sql}`);
                db.get(sql, {
                    $token: token
                }, ((err, row) => {
                    if (err) {
                        logger_1.logger.error(`sql exception occured when select token count. sql = ${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT_TOKEN_COUNT}`);
                        reject(err);
                    }
                    if (row.count === 0) {
                        logger_1.logger.info(`generate unique token id successed. : result = ${token}`);
                        resolve(token);
                    }
                    else {
                        logger_1.logger.info(`generated token is not unique, rejected.`);
                        reject(`generated token is not unique, rejected.`);
                    }
                }));
            });
            db.close();
        });
    }
    /**
     * select single data
     * @param token
     * @returns recruitment data
     */
    get_m_recruitment(token) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                const sql = `${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT} WHERE m1.[token] = ? and m1.[delete] = false and datetime(m1.[limit_time] , \'localtime\') >= ${sqlite_utils_1.SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL)} `;
                logger_1.logger.info(`sql = ${sql}, token = ${token}`);
                db.get(sql, [token], ((err, row) => {
                    if (err) {
                        logger_1.logger.error(`select m_recruitment failed. sql = ${sql}, key = ${token}`);
                        reject(err);
                    }
                    else if (row === undefined) {
                        logger_1.logger.error(`data not found on m_recruitment. sql = ${sql}, key = ${token}`);
                        reject(`data not found on m_recruitment. sql = ${sql}, key = ${token}`);
                    }
                    logger_1.logger.info(`selected single m_reqruitement successed. : key = ${token}`);
                    logger_1.logger.trace(row);
                    resolve(recruitment_1.Recruitment.parse_from_db(row));
                }));
            });
            db.close();
        });
    }
    /**
     * select data by message id and owner id
     * @param message_id message id
     * @param owner_id owner id
     * @returns recruitment data
     */
    get_m_recruitment_by_message_id(message_id, owner_id) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                const sql = `${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT} WHERE m1.[message_id] = ? and m1.[owner_id] = ? and m1.[delete] = false and datetime(m1.[limit_time] , \'localtime\') >= ${sqlite_utils_1.SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL)} `;
                logger_1.logger.info(`sql = ${sql}, message_id = ${message_id}, owner_id = ${owner_id}`);
                db.get(sql, [message_id, owner_id], ((err, row) => {
                    if (err) {
                        logger_1.logger.error(`select m_recruitment failed. sql = ${sql}, message_id = ${message_id}, owner_id = ${owner_id}`);
                        reject(err);
                    }
                    else if (row === undefined || row.length === 0) {
                        logger_1.logger.error(`data not found on m_recruitment. sql = ${sql}, message_id = ${message_id}, owner_id = ${owner_id}`);
                        reject(`data not found on m_recruitment. sql = ${sql}, message_id = ${message_id}, owner_id = ${owner_id}`);
                    }
                    logger_1.logger.info(`selected single m_reqruitement successed. : message_id = ${message_id}, owner_id = ${owner_id}`);
                    logger_1.logger.trace(row);
                    resolve(recruitment_1.Recruitment.parse_from_db(row));
                }));
            });
            db.close();
        });
    }
    /**
     * select data list for server
     * @param server_id server id
     * @returns recruitment data
     */
    get_m_recruitment_latests(server_id, count) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                const sql = `${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT} WHERE [server_id] = ? AND datetime(m1.[limit_time], 'localtime') > ${sqlite_utils_1.SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL)} ORDER BY m1.[limit_time], m1.[id] LIMIT ${count}`;
                logger_1.logger.info(`sql = ${sql}, token = ${server_id}`);
                db.all(sql, [server_id], ((err, rows) => {
                    if (err) {
                        logger_1.logger.error(`select m_recruitment failed. sql = ${sql}, key = ${server_id}`);
                        reject(err);
                    }
                    else if (rows === undefined || rows === null || rows.length === 0) {
                        logger_1.logger.info(`data not found on m_recruitment. sql = ${sql}, key = ${server_id}`);
                        resolve([]);
                    }
                    else {
                        // return valie list
                        const recruitment_list = [];
                        rows.forEach(v => {
                            recruitment_list.push(recruitment_1.Recruitment.parse_from_db(v));
                        });
                        logger_1.logger.info(`selected latests m_reqruitement successed. : key = ${server_id}`);
                        logger_1.logger.trace(rows);
                        resolve(recruitment_list);
                    }
                }));
            });
            db.close();
        });
    }
}
exports.RecruitmentRepository = RecruitmentRepository;
/**
 * create SQL
 */
RecruitmentRepository.SQL_CREATE_M_RECRUITMENT = 'CREATE TABLE IF NOT EXISTS [m_recruitment] ( [id] INTEGER NOT NULL UNIQUE, [server_id] TEXT NOT NULL, [message_id] TEXT, [thread_id] TEXT, [token] TEXT NOT NULL UNIQUE, [status] INTEGER NOT NULL, [limit_time] DATETIME NOT NULL, [name] TEXT NOT NULL, [owner_id] TEXT NOT NULL, [description] TEXT, [regist_time] DATETIME NOT NULL, [update_time] DATETIME NOT NULL, [delete] BOOLEAN NOT NULL, PRIMARY KEY([id]) )';
/**
 * select SQL
 */
RecruitmentRepository.SQL_SELECT_M_RECRUITMENT = 'SELECT m1.[id], m1.[server_id], m1.[message_id], m1.[thread_id], m1.[token], m1.[status], m1.[limit_time], m1.[name], m1.[owner_id], m1.[description], m1.[regist_time], m1.[update_time], m1.[delete] FROM [m_recruitment] m1 ';
/**
 * insert SQL
 */
RecruitmentRepository.SQL_INSERT_M_RECRUITMENT = 'INSERT INTO [m_recruitment] ([id], [server_id], [message_id], [thread_id], [token], [status], [limit_time], [name], [owner_id], [description], [regist_time], [update_time], [delete]) values ($id, $server_id, $message_id, $thread_id, $token, $status, $limit_time, $name, $owner_id, $description, ' + sqlite_utils_1.SqliteUtils.get_now() + ', ' + sqlite_utils_1.SqliteUtils.get_now() + ', false) ';
/**
 * update SQL
 */
RecruitmentRepository.SQL_UPDATE_M_RECRUITMENT = 'UPDATE [m_recruitment] SET [server_id] = $server_id, [message_id] = $message_id, [thread_id] = $thread_id, [status] = $status, [limit_time] = $limit_time, [name] = $name, [owner_id] = $owner_id, [description] = $description, [update_time] = ' + sqlite_utils_1.SqliteUtils.get_now() + ', [delete] = $delete ';
/**
 * delete SQL
 */
RecruitmentRepository.SQL_DELETE_M_RECRUITMENT = 'DELETE FROM [m_recruitment] ';
/**
 * get next id SQL
 */
RecruitmentRepository.SQL_SELECT_M_RECRUITMENT_MAX_ID = 'SELECT IFNULL(MAX(id) + 1, 1) AS id FROM [m_recruitment] ';
/**
 * check token is exists SQL
 */
RecruitmentRepository.SQL_SELECT_M_RECRUITMENT_TOKEN_COUNT = 'SELECT COUNT(*) AS [count] FROM [m_recruitment] WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= ' + sqlite_utils_1.SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL) + ' ';
//# sourceMappingURL=recruitement.js.map