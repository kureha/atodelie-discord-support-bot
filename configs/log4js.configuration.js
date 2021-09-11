"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
// use path
const path_1 = __importDefault(require("path"));
// log output directory is ${APP_ROOT}/logs/
const APP_ROOT = path_1.default.join(__dirname, "../");
// configuration section
exports.configuration = {
    appenders: {
        console: {
            type: "console"
        },
        // ADD
        error: {
            type: "file",
            filename: path_1.default.join(APP_ROOT, "./logs/error.log"),
            maxLogSize: 5000000,
            backups: 5 // Max 5 backup files
        }
    },
    categories: {
        default: {
            // console and file
            appenders: ["console", "error"],
            // output level over info
            level: "info"
        }
    }
};
//# sourceMappingURL=log4js.configuration.js.map