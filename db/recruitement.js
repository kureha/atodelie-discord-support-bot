"use strict";
exports.__esModule = true;
exports.RecruitmentRepository = void 0;
// define logger
var logger_1 = require("../common/logger");
// import constants
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();
// import entities
var recruitment_1 = require("../entity/recruitment");
// UUID有効化
var uuid = require("uuid");
var RecruitmentRepository = /** @class */ (function () {
    /**
     * constructor
     * @constructor
     */
    function RecruitmentRepository() {
        var db = this.get_db_instance(constants.SQLITE_FILE);
        logger_1.logger.info("database open successed. db = " + db);
    }
    /**
     * get sqlite3 database instance
     * @param file_path sqlite3 file path
     * @returns sqlite3 database instance
     */
    RecruitmentRepository.prototype.get_db_instance = function (file_path) {
        // initialize SQLite instance
        var sqlite = require(constants.REQUIRE_NAME_SQLITE3).verbose();
        var db = new sqlite.Database(file_path);
        // detect SQLite error from instance
        if (db === undefined || db === null) {
            logger_1.logger.error("database instance is undefined or null.");
            throw "database instance is undefined or null.";
        }
        else {
            // return SQLite instance if status is good
            return db;
        }
    };
    /**
     * create table
     * @param db sqlite3 database instance
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
                    // resolve after all sql completed
                    resolve();
                }));
            });
            db.close();
        });
    };
    /**
     * get UUID format token
     * @returns UUID
     */
    RecruitmentRepository.create_uuid_token = function () {
        return uuid.v4();
    };
    /**
     * insert data
     * @param data
     * @returns
     */
    RecruitmentRepository.prototype.insert_m_recruitment = function (data) {
        var _this = this;
        // return promise
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
                    $message_id: data.message_id,
                    $thread_id: data.thread_id,
                    $token: data.token,
                    $status: data.status,
                    $limit_time: data.limit_time.toISOString(),
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
     * update data
     * @param data
     * @returns
     */
    RecruitmentRepository.prototype.update_m_recruitment = function (data) {
        var _this = this;
        // return promise
        return new Promise(function (resolve, reject) {
            var db = _this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                var sql = RecruitmentRepository.SQL_UPDATE_M_RECRUITMENT + " WHERE [token] = $token and [delete] = false and datetime([limit_time], 'localtime') >= datetime('now', 'localtime') ";
                logger_1.logger.info("sql = " + sql + ", token = " + data.token);
                var stmt = db.prepare(sql);
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
     * delete data
     * @param token
     * @returns
     */
    RecruitmentRepository.prototype.delete_m_recruitment = function (token) {
        var _this = this;
        // return promise
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
     * get max id for m_recruitment
     * @returns max id number
     */
    RecruitmentRepository.prototype.get_m_recruitment_id = function () {
        var _this = this;
        // return promise
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
     * get data list for follow
     * @param server_id
     * @param from_datetime
     * @param to_datetime
     * @returns follow up data list
     */
    RecruitmentRepository.prototype.get_m_recruitment_for_follow = function (server_id, from_datetime, to_datetime) {
        var _this = this;
        // return promise
        return new Promise(function (resolve, reject) {
            var db = _this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                var sql = RecruitmentRepository.SQL_SELECT_M_RECRUITMENT + " WHERE m1.[server_id] = $server_id AND datetime(m1.[limit_time], 'utc') > datetime($from_datetime) AND datetime(m1.[limit_time], 'utc') <= datetime($to_datetime) ORDER BY m1.[limit_time], m1.[id]";
                logger_1.logger.info("sql = " + sql + ", server_id = " + server_id + ", from_time = " + from_datetime.toLocaleString() + ", to_datetime = " + to_datetime.toLocaleString());
                db.all(sql, {
                    $server_id: server_id,
                    $from_datetime: from_datetime.toISOString(),
                    $to_datetime: to_datetime.toISOString()
                }, (function (err, rows) {
                    if (err) {
                        logger_1.logger.error("sql exception occured when create table. sql = " + RecruitmentRepository.SQL_CREATE_M_RECRUITMENT);
                        reject(err);
                    }
                    // return valie list
                    var recruitment_list = [];
                    rows.forEach(function (v) {
                        recruitment_list.push(recruitment_1.Recruitment.parse_from_db(v));
                    });
                    logger_1.logger.info("selected m_reqruitement followup list successed.");
                    logger_1.logger.trace(rows);
                    resolve(recruitment_list);
                }));
            });
            db.close();
        });
    };
    /**
     * get token for m_recruitment
     * if token is already exists, this function will by reject, please retry
     * @returns token string
     */
    RecruitmentRepository.prototype.get_m_recruitment_token = function () {
        var _this = this;
        // return promise
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
     * select single data
     * @param token
     * @returns recruitment data
     */
    RecruitmentRepository.prototype.get_m_recruitment = function (token) {
        var _this = this;
        // return promise
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
                    logger_1.logger.info("selected single m_reqruitement successed. : key = " + token);
                    logger_1.logger.trace(row);
                    resolve(recruitment_1.Recruitment.parse_from_db(row));
                }));
            });
            db.close();
        });
    };
    /**
     * select data by message id and owner id
     * @param message_id message id
     * @param owner_id owner id
     * @returns recruitment data
     */
    RecruitmentRepository.prototype.get_m_recruitment_by_message_id = function (message_id, owner_id) {
        var _this = this;
        // return promise
        return new Promise(function (resolve, reject) {
            var db = _this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                var sql = RecruitmentRepository.SQL_SELECT_M_RECRUITMENT + " WHERE m1.[message_id] = ? and m1.[owner_id] = ? and m1.[delete] = false and datetime(m1.[limit_time] , 'localtime') >= datetime('now', 'localtime') ";
                logger_1.logger.info("sql = " + sql + ", message_id = " + message_id + ", owner_id = " + owner_id);
                db.get(sql, [message_id, owner_id], (function (err, row) {
                    if (err) {
                        logger_1.logger.error("select m_recruitment failed. sql = " + sql + ", message_id = " + message_id + ", owner_id = " + owner_id);
                        reject(err);
                    }
                    else if (row === undefined || row.length === 0) {
                        logger_1.logger.error("data not found on m_recruitment. sql = " + sql + ", message_id = " + message_id + ", owner_id = " + owner_id);
                        reject("data not found on m_recruitment. sql = " + sql + ", message_id = " + message_id + ", owner_id = " + owner_id);
                    }
                    logger_1.logger.info("selected single m_reqruitement successed. : message_id = " + message_id + ", owner_id = " + owner_id);
                    logger_1.logger.trace(row);
                    resolve(recruitment_1.Recruitment.parse_from_db(row));
                }));
            });
            db.close();
        });
    };
    /**
     * select data list for server
     * @param server_id server id
     * @returns recruitment data
     */
    RecruitmentRepository.prototype.get_m_recruitment_latests = function (server_id, count) {
        var _this = this;
        // return promise
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
                    else if (rows === undefined || rows === null || rows.length === 0) {
                        logger_1.logger.info("data not found on m_recruitment. sql = " + sql + ", key = " + server_id);
                        resolve([]);
                    }
                    else {
                        // return valie list
                        var recruitment_list_1 = [];
                        rows.forEach(function (v) {
                            recruitment_list_1.push(recruitment_1.Recruitment.parse_from_db(v));
                        });
                        logger_1.logger.info("selected latests m_reqruitement successed. : key = " + server_id);
                        logger_1.logger.trace(rows);
                        resolve(recruitment_list_1);
                    }
                }));
            });
            db.close();
        });
    };
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
    RecruitmentRepository.SQL_INSERT_M_RECRUITMENT = 'INSERT INTO [m_recruitment] ([id], [server_id], [message_id], [thread_id], [token], [status], [limit_time], [name], [owner_id], [description], [regist_time], [update_time], [delete]) values ($id, $server_id, $message_id, $thread_id, $token, $status, $limit_time, $name, $owner_id, $description, datetime(\'now\', \'localtime\'), datetime(\'now\', \'localtime\'), false) ';
    /**
     * update SQL
     */
    RecruitmentRepository.SQL_UPDATE_M_RECRUITMENT = 'UPDATE [m_recruitment] SET [server_id] = $server_id, [message_id] = $message_id, [thread_id] = $thread_id, [status] = $status, [limit_time] = $limit_time, [name] = $name, [owner_id] = $owner_id, [description] = $description, [update_time] = datetime(\'now\', \'localtime\'), [delete] = $delete ';
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
    RecruitmentRepository.SQL_SELECT_M_RECRUITMENT_TOKEN_COUNT = 'SELECT COUNT(*) AS [count] FROM [m_recruitment] WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= datetime(\'now\', \'localtime\') ';
    return RecruitmentRepository;
}());
exports.RecruitmentRepository = RecruitmentRepository;
