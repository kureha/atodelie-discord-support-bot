"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerInfoRepository = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import entities
const server_info_1 = require("../entity/server_info");
class ServerInfoRepository {
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
                db.run(ServerInfoRepository.SQL_CREATE_M_SERVER_INFO, [], ((err) => {
                    if (err) {
                        logger_1.logger.error(`sql exception occured when create table. sql = ${ServerInfoRepository.SQL_CREATE_M_SERVER_INFO}`);
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
     * get data by server id
     * @param server_id
     * @returns data
     */
    get_m_server_info(server_id) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                const sql = `${ServerInfoRepository.SQL_SELECT_M_SERVER_INFO} WHERE m1.[server_id] = ? `;
                logger_1.logger.info(`sql = ${sql}, server_id = ${server_id}`);
                db.get(sql, [server_id], ((err, row) => {
                    // create error server_info data
                    const error_server_info = new server_info_1.ServerInfo();
                    // return blank data
                    error_server_info.server_id = server_id;
                    error_server_info.channel_id = constants.RECRUITMENT_INVALID_CHANNEL_ID;
                    error_server_info.recruitment_target_role = constants.RECRUITMENT_INVALID_ROLE;
                    error_server_info.follow_time = constants_1.Constants.get_default_date();
                    if (err) {
                        logger_1.logger.error(`select m_server_info failed. please setting m_server_info. sql = ${sql}, key = ${server_id}`);
                        // return blank data
                        resolve(error_server_info);
                    }
                    else if (row === undefined || row === null || row.length === 0) {
                        logger_1.logger.error(`data not found on m_server_info. please setting m_server_info. sql = ${sql}, key = ${server_id}`);
                        // return blank data
                        resolve(error_server_info);
                    }
                    else {
                        // return correct data
                        logger_1.logger.info(`selected m_server_info successed. : server_id = ${server_id}`);
                        logger_1.logger.trace(row);
                        resolve(server_info_1.ServerInfo.parse_from_db(row));
                    }
                }));
            });
            db.close();
        });
    }
    /**
     * insert data
     * @param server_info_data
     * @returns
     */
    insert_m_server_info(server_info_data) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                const sql = ServerInfoRepository.SQL_INSERT_M_SERVER_INFO;
                logger_1.logger.info(`sql = ${sql}, server_id = ${server_info_data.server_id}, channel_id = ${server_info_data.channel_id}, recruitment_target_role = ${server_info_data.recruitment_target_role}`);
                db.run(sql, {
                    $server_id: server_info_data.server_id,
                    $channel_id: server_info_data.channel_id,
                    $recruitment_target_role: server_info_data.recruitment_target_role,
                }, ((err) => {
                    if (err) {
                        logger_1.logger.error(`insert m_server_info failed. err = ${err}`);
                        reject(err);
                    }
                    else {
                        logger_1.logger.info(`insert m_server_info successed. : server_id = ${server_info_data.server_id}, channel_id = ${server_info_data.channel_id}, recruitment_target_role = ${server_info_data.recruitment_target_role}`);
                        resolve();
                    }
                }));
            });
            db.close();
        });
    }
    /**
     * update data
     * @param server_info_data
     * @returns
     */
    update_m_server_info(server_info_data) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                const sql = `${ServerInfoRepository.SQL_UPDATE_M_SERVER_INFO} WHERE [server_id] = $server_id`;
                logger_1.logger.info(`sql = ${sql}, server_id = ${server_info_data.server_id}, channel_id = ${server_info_data.channel_id}, recruitment_target_role = ${server_info_data.recruitment_target_role}, follow_time = ${server_info_data.follow_time}`);
                db.run(sql, {
                    $server_id: server_info_data.server_id,
                    $channel_id: server_info_data.channel_id,
                    $recruitment_target_role: server_info_data.recruitment_target_role,
                    $follow_time: server_info_data.follow_time,
                }, ((err) => {
                    if (err) {
                        logger_1.logger.error(`update m_server_info failed. err = ${err}`);
                        reject(err);
                    }
                    else {
                        logger_1.logger.info(`update m_server_info successed. : server_id = ${server_info_data.server_id}, channel_id = ${server_info_data.channel_id}, recruitment_target_role = ${server_info_data.recruitment_target_role}, follow_time = ${server_info_data.follow_time}`);
                        resolve();
                    }
                }));
            });
            db.close();
        });
    }
    /**
     * update m_server follow time data
     * @param server_id
     * @param follow_time
     * @returns
     */
    update_m_server_info_follow_time(server_id, follow_time) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                const sql = `${ServerInfoRepository.SQL_UPDATE_M_SERVER_INFO_FOLLOW_TIME} WHERE server_id = $server_id`;
                logger_1.logger.info(`sql = ${sql}, server_id = ${server_id}, follow_time = ${follow_time.toISOString()}`);
                db.run(sql, {
                    $server_id: server_id,
                    $follow_time: follow_time.toISOString(),
                }, ((err) => {
                    if (err) {
                        logger_1.logger.error(`update m_server_info failed. err = ${err}`);
                        reject(err);
                    }
                    logger_1.logger.info(`update m_server_info successed. : server_id = ${server_id}, follow_time = ${follow_time.toISOString()}`);
                    resolve();
                }));
            });
            db.close();
        });
    }
    /**
     * delete data by server id
     * @param server_id
     * @returns
     */
    delete_m_server_info(server_id) {
        // return promise
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                const sql = `${ServerInfoRepository.SQL_DELETE_M_SERVER_INFO} WHERE [server_id] = $server_id`;
                logger_1.logger.info(`sql = ${sql}, server_id = ${server_id}`);
                db.run(sql, {
                    $server_id: server_id,
                }, ((err) => {
                    if (err) {
                        logger_1.logger.error(`delete m_server_info failed. err = ${err}`);
                        reject(err);
                    }
                    logger_1.logger.info(`delete m_server_info successed. : server_id = ${server_id}`);
                    resolve();
                }));
            });
            db.close();
        });
    }
}
exports.ServerInfoRepository = ServerInfoRepository;
/**
 * create table SQL
 */
ServerInfoRepository.SQL_CREATE_M_SERVER_INFO = 'CREATE TABLE IF NOT EXISTS [m_server_info] ( [server_id] TEXT NOT NULL UNIQUE, [channel_id] TEXT NOT NULL, [recruitment_target_role] TEXT NOT NULL, [follow_time] DATETIME, PRIMARY KEY([server_id]) )';
/**
 * insert SQL
 */
ServerInfoRepository.SQL_INSERT_M_SERVER_INFO = 'INSERT INTO [m_server_info] ([server_id] , [channel_id], [recruitment_target_role], [follow_time]) VALUES ($server_id, $channel_id, $recruitment_target_role, null) ';
/**
 * update SQL
 */
ServerInfoRepository.SQL_UPDATE_M_SERVER_INFO = 'UPDATE [m_server_info] set [channel_id] = $channel_id, [recruitment_target_role] = $recruitment_target_role, [follow_time] = $follow_time ';
/**
 * update SQL follow time
 */
ServerInfoRepository.SQL_UPDATE_M_SERVER_INFO_FOLLOW_TIME = 'UPDATE [m_server_info] SET follow_time = $follow_time ';
/**
 * select SQL
 */
ServerInfoRepository.SQL_SELECT_M_SERVER_INFO = 'SELECT m1.[server_id] , m1.[channel_id], m1.[recruitment_target_role], m1.[follow_time] FROM [m_server_info] m1 ';
/**
 * delete SQL
 */
ServerInfoRepository.SQL_DELETE_M_SERVER_INFO = 'DELETE FROM [m_server_info] ';
//# sourceMappingURL=server_info.js.map