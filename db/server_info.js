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
     * インスタンス化を行い、同時に、テーブルがない場合は作成する
     * @returns {Promise} インスタンス
     */
    constructor() {
        const db = this.get_db_instance(constants.SQLITE_FILE);
        logger_1.logger.info(`database open successed. db = ${db}`);
    }
    /**
     * sqlite3のデータベースのインスタンスを取得する
     * @param {string} file_path sqlite3ファイルパス
     * @returns {Database} sqlite3データベース用インスタンス
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
     * 全テーブルを作成する
     * @param {Database} db sqlite3データベース用インスタンス
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
     * チャンネルマスタから情報を取得します
     * @param {string} server_id
     * @returns {Promise<ServerInfo>} Promiseオブジェクト、データベースの選択内容
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
     * チャンネルマスタに情報を新規登録します
     * @param {ServerInfo} server_info_data
     * @returns {Promise} Promiseオブジェクト、データベースの選択内容
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
                    logger_1.logger.info(`insert m_server_info successed. : server_id = ${server_info_data.server_id}, channel_id = ${server_info_data.channel_id}, recruitment_target_role = ${server_info_data.recruitment_target_role}`);
                    resolve();
                }));
            });
            db.close();
        });
    }
    /**
     * チャンネルマスタのフォロー時間を更新します
     * @param {string} server_id
     * @param {Date} follow_time
     * @returns {Promise} Promiseオブジェクト、データベースの選択内容
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
     * チャンネルマスタから情報を削除します
     * @param {string} server_id
     * @returns {Promise} Promiseオブジェクト、データベースの選択内容
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
 * チャンネル情報マスタテーブル作成用SQL
 */
ServerInfoRepository.SQL_CREATE_M_SERVER_INFO = 'CREATE TABLE IF NOT EXISTS [m_server_info] ( [server_id] TEXT NOT NULL UNIQUE, [channel_id] TEXT NOT NULL, [recruitment_target_role] TEXT NOT NULL, [follow_time] DATETIME, PRIMARY KEY([server_id]) )';
/**
 * チャンネル情報マスタテーブル挿入用SQL
 */
ServerInfoRepository.SQL_INSERT_M_SERVER_INFO = 'INSERT INTO [m_server_info] ([server_id] , [channel_id], [recruitment_target_role], [follow_time]) VALUES ($server_id, $channel_id, $recruitment_target_role, null) ';
/**
 * チャンネル情報マスタテーブルフォロー時間更新用SQL
 */
ServerInfoRepository.SQL_UPDATE_M_SERVER_INFO_FOLLOW_TIME = 'UPDATE [m_server_info] SET follow_time = $follow_time ';
/**
 * チャンネル情報マスタテーブル選択用SQL
 */
ServerInfoRepository.SQL_SELECT_M_SERVER_INFO = 'SELECT m1.[server_id] , m1.[channel_id], m1.[recruitment_target_role], m1.[follow_time] FROM [m_server_info] m1 ';
/**
 * チャンネル情報マスタテーブル削除用SQL
 */
ServerInfoRepository.SQL_DELETE_M_SERVER_INFO = 'DELETE FROM [m_server_info] ';
//# sourceMappingURL=server_info.js.map