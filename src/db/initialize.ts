// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import file module
import * as fs from 'fs';
import { SqliteUtils } from '../logic/sqlite_utils';

export class InitializeRepository {
    /**
     * check database file, copy if not exists database file
     */
    static initialize_database_if_not_exists(sqlite_file?: string, template_file?: string) {
        // check parameter and set default value
        if (sqlite_file == undefined) {
            sqlite_file = constants.SQLITE_FILE;
        }

        if (template_file == undefined) {
            template_file = constants.SQLITE_TEMPLATE_FILE;
        }

        if (SqliteUtils.check_open_database(sqlite_file) == true) {
            logger.info(`database file exists ok. : path = ${sqlite_file}`);
        } else {
            logger.info(`database file is not exists, copy file. : from = ${template_file}, to = ${sqlite_file}`);
            fs.copyFileSync(template_file, sqlite_file);
        }
    }
}