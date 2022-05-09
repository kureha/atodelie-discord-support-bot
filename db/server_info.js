"use strict";
exports.__esModule = true;
exports.ServerInfoRepository = void 0;
// define logger
var logger_1 = require("../common/logger");
// import constants
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();
// import entities
var server_info_1 = require("../entity/server_info");
var ServerInfoRepository = /** @class */ (function () {
    /**
     * constructor
     * @constructor
     */
    function ServerInfoRepository() {
        var db = this.get_db_instance(constants.SQLITE_FILE);
        logger_1.logger.info("database open successed. db = ".concat(db));
    }
    /**
     * get sqlite3 database instance
     * @param file_path sqlite3 file path
     * @returns sqlite3 database instance
     */
    ServerInfoRepository.prototype.get_db_instance = function (file_path) {
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
    ServerInfoRepository.prototype.create_all_database = function (db) {
        return new Promise(function (resolve, reject) {
            db.serialize(function () {
                // run serialize
                db.run(ServerInfoRepository.SQL_CREATE_M_SERVER_INFO, [], (function (err) {
                    if (err) {
                        logger_1.logger.error("sql exception occured when create table. sql = ".concat(ServerInfoRepository.SQL_CREATE_M_SERVER_INFO));
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
     * get data by server id
     * @param server_id
     * @returns data
     */
    ServerInfoRepository.prototype.get_m_server_info = function (server_id) {
        var _this = this;
        // return promise
        return new Promise(function (resolve, reject) {
            var db = _this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                var sql = "".concat(ServerInfoRepository.SQL_SELECT_M_SERVER_INFO, " WHERE m1.[server_id] = ? ");
                logger_1.logger.info("sql = ".concat(sql, ", server_id = ").concat(server_id));
                db.get(sql, [server_id], (function (err, row) {
                    // create error server_info data
                    var error_server_info = new server_info_1.ServerInfo();
                    // return blank data
                    error_server_info.server_id = server_id;
                    error_server_info.channel_id = constants.RECRUITMENT_INVALID_CHANNEL_ID;
                    error_server_info.recruitment_target_role = constants.RECRUITMENT_INVALID_ROLE;
                    error_server_info.follow_time = constants_1.Constants.get_default_date();
                    if (err) {
                        logger_1.logger.error("select m_server_info failed. please setting m_server_info. sql = ".concat(sql, ", key = ").concat(server_id));
                        // return blank data
                        resolve(error_server_info);
                    }
                    else if (row === undefined || row === null || row.length === 0) {
                        logger_1.logger.error("data not found on m_server_info. please setting m_server_info. sql = ".concat(sql, ", key = ").concat(server_id));
                        // return blank data
                        resolve(error_server_info);
                    }
                    else {
                        // return correct data
                        logger_1.logger.info("selected m_server_info successed. : server_id = ".concat(server_id));
                        logger_1.logger.trace(row);
                        resolve(server_info_1.ServerInfo.parse_from_db(row));
                    }
                }));
            });
            db.close();
        });
    };
    /**
     * insert data
     * @param server_info_data
     * @returns
     */
    ServerInfoRepository.prototype.insert_m_server_info = function (server_info_data) {
        var _this = this;
        // return promise
        return new Promise(function (resolve, reject) {
            var db = _this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                var sql = ServerInfoRepository.SQL_INSERT_M_SERVER_INFO;
                logger_1.logger.info("sql = ".concat(sql, ", server_id = ").concat(server_info_data.server_id, ", channel_id = ").concat(server_info_data.channel_id, ", recruitment_target_role = ").concat(server_info_data.recruitment_target_role));
                db.run(sql, {
                    $server_id: server_info_data.server_id,
                    $channel_id: server_info_data.channel_id,
                    $recruitment_target_role: server_info_data.recruitment_target_role
                }, (function (err) {
                    if (err) {
                        logger_1.logger.error("insert m_server_info failed. err = ".concat(err));
                        reject(err);
                    }
                    else {
                        logger_1.logger.info("insert m_server_info successed. : server_id = ".concat(server_info_data.server_id, ", channel_id = ").concat(server_info_data.channel_id, ", recruitment_target_role = ").concat(server_info_data.recruitment_target_role));
                        resolve();
                    }
                }));
            });
            db.close();
        });
    };
    /**
     * update data
     * @param server_info_data
     * @returns
     */
    ServerInfoRepository.prototype.update_m_server_info = function (server_info_data) {
        var _this = this;
        // return promise
        return new Promise(function (resolve, reject) {
            var db = _this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                var sql = "".concat(ServerInfoRepository.SQL_UPDATE_M_SERVER_INFO, " WHERE [server_id] = $server_id");
                logger_1.logger.info("sql = ".concat(sql, ", server_id = ").concat(server_info_data.server_id, ", channel_id = ").concat(server_info_data.channel_id, ", recruitment_target_role = ").concat(server_info_data.recruitment_target_role, ", follow_time = ").concat(server_info_data.follow_time));
                db.run(sql, {
                    $server_id: server_info_data.server_id,
                    $channel_id: server_info_data.channel_id,
                    $recruitment_target_role: server_info_data.recruitment_target_role,
                    $follow_time: server_info_data.follow_time
                }, (function (err) {
                    if (err) {
                        logger_1.logger.error("update m_server_info failed. err = ".concat(err));
                        reject(err);
                    }
                    else {
                        logger_1.logger.info("update m_server_info successed. : server_id = ".concat(server_info_data.server_id, ", channel_id = ").concat(server_info_data.channel_id, ", recruitment_target_role = ").concat(server_info_data.recruitment_target_role, ", follow_time = ").concat(server_info_data.follow_time));
                        resolve();
                    }
                }));
            });
            db.close();
        });
    };
    /**
     * update m_server follow time data
     * @param server_id
     * @param follow_time
     * @returns
     */
    ServerInfoRepository.prototype.update_m_server_info_follow_time = function (server_id, follow_time) {
        var _this = this;
        // return promise
        return new Promise(function (resolve, reject) {
            var db = _this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                var sql = "".concat(ServerInfoRepository.SQL_UPDATE_M_SERVER_INFO_FOLLOW_TIME, " WHERE server_id = $server_id");
                logger_1.logger.info("sql = ".concat(sql, ", server_id = ").concat(server_id, ", follow_time = ").concat(follow_time.toISOString()));
                db.run(sql, {
                    $server_id: server_id,
                    $follow_time: follow_time.toISOString()
                }, (function (err) {
                    if (err) {
                        logger_1.logger.error("update m_server_info failed. err = ".concat(err));
                        reject(err);
                    }
                    logger_1.logger.info("update m_server_info successed. : server_id = ".concat(server_id, ", follow_time = ").concat(follow_time.toISOString()));
                    resolve();
                }));
            });
            db.close();
        });
    };
    /**
     * delete data by server id
     * @param server_id
     * @returns
     */
    ServerInfoRepository.prototype.delete_m_server_info = function (server_id) {
        var _this = this;
        // return promise
        return new Promise(function (resolve, reject) {
            var db = _this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // run serialize
                var sql = "".concat(ServerInfoRepository.SQL_DELETE_M_SERVER_INFO, " WHERE [server_id] = $server_id");
                logger_1.logger.info("sql = ".concat(sql, ", server_id = ").concat(server_id));
                db.run(sql, {
                    $server_id: server_id
                }, (function (err) {
                    if (err) {
                        logger_1.logger.error("delete m_server_info failed. err = ".concat(err));
                        reject(err);
                    }
                    logger_1.logger.info("delete m_server_info successed. : server_id = ".concat(server_id));
                    resolve();
                }));
            });
            db.close();
        });
    };
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
    return ServerInfoRepository;
}());
exports.ServerInfoRepository = ServerInfoRepository;
