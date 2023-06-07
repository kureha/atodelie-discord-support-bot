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
exports.SqliteUtils = void 0;
// import file module
const fs = __importStar(require("fs"));
class SqliteUtils {
    /**
     * check open database for file / memory.
     * @param file_path
     */
    static check_open_database(file_path) {
        if (file_path == ':memory:') {
            // if sqlite3 db is memory, return true
            return true;
        }
        else if (fs.existsSync(file_path) === true) {
            // check file path exists, return true
            return true;
        }
        else {
            // error for open database
            return false;
        }
    }
    /**
     * Get string for sqlite now datetime
     */
    static get_now() {
        return this.get_now_with_extend(undefined);
    }
    /**
     * Get string for sqlite now datetime with extend time
     * @param extend
     */
    static get_now_with_extend(extend) {
        const arr = ['\'now\'', '\'localtime\''];
        // if extend is enabled, add extend to array
        if (extend !== undefined && extend.trim().length > 0) {
            arr.push('\'' + extend + '\'');
        }
        // join and retrun
        return `datetime(${arr.join(', ')})`;
    }
    /**
     * get value from object. if undefined, throw new error.
     * @param v
     */
    static get_value(v) {
        if (v == undefined) {
            throw new Error(`value is undefined or null.`);
        }
        else {
            return v;
        }
    }
}
exports.SqliteUtils = SqliteUtils;
//# sourceMappingURL=sqlite_utils.js.map