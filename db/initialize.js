"use strict";
exports.__esModule = true;
exports.InitializeRepository = void 0;
// define logger
var logger_1 = require("../common/logger");
// import constants
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();
// import file module
var fs = require("fs");
var InitializeRepository = /** @class */ (function () {
    function InitializeRepository() {
    }
    /**
     * check database file, copy if not exists database file
     */
    InitializeRepository.initialize_database_if_not_exists = function () {
        if (fs.existsSync(constants.SQLITE_FILE)) {
            logger_1.logger.info("database file exists ok.");
        }
        else {
            logger_1.logger.info("database file is not exists, copy file. : from = ".concat(constants.SQLITE_TEMPLATE_FILE, ", to = ").concat(constants.SQLITE_FILE));
            fs.copyFileSync(constants.SQLITE_TEMPLATE_FILE, constants.SQLITE_FILE);
        }
    };
    return InitializeRepository;
}());
exports.InitializeRepository = InitializeRepository;
