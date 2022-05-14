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
exports.configuration = void 0;
// use path
const path = __importStar(require("path"));
// log output directory is ${APP_ROOT}/logs/
const APP_ROOT = path.join(__dirname, "../");
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
        default: {
            // console and file
            appenders: ["console", "error"],
            // output level over info
            level: "trace"
        }
    }
};
//# sourceMappingURL=log4js.configuration.js.map