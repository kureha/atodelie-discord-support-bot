"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.InitializeRepository = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import file module
const fs = __importStar(require("fs"));
const sqlite_utils_1 = require("../logic/sqlite_utils");
class InitializeRepository {
    /**
     * check database file, copy if not exists database file
     */
    static initialize_database_if_not_exists(sqlite_file, template_file) {
        // check parameter and set default value
        if (sqlite_file == undefined) {
            sqlite_file = constants.SQLITE_FILE;
        }
        if (template_file == undefined) {
            template_file = constants.SQLITE_TEMPLATE_FILE;
        }
        if (sqlite_utils_1.SqliteUtils.check_open_database(sqlite_file) == true) {
            logger_1.logger.info(`database file exists ok. : path = ${sqlite_file}`);
        }
        else {
            logger_1.logger.info(`database file is not exists, copy file. : from = ${template_file}, to = ${sqlite_file}`);
            fs.copyFileSync(template_file, sqlite_file);
        }
    }
}
exports.InitializeRepository = InitializeRepository;
//# sourceMappingURL=initialize.js.map