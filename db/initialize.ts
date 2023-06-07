// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import file module
import * as fs from 'fs';

export class InitializeRepository {
    /**
     * check database file, copy if not exists database file
     */
    static initialize_database_if_not_exists() {
        if (fs.existsSync(constants.SQLITE_FILE)) {
            logger.info(`database file exists ok.`);
        } else {
            logger.info(`database file is not exists, copy file. : from = ${constants.SQLITE_TEMPLATE_FILE}, to = ${constants.SQLITE_FILE}`);
            fs.copyFileSync(constants.SQLITE_TEMPLATE_FILE, constants.SQLITE_FILE);
        }
    }
}