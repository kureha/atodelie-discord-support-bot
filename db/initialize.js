// create logger
var logger = require('./../common/logger');

// import constants
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();

// import file module
const fs = require('fs');

module.exports = class InitializeRepository {
    static initialize_database_if_not_exists() {
        if (fs.existsSync(constants.SQLITE_FILE)) {
            logger.info(`database file exists ok.`);
        } else {
            logger.info(`database file is not exists, copy file. : from = ${constants.SQLITE_TEMPLATE_FILE}, to = ${constants.SQLITE_FILE}`);
            fs.copyFileSync(constants.SQLITE_TEMPLATE_FILE, constants.SQLITE_FILE);
        }
    }
}