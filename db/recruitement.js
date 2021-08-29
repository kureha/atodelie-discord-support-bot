"use strict";
exports.__esModule = true;
exports.RecruitmentRepository = void 0;
// ロガーを定義
var logger_1 = require("../common/logger");
// 定数定義を読み込む
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();
// UUID有効化
var uuid = require("uuid");
var RecruitmentRepository = /** @class */ (function () {
    /**
     * インスタンス化を行い、同時に、テーブルがない場合は作成する
     * @returns {Promise} インスタンス
     */
    function RecruitmentRepository() {
        var db = this.get_db_instance(constants.SQLITE_FILE);
        logger_1.logger.info("database open successed. db = " + db);
    }
    /**
     * sqlite3のデータベースのインスタンスを取得する
     * @param {string} file_path sqlite3ファイルパス
     * @returns {Database} sqlite3データベース用インスタンス
     */
    RecruitmentRepository.prototype.get_db_instance = function (file_path) {
        // SQLite初期化
        var sqlite = require(constants.REQUIRE_NAME_SQLITE3).verbose();
        var db = new sqlite.Database(file_path);
        // インスタンス化できているかでエラーを判定する
        if (db === undefined || db === null) {
            logger_1.logger.error("database instance is undefined or null.");
            throw "database instance is undefined or null.";
        }
        else {
            // 正常時はインスタンスを返す
            return db;
        }
    };
    /**
     * 全テーブルを作成する
     * @param {Database} db sqlite3データベース用インスタンス
     */
    RecruitmentRepository.prototype.create_all_database = function (db) {
        return new Promise(function (resolve, reject) {
            db.serialize(function () {
                // run serialize
                db.run(RecruitmentRepository.SQL_CREATE_M_RECRUITMENT, [], (function (err) {
                    if (err) {
                        logger_1.logger.error("sql exception occured when create table. sql = " + RecruitmentRepository.SQL_CREATE_M_RECRUITMENT);
                        reject(err);
                    }
                    // 全SQL処理後に完了とする
                    resolve();
                }));
            });
            db.close();
        });
    };
    /**
     * UUIDのTokenを取得します
     * @returns {string} UUIDベースのToken
     */
    RecruitmentRepository.create_uuid_token = function () {
        return uuid.v4();
    };
    /**
     * 募集マスタを1行追加します
     * @param {Recruitment} data
     * @returns {Promise}
     */
    RecruitmentRepository.prototype.insert_m_recruitment = function (data) {
        var _this = this;
        // Promise処理
        return new Promise(function (resolve, reject) {
            var db = _this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                var sql = "" + RecruitmentRepository.SQL_INSERT_M_RECRUITMENT;
                logger_1.logger.info("sql = " + sql + ", id = " + data.id + ", token = " + data.token);
                var stmt = db.prepare(sql);
                stmt.run({
                    $id: data.id,
                    $server_id: data.server_id,
                    $token: data.token,
                    $status: data.status,
                    $limit_time: data.limit_time,
                    $name: data.name,
                    $owner_id: data.owner_id,
                    $description: data.description
                }, function (err) {
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
    };
    /**
     * 募集マスタを更新します
     * @param {Recruitment} data
     * @returns {Promise}
     */
    RecruitmentRepository.prototype.update_m_recruitment = function (data) {
        var _this = this;
        // Promise処理
        return new Promise(function (resolve, reject) {
            var db = _this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                var sql = RecruitmentRepository.SQL_UPDATE_M_RECRUITMENT + " WHERE [token] = $token and [delete] = false and datetime([limit_time], 'localtime') >= datetime('now', 'localtime') ";
                logger_1.logger.info("sql = " + sql + ", token = " + data.token);
                var stmt = db.prepare(sql);
                stmt.run({
                    $server_id: data.server_id,
                    $token: data.token,
                    $status: data.status,
                    $limit_time: data.limit_time,
                    $name: data.name,
                    $owner_id: data.owner_id,
                    $description: data.description,
                    $delete: data["delete"]
                }, function (err) {
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
    };
    /**
     * 募集マスタを削除します
     * @param {string} token
     * @returns {Promise}
     */
    RecruitmentRepository.prototype.delete_m_recruitment = function (token) {
        var _this = this;
        // Promise処理
        return new Promise(function (resolve, reject) {
            var db = _this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                var sql = RecruitmentRepository.SQL_DELETE_M_RECRUITMENT + " WHERE [token] = $token and [delete] = false and datetime([limit_time], 'localtime') >= datetime('now', 'localtime') ";
                logger_1.logger.info("sql = " + sql + ", token = " + token);
                var stmt = db.prepare(sql);
                stmt.run({
                    $token: token
                }, function (err) {
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
    };
    /**
     * 募集マスタ用のIDを選択します
     * @returns {int} Promiseオブジェクト、データベースの選択内容
     */
    RecruitmentRepository.prototype.get_m_recruitment_id = function () {
        var _this = this;
        // Promise処理
        return new Promise(function (resolve, reject) {
            var db = _this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                var sql = "" + RecruitmentRepository.SQL_SELECT_M_RECRUITMENT_MAX_ID;
                logger_1.logger.info("sql = " + sql);
                db.get(sql, [], (function (err, row) {
                    if (err) {
                        logger_1.logger.error("sql exception occured when create table. sql = " + RecruitmentRepository.SQL_CREATE_M_RECRUITMENT);
                        reject(err);
                    }
                    logger_1.logger.info("selected max m_reqruitement id successed. : result = " + row.id);
                    resolve(row.id);
                }));
            });
            db.close();
        });
    };
    /**
     * 募集フォロー対象の一覧を取得します
     * @param {string} server_id
     * @param {string} from_datetime
     * @param {string} to_datetime
     * @returns {Promise<Recruitment[]>} 対象の募集マスタデータ
     */
    RecruitmentRepository.prototype.get_m_recruitment_for_follow = function (server_id, from_datetime, to_datetime) {
        var _this = this;
        // Promise処理
        return new Promise(function (resolve, reject) {
            var db = _this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                var sql = RecruitmentRepository.SQL_SELECT_M_RECRUITMENT + " WHERE m1.[server_id] = $server_id AND datetime(m1.[limit_time], 'utc') > datetime($from_datetime) AND datetime(m1.[limit_time], 'utc') <= datetime($to_datetime) ORDER BY m1.[limit_time], m1.[id]";
                logger_1.logger.info("sql = " + sql + ", server_id = " + server_id + ", from_time = " + from_datetime + ", to_datetime = " + to_datetime);
                db.all(sql, {
                    $server_id: server_id,
                    $from_datetime: from_datetime,
                    $to_datetime: to_datetime
                }, (function (err, rows) {
                    if (err) {
                        logger_1.logger.error("sql exception occured when create table. sql = " + RecruitmentRepository.SQL_CREATE_M_RECRUITMENT);
                        reject(err);
                    }
                    logger_1.logger.info("selected m_reqruitement followup list successed.");
                    logger_1.logger.trace(rows);
                    resolve(rows);
                }));
            });
            db.close();
        });
    };
    /**
     * 募集マスタ用のTOKENを生成します。
     * 生成値がかぶっていた場合にRejectするため、呼び出し時にRetry処理が必要です
     * @returns {string} TOKEN
     */
    RecruitmentRepository.prototype.get_m_recruitment_token = function () {
        var _this = this;
        // Promise処理
        return new Promise(function (resolve, reject) {
            var db = _this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get sample token
                var token = RecruitmentRepository.create_uuid_token();
                logger_1.logger.debug("token : " + token);
                // run serialize
                var sql = RecruitmentRepository.SQL_SELECT_M_RECRUITMENT_TOKEN_COUNT + " ";
                logger_1.logger.info("sql = " + sql);
                db.get(sql, {
                    $token: token
                }, (function (err, row) {
                    if (err) {
                        logger_1.logger.error("sql exception occured when select token count. sql = " + RecruitmentRepository.SQL_SELECT_M_RECRUITMENT_TOKEN_COUNT);
                        reject(err);
                    }
                    if (row.count === 0) {
                        logger_1.logger.info("generate unique token id successed. : result = " + token);
                        resolve(token);
                    }
                    else {
                        logger_1.logger.info("generated token is not unique, rejected.");
                        reject("generated token is not unique, rejected.");
                    }
                }));
            });
            db.close();
        });
    };
    /**
     * 募集マスタを1行選択します
     * @param {string} token
     * @returns {Promise<Recruitment>} Promiseオブジェクト、データベースの選択内容
     */
    RecruitmentRepository.prototype.get_m_recruitment = function (token) {
        var _this = this;
        // Promise処理
        return new Promise(function (resolve, reject) {
            var db = _this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                var sql = RecruitmentRepository.SQL_SELECT_M_RECRUITMENT + " WHERE m1.[token] = ? and m1.[delete] = false and datetime(m1.[limit_time] , 'localtime') >= datetime('now', 'localtime') ";
                logger_1.logger.info("sql = " + sql + ", token = " + token);
                db.get(sql, [token], (function (err, row) {
                    if (err) {
                        logger_1.logger.error("select m_recruitment failed. sql = " + sql + ", key = " + token);
                        reject(err);
                    }
                    else if (row === undefined) {
                        logger_1.logger.error("data not found on m_recruitment. sql = " + sql + ", key = " + token);
                        reject("data not found on m_recruitment. sql = " + sql + ", key = " + token);
                    }
                    else {
                        logger_1.logger.info("selected single m_reqruitement successed. : key = " + token);
                        logger_1.logger.trace(row);
                        resolve(row);
                    }
                }));
            });
            db.close();
        });
    };
    /**
     * 募集マスタを指定行選択します
     * @param {string} server_id
     * @returns {Promise<Recruitment[]>} Promiseオブジェクト、データベースの選択内容
     */
    RecruitmentRepository.prototype.get_m_recruitment_latests = function (server_id, count) {
        var _this = this;
        // Promise処理
        return new Promise(function (resolve, reject) {
            var db = _this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                var sql = RecruitmentRepository.SQL_SELECT_M_RECRUITMENT + " WHERE [server_id] = ? AND datetime(m1.[limit_time], 'localtime') > datetime('now', 'localtime') ORDER BY m1.[limit_time], m1.[id] LIMIT " + count;
                logger_1.logger.info("sql = " + sql + ", token = " + server_id);
                db.all(sql, [server_id], (function (err, rows) {
                    if (err) {
                        logger_1.logger.error("select m_recruitment failed. sql = " + sql + ", key = " + server_id);
                        reject(err);
                    }
                    else if (rows === undefined) {
                        logger_1.logger.error("data not found on m_recruitment. sql = " + sql + ", key = " + server_id);
                        reject("data not found on m_recruitment. sql = " + sql + ", key = " + server_id);
                    }
                    else {
                        logger_1.logger.info("selected single m_reqruitement successed. : key = " + server_id);
                        logger_1.logger.trace(rows);
                        resolve(rows);
                    }
                }));
            });
            db.close();
        });
    };
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
    return RecruitmentRepository;
}());
exports.RecruitmentRepository = RecruitmentRepository;
