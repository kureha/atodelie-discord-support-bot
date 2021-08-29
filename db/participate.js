"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipateRepository = void 0;
// ロガーを定義
const logger_1 = require("../common/logger");
// 定数定義を読み込む
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
class ParticipateRepository {
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
                db.run(ParticipateRepository.SQL_CREATE_T_PARTICIPATE, [], ((err) => {
                    if (err) {
                        logger_1.logger.error(`sql exception occured when create table. sql = ${ParticipateRepository.SQL_CREATE_T_PARTICIPATE}`);
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
     * 参加データを1行追加します
     * @param {Participate} data
     * @returns {Promise}
     */
    insert_t_participate(data) {
        // Promise処理
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
     * 参加データを1行更新します
     * @param {Participate} data キーは「data.token」「data.user_id」の二つ
     * @returns {Promise}
     */
    update_t_participate(data) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${ParticipateRepository.SQL_UPDATE_T_PARTICIPATE} where [id] = (select [id] from [m_recruitment] where [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= datetime(\'now\', \'localtime\')) AND [user_id] = $user_id `;
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
     * 参加データを削除します
     * @param {string} token
     * @returns {Promise}
     */
    delete_t_participate(token) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${ParticipateRepository.SQL_DELETE_T_PARTICIPATE} WHERE [id] = (SELECT [id] FROM [m_recruitment] WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= datetime(\'now\', \'localtime\')) `;
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
     * 参加データをN行選択します
     * @param {string} token
     * @returns {Promise<Participate[]>} Promiseオブジェクト、データベースの選択内容
     */
    get_t_participate(token) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                const sql = `${ParticipateRepository.SQL_SELECT_T_PARTICIPATE} inner join [m_recruitment] m1 on t1.[id] = m1.[id] where m1.[token] = $token and m1.[delete] = false and t1.[delete] = false and datetime(m1.[limit_time], \'localtime\') >= datetime(\'now\', \'localtime\') order by t1.[update_time] `;
                logger_1.logger.info(`sql = ${sql}, token = ${token}`);
                db.all(sql, [token], ((err, rows) => {
                    if (err) {
                        logger_1.logger.error(`select t_participate failed. sql = ${sql}, key = ${token}`);
                        reject(err);
                    }
                    if (rows === undefined) {
                        logger_1.logger.error(`data not found on t_participate. sql = ${sql}, key = ${token}`);
                        reject(`data not found on t_participate. sql = ${sql}, key = ${token}`);
                    }
                    logger_1.logger.info(`selected t_participate successed. : key = ${token}`);
                    logger_1.logger.trace(rows);
                    resolve(rows);
                }));
            });
            db.close();
        });
    }
}
exports.ParticipateRepository = ParticipateRepository;
/**
 * 募集データテーブル作成用SQL
 */
ParticipateRepository.SQL_CREATE_T_PARTICIPATE = 'CREATE TABLE IF NOT EXISTS [t_participate] ( [id] INTEGER NOT NULL, [status] INTEGER NOT NULL, [user_id] TEXT NOT NULL, [description] TEXT, [regist_time] DATETIME NOT NULL, [update_time] DATETIME NOT NULL, [delete] BOOLEAN NOT NULL, PRIMARY KEY([id],[user_id]) )';
/**
 * 募集データテーブル選択用SQL
 */
ParticipateRepository.SQL_SELECT_T_PARTICIPATE = 'SELECT t1.[id], t1.[status], t1.[user_id], t1.[description], t1.[regist_time], t1.[update_time], t1.[delete] FROM [t_participate] t1 ';
/**
 * 募集データテーブル挿入用SQL
 */
ParticipateRepository.SQL_INSERT_T_PARTICIPATE = 'INSERT INTO [t_participate] ([id], [status], [user_id], [description], [regist_time], [update_time], [delete]) SELECT [id], $status, $user_id, $description, datetime(\'now\', \'localtime\'), datetime(\'now\', \'localtime\'), false FROM [m_recruitment] WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= datetime(\'now\', \'localtime\') ';
/**
 * 募集データテーブル更新用SQL
 */
ParticipateRepository.SQL_UPDATE_T_PARTICIPATE = 'UPDATE [t_participate] SET [status] = $status, [description] = $description, [update_time] = datetime(\'now\', \'localtime\'), [delete] = $delete ';
/**
 * 募集データテーブル削除用SQL
 */
ParticipateRepository.SQL_DELETE_T_PARTICIPATE = 'DELETE FROM [t_participate] ';
//# sourceMappingURL=participate.js.map