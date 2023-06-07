import * as log4js from "log4js";

// import release configuration
import { configuration } from "./../configs/log4js.configuration";

// import constants
import { Constants } from './../common/constants';
const constants = new Constants();

if (constants.DEV_MODE == true) {
    // log4js initialize with debug configuration (only console output)
    log4js.configure({
        appenders: {
            console: {
                type: "console"
            },
        },
        categories: {
            default: {
                // console and file
                appenders: ["console"],
                // output level over error
                level: "trace"
            }
        }
    });
} else {
    // log4js initialize with release configuration
    log4js.configure(configuration);
}

// export logger
export const logger = log4js.getLogger();