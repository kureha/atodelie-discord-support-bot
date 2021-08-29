"use strict";
exports.__esModule = true;
exports.InitializeRepository = void 0;
// ロガーを定義
var logger_1 = require("../common/logger");
// 定数定義を読み込む
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();
// import file module
var fs = require("fs");
var InitializeRepository = /** @class */ (function () {
    function InitializeRepository() {
    }
    InitializeRepository.initialize_database_if_not_exists = function () {
        if (fs.existsSync(constants.SQLITE_FILE)) {
            logger_1.logger.info("database file exists ok.");
        }
        else {
            logger_1.logger.info("database file is not exists, copy file. : from = " + constants.SQLITE_TEMPLATE_FILE + ", to = " + constants.SQLITE_FILE);
            fs.copyFileSync(constants.SQLITE_TEMPLATE_FILE, constants.SQLITE_FILE);
        }
    };
    return InitializeRepository;
}());
exports.InitializeRepository = InitializeRepository;
