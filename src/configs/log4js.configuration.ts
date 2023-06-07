// use path
import * as path from "path";

// log output directory is ${APP_ROOT}/logs/
const APP_ROOT = path.join(__dirname, "../../");

// configuration section
export const configuration = {
    appenders: {
        console: {
            type: "console"
        },
        // ADD
        error: {
            type: "file",
            filename: path.join(APP_ROOT, "./logs/error.log"),
            maxLogSize: 5000000, // 5MB
            backups: 5 // Max 5 backup files
        }
    },
    categories: {
        default: {
            // console and file
            appenders: ["console", "error"],
            // output level over info
            level: "trace"
        }
    }
}