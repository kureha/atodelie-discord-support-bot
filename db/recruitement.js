const logger = require('./../common/logger');

// 定数定義を読み込む
const Constants = require('../common/constants');
const constants = new Constants();

// UUID有効化
const uuid = require('uuid');

module.exports = class Recruitment {

    /**
     * 募集マスタテーブル作成用SQL
     */
    static SQL_CREATE_M_RECRUITMENT = 'CREATE TABLE IF NOT EXISTS [m_recruitment] ( [id] INTEGER NOT NULL UNIQUE, [server_id] TEXT NOT NULL, [token] TEXT NOT NULL UNIQUE, [status] INTEGER NOT NULL, [limit_time] DATETIME NOT NULL, [name] TEXT NOT NULL, [owner_id] TEXT NOT NULL, [description] TEXT, [regist_time] DATETIME NOT NULL, [update_time] DATETIME NOT NULL, [delete] BOOLEAN NOT NULL, PRIMARY KEY([id]) )';

    /**
     * 募集マスタテーブル選択用SQL
     */
    static SQL_SELECT_M_RECRUITMENT = 'SELECT m1.[id], m1.[server_id], m1.[token], m1.[status], m1.[limit_time], m1.[name], m1.[owner_id], m1.[description], m1.[regist_time], m1.[update_time], m1.[delete] FROM [m_recruitment] m1 ';

    /**
     * 募集マスタテーブル挿入用SQL
     */
    static SQL_INSERT_M_RECRUITMENT = 'INSERT INTO [m_recruitment] ([id], [server_id], [token], [status], [limit_time], [name], [owner_id], [description], [regist_time], [update_time], [delete]) values ($id, $server_id, $token, $status, $limit_time, $name, $owner_id, $description, datetime(\'now\', \'localtime\'), datetime(\'now\', \'localtime\'), false) ';

    /**
     * 募集マスタテーブル更新用SQL
     */
    static SQL_UPDATE_M_RECRUITMENT = 'UPDATE [m_recruitment] SET [server_id] = $server_id, [status] = $status, [limit_time] = $limit_time, [name] = $name, [owner_id] = $owner_id, [description] = $description, [update_time] = datetime(\'now\', \'localtime\'), [delete] = $delete ';

    /**
     * 募集マスタテーブル削除用SQL
     */
    static SQL_DELETE_M_RECRUITMENT = 'DELETE FROM [m_recruitment] ';

    /**
     * 募集マスタテーブルから次のIDを取得するSQL
     */
    static SQL_SELECT_M_RECRUITMENT_MAX_ID = 'SELECT IFNULL(MAX(id) + 1, 1) AS id FROM [m_recruitment] ';

    /**
     * 募集マスタテーブルから一致するトークンが有効募集で使われてるかを確認するSQL
     */
    static SQL_SELECT_M_RECRUITMENT_TOKEN_COUNT = 'SELECT COUNT(*) AS [count] FROM [m_recruitment] WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= datetime(\'now\', \'localtime\') ';

    /**
     * 募集データテーブル作成用SQL
     */
    static SQL_CREATE_T_PARTICIPATE = 'CREATE TABLE IF NOT EXISTS [t_participate] ( [id] INTEGER NOT NULL, [status] INTEGER NOT NULL, [user_id] TEXT NOT NULL, [description] TEXT, [regist_time] DATETIME NOT NULL, [update_time] DATETIME NOT NULL, [delete] BOOLEAN NOT NULL, PRIMARY KEY([id],[user_id]) )';

    /**
     * 募集データテーブル選択用SQL
     */
    static SQL_SELECT_T_PARTICIPATE = 'SELECT t1.[id], t1.[status], t1.[user_id], t1.[description], t1.[regist_time], t1.[update_time], t1.[delete] FROM [t_participate] t1 ';

    /**
     * 募集データテーブル挿入用SQL
     */
    static SQL_INSERT_T_PARTICIPATE = 'INSERT INTO [t_participate] ([id], [status], [user_id], [description], [regist_time], [update_time], [delete]) SELECT [id], $status, $user_id, $description, datetime(\'now\', \'localtime\'), datetime(\'now\', \'localtime\'), false FROM [m_recruitment] WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= datetime(\'now\', \'localtime\') ';

    /**
     * 募集データテーブル更新用SQL
     */
    static SQL_UPDATE_T_PARTICIPATE = 'UPDATE [t_participate] SET [status] = $status, [description] = $description, [update_time] = datetime(\'now\', \'localtime\'), [delete] = $delete ';

    /**
     * 募集データテーブル削除用SQL
     */
    static SQL_DELETE_T_PARTICIPATE = 'DELETE FROM [t_participate] ';

    /**
     * チャンネル情報マスタテーブル作成用SQL
     */
    static SQL_CREATE_m_server_info = 'CREATE TABLE IF NOT EXISTS [m_server_info] ( [server_id] TEXT NOT NULL UNIQUE, [channel_id] TEXT NOT NULL, [recruitment_target_role] TEXT NOT NULL, PRIMARY KEY([server_id]) )';

    /**
     * チャンネル情報マスタテーブル選択用SQL
     */
    static SQL_SELECT_m_server_info = 'SELECT m1.[server_id] , m1.[channel_id], m1.[recruitment_target_role] FROM [m_server_info] m1 ';

    /**
     * SQLIET3のモジュール名称
     */
    static REQUIRE_NAME_SQLITE3 = 'sqlite3';

    /**
     * インスタンス化を行い、同時に、テーブルがない場合は作成する
     * @returns {Promise} インスタンス
     */
    constructor() {
        const db = this.get_db_instance(constants.SQLITE_FILE);
        logger.info(`database open successed. db = ${db}`);

        this.create_all_database(db)
            .then(() => {
                logger.info(`database initialize succeeded.`);
            })
            .catch((err) => {
                logger.error(err);
                throw err;
            });
    }

    /**
     * sqlite3のデータベースのインスタンスを取得する
     * @param {string} file_path sqlite3ファイルパス
     * @returns {Database} sqlite3データベース用インスタンス
     */
    get_db_instance(file_path) {
        // SQLite初期化
        const sqlite = require(Recruitment.REQUIRE_NAME_SQLITE3).verbose();
        var db = new sqlite.Database(file_path);

        // インスタンス化できているかでエラーを判定する
        if (db === undefined || db === null) {
            logger.error(`database instance is undefined or null.`);
            throw `database instance is undefined or null.`;
        } else {
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
                db.run(Recruitment.SQL_CREATE_M_RECRUITMENT, [], ((err) => {
                    if (err) {
                        logger.error(`sql exception occured when create table. sql = ${Recruitment.SQL_CREATE_M_RECRUITMENT}`);
                        reject(err);
                    }
                }));
                db.run(Recruitment.SQL_CREATE_T_PARTICIPATE, [], ((err) => {
                    if (err) {
                        logger.error(`sql exception occured when create table. sql = ${Recruitment.SQL_CREATE_T_PARTICIPATE}`);
                        reject(err);
                    }
                }));
                db.run(Recruitment.SQL_CREATE_m_server_info, [], ((err) => {
                    if (err) {
                        logger.error(`sql exception occured when create table. sql = ${Recruitment.SQL_CREATE_T_PARTICIPATE}`);
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
     * 募集マスタを1行追加します
     * @param {Object} data 
     */
    insert_m_recruitment(data) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${Recruitment.SQL_INSERT_M_RECRUITMENT}`;
                logger.info(`sql = ${sql}, id = ${data.id}, token = ${data.token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $id: data.id,
                    $server_id: data.server_id,
                    $token: data.token,
                    $status: data.status,
                    $limit_time: data.limit_time,
                    $name: data.name,
                    $owner_id: data.owner_id,
                    $description: data.description,
                }, (err) => {
                    if (err) {
                        logger.error(err);
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
     * @param {Object} data 
     */
    update_m_recruitment(data) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${Recruitment.SQL_UPDATE_M_RECRUITMENT} WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= datetime(\'now\', \'localtime\') `;
                logger.info(`sql = ${sql}, token = ${data.token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: data.server_id,
                    $token: data.token,
                    $status: data.status,
                    $limit_time: data.limit_time,
                    $name: data.name,
                    $owner_id: data.owner_id,
                    $description: data.description,
                    $delete: data.delete
                }, (err) => {
                    if (err) {
                        logger.error(err);
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
     * @param {Object} data 
     */
    delete_m_recruitment(token) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${Recruitment.SQL_DELETE_M_RECRUITMENT} WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= datetime(\'now\', \'localtime\') `;
                logger.info(`sql = ${sql}, token = ${token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $token: token,
                }, (err) => {
                    if (err) {
                        logger.error(err);
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
     * @param {string} token 
     * @returns Promiseオブジェクト、データベースの選択内容
     */
    get_m_recruitment_id() {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);

            db.serialize(function () {
                // run serialize
                const sql = `${Recruitment.SQL_SELECT_M_RECRUITMENT_MAX_ID}`;
                logger.info(`sql = ${sql}`);
                db.get(sql, [], ((err, row) => {
                    if (err) {
                        logger.error(`sql exception occured when create table. sql = ${Recruitment.SQL_CREATE_M_RECRUITMENT}`);
                        reject(err);
                    }
                    logger.info(`selected max m_reqruitement id successed. : result = ${row.id}`);
                    resolve(row.id);
                }));
            });

            db.close();
        });
    }

    /**
     * 募集マスタ用のTOKENを生成します。
     * 生成値がかぶっていた場合にRejectするため、呼び出し時にRetry処理が必要です
     */
    get_m_recruitment_token() {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);

            db.serialize(function () {
                // get sample token
                let token = Recruitment.create_uuid_token();
                logger.debug(`token : ${token}`);

                // run serialize
                const sql = `${Recruitment.SQL_SELECT_M_RECRUITMENT_TOKEN_COUNT} `;
                logger.info(`sql = ${sql}`);
                db.get(sql, {
                    $token: token
                }, ((err, row) => {
                    if (err) {
                        logger.error(`sql exception occured when select token count. sql = ${Recruitment.SQL_SELECT_M_RECRUITMENT_TOKEN_COUNT}`);
                        reject(err);
                    }

                    if (row.count === 0) {
                        logger.info(`generate unique token id successed. : result = ${token}`);
                        resolve(token);
                    } else {
                        logger.info(`generated token is not unique, rejected.`);
                        reject(`generated token is not unique, rejected.`);
                    }
                }));
            });

            db.close();
        });
    }

    /**
     * UUIDのTokenを取得します
     * @returns UUIDベースのToken
     */
    static create_uuid_token() {
        return uuid.v4();
    }

    /**
     * 指定桁数のDigitを取得します
     * @param length 桁数
     * @returns 指定された桁数のDigits
     */
    static create_digits_token(length) {
        return ('0'.repeat(length) + String(Math.floor(Math.random() * '9'.repeat(length)) + 1)).slice(-1 * length);
    }

    /**
     * 募集マスタを1行選択します
     * @param {string} token 
     * @returns Promiseオブジェクト、データベースの選択内容
     */
    get_m_recruitment(token) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);

            db.serialize(function () {
                // run serialize
                const sql = `${Recruitment.SQL_SELECT_M_RECRUITMENT} WHERE m1.[token] = ? and m1.[delete] = false and datetime(m1.[limit_time] , \'localtime\') >= datetime(\'now\', \'localtime\') `;
                logger.info(`sql = ${sql}, token = ${token}`);
                db.get(sql, [token], ((err, row) => {
                    if (err) {
                        logger.error(`select m_recruitment failed. sql = ${sql}, key = ${token}`);
                        reject(err);
                    }
                    else if (row === undefined) {
                        logger.error(`data not found on m_recruitment. sql = ${sql}, key = ${token}`);
                        reject(`data not found on m_recruitment. sql = ${sql}, key = ${token}`);
                    } 
                    else {
                        logger.info(`selected single m_reqruitement successed. : key = ${token}`);
                        logger.trace(row);
                        resolve(row);
                    }
                }));
            });

            db.close();
        });
    }

    /**
     * 参加データを1行追加します
     * @param {Object} data 
     */
    insert_t_participate(data) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${Recruitment.SQL_INSERT_T_PARTICIPATE}`;
                logger.info(`sql = ${sql}, token = ${data.token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $token: data.token,
                    $status: data.status,
                    $user_id: data.user_id,
                    $description: data.description,
                }, (err) => {
                    if (err) {
                        logger.error(err);
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
     * @param {Object} data キーは「data.token」「data.user_id」の二つ
     */
    update_t_participate(data) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${Recruitment.SQL_UPDATE_T_PARTICIPATE} where [id] = (select [id] from [m_recruitment] where [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= datetime(\'now\', \'localtime\')) AND [user_id] = $user_id `;
                logger.info(`sql = ${sql}, token = ${data.token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $token: data.token,
                    $user_id: data.user_id,
                    $status: data.status,
                    $description: data.description,
                    $delete: data.delete,
                }, (err) => {
                    if (err) {
                        logger.error(err);
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
     * @param {Object} data 
     */
    delete_t_participate(token) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${Recruitment.SQL_DELETE_T_PARTICIPATE} WHERE [id] = (SELECT [id] FROM [m_recruitment] WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= datetime(\'now\', \'localtime\')) `;
                logger.info(`sql = ${sql}, token = ${token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $token: token,
                }, (err) => {
                    if (err) {
                        logger.error(err);
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
     * @returns Promiseオブジェクト、データベースの選択内容
     */
    get_t_participate(token) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);

            db.serialize(function () {
                // run serialize
                const sql = `${Recruitment.SQL_SELECT_T_PARTICIPATE} inner join [m_recruitment] m1 on t1.[id] = m1.[id] where m1.[token] = $token and m1.[delete] = false and t1.[delete] = false and datetime(m1.[limit_time], \'localtime\') >= datetime(\'now\', \'localtime\') order by t1.[update_time] `;
                logger.info(`sql = ${sql}, token = ${token}`);
                db.all(sql, [token], ((err, rows) => {
                    if (err) {
                        logger.error(`select t_participate failed. sql = ${sql}, key = ${token}`);
                        reject(err);
                    }
                    if (rows === undefined) {
                        logger.error(`data not found on t_participate. sql = ${sql}, key = ${token}`);
                        reject(`data not found on t_participate. sql = ${sql}, key = ${token}`);
                    }

                    logger.info(`selected t_participate successed. : key = ${token}`);
                    logger.trace(rows);
                    resolve(rows);
                }));
            });

            db.close();
        });
    }

    /**
     * チャンネルマスタから情報を取得します
     * @param {string} server_id 
     * @returns Promiseオブジェクト、データベースの選択内容
     */
    get_m_server_info(server_id) {
        // Promise処理
        return new Promise((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);

            db.serialize(function () {
                // run serialize
                const sql = `${Recruitment.SQL_SELECT_m_server_info} WHERE m1.[server_id] = ? `;
                logger.info(`sql = ${sql}, server_id = ${server_id}`);
                db.get(sql, [server_id], ((err, row) => {
                    if (err) {
                        logger.error(`select m_server_info failed. please setting m_server_info. sql = ${sql}, key = ${server_id}`);
                        // return blank data
                        resolve({
                            server_id: server_id,
                            recruitment_target_role: constants.RECRUITMENT_INVALID_ROLE,
                        });
                    }
                    if (row === undefined) {
                        logger.error(`data not found on m_server_info. please setting m_server_info. sql = ${sql}, key = ${server_id}`);
                        // return blank data
                        resolve({
                            server_id: server_id,
                            recruitment_target_role: constants.RECRUITMENT_INVALID_ROLE,
                        });
                    }

                    logger.info(`selected m_server_info successed. : server_id = ${server_id}`);
                    logger.trace(row);
                    resolve(row);
                }));
            });

            db.close();
        });
    }
}