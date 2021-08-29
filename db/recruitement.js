"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
// ロガーを定義
const logger_1 = require("../common/logger");
// 定数定義を読み込む
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// エンティティ有効化
const recruitment_1 = require("../entity/recruitment");
// UUID有効化
const uuid = __importStar(require("uuid"));
class RecruitmentRepository {
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
        // SQLite初期化
        const sqlite = require(constants.REQUIRE_NAME_SQLITE3).verbose();
        var db = new sqlite.Database(file_path);
        // インスタンス化できているかでエラーを判定する
        if (db === undefined || db === null) {
            logger_1.logger.error(`database instance is undefined or null.`);
            throw `database instance is undefined or null.`;
        }
        else {
            // 正常時はインスタンスを返す
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
                db.run(RecruitmentRepository.SQL_CREATE_M_RECRUITMENT, [], ((err) => {
                    if (err) {
                        logger_1.logger.error(`sql exception occured when create table. sql = ${RecruitmentRepository.SQL_CREATE_M_RECRUITMENT}`);
                        reject(err);
                    }
                    // 全SQL処理後に完了とする
                    resolve();
                }));
            });
            db.close();
        });
    }
    /**
     * UUIDのTokenを取得します
     * @returns {string} UUIDベースのToken
     */
    static create_uuid_token() {
        return uuid.v4();
    }
    /**
     * 募集マスタを1行追加します
     * @param {Recruitment} data
     * @returns {Promise}
     */
    insert_m_recruitment(data) {
        // Promise処理
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
                    $token: data.token,
                    $status: data.status,
                    $limit_time: data.get_limit_time().toISOString(),
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
     * 募集マスタを更新します
     * @param {Recruitment} data
     * @returns {Promise}
     */
    update_m_recruitment(data) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${RecruitmentRepository.SQL_UPDATE_M_RECRUITMENT} WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= datetime(\'now\', \'localtime\') `;
                logger_1.logger.info(`sql = ${sql}, token = ${data.token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: data.server_id,
                    $token: data.token,
                    $status: data.status,
                    $limit_time: data.get_limit_time().toISOString(),
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
     * 募集マスタを削除します
     * @param {string} token
     * @returns {Promise}
     */
    delete_m_recruitment(token) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${RecruitmentRepository.SQL_DELETE_M_RECRUITMENT} WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= datetime(\'now\', \'localtime\') `;
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
     * 募集マスタ用のIDを選択します
     * @returns {int} Promiseオブジェクト、データベースの選択内容
     */
    get_m_recruitment_id() {
        // Promise処理
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
     * 募集フォロー対象の一覧を取得します
     * @param {string} server_id
     * @param {string} from_datetime
     * @param {string} to_datetime
     * @returns {Promise<Recruitment[]>} 対象の募集マスタデータ
     */
    get_m_recruitment_for_follow(server_id, from_datetime, to_datetime) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                const sql = `${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT} WHERE m1.[server_id] = $server_id AND datetime(m1.[limit_time], 'utc') > datetime($from_datetime) AND datetime(m1.[limit_time], 'utc') <= datetime($to_datetime) ORDER BY m1.[limit_time], m1.[id]`;
                logger_1.logger.info(`sql = ${sql}, server_id = ${server_id}, from_time = ${from_datetime}, to_datetime = ${to_datetime}`);
                db.all(sql, {
                    $server_id: server_id,
                    $from_datetime: from_datetime,
                    $to_datetime: to_datetime,
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
     * 募集マスタ用のTOKENを生成します。
     * 生成値がかぶっていた場合にRejectするため、呼び出し時にRetry処理が必要です
     * @returns {string} TOKEN
     */
    get_m_recruitment_token() {
        // Promise処理
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
     * 募集マスタを1行選択します
     * @param {string} token
     * @returns {Promise<Recruitment>} Promiseオブジェクト、データベースの選択内容
     */
    get_m_recruitment(token) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                const sql = `${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT} WHERE m1.[token] = ? and m1.[delete] = false and datetime(m1.[limit_time] , \'localtime\') >= datetime(\'now\', \'localtime\') `;
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
                    else {
                        logger_1.logger.info(`selected single m_reqruitement successed. : key = ${token}`);
                        logger_1.logger.trace(row);
                        resolve(recruitment_1.Recruitment.parse_from_db(row));
                    }
                }));
            });
            db.close();
        });
    }
    /**
     * 募集マスタを指定行選択します
     * @param {string} server_id
     * @returns {Promise<Recruitment[]>} Promiseオブジェクト、データベースの選択内容
     */
    get_m_recruitment_latests(server_id, count) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                const sql = `${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT} WHERE [server_id] = ? AND datetime(m1.[limit_time], 'localtime') > datetime('now', 'localtime') ORDER BY m1.[limit_time], m1.[id] LIMIT ${count}`;
                logger_1.logger.info(`sql = ${sql}, token = ${server_id}`);
                db.all(sql, [server_id], ((err, rows) => {
                    if (err) {
                        logger_1.logger.error(`select m_recruitment failed. sql = ${sql}, key = ${server_id}`);
                        reject(err);
                    }
                    else if (rows === undefined) {
                        logger_1.logger.error(`data not found on m_recruitment. sql = ${sql}, key = ${server_id}`);
                        reject(`data not found on m_recruitment. sql = ${sql}, key = ${server_id}`);
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
 * 募集マスタテーブル作成用SQL
 */
RecruitmentRepository.SQL_CREATE_M_RECRUITMENT = 'CREATE TABLE IF NOT EXISTS [m_recruitment] ( [id] INTEGER NOT NULL UNIQUE, [server_id] TEXT NOT NULL, [token] TEXT NOT NULL UNIQUE, [status] INTEGER NOT NULL, [limit_time] DATETIME NOT NULL, [name] TEXT NOT NULL, [owner_id] TEXT NOT NULL, [description] TEXT, [regist_time] DATETIME NOT NULL, [update_time] DATETIME NOT NULL, [delete] BOOLEAN NOT NULL, PRIMARY KEY([id]) )';
/**
 * 募集マスタテーブル選択用SQL
 */
RecruitmentRepository.SQL_SELECT_M_RECRUITMENT = 'SELECT m1.[id], m1.[server_id], m1.[token], m1.[status], m1.[limit_time], m1.[name], m1.[owner_id], m1.[description], m1.[regist_time], m1.[update_time], m1.[delete] FROM [m_recruitment] m1 ';
/**
 * 募集マスタテーブル挿入用SQL
 */
RecruitmentRepository.SQL_INSERT_M_RECRUITMENT = 'INSERT INTO [m_recruitment] ([id], [server_id], [token], [status], [limit_time], [name], [owner_id], [description], [regist_time], [update_time], [delete]) values ($id, $server_id, $token, $status, $limit_time, $name, $owner_id, $description, datetime(\'now\', \'localtime\'), datetime(\'now\', \'localtime\'), false) ';
/**
 * 募集マスタテーブル更新用SQL
 */
RecruitmentRepository.SQL_UPDATE_M_RECRUITMENT = 'UPDATE [m_recruitment] SET [server_id] = $server_id, [status] = $status, [limit_time] = $limit_time, [name] = $name, [owner_id] = $owner_id, [description] = $description, [update_time] = datetime(\'now\', \'localtime\'), [delete] = $delete ';
/**
 * 募集マスタテーブル削除用SQL
 */
RecruitmentRepository.SQL_DELETE_M_RECRUITMENT = 'DELETE FROM [m_recruitment] ';
/**
 * 募集マスタテーブルから次のIDを取得するSQL
 */
RecruitmentRepository.SQL_SELECT_M_RECRUITMENT_MAX_ID = 'SELECT IFNULL(MAX(id) + 1, 1) AS id FROM [m_recruitment] ';
/**
 * 募集マスタテーブルから一致するトークンが有効募集で使われてるかを確認するSQL
 */
RecruitmentRepository.SQL_SELECT_M_RECRUITMENT_TOKEN_COUNT = 'SELECT COUNT(*) AS [count] FROM [m_recruitment] WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= datetime(\'now\', \'localtime\') ';
//# sourceMappingURL=recruitement.js.map