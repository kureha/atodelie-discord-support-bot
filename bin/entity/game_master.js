"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMaster = void 0;
// import constants
const constants_1 = require("../common/constants");
// import sqlite utils
const sqlite_utils_1 = require("../logic/sqlite_utils");
/**
 * Game info class
 */
class GameMaster {
    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.server_id = constants_1.Constants.STRING_EMPTY;
        this.game_id = constants_1.Constants.STRING_EMPTY;
        this.game_name = constants_1.Constants.STRING_EMPTY;
        this.regist_time = constants_1.Constants.get_default_date();
        this.update_time = constants_1.Constants.get_default_date();
        this.delete = false;
    }
    /**
     * convert database select data to instance
     * @param row m_game_master table single row
     * @returns game_master's instance, return blank instance if error occured
     */
    static parse_from_db(row) {
        let v = new GameMaster();
        try {
            v.server_id = sqlite_utils_1.SqliteUtils.get_value(row.server_id);
            v.game_id = sqlite_utils_1.SqliteUtils.get_value(row.game_id);
            v.game_name = sqlite_utils_1.SqliteUtils.get_value(row.game_name);
            // regist_time, update_time is nullable
            try {
                v.regist_time = new Date(row.regist_time);
            }
            catch (e) {
                v.regist_time = constants_1.Constants.get_default_date();
            }
            try {
                v.update_time = new Date(row.update_time);
            }
            catch (e) {
                v.update_time = constants_1.Constants.get_default_date();
            }
            // db delete is number, change boolean
            if (row.delete == true) {
                v.delete = true;
            }
            else {
                v.delete = false;
            }
        }
        catch (e) {
            // if error, re-create new instance
            v = new GameMaster();
        }
        return v;
    }
}
exports.GameMaster = GameMaster;
//# sourceMappingURL=game_master.js.map