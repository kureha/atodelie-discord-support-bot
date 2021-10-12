"use strict";
exports.__esModule = true;
exports.configuration = void 0;
// use path
var path = require("path");
// log output directory is ${APP_ROOT}/logs/
var APP_ROOT = path.join(__dirname, "../");
// configuration section
exports.configuration = {
    appenders: {
        console: {
            type: "console"
        },
        // ADD
        error: {
            type: "file",
            filename: path.join(APP_ROOT, "./logs/error.log"),
            maxLogSize: 5000000,
            backups: 5 // Max 5 backup files
        }
    },
    categories: {
        "default": {
            // console and file
            appenders: ["console", "error"],
            // output level over info
            level: "info"
        }
    }
};
